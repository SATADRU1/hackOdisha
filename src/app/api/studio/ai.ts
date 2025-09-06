import { NextRequest, NextResponse } from 'next/server';
import { AIService, AIUtils } from '@/lib/ai-service';

// AI API endpoints using Gemini and Ollama
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...data } = body;

        switch (action) {
            case 'analyze':
                // Analyze market data with Gemini AI
                const { symbol, timeframe, indicators, marketData } = data;
                
                try {
                    const analysis = await AIService.analyzeMarketWithGemini(
                        symbol || 'BTC',
                        timeframe || '1h',
                        marketData || {}
                    );
                    
                    return NextResponse.json(AIUtils.formatAIResponse(analysis));
                } catch (aiError) {
                    console.warn('AI analysis failed, using fallback:', aiError);
                    const fallbackAnalysis = AIUtils.getMockAnalysis(symbol || 'BTC');
                    return NextResponse.json(AIUtils.formatAIResponse(fallbackAnalysis));
                }
            
            case 'predict':
                // Generate price predictions with Gemini
                const { predictionType, horizon, historicalData } = data;
                
                try {
                    const predictions = await AIService.predictPricesWithGemini(
                        predictionType || 'BTC',
                        historicalData || [],
                        horizon || '24h'
                    );
                    
                    return NextResponse.json(AIUtils.formatAIResponse(predictions));
                } catch (aiError) {
                    console.warn('AI prediction failed, using fallback:', aiError);
                    const fallbackPrediction = {
                        type: predictionType || 'price',
                        horizon: horizon || '24h',
                        predictions: Array.from({ length: 24 }, (_, i) => ({
                            timestamp: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
                            price: 45000 + Math.random() * 2000 - 1000,
                            confidence: 0.7 + Math.random() * 0.2
                        })),
                        accuracy: 0.78
                    };
                    return NextResponse.json(AIUtils.formatAIResponse(fallbackPrediction));
                }
            
            case 'insights':
                // Generate market insights with Gemini
                try {
                    const insights = await AIService.getMarketInsightsWithGemini();
                    return NextResponse.json(AIUtils.formatAIResponse(insights));
                } catch (aiError) {
                    console.warn('AI insights failed, using fallback:', aiError);
                    const fallbackInsights = {
                        marketOverview: 'Crypto market showing strong bullish momentum',
                        keyEvents: [
                            'Major institutional adoption announcement',
                            'Regulatory clarity improving',
                            'DeFi TVL reaching new highs'
                        ],
                        riskFactors: [
                            'High volatility expected',
                            'Regulatory uncertainty in some regions'
                        ],
                        opportunities: [
                            'Altcoin season potential',
                            'DeFi yield farming opportunities',
                            'NFT market recovery'
                        ]
                    };
                    return NextResponse.json(AIUtils.formatAIResponse(fallbackInsights));
                }
            
            case 'mining-recommendations':
                // Get mining recommendations with Gemini
                const { userPreferences } = data;
                
                try {
                    const recommendations = await AIService.getMiningRecommendationsWithGemini(
                        data.marketData || {},
                        userPreferences
                    );
                    return NextResponse.json(AIUtils.formatAIResponse(recommendations));
                } catch (aiError) {
                    console.warn('AI mining recommendations failed, using fallback:', aiError);
                    const fallbackRecommendations = {
                        recommendedCoins: [
                            {
                                coin: 'BTC',
                                reason: 'High profitability and stability',
                                profitability: 'high',
                                difficulty: 'high',
                                hardware: 'ASIC miners'
                            },
                            {
                                coin: 'ETH',
                                reason: 'Good profitability with GPU mining',
                                profitability: 'medium',
                                difficulty: 'medium',
                                hardware: 'GPU rigs'
                            }
                        ],
                        marketOverview: 'Mining market showing positive trends',
                        generalAdvice: 'Consider diversifying mining operations'
                    };
                    return NextResponse.json(AIUtils.formatAIResponse(fallbackRecommendations));
                }
            
            case 'portfolio-analysis':
                // Analyze portfolio with Gemini
                const { portfolio } = data;
                
                try {
                    const analysis = await AIService.analyzePortfolioWithGemini(
                        portfolio || [],
                        data.marketData || {}
                    );
                    return NextResponse.json(AIUtils.formatAIResponse(analysis));
                } catch (aiError) {
                    console.warn('AI portfolio analysis failed, using fallback:', aiError);
                    const fallbackAnalysis = {
                        performance: {
                            totalValue: 10000,
                            totalGain: 1500,
                            totalGainPercent: 15,
                            volatility: 0.25
                        },
                        riskAssessment: {
                            overallRisk: 'medium',
                            concentrationRisk: 'low',
                            marketRisk: 'medium'
                        },
                        recommendations: [
                            {
                                action: 'hold',
                                coin: 'BTC',
                                reason: 'Strong long-term potential',
                                amount: 0
                            }
                        ],
                        diversification: {
                            score: 0.7,
                            suggestions: ['Consider adding more altcoins']
                        }
                    };
                    return NextResponse.json(AIUtils.formatAIResponse(fallbackAnalysis));
                }
            
            case 'trading-signals':
                // Get trading signals with Gemini
                const { technicalData } = data;
                
                try {
                    const signals = await AIService.getTradingSignalsWithGemini(
                        data.symbol || 'BTC',
                        technicalData || {}
                    );
                    return NextResponse.json(AIUtils.formatAIResponse(signals));
                } catch (aiError) {
                    console.warn('AI trading signals failed, using fallback:', aiError);
                    const fallbackSignals = {
                        signals: [
                            {
                                type: 'buy',
                                strength: 'moderate',
                                entryPrice: 45000,
                                stopLoss: 42000,
                                takeProfit: 48000,
                                confidence: 0.7,
                                reasoning: 'Technical indicators suggest upward momentum'
                            }
                        ],
                        overallSentiment: 'bullish',
                        riskLevel: 'medium'
                    };
                    return NextResponse.json(AIUtils.formatAIResponse(fallbackSignals));
                }
            
            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error processing AI request:', error);
        return NextResponse.json({ 
            error: 'Failed to process AI request',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
