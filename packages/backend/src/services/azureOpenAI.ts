import { AzureOpenAI } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { getSystemPrompt } from '../data/systemPrompt';

// Azure OpenAI configuration
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
const apiKey = process.env.AZURE_OPENAI_API_KEY || '';
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-10-21';

// Initialize client
let client: AzureOpenAI | null = null;

function getClient(): AzureOpenAI {
  if (!client) {
    if (!endpoint || !apiKey) {
      throw new Error('Azure OpenAI credentials not configured. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY.');
    }
    client = new AzureOpenAI({
      endpoint,
      apiKey,
      apiVersion,
      deployment,
    });
  }
  return client;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function* streamChatCompletion(
  messages: ChatMessage[]
): AsyncGenerator<string, void, unknown> {
  const openai = getClient();

  // Prepend system prompt to messages
  const systemPrompt = getSystemPrompt();
  const fullMessages: ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ];

  const stream = await openai.chat.completions.create({
    model: deployment,
    messages: fullMessages,
    stream: true,
    temperature: 0.7,
    max_tokens: 1500,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

export async function getChatCompletion(messages: ChatMessage[]): Promise<string> {
  const openai = getClient();

  const systemPrompt = getSystemPrompt();
  const fullMessages: ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ];

  const response = await openai.chat.completions.create({
    model: deployment,
    messages: fullMessages,
    temperature: 0.7,
    max_tokens: 1500,
  });

  return response.choices[0]?.message?.content || '';
}
