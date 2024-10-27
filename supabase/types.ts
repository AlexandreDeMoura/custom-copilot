export interface Conversation {
    id: string
    name: string
    model: string
    prompt: string
    context_length: number
    temperature: number
    created_at: string
    updated_at: string | null
}

export type NewConversation = Omit<Conversation, 'id' | 'created_at' | 'updated_at'>

export interface Message {
    id: string
    conversation_id: string
    content: string
    role: 'user' | 'assistant'
    created_at: string
}

export type NewMessage = Omit<Message, 'id' | 'created_at'>
