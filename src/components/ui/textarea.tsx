import * as React from "react"
import clsx from "clsx"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={clsx(
                    "flex w-full rounded-lg border border-gray-200",
                    "bg-white px-3 py-2 text-sm placeholder:text-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-gray-900",
                    "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50",
                    "dark:placeholder:text-gray-400 dark:focus:ring-gray-300",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
