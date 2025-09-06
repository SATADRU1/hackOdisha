import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

interface ChartData {
    type: string;
    timeframe: string;
    data: Array<{
        timestamp: string;
        value: number;
        volume: number;
    }>;
    metadata: {
        source: string;
        lastUpdated: string;
        resolution: string;
    };
}

interface AIAnalysis {
    symbol: string;
    timeframe: string;
    sentiment: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    recommendations: string[];
    technicalIndicators: {
        rsi: number;
        macd: number;
        bollinger: string;
        movingAverage: {
            sma20: number;
            ema50: number;
        };
    };
    priceTargets: {
        short: number;
        medium: number;
        long: number;
    };
}

interface Prediction {
    type: string;
    horizon: string;
    predictions: Array<{
        timestamp: string;
        price: number;
        confidence: number;
    }>;
    accuracy: number;
}

interface MarketInsights {
    marketOverview: string;
    keyEvents: string[];
    riskFactors: string[];
    opportunities: string[];
}

export function useStudio() {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
    const [predictions, setPredictions] = useState<Prediction | null>(null);
    const [marketInsights, setMarketInsights] = useState<MarketInsights | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // Chart functions
    const fetchChartData = async (type: string, timeframe: string, symbol: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/studio/charts?type=${type}&timeframe=${timeframe}&symbol=${symbol}`
            );
            const data = await response.json();
            setChartData(data);
            return data;
        } catch (error) {
            console.error('Failed to fetch chart data:', error);
            toast({
                title: "Error",
                description: "Failed to fetch chart data",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const createChart = async (type: string, timeframe: string, symbol: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/studio/charts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create',
                    type,
                    timeframe,
                    symbol
                })
            });
            const data = await response.json();
            toast({
                title: "Chart Created",
                description: data.message,
            });
            return data;
        } catch (error) {
            console.error('Failed to create chart:', error);
            toast({
                title: "Error",
                description: "Failed to create chart",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const exportChart = async (type: string, timeframe: string, symbol: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/studio/charts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'export',
                    type,
                    timeframe,
                    symbol
                })
            });
            const data = await response.json();
            toast({
                title: "Chart Exported",
                description: data.message,
            });
            return data;
        } catch (error) {
            console.error('Failed to export chart:', error);
            toast({
                title: "Error",
                description: "Failed to export chart",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // AI Analysis functions
    const analyzeMarket = async (symbol: string, timeframe: string, indicators?: string[]) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/studio/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'analyze',
                    symbol,
                    timeframe,
                    indicators
                })
            });
            const data = await response.json();
            setAiAnalysis(data);
            return data;
        } catch (error) {
            console.error('Failed to analyze market:', error);
            toast({
                title: "Error",
                description: "Failed to analyze market",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const generatePredictions = async (predictionType: string, horizon: string, symbol: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/studio/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'predict',
                    predictionType,
                    horizon,
                    symbol
                })
            });
            const data = await response.json();
            setPredictions(data);
            return data;
        } catch (error) {
            console.error('Failed to generate predictions:', error);
            toast({
                title: "Error",
                description: "Failed to generate predictions",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const getMarketInsights = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/studio/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'insights'
                })
            });
            const data = await response.json();
            setMarketInsights(data);
            return data;
        } catch (error) {
            console.error('Failed to get market insights:', error);
            toast({
                title: "Error",
                description: "Failed to get market insights",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Mining recommendations
    const getMiningRecommendations = async (marketData: any, userPreferences?: any) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/studio/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'mining-recommendations',
                    marketData,
                    userPreferences
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to get mining recommendations:', error);
            toast({
                title: "Error",
                description: "Failed to get mining recommendations",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Portfolio analysis
    const analyzePortfolio = async (portfolio: any[], marketData: any) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/studio/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'portfolio-analysis',
                    portfolio,
                    marketData
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to analyze portfolio:', error);
            toast({
                title: "Error",
                description: "Failed to analyze portfolio",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Trading signals
    const getTradingSignals = async (symbol: string, technicalData: any) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/studio/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'trading-signals',
                    symbol,
                    technicalData
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to get trading signals:', error);
            toast({
                title: "Error",
                description: "Failed to get trading signals",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Combined analysis function
    const getFullAnalysis = async (symbol: string, timeframe: string) => {
        setIsLoading(true);
        try {
            const [chart, analysis, insights] = await Promise.all([
                fetchChartData('line', timeframe, symbol),
                analyzeMarket(symbol, timeframe),
                getMarketInsights()
            ]);

            return {
                chart,
                analysis,
                insights
            };
        } catch (error) {
            console.error('Failed to get full analysis:', error);
            toast({
                title: "Error",
                description: "Failed to get complete analysis",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        // State
        chartData,
        aiAnalysis,
        predictions,
        marketInsights,
        isLoading,
        
        // Chart functions
        fetchChartData,
        createChart,
        exportChart,
        
        // AI Analysis functions
        analyzeMarket,
        generatePredictions,
        getMarketInsights,
        
        // New AI functions
        getMiningRecommendations,
        analyzePortfolio,
        getTradingSignals,
        
        // Combined functions
        getFullAnalysis,
    };
}
