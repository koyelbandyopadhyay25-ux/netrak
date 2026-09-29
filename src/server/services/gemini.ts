import { GoogleGenAI, Type } from '@google/genai';
import { Policy } from './policySearch.js';
import { detectIncident } from './riskDetector.js';
import { routeIntent } from './intentRouter.js';
import { retrievePolicyContext } from './retrievalService.js';
import { validateAndSanitizeResponse, ValidatedAssistantResponse } from './responseValidator.js';

let genAI: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAI;
}

/**
 * Fallback deterministic synthesis when Gemini is unavailable, offline, or experiencing rate-limits.
 * Keeps hackathon demos 100% resilient and grounded in corporate policy without crashing.
 */
function buildDeterministicResponse(
  question: string,
  retrievedPolicies: Policy[],
  intent: ReturnType<typeof routeIntent>,
  incident: ReturnType<typeof detectIncident>
): ValidatedAssistantResponse {
  // 1. Prompt Injection Defense
  if (intent.isPromptInjection) {
    return {
      answer: "I cannot disregard my guidelines, invent fictitious organizational policies, or fabricate policy sections. NETRAK strictly references verified corporate policy repositories.",
      category: "SECURITY_VIOLATION",
      severity: "low",
      isIncident: false,
      incidentType: "",
      riskIndicators: ["Adversarial instruction override attempt detected"],
      recommendedAction: "Use NETRAK to query authentic corporate policies and security procedures.",
      policyReferences: [],
      trainingRecommended: false,
      trainingTopic: "",
      confidence: 1.0,
    };
  }

  // 2. Incident escalation
  if (incident.isIncident) {
    return {
      answer: `Stop here for a moment — this may need immediate action. We have detected indicators of a possible security incident (${incident.incidentType}). Please isolate your workstation and report the event immediately so the security team can assist.`,
      category: "INCIDENT",
      severity: incident.severity,
      isIncident: true,
      incidentType: incident.incidentType,
      riskIndicators: incident.riskIndicators,
      recommendedAction: incident.recommendedAction,
      policyReferences: retrievedPolicies.slice(0, 1).map((p) => ({
        id: p.id,
        section: p.section,
        title: p.title,
      })),
      trainingRecommended: true,
      trainingTopic: "incident response",
      confidence: 0.98,
    };
  }

  // 3. Unknown policy questions (e.g. "Can I ride my bicycle into the office?")
  if (intent.isUnknown || retrievedPolicies.length === 0) {
    return {
      answer: "I don't have enough information in the supplied organization policy to answer that confidently. Please check with your team lead, facilities team, or HR for guidance on this topic.",
      category: "UNKNOWN",
      severity: "low",
      isIncident: false,
      incidentType: "",
      riskIndicators: [],
      recommendedAction: "Consult the corporate intranet or contact facilities/HR directly.",
      policyReferences: [],
      trainingRecommended: false,
      trainingTopic: "",
      confidence: 0.5,
    };
  }

  // 4. Policy-grounded answer
  const topPolicy = retrievedPolicies[0];
  const isHighRiskTopic = /upload|paste|share|personal|public|unapproved|download/i.test(question);
  const severity = isHighRiskTopic ? 'high' : 'medium';

  const answer = `I wouldn't recommend doing that. Under corporate policy (${topPolicy.section} - ${topPolicy.title}), ${topPolicy.rule} ${topPolicy.explanation}`;

  return {
    answer,
    category: topPolicy.topic.toUpperCase().replace(/\s+/g, '_'),
    severity,
    isIncident: false,
    incidentType: "",
    riskIndicators: [
      `Potential non-compliance with ${topPolicy.section} (${topPolicy.title})`
    ],
    recommendedAction: `Keep all corporate data within approved enterprise systems as required by ${topPolicy.section}.`,
    policyReferences: retrievedPolicies.slice(0, 2).map((p) => ({
      id: p.id,
      section: p.section,
      title: p.title,
    })),
    trainingRecommended: true,
    trainingTopic: topPolicy.topic.toLowerCase(),
    confidence: 0.92,
  };
}

