import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { useAppStore } from '../../store/appStore';
import { Tv, Bot, ShieldCheck, CheckCircle2, ShieldAlert, Settings } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { activeModule, setActiveModule } = useAppStore();

  const mobileNavItems = [
    { id: 'programme-command', label: 'Command', icon: Tv },
    { id: 'ai-copilot', label: 'Copilot', icon: Bot },
    { id: 'safety', label: 'Safety', icon: ShieldAlert },
    { id: 'hull-quality', label: 'Quality', icon: CheckCircle2 },
    { id: 'platform', label: 'Platform', icon: Settings }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-base text-text-primary">
      {/* Sidebar for medium/large screens */}
      <Sidebar />

      {/* Main layout container */}
      <div className="flex flex-col flex-1 min-w-0 h-full relative">
        {/* Top Navbar */}
        <TopNav />

        {/* Scrollable Work Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 pb-20 md:pb-6 relative grid-bg">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar (Visible only on mobile/tablet screen) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-surface border-t border-border flex items-center justify-around px-2 z-30 shadow-elevated">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`flex flex-col items-center justify-center gap-1.5 py-1 px-3.5 rounded-lg transition-all cursor-pointer ${
                  isActive 
                    ? 'text-primary bg-primary-muted/15 font-semibold' 
                    : 'text-text-secondary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
