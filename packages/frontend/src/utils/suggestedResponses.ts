import { getToolById } from '../data/tools';

/**
 * Generate suggested responses based on the assistant's message content
 */
export function generateSuggestedResponses(messageContent: string): string[] {
  const suggestions: string[] = [];
  const lowerContent = messageContent.toLowerCase();

  // Check if the AI asked a question (ends with ?)
  const hasQuestion = messageContent.trim().endsWith('?');

  // Extract tool names from tool markers
  const toolPattern = /\[\[TOOL:([a-z0-9-]+)\]\]/g;
  const toolMatches = [...messageContent.matchAll(toolPattern)];
  const toolIds = toolMatches.map(m => m[1]);

  // If tools were recommended, suggest follow-ups
  if (toolIds.length > 0) {
    // Get the first tool ID mentioned and look up its name
    const firstToolId = toolIds[0];
    const tool = getToolById(firstToolId);
    const toolName = tool?.name || 'this tool';
    
    suggestions.push(`Tell me more about ${toolName}`);
    suggestions.push(`How do I set up ${toolName}?`);
  }

  // If AI asked about specialty, suggest common specialties
  if (hasQuestion && (lowerContent.includes('specialty') || lowerContent.includes('specialties'))) {
    suggestions.push('Plastic Surgery');
    suggestions.push('Dermatology');
    suggestions.push('Orthopedics');
    suggestions.push('General Practice');
  }

  // If AI asked about budget, suggest budget ranges
  if (hasQuestion && (lowerContent.includes('budget') || lowerContent.includes('cost') || lowerContent.includes('pricing'))) {
    suggestions.push('Looking for free options');
    suggestions.push('Budget under $100/month');
    suggestions.push('Budget is flexible');
  }

  // If AI asked about specific challenges/processes
  if (hasQuestion && (lowerContent.includes('challenge') || lowerContent.includes('process') || lowerContent.includes('time'))) {
    suggestions.push('Documentation takes too long');
    suggestions.push('Patient intake is tedious');
    suggestions.push('Scheduling is disorganized');
  }

  // If AI mentioned HIPAA compliance
  if (lowerContent.includes('hipaa') || lowerContent.includes('compliance')) {
    suggestions.push('Yes, HIPAA compliance is essential');
    suggestions.push('What does HIPAA compliant mean?');
  }

  // If no specific suggestions yet, add general helpful ones
  if (suggestions.length === 0) {
    // Check for documentation-related content
    if (lowerContent.includes('document') || lowerContent.includes('scribe') || lowerContent.includes('note')) {
      suggestions.push('How much time can I save?');
      suggestions.push('Which is the easiest to set up?');
    }
    // Check for intake-related content
    else if (lowerContent.includes('intake') || lowerContent.includes('form') || lowerContent.includes('questionnaire')) {
      suggestions.push('Can I customize the forms?');
      suggestions.push('How does it integrate with my EHR?');
    }
    // Check for scheduling-related content
    else if (lowerContent.includes('schedule') || lowerContent.includes('appointment') || lowerContent.includes('booking')) {
      suggestions.push('Does it work with my calendar?');
      suggestions.push('Can patients book online?');
    }
    // General follow-ups
    else {
      suggestions.push('What are my options?');
      suggestions.push('Which would work best for my practice?');
    }
  }

  // Limit to 3 suggestions max
  return suggestions.slice(0, 3);
}
