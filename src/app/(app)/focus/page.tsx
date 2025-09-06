'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FocusTimer } from '@/components/focus/FocusTimer';
import { Target, Trophy, Clock, Coins } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function FocusPage() {
    const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
    const [sessionStats, setSessionStats] = useState({
        completedToday: 3,
        totalEarned: 0.045,
        currentStreak: 7,
        successRate: 85
    });
    const { toast } = useToast();

    const handleSessionStart = (sessionId: number) => {
        setActiveSessionId(sessionId);
        toast({
            title: "Focus Session Started",
            description: "Stay focused and earn rewards!",
        });
    };

    const handleSessionComplete = (isSuccess: boolean) => {
        setActiveSessionId(null);
        
        if (isSuccess) {
            setSessionStats(prev => ({
                ...prev,
                completedToday: prev.completedToday + 1,
                totalEarned: prev.totalEarned + 0.011,
                currentStreak: prev.currentStreak + 1,
            }));
        }
    };

    const handleSessionUpdate = (timeRemaining: number) => {
        // You can use this to update any UI based on time remaining
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Target className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold">Focus Sessions</h1>
                    <p className="text-muted-foreground">
                        Stake crypto, stay focused, earn rewards
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sessionStats.completedToday}</div>
                        <p className="text-xs text-muted-foreground">
                            Focus sessions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Earned Today</CardTitle>
                        <Coins className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sessionStats.totalEarned.toFixed(4)} ETH</div>
                        <p className="text-xs text-muted-foreground">
                            From successful sessions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sessionStats.currentStreak}</div>
                        <p className="text-xs text-muted-foreground">
                            Days in a row
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sessionStats.successRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            All time average
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Focus Timer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <FocusTimer
                        onSessionStart={handleSessionStart}
                        onSessionComplete={handleSessionComplete}
                        onSessionUpdate={handleSessionUpdate}
                    />
                </div>

                {/* Tips & Information */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">How It Works</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <span className="text-xs font-bold text-primary">1</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Choose Duration</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Select focus time and stake amount
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <span className="text-xs font-bold text-primary">2</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Stay Focused</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Avoid distracting websites and apps
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <span className="text-xs font-bold text-primary">3</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Earn Rewards</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Get your stake back plus 10% bonus
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Focus Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Close unnecessary browser tabs</li>
                                <li>• Put your phone in silent mode</li>
                                <li>• Use noise-cancelling headphones</li>
                                <li>• Start with shorter sessions</li>
                                <li>• Stay hydrated during breaks</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {activeSessionId && (
                        <Card className="border-primary/50 bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-lg text-primary">Session Active</CardTitle>
                                <CardDescription>
                                    Session #{activeSessionId} is currently running
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Keep going! Your stake is earning rewards.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
