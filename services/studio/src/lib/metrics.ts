import { prisma } from '../index';
import { BlockDAGAdapter } from '../adapters/blockdag';

export interface NetworkMetrics {
  timestamp: Date;
  totalBlocks: number;
  totalTransactions: number;
  activePeers: number;
  mempoolSize: number;
  averageBlockTime: number;
  tps: number;
  orphanRate: number;
  networkHashrate: bigint;
  difficulty: bigint;
}

export interface BlockMetrics {
  blockId: string;
  confirmationTime?: number;
  propagationTime?: number;
  orphaned: boolean;
}

export async function collectNetworkMetrics(network: string = 'alpha'): Promise<NetworkMetrics> {
  const adapter = new BlockDAGAdapter(network);
  
  try {
    // Fetch data from BlockDAG node
    const [status, peers, mempool, vertices] = await Promise.all([
      adapter.getStatus(),
      adapter.getPeers(),
      adapter.getMempool(),
      adapter.getVertices(),
    ]);

    // Calculate metrics
    const totalBlocks = vertices.length;
    const totalTransactions = vertices.reduce((sum, vertex) => {
      // Simple estimation - in production, parse actual transaction data
      return sum + (vertex.data ? 1 : 0);
    }, 0);

    const activePeers = peers.length;
    const mempoolSize = mempool.count;

    // Calculate average block time (simplified)
    const blockTimes = vertices
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, 10) // Last 10 blocks
      .map((vertex, index, array) => {
        if (index === 0) return 0;
        return vertex.timestamp - array[index - 1].timestamp;
      })
      .filter(time => time > 0);

    const averageBlockTime = blockTimes.length > 0 
      ? blockTimes.reduce((sum, time) => sum + time, 0) / blockTimes.length
      : 60; // Default 60 seconds

    // Calculate TPS (simplified)
    const tps = totalTransactions > 0 && averageBlockTime > 0 
      ? totalTransactions / (averageBlockTime * totalBlocks)
      : 0;

    // Calculate orphan rate (simplified - would need more sophisticated logic)
    const orphanRate = 0.02; // Placeholder

    // Calculate network hashrate (simplified)
    const networkHashrate = BigInt(vertices.reduce((sum, vertex) => sum + vertex.weight, 0) * 1000000);

    // Calculate difficulty (simplified)
    const difficulty = BigInt(Math.max(1, Math.floor(Number(networkHashrate) / 1000000)));

    return {
      timestamp: new Date(),
      totalBlocks,
      totalTransactions,
      activePeers,
      mempoolSize,
      averageBlockTime,
      tps,
      orphanRate,
      networkHashrate,
      difficulty,
    };
  } catch (error) {
    console.error('Error collecting network metrics:', error);
    throw error;
  }
}

export async function collectBlockMetrics(blockId: string): Promise<BlockMetrics> {
  try {
    // In a real implementation, this would measure actual confirmation and propagation times
    // For now, we'll use placeholder values
    
    const confirmationTime = Math.random() * 10 + 5; // 5-15 seconds
    const propagationTime = Math.random() * 2 + 1; // 1-3 seconds
    const orphaned = Math.random() < 0.02; // 2% chance of being orphaned

    return {
      blockId,
      confirmationTime,
      propagationTime,
      orphaned,
    };
  } catch (error) {
    console.error('Error collecting block metrics:', error);
    throw error;
  }
}

export async function storeNetworkMetrics(metrics: NetworkMetrics): Promise<void> {
  try {
    await prisma.networkMetrics.create({
      data: {
        timestamp: metrics.timestamp,
        totalBlocks: metrics.totalBlocks,
        totalTransactions: metrics.totalTransactions,
        activePeers: metrics.activePeers,
        mempoolSize: metrics.mempoolSize,
        averageBlockTime: metrics.averageBlockTime,
        tps: metrics.tps,
        orphanRate: metrics.orphanRate,
        networkHashrate: metrics.networkHashrate,
        difficulty: metrics.difficulty,
      },
    });
  } catch (error) {
    console.error('Error storing network metrics:', error);
    throw error;
  }
}

