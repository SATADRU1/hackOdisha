'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Trophy, Star, Crown, Gem, Zap } from "lucide-react";

interface FocusAchievementsProps {
    userId: string;
}

export function FocusAchievements({ userId }: FocusAchievementsProps) {
    // Mock achievements data - in production, this would come from the API
    const achievements = [
        {
            id: 'first_session',
            title: 'First Focus',
            description: 'Complete your first focus session',
            icon: Star,
            unlocked: true,
            unlockedAt: '2024-01-15',
            rarity: 'common'
        },
        {
            id: 'streak_3',
            title: '3-Day Streak',
            description: 'Maintain focus for 3 consecutive days',
            icon: Zap,
            unlocked: true,
            unlockedAt: '2024-01-18',
            rarity: 'uncommon'
        },
        {
            id: 'streak_7',
            title: 'Week Warrior',
            description: 'Maintain focus for 7 consecutive days',
            icon: Trophy,
            unlocked: true,
            unlockedAt: '2024-01-25',
            rarity: 'rare'
        },
        {
            id: 'streak_30',
            title: 'Focus Master',
            description: 'Maintain focus for 30 consecutive days',
            icon: Crown,
            unlocked: false,
            unlockedAt: null,
            rarity: 'epic'
        },
        {
            id: 'sessions_100',
            title: 'Centurion',
            description: 'Complete 100 focus sessions',
            icon: Award,
            unlocked: false,
            unlockedAt: null,
            rarity: 'legendary'
        },
        {
            id: 'earnings_1_eth',
            title: 'ETH Earner',
            description: 'Earn 1 ETH from focus sessions',
            icon: Gem,
            unlocked: false,
            unlockedAt: null,
            rarity: 'mythic'
        }
    ];

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'uncommon': return 'bg-green-100 text-green-800 border-green-200';
            case 'rare': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'epic': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'legendary': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'mythic': return 'bg-pink-100 text-pink-800 border-pink-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const unlockedAchievements = achievements.filter(a => a.unlocked);
    const lockedAchievements = achievements.filter(a => !a.unlocked);

    return (
        <Card className="bg-card/50 backdrop-blur-lg border-border/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Award className="h-6 w-6" />
                    Achievements
                </CardTitle>
                <CardDescription>
                    Your focus milestones and NFT badges
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Progress Summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                            {unlockedAchievements.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Unlocked</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-muted-foreground">
                            {lockedAchievements.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Locked</div>
                    </div>
                </div>

                {/* Unlocked Achievements */}
                {unlockedAchievements.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground">Unlocked</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {unlockedAchievements.map((achievement) => {
                                const IconComponent = achievement.icon;
                                return (
                                    <div
                                        key={achievement.id}
                                        className={`p-3 rounded-lg border ${getRarityColor(achievement.rarity)}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <IconComponent className="h-6 w-6" />
                                            <div className="flex-1">
                                                <div className="font-medium">{achievement.title}</div>
                                                <div className="text-xs opacity-75">{achievement.description}</div>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {achievement.rarity}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Locked Achievements */}
                {lockedAchievements.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground">Locked</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {lockedAchievements.map((achievement) => {
                                const IconComponent = achievement.icon;
                                return (
                                    <div
                                        key={achievement.id}
                                        className="p-3 rounded-lg border bg-muted/50 opacity-60"
                                    >
                                        <div className="flex items-center gap-3">
                                            <IconComponent className="h-6 w-6 text-muted-foreground" />
                                            <div className="flex-1">
                                                <div className="font-medium text-muted-foreground">{achievement.title}</div>
                                                <div className="text-xs text-muted-foreground">{achievement.description}</div>
                                            </div>
                                            <Badge variant="outline" className="text-xs text-muted-foreground">
                                                {achievement.rarity}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* NFT Integration Notice */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Gem className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">NFT Integration</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Unlocked achievements will be minted as non-transferable NFT badges using Verbwire.
                        Each badge represents your focus journey and can be displayed in your profile.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}