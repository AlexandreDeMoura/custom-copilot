import { IconRobot } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';

interface ChatMessageProps {
    message: any
}

export function ChatMessage({ message }: ChatMessageProps) {
    return (
        <div className={clsx(
            'flex items-start gap-2 mb-4',
            message.role === 'user' && 'justify-end'
        )}>
            {message.role === 'assistant' && (
                <div className="w-6 h-6 mt-1 flex-shrink-0 translate-y-[50%]">
                    <IconRobot className="w-full h-full text-foreground-500 dark:text-foreground-dark-300" />
                </div>
            )}
            <div className={clsx(
                'p-4 max-w-[80%] text-foreground-100 dark:text-foreground-dark-100',
                message.role === 'user'
                    ? 'bg-foreground-300 dark:bg-foreground-500 rounded-3xl'
                    : ''
            )}>
                <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
        </div>
    )
}
