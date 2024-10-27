import { createClient } from '@supabase/supabase-js'
import { Message, NewMessage } from '../../supabase/types'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getMessages(conversationId: string) {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data as Message[]
}

export async function createMessage(message: NewMessage) {
    const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single()

    if (error) throw error
    return data as Message
}

