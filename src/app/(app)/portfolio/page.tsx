import HoldingsTable from '@/components/portfolio/holdings-table';
import HistoryTable from '@/components/portfolio/history-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMining } from '@/hooks/use-mining';
import { Plus, Pickaxe, TrendingUp, Clock, Trophy } from 'lucide-react';

export default function PortfolioPage() {
    const { stats, isLoading } = useMining();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Portfolio</h1>
                <Button size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Funds
                </Button>
            </div>

            {/* Mining Stats Overview */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Mined</CardTitle>
                            <Pickaxe className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600">{stats.totalMined} FOCUS</div>
                            <p className="text-xs text-muted-foreground">
                                ${stats.totalValue.toFixed(2)} value
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Today's Mining</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.todaysMining} FOCUS</div>
                            <p className="text-xs text-muted-foreground">
                                +{((stats.todaysMining / stats.totalMined) * 100).toFixed(1)}% of total
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sessions Completed</CardTitle>
                            <Clock className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.sessionsCompleted}</div>
                            <p className="text-xs text-muted-foreground">
                                Avg: {stats.averagePerSession.toFixed(1)} FOCUS/session
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Leaderboard Rank</CardTitle>
                            <Trophy className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">#{stats.currentRank}</div>
                            <p className="text-xs text-muted-foreground">
                                Mining champion
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div>
                <h2 className="text-2xl font-semibold mb-4">Your Holdings</h2>
                <HoldingsTable />
            </div>
             <div>
                <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
                <HistoryTable />
            </div>
        </div>
    )
}
