export interface IncidentDetectionResult {
  isIncident: boolean;
  incidentType: string;
  severity: 'low' | 'medium' | 'high';
  riskIndicators: string[];
  immediateSafetyGuidance: string[];
  recommendedAction: string;
}

const INCIDENT_PATTERNS = [
  {
    type: 'credential-exposure',
    severity: 'high' as const,
    regex: /(entered|typed|provided|gave|shared).*(password|credential|login|mfa code|otp)|(clicked.*and.*(entered|password))|(compromised.*password)/i,
    indicator: 'Direct credential submission on external/unverified portal',
    guidance: [
      'Stop typing credentials immediately and close the browser tab.',
      'Disconnect your workstation from Wi-Fi or unplug your Ethernet cable.',
      'From a known clean device (e.g. mobile phone), reset your corporate password immediately.',
      'Report this incident to the Security Operations Center using the form below.'
    ],
    action: 'Disconnect network, reset corporate password, and report incident within 60 minutes.'
  },
  {
    type: 'phishing-click',
    severity: 'high' as const,
    regex: /(clicked|opened).*(suspicious link|phishing link|fake link|malicious link|weird link|unknown link)|(clicked.*link.*(entered|login|fedex|invoice|urgent))/i,
    indicator: 'Interaction with an identified phishing lure or untrusted URL',
    guidance: [
      'Do not enter any information on the opened website.',
      'Clear your browser cookies and active session tokens.',
      'Note the URL and the email sender address for the security report.',
      'Submit an official incident report below so the domain can be blocked enterprise-wide.'
    ],
    action: 'Close the page, isolate your browser session, and submit an incident report.'
  },
  {
    type: 'exposed-secret',
    severity: 'high' as const,
    regex: /(exposed|committed|pushed|leaked).*(api key|secret|token|private key|password|credentials)|(public.*repo.*(key|secret))/i,
    indicator: 'Production secret or API key committed to source control or public channel',
    guidance: [
      'Immediately revoke and invalidate the exposed API key in the provider console (e.g., Stripe, AWS, GitHub).',
      'Generate a brand new credential and inject it strictly via secure runtime environment variables.',
      'Never just delete the commit; Git history retains previous revisions unless force-purged.',
      'Notify the security team to audit provider API call logs during the exposure timeframe.'
    ],
    action: 'Revoke and rotate the compromised key immediately in provider dashboard.'
  },
  {
    type: 'lost-device',
    severity: 'high' as const,
    regex: /(lost|left|misplaced).*(company laptop|work laptop|work phone|corporate device|macbook)|(laptop.*(stolen|lost|taxi|uber|airport))/i,
    indicator: 'Physical loss of corporate endpoint asset',
    guidance: [
      'Report the loss immediately so the MDM team can dispatch remote lock and cryptographic wipe commands.',
      'Log into your corporate identity portal from another device and terminate all active sessions.',
      'If stolen, obtain a police report number for corporate asset insurance.',
      'Do not wait in hopes of locating the device; timely reporting limits data exposure.'
    ],
    action: 'Report the lost device immediately for remote lock and session revocation.'
  },
  {
    type: 'suspicious-download',
    severity: 'high' as const,
    regex: /(downloaded|ran|executed).*(suspicious file|unknown file|macro|exe|malware|trojan|virus|cracked)|(installer.*(weird|strange|freeware))/i,
    indicator: 'Execution of unauthorized or untrusted binary/archive on workstation',
    guidance: [
      'Disconnect your computer from all corporate networks (Wi-Fi and wired) immediately.',
      'Do not open or extract any additional downloaded files.',
      'Leave your laptop powered on so IT Security can collect live forensic volatile memory.',
      'Contact the 24/7 Security Hotline or submit an incident report below.'
    ],
    action: 'Isolate endpoint from network and contact Security Operations immediately.'
  },
  {
    type: 'MFA-abuse',
    severity: 'high' as const,
    regex: /(approved.*unexpected.*mfa)|(unexpected.*mfa.*request)|(mfa.*fatigue)|(bombarded.*mfa)|(duo.*push.*didn't.*initiate)/i,
    indicator: 'MFA push fatigue or unauthorized second-factor approval attempt',
    guidance: [
      'Deny all unexpected push prompts immediately.',
      'Change your corporate account password immediately; repeated prompts mean the attacker already knows your password.',
      'Report the bombardment to the SOC so the attacker IP address can be firewalled.'
    ],
    action: 'Deny prompts, initiate immediate password change, and alert SOC.'
  },
  {
    type: 'data-exposure',
    severity: 'medium' as const,
    regex: /(sent|emailed|shared).*(confidential data|customer data|client records|ssn|payroll).*(wrong person|wrong email|personal gmail|public)/i,
    indicator: 'Unauthorized transmission of restricted or customer data',
    guidance: [
      'Attempt email recall immediately if using an enterprise mail client.',
      'Request written confirmation from the recipient that the misdirected email has been permanently deleted.',
      'Document exactly what fields and customer records were included.',
      'Report the incident so corporate compliance can evaluate regulatory breach notification timelines.'
    ],
    action: 'Document affected records, attempt message recall, and notify Compliance.'
  }
];

export function detectIncident(text: string): IncidentDetectionResult {
  const normalized = (text || '').trim();

  for (const pattern of INCIDENT_PATTERNS) {
    if (pattern.regex.test(normalized)) {
      return {
        isIncident: true,
        incidentType: pattern.type,
        severity: pattern.severity,
        riskIndicators: [pattern.indicator],
        immediateSafetyGuidance: pattern.guidance,
        recommendedAction: pattern.action,
      };
    }
  }

  return {
    isIncident: false,
    incidentType: '',
    severity: 'low',
    riskIndicators: [],
    immediateSafetyGuidance: [],
    recommendedAction: '',
  };
}
