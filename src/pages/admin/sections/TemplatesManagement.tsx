import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, GripVertical, Save, LayoutTemplate } from 'lucide-react';
import { pictograms } from '@/data/repo';
import { toast } from '@/hooks/use-toast';

interface Template { id: string; name: string; steps: { id: string; label: string }[]; }

const seed: Template[] = [
  { id: 't1', name: 'Mañana en casa', steps: [
    { id: 's1', label: 'Despertar' }, { id: 's2', label: 'Lavarse los dientes' },
    { id: 's3', label: 'Vestirse' }, { id: 's4', label: 'Desayunar' },
  ] },
  { id: 't2', name: 'Llegada al colegio', steps: [
    { id: 's1', label: 'Saludar al profe' }, { id: 's2', label: 'Guardar mochila' },
    { id: 's3', label: 'Sentarse en su lugar' },
  ] },
];

export function TemplatesManagement() {
  const [templates, setTemplates] = useState<Template[]>(seed);
  const [selectedId, setSelectedId] = useState<string>(seed[0].id);
  const [search, setSearch] = useState('');
  const selected = templates.find((t) => t.id === selectedId);

  const palette = useMemo(
    () => pictograms
      .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 24),
    [search],
  );

  const addStep = (label: string) => {
    if (!selected) return;
    setTemplates((prev) => prev.map((t) =>
      t.id !== selected.id ? t : { ...t, steps: [...t.steps, { id: `s${Date.now()}`, label }] }));
  };
  const removeStep = (sid: string) => {
    if (!selected) return;
    setTemplates((prev) => prev.map((t) =>
      t.id !== selected.id ? t : { ...t, steps: t.steps.filter((s) => s.id !== sid) }));
  };
  const createTemplate = () => {
    const id = `t${Date.now()}`;
    setTemplates((p) => [...p, { id, name: 'Nueva plantilla', steps: [] }]);
    setSelectedId(id);
  };
  const renameSelected = (name: string) => {
    if (!selected) return;
    setTemplates((p) => p.map((t) => (t.id === selected.id ? { ...t, name } : t)));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <Card className="bg-white border-slate-100 shadow-sm p-4 lg:col-span-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4 text-[#C9A7EB]" />
            <h3 className="text-sm font-semibold text-slate-900">Plantillas</h3>
          </div>
          <Button size="sm" variant="outline" onClick={createTemplate}><Plus className="h-4 w-4" /></Button>
        </div>
        <ul className="space-y-1">
          {templates.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => setSelectedId(t.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  selectedId === t.id ? 'bg-[#C9A7EB]/20 text-purple-900' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                {t.name}
                <span className="ml-2 text-xs text-slate-400">{t.steps.length} pasos</span>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="bg-white border-slate-100 shadow-sm p-4 lg:col-span-5">
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-slate-500">Nombre de la plantilla</Label>
            <Input value={selected?.name ?? ''} onChange={(e) => renameSelected(e.target.value)} />
          </div>
          <div className="border-t border-slate-100 pt-3">
            <p className="text-sm font-medium text-slate-900 mb-2">Pasos</p>
            {selected?.steps.length === 0 && (
              <p className="text-xs text-slate-500 py-6 text-center">Agrega pictogramas desde la derecha.</p>
            )}
            <ul className="space-y-2">
              {selected?.steps.map((s, i) => (
                <li key={s.id} className="flex items-center gap-2 rounded-md border border-slate-200 px-2 py-1.5 bg-slate-50/50">
                  <GripVertical className="h-4 w-4 text-slate-300" />
                  <span className="text-xs text-slate-400 w-5">{i + 1}.</span>
                  <span className="flex-1 text-sm text-slate-800">{s.label}</span>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeStep(s.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast({ title: 'Plantilla guardada', description: selected?.name })}>
              <Save className="h-4 w-4 mr-1.5" /> Guardar
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-white border-slate-100 shadow-sm p-4 lg:col-span-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Biblioteca de pictogramas</h3>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="mb-3" />
        <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
          {palette.map((p) => (
            <button
              key={p.id}
              onClick={() => addStep(p.word)}
              className="flex flex-col items-center gap-1 rounded-md border border-slate-200 p-2 hover:bg-slate-50"
            >
              <span className="text-2xl">{p.emoji ?? '🟦'}</span>
              <Badge variant="secondary" className="text-[10px]">{p.word}</Badge>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
