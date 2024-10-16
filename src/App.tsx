import React, { useState, useEffect, useContext, FC } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Home from './screens/Home';
import CurrentConversation from './screens/CurrentConversations';
import MessageInput from './components/MessageInput';
import { ThemeContext } from './context/ThemeContext';
import { AuthContext, AuthContextType } from './AuthContext';
import { Conversation, Message as MessageType } from './types/types';

const App: FC = () => {
  const { theme } = useContext(ThemeContext);
  const { user, getToken, loading, conversations, updateConversations, addConversation } = useContext(AuthContext) as AuthContextType;

  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  // currentConversation est une duplication de la state conversations car on pourrait ajouter une propriété à conversations "isSelected"
  const [showHome, setShowHome] = useState<boolean>(true);

  useEffect(() => {
    if (user && !loading) {
      fetchConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const fetchConversations = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.error('No token available');
        return;
      }
      const response = await axios.get<Conversation[]>('/api/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      updateConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleSubmit = async (input: string) => {
    if (input.trim()) {
      const newMessage: MessageType = { text: input, isUser: true };
      const currentTime = new Date();
      const token = await getToken();

      if (!token) {
        console.error('No token available');
        return;
      }

      if (currentConversation) {
        // Update existing conversation
        try {
          const existingConversation = conversations.find(
            (conv) => conv.id === currentConversation
          );
          if (!existingConversation) {
            console.error('Conversation not found');
            return;
          }

          const updatedMessages = [...existingConversation.messages, newMessage];
          const response = await axios.put<Conversation>(
            `/api/conversations/${currentConversation}`,
            {
              messages: updatedMessages,
              lastUpdated: currentTime,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          updateConversations(
            conversations.map((conv) =>
              conv.id === currentConversation ? response.data : conv
            )
          );
        } catch (error) {
          console.error('Error updating conversation:', error);
          return;
        }

        simulateAIResponse(currentConversation);
      } else {
        // Create a new conversation
        try {
          const response = await axios.post<Conversation>(
            '/api/conversations',
            {
              title: input.slice(0, 30),
              messages: [newMessage],
              lastUpdated: currentTime,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          addConversation(response.data);
          setCurrentConversation(response.data.id);
          simulateAIResponse(response.data.id);
        } catch (error) {
          console.error('Error creating conversation:', error);
          return;
        }
      }

      setShowHome(false);
    }
  };

  const simulateAIResponse = async (convId: string) => {
    setTimeout(async () => {
      const aiResponse: MessageType = {
        text: 'This is a simulated AI response.',
        isUser: false,
      };
      const currentTime = new Date();
      const token = await getToken();

      if (!token) {
        console.error('No token available');
        return;
      }

      try {
        const existingConversation = conversations.find(
          (conv) => conv.id === convId
        );
        if (!existingConversation) {
          console.error('Conversation not found for AI response');
          return;
        }

        const updatedMessages = [
          ...existingConversation.messages,
          aiResponse,
        ];
        const response = await axios.put<Conversation>(
          `/api/conversations/${convId}`,
          {
            messages: updatedMessages,
            lastUpdated: currentTime,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        updateConversations(
          conversations.map((conv) =>
            conv.id === convId ? response.data : conv
          )
        );
      } catch (error) {
        console.error('Error updating conversation with AI response:', error);
      }
    }, 1000);
  };

  const startNewChat = () => {
    setCurrentConversation(null);
    setShowHome(true);
  };

  const selectConversation = (id: string) => {
    setCurrentConversation(id);
    setShowHome(false);
  };

  return (
    <div
      className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
    >
      <Sidebar
        currentConversation={currentConversation}
        startNewChat={startNewChat}
        selectConversation={selectConversation}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {showHome ? (
          <Home />
        ) : (
          <CurrentConversation
            conversation={
              conversations.find((conv) => conv.id === currentConversation) ||
              undefined
            }
          />
        )}
        <MessageInput onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default App;
