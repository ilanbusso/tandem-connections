## Refactor completo del Backoffice de Super Admin

Reemplazo total del `SuperAdminDashboard` actual (1329 líneas, estética "hacker oscura") por un backoffice claro, modular y fácil de usar por personal administrativo no técnico.

### 1. Tema visual global (des-hackerizar)

- Fondo principal `bg-slate-50`, tarjetas `bg-white` con `border border-slate-100` y `shadow-sm`.
- Tipografía neutra, iconografía `lucide-react`, sin terminales ni fuentes mono salvo en la consola SQL.
- Acentos sutiles con los colores de marca Tándem:
  - Celeste `#A4DDED` → info / B2C
  - Lila `#C9A7EB` → primario / B2B
  - Amarillo `#F8E287` → advertencias / highlights
- Estados semánticos: verde (ok), ámbar (warning), rojo (crítico).
- Sin `dark mode` por defecto en este panel (el resto de la app no se toca).

### 2. Arquitectura y navegación

Nueva carpeta `src/pages/admin/` con layout propio (sin React Router nuevo, usando estado interno para no tocar `AppShell`):

```text
src/pages/admin/
  SuperAdminDashboard.tsx        ← shell con sidebar + header + switch de sección
  layout/
    AdminSidebar.tsx             ← sidebar colapsable
    AdminHeader.tsx              ← header con búsqueda global, perfil admin, notificaciones
  sections/
    DashboardHome.tsx            ← Sección A
    DatabaseManagement.tsx       ← Sección B
    LiveFeed.tsx                 ← Sección C
    SystemHealth.tsx             ← Sección D
  components/
    KpiCard.tsx
    ChartCard.tsx
    UsersTable.tsx               ← reutilizable por tabs (pertenecientes, tutores, etc.)
    UserEditDialog.tsx
    EventTimelineItem.tsx
    StatusPill.tsx
    ProgressMetric.tsx
  data/
    adminMock.ts                 ← series temporales, eventos live, métricas sistema
```

Sidebar colapsable (ancho 240px / 64px) con 4 entradas: Dashboard, Base de Datos, Live Feed, System & Health. Cambio de sección por estado local (`useState<'home'|'db'|'live'|'system'>`).

### 3. Sección A — Dashboard Home

- Fila de **4 KPI cards**: Usuarios Activos, Ingresos B2B (€), Alertas Críticas hoy, Nuevos Profesionales (semana). Cada una con delta vs periodo anterior.
- Barra de **filtros**: `Select` de rango (`7d`, `Mes actual`, `Año`) y `Select` de ecosistema (Todos / B2C / B2B). El estado controla los datasets de los gráficos.
- Grid 2×2 con **4 gráficos chart.js**:
  1. Line — Crecimiento usuarios B2C vs B2B.
  2. Doughnut — Distribución por rol (Pertenecientes, Tutores, Profesionales, Instituciones).
  3. Bar — Tasa de finalización de rutinas por día.
  4. Bar apilado — Sesiones por ecosistema (App Perteneciente vs Portal Profesional).

### 4. Sección B — Gestión de Base de Datos

- `Tabs`: Pertenecientes · Tutores · Profesionales · Instituciones.
- Componente `UsersTable` genérico con:
  - Búsqueda global (input con icono).
  - Filtros por columna: Estado (Activo/Suspendido/Pendiente), Plan, Fecha alta.
  - Orden por columna, paginación (10/25/50).
  - Columna **Acciones** con `DropdownMenu`: Ver perfil clínico, Resetear contraseña, Suspender cuenta, Editar.
  - "Editar" abre `UserEditDialog` (Dialog de shadcn) con form simulado y toast de confirmación.
- Datos provenientes de `repo.ts` (users, tutors, professionals) + mock de instituciones.

### 5. Sección C — Live Feed

- Layout 2 columnas: panel lateral de filtros (Checkboxes) + timeline central.
- **Filtros**: severidad (Crítico / Aviso / Info), ecosistema (App Perteneciente / Portal Profesional / Tutor), tipo de evento.
- **Timeline** vertical con `EventTimelineItem`: icono circular coloreado, hora relativa, actor, descripción legible. Códigos:
  - Verde — Rutina completada.
  - Amarillo — Tutor ajustó configuración / pictograma editado.
  - Rojo — Botón de pánico / regulación emocional crítica.
  - Azul — Login / evento informativo.
- Toggle "Auto-refresh" que agrega un evento mock nuevo cada 5s.

### 6. Sección D — System & Health

- Tarjetas con **Progress bars**: CPU, RAM, Latencia API, Uso de disco, Cola de jobs. Valores mock animados (intervalo).
- Panel **Estado de integraciones**: badges verde/rojo para DB SQL, Redis, WebSockets, ARASAAC, Pasarela de pago, SMTP.
- Panel **Controles rápidos** con `Switch`:
  - Modo mantenimiento.
  - Bloquear nuevos registros.
  - Purgar caché de pictogramas ARASAAC (botón de acción + toast).
  - Forzar logout global.
- Mini-consola SQL conservada (lo que al usuario le gustó), en card blanca con editor mono y tabla de resultados.

### 7. Dependencias

Instalar `chart.js` y `react-chartjs-2`. Eliminar el uso de Recharts del archivo admin (el resto del proyecto sigue usando Recharts sin cambios). `bootstrap` añadido antes se retira de este panel para mantener consistencia con shadcn/Tailwind.

### 8. Datos mock

`adminMock.ts` provee:
- Series temporales por rango (7d/mes/año) para los 4 gráficos.
- Lista de instituciones (nombre, ciudad, nº licencias, estado).
- Eventos live (50+ entradas variadas).
- Métricas de sistema y estados de integración.

Los datos reales de usuarios/tutores/profesionales se siguen leyendo desde `src/data/repo.ts` para mantener la coherencia con la capa SQL ya refactorizada.

### 9. Notas técnicas

- Sin cambios en `AuthContext`, `AppShell`, ni rutas del resto de roles.
- Todo el panel admin queda autocontenido bajo `src/pages/admin/`.
- Componentes pequeños (<250 líneas), tipados, listos para mover a un repo Vite/React/TS oficial.
