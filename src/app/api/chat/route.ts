import { streamText, createUIMessageStreamResponse, toUIMessageStream, UI_MESSAGE_STREAM_HEADERS } from 'ai';
import { openai, createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextRequest } from 'next/server';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { messages, modelId = 'gemini-3.5-flash', conversationId } = await req.json();

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY,
    });

    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user?.id;

    // Save the user's last message if logged in
    const userMessage = messages[messages.length - 1];

    if (userId && conversationId) {
      await prisma.conversation.upsert({
        where: { id: conversationId },
        update: {},
        create: {
          id: conversationId,
          title: typeof userMessage?.content === 'string'
            ? userMessage.content
            : (userMessage?.parts?.find((p: any) => p.type === 'text')?.text ?? 'New Conversation'),
          userId,
        },
      });

      await prisma.message.create({
        data: {
          id: userMessage.id,
          conversationId,
          role: 'user',
          content: typeof userMessage?.content === 'string'
            ? userMessage.content
            : (userMessage?.parts?.find((p: any) => p.type === 'text')?.text ?? ''),
        },
      });
    }

    let model;
    if (modelId.startsWith('gpt')) {
      model = openai(modelId);
    } else if (modelId.startsWith('gemini')) {
      model = google(modelId);
    } else if (modelId.startsWith('llama3')) {
      // Groq models
      model = groq(modelId);
    } else if (modelId.includes('/')) {
      // OpenRouter models use provider/model-name format
      model = openrouter(modelId);
    } else {
      model = google('gemini-3.5-flash');
    }

    // Normalize messages to CoreMessage format
    const coreMessages = messages.map((m: any) => {
      const content = typeof m.content === 'string'
        ? m.content
        : (m.parts?.find((p: any) => p.type === 'text')?.text ?? '');
      return { role: m.role, content };
    });

    const isOpenRouter = modelId.includes('/');

    const result = streamText({
      model,
      messages: coreMessages,
      // Limit tokens for OpenRouter free-tier to avoid credit exhaustion (402 error)
      ...(isOpenRouter && { maxTokens: 2000 }),
      async onFinish({ text, usage }) {
        if (userId && conversationId) {
          await prisma.message.create({
            data: {
              conversationId,
              role: 'assistant',
              content: text,
              model: modelId,
              token: usage?.totalTokens,
            },
          });
        }
      },
    });

    // ai v7: convert fullStream to UIMessageStream then send as SSE response
    const uiStream = toUIMessageStream({ stream: result.fullStream });

    return createUIMessageStreamResponse({ stream: uiStream });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
