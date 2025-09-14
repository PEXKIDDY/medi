'use server';
/**
 * @fileOverview An AI agent for identifying a medication from an image.
 *
 * - identifyMedicine - A function that handles identifying the medication from an image.
 * - IdentifyMedicineInput - The input type for the identifyMedicine function.
 * - IdentifyMedicineOutput - The return type for the identifyMedicine function.
 */

import { ai } from '@/app/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import type { GetMedicationInfoOutput } from './get-medication-info-flow';

const IdentifyMedicineInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image of a medication, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyMedicineInput = z.infer<typeof IdentifyMedicineInputSchema>;

const IdentifyMedicineOutputSchema = z.object({
    medicationName: z.string().describe("The name of the identified medication. If no medication is found, this should be 'Unknown'."),
    primaryUse: z.string().describe("A description of the medication's primary use."),
    howItWorks: z.string().describe('An explanation of how the medication works.'),
    commonSideEffects: z.string().describe('A bulleted list of common potential side effects.'),
});
export type IdentifyMedicineOutput = z.infer<typeof IdentifyMedicineOutputSchema>;


export async function identifyMedicine(input: IdentifyMedicineInput): Promise<IdentifyMedicineOutput> {
  return identifyMedicineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyMedicinePrompt',
  input: { schema: IdentifyMedicineInputSchema },
  output: { schema: IdentifyMedicineOutputSchema },
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are an expert pharmacist and medical assistant.
Your task is to identify the medication from the provided image and give details about it.

1.  First, identify the name of the medication in the image. If you cannot identify a medication, set the medicationName to "Unknown" and provide generic, helpful text for the other fields.
2.  Then, provide a clear, easy-to-understand explanation for the identified medication.
3.  Explain its primary use, how it works, and common potential side effects.
4.  For common side effects, provide them in a bulleted list.
5.  For all fields, the text should be clear and concise.

Image of medication: {{media url=imageDataUri}}`,
});

const identifyMedicineFlow = ai.defineFlow(
  {
    name: 'identifyMedicineFlow',
    inputSchema: IdentifyMedicineInputSchema,
    outputSchema: IdentifyMedicineOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
