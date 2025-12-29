export interface GuideStep {
  title: string;
  content: string;
  tip?: string;
}

export interface Guide {
  toolId: string;
  overview: string;
  timeEstimate: string;
  prerequisites: string[];
  steps: GuideStep[];
  tips: string[];
}

export const guides: Record<string, Guide> = {
  'doximity-scribe': {
    toolId: 'doximity-scribe',
    overview: 'Doximity Scribe is a free AI clinical documentation tool available to all verified U.S. physicians, NPs, PAs, and medical students. It listens to your patient encounters and generates clinical notes automatically.',
    timeEstimate: '5-10 minutes',
    prerequisites: [
      'Verified Doximity account (free to create)',
      'Smartphone or computer with microphone',
      'Active internet connection'
    ],
    steps: [
      {
        title: 'Verify Your Doximity Account',
        content: `If you don't have a Doximity account yet:

1. Go to doximity.com and click "Join"
2. Enter your NPI number or medical school information
3. Verify your identity (usually takes 24-48 hours)
4. Once verified, you'll have full access to Scribe

If you already have a Doximity account, make sure you're logged in.`,
        tip: 'Doximity verification is required because Scribe is only available to verified healthcare professionals.'
      },
      {
        title: 'Access Doximity Scribe',
        content: `There are two ways to access Scribe:

Option A: Web Browser
1. Go to doximity.com/scribe
2. Log in with your Doximity credentials
3. You'll see the Scribe interface ready to record

Option B: Doximity Mobile App
1. Download the Doximity app from App Store or Google Play
2. Log in to your account
3. Tap the "Scribe" icon in the navigation`,
        tip: 'The mobile app is convenient for in-person visits, while the web version works well for telehealth.'
      },
      {
        title: 'Configure Your Preferences',
        content: `Before your first recording, set up your preferences:

1. Click the Settings gear icon
2. Choose your default note type (SOAP, H&P, Progress Note, etc.)
3. Select your specialty for better note formatting
4. Set your preferred note length (concise, standard, detailed)
5. Choose whether to include ICD-10 code suggestions`,
        tip: 'You can change these settings for individual encounters, but setting good defaults saves time.'
      },
      {
        title: 'Record Your First Encounter',
        content: `When you're ready to document a patient visit:

1. Click the red Record button to start
2. Conduct your patient encounter normally
3. Speak naturally - Scribe captures both you and the patient
4. Click Stop when the encounter is complete
5. Wait 30-60 seconds for the note to generate

Important: Let patients know the visit is being recorded for documentation purposes.`,
        tip: 'You don\'t need to speak in "medical dictation" style. Natural conversation works best.'
      },
      {
        title: 'Review and Edit the Note',
        content: `After recording, Scribe generates a draft note:

1. Review the generated note for accuracy
2. Click on any section to edit directly
3. Use the Regenerate button if a section needs rewriting
4. Add any information Scribe may have missed
5. Remove any irrelevant content

The note will be formatted according to your specialty and note type preferences.`,
        tip: 'Always review AI-generated notes before finalizing. Scribe is highly accurate but not perfect.'
      },
      {
        title: 'Copy to Your EMR',
        content: `Once you're satisfied with the note:

1. Click the Copy button to copy the entire note
2. Open your EMR and navigate to the patient's chart
3. Paste the note into the appropriate section
4. Save the note in your EMR

Alternative: Use the "Copy Section" buttons to copy individual sections (Chief Complaint, HPI, Assessment, Plan, etc.) if your EMR has separate fields.`,
        tip: 'Some EMRs support "smart phrases" - you could create one that pastes from clipboard for even faster workflow.'
      }
    ],
    tips: [
      'Doximity Scribe does NOT store any audio recordings - they are processed in real-time and immediately discarded',
      'All Doximity users are automatically covered by a Business Associate Agreement (BAA)',
      'Scribe works best in quiet environments with clear speech',
      'You can use Scribe for telehealth visits by recording your computer audio',
      'If a note seems off, try re-recording with clearer speech rather than extensive manual editing'
    ]
  },

  'freed-ai': {
    toolId: 'freed-ai',
    overview: 'Freed is an AI medical scribe that automatically generates clinical documentation from your patient conversations. It adapts to your personal writing style and works with any EMR.',
    timeEstimate: '10-15 minutes',
    prerequisites: [
      'Email address for account creation',
      'Computer or smartphone with microphone',
      'Credit card for paid plans (free trial available)'
    ],
    steps: [
      {
        title: 'Create Your Freed Account',
        content: `1. Go to getfreed.ai and click "Start Free Trial"
2. Enter your email address and create a password
3. Verify your email by clicking the link sent to your inbox
4. Complete the onboarding questionnaire:
   - Your medical specialty
   - Your typical note format (SOAP, H&P, etc.)
   - Your EMR system

Freed offers a free trial so you can test it before committing.`,
        tip: 'Use your work email if your practice will be paying for the subscription.'
      },
      {
        title: 'Install Freed on Your Devices',
        content: `Freed works on multiple platforms:

Desktop (Recommended for telehealth)
1. Go to app.getfreed.ai in Chrome, Safari, or Edge
2. Bookmark it for quick access
3. Allow microphone permissions when prompted

Mobile App
1. Download "Freed - AI Medical Scribe" from App Store or Google Play
2. Log in with your account credentials
3. Grant microphone and notification permissions

Chrome Extension (Optional)
1. Install the Freed Chrome extension
2. This allows one-click recording from any browser tab`,
        tip: 'The web app works on any device - no installation required. Mobile app is better for in-person visits.'
      },
      {
        title: 'Configure Your Note Templates',
        content: `Freed learns your style, but you can customize templates:

1. Go to Settings > Note Templates
2. Choose your default template or create a custom one
3. Set which sections to include:
   - Chief Complaint
   - History of Present Illness
   - Review of Systems
   - Physical Exam
   - Assessment & Plan
   - Patient Instructions
4. Adjust the verbosity level (concise, moderate, detailed)
5. Add any custom sections specific to your practice`,
        tip: 'Freed learns from your edits over time. The more you use it and correct it, the better it gets.'
      },
      {
        title: 'Record Your First Patient Encounter',
        content: `When you're ready to document:

1. Open Freed and click the Start Visit button
2. Enter the patient's name (or initials for privacy)
3. Select the visit type if prompted
4. Click Record to begin capturing the conversation
5. Conduct your visit normally - speak naturally
6. Click End Visit when finished

Freed captures both sides of the conversation and identifies speaker roles automatically.`,
        tip: 'Freed works great for telehealth - it can capture audio from your video call software.'
      },
      {
        title: 'Review and Finalize Your Note',
        content: `After the visit ends, Freed generates your note within 1-2 minutes:

1. Review the generated note in the Freed interface
2. Click on any section to edit text directly
3. Use Regenerate Section if something needs rewriting
4. Check the ICD-10 suggestions and add relevant codes
5. Review any flagged items that may need attention
6. Click Finalize when the note is ready`,
        tip: 'Freed highlights low-confidence sections in yellow. Pay extra attention to these.'
      },
      {
        title: 'Export to Your EMR',
        content: `Get your note into your EMR:

Copy/Paste Method
1. Click Copy Note to copy the entire note
2. Paste into your EMR's documentation section

Direct Integration (if available)
Some EMRs have direct Freed integrations:
1. Go to Settings > Integrations
2. Connect your EMR if listed
3. Notes can then be sent directly to patient charts

Smart Phrase Method
If your EMR supports smart phrases/dot phrases, you can set up a workflow to paste Freed notes automatically.`,
        tip: 'Even without direct integration, copy/paste takes just seconds and works with any EMR.'
      }
    ],
    tips: [
      'Freed does NOT store patient recordings - audio is processed and immediately deleted',
      'The AI improves over time by learning your editing patterns (not from audio)',
      'Works in any language - useful for interpreters or multilingual patients',
      'You can pause and resume recording if needed during a visit',
      'Use the "Add Context" feature to include relevant info before the visit starts'
    ]
  },

  'intakeq': {
    toolId: 'intakeq',
    overview: 'IntakeQ is a HIPAA-compliant digital intake solution that lets you create custom patient forms, collect e-signatures, and integrate with your practice management system.',
    timeEstimate: '30-45 minutes for basic setup',
    prerequisites: [
      'Email address for account creation',
      'List of information you want to collect from patients',
      'Your practice logo (optional, for branding)',
      'Credit card for subscription (14-day free trial available)'
    ],
    steps: [
      {
        title: 'Create Your IntakeQ Account',
        content: `1. Go to intakeq.com and click "Start Free Trial"
2. Enter your practice name and email address
3. Create a secure password
4. Choose your practice type:
   - Medical Practice
   - Mental Health
   - Dental
   - Wellness/Alternative
5. Select your timezone
6. Verify your email address

Your account is automatically HIPAA-compliant with BAA coverage.`,
        tip: 'IntakeQ offers a 14-day free trial with full features - no credit card required to start.'
      },
      {
        title: 'Set Up Your Practice Profile',
        content: `Configure your practice information:

1. Go to Settings > Practice Info
2. Add your practice details:
   - Practice name and address
   - Phone number and email
   - Website URL
3. Upload your logo for branded forms
4. Set your business hours
5. Configure your appointment types if using scheduling

This information will appear on your intake forms and emails.`,
        tip: 'Adding your logo makes forms look professional and helps patients trust they\'re filling out the right form.'
      },
      {
        title: 'Create Your First Intake Form',
        content: `Build a custom intake form:

1. Go to Forms > Create New Form
2. Choose a starting point:
   - Template: Start with a pre-built template for your specialty
   - Blank: Build from scratch
3. Use the drag-and-drop builder to add fields:
   - Text fields (name, address, etc.)
   - Date pickers (DOB, appointment dates)
   - Checkboxes and radio buttons (yes/no questions)
   - Signature fields (consent forms)
   - File uploads (insurance cards, IDs)
4. Add conditional logic to show/hide fields based on answers
5. Click Save when finished`,
        tip: 'Start with a template and customize it - much faster than building from scratch.'
      },
      {
        title: 'Configure Form Settings',
        content: `Set up how your form behaves:

1. Click Settings on your form
2. Configure:
   - Form title and description
   - Completion message (what patients see after submitting)
   - Email notifications (get notified when forms are submitted)
   - Expiration (how long the form link stays valid)
3. Set up e-signature requirements for consent forms
4. Enable save and continue if the form is long
5. Add password protection if needed for sensitive forms`,
        tip: 'Enable "Save and Continue" for longer forms - patients can finish later without losing progress.'
      },
      {
        title: 'Test Your Form',
        content: `Before sending to patients, test thoroughly:

1. Click Preview to see the patient view
2. Fill out the form yourself as a test
3. Submit the test and check:
   - Did you receive the notification email?
   - Does the data appear correctly in IntakeQ?
   - Are conditional fields working properly?
4. Test on mobile (most patients use phones)
5. Make any needed adjustments`,
        tip: 'Ask a colleague to test too - fresh eyes catch issues you might miss.'
      },
      {
        title: 'Send Forms to Patients',
        content: `Get forms in front of patients:

Option A: Email Individual Patients
1. Go to Clients > Send Intake
2. Enter the patient's email address
3. Select which form(s) to send
4. Customize the email message
5. Click Send

Option B: Share a Public Link
1. Go to your form and click Share
2. Copy the public link
3. Add it to your website, emails, or text messages

Option C: Embed on Your Website
1. Get the embed code from Share > Embed
2. Add it to your website's new patient page`,
        tip: 'Send forms 24-48 hours before appointments - gives patients time to complete thoughtfully.'
      },
      {
        title: 'Review Submitted Forms',
        content: `When patients submit forms:

1. You'll receive an email notification
2. Go to Clients to see submissions
3. Click on a client to view their completed forms
4. Review the information and flag anything that needs follow-up
5. Print or Export to PDF if needed
6. Forms are automatically saved and searchable

You can also set up staff notifications so your team sees new submissions.`,
        tip: 'Use IntakeQ\'s search to quickly find patient forms - much faster than paper filing.'
      }
    ],
    tips: [
      'IntakeQ is HIPAA-compliant out of the box - they sign a BAA with every account',
      'Forms work on any device - phone, tablet, or computer',
      'Use templates for common form types (demographics, medical history, consent)',
      'Set up automated reminders for incomplete forms',
      'IntakeQ integrates with many EMRs and practice management systems',
      'You can require patients to complete forms before booking appointments'
    ]
  },

  'scribeberry': {
    toolId: 'scribeberry',
    overview: 'Scribeberry is an AI medical scribe claiming 99.9% accuracy that auto-generates structured clinical notes for any EMR. It also includes patient intake agents for a complete documentation solution.',
    timeEstimate: '15-20 minutes',
    prerequisites: [
      'Email address for account creation',
      'Computer or smartphone with microphone',
      'Your EMR login credentials (for integration setup)',
      'Credit card for subscription'
    ],
    steps: [
      {
        title: 'Create Your Scribeberry Account',
        content: `1. Go to scribeberry.com and click "Get Started" or "Sign Up"
2. Enter your email address and create a password
3. Verify your email via the confirmation link
4. Complete your profile:
   - Your name and credentials
   - Medical specialty
   - Practice name
   - Your EMR system
5. Review and accept the HIPAA Business Associate Agreement`,
        tip: 'Scribeberry offers demos - request one if you want to see it in action before committing.'
      },
      {
        title: 'Configure Your EMR Integration',
        content: `Connect Scribeberry to your EMR:

1. Go to Settings > Integrations
2. Find your EMR from the supported list
3. Follow the connection steps:
   - For cloud EMRs: OAuth login flow
   - For on-premise: API key or credentials
4. Test the connection to ensure it works
5. Configure which fields to sync (notes, diagnoses, etc.)

If your EMR isn't listed, you can still use copy/paste workflow.`,
        tip: 'Direct EMR integration saves time but isn\'t required. Many users successfully use copy/paste.'
      },
      {
        title: 'Set Up Your Note Templates',
        content: `Customize how your notes are structured:

1. Go to Settings > Note Templates
2. Choose your primary note format:
   - SOAP notes
   - H&P (History & Physical)
   - Progress notes
   - Specialty-specific templates
3. Customize sections to include/exclude
4. Set your preferred level of detail (brief, standard, comprehensive)
5. Save your template as the default`,
        tip: 'Create multiple templates for different visit types - follow-ups vs new patients vs procedures.'
      },
      {
        title: 'Record Your First Patient Encounter',
        content: `When ready to document a visit:

1. Open Scribeberry on your device
2. Click "New Visit" or the record button
3. Enter basic patient info (name or ID)
4. Select the visit type and template
5. Click Record to start capturing
6. Conduct your patient encounter naturally
7. Click Stop when finished

Scribeberry uses AI to distinguish between clinician and patient speech.`,
        tip: 'Position your device where it can clearly hear both you and the patient for best accuracy.'
      },
      {
        title: 'Review and Edit Generated Notes',
        content: `After recording, the AI generates your note:

1. Wait 1-2 minutes for processing
2. Review the generated note section by section
3. Click any section to edit directly
4. Verify medical terms, dosages, and specific details
5. Check the accuracy claims - while 99.9% is advertised, always verify
6. Make any necessary corrections

The system learns from your edits to improve future notes.`,
        tip: 'Pay special attention to medication names and dosages - always double-check these critical details.'
      },
      {
        title: 'Use Patient Intake Agents',
        content: `Scribeberry includes intake automation:

1. Go to Intake > Create New Form
2. Set up pre-visit questionnaires
3. Configure automated sending:
   - Before appointments
   - For new patients
   - For specific visit types
4. Responses flow into the patient record
5. AI summarizes intake info for your review before the visit

This saves time gathering history during the actual visit.`,
        tip: 'Send intake forms 24-48 hours before visits so patients have time to complete them thoughtfully.'
      },
      {
        title: 'Export Notes to Your EMR',
        content: `Get your finalized notes into the patient chart:

With EMR Integration:
1. Click "Send to EMR" after finalizing
2. Confirm the patient and encounter
3. Note appears in your EMR automatically

Without Integration:
1. Click "Copy Note" to copy to clipboard
2. Open your EMR and navigate to the patient
3. Paste into the appropriate documentation field
4. Save in your EMR`,
        tip: 'Set up keyboard shortcuts for copying and pasting to speed up your workflow.'
      }
    ],
    tips: [
      'Scribeberry is HIPAA compliant and signs a BAA with all accounts',
      'The AI improves over time as it learns your documentation style',
      'Use intake agents to gather patient history before visits',
      'Works with any EMR via copy/paste even without direct integration',
      'Best accuracy is achieved in quiet environments with clear speech',
      'Review all AI-generated notes before finalizing - accuracy claims don\'t replace clinical judgment'
    ]
  },

  'jotform': {
    toolId: 'jotform',
    overview: 'Jotform is a versatile form builder with AI capabilities that can generate forms from descriptions. With HIPAA compliance available on higher tiers and a 50% healthcare discount, it\'s ideal for practices wanting flexible intake solutions.',
    timeEstimate: '15-30 minutes',
    prerequisites: [
      'Email address for account creation',
      'List of information you need to collect',
      'Credit card for HIPAA-compliant tier (free tier available but not HIPAA compliant)',
      'Your practice logo (optional)'
    ],
    steps: [
      {
        title: 'Create Your Jotform Account',
        content: `1. Go to jotform.com and click "Sign Up Free"
2. Create account with email or Google/Microsoft login
3. Verify your email address
4. Choose your plan:
   - Free: Basic features, NOT HIPAA compliant
   - Bronze/Silver: More features, HIPAA available
   - Gold: Full features, includes HIPAA compliance
5. Request the 50% healthcare discount during signup or via support

Important: HIPAA compliance is only available on paid plans.`,
        tip: 'Contact Jotform support to get the 50% healthcare discount - it\'s not always shown during signup.'
      },
      {
        title: 'Enable HIPAA Compliance',
        content: `For healthcare use, you MUST enable HIPAA features:

1. Go to Settings > Account > Security
2. Look for "HIPAA Compliance" option
3. Enable HIPAA mode for your account
4. Review and sign the Business Associate Agreement (BAA)
5. Configure security settings:
   - Enable form encryption
   - Set up access controls
   - Enable audit logging

Your forms will now be stored in HIPAA-compliant infrastructure.`,
        tip: 'Do NOT use Jotform for PHI until HIPAA compliance is enabled and BAA is signed.'
      },
      {
        title: 'Create a Form with AI',
        content: `Use Jotform's AI to generate forms quickly:

1. Click "Create Form"
2. Select "AI Form Generator"
3. Describe what you need in plain English:
   - "New patient intake form for dermatology practice"
   - "Pre-operative questionnaire with medical history"
   - "Patient satisfaction survey"
4. AI generates a starting form
5. Review and customize the generated form
6. Add or remove fields as needed`,
        tip: 'Be specific in your AI prompt - include your specialty and what info you need for better results.'
      },
      {
        title: 'Customize Your Form',
        content: `Refine the form using the drag-and-drop builder:

1. Add fields from the left panel:
   - Basic: Name, email, phone, address
   - Healthcare: Medical history, medications, allergies
   - Consent: Signature fields, checkboxes
   - Files: Insurance card uploads, ID photos
2. Set required fields
3. Add conditional logic (show/hide based on answers)
4. Customize colors and branding
5. Add your practice logo
6. Preview on desktop and mobile`,
        tip: 'Use conditional logic to keep forms short - only show relevant questions based on previous answers.'
      },
      {
        title: 'Use Healthcare Templates',
        content: `Jotform has 10,000+ templates including healthcare:

1. Click "Create Form" > "Use Template"
2. Search for healthcare-specific templates:
   - "Patient registration form"
   - "Medical history questionnaire"
   - "HIPAA consent form"
   - "Telehealth consent"
3. Browse the Healthcare category
4. Preview templates before selecting
5. Customize any template to fit your needs

Templates are faster than building from scratch.`,
        tip: 'Even if a template isn\'t perfect, it\'s usually faster to modify one than to start from scratch.'
      },
      {
        title: 'Set Up Form Distribution',
        content: `Get your form to patients:

Option A: Direct Link
1. Click "Publish" on your form
2. Copy the form URL
3. Share via email, text, or your website

Option B: Embed on Website
1. Go to Publish > Embed
2. Copy the embed code
3. Paste into your website's HTML

Option C: QR Code
1. Go to Publish > QR Code
2. Download the QR code image
3. Print and display in your office

Option D: Email Integration
1. Set up automated sending via integrations`,
        tip: 'QR codes in your waiting room let patients fill out forms on their own phones.'
      },
      {
        title: 'Manage Submissions',
        content: `Handle form responses efficiently:

1. View submissions in the Jotform inbox
2. Set up email notifications for new submissions
3. Export data:
   - PDF for individual patient records
   - Excel/CSV for batch processing
   - Direct integration with your EMR or PM system
4. Use filters to find specific submissions
5. Set up automated workflows:
   - Send confirmation emails to patients
   - Notify staff of new submissions
   - Route to specific team members`,
        tip: 'Set up integrations with Google Sheets or your EMR to automatically sync submissions.'
      }
    ],
    tips: [
      'HIPAA compliance requires a paid plan - free tier is NOT suitable for PHI',
      'Always request the 50% healthcare discount',
      'The AI form generator can save hours of manual form building',
      'Use conditional logic to create smart, adaptive forms',
      'Test forms on mobile - most patients will use their phones',
      'Set up automated reminders for incomplete submissions',
      'Jotform integrates with 100+ apps including many EMR systems'
    ]
  },

  'infermedica': {
    toolId: 'infermedica',
    overview: 'Infermedica provides enterprise-grade AI-powered symptom collection and pre-visit triage. Its intelligent algorithms ensure comprehensive symptom capture and can reduce average visit times from 20 minutes to 12.5 minutes.',
    timeEstimate: '1-2 weeks (enterprise implementation)',
    prerequisites: [
      'Healthcare organization with IT resources',
      'Budget for enterprise software',
      'Dedicated implementation team',
      'EMR/EHR system for integration',
      'Executive sponsorship for the project'
    ],
    steps: [
      {
        title: 'Request a Demo and Consultation',
        content: `Infermedica is enterprise software requiring a sales process:

1. Go to infermedica.com/solutions/intake
2. Click "Request Demo" or "Contact Sales"
3. Fill out the contact form with:
   - Organization name and size
   - Your role and contact info
   - Current challenges you're trying to solve
   - Estimated patient volume
4. Schedule a demo call with their team
5. They'll show you the platform and discuss your needs

This is not self-service software - expect a consultative sales process.`,
        tip: 'Come prepared with specific use cases and metrics you want to improve (wait times, no-shows, etc.).'
      },
      {
        title: 'Evaluate and Plan Implementation',
        content: `Work with Infermedica to plan your deployment:

1. Review the technical requirements
2. Assess integration needs with your current systems:
   - EMR/EHR integration
   - Patient portal integration
   - Scheduling system integration
3. Define your use cases:
   - Pre-visit symptom collection
   - Triage and routing
   - Clinical decision support
4. Identify pilot departments or locations
5. Establish success metrics and timeline`,
        tip: 'Start with a pilot in one department before rolling out organization-wide.'
      },
      {
        title: 'Complete Technical Integration',
        content: `Work with your IT team and Infermedica:

1. Review API documentation and integration guides
2. Set up secure connections between systems
3. Configure patient data flow:
   - From intake to EMR
   - Symptom data to clinical notes
   - Triage recommendations to care team
4. Implement authentication (SSO if needed)
5. Set up HIPAA-compliant data handling
6. Conduct security review and penetration testing`,
        tip: 'Involve your IT security team early - healthcare integrations require careful security planning.'
      },
      {
        title: 'Configure Clinical Content',
        content: `Customize Infermedica for your organization:

1. Review and configure symptom algorithms
2. Set triage thresholds for your patient population
3. Customize patient-facing language and branding
4. Configure specialty-specific pathways
5. Set up routing rules:
   - Which symptoms go to urgent care
   - Which route to specialists
   - Which can be handled via telehealth
6. Review clinical decision support alerts`,
        tip: 'Have clinicians review the clinical content - AI recommendations should align with your care protocols.'
      },
      {
        title: 'Train Your Staff',
        content: `Prepare your team for the new workflow:

1. Train front desk staff on the new intake process
2. Train clinical staff on reviewing AI-generated summaries
3. Train IT support on troubleshooting
4. Document new workflows and procedures
5. Set up ongoing support channels
6. Create quick reference guides for common scenarios

Infermedica typically provides training resources and support.`,
        tip: 'Identify champions in each department who can help train and support their colleagues.'
      },
      {
        title: 'Pilot and Iterate',
        content: `Start with a controlled rollout:

1. Launch with your pilot group
2. Monitor key metrics:
   - Patient completion rates
   - Time savings per visit
   - Staff satisfaction
   - Clinical accuracy feedback
3. Gather feedback from patients and staff
4. Identify and resolve issues quickly
5. Refine workflows based on learnings
6. Document best practices`,
        tip: 'Be prepared to iterate - enterprise software rarely works perfectly on day one.'
      },
      {
        title: 'Full Deployment and Optimization',
        content: `Roll out across your organization:

1. Expand to additional departments/locations
2. Continue monitoring and optimizing
3. Track ROI metrics:
   - Visit time reduction
   - Patient satisfaction scores
   - Staff efficiency gains
   - Clinical outcome improvements
4. Regular reviews with Infermedica team
5. Stay updated on new features and improvements`,
        tip: 'Track and report ROI to maintain executive support and budget for the solution.'
      }
    ],
    tips: [
      'Infermedica is enterprise software - expect a 6-figure annual investment',
      'Implementation typically takes 1-2 weeks minimum, often longer for complex organizations',
      'The AI is clinically validated but should support, not replace, clinical judgment',
      'Best results come from tight EMR integration',
      'Start with high-volume, straightforward use cases for quickest wins',
      'Patient adoption is critical - make the intake experience user-friendly',
      'Regularly review clinical pathways as medical guidelines evolve'
    ]
  },

  'kommunicate': {
    toolId: 'kommunicate',
    overview: 'Kommunicate is an AI chatbot platform that lets you train a custom bot on your own documents. With HIPAA compliance and bot-to-human handoff, it\'s ideal for handling patient FAQs while ensuring complex questions reach your staff.',
    timeEstimate: '1-2 hours',
    prerequisites: [
      'Email address for account creation',
      'Documents to train the bot (FAQs, policies, procedures)',
      'Website where you\'ll deploy the chatbot',
      'Credit card for subscription (~$100/month for healthcare tier)'
    ],
    steps: [
      {
        title: 'Create Your Kommunicate Account',
        content: `1. Go to kommunicate.io and click "Start Free Trial"
2. Sign up with your email address
3. Complete your profile:
   - Organization name
   - Industry (select Healthcare)
   - Team size
4. Verify your email
5. Choose the HIPAA-compliant plan (required for healthcare)
6. Sign the Business Associate Agreement (BAA)`,
        tip: 'Make sure you select a plan that includes HIPAA compliance before adding any patient-related content.'
      },
      {
        title: 'Set Up Your Bot\'s Knowledge Base',
        content: `Train your bot on your practice information:

1. Go to Bot > Knowledge Base
2. Add your content sources:
   - Upload documents (PDFs, Word docs)
   - Add FAQ pages from your website
   - Manually enter Q&A pairs
3. Common content to include:
   - Office hours and location
   - Insurance accepted
   - Services offered
   - Pre-appointment instructions
   - Post-procedure care
   - Contact information
4. Review how the bot processes your content`,
        tip: 'Start with your most frequently asked questions - staff can tell you what patients ask most often.'
      },
      {
        title: 'Configure Bot Responses',
        content: `Fine-tune how your bot responds:

1. Go to Bot > Conversation Settings
2. Set the bot's personality:
   - Name (e.g., "Care Assistant")
   - Tone (professional, friendly, formal)
   - Avatar/icon
3. Configure response behavior:
   - How to handle unknown questions
   - When to escalate to humans
   - Confidence thresholds
4. Set up welcome messages
5. Create quick reply buttons for common topics`,
        tip: 'Test responses yourself before going live - make sure the tone matches your practice\'s brand.'
      },
      {
        title: 'Set Up Human Handoff',
        content: `Configure when and how conversations transfer to staff:

1. Go to Settings > Routing
2. Define escalation triggers:
   - Specific keywords (e.g., "emergency", "speak to someone")
   - Low confidence responses
   - Patient requests
   - Appointment scheduling
3. Set business hours for live support
4. Configure offline behavior:
   - Leave a message form
   - Email notification
   - Callback request
5. Set up agent assignments and queues`,
        tip: 'Always have a clear path to human support - never leave patients stuck talking to a bot that can\'t help.'
      },
      {
        title: 'Customize the Chat Widget',
        content: `Brand the chatbot to match your practice:

1. Go to Settings > Chat Widget
2. Customize appearance:
   - Colors to match your brand
   - Widget position (bottom right, etc.)
   - Size and style
3. Add your practice logo
4. Set the chat button text
5. Configure pre-chat forms if needed:
   - Name
   - Email
   - Reason for contact
6. Preview on desktop and mobile`,
        tip: 'Keep the chat widget visible but not intrusive - bottom right corner works well for most sites.'
      },
      {
        title: 'Install on Your Website',
        content: `Deploy the chatbot:

1. Go to Settings > Install
2. Copy the JavaScript snippet provided
3. Add to your website:
   - Paste before closing </body> tag
   - Or use Google Tag Manager
   - Or use the WordPress plugin
4. Test the widget on your live site
5. Verify conversations appear in your dashboard
6. Test bot responses and human handoff`,
        tip: 'Test on multiple devices and browsers to ensure consistent experience.'
      },
      {
        title: 'Monitor and Improve',
        content: `Continuously improve your bot:

1. Review conversation logs in the dashboard
2. Identify common questions the bot struggles with
3. Add new content to the knowledge base
4. Track metrics:
   - Bot resolution rate
   - Handoff rate
   - Patient satisfaction
5. Set up weekly reviews to improve responses
6. Update content as your practice changes`,
        tip: 'Review conversations weekly at first - you\'ll quickly learn what content to add.'
      }
    ],
    tips: [
      'HIPAA compliance is essential - never use a non-compliant tier for patient interactions',
      'Start with a limited scope and expand as the bot proves effective',
      'Train staff on how to handle handed-off conversations',
      'The bot should help, not replace, human interaction for complex issues',
      'Update knowledge base regularly as policies and procedures change',
      'Monitor for frustrated patients and improve those conversation flows',
      'Consider adding the chat widget to your patient portal too'
    ]
  },

  'bastiongpt': {
    toolId: 'bastiongpt',
    overview: 'BastionGPT is a HIPAA-compliant version of ChatGPT designed specifically for healthcare. Unlike regular ChatGPT, your data is not accessible to OpenAI and is never used for training, making it safe for PHI.',
    timeEstimate: '10-15 minutes',
    prerequisites: [
      'Email address for account creation',
      'Credit card for subscription',
      'Understanding of your PHI handling requirements'
    ],
    steps: [
      {
        title: 'Create Your BastionGPT Account',
        content: `1. Go to bastiongpt.com
2. Click "Sign Up" or "Get Started"
3. Enter your email and create a password
4. Verify your email address
5. Complete your profile:
   - Your name and role
   - Organization name
   - How you plan to use BastionGPT
6. Review and sign the Business Associate Agreement (BAA)
7. Select your subscription plan`,
        tip: 'BastionGPT exceeds HIPAA requirements - it\'s one of the few AI chat tools safe for PHI.'
      },
      {
        title: 'Understand the Security Model',
        content: `Know how BastionGPT protects your data:

Key Security Features:
- Data is NOT sent to OpenAI's standard API
- Your conversations are NOT used for AI training
- All data is encrypted in transit and at rest
- Access controls and audit logging
- Compliant infrastructure

What This Means:
- You CAN discuss patient information
- You CAN upload documents containing PHI
- Your data remains private and protected

Review the security documentation for your compliance records.`,
        tip: 'Keep BastionGPT\'s security documentation handy for compliance audits.'
      },
      {
        title: 'Set Up Your Workspace',
        content: `Configure BastionGPT for your practice:

1. Access your dashboard after login
2. Set up your preferences:
   - Default model (GPT-4 recommended for clinical use)
   - Response style preferences
   - Specialty context (if available)
3. Create conversation folders/categories:
   - Patient consultations
   - Research
   - Administrative tasks
4. Set up any team access if on a team plan`,
        tip: 'Organize conversations by purpose - makes it easier to find past interactions.'
      },
      {
        title: 'Learn Effective Prompting for Healthcare',
        content: `Use BastionGPT effectively for clinical tasks:

Example Use Cases:

1. Drafting patient communications:
"Help me draft a follow-up letter for a patient who had knee replacement surgery 2 weeks ago. Include recovery milestones and warning signs."

2. Summarizing clinical information:
"Summarize the key points from this radiology report for discussion with the patient: [paste report]"

3. Research assistance:
"What are the current treatment guidelines for Type 2 diabetes in patients over 65?"

4. Administrative tasks:
"Help me draft a prior authorization appeal for [procedure] based on these clinical details: [details]"`,
        tip: 'Be specific in your prompts and provide relevant context for best results.'
      },
      {
        title: 'Use Document Analysis',
        content: `Leverage BastionGPT's document capabilities:

1. Upload documents directly in the chat:
   - Clinical notes
   - Lab reports
   - Research papers
   - Policy documents
2. Ask questions about the content:
   - "Summarize this document"
   - "What are the key findings?"
   - "Extract the medication list"
   - "Identify any abnormal values"
3. Compare multiple documents
4. Generate summaries for patient discussions

Document analysis is particularly powerful for complex cases.`,
        tip: 'For best results with documents, ask specific questions rather than just "analyze this."'
      },
      {
        title: 'Integrate into Your Workflow',
        content: `Make BastionGPT part of your daily routine:

1. Bookmark the site for quick access
2. Keep it open during documentation time
3. Use it to:
   - Draft notes (then review and edit)
   - Research while charting
   - Prepare for complex cases
   - Draft patient education materials
4. Copy outputs to your EMR as needed
5. Build a library of useful prompts

Remember: Always review AI outputs before using clinically.`,
        tip: 'Create a "swipe file" of prompts that work well for your common tasks.'
      }
    ],
    tips: [
      'BastionGPT is one of the few AI assistants safe for PHI - leverage this advantage',
      'Always review AI-generated clinical content before using',
      'The AI is a tool to augment your expertise, not replace clinical judgment',
      'Use specific, detailed prompts for better outputs',
      'Great for drafting - let it write first drafts, then you edit',
      'Document analysis is powerful for complex cases with lots of records',
      'Keep up with new features - AI capabilities are rapidly evolving'
    ]
  },

  'medical-coding-ai': {
    toolId: 'medical-coding-ai',
    overview: 'Medical Coding AI is a GPT-based tool that translates medical reports into ICD-10, CPT, and HCPCS billing codes. IMPORTANT: This tool is NOT HIPAA compliant - do not use with actual patient information.',
    timeEstimate: '5 minutes',
    prerequisites: [
      'ChatGPT Plus subscription (~$20/month)',
      'OpenAI account',
      'Understanding that this tool is NOT HIPAA compliant'
    ],
    steps: [
      {
        title: 'CRITICAL: Understand HIPAA Limitations',
        content: `STOP: This tool is NOT HIPAA compliant!

What This Means:
- Do NOT enter real patient information
- Do NOT paste actual clinical notes
- Do NOT include names, dates, or identifiers
- Standard ChatGPT data MAY be used for training

Safe Uses:
- Learning coding concepts
- Practice with fictional scenarios
- Understanding code relationships
- Quick code lookups without PHI

For HIPAA-compliant coding assistance, use BastionGPT instead.`,
        tip: 'When in doubt, leave it out. Never enter PHI into non-compliant tools.'
      },
      {
        title: 'Get ChatGPT Plus',
        content: `This tool requires ChatGPT Plus:

1. Go to chat.openai.com
2. Sign up or log in to your account
3. Click "Upgrade to Plus" in the sidebar
4. Subscribe for ~$20/month
5. This gives you access to GPT-4 and custom GPTs

Note: The subscription is through OpenAI, not the Medical Coding AI creator.`,
        tip: 'ChatGPT Plus also gives you access to many other useful GPTs beyond medical coding.'
      },
      {
        title: 'Access Medical Coding AI',
        content: `Find and use the Medical Coding AI GPT:

1. Go to chat.openai.com with your Plus account
2. Click "Explore GPTs" in the sidebar
3. Search for "Medical Coding AI"
4. Select the GPT from the results
5. Click "Start Chat" to begin using it

Alternatively, access directly via the link on theresanaiforthat.com`,
        tip: 'Save it to your sidebar for quick access in future sessions.'
      },
      {
        title: 'Use for Code Lookups (Without PHI)',
        content: `Safe ways to use Medical Coding AI:

Example 1 - Code Lookup:
"What is the ICD-10 code for Type 2 diabetes with diabetic nephropathy?"

Example 2 - Code Description:
"What does CPT code 99214 cover?"

Example 3 - Learning:
"Explain the difference between ICD-10 codes E11.21 and E11.22"

Example 4 - Fictional Scenarios:
"For a fictional patient with acute bronchitis and a 15-minute follow-up visit, what codes might apply?"`,
        tip: 'Frame questions as educational or use clearly fictional scenarios.'
      },
      {
        title: 'HIPAA-Compliant Alternative Workflow',
        content: `For actual patient coding, use this workflow:

1. Use Medical Coding AI to learn coding concepts
2. When you need to code real patient encounters:
   - Use BastionGPT (HIPAA compliant) instead, OR
   - Use your EMR's built-in coding tools, OR
   - Use certified coding software with BAA
3. Never copy patient information into standard ChatGPT

If you need AI-assisted coding with PHI, BastionGPT is a safer choice.`,
        tip: 'Consider Medical Coding AI as a learning tool, not a production coding tool.'
      },
      {
        title: 'Verify All Codes',
        content: `Always verify AI-suggested codes:

1. AI can make mistakes with medical coding
2. Coding rules change frequently
3. Cross-reference with:
   - CMS official guidelines
   - Your coding reference books
   - Your practice's coding policies
4. Payer-specific rules may apply
5. When in doubt, consult a certified coder

Incorrect coding can lead to claim denials or compliance issues.`,
        tip: 'Use AI as a starting point, not the final word on coding decisions.'
      }
    ],
    tips: [
      'WARNING: This tool is NOT HIPAA compliant - never enter PHI',
      'Use for education and learning, not production patient coding',
      'For HIPAA-compliant AI coding help, use BastionGPT instead',
      'Always verify AI-suggested codes against official guidelines',
      'Medical coding rules change frequently - AI may not have latest updates',
      'Consider this a learning aid, not a replacement for certified coders',
      'ChatGPT Plus subscription is required ($20/month)'
    ]
  },

  'nexhealth': {
    toolId: 'nexhealth',
    overview: 'NexHealth is a comprehensive patient experience platform featuring online scheduling, automated reminders, waitlist management, and review management. It syncs with your EHR for seamless patient communication.',
    timeEstimate: '1-2 hours',
    prerequisites: [
      'Practice admin access for account setup',
      'Your EHR/practice management system credentials',
      'List of appointment types you offer',
      'Credit card for subscription'
    ],
    steps: [
      {
        title: 'Request a Demo and Sign Up',
        content: `NexHealth uses a consultative sales process:

1. Go to nexhealth.com
2. Click "Get a Demo" or "Request Demo"
3. Fill out the contact form:
   - Practice name and location
   - Your EHR system
   - Number of providers
   - Current challenges
4. Schedule a demo call
5. After the demo, work with sales to set up your account
6. Sign the service agreement and BAA`,
        tip: 'Come to the demo with questions about your specific EHR integration.'
      },
      {
        title: 'Connect Your EHR',
        content: `Integrate NexHealth with your practice management system:

1. Work with NexHealth implementation team
2. Provide EHR access credentials or API keys
3. NexHealth supports many systems:
   - Dentrix, Eaglesoft (dental)
   - athenahealth, eClinicalWorks (medical)
   - And many more
4. Test the sync to verify:
   - Patient data flows correctly
   - Appointments sync both ways
   - Provider schedules are accurate
5. Enable real-time sync`,
        tip: 'EHR integration is critical - make sure bidirectional sync works before going live.'
      },
      {
        title: 'Configure Online Scheduling',
        content: `Set up patient self-scheduling:

1. Go to Settings > Scheduling
2. Define your appointment types:
   - Name (e.g., "New Patient Exam")
   - Duration
   - Which providers offer it
   - Buffer time between appointments
3. Set scheduling rules:
   - How far in advance patients can book
   - Required lead time
   - Cancellation policy
4. Configure provider availability
5. Set up scheduling page branding`,
        tip: 'Start with your most common appointment types - you can add more later.'
      },
      {
        title: 'Set Up Automated Reminders',
        content: `Configure appointment reminders:

1. Go to Settings > Reminders
2. Set up reminder sequence:
   - 1 week before: Email confirmation
   - 2 days before: SMS reminder
   - 1 day before: Final reminder
   - Day of: Morning reminder (optional)
3. Customize message content
4. Include:
   - Appointment details
   - Office address
   - Cancellation instructions
   - Pre-appointment instructions
5. Enable two-way texting for responses`,
        tip: 'SMS reminders have higher engagement than email - use both for best results.'
      },
      {
        title: 'Configure Waitlist Management',
        content: `Fill cancelled slots automatically:

1. Go to Settings > Waitlist
2. Enable waitlist feature
3. Configure how patients join:
   - Option when booking
   - Staff can add patients
4. Set notification preferences:
   - Automatic offers when slots open
   - Time limit to respond
   - Automatic rebooking or manual approval
5. Track waitlist performance in reports`,
        tip: 'Waitlist management can significantly reduce no-show revenue loss.'
      },
      {
        title: 'Set Up Review Management',
        content: `Collect and manage patient reviews:

1. Go to Settings > Reviews
2. Connect your review platforms:
   - Google Business
   - Healthgrades
   - Yelp (if applicable)
3. Set up automated review requests:
   - When to send (after appointment)
   - Message content
   - Which platforms to direct to
4. Monitor incoming reviews
5. Set up alerts for new reviews
6. Respond to reviews from the dashboard`,
        tip: 'Time review requests carefully - shortly after positive interactions works best.'
      },
      {
        title: 'Launch and Train Staff',
        content: `Go live with NexHealth:

1. Train front desk staff on:
   - Managing appointments in NexHealth
   - Handling online booking notifications
   - Two-way patient texting
   - Waitlist management
2. Train providers on their schedules
3. Update your website with online booking link
4. Monitor closely during first weeks
5. Gather feedback and adjust settings
6. Review analytics to optimize`,
        tip: 'Designate a "NexHealth champion" on staff to become the expert and help others.'
      }
    ],
    tips: [
      'NexHealth is HIPAA compliant with BAA included',
      'EHR integration is the key to success - prioritize getting this right',
      'Start with core features before adding advanced automation',
      'Two-way texting improves patient communication significantly',
      'Review analytics regularly to optimize reminder timing and messaging',
      'Waitlist feature can recover significant revenue from cancellations',
      'Patient satisfaction improves with self-service scheduling options'
    ]
  },

  'emitrr': {
    toolId: 'emitrr',
    overview: 'Emitrr is an all-in-one patient communication platform with AI-powered scheduling, VoIP calling, two-way texting, and automated reminders. It\'s designed to be affordable for small to medium practices.',
    timeEstimate: '30-45 minutes',
    prerequisites: [
      'Email address for account creation',
      'Practice phone number (can port existing or get new)',
      'List of appointment types',
      'Staff who will use the system'
    ],
    steps: [
      {
        title: 'Sign Up for Emitrr',
        content: `1. Go to emitrr.com
2. Click "Get Started" or "Start Free Trial"
3. Enter your practice information:
   - Practice name
   - Your name and role
   - Email and phone
   - Practice size
4. Select features you're interested in:
   - Scheduling
   - Two-way texting
   - VoIP phone
   - Automated reminders
5. Complete signup and verify email`,
        tip: 'Emitrr is known for affordability - ask about pricing for small practices.'
      },
      {
        title: 'Set Up Your Phone System',
        content: `Configure VoIP calling:

1. Choose your phone setup:
   - Port existing number (keeps your current number)
   - Get a new number from Emitrr
2. If porting:
   - Provide current carrier info
   - Authorize the port
   - Wait for transfer (can take days)
3. Set up phone tree/IVR:
   - "Press 1 for appointments"
   - "Press 2 for billing"
   - After-hours routing
4. Configure voicemail
5. Test incoming and outgoing calls`,
        tip: 'Keep your existing number if patients know it - porting is worth the wait.'
      },
      {
        title: 'Configure Two-Way Texting',
        content: `Set up SMS communication:

1. Go to Settings > Messaging
2. Your phone number is already text-enabled
3. Set up auto-responses:
   - Business hours acknowledgment
   - After-hours message
   - Common keywords (STOP, HELP)
4. Create message templates:
   - Appointment confirmations
   - Reminder messages
   - Follow-up texts
5. Set up text-to-landline if needed
6. Test by texting your Emitrr number`,
        tip: 'Patients increasingly prefer texting over calling - embrace this channel.'
      },
      {
        title: 'Set Up Appointment Scheduling',
        content: `Configure your scheduling system:

1. Go to Settings > Scheduling
2. Add your providers and their schedules
3. Create appointment types:
   - Name and duration
   - Which providers offer it
   - Color coding
4. Set availability windows
5. Configure booking rules:
   - Advance booking limits
   - Buffer times
   - Cancellation policy
6. Enable online booking if desired`,
        tip: 'Start simple with a few appointment types - you can add complexity later.'
      },
      {
        title: 'Configure Automated Reminders',
        content: `Set up reminder automation:

1. Go to Settings > Reminders
2. Create your reminder sequence:
   - Text reminder 48 hours before
   - Text reminder 24 hours before
   - Email confirmation when booked
3. Customize messages:
   - Include appointment date/time
   - Provider name
   - Office location
   - Confirmation/cancellation options
4. Enable confirmation tracking
5. Set up no-show follow-up messages`,
        tip: 'Text reminders at 48 and 24 hours significantly reduce no-shows.'
      },
      {
        title: 'Set Up the AI Chatbot',
        content: `Configure Emitrr's AI assistant:

1. Go to Settings > AI Chatbot
2. Enable the chatbot feature
3. Configure what it can handle:
   - Scheduling appointments
   - Answering FAQs
   - Office hours and location
   - Routing to staff for complex issues
4. Train on your practice information
5. Set handoff rules for human escalation
6. Test the chatbot via your text number`,
        tip: 'Start with simple queries and expand the chatbot\'s capabilities over time.'
      },
      {
        title: 'Train Staff and Go Live',
        content: `Prepare your team:

1. Train front desk on:
   - The Emitrr dashboard
   - Handling text conversations
   - Managing the phone system
   - Appointment scheduling
2. Download mobile apps for on-the-go access
3. Run parallel with old system briefly
4. Go fully live
5. Monitor and adjust:
   - Response times
   - Patient feedback
   - No-show rates
6. Weekly review of analytics`,
        tip: 'Mobile apps let staff respond to texts even when away from the desk.'
      }
    ],
    tips: [
      'Emitrr is HIPAA compliant - safe for patient communication',
      'All-in-one approach simplifies your tech stack',
      'Two-way texting has highest patient engagement',
      'VoIP lets staff make calls from anywhere via app',
      'AI chatbot can handle routine inquiries automatically',
      'Start with core features and add AI/automation gradually',
      'Affordable for small practices compared to enterprise solutions'
    ]
  },

  'touchmd': {
    toolId: 'touchmd',
    overview: 'TouchMD is an iPad-based consultation system for plastic surgeons and aesthetic practices. It features before/after simulation, procedure visualization, consent management, and patient education - all designed to enhance consultations and increase case acceptance.',
    timeEstimate: '1-2 hours',
    prerequisites: [
      'iPad(s) for consultation rooms',
      'Practice photos and content',
      'Consent form documents',
      'Credit card for subscription'
    ],
    steps: [
      {
        title: 'Contact TouchMD and Sign Up',
        content: `TouchMD requires a sales consultation:

1. Go to touchmd.com
2. Click "Request Demo" or "Contact Us"
3. Provide:
   - Practice name and location
   - Your specialty (plastic surgery, aesthetics, etc.)
   - Number of providers
   - Current consultation process
4. Schedule a demo to see the platform
5. Work with sales on pricing and setup
6. Sign agreement and HIPAA BAA`,
        tip: 'Ask about implementation support - many practices benefit from hands-on setup help.'
      },
      {
        title: 'Set Up Your iPad System',
        content: `Configure your iPads:

1. Use dedicated iPads for TouchMD (recommended)
2. Download the TouchMD app from App Store
3. Log in with your practice credentials
4. Configure each iPad:
   - Assign to consultation rooms
   - Set up provider profiles
   - Configure default settings
5. Connect to your practice WiFi
6. Enable necessary permissions (camera, photos)`,
        tip: 'Dedicated iPads ensure they\'re always ready for consultations and avoid personal data mixing.'
      },
      {
        title: 'Add Your Procedure Content',
        content: `Build your educational library:

1. Access the content management system
2. Add procedures you offer:
   - Rhinoplasty
   - Breast augmentation
   - Facelifts
   - Injectables
   - Body contouring
3. For each procedure, add:
   - Description and benefits
   - Before/after photos
   - Recovery timeline
   - Risks and considerations
4. TouchMD provides baseline content to customize
5. Add your own photography and videos`,
        tip: 'High-quality before/after photos are crucial - invest in good photography.'
      },
      {
        title: 'Configure Simulation Features',
        content: `Set up before/after visualization:

1. Enable simulation tools for relevant procedures
2. Configure simulation parameters:
   - Breast augmentation sizing
   - Rhinoplasty morphing
   - Body contouring visualization
3. Practice using the simulation tools
4. Understand limitations to set patient expectations
5. Set up photo capture workflow:
   - Standard angles
   - Lighting requirements
   - Photo storage settings`,
        tip: 'Simulations help patients visualize results, but always manage expectations about limitations.'
      },
      {
        title: 'Set Up Consent Management',
        content: `Digitize your consent process:

1. Go to Consent Forms section
2. Upload your consent documents:
   - General surgical consent
   - Procedure-specific consents
   - Financial agreements
   - Photo release forms
3. Configure electronic signature capture
4. Set up consent workflows:
   - Which forms for which procedures
   - Required signatures
   - Witness requirements
5. Test the signing process on iPad`,
        tip: 'Digital consent is faster and creates better documentation than paper.'
      },
      {
        title: 'Train Your Team',
        content: `Prepare staff for TouchMD consultations:

1. Train consultation coordinators:
   - iPad operation basics
   - Navigating procedure content
   - Using simulation tools
   - Capturing signatures
2. Train surgeons/providers:
   - Using during consultations
   - Simulation demonstrations
   - Patient education features
3. Create standard consultation workflow
4. Practice consultations with role-play
5. Document your processes`,
        tip: 'Consistent use across all consultations maximizes the investment.'
      },
      {
        title: 'Launch and Optimize',
        content: `Go live with TouchMD:

1. Start using in all consultations
2. Track metrics:
   - Consultation duration
   - Case acceptance rates
   - Patient feedback
3. Gather patient reactions to the technology
4. Refine your content based on what resonates
5. Add new procedures and content over time
6. Keep before/after gallery updated`,
        tip: 'Track case acceptance before and after implementation to measure ROI.'
      }
    ],
    tips: [
      'TouchMD is HIPAA compliant for patient photos and information',
      'Simulations help patients visualize but always manage expectations',
      'High-quality before/after photos significantly impact consultations',
      'Digital consent streamlines paperwork and improves documentation',
      'iPad-based presentation appears professional and high-tech',
      'Use consistently in all consultations to maximize ROI',
      'Keep content updated with new procedures and photos'
    ]
  },

  'aesthetix-crm': {
    toolId: 'aesthetix-crm',
    overview: 'Aesthetix CRM is a specialized customer relationship management system for plastic surgery and aesthetic practices. It features AI-powered lead management, intake automation, marketing tools, and integrations with popular EMRs like ModMed and Nextech.',
    timeEstimate: '2-4 hours',
    prerequisites: [
      'Practice admin access',
      'Current lead sources (website forms, phone inquiries)',
      'EMR credentials for integration (if applicable)',
      'Marketing materials and content',
      'Team responsible for lead follow-up'
    ],
    steps: [
      {
        title: 'Request Demo and Sign Up',
        content: `Aesthetix CRM uses consultative sales:

1. Go to aesthetixcrm.com
2. Click "Request Demo" or "Get Started"
3. Provide practice information:
   - Practice name and specialty
   - Number of providers
   - Current CRM/lead management (if any)
   - EMR system
4. Schedule a demo call
5. Review proposal and pricing
6. Sign agreement including HIPAA BAA`,
        tip: 'Come prepared with questions about your specific workflow and integration needs.'
      },
      {
        title: 'Configure Lead Sources',
        content: `Set up how leads enter your CRM:

1. Website Integration
   - Add Aesthetix forms to your website
   - Or connect existing forms to Aesthetix
2. Phone Integration
   - Configure call tracking numbers
   - Route calls to the system
3. Social Media
   - Connect Facebook/Instagram lead forms
   - Set up messenger integration
4. Manual Entry
   - Train staff on adding walk-in leads
5. Test all lead sources to verify data flows correctly`,
        tip: 'Capture leads from all sources - website, phone, social, and walk-ins - for complete visibility.'
      },
      {
        title: 'Set Up AI Lead Scoring',
        content: `Configure intelligent lead prioritization:

1. Go to Settings > Lead Scoring
2. Define scoring criteria:
   - Procedure interest (high-value procedures score higher)
   - Budget indicators
   - Timeline urgency
   - Engagement level
3. Set score thresholds:
   - Hot leads (immediate follow-up)
   - Warm leads (follow-up within 24 hours)
   - Cold leads (nurture sequence)
4. Configure AI learning from your conversions
5. Review and adjust weights over time`,
        tip: 'AI scoring improves over time - review which leads convert and adjust criteria.'
      },
      {
        title: 'Connect Your EMR',
        content: `Integrate with your practice management system:

1. Go to Settings > Integrations
2. Select your EMR:
   - ModMed
   - Nextech
   - 4D EMR
   - Others may be available
3. Follow authentication steps
4. Configure data sync:
   - Lead to patient conversion
   - Appointment data
   - Procedure history
5. Test the integration:
   - Create test lead
   - Convert to patient
   - Verify EMR sync`,
        tip: 'EMR integration prevents duplicate entry and keeps patient records consistent.'
      },
      {
        title: 'Set Up Automated Follow-Up',
        content: `Configure lead nurturing automation:

1. Go to Automation > Workflows
2. Create follow-up sequences:
   - New lead: Immediate email + task for call
   - No response: Day 2 follow-up text
   - No response: Day 5 follow-up email
   - Long-term nurture: Monthly touchpoints
3. Set up appointment reminders
4. Create post-consultation follow-up
5. Build re-engagement campaigns for cold leads
6. Test all automated sequences`,
        tip: 'Speed to first contact is crucial - automate immediate responses while staff prepares to call.'
      },
      {
        title: 'Configure Intake Automation',
        content: `Streamline patient intake:

1. Go to Settings > Intake
2. Create digital intake forms:
   - Contact information
   - Procedure interests
   - Medical history basics
   - Consultation preferences
3. Set up automatic sending:
   - When consultation is booked
   - Reminder if not completed
4. Configure data flow:
   - Intake to CRM
   - CRM to EMR (if integrated)
5. Create staff alerts for completed intake`,
        tip: 'Pre-visit intake saves consultation time and makes patients feel prepared.'
      },
      {
        title: 'Train Your Team',
        content: `Prepare staff for success:

1. Train consultation coordinators:
   - Managing the lead queue
   - Following up effectively
   - Converting leads to consultations
   - Using templates and scripts
2. Train front desk:
   - Entering walk-in leads
   - Managing appointments
   - Intake process
3. Train management:
   - Reporting and analytics
   - Pipeline management
   - Performance tracking
4. Create SOPs for common workflows`,
        tip: 'Consistent team adoption is key - set expectations and track CRM usage.'
      },
      {
        title: 'Launch and Monitor',
        content: `Go live and optimize:

1. Import existing leads (if migrating from another system)
2. Start capturing new leads
3. Monitor key metrics:
   - Lead response time
   - Conversion rates by source
   - Pipeline value
   - No-show rates
4. Weekly pipeline reviews
5. Monthly reporting to leadership
6. Continuously optimize:
   - Refine lead scoring
   - Improve automation sequences
   - A/B test messaging`,
        tip: 'Schedule weekly pipeline reviews to keep leads moving and identify bottlenecks.'
      }
    ],
    tips: [
      'Aesthetix CRM is HIPAA compliant for healthcare practice use',
      'Speed to lead is critical - aim for contact within 5 minutes',
      'AI lead scoring improves over time as it learns from your conversions',
      'EMR integration eliminates duplicate data entry',
      'Automated follow-up ensures no leads fall through the cracks',
      'Track ROI by source to optimize marketing spend',
      'Regular pipeline reviews keep the team accountable'
    ]
  },

  'miiskin': {
    toolId: 'miiskin',
    overview: 'Miiskin provides AI-powered skin lesion analysis with patient photo documentation and change tracking over time. Ideal for dermatology practices wanting to enhance mole monitoring and patient engagement.',
    timeEstimate: '1-2 hours',
    prerequisites: [
      'Dermatology practice credentials',
      'Smartphones or tablets for photo capture',
      'Patient consent forms for photography',
      'Staff training time'
    ],
    steps: [
      {
        title: 'Contact Miiskin for Practice Setup',
        content: `Miiskin offers both patient and practice solutions:

1. Go to miiskin.com
2. Navigate to the Professional/Practice section
3. Request information or demo
4. Provide:
   - Practice name and location
   - Number of dermatologists
   - Current photo documentation process
   - Interest in AI analysis features
5. Schedule a demonstration
6. Review pricing and sign agreement with BAA`,
        tip: 'Miiskin has both patient-facing apps and professional practice tools - clarify which you need.'
      },
      {
        title: 'Set Up Your Practice Account',
        content: `Configure your Miiskin practice system:

1. Receive practice credentials from Miiskin
2. Log in to the practice portal
3. Add your providers:
   - Names and credentials
   - Specialties
   - Scheduling preferences
4. Configure practice settings:
   - Photo storage preferences
   - AI analysis settings
   - Report formats
5. Set up user permissions for staff`,
        tip: 'Assign clear roles - who can take photos, who can access AI analysis, who manages patient data.'
      },
      {
        title: 'Configure Photo Documentation Workflow',
        content: `Set up your imaging protocol:

1. Define standard photo angles:
   - Full body mapping views
   - Close-up lesion shots
   - Dermoscopy attachments (if used)
2. Set up capture devices:
   - Download Miiskin app on devices
   - Configure camera settings
   - Test image quality
3. Create workflow:
   - When photos are taken (check-in, during exam)
   - Who takes photos
   - Where photos are stored
4. Train on proper technique`,
        tip: 'Consistent photo angles and lighting are essential for accurate change tracking over time.'
      },
      {
        title: 'Understand AI Lesion Analysis',
        content: `Learn how Miiskin's AI works:

1. Review AI capabilities:
   - Lesion detection
   - Risk assessment indicators
   - Change detection over time
2. Understand limitations:
   - AI is decision support, not diagnosis
   - Clinical judgment always takes precedence
   - False positives and negatives occur
3. Configure AI settings:
   - Sensitivity levels
   - Alert thresholds
   - Report preferences
4. Decide how to present AI findings to patients`,
        tip: 'AI is a tool to assist clinical judgment, never a replacement for dermatologist expertise.'
      },
      {
        title: 'Set Up Patient Onboarding',
        content: `Configure patient engagement:

1. Create patient consent forms:
   - Photography consent
   - Data storage consent
   - AI analysis consent
2. Set up patient accounts (if using patient-facing features)
3. Configure patient communications:
   - Appointment reminders
   - Self-monitoring instructions
   - Results notifications
4. Create patient education materials:
   - How to use Miiskin at home (if applicable)
   - What AI analysis means
   - When to contact the office`,
        tip: 'Clear patient consent and education prevents misunderstandings about AI capabilities.'
      },
      {
        title: 'Train Clinical Staff',
        content: `Prepare your team:

1. Train on photo capture:
   - Proper technique
   - Consistent angles
   - Lighting requirements
   - Dermoscopy attachment use
2. Train on AI interpretation:
   - Understanding risk scores
   - Integrating with clinical assessment
   - Documenting findings
3. Train on patient communication:
   - Explaining AI to patients
   - Managing expectations
   - Follow-up protocols
4. Create reference guides and checklists`,
        tip: 'Hands-on practice with test patients builds confidence before using with real patients.'
      },
      {
        title: 'Implement Change Tracking',
        content: `Leverage longitudinal monitoring:

1. Set up baseline documentation:
   - Full body photos at initial visit
   - Individual lesion documentation
   - Dermoscopy images as needed
2. Configure follow-up protocols:
   - Recommended intervals
   - Automatic reminders
   - Change detection alerts
3. Review comparison features:
   - Side-by-side views
   - AI change detection
   - Measurement tools
4. Document clinical decisions based on changes`,
        tip: 'Consistent baseline documentation is essential for meaningful change detection later.'
      }
    ],
    tips: [
      'Miiskin is HIPAA compliant for medical imaging and patient data',
      'AI analysis is decision support - always apply clinical judgment',
      'Consistent photo technique is critical for accurate change tracking',
      'Patient engagement with self-monitoring can improve outcomes',
      'Document AI findings alongside clinical assessment',
      'Regular follow-up imaging enables meaningful comparisons',
      'Clear patient consent is essential before photography and AI analysis'
    ]
  },

  'fotofinder': {
    toolId: 'fotofinder',
    overview: 'FotoFinder provides clinical-grade total body mapping and AI lesion detection with the Moleanalyzer pro system. Validated at Heidelberg University with performance comparable to dermatologists, it\'s designed for practices needing the highest standard of skin imaging.',
    timeEstimate: '1-2 weeks (enterprise implementation)',
    prerequisites: [
      'Dermatology practice with space for imaging equipment',
      'Budget for enterprise medical imaging system',
      'IT infrastructure for data storage',
      'Staff time for training',
      'Executive approval for capital investment'
    ],
    steps: [
      {
        title: 'Request Consultation and Quote',
        content: `FotoFinder is enterprise medical equipment:

1. Go to fotofinder.de/en or contact regional distributor
2. Request a consultation
3. Provide information:
   - Practice size and patient volume
   - Current imaging capabilities
   - Specific needs (total body mapping, dermoscopy, etc.)
   - Space available for equipment
4. Schedule an on-site or virtual demonstration
5. Receive detailed proposal with:
   - Hardware specifications
   - Software licensing
   - Training and support
   - Pricing`,
        tip: 'FotoFinder is a significant investment - involve practice leadership in the evaluation.'
      },
      {
        title: 'Plan Your Implementation',
        content: `Prepare for equipment installation:

1. Work with FotoFinder on implementation plan
2. Prepare physical space:
   - Dedicated room for body mapping
   - Proper lighting (may need modifications)
   - Privacy considerations
   - Equipment placement
3. IT preparation:
   - Network connectivity
   - Data storage solution
   - EMR integration planning
   - Backup systems
4. Staff scheduling for training
5. Set timeline with key milestones`,
        tip: 'Space and IT preparation often take longer than expected - start early.'
      },
      {
        title: 'Equipment Installation',
        content: `Professional installation by FotoFinder:

1. Coordinate installation date
2. FotoFinder technicians will:
   - Install imaging hardware
   - Set up software systems
   - Configure network connections
   - Calibrate equipment
3. Verify all systems working:
   - Total body scanner (if included)
   - Dermoscopy devices
   - Software interface
   - Image storage
4. Document equipment for warranty`,
        tip: 'Have key staff present during installation to learn the system from the beginning.'
      },
      {
        title: 'Configure Moleanalyzer Pro AI',
        content: `Set up AI analysis capabilities:

1. Review Moleanalyzer pro features:
   - AI lesion analysis
   - Risk scoring
   - Comparison tools
   - Validated performance data
2. Configure AI settings:
   - Sensitivity thresholds
   - Alert preferences
   - Report formats
3. Understand the validation:
   - Heidelberg University study
   - Performance compared to dermatologists
   - Appropriate clinical use
4. Set protocols for AI-assisted diagnosis`,
        tip: 'Review the clinical validation studies to understand AI capabilities and limitations.'
      },
      {
        title: 'EMR Integration',
        content: `Connect FotoFinder to your practice systems:

1. Work with FotoFinder and your EMR vendor
2. Configure integration:
   - Patient demographics sync
   - Image transfer to patient records
   - Report integration
3. Set up workflow:
   - Patient check-in triggers
   - Image association with visits
   - Report storage
4. Test thoroughly:
   - Create test patients
   - Capture and transfer images
   - Verify in EMR
5. Document integration for support`,
        tip: 'EMR integration streamlines workflow - prioritize getting this working smoothly.'
      },
      {
        title: 'Staff Training',
        content: `Comprehensive training program:

1. FotoFinder provides professional training:
   - Equipment operation
   - Software navigation
   - AI interpretation
   - Maintenance procedures
2. Role-specific training:
   - Imaging technicians: capture protocols
   - Dermatologists: AI interpretation, clinical workflow
   - Front desk: scheduling, patient prep
3. Practice with test patients
4. Certification if required
5. Document procedures and create quick guides`,
        tip: 'Invest in thorough training - the system\'s value depends on proper use.'
      },
      {
        title: 'Pilot and Full Deployment',
        content: `Gradual rollout for success:

1. Start with pilot phase:
   - Selected patients
   - Limited schedule
   - Extra time per patient
2. Gather feedback and refine workflow
3. Address issues before full launch
4. Expand to full deployment:
   - All appropriate patients
   - Full schedule
   - Standard workflows
5. Monitor outcomes:
   - Detection rates
   - Patient satisfaction
   - Workflow efficiency
6. Ongoing optimization and updates`,
        tip: 'Pilot phase catches issues before they affect full patient volume.'
      }
    ],
    tips: [
      'FotoFinder is a significant capital investment - evaluate ROI carefully',
      'Moleanalyzer pro AI is clinically validated but supplements, not replaces, clinical judgment',
      'Total body mapping enables meaningful longitudinal tracking',
      'Proper training is essential for accurate imaging and AI interpretation',
      'EMR integration significantly improves clinical workflow',
      'Space and IT preparation often determine implementation timeline',
      'Consider patient demand and willingness to pay when evaluating ROI',
      'Regular equipment maintenance ensures consistent image quality'
    ]
  }
};

export function getGuideByToolId(toolId: string): Guide | undefined {
  return guides[toolId];
}

export function hasGuide(toolId: string): boolean {
  return toolId in guides;
}
