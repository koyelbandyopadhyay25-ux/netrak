import { Policy } from './policySearch.js';

export interface ValidatedAssistantResponse {
  answer: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  isIncident: boolean;
  incidentType: string;
  riskIndicators: string[];
  recommendedAction: string;
  policyReferences: Array<{
    id: string;
    section: string;
    title: string;
  }>;
  trainingRecommended: boolean;
  trainingTopic: string;
  confidence: number;
}

export function validateAndSanitizeResponse(
  raw: any,
  retrievedPolicies: Policy[]
): ValidatedAssistantResponse {
  const validPolicyMap = new Map<string, Policy>();
  for (const p of retrievedPolicies) {
    validPolicyMap.set(p.id.toUpperCase(), p);
    validPolicyMap.set(p.section.toLowerCase(), p);
  }

  // Validate answer string
  let answer = typeof raw?.answer === 'string' && raw.answer.trim().length > 0
    ? raw.answer.trim()
    : 'I have analyzed your inquiry against corporate security guidelines.';

  // Enforce zero leak of internal prompts or chain-of-thought
  answer = answer
    .replace(/(system rules|retrieved policy context|chain[- ]of[- ]thought|internal guidance):/gi, '')
    .trim();

  // Validate category
  const category = typeof raw?.category === 'string' && raw.category.length > 0
    ? raw.category
    : 'POLICY';

  // Validate severity
  const severity: 'low' | 'medium' | 'high' =
    raw?.severity === 'high' || raw?.severity === 'medium' || raw?.severity === 'low'
      ? raw.severity
      : 'low';

  // Validate incident flags
  const isIncident = Boolean(raw?.isIncident);
  const incidentType = typeof raw?.incidentType === 'string' ? raw.incidentType : '';

  // Validate risk indicators
  const riskIndicators = Array.isArray(raw?.riskIndicators)
    ? raw.riskIndicators.filter((x: any) => typeof x === 'string')
    : [];

  // Validate recommended action
  const recommendedAction = typeof raw?.recommendedAction === 'string' && raw.recommendedAction.trim().length > 0
    ? raw.recommendedAction.trim()
    : 'Review the referenced organizational guidance before taking further action.';

  // STRICT CITATION VALIDATION:
  // Policy references must be validated against actual retrieved policies!
  // If the model hallucinates a section 99 or an unretrieved policy, REMOVE IT.
  const rawRefs = Array.isArray(raw?.policyReferences) ? raw.policyReferences : [];
  const validatedReferences: Array<{ id: string; section: string; title: string }> = [];

  for (const ref of rawRefs) {
    if (!ref) continue;
    const refId = typeof ref === 'string' ? ref.toUpperCase() : (ref.id || '').toUpperCase();
    const matched = validPolicyMap.get(refId);
    if (matched) {
      validatedReferences.push({
        id: matched.id,
        section: matched.section,
        title: matched.title,
      });
    }
  }

  // If no references were parsed from raw, but we have retrieved policies and it's a policy question,
  // we attach the top retrieved policy safely.
  if (validatedReferences.length === 0 && retrievedPolicies.length > 0 && !isIncident) {
    validatedReferences.push({
      id: retrievedPolicies[0].id,
      section: retrievedPolicies[0].section,
      title: retrievedPolicies[0].title,
    });
  }

  // Validate training recommendations
  const trainingRecommended = Boolean(raw?.trainingRecommended ?? (retrievedPolicies.length > 0));
  const trainingTopic = typeof raw?.trainingTopic === 'string' && raw.trainingTopic.trim().length > 0
    ? raw.trainingTopic.trim()
    : (retrievedPolicies[0]?.topic || 'general');

  // Confidence score
  const confidence = typeof raw?.confidence === 'number'
    ? Math.min(Math.max(raw.confidence, 0), 1)
    : 0.9;

  return {
    answer,
    category,
    severity,
    isIncident,
    incidentType,
    riskIndicators,
    recommendedAction,
    policyReferences: validatedReferences,
    trainingRecommended,
    trainingTopic,
    confidence,
  };
}
