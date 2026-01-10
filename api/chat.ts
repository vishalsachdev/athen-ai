import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

// Types
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ToolboxItem {
  id: string;
  name: string;
  category: string;
  stage: string;
  guide?: {
    overview: string;
    timeEstimate: string;
    prerequisites: string[];
    steps: { title: string; content: string }[];
    tips: string[];
  };
}

interface SerializedToolbox {
  tools: ToolboxItem[];
  stages: {
    scheduling: string | null;
    intake: string | null;
    documentation: string | null;
    communication: string | null;
    billing: string | null;
  };
}

interface ChatRequestBody {
  messages: ChatMessage[];
  toolbox?: SerializedToolbox;
}

// Healthcare AI tools database
const tools = [
  // === SCRIBES ===
  {
    id: 'freed-ai',
    name: 'Freed AI',
    category: 'AI Scribe',
    description: "AI medical scribe that listens to patient encounters and auto-generates clinical notes. Adapts to each clinician's style.",
    website: 'https://www.getfreed.ai/',
    hipaaCompliant: true,
    pricing: 'Freemium; paid plans ~$99/month',
    bestFor: 'Clinics with 2-50 clinicians',
    keyFeatures: ['No patient recording storage', 'Works on any device', 'Sets up in minutes', 'Customizable templates'],
    hasGuide: true,
  },
  {
    id: 'scribeberry',
    name: 'Scribeberry',
    category: 'AI Scribe',
    description: 'AI scribe with 99.9% accuracy that auto-generates structured notes for any EMR. Also includes patient intake agents.',
    website: 'https://www.scribeberry.com/',
    hipaaCompliant: true,
    pricing: 'Subscription-based',
    bestFor: 'Practices wanting high accuracy',
    keyFeatures: ['99.9% accuracy claim', 'Works with all EMRs', 'Patient intake agents included', 'Auto-fill forms'],
    hasGuide: false,
  },
  {
    id: 'doximity-scribe',
    name: 'Doximity Scribe',
    category: 'AI Scribe',
    description: 'Free AI clinical documentation tool from Doximity. Processes recordings in real-time and immediately discards audio.',
    website: 'https://blog.doximity.com/articles/meet-doximity-scribe',
    hipaaCompliant: true,
    pricing: 'FREE for all U.S. physicians, NPs, PAs, medical students',
    bestFor: 'Any physician with a Doximity account',
    keyFeatures: ['Completely free', 'No audio storage', 'Real-time processing', 'BAA included'],
    hasGuide: true,
  },
  // === INTAKE ===
  {
    id: 'intakeq',
    name: 'IntakeQ',
    category: 'Patient Intake',
    description: 'Healthcare-first intake forms with conditional logic, e-signatures, and EHR integration. HIPAA compliant by design.',
    website: 'https://intakeq.com/',
    hipaaCompliant: true,
    pricing: 'Starting ~$29/month',
    bestFor: 'Any healthcare practice needing custom intake workflows',
    keyFeatures: ['Drag-and-drop form builder', 'Conditional logic', 'E-signatures', 'EHR integration', 'Automated reminders'],
    hasGuide: true,
  },
  {
    id: 'jotform',
    name: 'Jotform (Healthcare)',
    category: 'Patient Intake',
    description: 'AI form generator + chatbot builder with HIPAA compliance option. 10,000+ templates available.',
    website: 'https://www.jotform.com/',
    hipaaCompliant: true,
    pricing: 'Free tier; paid from ~$34/month; 50% healthcare discount',
    bestFor: 'Practices wanting AI-generated forms',
    keyFeatures: ['AI form generation', '10,000+ templates', 'Chatbot agents', 'HIPAA compliance on higher tiers'],
    hasGuide: false,
  },
  {
    id: 'infermedica',
    name: 'Infermedica Intake',
    category: 'Patient Intake',
    description: 'AI-powered symptom collection and pre-visit intake. Intelligent algorithms ensure comprehensive symptom capture.',
    website: 'https://infermedica.com/solutions/intake',
    hipaaCompliant: true,
    pricing: 'Enterprise pricing',
    bestFor: 'Practices wanting clinical-grade AI triage',
    keyFeatures: ['Intelligent symptom collection', 'Reduces visit times', 'Clinical decision support', 'Pre-visit triage'],
    hasGuide: false,
  },
  // === CHATBOTS ===
  {
    id: 'kommunicate',
    name: 'Kommunicate',
    category: 'Chatbot',
    description: 'AI chatbot builder that can be trained on your own documents. Includes bot-to-human handoff.',
    website: 'https://www.kommunicate.io/',
    hipaaCompliant: true,
    pricing: 'Starting ~$100/month',
    bestFor: 'Practices wanting custom FAQ bots',
    keyFeatures: ['Train on your documents', 'Custom branding', 'Bot-to-human handoff', 'Live agent dashboard'],
    hasGuide: false,
  },
  {
    id: 'bastiongpt',
    name: 'BastionGPT',
    category: 'Chatbot',
    description: 'HIPAA-compliant ChatGPT for healthcare. Secure version where data is not accessible to OpenAI or used for training.',
    website: 'https://bastiongpt.com/',
    hipaaCompliant: true,
    pricing: 'Subscription-based',
    bestFor: 'Practices wanting ChatGPT capabilities with PHI safety',
    keyFeatures: ['Exceeds HIPAA requirements', 'Data not used for OpenAI training', 'Full GPT-4 capabilities', 'Document analysis'],
    hasGuide: false,
  },
  // === SCHEDULING ===
  {
    id: 'nexhealth',
    name: 'NexHealth',
    category: 'Scheduling',
    description: 'Patient experience platform with smart scheduling, automated reminders, and reviews management.',
    website: 'https://www.nexhealth.com/',
    hipaaCompliant: true,
    pricing: 'Contact for pricing',
    bestFor: 'Dental, medical, and specialty practices',
    keyFeatures: ['Online booking', 'Automated reminders', 'Waitlist management', 'EHR sync', 'Review management'],
    hasGuide: false,
  },
  {
    id: 'emitrr',
    name: 'Emitrr',
    category: 'Scheduling',
    description: 'AI-powered scheduling with VoIP, automated reminders, and patient communication all-in-one.',
    website: 'https://emitrr.com/',
    hipaaCompliant: true,
    pricing: 'Affordable for small practices',
    bestFor: 'Small to medium practices wanting all-in-one communication',
    keyFeatures: ['AI chatbot', 'Appointment scheduling', 'Two-way texting', 'VoIP calling', 'Automated reminders'],
    hasGuide: false,
  },
  // === BILLING ===
  {
    id: 'medical-coding-ai',
    name: 'Medical Coding AI',
    category: 'Billing & Coding',
    description: 'GPT-based tool that translates medical reports into ICD-10, CPT, and HCPCS billing codes.',
    website: 'https://theresanaiforthat.com/gpt/medical-coding-ai/',
    hipaaCompliant: false,
    pricing: 'Requires ChatGPT Plus (~$20/month)',
    bestFor: 'Quick coding assistance (use with BastionGPT for HIPAA compliance)',
    keyFeatures: ['ICD-10 code lookup', 'CPT code suggestions', 'HCPCS support', 'Medical report analysis'],
    hasGuide: false,
  },
  // === SPECIALTY: PLASTIC SURGERY ===
  {
    id: 'touchmd',
    name: 'TouchMD',
    category: 'Plastic Surgery',
    description: 'Consultation app with before/after simulation and patient education for plastic surgeons and aestheticians.',
    website: 'https://www.touchmd.com/',
    hipaaCompliant: true,
    pricing: 'Contact for pricing',
    bestFor: 'Plastic surgeons, cosmetic practices',
    keyFeatures: ['iPad-based consultations', 'Procedure visualization', 'Before/after simulation', 'Consent management'],
    hasGuide: false,
  },
  {
    id: 'aesthetix-crm',
    name: 'Aesthetix CRM',
    category: 'Plastic Surgery',
    description: 'CRM for plastic surgeons with AI-powered lead management, intake automation, and marketing tools.',
    website: 'https://aesthetixcrm.com/',
    hipaaCompliant: true,
    pricing: 'Contact for pricing',
    bestFor: 'Cosmetic surgery, dermatology, medical spas',
    keyFeatures: ['AI lead management', 'Intake automation', 'Marketing tools', 'EMR integrations'],
    hasGuide: false,
  },
  // === SPECIALTY: DERMATOLOGY ===
  {
    id: 'miiskin',
    name: 'Miiskin',
    category: 'Dermatology',
    description: 'AI skin lesion analysis with patient photo documentation and change tracking over time.',
    website: 'https://miiskin.com/',
    hipaaCompliant: true,
    pricing: 'Contact for pricing',
    bestFor: 'Dermatology practices',
    keyFeatures: ['AI lesion detection', 'Patient photo documentation', 'Change tracking over time', 'Teledermatology support'],
    hasGuide: false,
  },
  {
    id: 'fotofinder',
    name: 'FotoFinder',
    category: 'Dermatology',
    description: 'Clinical-grade total body mapping and AI lesion detection. Moleanalyzer pro validated at Heidelberg University.',
    website: 'https://www.fotofinder.de/en/',
    hipaaCompliant: true,
    pricing: 'Enterprise pricing',
    bestFor: 'Dermatology practices needing clinical-grade imaging',
    keyFeatures: ['Total body mapping', 'Moleanalyzer pro AI', 'Dermoscopy integration', 'Validated performance'],
    hasGuide: false,
  },
];

