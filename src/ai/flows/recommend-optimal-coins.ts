'use server';

/**
 * @fileOverview AI-powered coin recommendation flow using Gemini and Ollama.
 *
 * - recommendOptimalCoins - A function that recommends optimal coins based on market trends.
 * - RecommendOptimalCoinsInput - The input type for the recommendOptimalCoins function.
 * - RecommendOptimalCoinsOutput - The return type for the recommendOptimalCoins function.
 */

import { geminiPro } from '@/ai/genkit';
import { z } from 'genkit';
import { AIService, AIUtils } from '@/lib/ai-service';

const RecommendOptimalCoinsInputSchema = z.object({
  marketData: z.any().describe('Real-time market data for various cryptocurrencies.'),
  userPreferences: z.any().optional().describe('Optional user preferences to tailor recommendations.'),
});
export type RecommendOptimalCoinsInput = z.infer<typeof RecommendOptimalCoinsInputSchema>;

const RecommendOptimalCoinsOutputSchema = z.object({
  recommendedCoins: z.array(
    z.object({
      coin: z.string().describe('The recommended cryptocurrency coin.'),
      reason: z.string().describe('The reason for the recommendation based on market analysis.'),
      profitability: z.enum(['high', 'medium', 'low']).describe('Expected profitability level.'),
      difficulty: z.enum(['high', 'medium', 'low']).describe('Mining difficulty level.'),
      hardware: z.string().describe('Recommended hardware for mining this coin.'),
    })
  ).describe('An array of recommended cryptocurrency coins with detailed analysis.'),
  marketOverview: z.string().describe('Overall market analysis and trends.'),
  generalAdvice: z.string().describe('General advice for mining operations.'),
});
export type RecommendOptimalCoinsOutput = z.infer<typeof RecommendOptimalCoinsOutputSchema>;

export async function recommendOptimalCoins(input: RecommendOptimalCoinsInput): Promise<RecommendOptimalCoinsOutput> {
  try {
    // Use the AI service for mining recommendations
    const result = await AIService.getMiningRecommendationsWithGemini(
      input.marketData || {},
      input.userPreferences
    );
    
    return result as RecommendOptimalCoinsOutput;
  } catch (error) {
    console.error('AI recommendation failed, using fallback:', error);
    
    // Fallback to mock data if AI fails
    return {
      recommendedCoins: [
        {
          coin: 'BTC',
          reason: 'High profitability and market stability',
          profitability: 'high',
          difficulty: 'high',
          hardware: 'ASIC miners (Antminer S19 series)'
        },
        {
          coin: 'ETH',
          reason: 'Good profitability with GPU mining, transitioning to PoS',
          profitability: 'medium',
          difficulty: 'medium',
          hardware: 'GPU rigs (RTX 3080/4080 series)'
        },
        {
          coin: 'LTC',
          reason: 'Stable profitability and lower difficulty',
          profitability: 'medium',
          difficulty: 'medium',
          hardware: 'ASIC miners (L7 series)'
        }
      ],
      marketOverview: 'Mining market showing positive trends with increasing institutional adoption',
      generalAdvice: 'Consider diversifying mining operations across multiple coins and hardware types'
    };
  }
}

// The recommendOptimalCoins function is already exported above
