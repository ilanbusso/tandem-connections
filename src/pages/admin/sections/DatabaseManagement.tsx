import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersTable, type RowData } from '../components/UsersTable';
import { users, tutors, professionals } from '@/data/repo';
import { institutions } from '../data/adminMock';

function deriveStatus(seed: string): RowData['status'] {
  const h = seed.charCodeAt(seed.length - 1) % 10;
  if (h < 7) return 'Activo';
  if (h < 9) return 'Pendiente';
  return 'Suspendido';
}

export function DatabaseManagement() {
  const pertRows: RowData[] = useMemo(
    () => users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      status: deriveStatus(u.id),
      meta: u.plan === 'premium' ? 'Premium' : 'Free',
      metaLabel: 'Plan',
    })),
    [],
  );

  const tutorRows: RowData[] = useMemo(
    () => tutors.map((t) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      status: deriveStatus(t.id),
      meta: `${t.relation} · ${t.linkedUserIds.length} vinc.`,
      metaLabel: 'Relación',
    })),
    [],
  );

  const profRows: RowData[] = useMemo(
    () => professionals.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      status: deriveStatus(p.id),
      meta: p.specialty,
      metaLabel: 'Especialidad',
    })),
    [],
  );

  const instRows: RowData[] = useMemo(
    () => institutions.map((i) => ({
      id: i.id,
      name: i.name,
      email: i.contactEmail,
      status: i.status,
      meta: `${i.city} · ${i.licenses} licencias · ${i.plan}`,
      metaLabel: 'Ubicación / Plan',
    })),
    [],
  );

  return (
    <Tabs defaultValue="pert" className="space-y-4">
      <TabsList className="bg-white border border-slate-200">
        <TabsTrigger value="pert">Pertenecientes ({pertRows.length})</TabsTrigger>
        <TabsTrigger value="tut">Tutores ({tutorRows.length})</TabsTrigger>
        <TabsTrigger value="prof">Profesionales ({profRows.length})</TabsTrigger>
        <TabsTrigger value="inst">Instituciones ({instRows.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="pert"><UsersTable rows={pertRows} metaColumnLabel="Plan" /></TabsContent>
      <TabsContent value="tut"><UsersTable rows={tutorRows} metaColumnLabel="Relación" /></TabsContent>
      <TabsContent value="prof"><UsersTable rows={profRows} metaColumnLabel="Especialidad" /></TabsContent>
      <TabsContent value="inst"><UsersTable rows={instRows} metaColumnLabel="Ubicación / Plan" /></TabsContent>
    </Tabs>
  );
}