// Generate toolbox context section for system prompt
function generateToolboxContext(toolbox: SerializedToolbox): string {
  if (toolbox.tools.length === 0) {
    return '';
  }

  let context = `\n\n## User's AI Toolbox (IMPORTANT CONTEXT)

The user has selected the following tools for their toolbox. You have their setup guides available and should help them understand how to configure and integrate these tools together.

### Selected Tools:\n`;

  for (const tool of toolbox.tools) {
    context += `\n#### ${tool.name} (${tool.stage} stage)
- Category: ${tool.category}`;

    if (tool.guide) {
      context += `
- Overview: ${tool.guide.overview}
- Setup Time: ${tool.guide.timeEstimate}
- Prerequisites: ${tool.guide.prerequisites.join(', ')}

**Setup Steps:**
${tool.guide.steps.map((s, i) => `${i + 1}. ${s.title}`).join('\n')}

**Pro Tips:**
${tool.guide.tips.map(t => `- ${t}`).join('\n')}
`;
    }
    context += '\n';
  }

  context += `
### How to Help with Their Toolbox

1. **Integration guidance**: Help the user understand how their selected tools work together
2. **Setup assistance**: Reference the setup guides above when helping them configure tools
3. **Toolbox optimization**: Suggest how to organize their tools for the best clinical workflow
4. **Fill gaps**: If you notice missing toolbox stages, suggest tools to complete their collection
5. **Troubleshooting**: Use the setup steps and tips to help troubleshoot issues

When the user asks about their toolbox or how to set up their tools, reference this context directly.`;

  return context;
}

