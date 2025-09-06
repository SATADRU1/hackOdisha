'use server';

/**
 * @fileOverview AI-powered coin recommendation flow.
 *
 * - recommendOptimalCoins - A function that recommends optimal coins based on market trends.
 * - RecommendOptimalCoinsInput - The input type for the recommendOptimalCoins function.
 * - RecommendOptimalCoinsOutput - The return type for the recommendOptimalCoins function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendOptimalCoinsInputSchema = z.object({
  marketData: z.string().describe('Real-time market data for various cryptocurrencies.'),
  userPreferences: z.string().optional().describe('Optional user preferences to tailor recommendations.'),
});
export type RecommendOptimalCoinsInput = z.infer<typeof RecommendOptimalCoinsInputSchema>;

const RecommendOptimalCoinsOutputSchema = z.object({
  recommendedCoins: z.array(
    z.object({
      coin: z.string().describe('The recommended cryptocurrency coin.'),
      reason: z.string().describe('The reason for the recommendation based on market analysis.'),
    })
  ).describe('An array of recommended cryptocurrency coins with reasons.'),
});
export type RecommendOptimalCoinsOutput = z.infer<typeof RecommendOptimalCoinsOutputSchema>;

export async function recommendOptimalCoins(input: RecommendOptimalCoinsInput): Promise<RecommendOptimalCoinsOutput> {
  return recommendOptimalCoinsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendOptimalCoinsPrompt',
  input: {schema: RecommendOptimalCoinsInputSchema},
  output: {schema: RecommendOptimalCoinsOutputSchema},
  prompt: `You are an AI assistant that analyzes cryptocurrency market data and provides recommendations for the most profitable coins to mine.

Analyze the following market data:
{{marketData}}

Consider the following user preferences, if provided:
{{#if userPreferences}}
  {{userPreferences}}
{{else}}
  No specific user preferences provided. Provide general recommendations.
{{/if}}

Based on your analysis, recommend the top coins to mine, providing a clear reason for each recommendation. Structure your response as a JSON array of objects, each containing the 'coin' and 'reason' keys.
`, // Ensure valid JSON output
});

const recommendOptimalCoinsFlow = ai.defineFlow(
  {
    name: 'recommendOptimalCoinsFlow',
    inputSchema: RecommendOptimalCoinsInputSchema,
    outputSchema: RecommendOptimalCoinsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
