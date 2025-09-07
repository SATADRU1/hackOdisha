import { NextRequest, NextResponse } from 'next/server';

const STUDIO_BASE_URL = process.env.STUDIO_URL || 'http://localhost:3001/api/v1';

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${STUDIO_BASE_URL}/mining/sessions`);
        
        if (!response.ok) {
            throw new Error(`Studio API error: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching mining sessions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch mining sessions' }, 
            { status: 500 }
        );
    }
}