// System prompt
function getSystemPrompt(toolbox?: SerializedToolbox): string {
  const toolsJson = JSON.stringify(tools, null, 2);
  const toolboxContext = toolbox ? generateToolboxContext(toolbox) : '';

  // Build prompt using string concatenation to avoid transpilation issues with large template literals
  const promptParts: string[] = [];
  
  promptParts.push('You are Athen AI, a healthcare AI consultant helping small clinics and private practices find the right AI tools for their toolbox.\n\n');
  promptParts.push('## Your Knowledge Base\n');
  promptParts.push('Here are the healthcare AI tools you know about:\n\n');
  promptParts.push(toolsJson);
  promptParts.push('\n\n## How to Help Users\n\n');
  promptParts.push('1. **Jump to recommendations quickly**: If the user describes a clear problem, recommend tools right away. Don\'t ask multiple questions upfront.\n\n');
  promptParts.push('2. **CRITICAL: Ask ONE question at a time**: If you need clarification, ask ONLY ONE question per response. Wait for the user\'s answer before asking another. NEVER ask multiple questions in the same response. Never create numbered lists of questions.\n\n');
  promptParts.push('3. **Recommend specific tools**: When recommending tools, use the special TOOL RECOMMENDATION format (see below)\n\n');
  promptParts.push('4. **Be honest about limitations**:\n');
  promptParts.push('   - Only recommend tools from your knowledge base\n');
  promptParts.push('   - Don\'t make up features or pricing\n');
  promptParts.push('   - If a tool might not be HIPAA compliant, clearly warn them\n\n');
  promptParts.push('## CRITICAL: Tool Recommendation Format\n\n');
  promptParts.push('When recommending a tool, you MUST:\n');
  promptParts.push('1. Naturally mention the tool name in your response text\n');
  promptParts.push('2. Describe the tool\'s benefits and why it fits their needs\n');
  promptParts.push('3. Include the special marker format: [[TOOL:tool-id]] right after mentioning the tool name\n\n');
  promptParts.push('The [[TOOL:tool-id]] marker will automatically add the tool to a "Suggested Tools" tab on the right side of the interface. Do NOT create section headers like "Best free option:" or "More features if you need them:" - just naturally incorporate tool mentions into your conversational response.\n\n');
  promptParts.push('For example, instead of:\n');
  promptParts.push('"**Best free option:**\\n\\n[[TOOL:doximity-scribe]]"\n\n');
  promptParts.push('Write naturally:\n');
  promptParts.push('"Doximity Scribe [[TOOL:doximity-scribe]] is completely free and works great for most physicians. It processes recordings in real-time and immediately discards audio, so you don\'t have to worry about data storage..."\n\n');
  promptParts.push('The tool-id must exactly match one of these IDs from your knowledge base:\n');
  promptParts.push('freed-ai, scribeberry, doximity-scribe, intakeq, jotform, infermedica, kommunicate, bastiongpt, nexhealth, emitrr, medical-coding-ai, touchmd, aesthetix-crm, miiskin, fotofinder\n\n');
  promptParts.push('## Response Style\n\n');
  promptParts.push('- **Be conversational and detailed**: Since tool cards no longer take up space in the chat, you can be more verbose and descriptive\n');
  promptParts.push('- **Naturally mention tools**: Don\'t use headers or sections to introduce tools - just mention them naturally in your explanation\n');
  promptParts.push('- **Describe why each tool fits**: Explain the benefits, use cases, and how it addresses their specific needs\n');
  promptParts.push('- **Use line breaks liberally** - separate paragraphs with blank lines for readability\n');
  promptParts.push('- Ask AT MOST one follow-up question per response, and only if truly needed - wait for their answer before asking another\n');
  promptParts.push('- Be friendly and professional\n\n');
  promptParts.push('## CRITICAL: Formatting Rules\n\n');
  promptParts.push('Your response MUST be well-formatted with proper spacing:\n');
  promptParts.push('- Place the [[TOOL:id]] marker immediately after the tool name when you first mention it\n');
  promptParts.push('- Put blank lines between different paragraphs for readability\n');
  promptParts.push('- Paragraphs can be 3-5 sentences now that we have more space\n');
  promptParts.push('- Use line breaks to create visual breathing room\n');
  promptParts.push('- **ABSOLUTELY CRITICAL: For ANY numbered list, the content MUST be on the SAME LINE as the number**\n');
  promptParts.push('  - CORRECT: `1. **First item** - description here`\n');
  promptParts.push('  - CORRECT: `2. Second item with text immediately following`\n');
  promptParts.push('  - WRONG: `1.\\n\\n**First item** - description` (newline after number)\n');
  promptParts.push('  - WRONG: `1. \\n**First item**` (newline after period)\n');
  promptParts.push('  - If you use numbered lists, write them as: `1. Content 2. Content 3. Content` all on single lines per item\n');
  promptParts.push('- **NEVER create numbered lists of questions** - ask only one question at a time, conversationally\n');
  promptParts.push('- **NEVER put a line break after a number and period** - always put a space and the content immediately\n\n');
  promptParts.push('## Example Response\n\n');
  promptParts.push('For a user who says "I spend too much time on documentation":\n\n');
  promptParts.push('"Documentation is one of the biggest time sinks for clinicians, and there are some excellent AI tools that can help streamline this process.\\n\\n');
  promptParts.push('If you\'re looking for a free option, Doximity Scribe [[TOOL:doximity-scribe]] is completely free for all U.S. physicians and processes recordings in real-time. It immediately discards audio after processing, so you don\'t have to worry about data storage. It sets up in just 5-10 minutes if you already have a Doximity account.\\n\\n');
  promptParts.push('For more advanced features, Freed AI [[TOOL:freed-ai]] adapts to your specific documentation style and works on any device. It\'s designed to set up in minutes without IT support, and it doesn\'t store patient recordings. While it has a freemium model, many clinicians find the paid features worth it for the customization options.\\n\\n');
  promptParts.push('What specialty are you in? I can help you determine which option might work best for your specific practice needs."\n\n');
  promptParts.push('## What NOT to Do\n\n');
  promptParts.push('- **NEVER ask multiple questions at once** - only one question per response, wait for their answer\n');
  promptParts.push('- **NEVER create numbered lists of questions** - ask questions conversationally, one at a time\n');
  promptParts.push('- **NEVER put a newline after a number in a numbered list** - always write "1. Text" on one line, never "1.\\nText" or "1. \\nText"\n');
  promptParts.push('- **NEVER format numbered lists with content on a separate line** - this creates visual spacing issues\n');
  promptParts.push('- Don\'t recommend tools not in your knowledge base\n');
  promptParts.push('- Don\'t make up pricing, features, or compliance status\n');
  promptParts.push('- Don\'t provide medical advice - you help with tools, not clinical decisions\n');
  promptParts.push('- Don\'t use section headers like "Best free option:" or "More features:" - just mention tools naturally in your text\n');
  promptParts.push('- Don\'t create separate sections for each tool - weave them naturally into your explanation\n');
  promptParts.push('- Don\'t use excessive emojis or informal language\n');
  promptParts.push('- Don\'t forget to use the [[TOOL:id]] format when recommending tools - place it right after the tool name\n');
  promptParts.push('- Don\'t use horizontal rules (---) or markdown dividers - use blank lines instead\n');
  promptParts.push('- Don\'t be afraid to be more detailed and descriptive - you have more space now that tool cards are in a separate tab\n\n');
  promptParts.push('## Example: Conversational Question Format\n\n');
  promptParts.push('**BAD (Never do this):**\n');
  promptParts.push('"Here are a few questions to consider:\n');
  promptParts.push('1. **Toolbox Improvements**: Are there specific processes...\n');
  promptParts.push('2. **Specialty Needs**: Does your medical specialty...\n');
  promptParts.push('3. **Patient Interaction**: Are you looking to enhance..."\n\n');
  promptParts.push('**GOOD (Do this instead):**\n');
  promptParts.push('"To help you find the right tools, I\'d like to understand your practice better. What specific challenges are you facing? Are there particular processes like documentation, patient intake, or scheduling that consume a lot of your time?"\n\n');
  promptParts.push('Then wait for their response before asking any follow-up questions.');
  
  if (toolboxContext) {
    promptParts.push(toolboxContext);
  }
  
  return promptParts.join('');
}

