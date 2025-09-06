'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Send, Download, CreditCard } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PaymentFormProps {
    type: 'send' | 'request';
    onSuccess?: (data: any) => void;
}

export function PaymentForm({ type, onSuccess }: PaymentFormProps) {
    const [formData, setFormData] = useState({
        recipient: '',
        amount: '',
        currency: 'ETH',
        memo: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // TODO: Integrate with Verbwire payment API
            const response = await fetch(`/api/verbwire/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: type,
                    ...formData
                })
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    title: type === 'send' ? 'Payment Sent' : 'Payment Request Created',
                    description: result.message,
                });
                onSuccess?.(result);
                setFormData({ recipient: '', amount: '', currency: 'ETH', memo: '' });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Something went wrong',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Card className="bg-card/50 backdrop-blur-lg border-border/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {type === 'send' ? (
                        <Send className="h-6 w-6" />
                    ) : (
                        <Download className="h-6 w-6" />
                    )}
                    {type === 'send' ? 'Send Payment' : 'Request Payment'}
                </CardTitle>
                <CardDescription>
                    {type === 'send' 
                        ? 'Send crypto payments to any wallet address'
                        : 'Request payments from other users'
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {type === 'send' && (
                        <div className="space-y-2">
                            <Label htmlFor="recipient">Recipient Address</Label>
                            <Input
                                id="recipient"
                                value={formData.recipient}
                                onChange={(e) => handleInputChange('recipient', e.target.value)}
                                placeholder="0x..."
                                required
                            />
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.000001"
                                value={formData.amount}
                                onChange={(e) => handleInputChange('amount', e.target.value)}
                                placeholder="0.0"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select
                                value={formData.currency}
                                onValueChange={(value) => handleInputChange('currency', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ETH">ETH</SelectItem>
                                    <SelectItem value="BTC">BTC</SelectItem>
                                    <SelectItem value="USDC">USDC</SelectItem>
                                    <SelectItem value="USDT">USDT</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="memo">Memo (Optional)</Label>
                        <Textarea
                            id="memo"
                            value={formData.memo}
                            onChange={(e) => handleInputChange('memo', e.target.value)}
                            placeholder="Payment description or note"
                            rows={3}
                        />
                    </div>
                    
                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            'Processing...'
                        ) : (
                            <>
                                {type === 'send' ? (
                                    <Send className="mr-2 h-4 w-4" />
                                ) : (
                                    <Download className="mr-2 h-4 w-4" />
                                )}
                                {type === 'send' ? 'Send Payment' : 'Request Payment'}
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
