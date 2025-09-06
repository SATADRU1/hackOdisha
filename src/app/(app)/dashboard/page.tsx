import MarketOverview from '@/components/dashboard/market-overview';
import AiRecommendations from '@/components/dashboard/ai-recommendations';
import CoinPerformanceChart from '@/components/dashboard/coin-performance-chart';
import MarketDominanceChart from '@/components/dashboard/market-dominance-chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <MarketOverview />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AiRecommendations />
        </div>
        <div className="lg:col-span-1">
          <MarketDominanceChart />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <CoinPerformanceChart />
      </div>
       <Card className="bg-card/50 backdrop-blur-lg border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 flex flex-col justify-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Start Your Mining Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Ready to dive in? Head over to the mining page to start your first session and see your earnings grow in real-time.
              </p>
              <a href="/mining" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
                Go to Mining
              </a>
            </CardContent>
          </div>
          <div className="relative min-h-[250px] md:min-h-0">
             <Image 
                src="https://picsum.photos/600/400" 
                alt="Mining rig"
                data-ai-hint="crypto mining"
                fill
                className="object-cover rounded-r-lg"
             />
          </div>
        </div>
      </Card>
    </div>
  );
}
