'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useStudio } from "@/hooks/use-studio";

export function AITestPanel() {
    const [testType, setTestType] = useState('analyze');
    const [symbol, setSymbol] = useState('BTC');
    const [timeframe, setTimeframe] = useState('1h');
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        analyzeMarket,
        getMiningRecommendations,
        analyzePortfolio,
        getTradingSignals,
        getMarketInsights
    } = useStudio();

    const handleTest = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            let response;
            const mockData = {
                price: 45000,
                volume: 1000000,
                change: 0.05,
                marketCap: 850000000000
            };

            switch (testType) {
                case 'analyze':
                    response = await analyzeMarket(symbol, timeframe, undefined, mockData);
                    break;
                case 'mining':
                    response = await getMiningRecommendations(mockData, {
                        budget: 10000,
                        hardware: 'GPU',
                        riskTolerance: 'medium'
                    });
                    break;
                case 'portfolio':
                    response = await analyzePortfolio([
                        { symbol: 'BTC', amount: 0.5, value: 22500 },
                        { symbol: 'ETH', amount: 2.0, value: 6400 }
                    ], mockData);
                    break;
                case 'signals':
                    response = await getTradingSignals(symbol, {
                        rsi: 65,
                        macd: 0.0234,
                        sma20: 45234,
                        ema50: 44891
                    });
                    break;
                case 'insights':
                    response = await getMarketInsights();
                    break;
                default:
                    throw new Error('Invalid test type');
            }

            setResult(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = () => {
        if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
        if (error) return <XCircle className="h-4 w-4 text-red-500" />;
        if (result) return <CheckCircle className="h-4 w-4 text-green-500" />;
        return <Brain className="h-4 w-4" />;
    };

    const getStatusText = () => {
        if (isLoading) return 'Testing AI...';
        if (error) return 'Test Failed';
        if (result) return 'Test Successful';
        return 'Ready to Test';
    };

    return (
        <Card className="bg-card/50 backdrop-blur-lg border-border/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6" />
                    AI Services Test Panel
                </CardTitle>
                <CardDescription>
                    Test your Gemini and Ollama AI integrations
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Test Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="testType">Test Type</Label>
                        <Select value={testType} onValueChange={setTestType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="analyze">Market Analysis (Gemini)</SelectItem>
                                <SelectItem value="mining">Mining Recommendations (Ollama)</SelectItem>
                                <SelectItem value="portfolio">Portfolio Analysis (Ollama)</SelectItem>
                                <SelectItem value="signals">Trading Signals (Gemini)</SelectItem>
                                <SelectItem value="insights">Market Insights (Gemini)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="symbol">Symbol</Label>
                        <Input
                            id="symbol"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            placeholder="BTC"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="timeframe">Timeframe</Label>
                        <Select value={timeframe} onValueChange={setTimeframe}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1h">1 Hour</SelectItem>
                                <SelectItem value="4h">4 Hours</SelectItem>
                                <SelectItem value="1d">1 Day</SelectItem>
                                <SelectItem value="1w">1 Week</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <div className="flex items-center gap-2">
                            {getStatusIcon()}
                            <span className="text-sm">{getStatusText()}</span>
                        </div>
                    </div>
                </div>

                {/* Test Button */}
                <Button 
                    onClick={handleTest} 
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testing AI Service...
                        </>
                    ) : (
                        <>
                            <Brain className="mr-2 h-4 w-4" />
                            Run AI Test
                        </>
                    )}
                </Button>

                {/* Error Display */}
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="flex items-center gap-2 text-red-500">
                            <XCircle className="h-4 w-4" />
                            <span className="font-medium">Error</span>
                        </div>
                        <p className="text-sm text-red-400 mt-1">{error}</p>
                    </div>
                )}

                {/* Results Display */}
                {result && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-medium">AI Response Received</span>
                        </div>
                        
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Response Data:</h4>
                            <pre className="text-xs overflow-auto max-h-96">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>

                        {/* Quick Summary */}
                        {result.recommendedCoins && (
                            <div className="space-y-2">
                                <h4 className="font-medium">Recommended Coins:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.recommendedCoins.map((coin: any, index: number) => (
                                        <Badge key={index} variant="outline">
                                            {coin.coin}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.sentiment && (
                            <div className="space-y-2">
                                <h4 className="font-medium">Market Sentiment:</h4>
                                <Badge 
                                    variant={result.sentiment === 'bullish' ? 'default' : 
                                           result.sentiment === 'bearish' ? 'destructive' : 'secondary'}
                                >
                                    {result.sentiment}
                                </Badge>
                            </div>
                        )}
                    </div>
                )}

                {/* Setup Instructions */}
                <div className="text-xs text-muted-foreground space-y-2">
                    <p><strong>Setup Required:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Install Ollama: <code>curl -fsSL https://ollama.ai/install.sh | sh</code></li>
                        <li>Start Ollama: <code>ollama serve</code></li>
                        <li>Pull models: <code>ollama pull llama3.2 mistral</code></li>
                        <li>Set GOOGLE_AI_API_KEY in your .env file</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
