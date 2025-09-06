import { ai, geminiPro, geminiFlash } from '@/ai/genkit';

// AI Service for cryptocurrency analysis using only Gemini
export class AIService {
  // Use Gemini for market analysis
  static async analyzeMarketWithGemini(symbol: string, timeframe: string, marketData: any) {
    try {
      const prompt = `
        Analyze the cryptocurrency market data for ${symbol} over ${timeframe} timeframe.
        
        Market Data: ${JSON.stringify(marketData, null, 2)}
        
        Provide a comprehensive analysis including:
        1. Market sentiment (bullish/bearish/neutral)
        2. Technical indicators analysis
        3. Price targets (short, medium, long term)
        4. Risk factors
        5. Investment recommendations
        
        Format the response as JSON with the following structure:
        {
          "sentiment": "bullish|bearish|neutral",
          "confidence": 0.0-1.0,
          "technicalIndicators": {
            "rsi": number,
            "macd": number,
            "bollinger": "upper_band|middle_band|lower_band",
            "movingAverage": {
              "sma20": number,
              "ema50": number
            }
          },
          "priceTargets": {
            "short": number,
            "medium": number,
            "long": number
          },
          "recommendations": [string],
          "riskFactors": [string]
        }
      `;

      const response = await ai.generate({
        model: geminiPro,
        prompt,
        config: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        },
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error('Gemini analysis error:', error);
      throw new Error('Failed to analyze market with Gemini');
    }
  }

  // Use Gemini for mining recommendations
  static async getMiningRecommendationsWithGemini(marketData: any, userPreferences?: any) {
    try {
      const prompt = `
        As a cryptocurrency mining expert, analyze the following market data and provide mining recommendations:
        
        Market Data: ${JSON.stringify(marketData, null, 2)}
        User Preferences: ${userPreferences ? JSON.stringify(userPreferences, null, 2) : 'None specified'}
        
        Recommend the top 5 cryptocurrencies for mining based on:
        1. Current profitability
        2. Mining difficulty trends
        3. Market volatility
        4. Long-term potential
        5. Hardware requirements
        
        Format as JSON:
        {
          "recommendedCoins": [
            {
              "coin": "string",
              "reason": "string",
              "profitability": "high|medium|low",
              "difficulty": "high|medium|low",
              "hardware": "string"
            }
          ],
          "marketOverview": "string",
          "generalAdvice": "string"
        }
      `;

      const response = await ai.generate({
        model: geminiPro,
        prompt,
        config: {
          temperature: 0.4,
          maxOutputTokens: 2048,
        },
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error('Gemini mining recommendations error:', error);
      throw new Error('Failed to get mining recommendations');
    }
  }

  // Use Gemini for price predictions
  static async predictPricesWithGemini(symbol: string, historicalData: any[], horizon: string) {
    try {
      const prompt = `
        Predict cryptocurrency prices for ${symbol} over the next ${horizon} based on historical data.
        
        Historical Data: ${JSON.stringify(historicalData.slice(-100), null, 2)}
        
        Provide price predictions with confidence intervals:
        {
          "predictions": [
            {
              "timestamp": "ISO string",
              "price": number,
              "confidence": 0.0-1.0,
              "upperBound": number,
              "lowerBound": number
            }
          ],
          "accuracy": number,
          "methodology": "string"
        }
      `;

      const response = await ai.generate({
        model: geminiFlash,
        prompt,
        config: {
          temperature: 0.2,
          maxOutputTokens: 2048,
        },
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error('Gemini price prediction error:', error);
      throw new Error('Failed to predict prices');
    }
  }

  // Get market insights using Gemini
  static async getMarketInsightsWithGemini() {
    try {
      const prompt = `
        Provide current cryptocurrency market insights including:
        1. Overall market sentiment
        2. Key events affecting the market
        3. Risk factors to watch
        4. Opportunities for investors
        5. Regulatory developments
        
        Format as JSON:
        {
          "marketOverview": "string",
          "keyEvents": [string],
          "riskFactors": [string],
          "opportunities": [string],
          "regulatoryUpdates": [string],
          "sentimentScore": number
        }
      `;

      const response = await ai.generate({
        model: geminiPro,
        prompt,
        config: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error('Gemini market insights error:', error);
      throw new Error('Failed to get market insights');
    }
  }

  // Analyze portfolio with Gemini
  static async analyzePortfolioWithGemini(portfolio: any[], marketData: any) {
    try {
      const prompt = `
        Analyze this cryptocurrency portfolio and provide optimization recommendations:
        
        Portfolio: ${JSON.stringify(portfolio, null, 2)}
        Current Market Data: ${JSON.stringify(marketData, null, 2)}
        
        Provide analysis including:
        1. Portfolio performance
        2. Risk assessment
        3. Diversification analysis
        4. Optimization suggestions
        5. Rebalancing recommendations
        
        Format as JSON:
        {
          "performance": {
            "totalValue": number,
            "totalGain": number,
            "totalGainPercent": number,
            "volatility": number
          },
          "riskAssessment": {
            "overallRisk": "low|medium|high",
            "concentrationRisk": "low|medium|high",
            "marketRisk": "low|medium|high"
          },
          "recommendations": [
            {
              "action": "buy|sell|hold",
              "coin": "string",
              "reason": "string",
              "amount": number
            }
          ],
          "diversification": {
            "score": number,
            "suggestions": [string]
          }
        }
      `;

      const response = await ai.generate({
        model: geminiPro,
        prompt,
        config: {
          temperature: 0.3,
          maxOutputTokens: 1536,
        },
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error('Gemini portfolio analysis error:', error);
      throw new Error('Failed to analyze portfolio');
    }
  }

  // Get AI-powered trading signals
  static async getTradingSignalsWithGemini(symbol: string, technicalData: any) {
    try {
      const prompt = `
        Generate trading signals for ${symbol} based on technical analysis:
        
        Technical Data: ${JSON.stringify(technicalData, null, 2)}
        
        Provide trading signals with:
        1. Entry/exit points
        2. Stop loss levels
        3. Take profit targets
        4. Signal strength
        5. Risk/reward ratio
        
        Format as JSON:
        {
          "signals": [
            {
              "type": "buy|sell|hold",
              "strength": "weak|moderate|strong",
              "entryPrice": number,
              "stopLoss": number,
              "takeProfit": number,
              "confidence": number,
              "reasoning": "string"
            }
          ],
          "overallSentiment": "bullish|bearish|neutral",
          "riskLevel": "low|medium|high"
        }
      `;

      const response = await ai.generate({
        model: geminiFlash,
        prompt,
        config: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        },
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error('Gemini trading signals error:', error);
      throw new Error('Failed to generate trading signals');
    }
  }
}

// Utility functions for AI service
export const AIUtils = {
  // Fallback to mock data if AI services fail
  getMockAnalysis: (symbol: string) => ({
    symbol,
    sentiment: 'bullish',
    confidence: 0.75,
    recommendations: [
      'Strong buy signal detected',
      'Volume increasing significantly',
      'Support level holding well'
    ],
    technicalIndicators: {
      rsi: 65.2,
      macd: 0.0234,
      bollinger: 'upper_band',
      movingAverage: {
        sma20: 45234.56,
        ema50: 44891.23
      }
    },
    priceTargets: {
      short: 47000,
      medium: 52000,
      long: 65000
    }
  }),

  // Validate AI response format
  validateAIResponse: (response: any, expectedFields: string[]) => {
    if (!response || typeof response !== 'object') {
      return false;
    }
    return expectedFields.every(field => field in response);
  },

  // Format AI response for frontend
  formatAIResponse: (response: any) => {
    return {
      ...response,
      timestamp: new Date().toISOString(),
      source: 'gemini-ai'
    };
  }
};