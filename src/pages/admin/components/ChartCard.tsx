import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function ChartCard({ title, subtitle, children, action }: Props) {
  return (
    <Card className="bg-white border-slate-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="h-64">{children}</div>
    </Card>
  );
}
