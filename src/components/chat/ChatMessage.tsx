import { Message } from '../../../supabase/types'

interface ChatMessageProps {
    message: any
}

export function ChatMessage({ message }: ChatMessageProps) {
    return (
        <div
            className={`p-4 rounded-lg mb-4 max-w-[80%] ${message.role === 'user'
                ? 'bg-blue-100 dark:bg-blue-900 ml-auto'
                : 'bg-gray-100 dark:bg-gray-700'
                }`}
        >
            {message.content}
        </div>
    )
}