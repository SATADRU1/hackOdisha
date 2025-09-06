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

// Focus API functions
export const focusApi = {
    // Get focus status
    getStatus: async (userId: string) => {
        const response = await gofrApi.get(`/focus/status/${userId}`);
        return response.data;
    },

    // Start focus session
    startFocusSession: async (duration: number, stakeAmount: number) => {
        const response = await gofrApi.post('/focus/start', {
            duration,
            stakeAmount
        });
        return response.data;
    },

    // Complete focus session
    completeFocusSession: async (sessionId: number, isSuccess: boolean) => {
        const response = await gofrApi.post('/focus/complete', {
            sessionId,
            isSuccess
        });
        return response.data;
    },

    // Configure focus settings
    configureFocus: async (config: {
        defaultDuration: number;
        defaultStake: number;
        blockedWebsites: string[];
        notificationSound: boolean;
        autoStartBreak: boolean;
        breakDuration: number;
    }) => {
        const response = await gofrApi.put('/focus/configure', config);
        return response.data;
    },

    // Get focus statistics
    getStats: async (userId: string, timeframe: string = '24h') => {
        const response = await gofrApi.get(`/focus/stats/${userId}`, {
            params: { timeframe }
        });
        return response.data;
    },

    // Get focus history
    getHistory: async (userId: string, limit: number = 100, offset: number = 0) => {
        const response = await gofrApi.get(`/focus/history/${userId}`, {
            params: { limit, offset }
        });
        return response.data;
    },

    // Get earnings
    getEarnings: async (userId: string, period: string = 'all') => {
        const response = await gofrApi.get(`/focus/earnings/${userId}`, {
            params: { period }
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
export const focusUtils = {
    // Format duration for display
    formatDuration: (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    },

    // Format time remaining
    formatTimeRemaining: (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    },

    // Format stake amount
    formatStake: (amount: number, currency: string = 'ETH') => {
        return `${amount.toFixed(4)} ${currency}`;
    },

    // Format reward amount
    formatReward: (amount: number, currency: string = 'ETH') => {
        return `${amount.toFixed(4)} ${currency}`;
    },

    // Calculate success rate
    calculateSuccessRate: (completed: number, total: number) => {
        if (total === 0) return 0;
        return (completed / total) * 100;
    },

    // Calculate ROI
    calculateROI: (earned: number, staked: number) => {
        if (staked === 0) return 0;
        return ((earned - staked) / staked) * 100;
    },

    // Validate stake amount
    isValidStakeAmount: (amount: number) => {
        return amount >= 0.001 && amount <= 10.0;
    },

    // Validate session duration
    isValidDuration: (minutes: number) => {
        return minutes >= 5 && minutes <= 120;
    },

    // Get session type display name
    getSessionTypeName: (duration: number) => {
        if (duration <= 15) return 'Quick Focus';
        if (duration <= 25) return 'Pomodoro';
        if (duration <= 45) return 'Deep Work';
        return 'Extended Focus';
    },

    // Calculate streak bonus
    calculateStreakBonus: (streak: number) => {
        if (streak < 3) return 0;
        if (streak < 7) return 0.05; // 5% bonus
        if (streak < 14) return 0.1; // 10% bonus
        if (streak < 30) return 0.15; // 15% bonus
        return 0.2; // 20% bonus for 30+ day streak
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
