'use server';
/**
 * @fileOverview Matches user-provided symptoms to potential medical conditions.
 *
 * - matchSymptomsToConditions - A function that takes symptom descriptions as input and returns a list of potential medical conditions.
 * - MatchSymptomsToConditionsInput - The input type for the matchSymptomsToConditions function.
 * - MatchSymptomsToConditionsOutput - The return type for the matchSymptomsToConditions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchSymptomsToConditionsInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A description of the symptoms the user is experiencing.'),
});
export type MatchSymptomsToConditionsInput = z.infer<
  typeof MatchSymptomsToConditionsInputSchema
>;

const MatchSymptomsToConditionsOutputSchema = z.object({
  conditions: z
    .string()
    .array()
    .describe('A list of potential medical conditions that match the symptoms.'),
});
export type MatchSymptomsToConditionsOutput = z.infer<
  typeof MatchSymptomsToConditionsOutputSchema
>;

export async function matchSymptomsToConditions(
  input: MatchSymptomsToConditionsInput
): Promise<MatchSymptomsToConditionsOutput> {
  return matchSymptomsToConditionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchSymptomsToConditionsPrompt',
  input: {schema: MatchSymptomsToConditionsInputSchema},
  output: {schema: MatchSymptomsToConditionsOutputSchema},
  prompt: `You are a medical expert. Given the following symptoms, identify potential medical conditions that could be the cause.

Symptoms: {{{symptoms}}}

List of potential conditions:`,
});

const matchSymptomsToConditionsFlow = ai.defineFlow(
  {
    name: 'matchSymptomsToConditionsFlow',
    inputSchema: MatchSymptomsToConditionsInputSchema,
    outputSchema: MatchSymptomsToConditionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
