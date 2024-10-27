import OpenAI from 'openai'
import { getProfile } from '@/db/profiles'
import { Message } from '@/types/chat/types'

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

        const openai = new OpenAI({
            apiKey: profile.openai_key
        });
        const { messages, model = 'gpt-4o', temperature = 0.7 }: {
            messages: Message[];
            model?: string;
            temperature?: number;
        } = await req.json()


        const completion = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                ...messages.map((message) => ({
                    role: message.role,
                    content: message.content
                }))
            ],
            temperature: temperature,
            stream: true
        });

        let fullResponse = '';  // Add this to collect the complete response

        const stream = new TransformStream({
            async transform(chunk, controller) {
                const content = chunk.choices[0]?.delta?.content || '';
                fullResponse += content;  // Accumulate the response
                controller.enqueue(content);
            },
        });

        // Pipe the completion to the transform stream
        const writer = stream.writable.getWriter();
        for await (const chunk of completion) {
            writer.write(chunk);
        }
        writer.close();

        // Add headers to include the full response
        return new Response(stream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Full-Response': fullResponse  // Add the full response as a header
            },
        });
    } catch (error: any) {
        return Response.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
