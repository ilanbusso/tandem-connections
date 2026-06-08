import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Download, ShieldAlert } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BackupRow {
  id: string;
  date: string;
  size: string;
  type: 'Automático' | 'Manual';
  status: 'OK' | 'Parcial';
}

const initial: BackupRow[] = [
  { id: 'b1', date: '2026-06-08 03:00', size: '4.2 GB', type: 'Automático', status: 'OK' },
  { id: 'b2', date: '2026-06-07 03:00', size: '4.1 GB', type: 'Automático', status: 'OK' },
  { id: 'b3', date: '2026-06-06 18:42', size: '4.0 GB', type: 'Manual', status: 'OK' },
  { id: 'b4', date: '2026-06-06 03:00', size: '4.0 GB', type: 'Automático', status: 'OK' },
];

export function BackupsCard() {
  const [backups, setBackups] = useState<BackupRow[]>(initial);
  const [busy, setBusy] = useState(false);

  const handleGenerateBackup = () => {
    setBusy(true);
    toast({ title: 'Generando backup', description: 'Snapshot iniciado del cluster Postgres principal...' });
    setTimeout(() => {
      const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
      setBackups((b) => [
        { id: `b${Date.now()}`, date: now, size: '4.3 GB', type: 'Manual', status: 'OK' },
        ...b,
      ]);
      setBusy(false);
      toast({ title: 'Backup completado', description: 'Snapshot generado y subido a almacenamiento seguro.' });
    }, 1400);
  };

  return (
    <Card className="bg-white border-slate-100 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4 text-purple-700" /> Copias de seguridad
          </CardTitle>
          <CardDescription>
            Snapshots periódicos de la base de datos principal. Las acciones de restauración son irreversibles.
          </CardDescription>
        </div>
        <Button variant="destructive" onClick={handleGenerateBackup} disabled={busy}>
          <Download className="h-4 w-4 mr-1.5" />
          {busy ? 'Generando...' : 'Generar backup ahora'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2.5">
          <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
          La operación bloqueará brevemente la escritura sobre tablas críticas. Programar en ventanas de baja actividad.
        </div>
        <ul className="divide-y divide-slate-100 border border-slate-100 rounded-md">
          {backups.map((b) => (
            <li key={b.id} className="flex items-center justify-between p-3 text-sm">
              <div>
                <p className="font-medium text-slate-900">{b.date}</p>
                <p className="text-xs text-slate-500">{b.type} · {b.size}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={b.status === 'OK' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}>{b.status}</Badge>
                <Button variant="outline" size="sm" onClick={() => toast({ title: 'Descarga iniciada', description: `Snapshot ${b.id}` })}>
                  <Download className="h-3.5 w-3.5 mr-1.5" /> Descargar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
