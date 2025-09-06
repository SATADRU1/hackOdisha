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

export default function HistoryTable() {
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'Mined': return 'default';
      case 'Deposit': return 'secondary';
      case 'Withdrawal': return 'outline';
      default: return 'secondary';
    }
  };

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
          {history.map((tx, index) => (
            <TableRow key={index}>
              <TableCell><Badge variant={getBadgeVariant(tx.type)}>{tx.type}</Badge></TableCell>
              <TableCell>{tx.date}</TableCell>
              <TableCell className="font-medium">{tx.coin}</TableCell>
              <TableCell className={cn(tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400')}>{tx.amount}</TableCell>
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
