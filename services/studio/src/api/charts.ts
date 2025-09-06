import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple charts API (starter code)
const simpleRoutes: FastifyPluginAsync = async (server) => {
  server.get('/kpis', async (req, reply) => {
    const rows = await prisma.kpi.findMany({ orderBy: { windowFrom: 'asc' } });
    return rows;
  });

  server.get('/tps', async (req, reply) => {
    const rows = await prisma.kpi.findMany({ where: { name: 'tps' }, orderBy: { windowFrom: 'asc' } });
    return rows;
  });

  server.get('/blocks/latest', async (req, reply) => {
    const b = await prisma.block.findFirst({ orderBy: { height: 'desc' }, take: 10 });
    return b;
  });
};

// Enhanced charts API (existing implementation)
export async function chartsRoutes(fastify: any) {
  // Register simple routes
  await fastify.register(simpleRoutes, { prefix: '/simple' });

  // Enhanced chart data endpoints
  fastify.get('/data', async (request: any, reply: any) => {
    try {
      const { type, timeframe = '24h', interval = '1h' } = request.query;
      
      const data = await getChartData(type, timeframe, interval);

      return {
        success: true,
        data,
        type,
        timeframe,
        interval,
      };
    } catch (error) {
      fastify.log.error('Error fetching chart data:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch chart data',
      });
    }
  });

  // Get TPS (Transactions Per Second) data
  fastify.get('/tps', async (request: any, reply: any) => {
    try {
      const { start, end, timeframe } = request.query;
      const data = await getTPSData({ start, end, timeframe });

      return {
        success: true,
        data,
        metric: 'tps',
      };
    } catch (error) {
      fastify.log.error('Error fetching TPS data:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch TPS data',
      });
    }
  });

  // Get latency data
  fastify.get('/latency', async (request: any, reply: any) => {
    try {
      const { start, end, timeframe } = request.query;
      const data = await getLatencyData({ start, end, timeframe });

      return {
        success: true,
        data,
        metric: 'latency',
      };
    } catch (error) {
      fastify.log.error('Error fetching latency data:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch latency data',
      });
    }
  });

  // Get hashrate data
  fastify.get('/hashrate', async (request: any, reply: any) => {
    try {
      const { start, end, timeframe } = request.query;
      const data = await getHashrateData({ start, end, timeframe });

      return {
        success: true,
        data,
        metric: 'hashrate',
      };
    } catch (error) {
      fastify.log.error('Error fetching hashrate data:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch hashrate data',
      });
    }
  });

  // Get miner statistics
  fastify.get('/miners', async (request: any, reply: any) => {
    try {
      const data = await getMinerStats();

      return {
        success: true,
        data,
        metric: 'miners',
      };
    } catch (error) {
      fastify.log.error('Error fetching miner stats:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch miner stats',
      });
    }
  });

  // Get network overview
  fastify.get('/overview', async (request: any, reply: any) => {
    try {
      const overview = await getNetworkOverview();

      return {
        success: true,
        data: overview,
      };
    } catch (error) {
      fastify.log.error('Error fetching network overview:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch network overview',
      });
    }
  });
}

// Helper functions
async function getChartData(type: string, timeframe: string, interval: string) {
  const endTime = new Date();
  const startTime = getStartTime(timeframe, endTime);

  switch (type) {
    case 'tps':
      return await getTPSData({ start: startTime.toISOString(), end: endTime.toISOString() });
    case 'latency':
      return await getLatencyData({ start: startTime.toISOString(), end: endTime.toISOString() });
    case 'hashrate':
      return await getHashrateData({ start: startTime.toISOString(), end: endTime.toISOString() });
    case 'miners':
      return await getMinerStats();
    default:
      throw new Error(`Unknown chart type: ${type}`);
  }
}

async function getTPSData(query: any) {
  const whereClause = buildTimeWhereClause(query);
  
  const metrics = await prisma.networkMetrics.findMany({
    where: whereClause,
    orderBy: { timestamp: 'asc' },
    select: {
      timestamp: true,
      tps: true,
    },
  });

  return metrics.map(metric => ({
    timestamp: metric.timestamp.toISOString(),
    value: metric.tps,
  }));
}

async function getLatencyData(query: any) {
  const whereClause = buildTimeWhereClause(query);
  
  const metrics = await prisma.networkMetrics.findMany({
    where: whereClause,
    orderBy: { timestamp: 'asc' },
    select: {
      timestamp: true,
      averageBlockTime: true,
    },
  });

  return metrics.map(metric => ({
    timestamp: metric.timestamp.toISOString(),
    value: metric.averageBlockTime,
  }));
}

async function getHashrateData(query: any) {
  const whereClause = buildTimeWhereClause(query);
  
  const metrics = await prisma.networkMetrics.findMany({
    where: whereClause,
    orderBy: { timestamp: 'asc' },
    select: {
      timestamp: true,
      networkHashrate: true,
    },
  });

  return metrics.map(metric => ({
    timestamp: metric.timestamp.toISOString(),
    value: Number(metric.networkHashrate),
  }));
}

async function getMinerStats() {
  const miners = await prisma.miningStats.findMany({
    orderBy: { blocksMined: 'desc' },
    take: 50,
  });

  return miners.map(miner => ({
    address: miner.minerAddress,
    blocksMined: miner.blocksMined,
    totalReward: Number(miner.totalReward),
    hashrate: Number(miner.hashrate),
    lastMined: miner.lastMined?.toISOString(),
  }));
}

async function getNetworkOverview() {
  const latestMetrics = await prisma.networkMetrics.findFirst({
    orderBy: { timestamp: 'desc' },
  });

  const totalBlocks = await prisma.block.count();
  const totalTransactions = await prisma.transaction.count();
  const activePeers = await prisma.peer.count({
    where: { isActive: true },
  });
  const activeMiners = await prisma.miningStats.count({
    where: { hashrate: { gt: 0 } },
  });

  return {
    totalBlocks,
    totalTransactions,
    activePeers,
    activeMiners,
    latestMetrics: latestMetrics ? {
      tps: latestMetrics.tps,
      averageBlockTime: latestMetrics.averageBlockTime,
      networkHashrate: Number(latestMetrics.networkHashrate),
      orphanRate: latestMetrics.orphanRate,
      mempoolSize: latestMetrics.mempoolSize,
    } : null,
  };
}

function buildTimeWhereClause(query: any) {
  const whereClause: any = {};

  if (query.start && query.end) {
    whereClause.timestamp = {
      gte: new Date(query.start),
      lte: new Date(query.end),
    };
  } else if (query.timeframe) {
    const endTime = new Date();
    const startTime = getStartTime(query.timeframe, endTime);
    whereClause.timestamp = {
      gte: startTime,
      lte: endTime,
    };
  }

  return whereClause;
}

function getStartTime(timeframe: string, endTime: Date): Date {
  const startTime = new Date(endTime);
  
  switch (timeframe) {
    case '1h':
      startTime.setHours(startTime.getHours() - 1);
      break;
    case '24h':
      startTime.setDate(startTime.getDate() - 1);
      break;
    case '7d':
      startTime.setDate(startTime.getDate() - 7);
      break;
    case '30d':
      startTime.setDate(startTime.getDate() - 30);
      break;
    default:
      startTime.setDate(startTime.getDate() - 1); // Default to 24h
  }
  
  return startTime;
}