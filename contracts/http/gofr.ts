import { z } from 'zod';

// User schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  walletAddress: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateUserRequestSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  walletAddress: z.string().optional(),
});

export const UpdateUserRequestSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  walletAddress: z.string().optional(),
});

// Auth schemas
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(8),
});

export const AuthResponseSchema = z.object({
  success: z.boolean(),
  token: z.string().optional(),
  user: UserSchema.optional(),
  error: z.string().optional(),
});

// Session schemas
export const SessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  duration: z.number().optional(), // in seconds
  status: z.enum(['active', 'completed', 'cancelled']),
  reward: z.number().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateSessionRequestSchema = z.object({
  userId: z.string(),
  duration: z.number().optional(), // in seconds
});

export const UpdateSessionRequestSchema = z.object({
  status: z.enum(['active', 'completed', 'cancelled']).optional(),
  endTime: z.string().datetime().optional(),
  reward: z.number().optional(),
});

// Focus schemas
export const FocusConfigSchema = z.object({
  userId: z.string(),
  workDuration: z.number(), // in minutes
  breakDuration: z.number(), // in minutes
  longBreakDuration: z.number(), // in minutes
  sessionsPerCycle: z.number(),
  notifications: z.boolean(),
  soundEnabled: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UpdateFocusConfigRequestSchema = z.object({
  workDuration: z.number().optional(),
  breakDuration: z.number().optional(),
  longBreakDuration: z.number().optional(),
  sessionsPerCycle: z.number().optional(),
  notifications: z.boolean().optional(),
  soundEnabled: z.boolean().optional(),
});

export const FocusStatusSchema = z.object({
  userId: z.string(),
  isActive: z.boolean(),
  currentSession: SessionSchema.optional(),
  totalSessions: z.number(),
  totalTime: z.number(), // in seconds
  totalReward: z.number(),
  streak: z.number(),
  lastSession: z.string().datetime().optional(),
});

// Portfolio schemas
export const PortfolioSchema = z.object({
  id: z.string(),
  userId: z.string(),
  totalValue: z.number(),
  totalInvested: z.number(),
  totalReturn: z.number(),
  returnPercentage: z.number(),
  holdings: z.array(z.object({
    symbol: z.string(),
    amount: z.number(),
    value: z.number(),
    percentage: z.number(),
  })),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const TransactionHistorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['buy', 'sell', 'reward', 'deposit', 'withdrawal']),
  symbol: z.string().optional(),
  amount: z.number(),
  price: z.number().optional(),
  value: z.number(),
  fee: z.number().optional(),
  status: z.enum(['pending', 'completed', 'failed']),
  timestamp: z.string().datetime(),
  createdAt: z.string().datetime(),
});

// Mining schemas
export const MiningConfigSchema = z.object({
  userId: z.string(),
  isEnabled: z.boolean(),
  hashrate: z.number(),
  powerConsumption: z.number(),
  efficiency: z.number(),
  poolUrl: z.string().optional(),
  workerName: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const MiningStatsSchema = z.object({
  userId: z.string(),
  totalMined: z.number(),
  totalReward: z.number(),
  averageHashrate: z.number(),
  uptime: z.number(), // in seconds
  lastMined: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Dashboard schemas
export const DashboardDataSchema = z.object({
  user: UserSchema,
  focusStatus: FocusStatusSchema,
  portfolio: PortfolioSchema.optional(),
  miningStats: MiningStatsSchema.optional(),
  recentSessions: z.array(SessionSchema),
  recentTransactions: z.array(TransactionHistorySchema),
  totalEarnings: z.number(),
  totalTime: z.number(),
  achievements: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    unlockedAt: z.string().datetime(),
  })),
});

// API Response schemas
export const APIResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
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

// Type exports
export type User = z.infer<typeof UserSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type CreateSessionRequest = z.infer<typeof CreateSessionRequestSchema>;
export type UpdateSessionRequest = z.infer<typeof UpdateSessionRequestSchema>;
export type FocusConfig = z.infer<typeof FocusConfigSchema>;
export type UpdateFocusConfigRequest = z.infer<typeof UpdateFocusConfigRequestSchema>;
export type FocusStatus = z.infer<typeof FocusStatusSchema>;
export type Portfolio = z.infer<typeof PortfolioSchema>;
export type TransactionHistory = z.infer<typeof TransactionHistorySchema>;
export type MiningConfig = z.infer<typeof MiningConfigSchema>;
export type MiningStats = z.infer<typeof MiningStatsSchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;
export type APIResponse = z.infer<typeof APIResponseSchema>;
export type PaginatedResponse = z.infer<typeof PaginatedResponseSchema>;
