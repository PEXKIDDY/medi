'use server';
/**
 * @fileOverview An AI agent for generating simulated emergency service updates.
 *
 * - getEmergencyUpdates - A function that provides a stream of updates.
 * - GetEmergencyUpdatesInput - The input type for the getEmergencyUpdates function.
 * - GetEmergencyUpdatesOutput - The return type for the getEmergencyUpdates function.
 */

import { ai } from '@/app/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

const GetEmergencyUpdatesInputSchema = z.object({
  distance: z.number().describe('The current distance in kilometers from the hospital.'),
  time: z.number().describe('The estimated time in minutes to the hospital.'),
});
export type GetEmergencyUpdatesInput = z.infer<typeof GetEmergencyUpdatesInputSchema>;

const GetEmergencyUpdatesOutputSchema = z.object({
  status: z.string().describe('A short status update (e.g., "Ambulance Dispatched", "En Route", "Approaching Destination").'),
  updateMessage: z.string().describe('A reassuring and informative message for the user.'),
  eta: z.string().describe('The current estimated time of arrival.'),
});
export type GetEmergencyUpdatesOutput = z.infer<typeof GetEmergencyUpdatesOutputSchema>;

export async function getEmergencyUpdates(input: GetEmergencyUpdatesInput): Promise<GetEmergencyUpdatesOutput> {
  return getEmergencyUpdatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getEmergencyUpdatesPrompt',
  input: { schema: GetEmergencyUpdatesInputSchema },
  output: { schema: GetEmergencyUpdatesOutputSchema },
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are an emergency dispatch operator providing a live feed of updates to a person in a medical emergency. Your tone should be calm, reassuring, and clear.

Based on the user's current situation, provide a status update.

Current situation:
- Distance from hospital: {{{distance}}} km
- Estimated time to arrival: {{{time}}} minutes

Generate a status update, a reassuring message, and an ETA.
- If the distance is far ( > 10km), the status should be "Ambulance Dispatched".
- If the distance is moderate (2-10km), the status should be "Ambulance En Route".
- If the distance is close (< 2km), the status should be "Approaching Destination".
- If the distance is very close (< 0.5km), the status should be "Arriving at Hospital".

Example Message: "The ambulance is en route. The medical team is aware of your situation. Please try to remain calm. Estimated arrival in 8 minutes."
`,
});

const getEmergencyUpdatesFlow = ai.defineFlow(
  {
    name: 'getEmergencyUpdatesFlow',
    inputSchema: GetEmergencyUpdatesInputSchema,
    outputSchema: GetEmergencyUpdatesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
