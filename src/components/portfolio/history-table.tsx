'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { history } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useMining } from '@/hooks/use-mining';
import { Pickaxe } from 'lucide-react';

export default function HistoryTable() {
  const { transactions: miningTransactions, isLoading } = useMining();
  
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'Mined': return 'default';
      case 'Deposit': return 'secondary';
      case 'Withdrawal': return 'outline';
      default: return 'secondary';
    }
  };

  // Combine real mining transactions with mock history
  const allTransactions = [
    ...(miningTransactions || []),
    ...history
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-lg border-border/50 p-8">
        <div className="text-center text-muted-foreground">Loading transaction history...</div>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-lg border-border/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Coin</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Value (USD)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allTransactions.map((tx, index) => (
            <TableRow key={`${tx.type}-${index}`} className={tx.coin === 'FOCUS' ? 'bg-amber-500/5' : ''}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {tx.coin === 'FOCUS' && <Pickaxe className="h-3 w-3 text-amber-500" />}
                  <Badge variant={getBadgeVariant(tx.type)}>
                    {tx.type}
                  </Badge>
                  {tx.coin === 'FOCUS' && (
                    <span className="text-xs text-amber-600">Mining Session</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {new Date(tx.date).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {tx.coin}
                  {tx.coin === 'FOCUS' && (
                    <span className="text-xs bg-amber-500/20 text-amber-600 px-1 py-0.5 rounded">
                      MINED
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className={cn(tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400')}>
                {tx.amount}
              </TableCell>
              <TableCell className={cn(
                  "text-right font-mono",
                  tx.value >= 0 ? 'text-green-400' : 'text-red-400'
                )}
              >
                {tx.value >= 0 ? `+$${tx.value.toFixed(2)}` : `-$${Math.abs(tx.value).toFixed(2)}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
