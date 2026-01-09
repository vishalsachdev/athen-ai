import OpenAI from 'openai';
import { getSystemPrompt, SerializedToolbox } from '../data/systemPrompt';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Create OpenAI client
function getClient(): OpenAI {
  // Read environment variables at runtime, not at module load time
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY.');
  }

  return new OpenAI({ apiKey });
}

// Get chat completion using OpenAI API
export async function getChatCompletion(messages: ChatMessage[], toolbox?: SerializedToolbox): Promise<string> {
  const client = getClient();
  const systemPrompt = getSystemPrompt(toolbox);
  // Read model at runtime
  const model = process.env.OPENAI_MODEL || 'gpt-4o';

  console.log('Calling OpenAI');
  console.log('Model:', model);

  const response = await client.chat.completions.create({
    model,
    max_tokens: 4096,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ],
    stream: false,
  });

  console.log('Response received');

  if (response.choices && response.choices.length > 0) {
    const content = response.choices[0].message?.content;
    return content || '';
  }

  return '';
}

// Streaming - yields chunks of the response for a typewriter effect
export async function* streamChatCompletion(
  messages: ChatMessage[],
  toolbox?: SerializedToolbox
): AsyncGenerator<string, void, unknown> {
  const client = getClient();
  const systemPrompt = getSystemPrompt(toolbox);
  const model = process.env.OPENAI_MODEL || 'gpt-4o';

  console.log('Streaming OpenAI response');

  const stream = await client.chat.completions.create({
    model,
    max_tokens: 4096,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}
