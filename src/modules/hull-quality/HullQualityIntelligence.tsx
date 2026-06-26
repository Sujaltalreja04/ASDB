import React, { useState } from 'react';
import { useYardDataStore } from '../../lib/mock-data/store';
import DataTable from '../../components/ui/DataTable';
import { Shield, CheckCircle2, AlertTriangle, Eye, Plus, ArrowUpRight, Zap, Target, Check } from 'lucide-react';
import { NCR, ClassSociety } from '../../types/adsb';

export default function HullQualityIntelligence() {
  const { vessels, ncrs, addNCR, updateNCRStatus } = useYardDataStore();
  const [selectedHull, setSelectedHull] = useState('HN-301');
  const [isAddingNcr, setIsAddingNcr] = useState(false);
  const [scanType, setScanType] = useState<'weld' | 'paint' | 'corrosion'>('weld');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State
  const [ncrTitle, setNcrTitle] = useState('');
  const [ncrDesc, setNcrDesc] = useState('');
  const [ncrSeverity, setNcrSeverity] = useState<'Minor' | 'Major' | 'Critical'>('Minor');
  const [ncrDefectType, setNcrDefectType] = useState('Weld Defect');
  const [ncrTrade, setNcrTrade] = useState<'StructuralWelder' | 'Painter' | 'Electrician'>('StructuralWelder');
  const [ncrHold, setNcrHold] = useState<ClassSociety>('LloydRegister');

  const currentVessel = vessels.find(v => v.hullNumber === selectedHull) || vessels[0];
  const vesselNcrs = ncrs.filter(n => n.hullNumber === selectedHull);

  // Interactive Class Hold checklist state
  const [holdPoints, setHoldPoints] = useState<Record<string, string>>({
    'Keel NDT': 'Passed (BV)',
    'Propulsion Align': 'Hold Point (LR)',
    'Superstructure Seals': 'Scheduled (TASNEEF)'
  });

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSubmitNcr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ncrTitle.trim()) return;

    addNCR({
      title: ncrTitle,
      description: ncrDesc,
      vesselId: currentVessel.id,
      hullNumber: currentVessel.hullNumber,
      severity: ncrSeverity,
      defectType: ncrDefectType,
      location: `${currentVessel.hullNumber}, Assembly Block 04`,
      trade: ncrTrade,
      reportedBy: 'Saeed Al-Qubaisi (Operations Manager)',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      classSocietyHold: ncrHold
    });

    // Reset Form
    setNcrTitle('');
    setNcrDesc('');
    setIsAddingNcr(false);
    triggerToast("Logged new Quality NCR successfully.");
  };

  // Radial Quality Gauge calculations
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentVessel.qualityScore / 100) * circumference;

  const ncrColumns = [
    { header: 'NCR Number', accessor: 'ncrNumber' as const },
    { header: 'Title & Defect', accessor: (row: NCR) => (
        <div>
          <div className="font-bold text-text-primary">{row.title}</div>
          <div className="text-[10px] text-text-muted mt-0.5">{row.defectType}</div>
        </div>
      )
    },
    { header: 'Severity', accessor: (row: NCR) => (
        <span className={`badge ${
          row.severity === 'Critical' ? 'badge-critical' : row.severity === 'Major' ? 'badge-warning' : 'badge-neutral'
        }`}>
          {row.severity}
        </span>
      )
    },
    { header: 'Hold Point', accessor: (row: NCR) => (
        <span className="text-[10px] font-bold text-text-secondary">{row.classSocietyHold || 'None'}</span>
      )
    },
    { header: 'Status', accessor: (row: NCR) => (
        <span className={`badge ${
          row.status === 'Open' ? 'badge-critical' : row.status === 'UnderReview' ? 'badge-warning' : 'badge-success'
        }`}>
          {row.status}
        </span>
      )
    },
    { header: 'Action', accessor: (row: NCR) => (
        <div className="flex gap-2">
          {row.status !== 'Closed' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateNCRStatus(row.id, 'Closed');
                triggerToast(`Resolved and closed ${row.ncrNumber}`);
              }}
              className="text-[10px] font-bold text-success hover:underline cursor-pointer"
            >
              Resolve
            </button>
          )}
          <span className="text-text-muted">|</span>
          <span className="text-[10px] text-text-muted">Rework: {row.reworkHours || 0} hrs</span>
        </div>
      )
    }
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

      {/* Welcome banner & Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
            HULL QUALITY INTELLIGENCE
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Weld porosity scans, coatings inspection, non-conformance logs (NCR), and classification approval gates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-bold">HULL FOCUS:</span>
          <select
            value={selectedHull}
            onChange={(e) => setSelectedHull(e.target.value)}
            className="bg-bg-surface border border-border text-text-primary text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none"
          >
            {vessels.filter(v => v.completionPercent > 0).map(v => (
              <option key={v.id} value={v.hullNumber}>{v.hullNumber} - {v.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Cards & AI Scan feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quality Radial Score Gauge */}
        <div className="card p-4 flex flex-col items-center justify-between min-h-[220px]">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 self-start">
            Hull Quality Health Score
          </h3>
          
          <div className="relative flex items-center justify-center h-32 w-32 mt-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="var(--color-bg-overlay)"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="var(--color-accent)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-text-primary">
                {currentVessel.qualityScore}%
              </span>
              <span className="text-[9px] text-text-muted font-bold uppercase mt-0.5">HEALTH RATE</span>
            </div>
          </div>

          <div className="text-[10px] text-text-muted text-center mt-4">
            Derived from {vesselNcrs.length} logged defects, rework rates, and class society attendance marks.
          </div>
        </div>

        {/* AI Camera Weld defect detection simulator */}
        <div className="card p-4 flex flex-col justify-between min-h-[240px] bg-bg-surface border-l-2 border-l-critical relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-critical uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 animate-pulse" />
                Live Camera Inspection Feed
              </span>
              
              {/* Scan Type switchers */}
              <div className="flex rounded bg-bg-overlay border border-border p-0.5">
                <button
                  onClick={() => {
                    setScanType('weld');
                    triggerToast("Switched CCTV focus to structural welds.");
                  }}
                  className={`px-1.5 py-0.5 text-[8px] font-bold rounded ${
                    scanType === 'weld' ? 'bg-primary text-text-inverse' : 'text-text-muted'
                  }`}
                >
                  Weld
                </button>
                <button
                  onClick={() => {
                    setScanType('paint');
                    triggerToast("Switched CCTV focus to coatings DFT.");
                  }}
                  className={`px-1.5 py-0.5 text-[8px] font-bold rounded ${
                    scanType === 'paint' ? 'bg-primary text-text-inverse' : 'text-text-muted'
                  }`}
                >
                  Paint
                </button>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded bg-black/40 border border-border/80 font-mono text-[10px] text-text-secondary leading-relaxed">
              {scanType === 'weld' ? (
                <>
                  <div className="text-critical font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> WELD DEFECT DETECTED
                  </div>
                  <div className="mt-1">Joint: <span className="text-accent font-bold">WJ-HN301-K28-S</span></div>
                  <div>Anomaly: Butt Weld Porosity Cluster</div>
                  <div>BV Standard Ref: Limit exceeded (2.4% vs 2.0%)</div>
                </>
              ) : (
                <>
                  <div className="text-warning font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> DFT DEVIATION RECORDED
                  </div>
                  <div className="mt-1">Zone: Bilge strake HN-101</div>
                  <div>Measured thickness: 75 microns (Target: 125 microns)</div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-3 text-[10px]">
            <span className="text-text-muted font-bold font-mono">B1-CAM-03</span>
            <button
              onClick={() => {
                if (scanType === 'weld') {
                  setNcrTitle("Porosity in Keel Frame 28 Weld");
                  setNcrDesc("NDT Ultrasonic Testing (UT) revealed cluster porosity in structural butt weld of keel plate. Density exceeds standard 2%.");
                  setNcrSeverity("Major");
                  setNcrDefectType("Weld Defect (Porosity)");
                  setNcrHold("BureauVeritas");
                } else {
                  setNcrTitle("Holiday/Thin Film on Antifouling primer");
                  setNcrDesc("Dry Film Thickness (DFT) gauges detected thin spots (75 microns vs specified 125 microns minimum) on bottom plating bilge keel strakes.");
                  setNcrSeverity("Minor");
                  setNcrDefectType("Coating Defect (Low DFT)");
                  setNcrHold("LloydRegister");
                }
                setIsAddingNcr(true);
              }}
              className="px-2.5 py-1 bg-critical hover:bg-critical/80 text-text-inverse font-bold rounded cursor-pointer transition-colors"
            >
              Generate NCR
            </button>
          </div>
        </div>

        {/* Class Society Hold Points Gate */}
        <div className="card p-4 space-y-3">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Class Hold Points Gate Tracker
          </h3>
          
          <div className="space-y-2 text-xs">
            {Object.entries(holdPoints).map(([name, status]) => (
              <div key={name} className="flex items-center justify-between p-2 rounded bg-bg-overlay border border-border">
                <span className="font-semibold text-text-primary">{name}</span>
                <button
                  onClick={() => {
                    const nextVal = status.includes('Passed') ? 'Hold Point (LR)' : 'Passed (TASNEEF)';
                    setHoldPoints(prev => ({ ...prev, [name]: nextVal }));
                    triggerToast(`Class surveyor attendance log updated for ${name}`);
                  }}
                  className={`badge cursor-pointer hover:opacity-85 ${
                    status.includes('Passed') ? 'badge-success' : 'badge-warning'
                  }`}
                >
                  {status}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NCR Management section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-wider text-text-muted">
            Non-Conformance Reports Log ({selectedHull})
          </h3>

          <button
            onClick={() => setIsAddingNcr(!isAddingNcr)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-text-inverse text-xs font-bold rounded-lg cursor-pointer transition-all shadow-glow-primary"
          >
            <Plus className="w-3.5 h-3.5" /> Log Quality NCR
          </button>
        </div>

        {/* Add NCR Form */}
        {isAddingNcr && (
          <form onSubmit={handleSubmitNcr} className="card p-4 bg-bg-surface border-border space-y-4">
            <h4 className="text-xs font-bold text-text-primary uppercase">Log New Non-Conformance Report</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase">NCR Title / Finding</label>
                <input
                  type="text"
                  placeholder="e.g., Weld Porosity at Deck Block"
                  value={ncrTitle}
                  onChange={(e) => setNcrTitle(e.target.value)}
                  className="w-full bg-bg-overlay border border-border rounded-lg text-text-primary p-2 text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Defect Classification Type</label>
                <input
                  type="text"
                  value={ncrDefectType}
                  onChange={(e) => setNcrDefectType(e.target.value)}
                  className="w-full bg-bg-overlay border border-border rounded-lg text-text-primary p-2 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Defect Description & Scan findings</label>
              <textarea
                rows={3}
                placeholder="Specify precise details of non-compliance and repair guidelines..."
                value={ncrDesc}
                onChange={(e) => setNcrDesc(e.target.value)}
                className="w-full bg-bg-overlay border border-border rounded-lg text-text-primary p-2 text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Severity</label>
                <select
                  value={ncrSeverity}
                  onChange={(e) => setNcrSeverity(e.target.value as any)}
                  className="w-full bg-bg-overlay border border-border rounded-lg text-text-primary p-2 text-xs focus:outline-none"
                >
                  <option value="Minor">Minor Defect</option>
                  <option value="Major">Major Defect</option>
                  <option value="Critical">Critical Defect</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Responsible Trade</label>
                <select
                  value={ncrTrade}
                  onChange={(e) => setNcrTrade(e.target.value as any)}
                  className="w-full bg-bg-overlay border border-border rounded-lg text-text-primary p-2 text-xs focus:outline-none"
                >
                  <option value="StructuralWelder">Weld Shop</option>
                  <option value="Painter">Coatings Shop</option>
                  <option value="Electrician">Outfitting Electrics</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Class Hold gate</label>
                <select
                  value={ncrHold}
                  onChange={(e) => setNcrHold(e.target.value as any)}
                  className="w-full bg-bg-overlay border border-border rounded-lg text-text-primary p-2 text-xs focus:outline-none"
                >
                  <option value="LloydRegister">Lloyd Register (LR)</option>
                  <option value="BureauVeritas">Bureau Veritas (BV)</option>
                  <option value="TASNEEF">TASNEEF UAE</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="flex-1 p-2 bg-accent text-text-inverse font-bold text-xs rounded-lg cursor-pointer transition-colors hover:bg-accent-hover"
                >
                  Submit NCR
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNcr(false)}
                  className="p-2 bg-bg-overlay border border-border text-text-secondary text-xs rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Data Grid */}
        <DataTable
          columns={ncrColumns}
          data={vesselNcrs}
          emptyMessage="No active non-conformances registered for this hull."
        />
      </div>
    </div>
  );
}
