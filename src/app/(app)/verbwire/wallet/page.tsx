
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { holdings } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Banknote, Landmark } from "lucide-react";
import { WalletCard } from "@/components/verbwire/WalletCard";
import { TransactionList } from "@/components/verbwire/TransactionList";
import { PaymentForm } from "@/components/verbwire/PaymentForm";

export default function WalletPage() {
    const { toast } = useToast();

    const totalValue = holdings.reduce((acc, holding) => acc + holding.value, 0);

    // Mock wallet data
    const walletData = {
        address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
        balance: totalValue.toString(),
        currency: "USD",
        isConnected: true
    };

    // Mock transaction data
    const transactions = [
        {
            id: "1",
            hash: "0x1234567890abcdef1234567890abcdef12345678",
            type: "receive" as const,
            amount: "0.5",
            currency: "ETH",
            to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
            from: "0x9876543210fedcba9876543210fedcba98765432",
            status: "confirmed",
            timestamp: new Date().toISOString(),
            fee: "0.001"
        },
        {
            id: "2",
            hash: "0xabcdef1234567890abcdef1234567890abcdef12",
            type: "send" as const,
            amount: "0.1",
            currency: "BTC",
            to: "0x1111111111111111111111111111111111111111",
            from: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
            status: "pending",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            fee: "0.0005"
        }
    ];

    const handleViewTransaction = (hash: string) => {
        window.open(`https://etherscan.io/tx/${hash}`, '_blank');
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Wallet</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Wallet Card */}
                <WalletCard
                    address={walletData.address}
                    balance={walletData.balance}
                    currency={walletData.currency}
                    isConnected={walletData.isConnected}
                />

                {/* Payment Forms */}
                <div className="space-y-6">
                    <PaymentForm
                        type="send"
                        onSuccess={(data) => console.log('Payment sent:', data)}
                    />
                    <PaymentForm
                        type="request"
                        onSuccess={(data) => console.log('Payment requested:', data)}
                    />
                </div>
            </div>

            {/* Transaction History */}
            <TransactionList
                transactions={transactions}
                onViewTransaction={handleViewTransaction}
            />
        </div>
    );
}