export async function storeBlockMetrics(metrics: BlockMetrics): Promise<void> {
  try {
    await prisma.blockMetrics.create({
      data: {
        blockId: metrics.blockId,
        confirmationTime: metrics.confirmationTime,
        propagationTime: metrics.propagationTime,
        orphaned: metrics.orphaned,
      },
    });
  } catch (error) {
    console.error('Error storing block metrics:', error);
    throw error;
  }
}

export async function updateMiningStats(minerAddress: string, hashrate: bigint, blocksMined: number = 0): Promise<void> {
  try {
    await prisma.miningStats.upsert({
      where: { minerAddress },
      update: {
        hashrate,
        blocksMined: {
          increment: blocksMined,
        },
        lastMined: blocksMined > 0 ? new Date() : undefined,
        updatedAt: new Date(),
      },
      create: {
        minerAddress,
        hashrate,
        blocksMined,
        lastMined: blocksMined > 0 ? new Date() : undefined,
      },
    });
  } catch (error) {
    console.error('Error updating mining stats:', error);
    throw error;
  }
}

export async function getNetworkHealthScore(): Promise<number> {
  try {
    const latestMetrics = await prisma.networkMetrics.findFirst({
      orderBy: { timestamp: 'desc' },
    });

    if (!latestMetrics) {
      return 0;
    }

    let score = 100;

    // TPS scoring
    if (latestMetrics.tps < 10) score -= 20;
    else if (latestMetrics.tps < 50) score -= 10;

    // Orphan rate scoring
    if (latestMetrics.orphanRate > 0.1) score -= 20;
    else if (latestMetrics.orphanRate > 0.05) score -= 10;

    // Peer count scoring
    if (latestMetrics.activePeers < 10) score -= 15;
    else if (latestMetrics.activePeers < 20) score -= 5;

    // Block time scoring
    if (latestMetrics.averageBlockTime > 120) score -= 15;
    else if (latestMetrics.averageBlockTime > 60) score -= 5;

    return Math.max(0, score);
  } catch (error) {
    console.error('Error calculating network health score:', error);
    return 0;
  }
}

export async function getTopMiners(limit: number = 10): Promise<any[]> {
  try {
    const miners = await prisma.miningStats.findMany({
      orderBy: { blocksMined: 'desc' },
      take: limit,
    });

    return miners.map(miner => ({
      address: miner.minerAddress,
      blocksMined: miner.blocksMined,
      hashrate: Number(miner.hashrate),
      totalReward: Number(miner.totalReward),
      lastMined: miner.lastMined,
    }));
  } catch (error) {
    console.error('Error fetching top miners:', error);
    return [];
  }
}

export async function getNetworkTrends(timeframe: string = '24h'): Promise<any> {
  try {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - getTimeframeMs(timeframe));

    const metrics = await prisma.networkMetrics.findMany({
      where: {
        timestamp: {
          gte: startTime,
          lte: endTime,
        },
      },
      orderBy: { timestamp: 'asc' },
    });

    if (metrics.length < 2) {
      return null;
    }

    const first = metrics[0];
    const last = metrics[metrics.length - 1];

    return {
      tps: {
        current: last.tps,
        change: last.tps - first.tps,
        changePercent: ((last.tps - first.tps) / first.tps) * 100,
      },
      hashrate: {
        current: Number(last.networkHashrate),
        change: Number(last.networkHashrate) - Number(first.networkHashrate),
        changePercent: ((Number(last.networkHashrate) - Number(first.networkHashrate)) / Number(first.networkHashrate)) * 100,
      },
      peers: {
        current: last.activePeers,
        change: last.activePeers - first.activePeers,
        changePercent: ((last.activePeers - first.activePeers) / first.activePeers) * 100,
      },
      blockTime: {
        current: last.averageBlockTime,
        change: last.averageBlockTime - first.averageBlockTime,
        changePercent: ((last.averageBlockTime - first.averageBlockTime) / first.averageBlockTime) * 100,
      },
    };
  } catch (error) {
    console.error('Error calculating network trends:', error);
    return null;
  }
}

function getTimeframeMs(timeframe: string): number {
  switch (timeframe) {
    case '1h':
      return 60 * 60 * 1000;
    case '24h':
      return 24 * 60 * 60 * 1000;
    case '7d':
      return 7 * 24 * 60 * 60 * 1000;
    case '30d':
      return 30 * 24 * 60 * 60 * 1000;
    default:
      return 24 * 60 * 60 * 1000;
  }
}
