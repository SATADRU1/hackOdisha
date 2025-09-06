import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'line';
  const timeframe = searchParams.get('timeframe') || '24h';
  const symbol = searchParams.get('symbol') || 'BTC';

  try {
    // Mock data - replace with actual data fetching logic
    const mockData = {
      labels: Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toLocaleDateString();
      }),
      datasets: [
        {
          label: `${symbol} Price (${timeframe})`,
          data: Array.from({ length: 30 }, () => Math.random() * 1000 + 40000),
          borderColor: 'hsl(24.6, 95%, 53.1%)',
          backgroundColor: 'hsl(24.6, 95%, 53.1%, 0.2)',
        },
      ],
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
