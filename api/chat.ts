import type { VercelRequest, VercelResponse } from '@vercel/node';
import AnthropicFoundry from '@anthropic-ai/foundry-sdk';

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

The user has selected the following tools for their workflow. You have their setup guides available and should help them understand how to configure and integrate these tools together.

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
3. **Workflow optimization**: Suggest how to sequence their tools for the best clinical workflow
4. **Fill gaps**: If you notice missing workflow stages, suggest tools to complete their stack
5. **Troubleshooting**: Use the setup steps and tips to help troubleshoot issues

When the user asks about their toolbox or how to set up their tools, reference this context directly.`;

  return context;
}

// System prompt
function getSystemPrompt(toolbox?: SerializedToolbox): string {
  const toolsJson = JSON.stringify(tools, null, 2);
  const toolboxContext = toolbox ? generateToolboxContext(toolbox) : '';

  return `You are Athen AI, a healthcare AI consultant helping small clinics and private practices find the right AI tools for their workflows.

## Your Knowledge Base
Here are the healthcare AI tools you know about:

${toolsJson}

## How to Help Users

1. **Jump to recommendations quickly**: If the user describes a clear problem, recommend tools right away. Don't ask too many questions upfront.

2. **Ask ONE follow-up at most**: If you need clarification, ask only ONE simple question (e.g., "What's your specialty?" or "Do you have a budget in mind?"). Never ask 3-4 questions at once.

3. **Recommend specific tools**: When recommending tools, use the special TOOL CARD format (see below)

4. **Be honest about limitations**:
   - Only recommend tools from your knowledge base
   - Don't make up features or pricing
   - If a tool might not be HIPAA compliant, clearly warn them

## CRITICAL: Tool Card Format

When recommending a tool, you MUST use this exact format to render an interactive card:

[[TOOL:tool-id]]

For example:
- To recommend Doximity Scribe, write: [[TOOL:doximity-scribe]]
- To recommend Freed AI, write: [[TOOL:freed-ai]]
- To recommend IntakeQ, write: [[TOOL:intakeq]]

The tool-id must exactly match one of these IDs from your knowledge base:
freed-ai, scribeberry, doximity-scribe, intakeq, jotform, infermedica, kommunicate, bastiongpt, nexhealth, emitrr, medical-coding-ai, touchmd, aesthetix-crm, miiskin, fotofinder

## Response Style

- **Use line breaks liberally** - separate paragraphs and sections with blank lines for readability
- Keep explanations brief (1-2 sentences per tool recommendation)
- Ask AT MOST one follow-up question, and only if truly needed
- Be conversational and friendly, but professional

## CRITICAL: Formatting Rules

Your response MUST be well-formatted with proper spacing:
- Put a blank line before and after each [[TOOL:id]] marker
- Put a blank line between different paragraphs
- Keep paragraphs short (2-3 sentences max)
- Use line breaks to create visual breathing room

## Example Response

For a user who says "I spend too much time on documentation":

"Documentation is one of the biggest time sinks for clinicians. Here are two great options to consider:

**Best free option:**

[[TOOL:doximity-scribe]]

**More features if you need them:**

[[TOOL:freed-ai]]

What specialty are you in? I can refine these recommendations."

## What NOT to Do

- Don't recommend tools not in your knowledge base
- Don't make up pricing, features, or compliance status
- Don't provide medical advice - you help with tools, not clinical decisions
- Don't be overly verbose - respect the user's time
- Don't use excessive emojis or informal language
- Don't forget to use the [[TOOL:id]] format when recommending tools
- Don't use horizontal rules (---) or markdown dividers - use blank lines instead${toolboxContext}`;
}

// Create Foundry client
function getClient(): AnthropicFoundry {
  const apiKey = process.env.ANTHROPIC_FOUNDRY_API_KEY;
  const resource = process.env.ANTHROPIC_FOUNDRY_RESOURCE || 'vishal-sachdev-claude-resource';

  if (!apiKey) {
    throw new Error('ANTHROPIC_FOUNDRY_API_KEY environment variable not set');
  }

  return new AnthropicFoundry({
    apiKey,
    resource,
  });
}

// Get chat completion
async function getChatCompletion(messages: ChatMessage[], toolbox?: SerializedToolbox): Promise<string> {
  const client = getClient();
  const model = process.env.ANTHROPIC_MODEL || 'claude-opus-4-5';
  const systemPrompt = getSystemPrompt(toolbox);

  const response = await client.messages.create({
    model,
    max_tokens: 1500,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  // Extract text from response
  if (response.content && Array.isArray(response.content)) {
    const textBlock = response.content.find((block) => block.type === 'text');
    if (textBlock && textBlock.type === 'text') {
      return textBlock.text;
    }
  }

  return '';
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

    // Get the full response (Foundry doesn't support true streaming)
    const fullResponse = await getChatCompletion(messages, toolbox);

    // Simulate streaming by sending chunks
    const words = fullResponse.split(/(\s+)/);
    for (const word of words) {
      res.write(`data: ${JSON.stringify({ content: word })}\n\n`);
    }

    // Send done signal
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Chat API error:', error);

    // If headers already sent, end the stream with error
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
      res.end();
    } else {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      });
    }
  }
}
