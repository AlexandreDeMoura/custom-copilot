import React, {
    createContext,
    useState,
    useEffect,
    ReactNode,
    FC,
} from 'react';
import { auth, googleProvider } from './firebase';
import {
    signInWithPopup,
    signOut,
    User,
    onAuthStateChanged,
} from 'firebase/auth';
import { Conversation } from './types/types';
import axios from 'axios';

// Define the shape of the AuthContext
export interface AuthContextType {
    user: User | null;
    signIn: () => Promise<void>;
    logOut: () => Promise<void>;
    getToken: () => Promise<string | null>;
    loading: boolean;
    conversations: Conversation[];
    updateConversations: (newConversations: Conversation[]) => void;
    addConversation: (newConversation: Conversation) => void;
}

// Create the AuthContext with a default value of undefined.
// Consumers should handle the undefined case.
export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

// Define the props for AuthProvider
interface AuthProviderProps {
    children: ReactNode;
}

// AuthProvider component
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);

    // New function to fetch conversations
    const fetchConversations = async (token: string) => {
        try {
            const response = await axios.get('/api/conversations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConversations(response.data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setConversations([]);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const token = await currentUser.getIdToken();
                await fetchConversations(token);
            } else {
                setConversations([]);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Sign in with Google
    const signIn = async (): Promise<void> => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Error signing in with Google', error);
            // Optionally, you can add error handling logic here
        }
    };

    // Log out the current user
    const logOut = async (): Promise<void> => {
        try {
            await signOut(auth);
            setConversations([]);
        } catch (error) {
            console.error('Error signing out', error);
            // Optionally, you can add error handling logic here
        }
    };

    // Get the current user's ID token
    const getToken = async (): Promise<string | null> => {
        if (user) {
            return await user.getIdToken();
        }
        return null;
    };

    // Update the conversations state
    const updateConversations = (newConversations: Conversation[]): void => {
        setConversations([...newConversations]);
    };

    const addConversation = (newConversation: Conversation): void => {
        setConversations(prevConversations => [...prevConversations, newConversation]);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                signIn,
                logOut,
                getToken,
                loading,
                conversations,
                updateConversations,
                addConversation,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
