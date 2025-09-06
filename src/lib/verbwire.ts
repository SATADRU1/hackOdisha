import axios from 'axios';

// Verbwire API configuration
const VERBWIRE_API_BASE = process.env.NEXT_PUBLIC_VERBWIRE_API_URL || 'https://api.verbwire.com/v1';
const VERBWIRE_API_KEY = process.env.VERBWIRE_API_KEY;

// Create axios instance for Verbwire API
export const verbwireApi = axios.create({
    baseURL: VERBWIRE_API_BASE,
    headers: {
        'Authorization': `Bearer ${VERBWIRE_API_KEY}`,
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor for logging
verbwireApi.interceptors.request.use(
    (config) => {
        console.log(`[Verbwire API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('[Verbwire API] Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
verbwireApi.interceptors.response.use(
    (response) => {
        console.log(`[Verbwire API] Response: ${response.status} ${response.statusText}`);
        return response;
    },
    (error) => {
        console.error('[Verbwire API] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Wallet API functions
export const walletApi = {
    // Get wallet information
    getWallet: async (address: string) => {
        const response = await verbwireApi.get(`/wallets/${address}`);
        return response.data;
    },

    // Create new wallet
    createWallet: async () => {
        const response = await verbwireApi.post('/wallets');
        return response.data;
    },

    // Get wallet balance
    getBalance: async (address: string, currency: string = 'ETH') => {
        const response = await verbwireApi.get(`/wallets/${address}/balance`, {
            params: { currency }
        });
        return response.data;
    },

    // Transfer funds
    transfer: async (from: string, to: string, amount: string, currency: string) => {
        const response = await verbwireApi.post('/wallets/transfer', {
            from,
            to,
            amount,
            currency
        });
        return response.data;
    },

    // Get transaction history
    getTransactions: async (address: string, limit: number = 50, offset: number = 0) => {
        const response = await verbwireApi.get(`/wallets/${address}/transactions`, {
            params: { limit, offset }
        });
        return response.data;
    }
};

// NFT API functions
export const nftApi = {
    // Get NFTs by owner
    getNFTsByOwner: async (owner: string, collection?: string) => {
        const params: any = { owner };
        if (collection) params.collection = collection;
        
        const response = await verbwireApi.get('/nfts', { params });
        return response.data;
    },

    // Get NFT details
    getNFT: async (contractAddress: string, tokenId: string) => {
        const response = await verbwireApi.get(`/nfts/${contractAddress}/${tokenId}`);
        return response.data;
    },

    // Mint NFT
    mint: async (contractAddress: string, to: string, tokenURI: string) => {
        const response = await verbwireApi.post('/nfts/mint', {
            contractAddress,
            to,
            tokenURI
        });
        return response.data;
    },

    // Transfer NFT
    transfer: async (contractAddress: string, tokenId: string, from: string, to: string) => {
        const response = await verbwireApi.post('/nfts/transfer', {
            contractAddress,
            tokenId,
            from,
            to
        });
        return response.data;
    },

    // List NFT for sale
    listForSale: async (contractAddress: string, tokenId: string, price: string, currency: string) => {
        const response = await verbwireApi.post('/nfts/list', {
            contractAddress,
            tokenId,
            price,
            currency
        });
        return response.data;
    },

    // Buy NFT
    buy: async (contractAddress: string, tokenId: string, buyer: string) => {
        const response = await verbwireApi.post('/nfts/buy', {
            contractAddress,
            tokenId,
            buyer
        });
        return response.data;
    }
};

// Payment API functions
export const paymentApi = {
    // Send payment
    sendPayment: async (from: string, to: string, amount: string, currency: string, memo?: string) => {
        const response = await verbwireApi.post('/payments/send', {
            from,
            to,
            amount,
            currency,
            memo
        });
        return response.data;
    },

    // Request payment
    requestPayment: async (from: string, amount: string, currency: string, memo?: string) => {
        const response = await verbwireApi.post('/payments/request', {
            from,
            amount,
            currency,
            memo
        });
        return response.data;
    },

    // Get payment history
    getPayments: async (wallet: string, limit: number = 50, offset: number = 0) => {
        const response = await verbwireApi.get(`/payments/${wallet}`, {
            params: { limit, offset }
        });
        return response.data;
    },

    // Get payment status
    getPaymentStatus: async (paymentId: string) => {
        const response = await verbwireApi.get(`/payments/status/${paymentId}`);
        return response.data;
    }
};

// Utility functions
export const verbwireUtils = {
    // Format wallet address for display
    formatAddress: (address: string, startChars: number = 6, endChars: number = 4) => {
        if (!address) return '';
        return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
    },

    // Convert wei to ETH
    weiToEth: (wei: string) => {
        return (parseFloat(wei) / Math.pow(10, 18)).toString();
    },

    // Convert ETH to wei
    ethToWei: (eth: string) => {
        return (parseFloat(eth) * Math.pow(10, 18)).toString();
    },

    // Validate Ethereum address
    isValidAddress: (address: string) => {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    },

    // Get transaction explorer URL
    getExplorerUrl: (txHash: string, network: string = 'mainnet') => {
        const explorers = {
            mainnet: 'https://etherscan.io/tx/',
            goerli: 'https://goerli.etherscan.io/tx/',
            sepolia: 'https://sepolia.etherscan.io/tx/'
        };
        return `${explorers[network as keyof typeof explorers] || explorers.mainnet}${txHash}`;
    },

    // Get address explorer URL
    getAddressExplorerUrl: (address: string, network: string = 'mainnet') => {
        const explorers = {
            mainnet: 'https://etherscan.io/address/',
            goerli: 'https://goerli.etherscan.io/address/',
            sepolia: 'https://sepolia.etherscan.io/address/'
        };
        return `${explorers[network as keyof typeof explorers] || explorers.mainnet}${address}`;
    }
};

// Error handling
export class VerbwireError extends Error {
    constructor(
        message: string,
        public code?: string,
        public statusCode?: number
    ) {
        super(message);
        this.name = 'VerbwireError';
    }
}

// Error handler for API responses
export const handleVerbwireError = (error: any): VerbwireError => {
    if (error.response) {
        const { status, data } = error.response;
        return new VerbwireError(
            data.message || 'API request failed',
            data.code,
            status
        );
    } else if (error.request) {
        return new VerbwireError('Network error - no response received');
    } else {
        return new VerbwireError(error.message || 'Unknown error occurred');
    }
};
