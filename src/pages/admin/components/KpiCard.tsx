import { Card } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  accent?: 'celeste' | 'lila' | 'amarillo' | 'rojo';
}

const accentMap = {
  celeste: 'bg-[#A4DDED]/30 text-sky-700',
  lila: 'bg-[#C9A7EB]/30 text-purple-700',
  amarillo: 'bg-[#F8E287]/40 text-amber-700',
  rojo: 'bg-rose-100 text-rose-700',
};

export function KpiCard({ label, value, delta, icon: Icon, accent = 'celeste' }: Props) {
  const positive = (delta ?? 0) >= 0;
  return (
    <Card className="bg-white border-slate-100 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={cn('rounded-lg p-2.5', accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {delta !== undefined && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium',
              positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
            )}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {positive ? '+' : ''}
            {delta}%
          </span>
          <span className="text-slate-500">vs período anterior</span>
        </div>
      )}
    </Card>
  );
}
