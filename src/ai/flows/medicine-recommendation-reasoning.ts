'use server';
/**
 * @fileOverview An AI agent that recommends medicines for a given condition, taking into account contraindications.
 *
 * - medicineRecommendationReasoning - A function that recommends medicines for a given condition.
 * - MedicineRecommendationReasoningInput - The input type for the medicineRecommendationReasoning function.
 * - MedicineRecommendationReasoningOutput - The return type for the medicineRecommendationReasoning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicineRecommendationReasoningInputSchema = z.object({
  condition: z.string().describe('The medical condition to recommend medicines for.'),
  userDescription: z.string().optional().describe('Additional information about the user, including any contraindications.'),
});
export type MedicineRecommendationReasoningInput = z.infer<typeof MedicineRecommendationReasoningInputSchema>;

const MedicineRecommendationReasoningOutputSchema = z.object({
  medicines: z.array(z.string()).describe('A list of recommended medicines for the condition, taking into account any contraindications.'),
});
export type MedicineRecommendationReasoningOutput = z.infer<typeof MedicineRecommendationReasoningOutputSchema>;

export async function medicineRecommendationReasoning(input: MedicineRecommendationReasoningInput): Promise<MedicineRecommendationReasoningOutput> {
  return medicineRecommendationReasoningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicineRecommendationReasoningPrompt',
  input: {schema: MedicineRecommendationReasoningInputSchema},
  output: {schema: MedicineRecommendationReasoningOutputSchema},
  prompt: `You are a pharmacist recommending over-the-counter medicines for a given medical condition.

  Condition: {{{condition}}}

  User Description: {{{userDescription}}}

  Please provide a list of medicines that are appropriate for this condition, taking into account any contraindications described in the user description. Explain why each one is suitable and safe, if the user description is available.
  Only recommend over-the-counter medicines.
  Format your response as a simple list of medicine names.
  `,
});

const medicineRecommendationReasoningFlow = ai.defineFlow(
  {
    name: 'medicineRecommendationReasoningFlow',
    inputSchema: MedicineRecommendationReasoningInputSchema,
    outputSchema: MedicineRecommendationReasoningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
