import { useState } from 'react';
import { AdminSidebar, type AdminSection } from './layout/AdminSidebar';
import { AdminHeader } from './layout/AdminHeader';
import { DashboardHome } from './sections/DashboardHome';
import { DatabaseManagement } from './sections/DatabaseManagement';
import { LiveFeed } from './sections/LiveFeed';
import { SystemHealth } from './sections/SystemHealth';

export default function SuperAdminDashboard() {
  const [section, setSection] = useState<AdminSection>('home');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800">
      <AdminSidebar
        section={section}
        onChange={setSection}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <AdminHeader section={section} />
        <main className="flex-1 overflow-y-auto p-6">
          {section === 'home' && <DashboardHome />}
          {section === 'db' && <DatabaseManagement />}
          {section === 'live' && <LiveFeed />}
          {section === 'system' && <SystemHealth />}
        </main>
      </div>
    </div>
  );
}
