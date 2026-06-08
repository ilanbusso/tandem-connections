import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, DollarSign, Users, TrendingUp, AlertTriangle, Pencil } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { users, tutors, professionals } from '@/data/repo';
import { KpiCard } from '../components/KpiCard';

type Plan = 'Free' | 'Premium' | 'Expirado';

interface BillingRow {
  id: string;
  name: string;
  email: string;
  role: 'Usuario' | 'Tutor' | 'Profesional';
  plan: Plan;
  amount: number;
  renews: string;
}

function buildRows(): BillingRow[] {
  const rows: BillingRow[] = [];
  users.forEach((u, i) => rows.push({
    id: u.id, name: u.name, email: u.email, role: 'Usuario',
    plan: u.plan === 'premium' ? 'Premium' : (i % 7 === 0 ? 'Expirado' : 'Free'),
    amount: u.plan === 'premium' ? 9.99 : 0,
    renews: `2026-${String(((i % 12) + 1)).padStart(2, '0')}-${String(((i % 27) + 1)).padStart(2, '0')}`,
  }));
  tutors.forEach((t, i) => rows.push({
    id: t.id, name: t.name, email: t.email, role: 'Tutor',
    plan: i % 3 === 0 ? 'Premium' : 'Free',
    amount: i % 3 === 0 ? 14.99 : 0,
    renews: `2026-${String(((i % 12) + 1)).padStart(2, '0')}-15`,
  }));
  professionals.forEach((p, i) => rows.push({
    id: p.id, name: p.name, email: p.email, role: 'Profesional',
    plan: i % 4 === 2 ? 'Expirado' : 'Premium',
    amount: 29.99,
    renews: `2026-${String(((i % 12) + 1)).padStart(2, '0')}-01`,
  }));
  return rows;
}

const planBadge = (p: Plan) => {
  if (p === 'Premium') return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
  if (p === 'Expirado') return 'bg-rose-100 text-rose-700 hover:bg-rose-100';
  return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
};

export function SubscriptionManager() {
  const rows = useMemo(buildRows, []);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [editing, setEditing] = useState<BillingRow | null>(null);
  const [newPlan, setNewPlan] = useState<Plan>('Premium');

  const filtered = rows.filter((r) => {
    const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = planFilter === 'all' || r.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const premium = rows.filter((r) => r.plan === 'Premium');
  const mrr = premium.reduce((acc, r) => acc + r.amount, 0);
  const churnRisk = rows.filter((r) => r.plan === 'Expirado').length;

  const handleSavePlan = () => {
    if (!editing) return;
    toast({ title: 'Plan actualizado', description: `${editing.name} → ${newPlan}` });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard icon={Users} label="Suscriptores activos" value={premium.length.toLocaleString('es-AR')} delta={+8.4} accent="celeste" />
        <KpiCard icon={DollarSign} label="MRR estimado" value={`$ ${mrr.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`} delta={+12.1} accent="lila" />
        <KpiCard icon={TrendingUp} label="ARPU" value={`$ ${(mrr / Math.max(1, premium.length)).toFixed(2)}`} delta={+3.6} accent="amarillo" />
        <KpiCard icon={AlertTriangle} label="En riesgo / expirados" value={String(churnRisk)} delta={-4.2} accent="rojo" />
      </div>


      <Card className="bg-white border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Estado de facturación</CardTitle>
          <CardDescription>Listado consolidado de planes activos por usuario.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="pl-9 bg-slate-50 border-slate-200"
              />
            </div>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los planes</SelectItem>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Expirado">Expirado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-slate-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Importe / mes</TableHead>
                  <TableHead>Próxima renovación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 50).map((r) => (
                  <TableRow key={r.id} className="border-slate-100">
                    <TableCell>
                      <div className="font-medium text-slate-900">{r.name}</div>
                      <div className="text-xs text-slate-500">{r.email}</div>
                    </TableCell>
                    <TableCell className="text-slate-600">{r.role}</TableCell>
                    <TableCell><Badge className={planBadge(r.plan)}>{r.plan}</Badge></TableCell>
                    <TableCell className="text-slate-600">$ {r.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-slate-600">{r.renews}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setEditing(r); setNewPlan(r.plan); }}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1.5" /> Modificar plan
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-10">Sin resultados.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {filtered.length > 50 && (
            <p className="text-xs text-slate-500">Mostrando 50 de {filtered.length} filas.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modificar plan</DialogTitle>
            <DialogDescription>
              {editing ? `${editing.name} (${editing.email})` : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Nuevo plan</Label>
            <Select value={newPlan} onValueChange={(v) => setNewPlan(v as Plan)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Expirado">Expirado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button onClick={handleSavePlan}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
