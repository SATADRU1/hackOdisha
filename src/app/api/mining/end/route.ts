import { NextRequest, NextResponse } from 'next/server';

const STUDIO_BASE_URL = process.env.STUDIO_URL || 'http://localhost:3001/api/v1';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        const response = await fetch(`${STUDIO_BASE_URL}/mining/end`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            throw new Error(`Studio API error: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error ending mining session:', error);
        return NextResponse.json(
            { error: 'Failed to end mining session' }, 
            { status: 500 }
        );
    }
}
