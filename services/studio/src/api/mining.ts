import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function miningRoutes(fastify: FastifyInstance) {
  
  // Get all mining sessions for a user
  fastify.get('/mining/sessions', async (request, reply) => {
    try {
      // For now, return mock data with realistic structure
      // TODO: Replace with actual user authentication and database queries
      
      const mockSessions = [
        {
          id: 'session_001',
          startTime: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
          endTime: new Date(Date.now() - 300000).toISOString(),    // 5 min ago
          duration: 25,
          tokensEarned: 12.5,
          sessionValue: 8.75,
          focusType: 'pomodoro',
          status: 'completed'
        },
        {
          id: 'session_002',
          startTime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          endTime: new Date(Date.now() - 5400000).toISOString(),   // 1.5 hours ago
          duration: 25,
          tokensEarned: 11.8,
          sessionValue: 8.26,
          focusType: 'pomodoro',
          status: 'completed'
        },
        {
          id: 'session_003',
          startTime: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
          endTime: new Date(Date.now() - 15000000).toISOString(),   // 4.2 hours ago
          duration: 50,
          tokensEarned: 28.4,
          sessionValue: 19.88,
          focusType: 'deep_work',
          status: 'completed'
        }
      ];

      return {
        sessions: mockSessions,
        total: mockSessions.length,
        totalTokens: mockSessions.reduce((sum, s) => sum + s.tokensEarned, 0),
        totalValue: mockSessions.reduce((sum, s) => sum + s.sessionValue, 0)
      };
    } catch (error) {
      fastify.log.error('Error fetching mining sessions:', error);
      return reply.status(500).send({ error: 'Failed to fetch mining sessions' });
    }
  });

  // Get mining statistics
  fastify.get('/mining/stats', async (request, reply) => {
    try {
      // Mock comprehensive mining stats
      const totalMined = 247.5;
      const sessionCount = 47;
      const todaysMining = 23.7;
      const weeklyMining = 156.8;
      const monthlyMining = 624.3;
      
      return {
        totalMined,
        totalValue: totalMined * 0.7, // $0.70 per FOCUS token
        sessionsCompleted: sessionCount,
        todaysMining,
        weeklyMining,
        monthlyMining,
        currentRank: 3,
        averagePerSession: totalMined / sessionCount,
        focusTimeTotal: sessionCount * 25, // minutes
        focusStreaks: {
          current: 4,
          longest: 12
        },
        achievements: [
          { name: 'First Mine', unlocked: true },
          { name: '100 Tokens', unlocked: true },
          { name: 'Week Warrior', unlocked: true },
          { name: '500 Tokens', unlocked: false }
        ]
      };
    } catch (error) {
      fastify.log.error('Error fetching mining stats:', error);
      return reply.status(500).send({ error: 'Failed to fetch mining stats' });
    }
  });

  // Start a new mining session
  fastify.post('/mining/start', async (request, reply) => {
    try {
      const { focusType = 'pomodoro' } = request.body as { focusType?: string };
      
      const newSession = {
        id: `session_${Date.now()}`,
        startTime: new Date().toISOString(),
        endTime: null,
        duration: 0,
        tokensEarned: 0,
        sessionValue: 0,
        focusType,
        status: 'active' as const
      };

      // TODO: Save to database
      fastify.log.info('Mining session started:', newSession);

      return newSession;
    } catch (error) {
      fastify.log.error('Error starting mining session:', error);
      return reply.status(500).send({ error: 'Failed to start mining session' });
    }
  });

  // End a mining session and calculate rewards
  fastify.post('/mining/end', async (request, reply) => {
    try {
      const { sessionId, actualDuration } = request.body as { sessionId: string; actualDuration: number };
      
      // Calculate tokens based on duration (0.5 tokens per minute)
      const tokensEarned = Math.round((actualDuration * 0.5) * 100) / 100;
      const tokenValue = 0.70; // $0.70 per FOCUS token
      const sessionValue = tokensEarned * tokenValue;

      const completedSession = {
        id: sessionId,
        endTime: new Date().toISOString(),
        duration: actualDuration,
        tokensEarned,
        sessionValue,
        status: 'completed' as const
      };

      // TODO: Save to database and update user balance

      fastify.log.info('Mining session completed:', completedSession);

      // Broadcast to WebSocket connections
      fastify.websocketServer.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(JSON.stringify({
            type: 'mining_complete',
            sessionId,
            tokensEarned,
            sessionValue,
            timestamp: new Date().toISOString()
          }));
        }
      });

      return {
        session: completedSession,
        tokensEarned,
        sessionValue,
        newTotalBalance: 247.5 + tokensEarned // Mock running total
      };
    } catch (error) {
      fastify.log.error('Error ending mining session:', error);
      return reply.status(500).send({ error: 'Failed to end mining session' });
    }
  });

  // Get mining leaderboard
  fastify.get('/mining/leaderboard', async (request, reply) => {
    try {
      const leaderboard = [
        { rank: 1, username: 'Alice', totalMined: 2450.5, level: 'Diamond' },
        { rank: 2, username: 'Bob', totalMined: 1890.75, level: 'Gold' },
        { rank: 3, username: 'You', totalMined: 1247.5, level: 'Silver' },
        { rank: 4, username: 'Charlie', totalMined: 1156.0, level: 'Silver' },
        { rank: 5, username: 'Diana', totalMined: 998.25, level: 'Bronze' },
      ];

      return {
        leaderboard,
        userRank: 3,
        totalUsers: 1247
      };
    } catch (error) {
      fastify.log.error('Error fetching leaderboard:', error);
      return reply.status(500).send({ error: 'Failed to fetch leaderboard' });
    }
  });

  // Get real-time mining updates during active session
  fastify.get('/mining/session/:sessionId/live', async (request, reply) => {
    try {
      const { sessionId } = request.params as { sessionId: string };
      
      // Mock live session data
      const liveData = {
        sessionId,
        isActive: true,
        currentDuration: Math.floor((Date.now() % 1500000) / 1000 / 60), // Mock 0-25 minutes
        tokensEarned: Math.round((Math.floor((Date.now() % 1500000) / 1000 / 60) * 0.5) * 100) / 100,
        miningRate: 0.5, // tokens per minute
        lastUpdate: new Date().toISOString()
      };

      liveData.sessionValue = liveData.tokensEarned * 0.70;

      return liveData;
    } catch (error) {
      fastify.log.error('Error fetching live session data:', error);
      return reply.status(500).send({ error: 'Failed to fetch live session data' });
    }
  });

  // Health check endpoint
  fastify.get('/mining/health', async (request, reply) => {
    return {
      status: 'healthy',
      service: 'mining-api',
      timestamp: new Date().toISOString(),
      endpoints: [
        '/mining/sessions',
        '/mining/stats', 
        '/mining/start',
        '/mining/end',
        '/mining/leaderboard'
      ]
    };
  });
}
