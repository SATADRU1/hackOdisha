'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { generateContent } from '@/lib/gemini';

interface CoinRecommendation {
  coin: string;
  reason: string;
}

interface RecommendationsData {
  recommendedCoins: CoinRecommendation[];
}

const defaultRecommendations: RecommendationsData = {
  recommendedCoins: [
    { coin: 'Bitcoin (BTC)', reason: 'Showing strong stability and potential for a breakout. A reliable choice for consistent mining rewards.' },
    { coin: 'Ethereum (ETH)', reason: 'Upcoming network upgrade (Pectra) is creating positive sentiment and price movement.' },
    { coin: 'Solana (SOL)', reason: 'High transaction volume and ecosystem growth suggest increasing demand and value.' },
  ],
};

const generatePrompt = (): string => {
  return `As a cryptocurrency mining advisor, analyze the current market conditions and recommend the top 3 cryptocurrencies for mining right now. 
  Consider factors like current price, mining difficulty, network hash rate, and upcoming network updates. 
  Format your response as a JSON array of objects with 'coin' and 'reason' properties. Example:
  
  [
    {"coin": "Bitcoin (BTC)", "reason": "Reason for recommendation"},
    ...
  ]`;
};

export default function AiRecommendations() {
  const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const prompt = generatePrompt();
      const response = await generateContent(prompt);
      
      try {
        // Try to parse the response as JSON
        const parsedResponse = JSON.parse(response);
        setRecommendations({
          recommendedCoins: Array.isArray(parsedResponse) 
            ? parsedResponse.slice(0, 3) // Limit to 3 recommendations
            : defaultRecommendations.recommendedCoins
        });
      } catch (e) {
        console.warn('Failed to parse AI response, using default recommendations');
        setRecommendations(defaultRecommendations);
      }
    } catch (err) {
      console.error('Error getting AI recommendations:', err);
      setError('Failed to fetch recommendations. Using default suggestions.');
      setRecommendations(defaultRecommendations);
    } finally {
      setIsLoading(false);
    }
  };

  // Load recommendations on component mount
  useEffect(() => {
    fetchRecommendations();
  }, []);

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
        {error && (
          <div className="text-sm text-red-500 mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded">
            {error}
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
             <Button 
              onClick={fetchRecommendations} 
              variant="outline" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Regenerate
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
