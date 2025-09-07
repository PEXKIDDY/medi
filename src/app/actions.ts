'use server';
import { matchSymptomsToConditions } from '@/ai/flows/match-symptoms-to-conditions';
import { recommendMedicinesForCondition, type RecommendMedicinesForConditionOutput } from '@/ai/flows/recommend-medicines-for-condition';

export interface ConditionWithMedicines {
    condition: string;
    medicines: RecommendMedicinesForConditionOutput['medicines'];
}

export async function getHealthAnalysis(symptoms: string): Promise<ConditionWithMedicines[] | { error: string }> {
    if (!symptoms) {
        return { error: 'Symptoms cannot be empty.' };
    }

    try {
        const { conditions } = await matchSymptomsToConditions({ symptoms });
        if (!conditions || conditions.length === 0) {
            return [];
        }

        // Limit to 3 conditions to avoid excessive API calls and long waits
        const topConditions = conditions.slice(0, 3);

        const results = await Promise.all(
            topConditions.map(async (condition) => {
                try {
                    const medicineData = await recommendMedicinesForCondition({ condition });
                    return {
                        condition,
                        medicines: medicineData.medicines,
                    };
                } catch(e) {
                    console.error(`Error fetching medicine for condition ${condition}:`, e);
                    // Return condition with empty medicines array if a sub-call fails
                    return {
                        condition,
                        medicines: []
                    };
                }
            })
        );
        
        return results;

    } catch (e) {
        console.error('Error in getHealthAnalysis:', e);
        return { error: 'An error occurred while analyzing symptoms. The AI model may be overloaded. Please try again later.' };
    }
}
