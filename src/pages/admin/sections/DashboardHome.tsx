import { useMemo, useState } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Users, DollarSign, AlertOctagon, UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { ensureCharts, brand } from '../components/charts-setup';
import {
  getKpis, getGrowthData, getRoleDistribution, getRoutineCompletion, getSessionsByEco,
  type Range, type Eco,
} from '../data/adminMock';

ensureCharts();

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 10, boxHeight: 10, padding: 12 } } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
    y: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8' }, beginAtZero: true },
  },
};

export function DashboardHome() {
  const [range, setRange] = useState<Range>('7d');
  const [eco, setEco] = useState<Eco>('all');

  const kpis = useMemo(() => getKpis(range), [range]);
  const growth = useMemo(() => getGrowthData(range, eco), [range, eco]);
  const roles = useMemo(() => getRoleDistribution(), []);
  const routines = useMemo(() => getRoutineCompletion(range), [range]);
  const sessions = useMemo(() => getSessionsByEco(range), [range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-700">Filtros:</span>
        <Select value={range} onValueChange={(v) => setRange(v as Range)}>
          <SelectTrigger className="w-44 bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
            <SelectItem value="month">Mes actual</SelectItem>
            <SelectItem value="year">Año</SelectItem>
          </SelectContent>
        </Select>
        <Select value={eco} onValueChange={(v) => setEco(v as Eco)}>
          <SelectTrigger className="w-44 bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los ecosistemas</SelectItem>
            <SelectItem value="b2c">Solo B2C</SelectItem>
            <SelectItem value="b2b">Solo B2B</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Usuarios activos" value={kpis.activeUsers.value.toLocaleString('es-AR')} delta={kpis.activeUsers.delta} icon={Users} accent="celeste" />
        <KpiCard label="Ingresos B2B" value={`€ ${kpis.revenueB2B.value.toLocaleString('es-AR')}`} delta={kpis.revenueB2B.delta} icon={DollarSign} accent="lila" />
        <KpiCard label="Alertas críticas hoy" value={String(kpis.criticalAlertsToday.value)} delta={kpis.criticalAlertsToday.delta} icon={AlertOctagon} accent="rojo" />
        <KpiCard label="Nuevos profesionales" value={String(kpis.newProfessionals.value)} delta={kpis.newProfessionals.delta} icon={UserPlus} accent="amarillo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Crecimiento de usuarios" subtitle="B2C vs B2B en el período seleccionado">
          <Line
            options={chartOptions}
            data={{
              labels: growth.labels,
              datasets: [
                {
                  label: 'B2C',
                  data: growth.b2c,
                  borderColor: brand.celeste,
                  backgroundColor: brand.celeste + '40',
                  fill: true,
                  tension: 0.35,
                  borderWidth: 2,
                  pointRadius: 3,
                },
                {
                  label: 'B2B',
                  data: growth.b2b,
                  borderColor: brand.lila,
                  backgroundColor: brand.lila + '40',
                  fill: true,
                  tension: 0.35,
                  borderWidth: 2,
                  pointRadius: 3,
                },
              ],
            }}
          />
        </ChartCard>

        <ChartCard title="Distribución por rol" subtitle="Composición actual de la base de usuarios">
          <Doughnut
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: '62%',
              plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, padding: 12 } } },
            }}
            data={{
              labels: roles.labels,
              datasets: [{
                data: roles.values,
                backgroundColor: [brand.celeste, brand.lila, brand.amarillo, brand.emerald],
                borderWidth: 2,
                borderColor: '#fff',
              }],
            }}
          />
        </ChartCard>

        <ChartCard title="Tasa de finalización de rutinas" subtitle="Porcentaje completado por período">
          <Bar
            options={{ ...chartOptions, scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, max: 100, ticks: { ...chartOptions.scales.y.ticks, callback: (v) => v + '%' } } } }}
            data={{
              labels: routines.labels,
              datasets: [{
                label: 'Finalización (%)',
                data: routines.values,
                backgroundColor: brand.lila + 'cc',
                borderRadius: 6,
                maxBarThickness: 36,
              }],
            }}
          />
        </ChartCard>

        <ChartCard title="Sesiones por ecosistema" subtitle="App Perteneciente vs Portal Profesional">
          <Bar
            options={{ ...chartOptions, scales: { ...chartOptions.scales, x: { ...chartOptions.scales.x, stacked: true }, y: { ...chartOptions.scales.y, stacked: true } } }}
            data={{
              labels: sessions.labels,
              datasets: [
                { label: 'App Perteneciente', data: sessions.perteneciente, backgroundColor: brand.celeste, borderRadius: 4, maxBarThickness: 36 },
                { label: 'Portal Profesional', data: sessions.profesional, backgroundColor: brand.amarillo, borderRadius: 4, maxBarThickness: 36 },
              ],
            }}
          />
        </ChartCard>
      </div>
    </div>
  );
}
