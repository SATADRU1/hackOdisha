import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

interface WalletData {
    address: string;
    balance: string;
    currency: string;
    transactions: any[];
}

interface NFTData {
    id: string;
    name: string;
    description: string;
    image: string;
    price: string;
    currency: string;
    rarity: string;
    owner?: string;
    collection?: string;
}

interface PaymentData {
    id: string;
    from: string;
    to: string;
    amount: string;
    currency: string;
    status: string;
    timestamp: string;
}

export function useVerbwire() {
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [nftData, setNftData] = useState<NFTData[]>([]);
    const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // Wallet functions
    const fetchWalletData = async (address: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/verbwire/wallet?address=${address}`);
            const data = await response.json();
            setWalletData(data);
            return data;
        } catch (error) {
            console.error('Failed to fetch wallet data:', error);
            toast({
                title: "Error",
                description: "Failed to fetch wallet data",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const createWallet = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/verbwire/wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create' })
            });
            const data = await response.json();
            toast({
                title: "Wallet Created",
                description: data.message,
            });
            return data;
        } catch (error) {
            console.error('Failed to create wallet:', error);
            toast({
                title: "Error",
                description: "Failed to create wallet",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const transferFunds = async (to: string, amount: string, currency: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/verbwire/wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'transfer',
                    to,
                    amount,
                    currency
                })
            });
            const data = await response.json();
            toast({
                title: "Transfer Initiated",
                description: data.message,
            });
            return data;
        } catch (error) {
            console.error('Failed to transfer funds:', error);
            toast({
                title: "Error",
                description: "Failed to transfer funds",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // NFT functions
    const fetchNFTs = async (owner?: string, collection?: string) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (owner) params.append('owner', owner);
            if (collection) params.append('collection', collection);
            
            const response = await fetch(`/api/verbwire/nft?${params}`);
            const data = await response.json();
            setNftData(data.nfts);
            return data.nfts;
        } catch (error) {
            console.error('Failed to fetch NFTs:', error);
            toast({
                title: "Error",
                description: "Failed to fetch NFTs",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const mintNFT = async (name: string, description: string, image: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/verbwire/nft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'mint',
                    name,
                    description,
                    image
                })
            });
            const data = await response.json();
            toast({
                title: "NFT Minted",
                description: data.message,
            });
            return data;
        } catch (error) {
            console.error('Failed to mint NFT:', error);
            toast({
                title: "Error",
                description: "Failed to mint NFT",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const transferNFT = async (tokenId: string, to: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/verbwire/nft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'transfer',
                    tokenId,
                    to
                })
            });
            const data = await response.json();
            toast({
                title: "NFT Transfer Initiated",
                description: data.message,
            });
            return data;
        } catch (error) {
            console.error('Failed to transfer NFT:', error);
            toast({
                title: "Error",
                description: "Failed to transfer NFT",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Payment functions
    const fetchPayments = async (wallet?: string) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (wallet) params.append('wallet', wallet);
            
            const response = await fetch(`/api/verbwire/payments?${params}`);
            const data = await response.json();
            setPaymentData(data.transactions);
            return data.transactions;
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            toast({
                title: "Error",
                description: "Failed to fetch payment history",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const sendPayment = async (to: string, amount: string, currency: string, memo?: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/verbwire/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'send',
                    to,
                    amount,
                    currency,
                    memo
                })
            });
            const data = await response.json();
            toast({
                title: "Payment Sent",
                description: data.message,
            });
            return data;
        } catch (error) {
            console.error('Failed to send payment:', error);
            toast({
                title: "Error",
                description: "Failed to send payment",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const requestPayment = async (amount: string, currency: string, memo?: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/verbwire/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'request',
                    amount,
                    currency,
                    memo
                })
            });
            const data = await response.json();
            toast({
                title: "Payment Request Created",
                description: data.message,
            });
            return data;
        } catch (error) {
            console.error('Failed to request payment:', error);
            toast({
                title: "Error",
                description: "Failed to create payment request",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        // State
        walletData,
        nftData,
        paymentData,
        isLoading,
        
        // Wallet functions
        fetchWalletData,
        createWallet,
        transferFunds,
        
        // NFT functions
        fetchNFTs,
        mintNFT,
        transferNFT,
        
        // Payment functions
        fetchPayments,
        sendPayment,
        requestPayment,
    };
}
