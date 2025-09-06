import { NextRequest, NextResponse } from 'next/server';

// Verbwire Payments API endpoints
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const wallet = searchParams.get('wallet');

        // TODO: Integrate with Verbwire Payments API
        const mockTransactions = [
            {
                id: '1',
                from: '0x123...',
                to: '0x456...',
                amount: '0.1',
                currency: 'ETH',
                status: 'completed',
                timestamp: new Date().toISOString()
            }
        ];

        return NextResponse.json({ transactions: mockTransactions });
    } catch (error) {
        console.error('Error fetching payment history:', error);
        return NextResponse.json({ error: 'Failed to fetch payment history' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...data } = body;

        switch (action) {
            case 'send':
                // Send payment
                return NextResponse.json({ 
                    txHash: '0x' + Math.random().toString(16).substr(2, 64),
                    message: 'Payment sent successfully' 
                });
            
            case 'request':
                // Request payment
                return NextResponse.json({ 
                    requestId: Math.random().toString(36).substr(2, 9),
                    message: 'Payment request created successfully' 
                });
            
            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error processing payment request:', error);
        return NextResponse.json({ error: 'Failed to process payment request' }, { status: 500 });
    }
}
