'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { earningsData } from '@/lib/mock-data';

const chartConfig = {
  earnings: {
    label: 'Earnings (USD)',
    color: 'hsl(var(--chart-1))',
  },
};

export default function EarningsChart() {
  return (
    <Card className="h-full bg-card/50 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle>Cumulative Earnings</CardTitle>
        <CardDescription>Your total mined value over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <LineChart data={earningsData}>
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
                tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Line
              dataKey="earnings"
              type="monotone"
              stroke="var(--color-earnings)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
