'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Cpu, Thermometer, Zap, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface GofrStatusProps {
    userId: string;
    onStartMining?: () => void;
    onStopMining?: () => void;
}

export function GofrStatus({ userId, onStartMining, onStopMining }: GofrStatusProps) {
    const [miningData, setMiningData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMiningData();
        const interval = setInterval(fetchMiningData, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, [userId]);

    const fetchMiningData = async () => {
        try {
            const response = await fetch(`/api/gofr/mining?userId=${userId}`);
            const data = await response.json();
            setMiningData(data);
        } catch (error) {
            console.error('Failed to fetch mining data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMiningAction = async (action: 'start' | 'stop') => {
        try {
            const response = await fetch('/api/gofr/mining', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            
            if (response.ok) {
                fetchMiningData();
                if (action === 'start') onStartMining?.();
                if (action === 'stop') onStopMining?.();
            }
        } catch (error) {
            console.error(`Failed to ${action} mining:`, error);
        }
    };

    if (isLoading) {
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

    if (!miningData) {
        return (
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Failed to load mining data</p>
                </CardContent>
            </Card>
        );
    }

    const isMining = miningData.status === 'active';

    return (
        <div className="space-y-6">
            {/* Mining Status Card */}
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-6 w-6" />
                            Mining Status
                        </CardTitle>
                        <Badge variant={isMining ? "default" : "secondary"}>
                            {isMining ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                    <CardDescription>Current mining operation status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{miningData.hashrate}</p>
                            <p className="text-sm text-muted-foreground">Hashrate</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{miningData.powerConsumption}</p>
                            <p className="text-sm text-muted-foreground">Power</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{miningData.temperature}</p>
                            <p className="text-sm text-muted-foreground">Temperature</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{miningData.uptime}</p>
                            <p className="text-sm text-muted-foreground">Uptime</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button
                            onClick={() => handleMiningAction('start')}
                            disabled={isMining}
                            className="flex-1"
                        >
                            <Zap className="mr-2 h-4 w-4" />
                            Start Mining
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleMiningAction('stop')}
                            disabled={!isMining}
                            className="flex-1"
                        >
                            <Clock className="mr-2 h-4 w-4" />
                            Stop Mining
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Earnings Card */}
            <Card className="bg-card/50 backdrop-blur-lg border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Cpu className="h-6 w-6" />
                        Earnings
                    </CardTitle>
                    <CardDescription>Your mining rewards</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-primary">
                                {miningData.earnings.daily} {miningData.earnings.currency}
                            </p>
                            <p className="text-sm text-muted-foreground">Daily</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-primary">
                                {miningData.earnings.weekly} {miningData.earnings.currency}
                            </p>
                            <p className="text-sm text-muted-foreground">Weekly</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-primary">
                                {miningData.earnings.monthly} {miningData.earnings.currency}
                            </p>
                            <p className="text-sm text-muted-foreground">Monthly</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pool Information */}
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <CardTitle>Mining Pool</CardTitle>
                    <CardDescription>Current pool connection details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Pool Name:</span>
                        <span className="font-medium">{miningData.pool.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Workers:</span>
                        <span className="font-medium">{miningData.pool.workers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Connection:</span>
                        <Badge variant="default">Connected</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
