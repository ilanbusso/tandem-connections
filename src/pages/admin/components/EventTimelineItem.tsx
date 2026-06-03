import { CheckCircle2, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LiveEvent } from '../data/adminMock';

const styles = {
  success: { ring: 'ring-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-700', Icon: CheckCircle2 },
  warning: { ring: 'ring-amber-200', bg: 'bg-[#F8E287]/50', text: 'text-amber-700', Icon: AlertTriangle },
  critical: { ring: 'ring-rose-200', bg: 'bg-rose-50', text: 'text-rose-700', Icon: AlertOctagon },
  info: { ring: 'ring-sky-200', bg: 'bg-[#A4DDED]/30', text: 'text-sky-700', Icon: Info },
} as const;

function relativeTime(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `hace ${diff}s`;
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} d`;
}

export function EventTimelineItem({ event }: { event: LiveEvent }) {
  const s = styles[event.severity];
  const Icon = s.Icon;
  return (
    <div className="flex gap-3 py-3">
      <div className={cn('h-9 w-9 shrink-0 rounded-full flex items-center justify-center ring-1', s.bg, s.ring)}>
        <Icon className={cn('h-4 w-4', s.text)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-900 truncate">{event.type}</p>
          <span className="text-xs text-slate-500 shrink-0">{relativeTime(event.timestamp)}</span>
        </div>
        <p className="text-sm text-slate-600 truncate">{event.message}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          {event.actor} · <span className="capitalize">{event.ecosystem}</span>
        </p>
      </div>
    </div>
  );
}
