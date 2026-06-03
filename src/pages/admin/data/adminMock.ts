// Mock data for the Super Admin backoffice. Pure data, no UI deps.

export type Range = '7d' | 'month' | 'year';
export type Eco = 'all' | 'b2c' | 'b2b';

const labelsByRange: Record<Range, string[]> = {
  '7d': ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  month: ['S1', 'S2', 'S3', 'S4'],
  year: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
};

function seedSeries(base: number, length: number, drift = 0.08, seed = 1) {
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < length; i++) {
    const noise = Math.sin((i + seed) * 1.7) * 0.5 + Math.cos((i + seed) * 0.9) * 0.4;
    v = Math.max(0, v * (1 + drift * 0.1) + noise * base * 0.05);
    out.push(Math.round(v));
  }
  return out;
}

export function getGrowthData(range: Range, eco: Eco) {
  const labels = labelsByRange[range];
  const b2c = seedSeries(range === 'year' ? 1200 : 180, labels.length, 0.12, 1);
  const b2b = seedSeries(range === 'year' ? 320 : 45, labels.length, 0.18, 5);
  return {
    labels,
    b2c: eco === 'b2b' ? b2c.map(() => 0) : b2c,
    b2b: eco === 'b2c' ? b2b.map(() => 0) : b2b,
  };
}

export function getRoleDistribution() {
  return {
    labels: ['Pertenecientes', 'Tutores', 'Profesionales', 'Instituciones'],
    values: [1284, 642, 218, 37],
  };
}

export function getRoutineCompletion(range: Range) {
  const labels = labelsByRange[range];
  return {
    labels,
    values: labels.map((_, i) => 55 + Math.round(Math.sin(i * 1.3) * 15 + Math.cos(i) * 8) + 15),
  };
}

export function getSessionsByEco(range: Range) {
  const labels = labelsByRange[range];
  return {
    labels,
    perteneciente: seedSeries(range === 'year' ? 4200 : 620, labels.length, 0.05, 3),
    profesional: seedSeries(range === 'year' ? 1800 : 240, labels.length, 0.07, 9),
  };
}

export function getKpis(range: Range) {
  const mult = range === 'year' ? 12 : range === 'month' ? 4 : 1;
  return {
    activeUsers: { value: 1842, delta: +6.2 },
    revenueB2B: { value: 28400 * mult, delta: +12.8 },
    criticalAlertsToday: { value: 7, delta: -25 },
    newProfessionals: { value: 9 + mult, delta: +18 },
  };
}

// ============ Institutions ============
export interface Institution {
  id: string;
  name: string;
  city: string;
  licenses: number;
  status: 'Activo' | 'Suspendido' | 'Pendiente';
  plan: 'Básico' | 'Pro' | 'Enterprise';
  createdAt: string;
  contactEmail: string;
}

export const institutions: Institution[] = [
  { id: 'i1', name: 'Centro Aurora TEA', city: 'Buenos Aires', licenses: 45, status: 'Activo', plan: 'Enterprise', createdAt: '2024-03-12', contactEmail: 'admin@aurora.edu' },
  { id: 'i2', name: 'Instituto Crecer', city: 'Córdoba', licenses: 22, status: 'Activo', plan: 'Pro', createdAt: '2024-05-04', contactEmail: 'info@crecer.org' },
  { id: 'i3', name: 'Fundación Vínculos', city: 'Rosario', licenses: 60, status: 'Activo', plan: 'Enterprise', createdAt: '2023-11-20', contactEmail: 'contacto@vinculos.org' },
  { id: 'i4', name: 'Escuela Integrar', city: 'Mendoza', licenses: 18, status: 'Pendiente', plan: 'Básico', createdAt: '2025-01-08', contactEmail: 'hola@integrar.edu' },
  { id: 'i5', name: 'Hospital Pediátrico Sur', city: 'La Plata', licenses: 30, status: 'Activo', plan: 'Pro', createdAt: '2024-08-15', contactEmail: 'tea@hospsur.gob' },
  { id: 'i6', name: 'Centro Empatía', city: 'Mar del Plata', licenses: 12, status: 'Suspendido', plan: 'Básico', createdAt: '2024-02-01', contactEmail: 'admin@empatia.com' },
  { id: 'i7', name: 'Red Neurodiversa', city: 'Salta', licenses: 28, status: 'Activo', plan: 'Pro', createdAt: '2024-09-22', contactEmail: 'red@neurodiversa.org' },
  { id: 'i8', name: 'Colegio Horizontes', city: 'Tucumán', licenses: 40, status: 'Activo', plan: 'Enterprise', createdAt: '2023-07-10', contactEmail: 'admin@horizontes.edu' },
  { id: 'i9', name: 'Centro Puentes', city: 'Neuquén', licenses: 15, status: 'Pendiente', plan: 'Básico', createdAt: '2025-02-18', contactEmail: 'hola@puentes.org' },
  { id: 'i10', name: 'Instituto Lumen', city: 'Bahía Blanca', licenses: 25, status: 'Activo', plan: 'Pro', createdAt: '2024-06-30', contactEmail: 'info@lumen.edu' },
];

