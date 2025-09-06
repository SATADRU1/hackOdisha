'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageIcon, Eye, Heart, Share2 } from "lucide-react";
import { useState } from "react";

interface NFTCardProps {
    id: string;
    name: string;
    description: string;
    image: string;
    price: string;
    currency: string;
    rarity: string;
    owner?: string;
    collection?: string;
    onView?: (id: string) => void;
    onBuy?: (id: string) => void;
    onLike?: (id: string) => void;
}

export function NFTCard({ 
    id, 
    name, 
    description, 
    image, 
    price, 
    currency, 
    rarity, 
    owner,
    collection,
    onView,
    onBuy,
    onLike 
}: NFTCardProps) {
    const [isLiked, setIsLiked] = useState(false);

    const getRarityColor = (rarity: string) => {
        switch (rarity.toLowerCase()) {
            case 'legendary': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
            case 'epic': return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
            case 'rare': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
            case 'common': return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
            default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
        }
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        onLike?.(id);
    };

    return (
        <Card className="bg-card/50 backdrop-blur-lg border-border/50 hover:border-primary/30 transition-all duration-200 group">
            <CardHeader className="p-0">
                <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center relative overflow-hidden">
                    {image ? (
                        <img 
                            src={image} 
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                    ) : (
                        <ImageIcon className="h-16 w-16 text-muted-foreground" />
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                            onClick={handleLike}
                        >
                            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                        >
                            <Share2 className="h-4 w-4 text-white" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg line-clamp-1">{name}</CardTitle>
                    <Badge className={getRarityColor(rarity)}>
                        {rarity}
                    </Badge>
                </div>
                
                {collection && (
                    <p className="text-sm text-muted-foreground mb-2">{collection}</p>
                )}
                
                <CardDescription className="mb-4 line-clamp-2">
                    {description}
                </CardDescription>
                
                {owner && (
                    <p className="text-xs text-muted-foreground mb-4">
                        Owned by {owner.slice(0, 6)}...{owner.slice(-4)}
                    </p>
                )}
                
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-2xl font-bold text-primary">{price} {currency}</p>
                        {price !== '0' && (
                            <p className="text-xs text-muted-foreground">Current price</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onView?.(id)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        {onBuy && (
                            <Button
                                size="sm"
                                onClick={() => onBuy(id)}
                            >
                                Buy Now
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
