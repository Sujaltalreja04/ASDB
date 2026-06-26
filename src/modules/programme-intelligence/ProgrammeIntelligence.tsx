import React, { useState } from 'react';
import { useYardDataStore } from '../../lib/mock-data/store';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { Calendar, BarChart3, TrendingUp, AlertTriangle, Users, Hammer, Check } from 'lucide-react';

const buildPhasesList = [
  'Contract', 'Design', 'SteelCutting', 'SteelFabrication', 'BlockAssembly',
  'ModuleAssembly', 'Erection', 'Launch', 'Outfitting', 'SeaTrials', 'Delivery'
];

export default function ProgrammeIntelligence() {
  const { vessels, employees } = useYardDataStore();
  const [selectedHull, setSelectedHull] = useState('HN-301');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Shift assignment mock state
  const [assignedTrades, setAssignedTrades] = useState<Record<string, string>>({
    'Row 1': 'StructuralWelder',
    'Row 2': 'PipeFitter',
    'Row 3': 'Electrician',
    'Row 4': 'Painter'
  });

  const currentVessel = vessels.find(v => v.hullNumber === selectedHull) || vessels[0];

  const handleAction = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Mock data for EVM cumulative tracking
  const evmData = [
    { name: 'Month 1', BCWS: 2.0, ACWP: 1.8, EV: 1.9 },
    { name: 'Month 2', BCWS: 5.0, ACWP: 4.8, EV: 4.9 },
    { name: 'Month 3', BCWS: 9.0, ACWP: 9.2, EV: 8.8 },
    { name: 'Month 4', BCWS: 14.0, ACWP: 14.5, EV: 13.8 },
    { name: 'Month 5', BCWS: 18.0, ACWP: 19.2, EV: 17.5 },
    { name: 'Month 6', BCWS: 24.0, ACWP: 25.8, EV: 23.4 },
    { name: 'Month 7', BCWS: 30.0, ACWP: 32.1, EV: 29.5 }
  ];

  // Steel fabrication rate throughput (tonnes/week)
  const steelThroughputData = [
    { name: 'Week 21', Tonnes: 120 },
    { name: 'Week 22', Tonnes: 125 },
    { name: 'Week 23', Tonnes: 132 },
    { name: 'Week 24', Tonnes: 128 },
    { name: 'Week 25', Tonnes: 140 },
    { name: 'Week 26', Tonnes: 142 }
  ];

  return (
    <div className="space-y-6">
      {/* Toast popup */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-bg-elevated border border-accent p-3.5 rounded-xl shadow-elevated flex items-center gap-3 animate-fade-up">
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <Check className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-text-primary">{toastMsg}</div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
            VESSEL PROGRAMME INTELLIGENCE
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Production sequencing, Gantt scheduling, earned value analytics, and workforce dispatch.
          </p>
        </div>

        {/* Hull Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-bold">FOCUS HULL:</span>
          <select
            value={selectedHull}
            onChange={(e) => setSelectedHull(e.target.value)}
            className="bg-bg-surface border border-border text-text-primary text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none"
          >
            {vessels.map(v => (
              <option key={v.id} value={v.hullNumber}>{v.hullNumber} - {v.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Phase Sequencing Visualizer */}
      <div className="card p-4">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-4">
          Production Sequence & Phase Progress
        </h3>
        
        {/* Phase Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-2">
          {buildPhasesList.map((phase, idx) => {
            const currentPhaseIdx = buildPhasesList.indexOf(currentVessel.currentPhase);
            const isCompleted = idx < currentPhaseIdx;
            const isActive = idx === currentPhaseIdx;
            
            return (
              <button
                key={phase}
                onClick={() => handleAction(`Inspecting details for phase: ${phase.replace(/([A-Z])/g, ' $1').trim()}`)}
                className={`p-2.5 rounded-lg border text-center relative cursor-pointer transition-all hover:border-primary ${
                  isActive 
                    ? 'bg-primary-muted/20 border-primary shadow-glow-primary' 
                    : isCompleted 
                    ? 'bg-accent-muted/10 border-accent/30' 
                    : 'bg-bg-muted border-border/40 opacity-50'
                }`}
              >
                <div className="text-[9px] font-bold text-text-muted uppercase">Phase {idx + 1}</div>
                <div className={`text-xs font-extrabold mt-1 truncate ${
                  isActive ? 'text-primary' : isCompleted ? 'text-accent' : 'text-text-secondary'
                }`}>
                  {phase.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                {isActive && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gantt Schedule & Bottlenecks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Schedule Tracker */}
        <div className="lg:col-span-2 card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Vessel Gantt Sequencing
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(`Delay applied: forecast shifted +5 days for ${selectedHull}`)}
                className="px-2 py-1 bg-critical/15 text-critical text-[10px] font-bold rounded cursor-pointer"
              >
                +5d Delay
              </button>
              <button
                onClick={() => handleAction(`Acceleration applied: forecast shifted -3 days for ${selectedHull}`)}
                className="px-2 py-1 bg-success/15 text-success text-[10px] font-bold rounded cursor-pointer"
              >
                -3d Expedite
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {currentVessel.milestones.map((ms) => {
              const isDelayed = ms.status === 'Delayed';
              const isDone = ms.status === 'Completed';
              return (
                <div key={ms.id} className="p-3 rounded bg-bg-overlay border border-border flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      isDone ? 'bg-success' : isDelayed ? 'bg-critical' : 'bg-primary'
                    }`} />
                    <span className="font-bold text-text-primary">{ms.name}</span>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-[11px]">
                    <div>
                      <span className="text-text-muted">PLAN:</span>{' '}
                      <span className="text-text-secondary">{ms.plannedDate}</span>
                    </div>
                    <div>
                      <span className="text-text-muted">FCST:</span>{' '}
                      <span className={`${isDelayed ? 'text-critical font-bold' : 'text-text-secondary'}`}>
                        {ms.forecastDate}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workforce Shift Dispatch grid */}
        <div className="card p-4 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">
              Workforce Shift Dispatch Grid
            </h3>

            <div className="space-y-2 text-xs">
              {Object.entries(assignedTrades).map(([rowId, trade]) => (
                <div key={rowId} className="flex items-center justify-between p-2 rounded bg-bg-overlay border border-border">
                  <span className="font-semibold text-text-primary">{rowId} Shift Allocation</span>
                  <select
                    value={trade}
                    onChange={(e) => {
                      setAssignedTrades(prev => ({ ...prev, [rowId]: e.target.value }));
                      handleAction(`Assigned ${e.target.value.replace(/([A-Z])/g, ' $1').trim()} to ${rowId}`);
                    }}
                    className="bg-bg-surface border border-border text-[10px] font-bold text-text-secondary rounded px-2 py-0.5"
                  >
                    <option value="StructuralWelder">Welding Team</option>
                    <option value="PipeFitter">Pipe Fitters</option>
                    <option value="Electrician">Electricians</option>
                    <option value="Painter">Painting Team</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded bg-primary-muted/12 border border-primary/20 text-[10px] text-text-secondary leading-relaxed">
            Assign trades directly to active shifts using selectors above to dispatch them.
          </div>
        </div>
      </div>

      {/* EVM & Throughput Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumulative EVM Chart */}
        <div className="card p-4 space-y-2">
          <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-2">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Earned Value Management (EVM) Cumulative Tracking
            </h3>
            <span className="text-[10px] text-text-muted font-bold">Focus: {selectedHull} (M$)</span>
          </div>

          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evmData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBcws" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D9CDB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2D9CDB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAcwp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B47" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FF3B47" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={10} />
                <YAxis stroke="var(--color-text-muted)" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Area type="monotone" dataKey="BCWS" name="Planned Value (PV)" stroke="#2D9CDB" fillOpacity={1} fill="url(#colorBcws)" strokeWidth={2} />
                <Area type="monotone" dataKey="ACWP" name="Actual Cost (AC)" stroke="#FF3B47" fillOpacity={1} fill="url(#colorAcwp)" strokeWidth={2} />
                <Area type="monotone" dataKey="EV" name="Earned Value (EV)" stroke="#00D4A0" fillOpacity={0} strokeWidth={2} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Steel Throughput Chart */}
        <div className="card p-4 space-y-2">
          <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-2">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Shipyard Steel Throughput Analytics
            </h3>
            <span className="text-[10px] text-text-muted font-bold">Tonnes fabricated per week</span>
          </div>

          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={steelThroughputData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={10} />
                <YAxis stroke="var(--color-text-muted)" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Line type="monotone" dataKey="Tonnes" name="Steel Rate (Tonnes)" stroke="#00D4A0" strokeWidth={3} dot={{ fill: '#00D4A0', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
