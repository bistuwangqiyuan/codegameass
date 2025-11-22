import type { APIRoute } from 'astro';
import { evaluateCode } from '../../../lib/ai/deepseek';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { code, challenge } = await request.json();

    if (!code || !challenge) {
      return new Response(
        JSON.stringify({ error: 'Invalid request data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await evaluateCode(code, challenge);

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AI evaluation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

