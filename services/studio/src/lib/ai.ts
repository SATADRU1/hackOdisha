import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY || '';
const client = new OpenAI({ apiKey });

// Simple AI analysis (starter code)
export async function analyzeAnomaly(sample: any) {
  if (!apiKey) return 'OpenAI key not configured; cannot analyze.';
  try {
    const prompt = `You are an on-chain analytics assistant. Analyze this sample and return a short insight:\n${JSON.stringify(sample)}`;
    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300
    } as any);

    return resp.choices?.[0]?.message?.content ?? 'no insight';
  } catch (e) {
    return `llm error: ${String(e)}`;
  }
}

// Enhanced AI implementation (existing code)
export interface AIInsight {
  type: 'anomaly' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  data: any;
}

export interface AnomalyData {
  description: string;
  confidence: number;
  data: any;
}

export interface PredictionData {
  description: string;
  confidence: number;
  data: any;
}

export async function generateInsights(
  type: 'anomaly' | 'prediction' | 'recommendation',
  options: { timeframe?: string; confidence?: number } = {}
): Promise<AIInsight[]> {
  const insights: AIInsight[] = [];

  try {
    switch (type) {
      case 'anomaly':
        insights.push(...await detectAnomalies('tps', options));
        insights.push(...await detectAnomalies('hashrate', options));
        insights.push(...await detectAnomalies('orphan_rate', options));
        break;
      case 'prediction':
        insights.push(...await predictTrends('tps', { horizon: '24h' }));
        insights.push(...await predictTrends('hashrate', { horizon: '7d' }));
        break;
      case 'recommendation':
        insights.push(...await generateRecommendations());
        break;
    }
  } catch (error) {
    console.error('Error generating insights:', error);
  }

  return insights;
}

export async function detectAnomalies(
  metric: string,
  options: { threshold?: number; timeframe?: string } = {}
): Promise<AIInsight[]> {
  const insights: AIInsight[] = [];

  try {
    // Get recent data for the metric
    const recentMetrics = await getRecentMetrics(100);

    if (recentMetrics.length < 10) {
      return insights; // Not enough data
    }

    // Calculate baseline and detect anomalies
    const values = recentMetrics.map(m => getMetricValue(m, metric));
    const baseline = calculateBaseline(values);
    const threshold = options.threshold || 2.0; // 2 standard deviations

    const anomalies = values
      .map((value, index) => ({ value, index, timestamp: recentMetrics[index].timestamp }))
      .filter(({ value }) => Math.abs(value - baseline.mean) > threshold * baseline.stdDev);

    for (const anomaly of anomalies) {
      const confidence = Math.min(0.95, Math.abs(anomaly.value - baseline.mean) / (threshold * baseline.stdDev));
      
      insights.push({
        type: 'anomaly',
        title: `Anomaly detected in ${metric}`,
        description: `${metric} value of ${anomaly.value.toFixed(2)} is ${anomaly.value > baseline.mean ? 'above' : 'below'} normal range (${baseline.mean.toFixed(2)} ± ${baseline.stdDev.toFixed(2)})`,
        confidence,
        data: {
          metric,
          value: anomaly.value,
          baseline: baseline.mean,
          threshold: baseline.stdDev * threshold,
          timestamp: anomaly.timestamp.toISOString(),
        },
      });
    }
  } catch (error) {
    console.error('Error detecting anomalies:', error);
  }

  return insights;
}