// Create OpenAI client
function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable not set');
  }

  return new OpenAI({ apiKey });
}

// Stream chat completion using OpenAI API
async function* streamChatCompletion(
  messages: ChatMessage[],
  toolbox?: SerializedToolbox
): AsyncGenerator<string, void, unknown> {
  const client = getClient();
  const model = process.env.OPENAI_MODEL || 'gpt-4o';
  const systemPrompt = getSystemPrompt(toolbox);

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
    // Log environment check (without exposing the key)
    console.log('Environment check:', {
      hasApiKey: !!process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      nodeVersion: process.version,
    });

    const { messages, toolbox } = req.body as ChatRequestBody;

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Messages array is required and must not be empty',
        },
      });
      return;
    }

    // Validate message format
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        res.status(400).json({
          error: {
            code: 'INVALID_MESSAGE_FORMAT',
            message: 'Each message must have a role and content',
          },
        });
        return;
      }
      if (!['user', 'assistant'].includes(msg.role)) {
        res.status(400).json({
          error: {
            code: 'INVALID_ROLE',
            message: 'Message role must be "user" or "assistant"',
          },
        });
        return;
      }
    }

    // Set headers for SSE streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream the response in real-time
    try {
      for await (const chunk of streamChatCompletion(messages, toolbox)) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }
      // Send done signal
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (streamError) {
      console.error('Streaming error:', streamError);
      console.error('Stream error stack:', streamError instanceof Error ? streamError.stack : 'No stack trace');
      console.error('Stream error details:', {
        name: streamError instanceof Error ? streamError.name : typeof streamError,
        message: streamError instanceof Error ? streamError.message : String(streamError),
      });
      
      const errorMessage = streamError instanceof Error ? streamError.message : 'Failed to stream response';
      
      // If headers already sent, end the response with error in stream format
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.end();
      } else {
        res.status(500).json({
          error: {
            code: 'STREAM_ERROR',
            message: errorMessage,
            details: process.env.NODE_ENV === 'development' ? (streamError instanceof Error ? streamError.stack : undefined) : undefined,
          },
        });
      }
    }
  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error details:', {
      name: error instanceof Error ? error.name : typeof error,
      message: error instanceof Error ? error.message : String(error),
      hasApiKey: !!process.env.OPENAI_API_KEY,
    });
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

    // If headers already sent, end the stream with error in stream format
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
      res.end();
    } else {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: errorMessage,
          details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
        },
      });
    }
  }
}
