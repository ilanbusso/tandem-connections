import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Megaphone, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function BroadcastDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all');

  const send = () => {
    if (!title.trim() || !message.trim()) {
      toast({ title: 'Faltan datos', description: 'Título y mensaje son obligatorios.', variant: 'destructive' });
      return;
    }
    const targetLabel = {
      all: 'Todos los usuarios', users: 'Pertenecientes',
      professionals: 'Profesionales', tutors: 'Tutores',
    }[target] ?? target;
    toast({ title: 'Anuncio enviado', description: `"${title}" → ${targetLabel}` });
    setTitle(''); setMessage(''); setTarget('all'); setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Megaphone className="h-4 w-4 text-[#C9A7EB]" />
          <span className="hidden sm:inline">Anuncio</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Enviar anuncio global</DialogTitle>
          <DialogDescription>Notificación masiva enviada en tiempo real a los segmentos seleccionados.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="bc-target">Destino</Label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger id="bc-target"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="users">Pertenecientes</SelectItem>
                <SelectItem value="professionals">Profesionales</SelectItem>
                <SelectItem value="tutors">Tutores</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bc-title">Título</Label>
            <Input id="bc-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mantenimiento programado..." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bc-msg">Mensaje</Label>
            <Textarea id="bc-msg" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Detalles del anuncio..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={send} className="bg-[#C9A7EB] text-purple-900 hover:bg-[#C9A7EB]/80">
            <Send className="h-4 w-4 mr-1.5" /> Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
