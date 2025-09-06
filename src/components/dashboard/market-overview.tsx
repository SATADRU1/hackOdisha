import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { marketOverviewData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function MarketOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {marketOverviewData.map((item) => (
        <Card key={item.name} className="bg-card/50 backdrop-blur-lg border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p
              className={cn(
                'text-xs text-muted-foreground flex items-center',
                item.up ? 'text-green-400' : 'text-red-400'
              )}
            >
              {item.up ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {item.change} vs last 24h
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
