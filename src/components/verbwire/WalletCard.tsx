'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface WalletCardProps {
    address: string;
    balance: string;
    currency: string;
    isConnected?: boolean;
}

export function WalletCard({ address, balance, currency, isConnected = false }: WalletCardProps) {
    const [showBalance, setShowBalance] = useState(true);
    const { toast } = useToast();

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(address);
        toast({
            title: "Address Copied",
            description: "Wallet address copied to clipboard.",
        });
    };

    const handleViewOnExplorer = () => {
        // TODO: Open in blockchain explorer
        window.open(`https://etherscan.io/address/${address}`, '_blank');
    };

    const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
        <Card className="bg-card/50 backdrop-blur-lg border-primary/20">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Wallet</CardTitle>
                    <Badge variant={isConnected ? "default" : "secondary"}>
                        {isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                </div>
                <CardDescription>Your crypto wallet address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Address</span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyAddress}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleViewOnExplorer}
                            >
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <p className="font-mono text-sm bg-muted/50 p-2 rounded">
                        {truncatedAddress}
                    </p>
                </div>
                
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Balance</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowBalance(!showBalance)}
                        >
                            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                    <p className="text-2xl font-bold">
                        {showBalance ? `${balance} ${currency}` : '••••••••'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
