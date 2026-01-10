import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

// Create OpenAI client
function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable not set');
  }

  return new OpenAI({ apiKey });
}

// Generate suggested responses using OpenAI
async function generateSuggestedResponses(assistantMessage: string): Promise<string[]> {
  const client = getClient();
  const model = process.env.OPENAI_MODEL || 'gpt-4o';

  const prompt = `Based on the following assistant message from a healthcare AI tool consultant, generate exactly 3 short, conversational suggested responses that a user might want to click to continue the conversation. The suggestions should be:
- Relevant to what the assistant just said
- Conversational and natural (like quick replies)
- 10-15 words maximum each
- Useful follow-up questions or responses

Assistant message:
${assistantMessage}

Generate exactly 3 suggestions, one per line, without numbers or bullets:`;

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a UX assistant that generates helpful, short suggested responses for chat interfaces. Return only the suggestions, one per line, without numbers or formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    if (response.choices && response.choices.length > 0) {
      const content = response.choices[0].message?.content || '';
      // Parse suggestions - split by newline and clean up
      const suggestions = content
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !/^\d+[\.\)]/.test(s)) // Remove numbered list markers
        .map(s => s.replace(/^[-*•]\s*/, '').trim()) // Remove bullet points
        .filter(s => s.length > 0)
        .slice(0, 3); // Ensure max 3

      return suggestions.length > 0 ? suggestions : getFallbackSuggestions(assistantMessage);
    }

    return getFallbackSuggestions(assistantMessage);
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return getFallbackSuggestions(assistantMessage);
  }
}

// Fallback suggestions if AI generation fails
function getFallbackSuggestions(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('tool') || lowerMessage.includes('recommend')) {
    return ['Tell me more about this', 'How do I get started?', 'What are the alternatives?'];
  }
  
  if (lowerMessage.includes('specialty')) {
    return ['Plastic Surgery', 'Dermatology', 'General Practice'];
  }
  
  if (lowerMessage.includes('budget') || lowerMessage.includes('cost')) {
    return ['Looking for free options', 'Budget under $100/month', 'Cost is flexible'];
  }
  
  return ['Tell me more', 'What are my options?', 'How do I get started?'];
}

// Vercel serverless function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Only POST is allowed' } });
    return;
  }

  try {
    const { assistantMessage } = req.body as { assistantMessage: string };

    if (!assistantMessage || typeof assistantMessage !== 'string') {
      res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'assistantMessage is required and must be a string',
        },
      });
      return;
    }

    const suggestions = await generateSuggestedResponses(assistantMessage);

    res.json({ suggestions });
  } catch (error) {
    console.error('Suggestions API error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
    });
  }
}
