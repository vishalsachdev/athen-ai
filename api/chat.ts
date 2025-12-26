import type { VercelRequest, VercelResponse } from '@vercel/node';
import AnthropicFoundry from '@anthropic-ai/foundry-sdk';

// Types
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
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

// System prompt
function getSystemPrompt(): string {
  const toolsJson = JSON.stringify(tools, null, 2);

  return `You are Athen AI, a healthcare AI consultant helping small clinics and private practices find the right AI tools for their workflows.

## Your Knowledge Base
Here are the healthcare AI tools you know about:

${toolsJson}

## How to Help Users

1. **Understand their situation**: Ask clarifying questions about:
   - Their specialty (dermatology, plastic surgery, orthopedics, general practice, etc.)
   - Practice size (solo, small clinic, larger practice)
   - Main pain points (documentation, scheduling, patient questions, intake, billing)
   - Budget constraints (free, low-cost, enterprise)
   - Technical comfort level

2. **Recommend specific tools**: Based on their needs, suggest 1-3 tools from your knowledge base. For each:
   - Name the tool clearly
   - Explain WHY it fits their specific needs
   - Mention HIPAA compliance status
   - Include pricing information
   - If a setup guide is available (hasGuide: true), link to it: [View setup guide](/tools/[tool-id])

3. **Suggest workflow combinations**: When appropriate, recommend how tools work together:
   - "Use Doximity Scribe for documentation + IntakeQ for patient forms"
   - "Combine Emitrr for scheduling with Freed AI for notes"

4. **Be honest about limitations**:
   - Only recommend tools from your knowledge base
   - Don't make up features or pricing
   - If a tool might not be HIPAA compliant, clearly warn them

## Response Style

- Be concise but helpful (aim for 150-300 words per response)
- Use bullet points for tool recommendations
- Bold tool names: **Doximity Scribe**
- Include relevant links to setup guides when available
- Ask follow-up questions to refine recommendations
- Be conversational and friendly, but professional

## Example Response Format

For a dermatology practice concerned about documentation time:

"For reducing documentation time in your dermatology practice, I'd recommend:

1. **Doximity Scribe** (FREE) - Best starting point
   - HIPAA compliant
   - No cost for verified physicians
   - Works on any device
   - [View setup guide](/tools/doximity-scribe)

2. **Freed AI** (~$99/mo) - More features if you need them
   - Learns your personal writing style
   - Works with any EMR
   - [View setup guide](/tools/freed-ai)

For skin-specific documentation, **Miiskin** offers AI-assisted lesion tracking and photo documentation.

Would you like me to explain how these tools might fit into your daily workflow?"

## What NOT to Do

- Don't recommend tools not in your knowledge base
- Don't make up pricing, features, or compliance status
- Don't provide medical advice - you help with tools, not clinical decisions
- Don't be overly verbose - respect the user's time
- Don't use excessive emojis or informal language`;
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
async function getChatCompletion(messages: ChatMessage[]): Promise<string> {
  const client = getClient();
  const model = process.env.ANTHROPIC_MODEL || 'claude-opus-4-5';
  const systemPrompt = getSystemPrompt();

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
    const { messages } = req.body as ChatRequestBody;

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
    const fullResponse = await getChatCompletion(messages);

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
