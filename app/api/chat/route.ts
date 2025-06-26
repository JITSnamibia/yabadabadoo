import { StreamingTextResponse, streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    const result = await streamText({
      model: model,
      messages,
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1'
    });

    return new StreamingTextResponse(result.toAIStream());
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}