import { NextRequest } from 'next/server';

const API_URL = process.env.BIBLE_API_URL ?? 'http://localhost:5000';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();

    const upstream = await fetch(`${API_URL}/api/chat`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });

    if (!upstream.ok || !upstream.body) {
      return new Response(JSON.stringify({ error: 'Upstream API error' }), {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Stream SSE directly to client
    return new Response(upstream.body, {
      status:  200,
      headers: {
        'Content-Type':  'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection':    'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Proxy error', message: (err as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
