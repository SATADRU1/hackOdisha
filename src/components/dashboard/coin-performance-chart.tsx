'use client';

import { TrendingUp } from 'lucide-react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { coinPerformanceData } from '@/lib/mock-data';

const chartConfig = {
  BTC: {
    label: 'Bitcoin (BTC)',
    color: 'hsl(var(--chart-1))',
  },
  ETH: {
    label: 'Ethereum (ETH)',
    color: 'hsl(var(--chart-2))',
  },
  SOL: {
    label: 'Solana (SOL)',
    color: 'hsl(var(--chart-4))',
  },
};

export default function CoinPerformanceChart() {
  return (
    <Card className="bg-card/50 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle>Coin Performance</CardTitle>
        <CardDescription>Price overview for the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <LineChart data={coinPerformanceData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 2, strokeDasharray: '3 3' }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Legend />
            <Line
              dataKey="BTC"
              type="monotone"
              stroke="var(--color-BTC)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="ETH"
              type="monotone"
              stroke="var(--color-ETH)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="SOL"
              type="monotone"
              stroke="var(--color-SOL)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
