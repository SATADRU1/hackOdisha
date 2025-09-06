
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { holdings } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Banknote, Landmark } from "lucide-react";

export default function WalletPage() {
    const { toast } = useToast();

    const totalValue = holdings.reduce((acc, holding) => acc + holding.value, 0);

    const handleAddAccount = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        toast({
            title: "Bank Account Added",
            description: "Your bank account has been successfully linked.",
        });
        (event.target as HTMLFormElement).reset();
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Wallet</h1>
            </div>

            <Card className="bg-card/50 backdrop-blur-lg border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Banknote className="h-6 w-6" />
                        Total Portfolio Value
                    </CardTitle>
                    <CardDescription>The current estimated value of all your crypto holdings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-5xl font-bold tracking-tight text-primary">
                        ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Landmark className="h-6 w-6" />
                        Link Bank Account
                    </CardTitle>
                    <CardDescription>Add a bank account for seamless deposits and withdrawals.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddAccount} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="bankName">Bank Name</Label>
                            <Input id="bankName" placeholder="e.g., First National Bank" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="accountNumber">Account Number</Label>
                                <Input id="accountNumber" placeholder="Enter your account number" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="routingNumber">Routing Number</Label>
                                <Input id="routingNumber" placeholder="Enter your routing number" required />
                            </div>
                        </div>
                        <Button type="submit">
                            <Landmark className="mr-2 h-4 w-4" />
                            Link Account
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
