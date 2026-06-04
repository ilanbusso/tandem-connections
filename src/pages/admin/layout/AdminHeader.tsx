import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import type { AdminSection } from './AdminSidebar';
import { BroadcastDialog } from '../components/BroadcastDialog';

const titles: Record<AdminSection, { title: string; subtitle: string }> = {
  home: { title: 'Panel general', subtitle: 'Visión global de la plataforma Tándem' },
  db: { title: 'Gestión de base de datos', subtitle: 'Administración de usuarios e instituciones' },
  live: { title: 'Live Feed', subtitle: 'Eventos en tiempo real' },
  templates: { title: 'Plantillas', subtitle: 'Rutinas base con pictogramas' },
  audit: { title: 'Audit Logs', subtitle: 'Historial de acciones administrativas' },
  system: { title: 'System & Health', subtitle: 'Estado del backend y controles administrativos' },
};

export function AdminHeader({ section }: { section: AdminSection }) {
  const { user } = useAuth();
  const t = titles[section];
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0">
      <div className="min-w-0">
        <h1 className="text-base font-semibold text-slate-900 truncate">{t.title}</h1>
        <p className="text-xs text-slate-500 truncate">{t.subtitle}</p>
      </div>
      <div className="flex-1 max-w-md ml-6 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Búsqueda global..." className="pl-9 bg-slate-50 border-slate-200 h-9" />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <BroadcastDialog />
        <button className="relative h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="h-8 w-8 rounded-full bg-[#C9A7EB]/30 flex items-center justify-center text-purple-700 font-semibold text-sm">
            {user?.name?.[0] ?? 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900 leading-tight">{user?.name ?? 'Admin'}</p>
            <p className="text-[11px] text-slate-500 leading-tight">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
