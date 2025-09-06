import axios from 'axios';

export interface VerbwireConfig {
  apiKey: string;
  baseUrl: string;
}

export interface NFTMetadata {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface WalletBalance {
  address: string;
  balance: string;
  tokens: Array<{
    contractAddress: string;
    symbol: string;
    balance: string;
  }>;
}

export class VerbwireAdapter {
  private config: VerbwireConfig;

  constructor(config: VerbwireConfig) {
    this.config = config;
  }

  async getWalletBalance(address: string): Promise<WalletBalance> {
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/wallet/balance/${address}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw new Error('Failed to fetch wallet balance');
    }
  }

  async getNFTs(address: string): Promise<NFTMetadata[]> {
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/nft/owned/${address}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.nfts || [];
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      throw new Error('Failed to fetch NFTs');
    }
  }

  async getMarketData(contractAddress: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/market/data/${contractAddress}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw new Error('Failed to fetch market data');
    }
  }

  async getTransactionHistory(address: string, limit = 100): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/transactions/${address}`,
        {
          params: { limit },
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.transactions || [];
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw new Error('Failed to fetch transaction history');
    }
  }
}

// Default configuration
export const defaultVerbwireConfig: VerbwireConfig = {
  apiKey: process.env.VERBWIRE_API_KEY || '',
  baseUrl: process.env.VERBWIRE_BASE_URL || 'https://api.verbwire.com/v1'
};
