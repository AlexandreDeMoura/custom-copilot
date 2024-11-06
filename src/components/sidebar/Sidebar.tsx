"use client";

import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { Conversation } from '../../../supabase/types';
import { useEffect, useState } from 'react';
import { getConversations } from '@/db/conversations';
import { updateOpenAIKey } from '@/db/profiles';

interface SidebarProps {
    onConversationClick: (conversation: Conversation) => void;
}

type FormState = {
    message: string;
    status: 'error' | 'success' | 'idle';
};

export function Sidebar({ onConversationClick }: SidebarProps) {
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [formState, setFormState] = useState<FormState>({ message: '', status: 'idle' });

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await getConversations();
                setConversations(data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchConversations();
    }, []);

    const handleSubmitAPIKey = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const apiKey = formData.get('apiKey') as string;

        try {
            setFormState({ message: 'Updating API key...', status: 'idle' });
            await updateOpenAIKey(apiKey);
            setFormState({ message: 'API key updated successfully!', status: 'success' });
            form.reset();
        } catch (error) {
            console.error('Error updating OpenAI key:', error);
            setFormState({
                message: 'Failed to update API key. Please try again.',
                status: 'error'
            });
        }
    };

    return (
        <aside className="w-64 bg-background-secondary dark:bg-background-secondary-dark p-4">
            <div className="flex flex-col h-full">
                {/* Home Button */}
                <button
                    onClick={() => router.push('/')}
                    className="p-2 mb-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-foreground-100 dark:text-foreground-dark-100 flex items-center space-x-2"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Home</span>
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 mb-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-foreground-100 dark:text-foreground-dark-100"
                >
                    {theme === 'light' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                        </svg>
                    )}
                </button>

                {/* Modified API Key Form */}
                <form onSubmit={handleSubmitAPIKey} className="mb-4">
                    <input
                        type="password"
                        name="apiKey"
                        placeholder="Enter OpenAI API Key"
                        className="w-full p-2 mb-2 text-sm border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-foreground-100 dark:text-foreground-dark-100"
                    />
                    <button
                        type="submit"
                        className="w-full p-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        Update OpenAI Key
                    </button>
                    {formState.message && (
                        <p className={`mt-2 text-sm ${formState.status === 'error' ? 'text-red-500' :
                            formState.status === 'success' ? 'text-green-500' :
                                'text-gray-500'
                            }`}>
                            {formState.message}
                        </p>
                    )}
                </form>

                {/* Models Section */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                        <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                        <span className="text-foreground-100 dark:text-foreground-dark-100">ChatGPT</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                        <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                        <span className="dark:text-white">Claude</span>
                    </div>
                </div>

                {/* History Section */}
                <div className="mt-6 flex-1 overflow-y-auto">
                    <h3 className="text-sm font-semibold mb-2 text-foreground-100 dark:text-foreground-dark-100">Conversations</h3>
                    <div className="space-y-1">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                className={`p-2 hover:bg-foreground-300 dark:hover:bg-foreground-dark-500 rounded-lg cursor-pointer text-sm text-foreground-100 dark:text-foreground-dark-100 truncate`}
                                onClick={() => onConversationClick(conv)}
                            >
                                {conv.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
