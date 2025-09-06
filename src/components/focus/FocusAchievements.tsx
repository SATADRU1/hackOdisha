'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Trophy, Star, Crown, Zap, Target, Clock, Coins } from "lucide-react";
import { useVerbwire } from "@/hooks/use-verbwire";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    requirement: number;
    current: number;
    unlocked: boolean;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    reward: {
        type: 'nft' | 'bonus';
        value: string;
    };
}

interface FocusAchievementsProps {
    userId: string;
    focusStats: {
        streak: number;
        totalSessions: number;
        completedSessions: number;
        totalStaked: number;
        totalEarned: number;
    };
}

export function FocusAchievements({ userId, focusStats }: FocusAchievementsProps) {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { mintNFT } = useVerbwire();
    const { toast } = useToast();

    // Define achievement templates
    const achievementTemplates: Omit<Achievement, 'current' | 'unlocked'>[] = [
        {
            id: 'first_session',
            name: 'First Steps',
            description: 'Complete your first focus session',
            icon: '🎯',
            requirement: 1,
            rarity: 'common',
            reward: { type: 'nft', value: 'First Focus Badge' }
        },
        {
            id: 'streak_3',
            name: 'Fire Starter',
            description: 'Maintain a 3-day focus streak',
            icon: '🔥',
            requirement: 3,
            rarity: 'common',
            reward: { type: 'nft', value: '3-Day Streak Badge' }
        },
        {
            id: 'streak_7',
            name: 'Week Warrior',
            description: 'Maintain a 7-day focus streak',
            icon: '⚡',
            requirement: 7,
            rarity: 'rare',
            reward: { type: 'nft', value: '7-Day Streak Badge' }
        },
        {
            id: 'streak_30',
            name: 'Focus Master',
            description: 'Maintain a 30-day focus streak',
            icon: '👑',
            requirement: 30,
            rarity: 'legendary',
            reward: { type: 'nft', value: '30-Day Streak Badge' }
        },
        {
            id: 'sessions_10',
            name: 'Dedicated',
            description: 'Complete 10 focus sessions',
            icon: '💎',
            requirement: 10,
            rarity: 'common',
            reward: { type: 'nft', value: '10 Sessions Badge' }
        },
        {
            id: 'sessions_50',
            name: 'Focused',
            description: 'Complete 50 focus sessions',
            icon: '🏆',
            requirement: 50,
            rarity: 'rare',
            reward: { type: 'nft', value: '50 Sessions Badge' }
        },
        {
            id: 'sessions_100',
            name: 'Elite Focuser',
            description: 'Complete 100 focus sessions',
            icon: '🌟',
            requirement: 100,
            rarity: 'epic',
            reward: { type: 'nft', value: '100 Sessions Badge' }
        },
        {
            id: 'earnings_1',
            name: 'Earned It',
            description: 'Earn 1 ETH from focus sessions',
            icon: '💰',
            requirement: 1,
            rarity: 'rare',
            reward: { type: 'nft', value: '1 ETH Earner Badge' }
        },
        {
            id: 'perfect_week',
            name: 'Perfect Week',
            description: 'Complete 7 sessions in a week with 100% success rate',
            icon: '🎖️',
            requirement: 7,
            rarity: 'epic',
            reward: { type: 'nft', value: 'Perfect Week Badge' }
        }
    ];

    useEffect(() => {
        // Calculate current progress for each achievement
        const updatedAchievements = achievementTemplates.map(achievement => {
            let current = 0;
            
            switch (achievement.id) {
                case 'first_session':
                case 'sessions_10':
                case 'sessions_50':
                case 'sessions_100':
                    current = focusStats.completedSessions;
                    break;
                case 'streak_3':
                case 'streak_7':
                case 'streak_30':
                    current = focusStats.streak;
                    break;
                case 'earnings_1':
                    current = focusStats.totalEarned;
                    break;
                case 'perfect_week':
                    // This would need more complex logic to track weekly perfect sessions
                    current = Math.min(focusStats.streak, 7);
                    break;
            }
            
            return {
                ...achievement,
                current,
                unlocked: current >= achievement.requirement
            };
        });
        
        setAchievements(updatedAchievements);
    }, [focusStats]);

    const handleMintAchievement = async (achievement: Achievement) => {
        if (!achievement.unlocked) return;
        
        setIsLoading(true);
        try {
            // Create NFT metadata
            const metadata = {
                name: achievement.reward.value,
                description: `FocusStake Achievement: ${achievement.description}`,
                image: `data:image/svg+xml;base64,${btoa(`
                    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                        <rect width="400" height="400" fill="#1a1a1a"/>
                        <text x="200" y="200" font-size="80" text-anchor="middle" fill="white">${achievement.icon}</text>
                        <text x="200" y="250" font-size="20" text-anchor="middle" fill="white">${achievement.name}</text>
                        <text x="200" y="280" font-size="14" text-anchor="middle" fill="#888">${achievement.description}</text>
                    </svg>
                `)}`,
                attributes: [
                    { trait_type: "Rarity", value: achievement.rarity },
                    { trait_type: "Type", value: "Focus Achievement" },
                    { trait_type: "Requirement", value: achievement.requirement.toString() }
                ]
            };

            // Mint NFT using Verbwire
            await mintNFT(
                achievement.reward.value,
                achievement.description,
                metadata.image
            );

            toast({
                title: "Achievement Minted!",
                description: `You've successfully minted the ${achievement.reward.value} NFT!`,
            });
        } catch (error) {
            console.error('Failed to mint achievement NFT:', error);
            toast({
                title: "Error",
                description: "Failed to mint achievement NFT",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'bg-gray-500';
            case 'rare': return 'bg-blue-500';
            case 'epic': return 'bg-purple-500';
            case 'legendary': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    const getRarityTextColor = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'text-gray-500';
            case 'rare': return 'text-blue-500';
            case 'epic': return 'text-purple-500';
            case 'legendary': return 'text-yellow-500';
            default: return 'text-gray-500';
        }
    };

    const unlockedAchievements = achievements.filter(a => a.unlocked);
    const lockedAchievements = achievements.filter(a => !a.unlocked);

    return (
        <div className="space-y-6">
            {/* Achievement Overview */}
            <Card className="bg-card/50 backdrop-blur-lg border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-6 w-6" />
                        Achievement Progress
                    </CardTitle>
                    <CardDescription>Track your focus milestones and unlock rewards</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">
                                {unlockedAchievements.length}
                            </div>
                            <div className="text-sm text-muted-foreground">Unlocked</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">
                                {achievements.length - unlockedAchievements.length}
                            </div>
                            <div className="text-sm text-muted-foreground">Locked</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">
                                {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Complete</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Unlocked Achievements */}
            {unlockedAchievements.length > 0 && (
                <Card className="bg-card/50 backdrop-blur-lg border-green-500/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-6 w-6 text-green-500" />
                            Unlocked Achievements
                        </CardTitle>
                        <CardDescription>Your completed focus milestones</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {unlockedAchievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className="p-4 rounded-lg border border-green-500/20 bg-green-500/5"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-2xl">{achievement.icon}</div>
                                        <Badge className={`${getRarityColor(achievement.rarity)} text-white`}>
                                            {achievement.rarity}
                                        </Badge>
                                    </div>
                                    <h3 className="font-semibold text-green-600">{achievement.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {achievement.description}
                                    </p>
                                    <Button
                                        size="sm"
                                        onClick={() => handleMintAchievement(achievement)}
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        <Award className="mr-2 h-4 w-4" />
                                        Mint NFT
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Locked Achievements */}
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-6 w-6" />
                        Locked Achievements
                    </CardTitle>
                    <CardDescription>Keep focusing to unlock these rewards</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lockedAchievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className="p-4 rounded-lg border border-muted bg-muted/20"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-2xl opacity-50">{achievement.icon}</div>
                                    <Badge variant="secondary" className={getRarityTextColor(achievement.rarity)}>
                                        {achievement.rarity}
                                    </Badge>
                                </div>
                                <h3 className="font-semibold opacity-75">{achievement.name}</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {achievement.description}
                                </p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Progress</span>
                                        <span>{achievement.current}/{achievement.requirement}</span>
                                    </div>
                                    <Progress 
                                        value={(achievement.current / achievement.requirement) * 100} 
                                        className="h-2" 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
