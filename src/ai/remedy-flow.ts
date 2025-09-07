'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SymptomInputSchema = z.object({
  symptoms: z.string(),
});

export type SymptomInput = z.infer<typeof SymptomInputSchema>;

const RemedySuggestionSchema = z.object({
  remedy: z.string().describe('The suggested over-the-counter remedy.'),
  products: z.array(z.string()).describe('A list of example brand-name products for the suggested remedy.'),
  disclaimer: z.string().describe('A disclaimer that this is not medical advice.'),
});

export type RemedySuggestion = z.infer<typeof RemedySuggestionSchema>;

const prompt = ai.definePrompt({
  name: 'remedyPrompt',
  input: {schema: SymptomInputSchema},
  output: {schema: RemedySuggestionSchema},
  prompt: `You are a helpful assistant that suggests over-the-counter remedies for common ailments.
    The user is describing their symptoms. Based on these symptoms, suggest a common over-the-counter remedy.
    Provide a few brand-name examples of this type of remedy.
    You must also include a disclaimer that you are not a medical professional and this is not medical advice.

    Symptoms: {{{symptoms}}}
  `,
});

const remedyFlow = ai.defineFlow(
  {
    name: 'remedyFlow',
    inputSchema: SymptomInputSchema,
    outputSchema: RemedySuggestionSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function suggestRemedy(input: SymptomInput): Promise<RemedySuggestion> {
  return remedyFlow(input);
}
