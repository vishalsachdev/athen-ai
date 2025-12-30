import OpenAI from 'openai';
import { getSystemPrompt, SerializedToolbox } from '../data/systemPrompt';

// OpenAI configuration
const apiKey = process.env.OPENAI_API_KEY || '';
const model = process.env.OPENAI_MODEL || 'gpt-5.2-chat-latest';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Create OpenAI client
function getClient(): OpenAI {
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY.');
  }

  return new OpenAI({ apiKey });
}

// Get chat completion using OpenAI API
export async function getChatCompletion(messages: ChatMessage[], toolbox?: SerializedToolbox): Promise<string> {
  const client = getClient();
  const systemPrompt = getSystemPrompt(toolbox);

  console.log('Calling OpenAI');
  console.log('Model:', model);

  const response = await client.responses.create({
    model,
    instructions: systemPrompt,
    input: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    max_output_tokens: 1500,
  });

  console.log('Response received');

  return response.output_text || '';
}

// Simulated streaming - yields chunks of the full response for a typewriter effect
export async function* streamChatCompletion(
  messages: ChatMessage[],
  toolbox?: SerializedToolbox
): AsyncGenerator<string, void, unknown> {
  // Get the full response first (typewriter-style streaming)
  const fullResponse = await getChatCompletion(messages, toolbox);

  // Simulate streaming by yielding chunks
  // Split into words to make it feel more natural
  const words = fullResponse.split(/(\s+)/);

  for (const word of words) {
    yield word;
  }
}
