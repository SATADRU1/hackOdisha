'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Send, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaymentForm } from "@/components/verbwire/PaymentForm";

export default function PaymentsPage() {
    const { toast } = useToast();

    const handlePaymentSuccess = (data: any) => {
        console.log('Payment processed:', data);
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Payments</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Send Payment */}
                <PaymentForm
                    type="send"
                    onSuccess={handlePaymentSuccess}
                />

                {/* Request Payment */}
                <PaymentForm
                    type="request"
                    onSuccess={handlePaymentSuccess}
                />
            </div>

            {/* Payment History */}
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-6 w-6" />
                        Recent Transactions
                    </CardTitle>
                    <CardDescription>Your latest payment activity.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        No recent transactions
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
