import React, { useState } from 'react';
import { useYardDataStore } from '../../lib/mock-data/store';
import KPITile from '../../components/ui/KPITile';
import VesselCard from '../../components/ui/VesselCard';
import { AlertCircle, Terminal, MapPin, Anchor, HelpCircle, Activity, Play, X, ShieldAlert, Check } from 'lucide-react';
import { Vessel } from '../../types/adsb';

interface KPIData {
  label: string;
  value: number | string;
  unit?: string;
  change?: number;
  changePeriod?: string;
  trend?: 'up' | 'down' | 'stable';
  positive?: 'up' | 'down';
  sparkline?: number[];
  severity?: 'critical' | 'warning' | 'info' | 'success';
}

export default function ProgrammeCommandCenter() {
  const { vessels, assets, alerts, acknowledgeAlert } = useYardDataStore();
  const [activeTab, setActiveTab] = useState<'mussafah' | 'minazayed' | 'subcon'>('mussafah');
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Filter vessels based on the active tab location
  const getFilteredVessels = () => {
    if (activeTab === 'minazayed') {
      return vessels.filter(v => v.location === 'Mina Zayed' || v.hullNumber === 'HN-101');
    }
    if (activeTab === 'subcon') {
      return vessels.filter(v => v.location === 'CMN Naval France');
    }
    // Default to Mussafah Yard
    return vessels.filter(v => v.location === 'Bay1' || v.location === 'Bay2' || v.location === 'Offices' || v.hullNumber === 'HN-301' || v.hullNumber === 'HN-202');
  };

  const activeHulls = getFilteredVessels();

  // Core KPIs
  const kpis: KPIData[] = [
    { label: 'Steel Fabrication', value: 142, unit: 't/week', change: 8.4, trend: 'up', sparkline: [120, 125, 130, 138, 142] },
    { label: 'Hull Readiness', value: 89.4, unit: '%', change: 1.2, trend: 'up', sparkline: [88, 88.5, 89, 89.2, 89.4] },
    { label: 'Schedule Performance (SPI)', value: 0.98, change: -1.5, trend: 'down', positive: 'up', sparkline: [1.02, 1.01, 1.0, 0.98] },
    { label: 'Cost Performance (CPI)', value: 0.96, change: 0.2, trend: 'up', positive: 'up', sparkline: [0.95, 0.95, 0.96, 0.96] },
    { label: 'Active Work Orders', value: 14, change: -2, trend: 'down', positive: 'down', sparkline: [18, 16, 15, 14] },
    { label: 'Open NCRs', value: 8, change: 1, trend: 'up', positive: 'down', sparkline: [7, 8, 7, 8], severity: 'warning' },
    { label: 'Total Recordable Incident Rate', value: 0.45, change: 0, trend: 'stable', positive: 'down', sparkline: [0.45, 0.45, 0.45] }
  ];

  // AI insights rotating text
  const insights = [
    "HN-301 block assembly is tracking 6 days behind schedule. Primary cause: sandblasting system SBS-02 downtime (72 hours). Recommend expediting repair to avoid critical path impact.",
    "Welder qualification WQ-47 (SMAW, 6G position, DH36) expires in 14 days. 3 active weld joints on HN-301 require this certification.",
    "Paint booth PC-01 humidity exceeded 85% RH for 3 consecutive days — coating cure risk on recently applied antifouling system. Recommend hold on next coat application until RH drops below 80%.",
    "27 hot work permits currently active across the yard. Zone B3 (HN-301 engine room) has 4 simultaneous hot work operations — approaching maximum simultaneous operations limit of 5."
  ];

  const handleTriggerAction = (message: string) => {
    setToastMsg(message);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert popup */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-bg-elevated border border-accent p-3.5 rounded-xl shadow-elevated flex items-center gap-3 animate-fade-up">
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <Check className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-text-primary">{toastMsg}</div>
        </div>
      )}

      {/* Welcome banner & Site controller */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
            SHIPYARD OPERATIONAL COMMAND CENTER
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Real-time telemetry and vessel programme overview — Mussafah Yard & Mina Zayed Drydock.
          </p>
        </div>

        {/* Site Switcher */}
        <div className="flex rounded-lg bg-bg-surface p-1 border border-border">
          <button
            onClick={() => setActiveTab('mussafah')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'mussafah' ? 'bg-primary text-text-inverse shadow-glow-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Mussafah Yard
          </button>
          <button
            onClick={() => setActiveTab('minazayed')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'minazayed' ? 'bg-primary text-text-inverse shadow-glow-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Mina Zayed Dock
          </button>
          <button
            onClick={() => setActiveTab('subcon')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'subcon' ? 'bg-primary text-text-inverse shadow-glow-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Sub-Contractors
          </button>
        </div>
      </div>

      {/* KPI Tiles Dashboard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpis.map((kpi, idx) => (
          <KPITile key={idx} {...kpi} />
        ))}
      </div>

      {/* Main Layout Area: Grid of active vessels & Yard status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Vessels list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-text-muted">
              Active Vessel Programmes ({activeTab.toUpperCase()})
            </h2>
            <span className="text-[10px] text-text-muted">Click hull card to inspect specs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeHulls.map((vessel) => (
              <VesselCard
                key={vessel.id}
                vessel={vessel}
                onClick={() => setSelectedVessel(vessel)}
              />
            ))}
          </div>
        </div>

        {/* Operational Intelligence Sidebar */}
        <div className="space-y-6">
          {/* AI insights widget */}
          <div className="card p-4 bg-bg-surface border-l-2 border-l-accent relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-accent" />
              <span className="text-xs font-black text-accent uppercase tracking-wider">
                ADSB AI Copilot Briefing
              </span>
            </div>
            
            <div className="space-y-3 mt-3 scroll-fade-bottom max-h-[220px] overflow-y-auto pr-1">
              {insights.map((insight, idx) => (
                <div key={idx} className="p-2.5 rounded bg-bg-overlay border border-border/60 text-xs leading-relaxed text-text-secondary">
                  {insight}
                </div>
              ))}
            </div>
          </div>

          {/* Quick status feed / Prioritized Alerts */}
          <div className="card p-4 space-y-3">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Operational Alerts Hub
            </h3>
            
            <div className="space-y-2.5">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="p-2.5 rounded bg-bg-overlay border border-border text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-text-primary">{alert.title}</span>
                    <span className={`text-[9px] font-extrabold uppercase px-1 rounded ${
                      alert.severity === 'critical' ? 'bg-critical/20 text-critical' : 'bg-warning/20 text-warning'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                    {alert.description}
                  </p>
                  <div className="flex gap-2 justify-end mt-2.5">
                    <button
                      onClick={() => {
                        acknowledgeAlert(alert.id);
                        handleTriggerAction(`Acknowledged alert: ${alert.title}`);
                      }}
                      className="text-[10px] font-bold text-accent cursor-pointer hover:underline"
                    >
                      Acknowledge
                    </button>
                    <button
                      onClick={() => handleTriggerAction("Dispatched maintenance response team.")}
                      className="text-[10px] font-bold text-primary cursor-pointer hover:underline"
                    >
                      Dispatch Team
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* World Map section with SVG */}
      <div className="card p-4">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs font-black text-text-primary uppercase tracking-wider">
              Global Asset Deployment & Supply Chain Tracking
            </span>
          </div>
          <span className="text-[10px] text-text-muted font-mono">Telemetry link established</span>
        </div>

        <div className="h-[280px] rounded-lg bg-bg-muted border border-border relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

          <svg className="w-full h-full max-w-[800px] text-text-disabled opacity-35" viewBox="0 0 1000 500" fill="currentColor">
            <path d="M150,150 L200,120 L250,130 L300,200 L250,300 L200,280 Z" />
            <path d="M450,120 L550,100 L650,140 L700,220 L600,320 L550,350 L480,240 Z" />
            <path d="M520,380 L580,360 L620,440 L550,460 Z" />
            <path d="M720,280 L790,260 L840,320 L780,380 Z" />
          </svg>

          {/* Interactive Site markers */}
          <button
            onClick={() => {
              setActiveTab('mussafah');
              handleTriggerAction("Switched view context to Mussafah Main Yard.");
            }}
            className="absolute top-[210px] left-[540px] flex flex-col items-center group cursor-pointer"
          >
            <div className="w-3 h-3 rounded-full bg-accent animate-ping absolute" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent border border-text-inverse z-10" />
            <div className="absolute bottom-4 bg-bg-elevated border border-border text-[9px] font-bold px-1.5 py-0.5 rounded text-accent whitespace-nowrap shadow-elevated">
              ADSB Yard (HQ)
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('subcon');
              handleTriggerAction("Switched view context to CMN Naval France site.");
            }}
            className="absolute top-[130px] left-[450px] flex flex-col items-center group cursor-pointer"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-primary border border-text-inverse z-10" />
            <div className="absolute bottom-4 bg-bg-elevated border border-border text-[9px] px-1.5 py-0.5 rounded text-text-primary whitespace-nowrap shadow-elevated">
              CMN France (Subcon)
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('minazayed');
              handleTriggerAction("Switched view context to Mina Zayed Floating Dock.");
            }}
            className="absolute top-[200px] left-[528px] flex flex-col items-center group cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-primary border border-text-inverse z-10" />
            <div className="absolute bottom-4 bg-bg-elevated border border-border text-[9px] px-1.5 py-0.5 rounded text-text-primary whitespace-nowrap shadow-elevated">
              Mina Zayed Drydock
            </div>
          </button>

          {/* Map legend */}
          <div className="absolute bottom-3 left-3 bg-bg-surface/80 backdrop-blur border border-border rounded-md p-2 flex gap-4 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-text-secondary">Main yard / floating dock</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-text-secondary">Active programme site</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inspect Vessel Modal Dialog */}
      {selectedVessel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-up">
          <div className="relative w-full max-w-2xl rounded-xl bg-bg-elevated border border-border shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-4 py-3.5 border-b border-border bg-bg-muted flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Anchor className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="text-xs font-bold text-text-primary">
                    Vessel Specs: {selectedVessel.hullNumber} - {selectedVessel.name}
                  </h3>
                  <span className="text-[9px] text-text-muted font-bold block uppercase mt-0.5">
                    Clearance Tier 5 contextual log
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedVessel(null)}
                className="p-1 rounded hover:bg-bg-overlay text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-bg-overlay border border-border rounded">
                  <span className="text-[10px] text-text-muted font-bold block mb-1">PROG ENGINE & propulsion</span>
                  <p className="text-text-secondary leading-relaxed font-semibold">{selectedVessel.propulsion}</p>
                </div>
                <div className="p-3 bg-bg-overlay border border-border rounded">
                  <span className="text-[10px] text-text-muted font-bold block mb-1">CONTRACT / BUDGET</span>
                  <p className="text-text-secondary font-bold">
                    ${(selectedVessel.budgetUSD / 1000000).toFixed(1)}M USD (Actual: ${(selectedVessel.actualCostUSD / 1000000).toFixed(1)}M)
                  </p>
                </div>
              </div>

              {/* Compartment simulation list */}
              <div>
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Compartment status logs</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 border border-success/35 bg-success-muted/5 rounded text-center">
                    <span className="font-bold text-success block">Engine Room</span>
                    <span className="text-[9px] text-text-muted">Temp: 28°C (Normal)</span>
                  </div>
                  <div className="p-2 border border-success/35 bg-success-muted/5 rounded text-center">
                    <span className="font-bold text-success block">Bridge Deck</span>
                    <span className="text-[9px] text-text-muted">Outfitting OK</span>
                  </div>
                  <div className="p-2 border border-warning/35 bg-warning-muted/5 rounded text-center">
                    <span className="font-bold text-warning block">Aux Machinery</span>
                    <span className="text-[9px] text-text-muted">LOTO isolation active</span>
                  </div>
                  <div className="p-2 border border-success/35 bg-success-muted/5 rounded text-center">
                    <span className="font-bold text-success block">Combat Switch</span>
                    <span className="text-[9px] text-text-muted">Airlock Sealed</span>
                  </div>
                </div>
              </div>

              {/* Checklist milestones */}
              <div>
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Milestone Checklist</h4>
                <div className="space-y-1.5">
                  {selectedVessel.milestones.map((ms, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded bg-bg-overlay border border-border">
                      <span className="font-semibold text-text-primary">{ms.name}</span>
                      <span className={`badge ${
                        ms.status === 'Completed' ? 'badge-success' : ms.status === 'Delayed' ? 'badge-critical' : 'badge-neutral'
                      }`}>
                        {ms.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-4 py-2.5 border-t border-border bg-bg-muted flex justify-end gap-2 shrink-0">
              <button
                onClick={() => {
                  handleTriggerAction(`Initiated schedule audit for ${selectedVessel.hullNumber}`);
                  setSelectedVessel(null);
                }}
                className="px-3 py-1.5 bg-primary text-text-inverse font-bold text-xs rounded-lg cursor-pointer"
              >
                Audit Schedule
              </button>
              <button
                onClick={() => setSelectedVessel(null)}
                className="px-3 py-1.5 bg-bg-overlay border border-border text-text-secondary text-xs rounded-lg cursor-pointer"
              >
                Dismiss Specs
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
