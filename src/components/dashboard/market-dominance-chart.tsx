'use client';

import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, Legend } from 'recharts';
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
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { marketDominanceData, marketDominanceConfig } from '@/lib/mock-data';

export default function MarketDominanceChart() {
  return (
    <Card className="h-full bg-card/50 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle>Market Dominance</CardTitle>
        <CardDescription>Top coins by market share</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={marketDominanceConfig}
          className="min-h-[250px] w-full"
        >
          <BarChart data={marketDominanceData} layout="vertical" margin={{ left: 10, right: 10 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis type="number" hide />
            <Tooltip
              cursor={{ fill: 'hsl(var(--background))' }}
              content={<ChartTooltipContent />}
            />
            <Legend content={<ChartLegendContent />} />
            <Bar dataKey="value" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
