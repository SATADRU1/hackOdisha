'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { useState } from "react";

interface Transaction {
    id: string;
    hash: string;
    type: 'send' | 'receive';
    amount: string;
    currency: string;
    to: string;
    from: string;
    status: 'pending' | 'confirmed' | 'failed';
    timestamp: string;
    fee: string;
}

interface TransactionListProps {
    transactions: Transaction[];
    onViewTransaction?: (hash: string) => void;
}

export function TransactionList({ transactions, onViewTransaction }: TransactionListProps) {
    const [filter, setFilter] = useState<'all' | 'send' | 'receive'>('all');

    const filteredTransactions = transactions.filter(tx => 
        filter === 'all' || tx.type === filter
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-500/20 text-green-500 border-green-500/30';
            case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
            case 'failed': return 'bg-red-500/20 text-red-500 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <Card className="bg-card/50 backdrop-blur-lg border-border/50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Recent Transactions</CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant={filter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={filter === 'send' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('send')}
                        >
                            Sent
                        </Button>
                        <Button
                            variant={filter === 'receive' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('receive')}
                        >
                            Received
                        </Button>
                    </div>
                </div>
                <CardDescription>Your latest transaction history</CardDescription>
            </CardHeader>
            <CardContent>
                {filteredTransactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No transactions found
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredTransactions.map((tx) => (
                            <div
                                key={tx.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${
                                        tx.type === 'send' 
                                            ? 'bg-red-500/20 text-red-500' 
                                            : 'bg-green-500/20 text-green-500'
                                    }`}>
                                        {tx.type === 'send' ? (
                                            <ArrowUpRight className="h-4 w-4" />
                                        ) : (
                                            <ArrowDownLeft className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {tx.type === 'send' ? 'Sent' : 'Received'} {tx.amount} {tx.currency}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {tx.type === 'send' ? `To: ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` : `From: ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`}
                                        </p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatTimestamp(tx.timestamp)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(tx.status)}>
                                        {tx.status}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onViewTransaction?.(tx.hash)}
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
