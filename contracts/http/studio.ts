import { z } from 'zod';

// AI Insights schemas
export const AIInsightSchema = z.object({
  id: z.string(),
  type: z.enum(['anomaly', 'prediction', 'recommendation']),
  title: z.string(),
  description: z.string(),
  confidence: z.number().min(0).max(1),
  data: z.record(z.any()),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateInsightRequestSchema = z.object({
  type: z.enum(['anomaly', 'prediction', 'recommendation']),
  timeframe: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

export const AnomalyDetectionRequestSchema = z.object({
  metric: z.string(),
  threshold: z.number().optional(),
  timeframe: z.string().optional(),
});

export const PredictionRequestSchema = z.object({
  metric: z.string(),
  horizon: z.string(), // e.g., '1h', '24h', '7d'
  model: z.string().optional(),
});

// Charts schemas
export const ChartDataSchema = z.object({
  id: z.string(),
  chartType: z.string(),
  timestamp: z.string().datetime(),
  value: z.number(),
  metadata: z.record(z.any()).optional(),
});

export const ChartQuerySchema = z.object({
  type: z.enum(['tps', 'latency', 'hashrate', 'miners', 'blocks', 'transactions']),
  timeframe: z.string().optional().default('24h'),
  interval: z.string().optional().default('1h'),
});

export const TimeframeSchema = z.object({
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  timeframe: z.string().optional(),
});

// Network metrics schemas
export const NetworkMetricsSchema = z.object({
  id: z.string(),
  timestamp: z.string().datetime(),
  totalBlocks: z.number(),
  totalTransactions: z.number(),
  activePeers: z.number(),
  mempoolSize: z.number(),
  averageBlockTime: z.number(),
  tps: z.number(),
  orphanRate: z.number(),
  networkHashrate: z.string(), // BigInt as string
  difficulty: z.string(), // BigInt as string
});

export const BlockMetricsSchema = z.object({
  id: z.string(),
  blockId: z.string(),
  confirmationTime: z.number().optional(),
  propagationTime: z.number().optional(),
  orphaned: z.boolean(),
  createdAt: z.string().datetime(),
});

// Mining stats schemas
export const MiningStatsSchema = z.object({
  id: z.string(),
  minerAddress: z.string(),
  blocksMined: z.number(),
  totalReward: z.string(), // BigInt as string
  hashrate: z.string(), // BigInt as string
  lastMined: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Block schemas
export const BlockSchema = z.object({
  id: z.string(),
  hash: z.string(),
  parentHashes: z.array(z.string()),
  timestamp: z.string().datetime(),
  nonce: z.string(), // BigInt as string
  weight: z.number(),
  data: z.string().optional(),
  size: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Transaction schemas
export const TransactionSchema = z.object({
  id: z.string(),
  hash: z.string(),
  blockId: z.string(),
  from: z.string().optional(),
  to: z.string().optional(),
  amount: z.string().optional(), // BigInt as string
  fee: z.string(), // BigInt as string
  data: z.string().optional(),
  timestamp: z.string().datetime(),
  size: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Peer schemas
export const PeerSchema = z.object({
  id: z.string(),
  address: z.string(),
  lastSeen: z.string().datetime(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// API Response schemas
export const APIResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  count: z.number().optional(),
  timestamp: z.string().datetime().optional(),
});

export const PaginatedResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

// WebSocket message schemas
export const WebSocketMessageSchema = z.object({
  type: z.string(),
  data: z.any().optional(),
  timestamp: z.string().datetime().optional(),
});

export const WebSocketSubscriptionSchema = z.object({
  type: z.literal('subscribe'),
  channel: z.string(),
});

export const WebSocketPingSchema = z.object({
  type: z.literal('ping'),
});

// Type exports
export type AIInsight = z.infer<typeof AIInsightSchema>;
export type CreateInsightRequest = z.infer<typeof CreateInsightRequestSchema>;
export type AnomalyDetectionRequest = z.infer<typeof AnomalyDetectionRequestSchema>;
export type PredictionRequest = z.infer<typeof PredictionRequestSchema>;
export type ChartData = z.infer<typeof ChartDataSchema>;
export type ChartQuery = z.infer<typeof ChartQuerySchema>;
export type Timeframe = z.infer<typeof TimeframeSchema>;
export type NetworkMetrics = z.infer<typeof NetworkMetricsSchema>;
export type BlockMetrics = z.infer<typeof BlockMetricsSchema>;
export type MiningStats = z.infer<typeof MiningStatsSchema>;
export type Block = z.infer<typeof BlockSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type Peer = z.infer<typeof PeerSchema>;
export type APIResponse = z.infer<typeof APIResponseSchema>;
export type PaginatedResponse = z.infer<typeof PaginatedResponseSchema>;
export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;
export type WebSocketSubscription = z.infer<typeof WebSocketSubscriptionSchema>;
export type WebSocketPing = z.infer<typeof WebSocketPingSchema>;
