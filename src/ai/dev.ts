import { config } from 'dotenv';
config();

import '@/ai/flows/match-symptoms-to-conditions.ts';
import '@/ai/flows/recommend-medicines-for-condition.ts';
import '@/ai/flows/medicine-recommendation-reasoning.ts';