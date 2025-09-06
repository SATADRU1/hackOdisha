
'use client';

import { Pie, PieChart, Tooltip, Legend, Cell } from 'recharts';
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
  ChartLegendContent
} from '@/components/ui/chart';
import { portfolioAllocationData, portfolioAllocationConfig } from '@/lib/mock-data';

export default function PortfolioAllocationChart() {
  return (
    <Card className="h-full bg-card/50 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle>Portfolio Allocation</CardTitle>
        <CardDescription>Distribution of your mined assets</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={portfolioAllocationConfig}
          className="min-h-[300px] w-full"
        >
          <PieChart>
            <Tooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={portfolioAllocationData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              {portfolioAllocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
