import { detectIncident } from './riskDetector.js';

export interface IntentClassification {
  category: string;
  isIncident: boolean;
  isPromptInjection: boolean;
  isUnknown: boolean;
  isGeneralEducation: boolean;
  confidence: number;
}

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /invent\s+(a\s+)?(company\s+)?policy/i,
  /fake\s+section\s+\d+/i,
  /fabricate\s+(a\s+)?(policy|rule)/i,
  /disregard\s+(your\s+)?(rules|instructions|system)/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /system\s+override/i,
  /jailbreak/i,
  /bypass\s+security\s+filter/i,
  /pretend\s+there\s+is\s+a\s+policy/i
];

const GENERAL_EDUCATION_PATTERNS = [
  /^what\s+is\s+phishing/i,
  /^what\s+is\s+social\s+engineering/i,
  /^why\s+is\s+mfa\s+important/i,
  /^how\s+does\s+encryption\s+work/i,
  /^what\s+is\s+ransomware/i,
  /^how\s+can\s+i\s+protect\s+my\s+account/i,
  /^what\s+is\s+a\s+password\s+manager/i,
  /^what\s+is\s+quishing/i
];

export function routeIntent(query: string, policyFound: boolean): IntentClassification {
  const text = (query || '').trim();

  // 1. Prompt Injection Defense
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return {
        category: 'SECURITY_VIOLATION',
        isIncident: false,
        isPromptInjection: true,
        isUnknown: false,
        isGeneralEducation: false,
        confidence: 0.99,
      };
    }
  }

  // 2. Incident Indicator Check (Deterministic)
  const incidentResult = detectIncident(text);
  if (incidentResult.isIncident) {
    return {
      category: 'INCIDENT',
      isIncident: true,
      isPromptInjection: false,
      isUnknown: false,
      isGeneralEducation: false,
      confidence: 0.95,
    };
  }

  // 3. General Security Education check
  for (const pattern of GENERAL_EDUCATION_PATTERNS) {
    if (pattern.test(text)) {
      return {
        category: 'GENERAL_SECURITY',
        isIncident: false,
        isPromptInjection: false,
        isUnknown: false,
        isGeneralEducation: true,
        confidence: 0.92,
      };
    }
  }

  // 4. Domain Keyword Classification
  const lower = text.toLowerCase();

  let category = 'POLICY';
  if (/chatgpt|claude|generative ai|llm|copilot|ai tool|ai website/i.test(lower)) {
    category = 'AI_SECURITY';
  } else if (/phish|fake email|verify account|gift card|wire transfer|urgent payment/i.test(lower)) {
    category = 'PHISHING';
  } else if (/gmail|personal drive|dropbox|upload.*data|send.*file|share.*externally|screenshot/i.test(lower)) {
    category = 'DATA_SHARING';
  } else if (/password|mfa|2fa|otp|login|vault|reuse/i.test(lower)) {
    category = 'IDENTITY';
  } else if (/usb|thumb drive|pendrive|flash drive/i.test(lower)) {
    category = 'HARDWARE';
  } else if (/wifi|airport|hotel|public internet/i.test(lower)) {
    category = 'PUBLIC_WIFI';
  } else if (/remote work|work from home|home pc|laptop unattended/i.test(lower)) {
    category = 'REMOTE_WORK';
  } else if (/github|repository|source code|api key|secret/i.test(lower)) {
    category = 'DEVELOPMENT_SECURITY';
  } else if (/clean desk|badge|tailgating|visitor|door/i.test(lower)) {
    category = 'PHYSICAL_SECURITY';
  }

  // If no policy found and not matching standard security questions, classify as UNKNOWN
  const isUnknown = !policyFound && !/(security|cyber|hack|breach|protect|safe|risk|phish|virus|firewall)/i.test(lower);

  return {
    category: isUnknown ? 'UNKNOWN' : category,
    isIncident: false,
    isPromptInjection: false,
    isUnknown,
    isGeneralEducation: false,
    confidence: policyFound ? 0.9 : 0.4,
  };
}
