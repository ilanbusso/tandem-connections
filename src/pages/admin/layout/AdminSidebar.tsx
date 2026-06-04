import { LayoutDashboard, Database, Activity, Server, ChevronLeft, ChevronRight, LogOut, LayoutTemplate, ScrollText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export type AdminSection = 'home' | 'db' | 'live' | 'system' | 'templates' | 'audit';

interface Props {
  section: AdminSection;
  onChange: (s: AdminSection) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const items: { id: AdminSection; label: string; Icon: typeof LayoutDashboard; desc: string }[] = [
  { id: 'home', label: 'Dashboard', Icon: LayoutDashboard, desc: 'Vista general y KPIs' },
  { id: 'db', label: 'Base de datos', Icon: Database, desc: 'Gestión de usuarios' },
  { id: 'live', label: 'Live Feed', Icon: Activity, desc: 'Eventos en tiempo real' },
  { id: 'templates', label: 'Plantillas', Icon: LayoutTemplate, desc: 'Rutinas base / pictogramas' },
  { id: 'audit', label: 'Audit Logs', Icon: ScrollText, desc: 'Historial de admins' },
  { id: 'system', label: 'System & Health', Icon: Server, desc: 'Salud del sistema' },
];

export function AdminSidebar({ section, onChange, collapsed, onToggle }: Props) {
  const { logout } = useAuth();
  return (
    <aside
      className={cn(
        'shrink-0 bg-white border-r border-slate-200 flex flex-col transition-all duration-200',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#A4DDED] to-[#C9A7EB] flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 leading-tight">TÁNDEM</p>
              <p className="text-[10px] text-slate-500 leading-tight">Backoffice</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto" onClick={onToggle}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {items.map((it) => {
          const active = section === it.id;
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                active
                  ? 'bg-[#C9A7EB]/20 text-purple-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )}
              title={collapsed ? it.label : undefined}
            >
              <it.Icon className={cn('h-5 w-5 shrink-0', active && 'text-purple-700')} />
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-medium">{it.label}</p>
                  <p className="text-[11px] text-slate-500 truncate">{it.desc}</p>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-colors"
          title={collapsed ? 'Cerrar sesión' : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="text-sm">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
