"use client";

import { useState } from 'react';
import { createConversation } from '@/db/conversations';
import { createMessage } from '@/db/messages';
import { Conversation } from '../../supabase/types';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { ChatInput } from '@/components/ui/chat-input';

export default function Home() {
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
      <main className="flex-1 flex flex-col bg-background dark:bg-background-dark">
        <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-center">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-8 text-foreground-100 dark:text-foreground-dark-100">What can I help with?</h1>
          </div>

          {/* Input Area */}
          <div className="p-4">
            <div className="max-w-3xl mx-auto">
              <ChatInput
                input={input}
                onInputChange={setInput}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
