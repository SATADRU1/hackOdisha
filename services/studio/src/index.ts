import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import { ingestLedger, startIngest } from './jobs/ingest-ledger';
import { computeKPIs, startKpiWorker } from './jobs/compute-kpis';
import { aiRoutes } from './api/ai';
import { chartsRoutes } from './api/charts';
import { blockdagRoutes } from './api/blockdag';
import { miningRoutes } from './api/mining';

// Helper function to safely log errors
const logError = (fastify: any, message: string, error: unknown) => {
  fastify.log.error(message);
  if (error instanceof Error) {
    fastify.log.error(error.message);
  } else {
    fastify.log.error(String(error));
  }
};

// Helper function to safely log info
const logInfo = (fastify: any, message: string, data?: unknown) => {
  fastify.log.info(message);
  if (data) {
    fastify.log.info(JSON.stringify(data, null, 2));
  }
};
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  }
});

// Initialize Prisma
export const prisma = new PrismaClient();

// Register plugins
fastify.register(cors, {
  origin: [
    'http://localhost:3000',
    'http://localhost:8080', 
    'http://frontend:3000',
    'http://nginx:80',
    'http://hackodisha-frontend:3000',
    'http://hackodisha-nginx:80',
    // Allow any origin in Docker environment for WebSocket connections
    process.env.NODE_ENV === 'production' ? /.*/ : true
  ],
  credentials: true
});

fastify.register(websocket);

// Register routes
fastify.register(aiRoutes, { prefix: '/api/v1/ai' });
fastify.register(chartsRoutes, { prefix: '/api/v1/charts' });
fastify.register(blockdagRoutes, { prefix: '/api/v1/blockdag' });
fastify.register(miningRoutes, { prefix: '/api/v1' });

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return {
    status: 'healthy',
    service: 'nft-maker-studio',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
});

// WebSocket endpoint for real-time updates
fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    fastify.log.info('WebSocket connection established');
    
    connection.socket.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        logInfo(fastify, 'Received WebSocket message:', data);
        
        // Handle different message types
        switch (data.type) {
          case 'subscribe':
            // Subscribe to specific data streams
            connection.socket.send(JSON.stringify({
              type: 'subscribed',
              channel: data.channel
            }));
            break;
          case 'ping':
            connection.socket.send(JSON.stringify({
              type: 'pong',
              timestamp: Date.now()
            }));
            break;
        }
      } catch (error) {
        logError(fastify, 'WebSocket message error:', error);
      }
    });

    connection.socket.on('close', () => {
      fastify.log.info('WebSocket connection closed');
    });
  });
});

// Start jobs (both simple and enhanced versions)
const rpcUrl = process.env.BLOCKDAG_RPC || 'http://localhost:8080';
const wsUrl = process.env.BLOCKDAG_WS || 'ws://localhost:8080/ws';
const disableWebSocket = process.env.DISABLE_WEBSOCKET === 'true';

// Start simple ingest and KPI workers (starter code)
if (!disableWebSocket) {
  startIngest(rpcUrl, wsUrl).catch((e) => logError(fastify, 'simple ingest start err', e));
} else {
  logInfo(fastify, 'WebSocket disabled, skipping real-time ingest');
}
startKpiWorker().catch((e) => logError(fastify, 'simple kpi start err', e));

// Scheduled jobs (enhanced implementation)
cron.schedule('*/30 * * * * *', async () => {
  try {
    await ingestLedger();
    fastify.log.info('Enhanced ledger ingestion completed');
  } catch (error) {
    logError(fastify, 'Enhanced ledger ingestion failed:', error);
  }
});

cron.schedule('0 */5 * * * *', async () => {
  try {
    await computeKPIs();
    fastify.log.info('Enhanced KPI computation completed');
  } catch (error) {
    logError(fastify, 'Enhanced KPI computation failed:', error);
  }
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  fastify.log.info(`Received ${signal}, shutting down gracefully...`);
  
  try {
    await fastify.close();
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    logError(fastify, 'Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    fastify.log.info(`Free NFT Maker | Design & Mint - Mediamodifier https://share.google/3Rij5fdeEPaN7b9rB server listening on ${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