// ============ Live feed events ============
export type EventSeverity = 'critical' | 'warning' | 'info' | 'success';
export type EventEcosystem = 'perteneciente' | 'profesional' | 'tutor' | 'sistema';

export interface LiveEvent {
  id: string;
  severity: EventSeverity;
  ecosystem: EventEcosystem;
  type: string;
  actor: string;
  message: string;
  timestamp: number;
}

const eventTemplates: Omit<LiveEvent, 'id' | 'timestamp'>[] = [
  { severity: 'success', ecosystem: 'perteneciente', type: 'Rutina completada', actor: 'Juan García', message: 'Completó la rutina "Mañana tranquila" (8/8 pasos)' },
  { severity: 'success', ecosystem: 'perteneciente', type: 'Logro desbloqueado', actor: 'Sofía Martínez', message: 'Desbloqueó "Constancia 7 días"' },
  { severity: 'warning', ecosystem: 'tutor', type: 'Configuración', actor: 'Laura Gómez', message: 'Editó la rutina de Juan y cambió 2 pictogramas' },
  { severity: 'warning', ecosystem: 'profesional', type: 'Pictograma editado', actor: 'Lic. Martina Pérez', message: 'Subió pictograma personalizado "Ir al consultorio"' },
  { severity: 'critical', ecosystem: 'perteneciente', type: 'Botón de pánico', actor: 'Mateo Rodríguez', message: 'Activó regulación emocional — nivel "alto"' },
  { severity: 'critical', ecosystem: 'sistema', type: 'Latencia API', actor: 'Backend EU-West', message: 'Latencia p95 superó 800ms durante 3 min' },
  { severity: 'info', ecosystem: 'sistema', type: 'Login', actor: 'admin@tandem.app', message: 'Inicio de sesión desde 200.45.x.x' },
  { severity: 'info', ecosystem: 'tutor', type: 'Mensaje enviado', actor: 'Carlos Martínez', message: 'Envió mensaje a Lic. Lucas Ortega' },
  { severity: 'success', ecosystem: 'perteneciente', type: 'Compra tienda', actor: 'Valentina López', message: 'Canjeó 200 puntos por accesorio de avatar' },
  { severity: 'warning', ecosystem: 'profesional', type: 'Alta paciente', actor: 'Dr. Lucas Ortega', message: 'Vinculó nuevo perteneciente a su cartera' },
  { severity: 'critical', ecosystem: 'perteneciente', type: 'Regulación emocional', actor: 'Camila Sánchez', message: 'Marcó emoción "Muy mal" 3 veces en 1 hora' },
  { severity: 'info', ecosystem: 'sistema', type: 'Backup', actor: 'CronJob nightly', message: 'Backup completado correctamente (4.2 GB)' },
];

export function generateInitialEvents(count = 40): LiveEvent[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const t = eventTemplates[i % eventTemplates.length];
    return {
      ...t,
      id: `e${i}`,
      timestamp: now - i * 1000 * 60 * (2 + (i % 5)),
    };
  });
}

export function randomEvent(): LiveEvent {
  const t = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
  return { ...t, id: `e${Date.now()}-${Math.random()}`, timestamp: Date.now() };
}

// ============ System health ============
export interface IntegrationStatus {
  name: string;
  ok: boolean;
  detail: string;
}

export const integrations: IntegrationStatus[] = [
  { name: 'DB SQL (Postgres)', ok: true, detail: 'Conectado · 12ms' },
  { name: 'Redis Cache', ok: true, detail: 'Conectado · 2ms' },
  { name: 'WebSockets', ok: true, detail: '1.842 sockets activos' },
  { name: 'ARASAAC API', ok: true, detail: 'OK · caché 98%' },
  { name: 'Pasarela de pago', ok: false, detail: 'Timeout · revisar credenciales' },
  { name: 'SMTP transaccional', ok: true, detail: 'OK · 1.234 envíos hoy' },
];
