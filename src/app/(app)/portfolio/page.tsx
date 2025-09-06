import HoldingsTable from '@/components/portfolio/holdings-table';
import HistoryTable from '@/components/portfolio/history-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function PortfolioPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Portfolio</h1>
                <Button size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Funds
                </Button>
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Your Holdings</h2>
                <HoldingsTable />
            </div>
             <div>
                <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
                <HistoryTable />
            </div>
        </div>
    )
}
