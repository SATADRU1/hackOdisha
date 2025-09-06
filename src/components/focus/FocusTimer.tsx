'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, Settings, Clock, Coins, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { focusUtils } from "@/lib/gofr";

interface FocusTimerProps {
    onSessionStart?: (sessionId: number) => void;
    onSessionComplete?: (isSuccess: boolean) => void;
    onSessionUpdate?: (timeRemaining: number) => void;
}

export function FocusTimer({ onSessionStart, onSessionComplete, onSessionUpdate }: FocusTimerProps) {
    const [duration, setDuration] = useState(25); // Default 25 minutes
    const [stakeAmount, setStakeAmount] = useState(0.01); // Default 0.01 ETH
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [distractionCount, setDistractionCount] = useState(0);
    const [isBlockingEnabled, setIsBlockingEnabled] = useState(true);
    
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const { toast } = useToast();

    // Predefined session types
    const sessionTypes = [
        { duration: 15, label: 'Quick Focus', stake: 0.005 },
        { duration: 25, label: 'Pomodoro', stake: 0.01 },
        { duration: 45, label: 'Deep Work', stake: 0.02 },
        { duration: 90, label: 'Extended Focus', stake: 0.05 },
    ];

    // Initialize timer when duration changes
    useEffect(() => {
        if (!isActive) {
            setTimeRemaining(duration * 60);
        }
    }, [duration, isActive]);

    // Timer countdown
    useEffect(() => {
        if (isActive && !isPaused && timeRemaining > 0) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    const newTime = prev - 1;
                    onSessionUpdate?.(newTime);
                    
                    if (newTime <= 0) {
                        handleSessionComplete(true);
                    }
                    return newTime;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, isPaused, timeRemaining]);

    // Website blocking functionality
    useEffect(() => {
        if (isActive && isBlockingEnabled) {
            const blockedSites = [
                'facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com',
                'youtube.com', 'reddit.com', 'netflix.com', 'amazon.com'
            ];

            const checkUrl = () => {
                const currentUrl = window.location.hostname;
                if (blockedSites.some(site => currentUrl.includes(site))) {
                    setDistractionCount(prev => prev + 1);
                    toast({
                        title: "Distraction Detected!",
                        description: "You're on a blocked website. Get back to work!",
                        variant: "destructive",
                    });
                }
            };

            // Check every 5 seconds
            const urlCheckInterval = setInterval(checkUrl, 5000);
            return () => clearInterval(urlCheckInterval);
        }
    }, [isActive, isBlockingEnabled, toast]);

    const handleStartSession = async () => {
        try {
            // Here you would call the API to start a focus session
            // const response = await startFocusSession(duration, stakeAmount);
            // setSessionId(response.sessionId);
            
            // Mock session start for now
            const mockSessionId = Math.floor(Math.random() * 1000);
            setSessionId(mockSessionId);
            setIsActive(true);
            setIsPaused(false);
            setDistractionCount(0);
            
            onSessionStart?.(mockSessionId);
            
            toast({
                title: "Focus Session Started",
                description: `Staked ${focusUtils.formatStake(stakeAmount)} for ${focusUtils.formatDuration(duration)}`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to start focus session",
                variant: "destructive",
            });
        }
    };

    const handlePauseSession = () => {
        setIsPaused(!isPaused);
        toast({
            title: isPaused ? "Session Resumed" : "Session Paused",
            description: isPaused ? "Get back to focusing!" : "Session paused",
        });
    };

    const handleStopSession = () => {
        handleSessionComplete(false);
    };

    const handleSessionComplete = async (isSuccess: boolean) => {
        setIsActive(false);
        setIsPaused(false);
        
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        try {
            // Here you would call the API to complete the session
            // if (sessionId) {
            //     await completeFocusSession(sessionId, isSuccess);
            // }
            
            onSessionComplete?.(isSuccess);
            
            const message = isSuccess 
                ? `Session completed successfully! You earned ${focusUtils.formatReward(stakeAmount * 1.1)}`
                : `Session failed. Your stake of ${focusUtils.formatStake(stakeAmount)} was forfeited.`;
                
            toast({
                title: isSuccess ? "Session Completed!" : "Session Failed",
                description: message,
                variant: isSuccess ? "default" : "destructive",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to complete session",
                variant: "destructive",
            });
        }
        
        setSessionId(null);
        setTimeRemaining(duration * 60);
    };

    const handleSessionTypeChange = (type: string) => {
        const selectedType = sessionTypes.find(t => t.label === type);
        if (selectedType) {
            setDuration(selectedType.duration);
            setStakeAmount(selectedType.stake);
        }
    };

    const progress = duration > 0 ? ((duration * 60 - timeRemaining) / (duration * 60)) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* Session Configuration */}
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-6 w-6" />
                        Focus Session Setup
                    </CardTitle>
                    <CardDescription>Configure your focus session parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="sessionType">Session Type</Label>
                            <Select onValueChange={handleSessionTypeChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select session type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sessionTypes.map((type) => (
                                        <SelectItem key={type.label} value={type.label}>
                                            {type.label} ({focusUtils.formatDuration(type.duration)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                                id="duration"
                                type="number"
                                min="5"
                                max="120"
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value) || 25)}
                                disabled={isActive}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="stake">Stake Amount (ETH)</Label>
                            <Input
                                id="stake"
                                type="number"
                                step="0.001"
                                min="0.001"
                                max="1.0"
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(parseFloat(e.target.value) || 0.01)}
                                disabled={isActive}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Blocking</Label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="blocking"
                                    checked={isBlockingEnabled}
                                    onChange={(e) => setIsBlockingEnabled(e.target.checked)}
                                    disabled={isActive}
                                />
                                <Label htmlFor="blocking" className="text-sm">
                                    Block distracting websites
                                </Label>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Timer Display */}
            <Card className="bg-card/50 backdrop-blur-lg border-primary/20">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-6 w-6" />
                            Focus Timer
                        </CardTitle>
                        <Badge variant={isActive ? "default" : "secondary"}>
                            {isActive ? (isPaused ? "Paused" : "Active") : "Idle"}
                        </Badge>
                    </div>
                    <CardDescription>
                        {focusUtils.getSessionTypeName(duration)} session
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Timer Circle */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                {/* Background circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    className="text-muted-foreground/20"
                                />
                                {/* Progress circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 45}`}
                                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                                    className="text-primary transition-all duration-1000 ease-linear"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-3xl font-mono font-bold">
                                        {focusUtils.formatTimeRemaining(timeRemaining)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {Math.round(progress)}% complete
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Session Stats */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-primary">
                                    {focusUtils.formatStake(stakeAmount)}
                                </div>
                                <div className="text-sm text-muted-foreground">Staked</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-destructive">
                                    {distractionCount}
                                </div>
                                <div className="text-sm text-muted-foreground">Distractions</div>
                            </div>
                        </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex justify-center gap-4">
                        {!isActive ? (
                            <Button
                                onClick={handleStartSession}
                                size="lg"
                                className="min-w-[120px]"
                            >
                                <Play className="mr-2 h-4 w-4" />
                                Start Session
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={handlePauseSession}
                                    variant="outline"
                                    size="lg"
                                >
                                    {isPaused ? (
                                        <>
                                            <Play className="mr-2 h-4 w-4" />
                                            Resume
                                        </>
                                    ) : (
                                        <>
                                            <Pause className="mr-2 h-4 w-4" />
                                            Pause
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={handleStopSession}
                                    variant="destructive"
                                    size="lg"
                                >
                                    <Square className="mr-2 h-4 w-4" />
                                    Stop Session
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
