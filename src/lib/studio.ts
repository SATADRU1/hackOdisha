import axios from 'axios';

// Blackdag / Free NFT Maker | Design & Mint - Mediamodifier https://share.google/3Rij5fdeEPaN7b9rB API configuration
const STUDIO_API_BASE = process.env.NEXT_PUBLIC_STUDIO_API_URL || 'https://api.blackdag.studio/v1';
const STUDIO_API_KEY = process.env.STUDIO_API_KEY;

// Create axios instance for Studio API
export const studioApi = axios.create({
    baseURL: STUDIO_API_BASE,
    headers: {
        'Authorization': `Bearer ${STUDIO_API_KEY}`,
        'Content-Type': 'application/json',
    },
    timeout: 20000,
});

// Request interceptor for logging
studioApi.interceptors.request.use(
    (config) => {
        console.log(`[Studio API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('[Studio API] Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
studioApi.interceptors.response.use(
    (response) => {
        console.log(`[Studio API] Response: ${response.status} ${response.statusText}`);
        return response;
    },
    (error) => {
        console.error('[Studio API] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Charts API functions
export const chartsApi = {
    // Get chart data
    getChartData: async (type: string, timeframe: string, symbol: string, indicators?: string[]) => {
        const response = await studioApi.get('/charts/data', {
            params: {
                type,
                timeframe,
                symbol,
                indicators: indicators?.join(',')
            }
        });
        return response.data;
    },

    // Create custom chart
    createChart: async (config: {
        type: string;
        timeframe: string;
        symbol: string;
        indicators: string[];
        name?: string;
        description?: string;
    }) => {
        const response = await studioApi.post('/charts/create', config);
        return response.data;
    },

    // Export chart data
    exportChart: async (chartId: string, format: 'json' | 'csv' | 'xlsx' = 'json') => {
        const response = await studioApi.get(`/charts/${chartId}/export`, {
            params: { format },
            responseType: 'blob'
        });
        return response.data;
    },

    // Get available indicators
    getIndicators: async () => {
        const response = await studioApi.get('/charts/indicators');
        return response.data;
    },

    // Get market data
    getMarketData: async (symbol: string, timeframe: string, limit: number = 1000) => {
        const response = await studioApi.get('/charts/market-data', {
            params: { symbol, timeframe, limit }
        });
        return response.data;
    },

    // Get real-time data
    getRealTimeData: async (symbols: string[]) => {
        const response = await studioApi.get('/charts/realtime', {
            params: { symbols: symbols.join(',') }
        });
        return response.data;
    }
};

// AI Analysis API functions
export const aiApi = {
    // Analyze market with AI
    analyzeMarket: async (symbol: string, timeframe: string, indicators?: string[]) => {
        const response = await studioApi.post('/ai/analyze', {
            symbol,
            timeframe,
            indicators
        });
        return response.data;
    },

    // Generate price predictions
    generatePredictions: async (config: {
        symbol: string;
        timeframe: string;
        predictionType: 'price' | 'volume' | 'volatility';
        horizon: string;
        model?: string;
    }) => {
        const response = await studioApi.post('/ai/predict', config);
        return response.data;
    },

    // Get market insights
    getMarketInsights: async (symbols?: string[], timeframe?: string) => {
        const response = await studioApi.post('/ai/insights', {
            symbols,
            timeframe
        });
        return response.data;
    },

    // Get sentiment analysis
    getSentimentAnalysis: async (symbol: string, sources?: string[]) => {
        const response = await studioApi.post('/ai/sentiment', {
            symbol,
            sources
        });
        return response.data;
    },

    // Get technical analysis
    getTechnicalAnalysis: async (symbol: string, timeframe: string, indicators: string[]) => {
        const response = await studioApi.post('/ai/technical', {
            symbol,
            timeframe,
            indicators
        });
        return response.data;
    },

    // Get risk assessment
    getRiskAssessment: async (symbol: string, portfolio?: any[]) => {
        const response = await studioApi.post('/ai/risk', {
            symbol,
            portfolio
        });
        return response.data;
    }
};

// Data API functions
export const dataApi = {
    // Get historical data
    getHistoricalData: async (symbol: string, timeframe: string, startDate: string, endDate: string) => {
        const response = await studioApi.get('/data/historical', {
            params: { symbol, timeframe, startDate, endDate }
        });
        return response.data;
    },

    // Get current prices
    getCurrentPrices: async (symbols: string[]) => {
        const response = await studioApi.get('/data/prices', {
            params: { symbols: symbols.join(',') }
        });
        return response.data;
    },

    // Get market cap data
    getMarketCapData: async (symbols?: string[]) => {
        const response = await studioApi.get('/data/market-cap', {
            params: { symbols: symbols?.join(',') }
        });
        return response.data;
    },

    // Get volume data
    getVolumeData: async (symbol: string, timeframe: string) => {
        const response = await studioApi.get('/data/volume', {
            params: { symbol, timeframe }
        });
        return response.data;
    },

    // Get news data
    getNewsData: async (symbol?: string, limit: number = 50) => {
        const response = await studioApi.get('/data/news', {
            params: { symbol, limit }
        });
        return response.data;
    }
};

// Utility functions
export const studioUtils = {
    // Format price for display
    formatPrice: (price: number, currency: string = 'USD', decimals: number = 2) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(price);
    },

    // Format percentage
    formatPercentage: (value: number, decimals: number = 2) => {
        return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
    },

    // Format large numbers
    formatLargeNumber: (num: number) => {
        if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
        if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
        if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
        return num.toFixed(2);
    },

    // Format timestamp
    formatTimestamp: (timestamp: string | number, format: 'short' | 'long' | 'time' = 'short') => {
        const date = new Date(timestamp);
        
        switch (format) {
            case 'short':
                return date.toLocaleDateString();
            case 'long':
                return date.toLocaleString();
            case 'time':
                return date.toLocaleTimeString();
            default:
                return date.toLocaleString();
        }
    },

    // Calculate price change
    calculatePriceChange: (current: number, previous: number) => {
        const change = current - previous;
        const changePercent = (change / previous) * 100;
        return {
            change,
            changePercent,
            isPositive: change >= 0
        };
    },

    // Get timeframe display name
    getTimeframeName: (timeframe: string) => {
        const timeframes: { [key: string]: string } = {
            '1m': '1 Minute',
            '5m': '5 Minutes',
            '15m': '15 Minutes',
            '1h': '1 Hour',
            '4h': '4 Hours',
            '1d': '1 Day',
            '1w': '1 Week',
            '1M': '1 Month'
        };
        return timeframes[timeframe] || timeframe;
    },

    // Validate symbol format
    isValidSymbol: (symbol: string) => {
        return /^[A-Z0-9]{2,10}$/.test(symbol);
    },

    // Get color for price change
    getPriceChangeColor: (change: number) => {
        if (change > 0) return 'text-green-500';
        if (change < 0) return 'text-red-500';
        return 'text-gray-500';
    },

    // Calculate moving average
    calculateMovingAverage: (data: number[], period: number) => {
        if (data.length < period) return [];
        
        const result = [];
        for (let i = period - 1; i < data.length; i++) {
            const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            result.push(sum / period);
        }
        return result;
    },

    // Calculate RSI
    calculateRSI: (prices: number[], period: number = 14) => {
        if (prices.length < period + 1) return [];
        
        const gains = [];
        const losses = [];
        
        for (let i = 1; i < prices.length; i++) {
            const change = prices[i] - prices[i - 1];
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? Math.abs(change) : 0);
        }
        
        const rsi = [];
        for (let i = period - 1; i < gains.length; i++) {
            const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
            const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
            
            if (avgLoss === 0) {
                rsi.push(100);
            } else {
                const rs = avgGain / avgLoss;
                rsi.push(100 - (100 / (1 + rs)));
            }
        }
        
        return rsi;
    }
};

// Error handling
export class StudioError extends Error {
    constructor(
        message: string,
        public code?: string,
        public statusCode?: number
    ) {
        super(message);
        this.name = 'StudioError';
    }
}

// Error handler for API responses
export const handleStudioError = (error: any): StudioError => {
    if (error.response) {
        const { status, data } = error.response;
        return new StudioError(
            data.message || 'API request failed',
            data.code,
            status
        );
    } else if (error.request) {
        return new StudioError('Network error - no response received');
    } else {
        return new StudioError(error.message || 'Unknown error occurred');
    }
};
