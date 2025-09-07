'use client';
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface MiningSession {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  tokensEarned: number;
  sessionValue: number; // in USD
  focusType: string;
  status: 'completed' | 'active' | 'paused';
}

export interface MiningHolding {
  coin: string;
  symbol: string;
  quantity: number;
  value: number;
  pnl: number;
  pnl_perc: number;
  source: 'mined' | 'purchased' | 'reward';
}

export interface MiningTransaction {
  type: 'Mined' | 'Deposit' | 'Withdrawal' | 'Reward';
  date: string;
  coin: string;
  amount: string;
  value: number;
  sessionId?: string;
}

export interface MiningStats {
  totalMined: number;
  totalValue: number;
  sessionsCompleted: number;
  todaysMining: number;
  weeklyMining: number;
  monthlyMining: number;
  currentRank: number;
  averagePerSession: number;
}

const STUDIO_BASE_URL = '/api/mining'; // Use Next.js API routes instead of direct studio calls

export function useMining() {
  const [sessions, setSessions] = useState<MiningSession[]>([]);
  const [transactions, setTransactions] = useState<MiningTransaction[]>([]);
  const [holdings, setHoldings] = useState<MiningHolding[]>([]);
  const [stats, setStats] = useState<MiningStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch mining sessions
  const fetchMiningSessions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${STUDIO_BASE_URL}/sessions`);
      if (!response.ok) throw new Error('Failed to fetch mining sessions');
      
      const data = await response.json();
      setSessions(data.sessions || []);
      
      // Convert sessions to transactions
      const miningTransactions: MiningTransaction[] = data.sessions?.map((session: MiningSession) => ({
        type: 'Mined' as const,
        date: session.endTime || session.startTime,
        coin: 'FOCUS',
        amount: `+${session.tokensEarned}`,
        value: session.sessionValue,
        sessionId: session.id
      })) || [];
      
      setTransactions(miningTransactions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch mining data';
      setError(errorMessage);
      console.error('Mining sessions fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch mining stats
  const fetchMiningStats = async () => {
    try {
      const response = await fetch(`${STUDIO_BASE_URL}/stats`);
      if (!response.ok) throw new Error('Failed to fetch mining stats');
      
      const data = await response.json();
      setStats(data);
      
      // Update holdings with FOCUS token
      const focusHolding: MiningHolding = {
        coin: 'FOCUS Token',
        symbol: 'FOCUS',
        quantity: data.totalMined || 0,
        value: data.totalValue || 0,
        pnl: data.todaysMining * 0.7 || 0, // Assuming $0.70 per FOCUS token
        pnl_perc: data.todaysMining > 0 ? 5.2 : 0,
        source: 'mined'
      };
      
      setHoldings(prev => {
        const filtered = prev.filter(h => h.symbol !== 'FOCUS');
        return [focusHolding, ...filtered];
      });
      
    } catch (err) {
      console.error('Mining stats fetch error:', err);
    }
  };

  // Start a new mining session
  const startMiningSession = async (focusType: string = 'pomodoro') => {
    try {
      const response = await fetch(`${STUDIO_BASE_URL}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focusType })
      });
      
      if (!response.ok) throw new Error('Failed to start mining session');
      
      const session = await response.json();
      setSessions(prev => [session, ...prev]);
      
      toast({
        title: "Mining Started! ⛏️",
        description: "Focus session active. Tokens will be earned based on your focus time.",
      });
      
      return session;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start mining';
      setError(errorMessage);
      toast({
        title: "Mining Start Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  // End a mining session
  const endMiningSession = async (sessionId: string, actualDuration: number) => {
    try {
      const response = await fetch(`${STUDIO_BASE_URL}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, actualDuration })
      });
      
      if (!response.ok) throw new Error('Failed to end mining session');
      
      const result = await response.json();
      
      // Update sessions
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, ...result.session, status: 'completed' as const }
            : session
        )
      );
      
      // Add new transaction
      const newTransaction: MiningTransaction = {
        type: 'Mined',
        date: new Date().toISOString(),
        coin: 'FOCUS',
        amount: `+${result.tokensEarned}`,
        value: result.sessionValue,
        sessionId
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Refresh stats
      await fetchMiningStats();
      
      toast({
        title: "Mining Completed! 💎",
        description: `Earned ${result.tokensEarned} FOCUS tokens ($${result.sessionValue.toFixed(2)})`,
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to end mining';
      setError(errorMessage);
      toast({
        title: "Mining End Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  // WebSocket connection disabled - using polling for updates
  useEffect(() => {
    // WebSocket disabled for now since studio service doesn't support it
    console.log('WebSocket disabled - using REST API for mining updates');
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchMiningSessions();
    fetchMiningStats();
  }, []);

  return {
    // Data
    sessions,
    transactions,
    holdings,
    stats,
    
    // State
    isLoading,
    error,
    
    // Actions
    startMiningSession,
    endMiningSession,
    fetchMiningSessions,
    fetchMiningStats,
    
    // Utils
    refreshData: () => {
      fetchMiningSessions();
      fetchMiningStats();
    }
  };
}
