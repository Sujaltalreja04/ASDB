import React from 'react';
import { useAppStore } from '../../store/appStore';
import { useYardDataStore } from '../../lib/mock-data/store';
import NotificationsPanel from '../ui/NotificationsPanel';
import CommandPalette from '../ui/CommandPalette';
import { Search, Bell, Bot, Moon, Sun, ShieldCheck, Settings, Menu } from 'lucide-react';

export default function TopNav() {
  const {
    theme,
    toggleTheme,
    notificationsOpen,
    setNotificationsOpen,
    setCommandPaletteOpen,
    setCopilotOpen,
    sidebarExpanded,
    setSidebarExpanded,
    activeModule,
    setActiveModule
  } = useAppStore();

  const alerts = useYardDataStore((state) => state.alerts);
  const unreadCount = alerts.filter((a) => !a.isAcknowledged).length;

  return (
    <header className="h-[60px] bg-bg-surface border-b border-border flex items-center justify-between px-4 shrink-0 relative select-none z-30">
      {/* Left side: Hamburger menu for responsive, and search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="md:hidden p-2 rounded hover:bg-bg-overlay text-text-muted hover:text-text-primary cursor-pointer transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Box (opens command palette) */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 w-full max-w-[280px] bg-bg-overlay rounded-lg border border-border text-left hover:border-border-strong text-text-muted hover:text-text-secondary transition-all cursor-pointer text-xs"
        >
          <Search className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 truncate">Search shipyard records...</span>
          <span className="hidden sm:inline text-[10px] bg-bg-surface border border-border px-1.5 py-0.5 rounded text-text-muted font-mono tracking-tighter">
            Ctrl+K
          </span>
        </button>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* AI Copilot Quick Launch */}
        <button
          onClick={() => {
            setActiveModule('ai-copilot');
            setCopilotOpen(true);
          }}
          className={`p-2 rounded-lg transition-colors cursor-pointer border relative flex items-center justify-center ${
            activeModule === 'ai-copilot'
              ? 'bg-primary-muted/20 border-primary text-primary'
              : 'bg-bg-overlay border-border text-text-secondary hover:text-text-primary'
          }`}
          title="Launch ADSB AI Copilot"
        >
          <Bot className="w-4.5 h-4.5" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
        </button>

        {/* Notifications Center */}
        <button
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className={`p-2 rounded-lg transition-colors cursor-pointer border relative flex items-center justify-center ${
            notificationsOpen
              ? 'bg-primary-muted/20 border-primary text-primary'
              : 'bg-bg-overlay border-border text-text-secondary hover:text-text-primary'
          }`}
          title="Operational Alerts"
        >
          <Bell className="w-4.5 h-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-critical text-text-inverse text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-bg-overlay border border-border text-text-secondary hover:text-text-primary transition-colors cursor-pointer flex items-center justify-center"
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>

        {/* Separator */}
        <div className="w-[1px] h-6 bg-border" />

        {/* User profile & clearance level */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-bold text-text-primary">Saeed Al-Qubaisi</div>
            <div className="flex items-center justify-end gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] text-accent font-semibold uppercase tracking-wider">
                Clearance T5
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/30 text-accent font-extrabold flex items-center justify-center text-sm shadow-glow-accent select-none">
            SA
          </div>
        </div>
      </div>

      {/* Notifications Portal Panel */}
      <NotificationsPanel />

      {/* Global Command Palette */}
      <CommandPalette />
    </header>
  );
}
