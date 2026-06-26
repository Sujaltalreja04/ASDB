import React from 'react';
import { useAppStore } from '../../store/appStore';
import { useYardDataStore } from '../../lib/mock-data/store';
import WorkspaceSelector from './WorkspaceSelector';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tv, Bot, Calendar, CheckCircle2, ShieldAlert, Wrench, Layers,
  FileText, Shield, Activity, Video, Users, Globe, Zap, Cpu,
  Compass, Lock, Leaf, BarChart3, Settings, Menu, ChevronLeft, ChevronRight
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string | number;
}

interface SidebarGroup {
  name: string;
  items: SidebarItem[];
}

export default function Sidebar() {
  const {
    sidebarExpanded,
    setSidebarExpanded,
    activeModule,
    setActiveModule
  } = useAppStore();

  const alerts = useYardDataStore((state) => state.alerts);
  const unreadAlertsCount = alerts.filter(a => !a.isAcknowledged).length;

  const groups: SidebarGroup[] = [
    {
      name: 'Command Center',
      items: [
        { id: 'programme-command', label: 'Command Center', icon: Tv, badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined },
        { id: 'ai-copilot', label: 'ADSB AI Copilot', icon: Bot }
      ]
    },
    {
      name: 'Yard Production',
      items: [
        { id: 'programme-intelligence', label: 'Prog Intelligence', icon: Calendar },
        { id: 'hull-quality', label: 'Hull Quality', icon: CheckCircle2 },
        { id: 'safety', label: 'Safety & Emergency', icon: ShieldAlert },
        { id: 'workforce', label: 'Workforce Intel', icon: Users }
      ]
    },
    {
      name: 'Engineering & Assets',
      items: [
        { id: 'engineering', label: 'Engineering Intel', icon: FileText },
        { id: 'asset-maintenance', label: 'Asset Maintenance', icon: Wrench },
        { id: 'marine-stores', label: 'Marine Stores', icon: Layers }
      ]
    },
    {
      name: 'Operations & Security',
      items: [
        { id: 'operations', label: 'Operations Intel', icon: Activity },
        { id: 'vision', label: 'Vision AI', icon: Video },
        { id: 'ot-security', label: 'OT & Cyber Security', icon: Lock }
      ]
    },
    {
      name: 'R&D & Robotics',
      items: [
        { id: 'digital-twin', label: 'Shipyard Twin 3D', icon: Globe },
        { id: 'ar-training', label: 'AR Maintenance', icon: Zap },
        { id: 'autonomous', label: 'Autonomous & Drone', icon: Compass },
        { id: 'innovation-hub', label: 'Innovation Hub', icon: Cpu }
      ]
    },
    {
      name: 'Governance & Analytics',
      items: [
        { id: 'compliance', label: 'Compliance & Audits', icon: Shield },
        { id: 'sustainability', label: 'Sustainability ESG', icon: Leaf },
        { id: 'analytics', label: 'AI Forecasting', icon: BarChart3 },
        { id: 'platform', label: 'Platform Settings', icon: Settings }
      ]
    }
  ];

  return (
    <motion.aside
      animate={{ width: sidebarExpanded ? 280 : 68 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-screen bg-bg-surface border-r border-border shrink-0 select-none z-40 relative"
    >
      {/* Header / Brand */}
      <div className="flex items-center justify-between h-[60px] px-3.5 border-b border-border">
        {sidebarExpanded ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-text-inverse font-black text-xs">
              OS
            </div>
            <div className="font-extrabold text-sm tracking-wide text-text-primary">
              ADSB <span className="text-primary font-medium">NavalOS</span>
            </div>
          </motion.div>
        ) : (
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-text-inverse font-black mx-auto">
            OS
          </div>
        )}
        {sidebarExpanded && (
          <button
            onClick={() => setSidebarExpanded(false)}
            className="p-1 rounded hover:bg-bg-overlay text-text-muted hover:text-text-primary cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Workspace Selector */}
      <div className="p-3 border-b border-border">
        {sidebarExpanded ? (
          <WorkspaceSelector />
        ) : (
          <button
            onClick={() => setSidebarExpanded(true)}
            className="w-10 h-10 rounded-lg bg-bg-overlay flex items-center justify-center text-primary hover:bg-primary-muted mx-auto border border-border cursor-pointer"
          >
            <Tv className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-4">
        {groups.map((group) => (
          <div key={group.name} className="space-y-1">
            {sidebarExpanded && (
              <h3 className="px-3 text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 mt-2">
                {group.name}
              </h3>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all relative group cursor-pointer ${
                    isActive
                      ? 'bg-primary-muted/20 text-primary font-medium border-l-[3px] border-primary rounded-l-none'
                      : 'text-text-secondary hover:bg-bg-overlay hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'}`} />
                  </div>
                  {sidebarExpanded && (
                    <span className="text-xs truncate flex-1 leading-none">{item.label}</span>
                  )}
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold flex items-center justify-center shrink-0 ${
                      item.id === 'programme-command' ? 'bg-critical text-text-inverse' : 'bg-primary text-text-inverse'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {!sidebarExpanded && (
                    <div className="absolute left-[74px] rounded bg-bg-elevated text-text-primary text-[11px] px-2 py-1 shadow-elevated border border-border hidden group-hover:block whitespace-nowrap z-50 pointer-events-none">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / Toggle Expanded when collapsed */}
      {!sidebarExpanded && (
        <div className="p-3 border-t border-border flex items-center justify-center">
          <button
            onClick={() => setSidebarExpanded(true)}
            className="p-1.5 rounded hover:bg-bg-overlay text-text-muted hover:text-text-primary cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.aside>
  );
}
