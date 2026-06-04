import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MoreHorizontal, ChevronLeft, ChevronRight, UserCog, KeyRound, ShieldOff, Eye, LogIn, Download } from 'lucide-react';
import { StatusPill } from './StatusPill';
import { exportRowsToCSV } from '../utils/exportCsv';
import { UserEditDialog } from './UserEditDialog';
import { toast } from '@/hooks/use-toast';

export interface RowData {
  id: string;
  name: string;
  email: string;
  status: 'Activo' | 'Suspendido' | 'Pendiente';
  meta: string; // e.g. plan, specialty, relation, city
  metaLabel: string;
}

interface Props {
  rows: RowData[];
  metaColumnLabel: string;
  onImpersonate?: (id: string) => void;
  exportFilename?: string;
}

export function UsersTable({ rows, metaColumnLabel, onImpersonate, exportFilename = 'usuarios.csv' }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editing, setEditing] = useState<RowData | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.meta.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const variantFor = (s: RowData['status']) =>
    s === 'Activo' ? 'success' : s === 'Suspendido' ? 'danger' : 'warning';

  const handleAction = (label: string, row: RowData) => {
    toast({ title: label, description: `${label} aplicado a ${row.name}` });
  };

  return (
    <Card className="bg-white border-slate-100 shadow-sm">
      <div className="p-4 flex flex-col md:flex-row md:items-center gap-3 border-b border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por nombre, email o atributo..."
            className="pl-9 bg-slate-50 border-slate-200"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Estado" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Suspendido">Suspendido</SelectItem>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            exportRowsToCSV(
              filtered,
              exportFilename,
              [
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Nombre' },
                { key: 'email', label: 'Email' },
                { key: 'meta', label: metaColumnLabel },
                { key: 'status', label: 'Estado' },
              ],
            );
            toast({ title: 'Exportación CSV', description: `${filtered.length} filas exportadas.` });
          }}
        >
          <Download className="h-4 w-4 mr-1.5" /> Exportar CSV
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
            <TableHead>Usuario</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>{metaColumnLabel}</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-16 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageRows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-slate-500 py-10">
                Sin resultados para los filtros aplicados.
              </TableCell>
            </TableRow>
          )}
          {pageRows.map((r) => (
            <TableRow key={r.id} className="border-slate-100">
              <TableCell className="font-medium text-slate-900">{r.name}</TableCell>
              <TableCell className="text-slate-600">{r.email}</TableCell>
              <TableCell className="text-slate-600">{r.meta}</TableCell>
              <TableCell><StatusPill variant={variantFor(r.status)}>{r.status}</StatusPill></TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem onClick={() => handleAction('Ver perfil clínico', r)}>
                      <Eye className="mr-2 h-4 w-4" /> Ver perfil clínico
                    </DropdownMenuItem>
                    {onImpersonate && (
                      <DropdownMenuItem onClick={() => onImpersonate(r.id)}>
                        <LogIn className="mr-2 h-4 w-4" /> Ingresar como...
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => setEditing(r)}>
                      <UserCog className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('Reset de contraseña', r)}>
                      <KeyRound className="mr-2 h-4 w-4" /> Resetear contraseña
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleAction('Suspender cuenta', r)}
                      className="text-rose-600 focus:text-rose-700"
                    >
                      <ShieldOff className="mr-2 h-4 w-4" /> Suspender cuenta
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between p-4 border-t border-slate-100 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span>Filas por página</span>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
            <SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="ml-3">{filtered.length} resultados</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>Página {safePage} de {totalPages}</span>
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <UserEditDialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)} row={editing} />
    </Card>
  );
}
