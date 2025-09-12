'use server';
/**
 * @fileOverview An AI agent for retrieving information about medications.
 *
 * - getMedicationInfo - A function that handles fetching medication information.
 * - GetMedicationInfoInput - The input type for the getMedicationInfo function.
 * - GetMedicationInfoOutput - The return type for the getMedicationInfo function.
 */

import { ai } from '@/app/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

const GetMedicationInfoInputSchema = z.object({
  medicationName: z.string().describe('The name of the medication to get information about.'),
});
export type GetMedicationInfoInput = z.infer<typeof GetMedicationInfoInputSchema>;

const GetMedicationInfoOutputSchema = z.object({
  description: z.string().describe('A detailed explanation of the medication\'s use, purpose, and common side effects.'),
});
export type GetMedicationInfoOutput = z.infer<typeof GetMedicationInfoOutputSchema>;

export async function getMedicationInfo(input: GetMedicationInfoInput): Promise<GetMedicationInfoOutput> {
  return getMedicationInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getMedicationInfoPrompt',
  input: { schema: GetMedicationInfoInputSchema },
  output: { schema: GetMedicationInfoOutputSchema },
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are an expert pharmacist and medical assistant.
Your task is to provide a clear, easy-to-understand explanation for the following medication.

Explain its primary use, how it works, and common potential side effects. Present this information concisely.

Medication: {{{medicationName}}}`,
});

const getMedicationInfoFlow = ai.defineFlow(
  {
    name: 'getMedicationInfoFlow',
    inputSchema: GetMedicationInfoInputSchema,
    outputSchema: GetMedicationInfoOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
