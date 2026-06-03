import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { EventTimelineItem } from '../components/EventTimelineItem';
import { generateInitialEvents, randomEvent, type EventEcosystem, type EventSeverity, type LiveEvent } from '../data/adminMock';

const severities: { id: EventSeverity; label: string }[] = [
  { id: 'critical', label: 'Críticos' },
  { id: 'warning', label: 'Avisos' },
  { id: 'success', label: 'Éxitos' },
  { id: 'info', label: 'Informativos' },
];

const ecos: { id: EventEcosystem; label: string }[] = [
  { id: 'perteneciente', label: 'App Perteneciente' },
  { id: 'profesional', label: 'Portal Profesional' },
  { id: 'tutor', label: 'Portal Tutor' },
  { id: 'sistema', label: 'Sistema / Infra' },
];

export function LiveFeed() {
  const [events, setEvents] = useState<LiveEvent[]>(() => generateInitialEvents(40));
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeSev, setActiveSev] = useState<Set<EventSeverity>>(new Set(severities.map((s) => s.id)));
  const [activeEco, setActiveEco] = useState<Set<EventEcosystem>>(new Set(ecos.map((e) => e.id)));

  useEffect(() => {
    if (!autoRefresh) return;
    const i = setInterval(() => {
      setEvents((prev) => [randomEvent(), ...prev].slice(0, 200));
    }, 5000);
    return () => clearInterval(i);
  }, [autoRefresh]);

  const filtered = useMemo(
    () => events.filter((e) => activeSev.has(e.severity) && activeEco.has(e.ecosystem)),
    [events, activeSev, activeEco],
  );

  const toggle = <T extends string>(set: Set<T>, value: T, fn: (s: Set<T>) => void) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    fn(next);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
      <Card className="bg-white border-slate-100 shadow-sm p-4 h-fit lg:sticky lg:top-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Filtros</h3>
          <div className="flex items-center gap-2">
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} id="auto-r" />
            <Label htmlFor="auto-r" className="text-xs text-slate-600">Live</Label>
          </div>
        </div>

        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">Severidad</p>
        <div className="space-y-2 mb-4">
          {severities.map((s) => (
            <label key={s.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={activeSev.has(s.id)}
                onCheckedChange={() => toggle(activeSev, s.id, setActiveSev)}
              />
              <span className="text-sm text-slate-700">{s.label}</span>
            </label>
          ))}
        </div>

        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">Ecosistema</p>
        <div className="space-y-2">
          {ecos.map((e) => (
            <label key={e.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={activeEco.has(e.id)}
                onCheckedChange={() => toggle(activeEco, e.id, setActiveEco)}
              />
              <span className="text-sm text-slate-700">{e.label}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card className="bg-white border-slate-100 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Timeline de eventos</h3>
            <p className="text-xs text-slate-500">{filtered.length} eventos visibles · {autoRefresh ? 'Actualizando cada 5s' : 'Pausado'}</p>
          </div>
          {autoRefresh && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> En vivo
            </span>
          )}
        </div>
        <div className="divide-y divide-slate-100 px-4 max-h-[70vh] overflow-y-auto">
          {filtered.map((e) => <EventTimelineItem key={e.id} event={e} />)}
          {filtered.length === 0 && (
            <p className="text-sm text-slate-500 py-10 text-center">No hay eventos para los filtros activos.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
