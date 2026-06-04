import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ProgressMetric } from '../components/ProgressMetric';
import { FeatureFlagsCard } from '../components/FeatureFlagsCard';
import { StatusPill } from '../components/StatusPill';
import { integrations } from '../data/adminMock';
import { toast } from '@/hooks/use-toast';
import { Database, RefreshCw, Lock, LogOut, Play } from 'lucide-react';

interface Metrics { cpu: number; ram: number; latency: number; disk: number; jobs: number; }

function rand(min: number, max: number) { return Math.round(min + Math.random() * (max - min)); }

export function SystemHealth() {
  const [m, setM] = useState<Metrics>({ cpu: 42, ram: 68, latency: 124, disk: 51, jobs: 8 });
  const [maintenance, setMaintenance] = useState(false);
  const [blockSignup, setBlockSignup] = useState(false);

  useEffect(() => {
    const i = setInterval(() => {
      setM({
        cpu: Math.max(15, Math.min(95, rand(35, 70))),
        ram: Math.max(40, Math.min(95, rand(55, 85))),
        latency: Math.max(50, Math.min(800, rand(90, 220))),
        disk: rand(48, 58),
        jobs: rand(0, 24),
      });
    }, 3000);
    return () => clearInterval(i);
  }, []);

  const [sql, setSql] = useState('SELECT id, name, email\nFROM users\nWHERE plan = \'premium\'\nLIMIT 10;');
  const [results, setResults] = useState<{ id: string; name: string; email: string }[] | null>(null);
  const runSql = () => {
    setResults([
      { id: 'u1', name: 'Juan García', email: 'juan@tandem.app' },
      { id: 'u3', name: 'Mateo Rodríguez', email: 'mateo@tandem.app' },
      { id: 'u7', name: 'Nicolás Fernández', email: 'nico@tandem.app' },
      { id: 'u10', name: 'Mía Castro', email: 'mia@tandem.app' },
      { id: 'u13', name: 'Federico Morales', email: 'fede@tandem.app' },
    ]);
    toast({ title: 'Consulta ejecutada', description: '5 filas devueltas en 23ms.' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="bg-white border-slate-100 shadow-sm p-5 lg:col-span-2">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Métricas del servidor</h3>
        <div className="space-y-4">
          <ProgressMetric label="Uso de CPU" value={m.cpu} />
          <ProgressMetric label="Memoria RAM" value={m.ram} />
          <ProgressMetric label="Latencia API (p95)" value={m.latency} max={1000} unit=" ms" thresholdWarn={400} thresholdCrit={700} />
          <ProgressMetric label="Uso de disco" value={m.disk} />
          <ProgressMetric label="Cola de jobs" value={m.jobs} max={50} unit="" thresholdWarn={25} thresholdCrit={40} />
        </div>
      </Card>

      <Card className="bg-white border-slate-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Estado de integraciones</h3>
        <ul className="space-y-3">
          {integrations.map((it) => (
            <li key={it.name} className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{it.name}</p>
                <p className="text-xs text-slate-500 truncate">{it.detail}</p>
              </div>
              <StatusPill variant={it.ok ? 'success' : 'danger'}>{it.ok ? 'OK' : 'Caído'}</StatusPill>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="bg-white border-slate-100 shadow-sm p-5 lg:col-span-3">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Controles rápidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div>
              <Label className="text-sm font-medium text-slate-900">Modo mantenimiento</Label>
              <p className="text-xs text-slate-500">Bloquea el acceso a la plataforma</p>
            </div>
            <Switch checked={maintenance} onCheckedChange={(v) => { setMaintenance(v); toast({ title: v ? 'Mantenimiento activado' : 'Mantenimiento desactivado' }); }} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div>
              <Label className="text-sm font-medium text-slate-900">Bloquear nuevos registros</Label>
              <p className="text-xs text-slate-500">Detiene altas en B2C y B2B</p>
            </div>
            <Switch checked={blockSignup} onCheckedChange={(v) => { setBlockSignup(v); toast({ title: v ? 'Registros bloqueados' : 'Registros habilitados' }); }} />
          </div>
          <Button variant="outline" className="justify-start h-auto py-3" onClick={() => toast({ title: 'Caché ARASAAC purgada', description: '2.341 pictogramas serán recargados.' })}>
            <RefreshCw className="h-4 w-4 mr-2 text-[#C9A7EB]" />
            <div className="text-left">
              <p className="text-sm font-medium">Purgar caché ARASAAC</p>
              <p className="text-xs text-slate-500">Refresca biblioteca de pictogramas</p>
            </div>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-3" onClick={() => toast({ title: 'Logout global ejecutado', description: 'Todas las sesiones fueron invalidadas.', variant: 'destructive' })}>
            <LogOut className="h-4 w-4 mr-2 text-rose-600" />
            <div className="text-left">
              <p className="text-sm font-medium">Forzar logout global</p>
              <p className="text-xs text-slate-500">Invalida tokens de todos los usuarios</p>
            </div>
          </Button>
        </div>
      </Card>

      <div className="lg:col-span-3">
        <FeatureFlagsCard />
      </div>

      <Card className="bg-white border-slate-100 shadow-sm p-5 lg:col-span-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900">Consola SQL</h3>
            <StatusPill variant="warning"><Lock className="h-3 w-3 mr-0.5" /> Solo lectura</StatusPill>
          </div>
          <Button size="sm" onClick={runSql} className="bg-[#A4DDED] text-sky-900 hover:bg-[#A4DDED]/80">
            <Play className="h-3.5 w-3.5 mr-1.5" /> Ejecutar
          </Button>
        </div>
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          className="w-full h-32 rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C9A7EB]/40"
          spellCheck={false}
        />
        {results && (
          <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">id</th>
                  <th className="text-left px-3 py-2 font-medium">name</th>
                  <th className="text-left px-3 py-2 font-medium">email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((r) => (
                  <tr key={r.id}>
                    <td className="px-3 py-2 font-mono text-xs text-slate-500">{r.id}</td>
                    <td className="px-3 py-2 text-slate-900">{r.name}</td>
                    <td className="px-3 py-2 text-slate-600">{r.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
