"use client";

import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import { getConversations, createConversation } from '@/db/conversations';
import { createMessage } from '@/db/messages';
import { Conversation } from '../../supabase/types';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar/Sidebar';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleConversationClick = (conversation: Conversation) => {
    router.push(`/c/${conversation.id}`);
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    try {
      const newConversation = {
        name: input.slice(0, 30),
        model: 'gpt-4',
        prompt: input,
        context_length: 4096,
        temperature: 0.7
      };

      const conversation = await createConversation(newConversation);

      // Create initial user message
      const userMessage = await createMessage({
        conversation_id: conversation.id,
        content: input,
        role: 'user'
      });

      // Call OpenAI API
      const response = await fetch('/api/chat/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: input }],
          model: conversation.model,
          temperature: conversation.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          aiResponse += chunk;
        }

        // Create AI message with the complete response
        await createMessage({
          conversation_id: conversation.id,
          content: aiResponse,
          role: 'assistant'
        });
      }

      // Navigate to the new conversation
      router.push(`/c/${conversation.id}`);
    } catch (error) {
      console.error('Error handling submit:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        onConversationClick={handleConversationClick}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-3xl mx-auto text-center mt-32">
            <h1 className="text-4xl font-bold mb-8 dark:text-white">What can I help with?</h1>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-white">
                Create image
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-white">
                Code
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-white">
                Make a plan
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-white">
                Analyze data
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t dark:border-gray-700 p-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 p-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Message ChatGPT"
                  className="flex-1 outline-none bg-transparent dark:text-white"
                />
                <button
                  onClick={handleSubmit}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
