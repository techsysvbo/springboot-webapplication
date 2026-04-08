import OpenAI from 'openai';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function* streamChat(
  messages: Message[],
  options: LLMOptions = {}
): AsyncIterable<string> {
  const provider = process.env.LLM_PROVIDER ?? 'openai';

  if (provider === 'anthropic') {
    yield* streamAnthropic(messages, options);
  } else {
    yield* streamOpenAI(messages, options);
  }
}

async function* streamOpenAI(
  messages: Message[],
  options: LLMOptions
): AsyncIterable<string> {
  const model = options.model ?? process.env.OPENAI_MODEL ?? 'gpt-4o';
  const stream = await openai.chat.completions.create({
    model,
    messages,
    stream: true,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 1500,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}

async function* streamAnthropic(
  messages: Message[],
  options: LLMOptions
): AsyncIterable<string> {
  // Dynamic import to avoid requiring the package when not used
  interface AnthropicSDK {
    new (opts: { apiKey?: string }): {
      messages: {
        create: (opts: {
          model: string;
          max_tokens: number;
          system?: string;
          messages: Array<{ role: 'user' | 'assistant'; content: string }>;
          stream: true;
        }) => Promise<AsyncIterable<{ type: string; delta?: { type: string; text?: string } }>>;
      };
    };
  }
  let AnthropicClass: AnthropicSDK | undefined;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    AnthropicClass = (require('@anthropic-ai/sdk') as { default: AnthropicSDK }).default;
  } catch {
    console.error('Anthropic SDK not installed. Falling back to OpenAI.');
    yield* streamOpenAI(messages, options);
    return;
  }

  const client = new AnthropicClass({ apiKey: process.env.ANTHROPIC_API_KEY });
  const model = options.model ?? process.env.ANTHROPIC_MODEL ?? 'claude-3-5-sonnet-20241022';

  const systemMsg = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');

  const stream = await client.messages.create({
    model,
    max_tokens: options.maxTokens ?? 1500,
    system: systemMsg?.content,
    messages: userMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    stream: true,
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta' && event.delta.text) {
      yield event.delta.text;
    }
  }
}
