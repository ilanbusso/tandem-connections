import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Upload, Trash2, ImageIcon, LayoutGrid, List } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type Category = 'rutinas' | 'emociones' | 'alimentos' | 'higiene' | 'social' | 'escolar';

interface Pictogram {
  id: string;
  name: string;
  category: Category;
  uses: number;
  uploadedBy: string;
  uploadedAt: string;
  emoji: string;
}

const seed: Pictogram[] = [
  { id: 'p1', name: 'Cepillarse los dientes', category: 'higiene', uses: 482, uploadedBy: 'admin@tandem.app', uploadedAt: '2026-05-12', emoji: '🪥' },
  { id: 'p2', name: 'Desayunar', category: 'alimentos', uses: 1240, uploadedBy: 'ana@tandem.app', uploadedAt: '2026-05-10', emoji: '🥣' },
  { id: 'p3', name: 'Feliz', category: 'emociones', uses: 2103, uploadedBy: 'admin@tandem.app', uploadedAt: '2026-04-22', emoji: '😀' },
  { id: 'p4', name: 'Triste', category: 'emociones', uses: 977, uploadedBy: 'admin@tandem.app', uploadedAt: '2026-04-22', emoji: '😢' },
  { id: 'p5', name: 'Ir a la escuela', category: 'escolar', uses: 612, uploadedBy: 'mateo@tandem.app', uploadedAt: '2026-03-18', emoji: '🏫' },
  { id: 'p6', name: 'Lavarse las manos', category: 'higiene', uses: 884, uploadedBy: 'admin@tandem.app', uploadedAt: '2026-03-02', emoji: '🧼' },
  { id: 'p7', name: 'Saludar', category: 'social', uses: 530, uploadedBy: 'sofia@tandem.app', uploadedAt: '2026-02-14', emoji: '👋' },
  { id: 'p8', name: 'Dormir', category: 'rutinas', uses: 1502, uploadedBy: 'admin@tandem.app', uploadedAt: '2026-02-01', emoji: '😴' },
  { id: 'p9', name: 'Almorzar', category: 'alimentos', uses: 1180, uploadedBy: 'ana@tandem.app', uploadedAt: '2026-01-20', emoji: '🍽️' },
  { id: 'p10', name: 'Estudiar', category: 'escolar', uses: 740, uploadedBy: 'mateo@tandem.app', uploadedAt: '2026-01-12', emoji: '📚' },
];

const catLabels: Record<Category, string> = {
  rutinas: 'Rutinas', emociones: 'Emociones', alimentos: 'Alimentos',
  higiene: 'Higiene', social: 'Social', escolar: 'Escolar',
};

export function PictogramManager() {
  const [items, setItems] = useState<Pictogram[]>(seed);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<'all' | Category>('all');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () => items.filter((p) =>
      (cat === 'all' || p.category === cat) &&
      (!q || p.name.toLowerCase().includes(q.toLowerCase()))),
    [items, q, cat],
  );

  return (
    <Card className="bg-white border-slate-100 shadow-sm">
      <div className="p-4 flex flex-col md:flex-row md:items-center gap-3 border-b border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar pictograma..." className="pl-9 bg-slate-50 border-slate-200" />
        </div>
        <Select value={cat} onValueChange={(v) => setCat(v as 'all' | Category)}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {Object.entries(catLabels).map(([k, l]) => (
              <SelectItem key={k} value={k}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-[#C9A7EB] text-purple-900 hover:bg-[#C9A7EB]/80">
              <Upload className="h-4 w-4 mr-1.5" /> Subir nuevo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subir pictograma</DialogTitle>
              <DialogDescription>Agregá un ícono al catálogo global de agendas.</DialogDescription>
            </DialogHeader>
            <UploadForm
              onSubmit={(p) => {
                setItems((arr) => [{ ...p, id: `p${Date.now()}`, uses: 0, uploadedBy: 'admin@tandem.app', uploadedAt: new Date().toISOString().slice(0, 10) }, ...arr]);
                setOpen(false);
                toast({ title: 'Pictograma subido', description: p.name });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="grid" className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-slate-500">{filtered.length} pictogramas</p>
          <TabsList>
            <TabsTrigger value="grid"><LayoutGrid className="h-4 w-4 mr-1.5" /> Galería</TabsTrigger>
            <TabsTrigger value="list"><List className="h-4 w-4 mr-1.5" /> Tabla</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filtered.map((p) => (
              <div key={p.id} className="group border border-slate-100 rounded-lg p-3 bg-slate-50/50 hover:bg-white hover:shadow-sm transition">
                <div className="aspect-square rounded-md bg-white border border-slate-100 flex items-center justify-center text-4xl mb-2">
                  {p.emoji}
                </div>
                <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="secondary" className="text-[10px]">{catLabels[p.category]}</Badge>
                  <span className="text-[11px] text-slate-500">{p.uses}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-slate-500 py-10 flex flex-col items-center gap-2">
                <ImageIcon className="h-8 w-8 text-slate-300" />
                Sin pictogramas para los filtros aplicados.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
                <TableHead>Pictograma</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Usos</TableHead>
                <TableHead>Subido por</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} className="border-slate-100">
                  <TableCell className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-xl">{p.emoji}</div>
                    <span className="font-medium text-slate-900">{p.name}</span>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{catLabels[p.category]}</Badge></TableCell>
                  <TableCell className="text-slate-700">{p.uses.toLocaleString('es-AR')}</TableCell>
                  <TableCell className="text-slate-600">{p.uploadedBy}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">{p.uploadedAt}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-rose-600"
                      onClick={() => {
                        setItems((arr) => arr.filter((x) => x.id !== p.id));
                        toast({ title: 'Pictograma eliminado', description: p.name });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function UploadForm({ onSubmit }: { onSubmit: (p: { name: string; category: Category; emoji: string }) => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('rutinas');
  const [emoji, setEmoji] = useState('🖼️');

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit({ name: name.trim(), category, emoji });
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="pic-file">Archivo</Label>
        <Input id="pic-file" type="file" accept="image/*" />
        <p className="text-xs text-slate-500">PNG o SVG, máx 1MB. Recomendado 512×512.</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="pic-name">Nombre</Label>
        <Input id="pic-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Cepillarse los dientes" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Categoría</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(catLabels).map(([k, l]) => (
                <SelectItem key={k} value={k}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pic-emoji">Emoji preview</Label>
          <Input id="pic-emoji" value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={2} />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-[#C9A7EB] text-purple-900 hover:bg-[#C9A7EB]/80">
          <Upload className="h-4 w-4 mr-1.5" /> Subir
        </Button>
      </DialogFooter>
    </form>
  );
}
