'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Plus, Eye } from "lucide-react";
import { NFTCard } from "@/components/verbwire/NFTCard";

export default function NFTPage() {
    const mockNFTs = [
        {
            id: 1,
            name: "Crypto Miner #001",
            description: "A rare digital mining artifact",
            image: "/api/placeholder/300/300",
            price: "0.5 ETH",
            rarity: "Legendary"
        },
        {
            id: 2,
            name: "Blockchain Explorer",
            description: "Navigate the digital frontier",
            image: "/api/placeholder/300/300",
            price: "0.3 ETH",
            rarity: "Epic"
        },
        {
            id: 3,
            name: "Hash Generator",
            description: "The power of cryptographic hashing",
            image: "/api/placeholder/300/300",
            price: "0.1 ETH",
            rarity: "Common"
        }
    ];

    const handleViewNFT = (id: string) => {
        console.log('Viewing NFT:', id);
    };

    const handleBuyNFT = (id: string) => {
        console.log('Buying NFT:', id);
    };

    const handleLikeNFT = (id: string) => {
        console.log('Liking NFT:', id);
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">NFT Collection</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create NFT
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockNFTs.map((nft) => (
                    <NFTCard
                        key={nft.id}
                        id={nft.id.toString()}
                        name={nft.name}
                        description={nft.description}
                        image={nft.image}
                        price={nft.price}
                        currency="ETH"
                        rarity={nft.rarity}
                        onView={handleViewNFT}
                        onBuy={handleBuyNFT}
                        onLike={handleLikeNFT}
                    />
                ))}
            </div>
        </div>
    );
}
