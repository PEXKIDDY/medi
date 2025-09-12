'use server';
/**
 * @fileOverview An AI agent for analyzing medical documents.
 *
 * - analyzeDocument - A function that handles the document analysis process.
 * - AnalyzeDocumentInput - The input type for the analyzeDocument function.
 * - AnalyzeDocumentOutput - The return type for the analyzeDocument function.
 */

import { ai } from '@/app/ai/genkit';
import { z } from 'zod';

const PrescriptionSchema = z.object({
  medication: z.string().describe('The name of the medication.'),
  dosage: z.string().describe('The dosage of the medication (e.g., "10mg", "1 tablet").'),
  frequency: z.string().describe('How often the medication should be taken (e.g., "once a day", "every 6 hours").'),
  instructions: z.string().optional().describe('Additional instructions for taking the medication.'),
});

const AnalyzeDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (image or text), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeDocumentInput = z.infer<typeof AnalyzeDocumentInputSchema>;

const AnalyzeDocumentOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the document\'s content.'),
  prescriptions: z.array(PrescriptionSchema).describe('A list of all prescriptions found in the document.'),
  doctor: z.string().optional().describe('The name of the prescribing doctor, if found.'),
  date: z.string().optional().describe('The date the prescription or document was issued, if found.'),
});
export type AnalyzeDocumentOutput = z.infer<typeof AnalyzeDocumentOutputSchema>;

export async function analyzeDocument(input: AnalyzeDocumentInput): Promise<AnalyzeDocumentOutput> {
  return analyzeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDocumentPrompt',
  input: { schema: AnalyzeDocumentInputSchema },
  output: { schema: AnalyzeDocumentOutputSchema },
  prompt: `You are an expert medical assistant. Your task is to analyze the provided medical document and extract key information.

Carefully review the document below and identify any prescriptions, the prescribing doctor, the date of issue, and provide a concise summary of the document's purpose.

If no prescriptions are found, return an empty array for the prescriptions field.

Document: {{media url=documentDataUri}}`,
});

const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: AnalyzeDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
