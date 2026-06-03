import { cn } from '@/lib/utils';

type Variant = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

const map: Record<Variant, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-rose-50 text-rose-700 ring-rose-200',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-200',
};

export function StatusPill({ variant, children }: { variant: Variant; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        map[variant],
      )}
    >
      {children}
    </span>
  );
}
