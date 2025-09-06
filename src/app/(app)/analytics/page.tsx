import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PortfolioAllocationChart from "@/components/analytics/portfolio-allocation-chart";
import EarningsChart from "@/components/analytics/earnings-chart";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Analytics</h1>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <PortfolioAllocationChart />
                </div>
                <div className="lg:col-span-2">
                    <EarningsChart />
                </div>
            </div>
             <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <CardTitle>Mining History</CardTitle>
                    <CardDescription>Detailed log of your past mining sessions.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Placeholder for a more detailed history/table component */}
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Detailed mining session history coming soon.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
