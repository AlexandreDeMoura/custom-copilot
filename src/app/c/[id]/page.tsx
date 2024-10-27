"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getMessages, createMessage } from '@/db/messages';
import { getConversation } from '@/db/conversations';
import { useState } from 'react';
import { Conversation, Message } from '../../../../supabase/types';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from '@/components/chat/ChatMessage';
import { Sidebar } from '@/components/sidebar/Sidebar';

export default function ConversationPage({ params }: { params: { id: string } }) {
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadConversation();
    }, [params.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadConversation = async () => {
        try {
            const conv = await getConversation(params.id);
            if (!conv) {
                router.push('/');
                return;
            }
            setConversation(conv);
            const msgs = await getMessages(params.id);
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

            // Create AI response
            const aiMessage = await createMessage({
                conversation_id: conversation.id,
                content: "This is a placeholder AI response",
                role: 'assistant'
            });
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleConversationClick = (conversation: Conversation) => {
        router.push(`/c/${conversation.id}`);
    };

    return (
        <div className="flex h-screen">
            <Sidebar onConversationClick={handleConversationClick} />

            {/* Main chat area - wrapped in a container */}
            <div className="flex-1 flex flex-col h-screen max-h-screen">
                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto p-4">
                    {messages.map((message, index) => (
                        <ChatMessage key={index} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="border-t p-4">
                    <div className="flex gap-2">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="flex-1"
                            rows={1}
                        />
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading || !input.trim()}
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
