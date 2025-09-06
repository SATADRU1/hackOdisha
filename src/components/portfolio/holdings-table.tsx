import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { holdings } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function HoldingsTable() {
  return (
    <Card className="bg-card/50 backdrop-blur-lg border-border/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coin</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Est. Value</TableHead>
            <TableHead className="text-right">24h P/L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.map((holding) => (
            <TableRow key={holding.symbol}>
              <TableCell className="font-medium">{holding.coin} <span className="text-muted-foreground">{holding.symbol}</span></TableCell>
              <TableCell>{holding.quantity.toFixed(4)}</TableCell>
              <TableCell>${holding.value.toLocaleString()}</TableCell>
              <TableCell className={cn(
                  "text-right font-medium flex justify-end items-center gap-2",
                  holding.pnl >= 0 ? 'text-green-400' : 'text-red-400'
              )}>
                 {holding.pnl >= 0 ? <ArrowUp size={16}/> : <ArrowDown size={16}/>}
                 ${Math.abs(holding.pnl).toLocaleString()} ({holding.pnl_perc}%)
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
