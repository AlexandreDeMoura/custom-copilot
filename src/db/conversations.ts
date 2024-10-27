import { createClient } from '@supabase/supabase-js'
import { Conversation, NewConversation } from '../../supabase/types'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getConversations() {
    const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data as Conversation[]
}

export async function createConversation(conversation: NewConversation) {
    const { data, error } = await supabase
        .from('conversations')
        .insert(conversation)
        .select()
        .single()

    if (error) throw error
    return data as Conversation
}

export async function updateConversation(id: string, updates: Partial<Conversation>) {
    const { data, error } = await supabase
        .from('conversations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data as Conversation
}

export async function deleteConversation(id: string) {
    const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export async function getConversation(id: string): Promise<Conversation | null> {
    const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}