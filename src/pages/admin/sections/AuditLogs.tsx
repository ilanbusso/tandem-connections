import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusPill } from '../components/StatusPill';
import { Search, Download } from 'lucide-react';
import { exportRowsToCSV } from '../utils/exportCsv';
import { toast } from '@/hooks/use-toast';

interface AuditLog {
  id: string; actor: string; action: string; entity: string; targetId: string;
  severity: 'info' | 'warning' | 'critical'; timestamp: string;
}

const seed: AuditLog[] = [
  { id: 'a1', actor: 'admin@tandem.app', action: 'USER_SUSPEND',        entity: 'Usuario',        targetId: 'u12', severity: 'critical', timestamp: '2026-06-04 10:22:14' },
  { id: 'a2', actor: 'admin@tandem.app', action: 'PASSWORD_RESET',      entity: 'Usuario',        targetId: 'u07', severity: 'warning',  timestamp: '2026-06-04 09:58:01' },
  { id: 'a3', actor: 'ana@tandem.app',   action: 'FEATURE_FLAG_TOGGLE', entity: 'Sistema',        targetId: 'chat', severity: 'info',     timestamp: '2026-06-04 09:30:42' },
  { id: 'a4', actor: 'admin@tandem.app', action: 'BROADCAST_SENT',      entity: 'Notificación',   targetId: 'all', severity: 'info',     timestamp: '2026-06-03 18:11:09' },
  { id: 'a5', actor: 'mateo@tandem.app', action: 'IMPERSONATE',         entity: 'Usuario',        targetId: 'u03', severity: 'warning',  timestamp: '2026-06-03 16:44:22' },
  { id: 'a6', actor: 'admin@tandem.app', action: 'MAINTENANCE_ON',      entity: 'Sistema',        targetId: '-',   severity: 'critical', timestamp: '2026-06-03 15:00:00' },
  { id: 'a7', actor: 'admin@tandem.app', action: 'INSTITUTION_CREATE',  entity: 'Institución',    targetId: 'i09', severity: 'info',     timestamp: '2026-06-03 12:21:31' },
  { id: 'a8', actor: 'sofia@tandem.app', action: 'USER_EDIT',           entity: 'Usuario',        targetId: 'u22', severity: 'info',     timestamp: '2026-06-02 19:05:18' },
];

export function AuditLogs() {
  const [q, setQ] = useState('');
  const [sev, setSev] = useState('all');

  const rows = useMemo(
    () => seed.filter((r) =>
      (sev === 'all' || r.severity === sev) &&
      (!q || `${r.actor} ${r.action} ${r.entity} ${r.targetId}`.toLowerCase().includes(q.toLowerCase()))),
    [q, sev],
  );

  const variant = (s: AuditLog['severity']) => s === 'critical' ? 'danger' : s === 'warning' ? 'warning' : 'info';

  return (
    <Card className="bg-white border-slate-100 shadow-sm">
      <div className="p-4 flex flex-col md:flex-row md:items-center gap-3 border-b border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por actor, acción, entidad..." className="pl-9 bg-slate-50 border-slate-200" />
        </div>
        <Select value={sev} onValueChange={setSev}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las severidades</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            exportRowsToCSV(rows, 'audit_logs.csv', [
              { key: 'timestamp', label: 'Fecha' },
              { key: 'actor', label: 'Actor' },
              { key: 'action', label: 'Acción' },
              { key: 'entity', label: 'Entidad' },
              { key: 'targetId', label: 'Target' },
              { key: 'severity', label: 'Severidad' },
            ]);
            toast({ title: 'Audit logs exportados', description: `${rows.length} filas.` });
          }}
        >
          <Download className="h-4 w-4 mr-1.5" /> Exportar CSV
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
            <TableHead>Fecha</TableHead>
            <TableHead>Actor</TableHead>
            <TableHead>Acción</TableHead>
            <TableHead>Entidad</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Severidad</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-10">Sin eventos.</TableCell></TableRow>
          )}
          {rows.map((r) => (
            <TableRow key={r.id} className="border-slate-100">
              <TableCell className="font-mono text-xs text-slate-500">{r.timestamp}</TableCell>
              <TableCell className="text-slate-800">{r.actor}</TableCell>
              <TableCell className="font-medium text-slate-900">{r.action}</TableCell>
              <TableCell className="text-slate-600">{r.entity}</TableCell>
              <TableCell className="font-mono text-xs text-slate-500">{r.targetId}</TableCell>
              <TableCell><StatusPill variant={variant(r.severity)}>{r.severity}</StatusPill></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
