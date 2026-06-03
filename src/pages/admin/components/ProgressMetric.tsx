import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: number;
  max?: number;
  unit?: string;
  thresholdWarn?: number;
  thresholdCrit?: number;
}

export function ProgressMetric({ label, value, max = 100, unit = '%', thresholdWarn = 70, thresholdCrit = 90 }: Props) {
  const pct = Math.min(100, (value / max) * 100);
  const color = pct >= thresholdCrit ? 'bg-rose-500' : pct >= thresholdWarn ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-slate-700">{label}</span>
        <span className="text-sm font-medium text-slate-900 tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={cn('h-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
