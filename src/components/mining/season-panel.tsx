'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { seasonLeaderboard } from '@/lib/mock-data';

export default function SeasonPanel() {
  return (
    <Card className="bg-card/50 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle>Mining Season 1</CardTitle>
        <CardDescription>Season ends in: 12d 4h 32m</CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-4 text-lg">Leaderboard</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Mined (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seasonLeaderboard.map((player) => (
              <TableRow key={player.rank} className={player.user === 'You' ? 'bg-primary/10' : ''}>
                <TableCell className="font-medium">{player.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={player.avatar} alt={player.user} data-ai-hint="leaderboard avatar" />
                      <AvatarFallback>{player.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{player.user}</span>
                     {player.user === 'You' && <Badge variant="secondary">You</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">${player.mined.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
