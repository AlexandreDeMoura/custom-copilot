import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { getProfile } from '@/db/profiles'

// Re-enable edge runtime as it's required for streaming responses
export const runtime = 'edge'

export async function POST(req: Request) {
    try {
        const profile = await getProfile()

        if (!profile?.openai_key) {
            return Response.json(
                { error: 'OpenAI API key not found' },
                { status: 400 }
            )
        }

        const { messages, model = 'gpt-4', temperature = 0.7 } = await req.json()

        const openai = new OpenAI({
            apiKey: profile.openai_key.trim()
        })

        // Create stream
        const response = await openai.chat.completions.create({
            model,
            messages,
            temperature,
            stream: true,
        })

        // Use OpenAIStream from Vercel AI SDK
        const stream = OpenAIStream(response)
        return new StreamingTextResponse(stream)
    } catch (error: any) {
        return Response.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
