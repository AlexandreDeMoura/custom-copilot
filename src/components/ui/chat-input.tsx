interface ChatInputProps {
    input: string;
    onInputChange: (value: string) => void;
    onSubmit: () => void;
    isLoading?: boolean;
    placeholder?: string;
}

export function ChatInput({
    input,
    onInputChange,
    onSubmit,
    isLoading = false,
    placeholder = "Message ChatGPT",
}: ChatInputProps) {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    };

    return (
        <div className="flex items-center gap-2 py-3 px-4 rounded-full bg-foreground-300 dark:bg-foreground-dark-500">
            <input
                type="text"
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="flex-1 outline-none bg-transparent text-foreground-100 dark:text-foreground-dark-100 placeholder:text-foreground-500 dark:placeholder:text-foreground-dark-300"
            />
            <button
                onClick={onSubmit}
                disabled={isLoading}
                className="p-2 bg-foreground-400 dark:bg-foreground-dark-400 rounded-full"
            >
                <svg
                    className={`w-5 h-5 ${input.trim() ? 'stroke-white' : 'stroke-current'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
            </button>
        </div>
    );
}
