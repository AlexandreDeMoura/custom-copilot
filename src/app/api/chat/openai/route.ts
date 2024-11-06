import OpenAI from 'openai'
import { getProfile } from '@/db/profiles'
import { Message } from '@/types/chat/types'
import { systemPrompt } from '@/config/prompts'

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
        { role: "system", content: systemPrompt },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content
        }))
      ],
      temperature: temperature,
      stream: true
    });

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(content);
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
