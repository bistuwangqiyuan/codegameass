import type { APIRoute } from 'astro';
import { chatWithAI, type AIMessage } from '../../../lib/ai/deepseek';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid message' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const conversationHistory: AIMessage[] = history || [];
    const response = await chatWithAI(message, conversationHistory);

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AI chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

