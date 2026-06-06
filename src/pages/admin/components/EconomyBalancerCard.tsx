import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Save, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EconomyVars {
  coinsPerTask: number;
  bonusStreak: number;
  shopAvgCost: number;
  dailyCap: number;
  premiumMultiplier: number;
}

const defaults: EconomyVars = {
  coinsPerTask: 10,
  bonusStreak: 5,
  shopAvgCost: 80,
  dailyCap: 200,
  premiumMultiplier: 1.5,
};

export function EconomyBalancerCard() {
  const [vars, setVars] = useState<EconomyVars>(defaults);

  const set = <K extends keyof EconomyVars>(k: K, v: EconomyVars[K]) =>
    setVars((s) => ({ ...s, [k]: v }));

  return (
    <Card className="bg-white border-slate-100 shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="h-8 w-8 rounded-lg bg-[#F8E787]/40 flex items-center justify-center">
                <Coins className="h-4 w-4 text-amber-700" />
              </span>
              Balanceador de economía
            </CardTitle>
            <CardDescription>Ajustes globales de la economía in-app (monedas, tienda, bonus).</CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">Global</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <SliderRow
          label="Monedas por tarea base"
          hint="Recompensa estándar al completar una actividad."
          value={vars.coinsPerTask} min={1} max={50} step={1}
          onChange={(v) => set('coinsPerTask', v)}
        />
        <SliderRow
          label="Bonus por racha diaria"
          hint="Monedas extra al mantener la racha de uso."
          value={vars.bonusStreak} min={0} max={30} step={1}
          onChange={(v) => set('bonusStreak', v)}
        />
        <SliderRow
          label="Costo promedio en tienda"
          hint="Promedio recomendado para items de canje."
          value={vars.shopAvgCost} min={10} max={500} step={5}
          onChange={(v) => set('shopAvgCost', v)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="dailyCap">Tope diario de monedas</Label>
            <Input id="dailyCap" type="number" min={0} value={vars.dailyCap} onChange={(e) => set('dailyCap', Number(e.target.value))} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prem">Multiplicador Premium (×)</Label>
            <Input id="prem" type="number" step={0.1} min={1} value={vars.premiumMultiplier} onChange={(e) => set('premiumMultiplier', Number(e.target.value))} />
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 text-xs text-slate-600">
          <p><span className="font-semibold text-slate-800">Simulación:</span> un Perteneciente Premium que completa 5 tareas y mantiene racha gana{' '}
            <span className="font-mono font-semibold text-purple-700">
              {Math.round((vars.coinsPerTask * 5 + vars.bonusStreak) * vars.premiumMultiplier)}
            </span>{' '}
            monedas hoy (tope {vars.dailyCap}).
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setVars(defaults);
              toast({ title: 'Valores restaurados', description: 'Se aplicaron los defaults de la economía.' });
            }}
          >
            <RotateCcw className="h-4 w-4 mr-1.5" /> Restaurar
          </Button>
          <Button
            size="sm"
            className="bg-[#C9A7EB] text-purple-900 hover:bg-[#C9A7EB]/80"
            onClick={() => toast({ title: 'Economía actualizada', description: 'Los nuevos valores se aplicarán en el próximo ciclo.' })}
          >
            <Save className="h-4 w-4 mr-1.5" /> Guardar cambios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SliderRow({
  label, hint, value, min, max, step, onChange,
}: { label: string; hint: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm">{label}</Label>
          <p className="text-xs text-slate-500">{hint}</p>
        </div>
        <span className="font-mono text-sm font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">{value}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} />
    </div>
  );
}
