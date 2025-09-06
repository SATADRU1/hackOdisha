'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Target, TrendingUp, Clock, Coins, Award } from "lucide-react";
import { focusUtils } from "@/lib/gofr";

interface FocusStatusProps {
    userId: string;
    focusData?: {
        userId: string;
        status: 'active' | 'idle' | 'completed';
        currentSession?: {
            id: number;
            duration: number;
            stakeAmount: number;
            reward: number;
            status: string;
            startedAt: string;
            endedAt?: string;
            isSuccess?: boolean;
            txHash?: string;
        };
        streak: number;
        totalSessions: number;
        completedSessions: number;
        totalStaked: number;
        totalEarned: number;
        lastUpdated: string;
    };
    onStartSession?: () => void;
    onStopSession?: () => void;
}

export function FocusStatus({ userId, focusData, onStartSession, onStopSession }: FocusStatusProps) {
    if (!focusData) {
        return (
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                        <div className="h-8 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const isActive = focusData.status === 'active';
    const successRate = focusUtils.calculateSuccessRate(focusData.completedSessions, focusData.totalSessions);
    const roi = focusUtils.calculateROI(focusData.totalEarned, focusData.totalStaked);

    return (
        <div className="space-y-6">
            {/* Current Status */}
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-6 w-6" />
                            Focus Status
                        </CardTitle>
                        <Badge variant={isActive ? "default" : "secondary"}>
                            {isActive ? "Active Session" : "Idle"}
                        </Badge>
                    </div>
                    <CardDescription>Your current focus session status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isActive && focusData.currentSession ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary">
                                        {focusUtils.formatDuration(focusData.currentSession.duration)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Duration</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary">
                                        {focusUtils.formatStake(focusData.currentSession.stakeAmount)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Staked</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary">
                                        {focusUtils.formatReward(focusData.currentSession.reward)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Potential Reward</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary">
                                        {focusData.streak}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Current Streak</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Session Progress</span>
                                    <span>Active</span>
                                </div>
                                <Progress value={100} className="h-2" />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No active focus session</p>
                            <p className="text-sm text-muted-foreground">Start a new session to begin focusing</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Statistics Overview */}
            <Card className="bg-card/50 backdrop-blur-lg border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-6 w-6" />
                        Your Focus Statistics
                    </CardTitle>
                    <CardDescription>Track your focus journey and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">
                                {focusData.totalSessions}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Sessions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">
                                {focusData.completedSessions}
                            </div>
                            <div className="text-sm text-muted-foreground">Completed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">
                                {successRate.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Success Rate</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">
                                {focusData.streak}
                            </div>
                            <div className="text-sm text-muted-foreground">Day Streak</div>
                        </div>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Success Rate</span>
                                <span>{successRate.toFixed(1)}%</span>
                            </div>
                            <Progress value={successRate} className="h-2" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Earnings Overview */}
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Coins className="h-6 w-6" />
                        Earnings Overview
                    </CardTitle>
                    <CardDescription>Your focus rewards and staking history</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">
                                {focusUtils.formatStake(focusData.totalStaked)}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Staked</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">
                                {focusUtils.formatReward(focusData.totalEarned)}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Earned</div>
                        </div>
                        <div className="text-center">
                            <div className={`text-3xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {roi >= 0 ? '+' : ''}{roi.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">ROI</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-6 w-6" />
                        Achievements
                    </CardTitle>
                    <CardDescription>Your focus milestones and badges</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Streak Achievements */}
                        <div className={`p-4 rounded-lg border ${focusData.streak >= 3 ? 'bg-primary/10 border-primary' : 'bg-muted/50'}`}>
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {focusData.streak >= 3 ? '🔥' : '❄️'}
                                </div>
                                <div className="text-sm font-medium">3-Day Streak</div>
                                <div className="text-xs text-muted-foreground">
                                    {focusData.streak >= 3 ? 'Unlocked' : 'Locked'}
                                </div>
                            </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${focusData.streak >= 7 ? 'bg-primary/10 border-primary' : 'bg-muted/50'}`}>
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {focusData.streak >= 7 ? '⚡' : '❄️'}
                                </div>
                                <div className="text-sm font-medium">7-Day Streak</div>
                                <div className="text-xs text-muted-foreground">
                                    {focusData.streak >= 7 ? 'Unlocked' : 'Locked'}
                                </div>
                            </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${focusData.streak >= 30 ? 'bg-primary/10 border-primary' : 'bg-muted/50'}`}>
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {focusData.streak >= 30 ? '👑' : '❄️'}
                                </div>
                                <div className="text-sm font-medium">30-Day Streak</div>
                                <div className="text-xs text-muted-foreground">
                                    {focusData.streak >= 30 ? 'Unlocked' : 'Locked'}
                                </div>
                            </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${focusData.completedSessions >= 100 ? 'bg-primary/10 border-primary' : 'bg-muted/50'}`}>
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {focusData.completedSessions >= 100 ? '💎' : '❄️'}
                                </div>
                                <div className="text-sm font-medium">100 Sessions</div>
                                <div className="text-xs text-muted-foreground">
                                    {focusData.completedSessions >= 100 ? 'Unlocked' : 'Locked'}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default FocusStatus;
