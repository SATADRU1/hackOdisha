import axios from 'axios';

// Gofr Backend API configuration
const GOFR_API_BASE = process.env.NEXT_PUBLIC_GOFR_API_URL || 'http://localhost:8080/api/v1';
const GOFR_API_KEY = process.env.GOFR_API_KEY;

// Create axios instance for Gofr API
export const gofrApi = axios.create({
    baseURL: GOFR_API_BASE,
    headers: {
        'Authorization': `Bearer ${GOFR_API_KEY}`,
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// Request interceptor for authentication
gofrApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('gofr_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[Gofr API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('[Gofr API] Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
gofrApi.interceptors.response.use(
    (response) => {
        console.log(`[Gofr API] Response: ${response.status} ${response.statusText}`);
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired, clear it
            localStorage.removeItem('gofr_token');
            window.location.href = '/auth';
        }
        console.error('[Gofr API] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Authentication API functions
export const authApi = {
    // User login
    login: async (email: string, password: string) => {
        const response = await gofrApi.post('/auth/login', {
            email,
            password
        });
        return response.data;
    },

    // User registration
    register: async (email: string, password: string, name: string) => {
        const response = await gofrApi.post('/auth/register', {
            email,
            password,
            name
        });
        return response.data;
    },

    // User logout
    logout: async () => {
        const response = await gofrApi.post('/auth/logout');
        return response.data;
    },

    // Verify token
    verifyToken: async (token: string) => {
        const response = await gofrApi.get('/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Refresh token
    refreshToken: async (refreshToken: string) => {
        const response = await gofrApi.post('/auth/refresh', {
            refreshToken
        });
        return response.data;
    },

    // Get user profile
    getProfile: async () => {
        const response = await gofrApi.get('/auth/profile');
        return response.data;
    },

    // Update user profile
    updateProfile: async (data: { name?: string; email?: string }) => {
        const response = await gofrApi.put('/auth/profile', data);
        return response.data;
    }
};

// Mining API functions
export const miningApi = {
    // Get mining status
    getStatus: async (userId: string) => {
        const response = await gofrApi.get(`/mining/status/${userId}`);
        return response.data;
    },

    // Start mining
    startMining: async (config?: any) => {
        const response = await gofrApi.post('/mining/start', config);
        return response.data;
    },

    // Stop mining
    stopMining: async () => {
        const response = await gofrApi.post('/mining/stop');
        return response.data;
    },

    // Configure mining
    configureMining: async (config: {
        pool: string;
        algorithm: string;
        intensity: number;
        autoStart: boolean;
        temperatureLimit: number;
        powerLimit: number;
    }) => {
        const response = await gofrApi.put('/mining/configure', config);
        return response.data;
    },

    // Get mining statistics
    getStats: async (userId: string, timeframe: string = '24h') => {
        const response = await gofrApi.get(`/mining/stats/${userId}`, {
            params: { timeframe }
        });
        return response.data;
    },

    // Get mining history
    getHistory: async (userId: string, limit: number = 100, offset: number = 0) => {
        const response = await gofrApi.get(`/mining/history/${userId}`, {
            params: { limit, offset }
        });
        return response.data;
    },

    // Get earnings
    getEarnings: async (userId: string, period: string = 'all') => {
        const response = await gofrApi.get(`/mining/earnings/${userId}`, {
            params: { period }
        });
        return response.data;
    },

    // Get pool information
    getPoolInfo: async (poolUrl: string) => {
        const response = await gofrApi.get('/mining/pool/info', {
            params: { url: poolUrl }
        });
        return response.data;
    }
};

// Portfolio API functions
export const portfolioApi = {
    // Get user portfolio
    getPortfolio: async (userId: string) => {
        const response = await gofrApi.get(`/portfolio/${userId}`);
        return response.data;
    },

    // Add asset to portfolio
    addAsset: async (userId: string, asset: {
        symbol: string;
        amount: number;
        purchasePrice: number;
        purchaseDate: string;
    }) => {
        const response = await gofrApi.post(`/portfolio/${userId}/assets`, asset);
        return response.data;
    },

    // Update asset in portfolio
    updateAsset: async (userId: string, assetId: string, data: any) => {
        const response = await gofrApi.put(`/portfolio/${userId}/assets/${assetId}`, data);
        return response.data;
    },

    // Remove asset from portfolio
    removeAsset: async (userId: string, assetId: string) => {
        const response = await gofrApi.delete(`/portfolio/${userId}/assets/${assetId}`);
        return response.data;
    },

    // Get portfolio performance
    getPerformance: async (userId: string, timeframe: string = '1y') => {
        const response = await gofrApi.get(`/portfolio/${userId}/performance`, {
            params: { timeframe }
        });
        return response.data;
    }
};

// Utility functions
export const gofrUtils = {
    // Format hashrate for display
    formatHashrate: (hashrate: number) => {
        const units = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s'];
        let unitIndex = 0;
        let value = hashrate;

        while (value >= 1000 && unitIndex < units.length - 1) {
            value /= 1000;
            unitIndex++;
        }

        return `${value.toFixed(2)} ${units[unitIndex]}`;
    },

    // Format power consumption
    formatPower: (watts: number) => {
        if (watts >= 1000) {
            return `${(watts / 1000).toFixed(2)} kW`;
        }
        return `${watts.toFixed(0)} W`;
    },

    // Format temperature
    formatTemperature: (celsius: number) => {
        return `${celsius.toFixed(1)}°C`;
    },

    // Format uptime
    formatUptime: (seconds: number) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    },

    // Calculate mining profitability
    calculateProfitability: (hashrate: number, powerConsumption: number, electricityCost: number) => {
        const dailyPowerCost = (powerConsumption / 1000) * 24 * electricityCost;
        // This would need real mining profitability data
        const estimatedDailyRevenue = hashrate * 0.0001; // Placeholder calculation
        const dailyProfit = estimatedDailyRevenue - dailyPowerCost;
        
        return {
            dailyRevenue: estimatedDailyRevenue,
            dailyPowerCost,
            dailyProfit,
            roi: dailyProfit / dailyPowerCost * 100
        };
    },

    // Validate pool URL
    isValidPoolUrl: (url: string) => {
        const poolRegex = /^stratum\+tcp:\/\/[a-zA-Z0-9.-]+:\d+$/;
        return poolRegex.test(url);
    },

    // Get algorithm display name
    getAlgorithmName: (algorithm: string) => {
        const algorithms: { [key: string]: string } = {
            'sha256': 'SHA-256 (Bitcoin)',
            'scrypt': 'Scrypt (Litecoin)',
            'ethash': 'Ethash (Ethereum)',
            'equihash': 'Equihash (Zcash)',
            'x11': 'X11 (Dash)',
            'lyra2z': 'Lyra2Z (Zcoin)'
        };
        return algorithms[algorithm] || algorithm;
    }
};

// Error handling
export class GofrError extends Error {
    constructor(
        message: string,
        public code?: string,
        public statusCode?: number
    ) {
        super(message);
        this.name = 'GofrError';
    }
}

// Error handler for API responses
export const handleGofrError = (error: any): GofrError => {
    if (error.response) {
        const { status, data } = error.response;
        return new GofrError(
            data.message || 'API request failed',
            data.code,
            status
        );
    } else if (error.request) {
        return new GofrError('Network error - no response received');
    } else {
        return new GofrError(error.message || 'Unknown error occurred');
    }
};
