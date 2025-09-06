'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, AlertTriangle, Target, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface AIInsightsProps {
    symbol?: string;
    timeframe?: string;
    onInsightsUpdate?: (insights: any) => void;
}

export function AIInsights({ 
    symbol = 'BTC', 
    timeframe = '24h',
    onInsightsUpdate 
}: AIInsightsProps) {
    const [insights, setInsights] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('analysis');
    const { toast } = useToast();

    useEffect(() => {
        fetchInsights();
    }, [symbol, timeframe]);

    const fetchInsights = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/studio/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'analyze',
                    symbol,
                    timeframe
                })
            });
            const data = await response.json();
            setInsights(data);
            onInsightsUpdate?.(data);
        } catch (error) {
            console.error('Failed to fetch AI insights:', error);
            toast({
                title: "Error",
                description: "Failed to load AI insights",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getSentimentColor = (sentiment: string) => {
        switch (sentiment.toLowerCase()) {
            case 'bullish': return 'bg-green-500/20 text-green-500 border-green-500/30';
            case 'bearish': return 'bg-red-500/20 text-red-500 border-red-500/30';
            case 'neutral': return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
            default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
        }
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) return 'text-green-500';
        if (confidence >= 0.6) return 'text-yellow-500';
        return 'text-red-500';
    };

    if (isLoading) {
        return (
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                        <div className="h-8 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!insights) {
        return (
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Failed to load AI insights</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Main Analysis Card */}
            <Card className="bg-card/50 backdrop-blur-lg border-primary/20">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-6 w-6" />
                            AI Market Analysis
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchInsights}
                            disabled={isLoading}
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                    <CardDescription>
                        AI-powered insights for {symbol} ({timeframe})
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Sentiment:</span>
                            <Badge className={getSentimentColor(insights.sentiment)}>
                                {insights.sentiment}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Confidence:</span>
                            <span className={`font-medium ${getConfidenceColor(insights.confidence)}`}>
                                {Math.round(insights.confidence * 100)}%
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium">Key Recommendations:</h4>
                        <ul className="space-y-1">
                            {insights.recommendations.map((rec: string, index: number) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Analysis Tabs */}
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardContent className="p-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="analysis">Technical Analysis</TabsTrigger>
                            <TabsTrigger value="predictions">Predictions</TabsTrigger>
                            <TabsTrigger value="insights">Market Insights</TabsTrigger>
                        </TabsList>

                        <TabsContent value="analysis" className="p-6 space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary">{insights.technicalIndicators.rsi}</p>
                                    <p className="text-sm text-muted-foreground">RSI</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary">{insights.technicalIndicators.macd}</p>
                                    <p className="text-sm text-muted-foreground">MACD</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary">
                                        {insights.technicalIndicators.bollinger.replace('_', ' ')}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Bollinger</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary">
                                        {insights.technicalIndicators.movingAverage.sma20}
                                    </p>
                                    <p className="text-sm text-muted-foreground">SMA 20</p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="predictions" className="p-6 space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-primary">${insights.priceTargets.short.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Short Term</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-primary">${insights.priceTargets.medium.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Medium Term</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-primary">${insights.priceTargets.long.toLocaleString()}</p>
                                    <p className="text-sm text-muted-foreground">Long Term</p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="insights" className="p-6 space-y-4">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium flex items-center gap-2 mb-2">
                                        <TrendingUp className="h-4 w-4" />
                                        Market Overview
                                    </h4>
                                    <p className="text-sm text-muted-foreground">{insights.marketOverview}</p>
                                </div>

                                <div>
                                    <h4 className="font-medium flex items-center gap-2 mb-2">
                                        <Target className="h-4 w-4" />
                                        Key Events
                                    </h4>
                                    <ul className="space-y-1">
                                        {insights.keyEvents.map((event: string, index: number) => (
                                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                                <span className="text-primary mt-1">•</span>
                                                {event}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-medium flex items-center gap-2 mb-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Risk Factors
                                    </h4>
                                    <ul className="space-y-1">
                                        {insights.riskFactors.map((risk: string, index: number) => (
                                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                                <span className="text-red-500 mt-1">•</span>
                                                {risk}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
