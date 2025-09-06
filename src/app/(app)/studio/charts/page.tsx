import ChartRenderer from '@/components/studio/ChartRenderer';
import AITestPanel from '@/components/studio/AITestPanel';

export default function ChartsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-start">
      <div className="lg:col-span-2">
        <ChartRenderer />
      </div>
      <div className="lg:col-span-1">
        <AITestPanel />
      </div>
    </div>
  );
}