export async function predictTrends(
  metric: string,
  options: { horizon?: string; model?: string } = {}
): Promise<AIInsight[]> {
  const insights: AIInsight[] = [];

  try {
    // Get historical data
    const historicalData = await getRecentMetrics(1000);

    if (historicalData.length < 50) {
      return insights; // Not enough data for prediction
    }

    // Simple trend analysis (in production, use more sophisticated ML models)
    const values = historicalData.map(m => getMetricValue(m, metric));
    const trend = calculateTrend(values);
    const prediction = predictValue(values, trend, options.horizon);

    const confidence = Math.min(0.9, Math.max(0.3, 1 - Math.abs(trend.slope) / 10));

    insights.push({
      type: 'prediction',
      title: `Prediction for ${metric}`,
      description: `${metric} is predicted to ${trend.slope > 0 ? 'increase' : 'decrease'} to ${prediction.toFixed(2)} in the next ${options.horizon || '24h'}`,
      confidence,
      data: {
        metric,
        currentValue: values[values.length - 1],
        predictedValue: prediction,
        trend: trend.slope,
        horizon: options.horizon || '24h',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error predicting trends:', error);
  }

  return insights;
}

async function generateRecommendations(): Promise<AIInsight[]> {
  const insights: AIInsight[] = [];

  try {
    // Get current network state
    const latestMetrics = await getLatestMetrics();
    const miningStats = await getMiningStats();

    if (!latestMetrics) {
      return insights;
    }

    // Generate recommendations based on current state
    if (latestMetrics.tps < 10) {
      insights.push({
        type: 'recommendation',
        title: 'Low Transaction Throughput',
        description: 'Network TPS is below optimal levels. Consider increasing block size or reducing block time.',
        confidence: 0.8,
        data: {
          currentTPS: latestMetrics.tps,
          recommendedTPS: 50,
          impact: 'high',
        },
      });
    }

    if (latestMetrics.orphanRate > 0.05) {
      insights.push({
        type: 'recommendation',
        title: 'High Orphan Rate',
        description: 'Network orphan rate is high. Consider improving network connectivity or adjusting mining parameters.',
        confidence: 0.7,
        data: {
          currentOrphanRate: latestMetrics.orphanRate,
          recommendedOrphanRate: 0.02,
          impact: 'medium',
        },
      });
    }

    if (latestMetrics.activePeers < 20) {
      insights.push({
        type: 'recommendation',
        title: 'Low Peer Count',
        description: 'Network has fewer peers than recommended. Consider improving peer discovery mechanisms.',
        confidence: 0.6,
        data: {
          currentPeers: latestMetrics.activePeers,
          recommendedPeers: 50,
          impact: 'medium',
        },
      });
    }

    // Mining recommendations
    const avgHashrate = miningStats.reduce((sum, stat) => sum + Number(stat.hashrate), 0) / miningStats.length;
    if (avgHashrate < 1000000) {
      insights.push({
        type: 'recommendation',
        title: 'Low Network Hashrate',
        description: 'Network hashrate is low. Consider incentivizing more miners or optimizing mining algorithms.',
        confidence: 0.8,
        data: {
          currentHashrate: avgHashrate,
          recommendedHashrate: 5000000,
          impact: 'high',
        },
      });
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
  }

  return insights;
}

// Helper functions
async function getRecentMetrics(limit: number = 100): Promise<any[]> {
  // This would connect to your database
  // For now, return mock data
  return [];
}

async function getLatestMetrics(): Promise<any> {
  // This would connect to your database
  // For now, return mock data
  return null;
}

async function getMiningStats(): Promise<any[]> {
  // This would connect to your database
  // For now, return mock data
  return [];
}

function getMetricValue(metrics: any, metric: string): number {
  switch (metric) {
    case 'tps':
      return metrics.tps || 0;
    case 'hashrate':
      return Number(metrics.networkHashrate) || 0;
    case 'orphan_rate':
      return metrics.orphanRate || 0;
    case 'block_time':
      return metrics.averageBlockTime || 0;
    case 'peer_count':
      return metrics.activePeers || 0;
    default:
      return 0;
  }
}

function calculateBaseline(values: number[]): { mean: number; stdDev: number } {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  return { mean, stdDev };
}

function calculateTrend(values: number[]): { slope: number; rSquared: number } {
  const n = values.length;
  const x = Array.from({ length: n }, (_, i) => i);
  
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = values.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * values[i], 0);
  const sumXX = x.reduce((sum, val) => sum + val * val, 0);
  const sumYY = values.reduce((sum, val) => sum + val * val, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Calculate R-squared
  const yMean = sumY / n;
  const ssRes = values.reduce((sum, val, i) => sum + Math.pow(val - (slope * i + intercept), 2), 0);
  const ssTot = values.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
  const rSquared = 1 - (ssRes / ssTot);
  
  return { slope, rSquared };
}

function predictValue(values: number[], trend: { slope: number; rSquared: number }, horizon?: string): number {
  const currentValue = values[values.length - 1];
  const currentIndex = values.length - 1;
  
  // Simple linear prediction
  let futureIndex = currentIndex + 24; // Default to 24 hours ahead
  
  if (horizon) {
    switch (horizon) {
      case '1h':
        futureIndex = currentIndex + 1;
        break;
      case '24h':
        futureIndex = currentIndex + 24;
        break;
      case '7d':
        futureIndex = currentIndex + 168; // 7 * 24
        break;
    }
  }
  
  const predictedValue = currentValue + trend.slope * (futureIndex - currentIndex);
  return Math.max(0, predictedValue); // Ensure non-negative values
}