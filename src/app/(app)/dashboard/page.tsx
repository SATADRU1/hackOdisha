'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, Award, Clock, Coins, Users } from 'lucide-react';
import { useGofr } from '@/hooks/use-gofr';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, focusData, fetchFocusData } = useGofr();
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalSessions: 15689,
    totalStaked: 45.67,
    successRate: 78.5
  });

  useEffect(() => {
    if (user) {
      fetchFocusData(user.id);
    }
  }, [user, fetchFocusData]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FocusStake Dashboard</h1>
          <p className="text-muted-foreground">
            Gamified productivity with economic incentives. Turn focus into rewards.
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Target className="w-4 h-4 mr-1" />
          Web3 Focus Protocol
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{focusData?.totalSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {focusData?.completedSessions || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {focusData ? ((focusData.completedSessions / focusData.totalSessions) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Focus completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{focusData?.streak || 0}</div>
            <p className="text-xs text-muted-foreground">
              Days in a row
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{focusData?.totalEarned?.toFixed(4) || '0.0000'} ETH</div>
            <p className="text-xs text-muted-foreground">
              From {focusData?.totalStaked?.toFixed(4) || '0.0000'} ETH staked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStaked} ETH</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              +3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 flex flex-col justify-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Start Your Focus Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Ready to turn focus into rewards? Start a focus session, stake crypto, and earn rewards for successful completion. 
                Join thousands of users who are already earning while staying productive.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg">
                  <Link href="/focus">
                    <Target className="mr-2 h-4 w-4" />
                    Start Focus Session
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/pricing">
                    View Pricing
                  </Link>
                </Button>
              </div>
            </CardContent>
          </div>
          <div className="relative min-h-[250px] md:min-h-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <div className="text-center">
              <Target className="h-24 w-24 mx-auto text-primary/60 mb-4" />
              <h3 className="text-xl font-semibold mb-2">FocusStake Protocol</h3>
              <p className="text-sm text-muted-foreground">
                Gamified productivity with economic incentives
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}