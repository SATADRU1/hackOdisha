import axios, { AxiosInstance } from 'axios';
import WebSocket from 'ws';
import { EventEmitter } from 'events';

export interface NetworkConfig {
  rpcUrl: string;
  chainId: number;
  explorerUrl?: string;
  faucetUrl?: string;
  currencySymbol: string;
}

export interface BlockDAGVertex {
  id: string;
  hash: string;
  data: string;
  parents: string[];
  timestamp: number;
  nonce: number;
  weight: number;
}

export interface BlockDAGTransaction {
  id: string;
  size: number;
  fee: number;
  timestamp: number;
}

export interface BlockDAGPeer {
  id: string;
  address: string;
  last_seen: number;
}

export interface BlockDAGStatus {
  status: string;
  timestamp: number;
  mining: boolean;
  peers_count: number;
  mempool_size: number;
  current_tips: number;
}

export interface BlockMsg {
  type: string;
  block?: any;
}

const networks: Record<string, NetworkConfig> = {
  alpha: {
    rpcUrl: "rpc-stage.devdomian123.com",
    chainId: 24171,
    explorerUrl: "https://bdagscan.com/",
    currencySymbol: "BDAG",
  },
  primordial: {
    rpcUrl: "https://rpc.primordial.bdagscan.com",
    chainId: 1043,
    explorerUrl: "https://primordial.bdagscan.com/",
    faucetUrl: "https://primordial.bdagscan.com/faucet",
    currencySymbol: "BDAG",
  },
  community: {
    rpcUrl: "https://rpc-testnet.bdagscan.com",
    chainId: 24171,
    currencySymbol: "BDAG",
  },
};

export function getNetworkConfig(network: keyof typeof networks): NetworkConfig {
  return networks[network];
}

// Enhanced BlockDAG Adapter with both HTTP and WebSocket support
export class BlockDAGAdapter extends EventEmitter {
  private httpClient: AxiosInstance;
  private wsClient?: WebSocket;
  private network: string;
  rpcUrl: string;
  wsUrl: string;
  private wsRetryCount: number = 0;
  private maxWSRetries: number = 5;
  private wsEnabled: boolean = true;

  constructor(network: string = 'alpha', rpcUrl?: string, wsUrl?: string) {
    super();
    this.network = network;
    const config = getNetworkConfig(network);
    
    this.rpcUrl = rpcUrl || config.rpcUrl;
    this.wsUrl = wsUrl || `ws://${config.rpcUrl.replace('http://', '').replace('https://', '')}/ws`;
    
    this.httpClient = axios.create({
      baseURL: this.rpcUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // JSON-RPC methods
  async jsonRpc(method: string, params: any = {}) {
    const res = await this.httpClient.post('/', { jsonrpc: '2.0', method, params, id: 1 });
    return res.data.result;
  }

  async getLatestHeight() {
    try {
      const r = await this.jsonRpc('getLatestHeight');
      return r?.height ?? null;
    } catch (e) {
      return null;
    }
  }

  async getStatus(): Promise<BlockDAGStatus> {
    try {
      const response = await this.httpClient.get('/api/v1/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching BlockDAG status:', error);
      throw new Error('Failed to fetch BlockDAG status');
    }
  }

  async getPeers(): Promise<BlockDAGPeer[]> {
    try {
      const response = await this.httpClient.get('/api/v1/peers');
      return response.data;
    } catch (error) {
      console.error('Error fetching peers:', error);
      throw new Error('Failed to fetch peers');
    }
  }

  async getMempool(): Promise<{ count: number; transactions: BlockDAGTransaction[] }> {
    try {
      const response = await this.httpClient.get('/api/v1/mempool');
      return response.data;
    } catch (error) {
      console.error('Error fetching mempool:', error);
      throw new Error('Failed to fetch mempool');
    }
  }

  async getVertices(): Promise<BlockDAGVertex[]> {
    try {
      const response = await this.httpClient.get('/api/v1/vertices');
      return response.data;
    } catch (error) {
      console.error('Error fetching vertices:', error);
      throw new Error('Failed to fetch vertices');
    }
  }

  async getVertex(id: string): Promise<BlockDAGVertex> {
    try {
      const response = await this.httpClient.get(`/api/v1/vertex/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vertex:', error);
      throw new Error('Failed to fetch vertex');
    }
  }

  async getHeaviestPath(): Promise<BlockDAGVertex[]> {
    try {
      const response = await this.httpClient.get('/api/v1/heaviest-path');
      return response.data;
    } catch (error) {
      console.error('Error fetching heaviest path:', error);
      throw new Error('Failed to fetch heaviest path');
    }
  }

  async submitTransaction(data: string): Promise<{ txid: string; status: string; message: string }> {
    try {
      const response = await this.httpClient.post('/api/v1/transactions', {
        data
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting transaction:', error);
      throw new Error('Failed to submit transaction');
    }
  }

  // WebSocket connection for real-time updates
  startWS() {
    if (!this.wsEnabled || this.wsRetryCount >= this.maxWSRetries) {
      console.log('WebSocket disabled or max retries reached');
      return;
    }

    try {
      this.wsClient = new WebSocket(this.wsUrl);
      
      this.wsClient.on('open', () => {
        console.log('BlockDAG WS connected');
        this.wsRetryCount = 0; // Reset retry count on successful connection
        this.emit('open');
      });
      
      this.wsClient.on('message', (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          const msg: BlockMsg = parsed;
          this.emit('message', msg);
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      });
      
      this.wsClient.on('error', (err) => {
        console.error('WebSocket error:', err);
        this.wsRetryCount++;
        this.emit('error', err);
        
        if (this.wsRetryCount >= this.maxWSRetries) {
          console.log('Max WebSocket retries reached, disabling WebSocket');
          this.wsEnabled = false;
        }
      });
      
      this.wsClient.on('close', () => {
        console.log('WebSocket connection closed');
        if (this.wsEnabled && this.wsRetryCount < this.maxWSRetries) {
          this.wsRetryCount++;
          setTimeout(() => this.startWS(), 2000 * this.wsRetryCount); // Exponential backoff
        }
      });
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.wsRetryCount++;
      if (this.wsRetryCount < this.maxWSRetries) {
        setTimeout(() => this.startWS(), 2000 * this.wsRetryCount);
      } else {
        this.wsEnabled = false;
      }
    }
  }

  stopWS() {
    if (this.wsClient) {
      this.wsClient.close();
      this.wsClient = undefined;
    }
  }

  // Legacy methods for compatibility
  connectWebSocket(onMessage: (data: any) => void): void {
    this.on('message', onMessage);
    this.startWS();
  }

  disconnectWebSocket(): void {
    this.stopWS();
  }

  async callRPC(method: string, params: any = {}): Promise<any> {
    return this.jsonRpc(method, params);
  }
}