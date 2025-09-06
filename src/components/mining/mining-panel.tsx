'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Play, Pause, Square, RefreshCw, Zap, Target } from 'lucide-react';

const PLAN_DURATION_MINS = 60; // From "Gold" plan

export default function MiningPanel() {
  const totalTime = useMemo(() => PLAN_DURATION_MINS * 60 * 1000, []);
  const [remainingTime, setRemainingTime] = useState(totalTime);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1000) {
            clearInterval(interval);
            setIsActive(false);
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const handleStart = () => {
    if (remainingTime === 0) setRemainingTime(totalTime);
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => setIsPaused(!isPaused);
  const handleStop = () => {
    setIsActive(false);
    setRemainingTime(0);
  };
  const handleReset = () => {
    setIsActive(false);
    setRemainingTime(totalTime);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (totalTime - remainingTime) / totalTime;
  const circumference = 2 * Math.PI * 140;

  return (
    <Card className="bg-card/50 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle>Mining Session</CardTitle>
        <div className="flex items-center gap-4 pt-2">
            <span className="text-muted-foreground">Coin:</span>
            <Select defaultValue="BTC">
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select coin" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                <SelectItem value="SOL">Solana (SOL)</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-8">
        <div className="relative h-72 w-72">
          <svg className="h-full w-full" viewBox="0 0 300 300">
            <circle
              cx="150" cy="150" r="140"
              stroke="hsl(var(--border))" strokeWidth="15" fill="transparent"
            />
            <circle
              cx="150" cy="150" r="140"
              stroke="hsl(var(--primary))" strokeWidth="15" fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              transform="rotate(-90 150 150)"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-5xl font-bold tracking-tighter">
              {formatTime(remainingTime)}
            </p>
            <p className="text-muted-foreground">Time Remaining</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center w-full max-w-sm">
            <div className="p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground">Hashrate</p>
                <p className="text-2xl font-semibold flex items-center justify-center gap-2"><Zap className="text-primary"/> 115 TH/s</p>
            </div>
             <div className="p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground">Shares Found</p>
                <p className="text-2xl font-semibold flex items-center justify-center gap-2"><Target className="text-primary"/> 1,234</p>
            </div>
        </div>

        <div className="flex items-center space-x-4">
          {!isActive ? (
            <Button onClick={handleStart} size="lg" className="w-40">
              <Play className="mr-2 h-4 w-4" /> Start
            </Button>
          ) : (
            <>
              <Button onClick={handlePause} size="lg" variant="secondary" className="w-40">
                <Pause className="mr-2 h-4 w-4" /> {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button onClick={handleStop} size="lg" variant="destructive" className="w-40">
                <Square className="mr-2 h-4 w-4" /> Stop
              </Button>
            </>
          )}
          <Button onClick={handleReset} variant="outline" size="icon">
             <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
