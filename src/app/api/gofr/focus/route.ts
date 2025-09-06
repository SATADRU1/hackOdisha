import { NextRequest, NextResponse } from 'next/server';

// Gofr Focus API endpoints
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // TODO: Integrate with Gofr focus backend
        const mockFocusData = {
            userId,
            status: 'idle',
            currentSession: null,
            streak: 5,
            totalSessions: 42,
            completedSessions: 38,
            totalStaked: 0.95,
            totalEarned: 1.12,
            lastUpdated: new Date().toISOString()
        };

        return NextResponse.json(mockFocusData);
    } catch (error) {
        console.error('Error fetching focus data:', error);
        return NextResponse.json({ error: 'Failed to fetch focus data' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...data } = body;

        switch (action) {
            case 'start':
                // Start focus session
                const { duration, stakeAmount } = data;
                return NextResponse.json({ 
                    status: 'active',
                    message: 'Focus session started successfully',
                    sessionId: Math.floor(Math.random() * 1000),
                    duration,
                    stake: stakeAmount,
                    timestamp: new Date().toISOString()
                });
            
            case 'complete':
                // Complete focus session
                const { sessionId, isSuccess } = data;
                const reward = isSuccess ? data.stakeAmount * 1.1 : 0;
                return NextResponse.json({ 
                    status: 'completed',
                    message: 'Focus session completed successfully',
                    isSuccess,
                    reward,
                    timestamp: new Date().toISOString()
                });
            
            case 'configure':
                // Configure focus settings
                const { defaultDuration, defaultStake, blockedWebsites, notificationSound, autoStartBreak, breakDuration } = data;
                return NextResponse.json({ 
                    message: 'Focus configuration updated successfully',
                    config: { defaultDuration, defaultStake, blockedWebsites, notificationSound, autoStartBreak, breakDuration }
                });
            
            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error processing focus request:', error);
        return NextResponse.json({ error: 'Failed to process focus request' }, { status: 500 });
    }
}
