"use client";

import { useEffect, useRef } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { getMessages, createMessage, updateMessage } from '@/db/messages';
import { getConversation } from '@/db/conversations';
import { useState } from 'react';
import { Conversation, Message } from '../../../../supabase/types';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { ChatInput } from '@/components/ui/chat-input';

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params); // Unwrap the params promise
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadConversation();
    }, [resolvedParams.id]); // Update dependency

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadConversation = async () => {
        try {
            const conv = await getConversation(resolvedParams.id); // Use resolvedParams
            if (!conv) {
                router.push('/');
                return;
            }
            setConversation(conv);
            const msgs = await getMessages(resolvedParams.id); // Use resolvedParams
            setMessages(msgs);
        } catch (error) {
            console.error('Error loading conversation:', error);
            router.push('/');
        }
    };

    const handleSubmit = async () => {
        if (!input.trim() || !conversation) return;

        setIsLoading(true);
        try {
            // Create user message
            const userMessage = await createMessage({
                conversation_id: conversation.id,
                content: input,
                role: 'user'
            });
            setMessages(prev => [...prev, userMessage]);
            setInput('');

            // Create initial AI message
            const aiMessage = await createMessage({
                conversation_id: conversation.id,
                content: '',
                role: 'assistant'
            });
            setMessages(prev => [...prev, aiMessage]);

            // Stream the AI response
            const response = await fetch('/api/chat/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    model: conversation.model,
                    temperature: conversation.temperature,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch AI response');
            }

            let accumulatedContent = '';
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            while (reader) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                accumulatedContent += chunk;

                // Update the AI message in real-time
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id === aiMessage.id
                            ? { ...msg, content: accumulatedContent }
                            : msg
                    )
                );
            }

            // Update the final message in the database
            await updateMessage(aiMessage.id, { content: accumulatedContent });

        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConversationClick = (conversation: Conversation) => {
        router.push(`/c/${conversation.id}`);
    };

    return (
        <div className="flex h-screen">
            <Sidebar onConversationClick={handleConversationClick} />

            {/* Centering container */}
            <div className="flex-1 flex justify-center bg-background dark:bg-background-dark">
                {/* Main chat area - constrained to 70% width */}
                <div className="w-[70%] flex flex-col h-screen max-h-screen">
                    {/* Chat messages */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {messages.map((message, index) => (
                            <ChatMessage key={index} message={message} />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <div className="border-t p-4">
                        <ChatInput
                            input={input}
                            onInputChange={setInput}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