export async function processSecurityQuery(question: string): Promise<ValidatedAssistantResponse> {
  const sanitizedInput = (question || '').trim();
  if (!sanitizedInput) {
    return {
      answer: "Please enter a cybersecurity or policy question to receive NETRAK guidance.",
      category: "GENERAL",
      severity: "low",
      isIncident: false,
      incidentType: "",
      riskIndicators: [],
      recommendedAction: "Type your security or policy dilemma in the prompt box.",
      policyReferences: [],
      trainingRecommended: false,
      trainingTopic: "",
      confidence: 1.0,
    };
  }

  // Step 1 & 2: Deterministic Incident Detection
  const incidentCheck = detectIncident(sanitizedInput);

  // Step 3: Policy Retrieval (Top 3 Chunks Max)
  const retrieval = await retrievePolicyContext(sanitizedInput);

  // Step 4: Deterministic Intent Classification
  const intent = routeIntent(sanitizedInput, retrieval.found);

  // If prompt injection or immediate incident, we can serve deterministic safely or augment
  if (intent.isPromptInjection) {
    return buildDeterministicResponse(sanitizedInput, [], intent, incidentCheck);
  }

  // If incident detected deterministically, escalate immediately
  if (incidentCheck.isIncident) {
    return buildDeterministicResponse(sanitizedInput, retrieval.policies, intent, incidentCheck);
  }

  // Step 5: Check if question is outside security policy domain
  if (intent.isUnknown && !retrieval.found) {
    return buildDeterministicResponse(sanitizedInput, [], intent, incidentCheck);
  }

  // Step 6: Query Gemini using server-side SDK
  const ai = getAIClient();
  if (!ai) {
    // Graceful offline fallback
    return buildDeterministicResponse(sanitizedInput, retrieval.policies, intent, incidentCheck);
  }

  try {
    const policyChunksContext = retrieval.formattedContext;

    const systemInstruction = `You are NETRAK, a specialized Security Awareness Decision Assistant.
Your mission is to help employees make safe, policy-compliant cybersecurity decisions in a calm, helpful, human colleague tone.

CRITICAL RULES:
1. Use supplied organization policy as the authoritative source.
2. NEVER invent policies, policy sections, policy titles, citations, or organizational procedures.
3. If the supplied policy context does NOT contain enough information, state:
   "I don't have enough information in the supplied organization policy to answer that confidently."
4. Never ask for passwords, API keys, tokens, recovery codes, or credentials.
5. Sound human-like and constructive:
   - Avoid "You are forbidden to do X" or "ACCESS DENIED".
   - Prefer: "I wouldn't do that. The supplied policy requires confidential files to stay within approved systems. Here is the safer option..."
6. You must return only valid JSON adhering to the specified schema.
7. Under policyReferences, cite ONLY policy IDs that explicitly appear in the supplied POLICY CONTEXT.`;

    const promptText = `
=== SYSTEM RULES ===
Ground your response strictly in the retrieved policy chunks below. Do not fabricate citations.

=== RETRIEVED POLICY CONTEXT ===
${policyChunksContext}

=== USER QUESTION ===
"${sanitizedInput}"
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: {
              type: Type.STRING,
              description: 'Helpful, human-centric security guidance directly answering the user question.',
            },
            category: {
              type: Type.STRING,
              description: 'Security category e.g. POLICY, PHISHING, DATA_SHARING, AI_SECURITY, IDENTITY.',
            },
            severity: {
              type: Type.STRING,
              description: 'Risk level: low, medium, or high.',
            },
            isIncident: {
              type: Type.BOOLEAN,
              description: 'True if user reports an active security event or compromised credential.',
            },
            incidentType: {
              type: Type.STRING,
              description: 'Type of incident if detected.',
            },
            riskIndicators: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Specific security risks associated with this action.',
            },
            recommendedAction: {
              type: Type.STRING,
              description: 'Clear, actionable, safer next step for the employee.',
            },
            policyReferences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  section: { type: Type.STRING },
                  title: { type: Type.STRING },
                },
                required: ['id'],
              },
              description: 'Referenced policy IDs strictly from retrieved policy context.',
            },
            trainingRecommended: {
              type: Type.BOOLEAN,
              description: 'Whether a micro-lesson is recommended.',
            },
            trainingTopic: {
              type: Type.STRING,
              description: 'Topic for micro-learning.',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence rating between 0 and 1.',
            },
          },
          required: [
            'answer',
            'category',
            'severity',
            'isIncident',
            'riskIndicators',
            'recommendedAction',
            'policyReferences',
            'trainingRecommended',
            'trainingTopic',
            'confidence',
          ],
        },
      },
    });

    const rawJson = JSON.parse(response.text || '{}');
    // Step 7: Sanitize and strictly validate output and citations against retrieved policies
    return validateAndSanitizeResponse(rawJson, retrieval.policies);
  } catch (err) {
    console.warn('[NETRAK Gemini Service] API call fallback to deterministic synthesis:', err);
    return buildDeterministicResponse(sanitizedInput, retrieval.policies, intent, incidentCheck);
  }
}
