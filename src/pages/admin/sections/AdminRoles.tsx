import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { UserPlus, Trash2, ShieldCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type AdminRole = 'SuperAdmin' | 'Soporte' | 'Moderador';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: 'Activo' | 'Pendiente';
  lastActive: string;
}

const initial: StaffMember[] = [
  { id: 's1', name: 'Lucía Fernández', email: 'lucia@tandem.app', role: 'SuperAdmin', status: 'Activo', lastActive: 'hace 2 min' },
  { id: 's2', name: 'Mariano Díaz', email: 'mariano@tandem.app', role: 'Soporte', status: 'Activo', lastActive: 'hace 1 h' },
  { id: 's3', name: 'Paula Romero', email: 'paula@tandem.app', role: 'Moderador', status: 'Activo', lastActive: 'hace 3 h' },
  { id: 's4', name: 'Esteban Núñez', email: 'esteban@tandem.app', role: 'Soporte', status: 'Pendiente', lastActive: '—' },
  { id: 's5', name: 'Camila Bravo', email: 'camila@tandem.app', role: 'Moderador', status: 'Activo', lastActive: 'ayer' },
];

const roleBadge: Record<AdminRole, string> = {
  SuperAdmin: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
  Soporte: 'bg-sky-100 text-sky-700 hover:bg-sky-100',
  Moderador: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
};

export function AdminRoles() {
  const [members, setMembers] = useState<StaffMember[]>(initial);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<AdminRole>('Soporte');

  const handleInvite = () => {
    if (!email.includes('@')) {
      toast({ title: 'Email inválido', variant: 'destructive' });
      return;
    }
    const id = `s${Date.now()}`;
    setMembers((m) => [
      ...m,
      { id, name: name || email.split('@')[0], email, role, status: 'Pendiente', lastActive: '—' },
    ]);
    toast({ title: 'Invitación enviada', description: `${email} fue invitado como ${role}.` });
    setOpen(false);
    setEmail(''); setName(''); setRole('Soporte');
  };

  const handleRemove = (id: string) => {
    setMembers((m) => m.filter((x) => x.id !== id));
    toast({ title: 'Miembro eliminado' });
  };

  return (
    <Card className="bg-white border-slate-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-purple-700" /> Gestión de roles administrativos
          </CardTitle>
          <CardDescription>Staff con acceso al Backoffice de Tándem.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><UserPlus className="h-4 w-4 mr-1.5" /> Invitar miembro</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invitar nuevo miembro</DialogTitle>
              <DialogDescription>Se enviará un email con instrucciones de acceso.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label htmlFor="inv-name">Nombre (opcional)</Label>
                <Input id="inv-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Juana Pérez" />
              </div>
              <div>
                <Label htmlFor="inv-email">Email</Label>
                <Input id="inv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="staff@tandem.app" />
              </div>
              <div>
                <Label>Rol</Label>
                <Select value={role} onValueChange={(v) => setRole(v as AdminRole)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                    <SelectItem value="Soporte">Soporte</SelectItem>
                    <SelectItem value="Moderador">Moderador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleInvite}>Enviar invitación</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última actividad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id} className="border-slate-100">
                  <TableCell className="font-medium text-slate-900">{m.name}</TableCell>
                  <TableCell className="text-slate-600">{m.email}</TableCell>
                  <TableCell><Badge className={roleBadge[m.role]}>{m.role}</Badge></TableCell>
                  <TableCell>
                    <Badge
                      className={m.status === 'Activo'
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}
                    >{m.status}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">{m.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-rose-600 hover:text-rose-700"
                      onClick={() => handleRemove(m.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
