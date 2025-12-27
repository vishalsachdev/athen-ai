import AnthropicFoundry from '@anthropic-ai/foundry-sdk';
import { getSystemPrompt } from '../data/systemPrompt';

// Microsoft Foundry configuration for Claude
const apiKey = process.env.ANTHROPIC_FOUNDRY_API_KEY || '';
const resource = process.env.ANTHROPIC_FOUNDRY_RESOURCE || 'vishal-sachdev-claude-resource';
const model = process.env.ANTHROPIC_MODEL || 'claude-opus-4-5'; // Use deployment name

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Create Foundry client
function getClient(): AnthropicFoundry {
  if (!apiKey) {
    throw new Error('Anthropic Foundry API key not configured. Set ANTHROPIC_FOUNDRY_API_KEY.');
  }

  return new AnthropicFoundry({
    apiKey,
    resource,
  });
}

// Get chat completion using Foundry SDK
export async function getChatCompletion(messages: ChatMessage[]): Promise<string> {
  const client = getClient();
  const systemPrompt = getSystemPrompt();

  console.log('Calling Claude via Foundry SDK');
  console.log('Resource:', resource);
  console.log('Model/Deployment:', model);

  const response = await client.messages.create({
    model,
    max_tokens: 1500,
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  });

  console.log('Response received');

  // Extract text from response
  if (response.content && Array.isArray(response.content)) {
    const textBlock = response.content.find((block) => block.type === 'text');
    if (textBlock && textBlock.type === 'text') {
      return textBlock.text;
    }
  }

  return '';
}

// Simulated streaming - yields chunks of the full response for a typewriter effect
export async function* streamChatCompletion(
  messages: ChatMessage[]
): AsyncGenerator<string, void, unknown> {
  // Get the full response first (Foundry doesn't support true streaming)
  const fullResponse = await getChatCompletion(messages);

  // Simulate streaming by yielding chunks
  // Split into words to make it feel more natural
  const words = fullResponse.split(/(\s+)/);

  for (const word of words) {
    yield word;
  }
}
