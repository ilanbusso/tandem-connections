import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ToggleLeft, MessageCircle, ShoppingBag, Gamepad2, Award, Sparkles, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Flag { id: string; label: string; desc: string; Icon: typeof MessageCircle; enabled: boolean; }

const initialFlags: Flag[] = [
  { id: 'chat',       label: 'Chat',         desc: 'Mensajería tutor / profesional',      Icon: MessageCircle, enabled: true  },
  { id: 'shop',       label: 'Tienda',       desc: 'Canje de puntos por recompensas',     Icon: ShoppingBag,   enabled: true  },
  { id: 'minigames',  label: 'Minijuegos',   desc: 'Actividades gamificadas',             Icon: Gamepad2,      enabled: true  },
  { id: 'rewards',    label: 'Logros',       desc: 'Sistema de medallas y achievements',  Icon: Award,         enabled: true  },
  { id: 'ai',         label: 'Asistente IA', desc: 'Sugerencias y autopilot',             Icon: Sparkles,      enabled: false },
  { id: 'resources',  label: 'Recursos',     desc: 'Biblioteca educativa',                Icon: BookOpen,      enabled: true  },
];

export function FeatureFlagsCard() {
  const [flags, setFlags] = useState<Flag[]>(initialFlags);

  const toggle = (id: string) => {
    setFlags((prev) => prev.map((f) => {
      if (f.id !== id) return f;
      const next = { ...f, enabled: !f.enabled };
      toast({ title: `${next.label} ${next.enabled ? 'activado' : 'desactivado'}`, description: 'Cambio aplicado en tiempo real.' });
      return next;
    }));
  };

  return (
    <Card className="bg-white border-slate-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <ToggleLeft className="h-4 w-4 text-[#C9A7EB]" />
        <h3 className="text-sm font-semibold text-slate-900">Módulos de Tándem (Feature Flags)</h3>
      </div>
      <p className="text-xs text-slate-500 mb-4">Activa o desactiva módulos para toda la plataforma sin desplegar.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {flags.map((f) => (
          <div key={f.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="h-8 w-8 rounded-md bg-slate-50 flex items-center justify-center shrink-0">
                <f.Icon className="h-4 w-4 text-slate-600" />
              </div>
              <div className="min-w-0">
                <Label className="text-sm font-medium text-slate-900">{f.label}</Label>
                <p className="text-xs text-slate-500 truncate">{f.desc}</p>
              </div>
            </div>
            <Switch checked={f.enabled} onCheckedChange={() => toggle(f.id)} />
          </div>
        ))}
      </div>
    </Card>
  );
}
