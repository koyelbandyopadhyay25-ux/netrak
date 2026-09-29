import { Policy, searchPolicy, getPolicyContext } from './policySearch.js';

export interface RetrievalResult {
  found: boolean;
  score: number;
  policies: Policy[];
  formattedContext: string;
  source: 'deterministic_policy_search' | 'vector_embedding_future';
}

/**
 * Phase 9 RAG Abstraction:
 * retrievePolicyContext decouples the retrieval implementation.
 * Currently backed by our deterministic keyword & semantic boost engine.
 * Ready for future vector embedding integration without breaking fallback.
 */
export async function retrievePolicyContext(question: string): Promise<RetrievalResult> {
  const searchResult = searchPolicy(question, 20);

  return {
    found: searchResult.found,
    score: searchResult.score,
    policies: searchResult.results,
    formattedContext: getPolicyContext(searchResult.results),
    source: 'deterministic_policy_search',
  };
}
