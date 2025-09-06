import { NextResponse } from 'next/server';
import { AIService, AIUtils } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const { action, symbol, timeframe, marketData } = await request.json();

    switch (action) {
      case 'analyze':
        try {
          const analysis = await AIService.analyzeMarketWithGemini(
            symbol || 'BTC',
            timeframe || '1h',
            marketData || {}
          );
          return NextResponse.json(AIUtils.formatAIResponse(analysis));
        } catch (error) {
          console.error('AI analysis error:', error);
          const fallback = AIUtils.getMockAnalysis(symbol || 'BTC');
          return NextResponse.json(AIUtils.formatAIResponse(fallback));
        }

      case 'predict':
        try {
          const predictions = await AIService.predictPricesWithGemini(
            symbol || 'BTC',
            marketData?.historicalData || [],
            timeframe || '24h'
          );
          return NextResponse.json(AIUtils.formatAIResponse(predictions));
        } catch (error) {
          console.error('Prediction error:', error);
          return NextResponse.json(
            { error: 'Failed to generate predictions' },
            { status: 500 }
          );
        }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
