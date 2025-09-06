'use client';

import { useState } from 'react';
import type { RecommendOptimalCoinsOutput } from '@/ai/flows/recommend-optimal-coins';
import { recommendOptimalCoins } from '@/ai/flows/recommend-optimal-coins';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/badge';

const staticRecommendations: RecommendOptimalCoinsOutput = {
  recommendedCoins: [
    { coin: 'Bitcoin (BTC)', reason: 'Showing strong stability and potential for a breakout. A reliable choice for consistent mining rewards.' },
    { coin: 'Ethereum (ETH)', reason: 'Upcoming network upgrade (Pectra) is creating positive sentiment and price movement.' },
    { coin: 'Solana (SOL)', reason: 'High transaction volume and ecosystem growth suggest increasing demand and value.' },
  ],
};

export default function AiRecommendations() {
  const [recommendations, setRecommendations] = useState<RecommendOptimalCoinsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const mockMarketData = "Current market is volatile. Bitcoin is stable, Ethereum is rising due to a new update, and Solana is showing high transaction volume.";
      const result = await recommendOptimalCoins({ marketData: mockMarketData });
      setRecommendations(result);
    } catch (error) {
      console.error('AI recommendation error:', error);
      // Fallback to static recommendations on API error
      setRecommendations(staticRecommendations);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full bg-card/50 backdrop-blur-lg border-primary/20 flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Wand2 className="h-6 w-6 text-primary" />
          <CardTitle>AI Coin Recommendations</CardTitle>
        </div>
        <CardDescription>
          Let our AI analyze market trends to suggest the best coins for you to mine right now.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
        {isLoading && (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing market data...</p>
          </div>
        )}
        {!isLoading && !recommendations && (
          <div className="space-y-4">
            <p className="text-muted-foreground max-w-sm mx-auto">Click the button to receive personalized coin recommendations powered by AI.</p>
            <Button onClick={handleGetRecommendations}>
              <Wand2 className="mr-2 h-4 w-4" />
              Get Recommendations
            </Button>
          </div>
        )}
        {!isLoading && recommendations && (
          <div className="w-full text-left space-y-4">
            <ul className="space-y-3">
              {recommendations.recommendedCoins.map((rec, index) => (
                <li key={index} className="p-4 rounded-lg bg-background/50 border flex items-start gap-4 transition-all hover:border-primary/50">
                   <Badge variant="secondary" className="text-lg bg-primary/10 text-primary border-primary/20">{rec.coin}</Badge>
                  <div className="flex-1">
                    <p className="font-medium">{rec.reason}</p>
                  </div>
                   <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <ArrowRight className="h-4 w-4"/>
                  </Button>
                </li>
              ))}
            </ul>
             <Button onClick={handleGetRecommendations} variant="outline" className="w-full">
              <Wand2 className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
