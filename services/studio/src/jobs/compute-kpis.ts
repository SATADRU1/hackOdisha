import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple KPI worker (starter code)
export async function startKpiWorker() {
  // Compute simple KPIs every 60s (example)
  setInterval(async () => {
    try {
      const windowTo = new Date();
      const windowFrom = new Date(windowTo.getTime() - 60_000); // last minute

      const txCount = await prisma.transaction.count({ where: { createdAt: { gte: windowFrom, lt: windowTo } } });
      const tps = txCount / 60.0;

      await prisma.kpi.create({ data: { name: 'tps', value: tps, windowFrom, windowTo } });

      // Orphan rate and other KPIs require extra data; placeholder
      const orphanRate = 0.0;
      await prisma.kpi.create({ data: { name: 'orphan_rate', value: orphanRate, windowFrom, windowTo } });
    } catch (e) {
      console.error('kpi error', e);
    }
  }, 60_000);
}

// Enhanced KPI computation (existing implementation)
export async function computeKPIs() {
  try {
    console.log('Starting KPI computation...');

    // Compute network health score
    const healthScore = await getNetworkHealthScore();
    console.log(`Network health score: ${healthScore}`);

    // Update top miners
    const topMiners = await getTopMiners(20);
    console.log(`Updated top ${topMiners.length} miners`);

    // Compute network trends
    const trends24h = await getNetworkTrends('24h');
    const trends7d = await getNetworkTrends('7d');
    
    if (trends24h) {
      console.log('24h trends computed:', {
        tps: trends24h.tps.changePercent.toFixed(2) + '%',
        hashrate: trends7d?.hashrate.changePercent.toFixed(2) + '%',
        peers: trends24h.peers.changePercent.toFixed(2) + '%',
      });
    }

    // Compute additional KPIs
    await computeAdditionalKPIs();

    console.log('KPI computation completed');
  } catch (error) {
    console.error('Error computing KPIs:', error);
    throw error;
  }
}

async function computeAdditionalKPIs() {
  try {
    // Get recent metrics
    const recentMetrics = await prisma.networkMetrics.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    if (recentMetrics.length === 0) {
      return;
    }

    // Compute rolling averages
    const avgTPS = recentMetrics.reduce((sum, m) => sum + m.tps, 0) / recentMetrics.length;
    const avgBlockTime = recentMetrics.reduce((sum, m) => sum + m.averageBlockTime, 0) / recentMetrics.length;
    const avgOrphanRate = recentMetrics.reduce((sum, m) => sum + m.orphanRate, 0) / recentMetrics.length;
    const avgPeers = recentMetrics.reduce((sum, m) => sum + m.activePeers, 0) / recentMetrics.length;

    // Store computed KPIs as chart data
    await Promise.all([
      storeChartData('tps_avg', avgTPS),
      storeChartData('block_time_avg', avgBlockTime),
      storeChartData('orphan_rate_avg', avgOrphanRate),
      storeChartData('peers_avg', avgPeers),
    ]);

    // Compute network efficiency
    const efficiency = calculateNetworkEfficiency(recentMetrics);
    await storeChartData('network_efficiency', efficiency);

    // Compute mining distribution
    const miningDistribution = await computeMiningDistribution();
    console.log('Mining distribution computed:', miningDistribution);

  } catch (error) {
    console.error('Error computing additional KPIs:', error);
  }
}

async function storeChartData(chartType: string, value: number) {
  try {
    await prisma.chartData.create({
      data: {
        chartType,
        timestamp: new Date(),
        value,
        metadata: {
          computed: true,
          source: 'kpi_computation',
        },
      },
    });
  } catch (error) {
    console.error(`Error storing chart data for ${chartType}:`, error);
  }
}

function calculateNetworkEfficiency(metrics: any[]): number {
  if (metrics.length === 0) return 0;

  const latest = metrics[0];
  
  // Simple efficiency calculation based on TPS, block time, and orphan rate
  const tpsScore = Math.min(100, (latest.tps / 100) * 100);
  const blockTimeScore = Math.max(0, 100 - (latest.averageBlockTime / 60) * 100);
  const orphanRateScore = Math.max(0, 100 - latest.orphanRate * 1000);
  const peerScore = Math.min(100, (latest.activePeers / 50) * 100);

  // Weighted average
  const efficiency = (tpsScore * 0.3 + blockTimeScore * 0.3 + orphanRateScore * 0.2 + peerScore * 0.2);
  
  return Math.max(0, Math.min(100, efficiency));
}

async function computeMiningDistribution() {
  try {
    const miners = await prisma.miningStats.findMany({
      where: { hashrate: { gt: 0 } },
      orderBy: { hashrate: 'desc' },
    });

    if (miners.length === 0) {
      return { totalMiners: 0, distribution: [] };
    }

    const totalHashrate = miners.reduce((sum, miner) => sum + Number(miner.hashrate), 0);
    
    const distribution = miners.slice(0, 10).map(miner => ({
      address: miner.minerAddress,
      hashrate: Number(miner.hashrate),
      percentage: (Number(miner.hashrate) / totalHashrate) * 100,
      blocksMined: miner.blocksMined,
    }));

    return {
      totalMiners: miners.length,
      totalHashrate,
      distribution,
    };
  } catch (error) {
    console.error('Error computing mining distribution:', error);
    return { totalMiners: 0, distribution: [] };
  }
}

async function getNetworkHealthScore(): Promise<number> {
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

async function getTopMiners(limit: number = 10): Promise<any[]> {
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

async function getNetworkTrends(timeframe: string = '24h'): Promise<any> {
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