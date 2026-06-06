import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Download } from 'lucide-react';
import { exportRowsToCSV } from '../utils/exportCsv';
import { toast } from '@/hooks/use-toast';

type Status = 'pendiente' | 'en_progreso' | 'resuelto' | 'cerrado';
type Priority = 'baja' | 'media' | 'alta';

interface Ticket {
  id: string;
  user: string;
  role: 'Perteneciente' | 'Tutor' | 'Profesional';
  subject: string;
  priority: Priority;
  status: Status;
  createdAt: string;
}

const seed: Ticket[] = [
  { id: 'T-1042', user: 'juan.perez@gmail.com', role: 'Perteneciente', subject: 'No carga la agenda visual', priority: 'alta', status: 'pendiente', createdAt: '2026-06-05 14:21' },
  { id: 'T-1041', user: 'maria.tutor@gmail.com', role: 'Tutor', subject: 'Error al sincronizar emociones', priority: 'media', status: 'en_progreso', createdAt: '2026-06-05 11:08' },
  { id: 'T-1040', user: 'dr.lopez@clinica.org', role: 'Profesional', subject: 'No puedo exportar informe PDF', priority: 'alta', status: 'pendiente', createdAt: '2026-06-04 19:55' },
  { id: 'T-1039', user: 'lucas.t@gmail.com', role: 'Perteneciente', subject: 'Audio del pictograma no suena', priority: 'baja', status: 'resuelto', createdAt: '2026-06-04 16:40' },
  { id: 'T-1038', user: 'sofia.tutor@gmail.com', role: 'Tutor', subject: 'Cómo asignar tarea recurrente', priority: 'baja', status: 'cerrado', createdAt: '2026-06-04 10:12' },
  { id: 'T-1037', user: 'admin@escuela.edu', role: 'Profesional', subject: 'Pedido de alta institucional', priority: 'media', status: 'en_progreso', createdAt: '2026-06-03 18:00' },
  { id: 'T-1036', user: 'paula.p@gmail.com', role: 'Perteneciente', subject: 'Quiero borrar mi cuenta', priority: 'media', status: 'pendiente', createdAt: '2026-06-03 09:31' },
  { id: 'T-1035', user: 'mariano.t@gmail.com', role: 'Tutor', subject: 'Pago duplicado en suscripción', priority: 'alta', status: 'resuelto', createdAt: '2026-06-02 22:14' },
];

const statusMeta: Record<Status, { label: string; cls: string }> = {
  pendiente:    { label: 'Pendiente',    cls: 'bg-amber-100 text-amber-800 hover:bg-amber-100' },
  en_progreso:  { label: 'En progreso',  cls: 'bg-sky-100 text-sky-800 hover:bg-sky-100' },
  resuelto:     { label: 'Resuelto',     cls: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' },
  cerrado:      { label: 'Cerrado',      cls: 'bg-slate-200 text-slate-700 hover:bg-slate-200' },
};

const priorityMeta: Record<Priority, string> = {
  baja: 'bg-slate-100 text-slate-700',
  media: 'bg-amber-100 text-amber-800',
  alta: 'bg-rose-100 text-rose-800',
};

export function SupportTickets() {
  const [items, setItems] = useState<Ticket[]>(seed);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | Status>('all');

  const rows = useMemo(
    () => items.filter((t) =>
      (filter === 'all' || t.status === filter) &&
      (!q || `${t.id} ${t.user} ${t.subject}`.toLowerCase().includes(q.toLowerCase()))),
    [items, q, filter],
  );

  const changeStatus = (id: string, status: Status) => {
    setItems((arr) => arr.map((t) => (t.id === id ? { ...t, status } : t)));
    toast({ title: `Ticket ${id}`, description: `Estado actualizado a "${statusMeta[status].label}".` });
  };

  return (
    <Card className="bg-white border-slate-100 shadow-sm">
      <div className="p-4 flex flex-col md:flex-row md:items-center gap-3 border-b border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar ticket, usuario o asunto..." className="pl-9 bg-slate-50 border-slate-200" />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as 'all' | Status)}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="en_progreso">En progreso</SelectItem>
            <SelectItem value="resuelto">Resuelto</SelectItem>
            <SelectItem value="cerrado">Cerrado</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            exportRowsToCSV(rows, 'support_tickets.csv', [
              { key: 'id', label: 'ID' },
              { key: 'createdAt', label: 'Fecha' },
              { key: 'user', label: 'Usuario' },
              { key: 'role', label: 'Rol' },
              { key: 'subject', label: 'Asunto' },
              { key: 'priority', label: 'Prioridad' },
              { key: 'status', label: 'Estado' },
            ]);
            toast({ title: 'Tickets exportados', description: `${rows.length} filas.` });
          }}
        >
          <Download className="h-4 w-4 mr-1.5" /> Exportar CSV
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
            <TableHead>ID</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Asunto</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow><TableCell colSpan={8} className="text-center text-slate-500 py-10">Sin tickets.</TableCell></TableRow>
          )}
          {rows.map((t) => (
            <TableRow key={t.id} className="border-slate-100">
              <TableCell className="font-mono text-xs text-slate-700">{t.id}</TableCell>
              <TableCell className="font-mono text-xs text-slate-500">{t.createdAt}</TableCell>
              <TableCell className="text-slate-800">{t.user}</TableCell>
              <TableCell><Badge variant="secondary">{t.role}</Badge></TableCell>
              <TableCell className="font-medium text-slate-900 max-w-xs truncate">{t.subject}</TableCell>
              <TableCell><Badge className={priorityMeta[t.priority]}>{t.priority}</Badge></TableCell>
              <TableCell><Badge className={statusMeta[t.status].cls}>{statusMeta[t.status].label}</Badge></TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(Object.keys(statusMeta) as Status[]).map((s) => (
                      <DropdownMenuItem key={s} onClick={() => changeStatus(t.id, s)} disabled={s === t.status}>
                        {statusMeta[s].label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
