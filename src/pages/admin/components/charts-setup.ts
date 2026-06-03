// Register chart.js controllers once for the admin panel.
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

let registered = false;
export function ensureCharts() {
  if (registered) return;
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler,
  );
  ChartJS.defaults.font.family =
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  ChartJS.defaults.color = '#475569';
  registered = true;
}

export const brand = {
  celeste: '#A4DDED',
  lila: '#C9A7EB',
  amarillo: '#F8E287',
  emerald: '#10b981',
  rose: '#f43f5e',
  slate: '#64748b',
};
