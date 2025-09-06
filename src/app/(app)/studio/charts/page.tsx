<<<<<<< HEAD
import ChartRenderer from '@/components/studio/ChartRenderer';
=======
import { ChartRenderer } from '@/components/studio/ChartRenderer';
>>>>>>> 261b8b1962d4e70ad7a488283f2e08102a6ec1d7
import { AITestPanel } from '@/components/studio/AITestPanel';

export default function ChartsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-start" suppressHydrationWarning>
      <div className="lg:col-span-2">
        <ChartRenderer />
      </div>
      <div className="lg:col-span-1">
        <AITestPanel />
      </div>
    </div>
  );
}
