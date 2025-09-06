import MiningPanel from '@/components/mining/mining-panel';
import SeasonPanel from '@/components/mining/season-panel';

export default function MiningPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-start">
      <div className="lg:col-span-2">
        <MiningPanel />
      </div>
      <div className="lg:col-span-1">
        <SeasonPanel />
      </div>
    </div>
  );
}
