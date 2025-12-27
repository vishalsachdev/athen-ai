// Healthcare AI tools database for system prompt
// This is a backend copy optimized for the LLM context

export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  website: string;
  hipaaCompliant: boolean;
  pricing: string;
  bestFor: string;
  keyFeatures: string[];
  hasGuide: boolean;
}

export const tools: Tool[] = [
  // === SCRIBES ===
  {
    id: 'freed-ai',
    name: 'Freed AI',
    category: 'AI Scribe',
    description: 'AI medical scribe that listens to patient encounters and auto-generates clinical notes. Adapts to each clinician\'s style.',
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

export function getToolsJson(): string {
  return JSON.stringify(tools, null, 2);
}
