import policiesData from '../data/policies.json' with { type: 'json' };
import faqData from '../data/faq.json' with { type: 'json' };

export interface Policy {
  id: string;
  topic: string;
  title: string;
  section: string;
  rule: string;
  explanation: string;
  keywords: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  policyId: string;
  category: string;
}

export interface PolicySearchResult {
  found: boolean;
  results: Policy[];
  score: number;
  matchedFaqs: FAQ[];
}

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any',
  'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between',
  'both', 'but', 'by', 'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her',
  'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into',
  'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no',
  'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'should', 'so', 'some', 'such', 'than',
  'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these',
  'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very',
  'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom',
  'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

export function normalizeText(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenizeText(text: string): string[] {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  return normalized
    .split(' ')
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

export function calculateRelevance(query: string, policy: Policy): number {
  const queryTokens = tokenizeText(query);
  if (queryTokens.length === 0) return 0;

  const normalizedQuery = normalizeText(query);
  let score = 0;

  // Exact phrase match in title or rule
  const normTitle = normalizeText(policy.title);
  const normRule = normalizeText(policy.rule);
  const normTopic = normalizeText(policy.topic);
  const normExp = normalizeText(policy.explanation);

  if (normTitle.includes(normalizedQuery)) score += 50;
  if (normRule.includes(normalizedQuery)) score += 40;
  if (normTopic.includes(normalizedQuery)) score += 35;

  // Topic match
  for (const token of queryTokens) {
    if (normTopic.includes(token)) score += 20;
    if (normTitle.includes(token)) score += 15;
    
    // Keyword match
    for (const kw of policy.keywords) {
      const normKw = normalizeText(kw);
      if (normKw === token) {
        score += 25;
      } else if (normKw.includes(token) || token.includes(normKw)) {
        score += 12;
      }
    }

    // Rule content match
    if (normRule.includes(token)) score += 8;
    // Explanation match
    if (normExp.includes(token)) score += 4;
  }

  // Domain specific synonym boosts
  const domainBoosts: Record<string, string[]> = {
    'chatgpt': ['ai', 'generative ai', 'llm', 'ai tool usage'],
    'claude': ['ai', 'generative ai', 'llm', 'ai tool usage'],
    'copilot': ['ai', 'generative ai', 'llm', 'source code security'],
    'gmail': ['cloud storage', 'external file sharing', 'acceptable use'],
    'drive': ['cloud storage', 'external file sharing'],
    'dropbox': ['cloud storage', 'external file sharing'],
    'pendrive': ['usb devices', 'removable media'],
    'usb': ['usb devices', 'removable media'],
    'password': ['password security', 'password reset', 'identity & access'],
    'mfa': ['mfa', 'identity & access', 'account recovery'],
    '2fa': ['mfa', 'identity & access'],
    'otp': ['mfa', 'social engineering'],
    'wifi': ['public wi-fi', 'remote work', 'remote access'],
    'airport': ['public wi-fi', 'travel security', 'public locations'],
    'hotel': ['public wi-fi', 'travel security'],
    'github': ['source code security', 'secrets management'],
    'api key': ['secrets management', 'source code security'],
    'secret': ['secrets management'],
    'phish': ['phishing', 'email security', 'incident reporting'],
    'scam': ['phishing', 'social engineering', 'email security'],
    'customer': ['customer data', 'data privacy', 'data classification'],
    'client': ['customer data', 'confidential information', 'data classification'],
    'tailgating': ['physical security'],
    'badge': ['physical security'],
    'clean desk': ['physical security'],
    'shred': ['secure disposal'],
    'whatsapp': ['messaging apps', 'external file sharing'],
    'telegram': ['messaging apps']
  };

  for (const [key, topics] of Object.entries(domainBoosts)) {
    if (normalizedQuery.includes(key)) {
      if (topics.some((t) => normTopic.includes(t))) {
        score += 30;
      }
    }
  }

  return score;
}

export function searchPolicy(query: string, minScore = 20): PolicySearchResult {
  const policies = policiesData as Policy[];
  const faqs = faqData as FAQ[];

  if (!query || query.trim().length < 3) {
    return { found: false, results: [], score: 0, matchedFaqs: [] };
  }

  const scored = policies.map((p) => ({
    policy: p,
    score: calculateRelevance(query, p),
  }));

  // Filter by threshold and sort descending
  const relevant = scored
    .filter((item) => item.score >= minScore)
    .sort((a, b) => b.score - a.score);

  if (relevant.length === 0) {
    return { found: false, results: [], score: 0, matchedFaqs: [] };
  }

  const topPolicies = relevant.slice(0, 3).map((item) => item.policy);
  const topScore = relevant[0].score;

  // Find related FAQs
  const topPolicyIds = new Set(topPolicies.map((p) => p.id));
  const queryTokens = tokenizeText(query);
  const matchedFaqs = faqs.filter((f) => {
    if (topPolicyIds.has(f.policyId)) return true;
    const normQ = normalizeText(f.question);
    return queryTokens.some((t) => normQ.includes(t));
  }).slice(0, 3);

  return {
    found: true,
    results: topPolicies,
    score: topScore,
    matchedFaqs,
  };
}

export function getPolicyContext(policies: Policy[]): string {
  if (!policies || policies.length === 0) return 'No relevant organizational policies retrieved.';
  return policies
    .map(
      (p, i) =>
        `[POLICY CHUNK ${i + 1}]\nID: ${p.id}\nTopic: ${p.topic}\nSection: ${p.section} - ${p.title}\nRule: ${p.rule}\nExplanation: ${p.explanation}`
    )
    .join('\n\n');
}
