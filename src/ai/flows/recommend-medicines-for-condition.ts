'use server';
/**
 * @fileOverview Recommends over-the-counter medicines for a given condition, providing dosage,
 * side effects, and brand options.
 *
 * - recommendMedicinesForCondition - A function that recommends medicines for a condition.
 * - RecommendMedicinesForConditionInput - The input type for the recommendMedicinesForCondition function.
 * - RecommendMedicinesForConditionOutput - The return type for the recommendMedicinesForCondition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendMedicinesForConditionInputSchema = z.object({
  condition: z.string().describe('The medical condition to recommend medicines for (e.g., common cold, migraine).'),
});
export type RecommendMedicinesForConditionInput = z.infer<typeof RecommendMedicinesForConditionInputSchema>;

const MedicineSchema = z.object({
  name: z.string().describe('The name of the medicine.'),
  dosage: z.string().describe('Dosage and usage instructions for the medicine.'),
  sideEffects: z.array(z.string()).describe('Common side effects of the medicine.'),
  brands: z.array(z.string()).describe('Available brands or generic options for the medicine.'),
  contraindications: z.array(z.string()).describe('Contraindications for the medicine.'),
  reasoning: z.string().describe('Reasoning for recommending this medicine and omitting others.'),
});

const RecommendMedicinesForConditionOutputSchema = z.object({
  medicines: z.array(MedicineSchema).describe('A list of recommended over-the-counter medicines for the condition.'),
});
export type RecommendMedicinesForConditionOutput = z.infer<typeof RecommendMedicinesForConditionOutputSchema>;

export async function recommendMedicinesForCondition(input: RecommendMedicinesForConditionInput): Promise<RecommendMedicinesForConditionOutput> {
  return recommendMedicinesForConditionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendMedicinesForConditionPrompt',
  input: {schema: RecommendMedicinesForConditionInputSchema},
  output: {schema: RecommendMedicinesForConditionOutputSchema},
  prompt: `You are a helpful AI assistant specializing in recommending over-the-counter medicines for various medical conditions.

  Given a user-specified medical condition, your task is to:
  1.  Recommend a curated list of over-the-counter medicines that are commonly used to alleviate the symptoms associated with the condition.
  2.  For each recommended medicine, provide clear and concise information on:
  *   Dosage: Instructions on how much medicine to take and how often.
  *   Side Effects: A list of common side effects that users may experience.
  *   Brands: Suggest various brands or generic options for each medicine.
  *   Contraindications: When the medicine should not be taken.
  *   Reasoning: Explain why each medicine is recommended and any specific considerations. Reasoning will be employed to omit medicines which may be contraindicated.

  The medical condition to provide recommendations for is: {{{condition}}}
  Ensure the output is a valid JSON according to the schema.
  `,
});

const recommendMedicinesForConditionFlow = ai.defineFlow(
  {
    name: 'recommendMedicinesForConditionFlow',
    inputSchema: RecommendMedicinesForConditionInputSchema,
    outputSchema: RecommendMedicinesForConditionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
