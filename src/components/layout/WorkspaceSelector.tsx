import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { mockWorkspaces } from '../../lib/mock-data';
import { Ship, Anchor, ShieldAlert, Shield, Wrench, Building, ChevronDown, Check } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  Ship,
  Anchor,
  ShieldAlert,
  Shield,
  Wrench,
  Building,
};

export default function WorkspaceSelector() {
  const { activeWorkspace, setActiveWorkspace } = useAppStore();
  const [open, setOpen] = useState(false);

  const active = mockWorkspaces.find((w) => w.id === activeWorkspace) || mockWorkspaces[0];
  const ActiveIcon = iconMap[active.icon] || Ship;

  return (
    <div className="relative z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-3 py-2 text-left rounded-lg bg-bg-surface hover:bg-bg-elevated border border-border transition-all cursor-pointer w-full"
      >
        <div className="p-2 rounded bg-primary-muted text-primary flex items-center justify-center">
          <ActiveIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold text-text-muted tracking-wider uppercase">Workspace</div>
          <div className="text-sm font-semibold text-text-primary truncate">{active.name}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-text-muted flex-shrink-0" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 mt-2 p-1.5 rounded-xl bg-bg-elevated border border-border shadow-elevated z-50 max-h-[400px] overflow-y-auto">
            <div className="px-3 py-1.5 text-[11px] font-bold text-text-muted tracking-wider uppercase border-b border-border mb-1.5">
              Switch Workspace
            </div>
            <div className="grid gap-1">
              {mockWorkspaces.map((workspace) => {
                const WIcon = iconMap[workspace.icon] || Ship;
                const isSelected = workspace.id === activeWorkspace;
                return (
                  <button
                    key={workspace.id}
                    onClick={() => {
                      setActiveWorkspace(workspace.id);
                      setOpen(false);
                    }}
                    className={`flex items-start gap-3 p-2.5 rounded-lg text-left transition-all hover:bg-bg-overlay cursor-pointer ${
                      isSelected ? 'bg-primary-muted/20 border border-primary/20' : 'border border-transparent'
                    }`}
                  >
                    <div className={`p-2 rounded flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-primary text-text-inverse' : 'bg-bg-overlay text-text-secondary'
                    }`}>
                      <WIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-text-primary truncate">{workspace.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                      </div>
                      <span className="text-[11px] text-text-secondary line-clamp-2 mt-0.5 leading-relaxed">
                        {workspace.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
