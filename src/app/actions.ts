'use server';

import { suggestRemedy as suggestRemedyFlow, type SymptomInput, type RemedySuggestion } from '@/ai/remedy-flow';

export async function suggestRemedy(input: SymptomInput): Promise<RemedySuggestion> {
  return await suggestRemedyFlow(input);
}
