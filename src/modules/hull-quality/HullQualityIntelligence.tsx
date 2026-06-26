import React, { useState, useEffect, useRef } from 'react';
import { useYardDataStore } from '../../lib/mock-data/store';
import DataTable from '../../components/ui/DataTable';
import { Shield, CheckCircle2, AlertTriangle, Eye, Plus, ArrowUpRight, Zap, Target, Check, Camera } from 'lucide-react';
import { NCR, ClassSociety } from '../../types/adsb';

interface QualityAnomaly {
  id: string; // Joint ID, e.g. WJ-HN301-FR42-STBD
  type: string;
  defectClass: string;
  severity: 'Minor' | 'Major' | 'Critical';
  x: number;
  y: number;
  measured: string;
  target: string;
  description: string;
  hold: ClassSociety;
}

const weldAnomalies: QualityAnomaly[] = [
  {
    id: 'WJ-HN301-FR42-STBD',
    type: 'Porosity Cluster',
    defectClass: 'Weld Defect (Porosity)',
    severity: 'Major',
    x: 110,
    y: 80,
    measured: '2.8% volume density',
    target: 'Max 2.0% (BV Class Rules)',
    description: 'NDT Ultrasonic scan detected cluster porosity in bulkhead butt weld joint at frame 42 starboard.',
    hold: 'BureauVeritas'
  },
  {
    id: 'WJ-HN301-FR56-PORT',
    type: 'Lack of Fusion',
    defectClass: 'Weld Defect (Fusion)',
    severity: 'Minor',
    x: 250,
    y: 110,
    measured: '12mm intermittent gap',
    target: '0mm allowed (TASNEEF)',
    description: 'Minor lack of weld fusion at main deck plate fillet joint. Standard local grinding and re-weld required.',
    hold: 'TASNEEF'
  },
  {
    id: 'WJ-HN301-FR12-KEEL',
    type: 'Slag Inclusion',
    defectClass: 'Weld Defect (Inclusion)',
    severity: 'Critical',
    x: 390,
    y: 90,
    measured: '45mm continuous slag line',
    target: '0mm allowed (LR Class Rules)',
    description: 'Critical continuous slag inclusion in keel backing butt joint during X-ray NDT checking.',
    hold: 'LloydRegister'
  }
];

const paintAnomalies: QualityAnomaly[] = [
  {
    id: 'PJ-HN301-FR38-STBD',
    type: 'Low Dry Film Thickness',
    defectClass: 'Coating Defect (Low DFT)',
    severity: 'Minor',
    x: 130,
    y: 75,
    measured: '72 microns',
    target: '125 microns Min (LR Spec)',
    description: 'Magnetic DFT gauge check flagged thin film spots on bottom hull plating bilge strakes.',
    hold: 'LloydRegister'
  },
  {
    id: 'PJ-HN301-FR62-PORT',
    type: 'Coating Blistering',
    defectClass: 'Coating Defect (Blistering)',
    severity: 'Major',
    x: 270,
    y: 120,
    measured: 'Size 4, Frequency Medium',
    target: 'Class 0 defects (BV Spec)',
    description: 'Solvent entrapment causing localized surface blistering on drydock outfitting plates.',
    hold: 'BureauVeritas'
  },
  {
    id: 'PJ-HN301-FR15-STBD',
    type: 'Coating Runs / Sagging',
    defectClass: 'Coating Defect (Runs)',
    severity: 'Minor',
    x: 360,
    y: 100,
    measured: '1.2m run marks',
    target: 'Smooth uniform coat (TASNEEF)',
    description: 'Excessive paint application sagging on superstructures. Requires sanding down and re-spray.',
    hold: 'TASNEEF'
  }
];

export default function HullQualityIntelligence() {
  const { vessels, ncrs, addNCR, updateNCRStatus } = useYardDataStore();
  const [selectedHull, setSelectedHull] = useState('HN-301');
  const [isAddingNcr, setIsAddingNcr] = useState(false);
  const [scanType, setScanType] = useState<'weld' | 'paint'>('weld');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Selected anomaly details
  const [activeAnomalyIdx, setActiveAnomalyIdx] = useState<number>(0);

  // Form State
  const [ncrTitle, setNcrTitle] = useState('');
  const [ncrDesc, setNcrDesc] = useState('');
  const [ncrSeverity, setNcrSeverity] = useState<'Minor' | 'Major' | 'Critical'>('Minor');
  const [ncrDefectType, setNcrDefectType] = useState('Weld Defect');
  const [ncrTrade, setNcrTrade] = useState<'StructuralWelder' | 'Painter' | 'Electrician'>('StructuralWelder');
  const [ncrHold, setNcrHold] = useState<ClassSociety>('LloydRegister');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

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

  const activeAnomalies = scanType === 'weld' ? weldAnomalies : paintAnomalies;
  const currentAnomaly = activeAnomalies[activeAnomalyIdx] || activeAnomalies[0];

  // Auto-fill NCR fields when selected anomaly changes
  useEffect(() => {
    if (currentAnomaly) {
      setNcrTitle(`${currentAnomaly.type} at Joint ${currentAnomaly.id}`);
      setNcrDesc(currentAnomaly.description);
      setNcrSeverity(currentAnomaly.severity);
      setNcrDefectType(currentAnomaly.defectClass);
      setNcrHold(currentAnomaly.hold);
      setNcrTrade(scanType === 'weld' ? 'StructuralWelder' : 'Painter');
    }
  }, [activeAnomalyIdx, scanType, selectedHull]);

  // Canvas drawing loop for defects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pulseTime = 0;

    const draw = () => {
      pulseTime += 0.05;
      const pulseSize = 8 + Math.sin(pulseTime) * 3.5;

      // Draw dark radar background
      ctx.fillStyle = '#060D1A';
      ctx.fillRect(0, 0, 480, 180);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(0, 212, 160, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 480; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 180); ctx.stroke();
      }
      for (let y = 0; y < 180; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(480, y); ctx.stroke();
      }

      if (scanType === 'weld') {
        // Draw Steel Plate background with double-seam weld line
        ctx.fillStyle = '#111928';
        ctx.fillRect(10, 20, 460, 140);
        
        ctx.strokeStyle = '#2B3544';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 20, 460, 140);

        // Draw main weld seam down the center
        ctx.fillStyle = '#222F43';
        ctx.fillRect(10, 85, 460, 10);
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(10, 85); ctx.lineTo(470, 85);
        ctx.moveTo(10, 95); ctx.lineTo(470, 95);
        ctx.stroke();

        // Draw cross-beams
        ctx.fillStyle = '#1D283A';
        ctx.fillRect(100, 20, 25, 140);
        ctx.fillRect(240, 20, 25, 140);
        ctx.fillRect(380, 20, 25, 140);

      } else {
        // Paint scan type: draw coating DFT heat map checks
        // Draw steel plate base
        ctx.fillStyle = '#111928';
        ctx.fillRect(10, 20, 460, 140);
        ctx.strokeStyle = '#2B3544';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 20, 460, 140);

        // Draw colored spray patches (DFT density map)
        // Normal green areas
        ctx.fillStyle = 'rgba(0, 212, 160, 0.1)';
        ctx.beginPath();
        ctx.arc(150, 90, 80, 0, Math.PI * 2);
        ctx.arc(320, 80, 90, 0, Math.PI * 2);
        ctx.fill();

        // Thin yellow/red spots (Low DFT regions)
        ctx.fillStyle = 'rgba(255, 180, 0, 0.18)'; // PJ-1 Low DFT
        ctx.beginPath(); ctx.arc(130, 75, 25, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = 'rgba(255, 59, 71, 0.15)'; // PJ-2 Blistering
        ctx.beginPath(); ctx.arc(270, 120, 30, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = 'rgba(255, 180, 0, 0.15)'; // PJ-3 Sagging
        ctx.beginPath(); ctx.arc(360, 100, 20, 0, Math.PI * 2); ctx.fill();
      }

      // Draw active anomalies callout pins
      activeAnomalies.forEach((anom, idx) => {
        const isActive = activeAnomalyIdx === idx;
        const color = anom.severity === 'Critical' ? '#FF3B47' : anom.severity === 'Major' ? '#FFB400' : '#2D9CDB';

        // Blinking indicator circle
        ctx.strokeStyle = color;
        ctx.lineWidth = isActive ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.arc(anom.x, anom.y, isActive ? pulseSize : 6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(anom.x, anom.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Label box overlay
        ctx.fillStyle = 'rgba(6, 13, 26, 0.85)';
        ctx.strokeStyle = isActive ? '#00D4A0' : 'rgba(143, 165, 192, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Position label slightly offset
        const lx = anom.x - 45;
        const ly = anom.y - 32;
        ctx.roundRect(lx, ly, 90, 20, 3);
        ctx.fill();
        ctx.stroke();

        // Text inside label
        ctx.fillStyle = isActive ? '#00D4A0' : '#E8EDF5';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        // Truncate joint number
        const shortName = anom.id.replace('WJ-HN301-', '').replace('PJ-HN301-', '');
        ctx.fillText(shortName, lx + 45, ly + 8);
        ctx.fillStyle = '#8FA5C0';
        ctx.font = '6px Inter';
        ctx.fillText(anom.type, lx + 45, ly + 16);
      });

      // Camera scanner HUD boundary lines
      ctx.strokeStyle = 'rgba(0, 212, 160, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // TL
      ctx.moveTo(15, 30); ctx.lineTo(15, 15); ctx.lineTo(30, 15);
      // TR
      ctx.moveTo(465, 30); ctx.lineTo(465, 15); ctx.lineTo(450, 15);
      // BL
      ctx.moveTo(15, 150); ctx.lineTo(15, 165); ctx.lineTo(30, 165);
      // BR
      ctx.moveTo(465, 150); ctx.lineTo(465, 165); ctx.lineTo(450, 165);
      ctx.stroke();

      // Telemetry indicators
      ctx.fillStyle = 'rgba(0, 212, 160, 0.5)';
      ctx.font = '7px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`CCTV SCANNER: ACTIVE | JOINT COUNT: ${activeAnomalies.length}`, 20, 28);

      requestRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [scanType, activeAnomalyIdx]);

  // Click on canvas to select anomalies
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Detect click distance to any anomaly point
    let clickedIdx = -1;
    activeAnomalies.forEach((anom, idx) => {
      const dist = Math.hypot(anom.x - x, anom.y - y);
      if (dist < 18) {
        clickedIdx = idx;
      }
    });

    if (clickedIdx !== -1) {
      setActiveAnomalyIdx(clickedIdx);
      triggerToast(`Focused on ADSB Joint: ${activeAnomalies[clickedIdx].id}`);
    }
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
      location: `${currentVessel.hullNumber}, Joint ${currentAnomaly.id}`,
      trade: ncrTrade,
      reportedBy: 'Saeed Al-Qubaisi (Operations Manager)',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      classSocietyHold: ncrHold
    });

    // Reset Form
    setNcrTitle('');
    setNcrDesc('');
    setIsAddingNcr(false);
    triggerToast(`Logged quality Non-Conformance Report for ${currentAnomaly.id}`);
  };

  // Radial Quality Gauge calculations
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentVessel.qualityScore / 100) * circumference;

  const ncrColumns = [
    { header: 'NCR Number', accessor: 'ncrNumber' as const },
    { header: 'Joint ID & Location', accessor: (row: NCR) => (
        <div>
          <div className="font-bold text-text-primary">{row.location}</div>
          <div className="text-[10px] text-text-muted mt-0.5">{row.title}</div>
        </div>
      )
    },
    { header: 'Defect Type', accessor: 'defectType' as const },
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
        <div className="card p-4 flex flex-col items-center justify-between min-h-[240px]">
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
        <div className="card p-4 lg:col-span-2 flex flex-col justify-between min-h-[240px] bg-bg-surface border-l-2 border-l-accent relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between border-b border-border/80 pb-2 mb-3">
              <span className="text-[10px] font-black text-accent uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 animate-pulse" />
                Live Camera Weld/Paint NDT Inspection
              </span>
              
              {/* Scan Type switchers */}
              <div className="flex rounded bg-bg-overlay border border-border p-0.5">
                <button
                  onClick={() => {
                    setScanType('weld');
                    setActiveAnomalyIdx(0);
                    triggerToast("Switched CCTV focus to structural welds.");
                  }}
                  className={`px-2.5 py-0.5 text-[9px] font-bold rounded cursor-pointer ${
                    scanType === 'weld' ? 'bg-primary text-text-inverse' : 'text-text-muted'
                  }`}
                >
                  Weld Inspection
                </button>
                <button
                  onClick={() => {
                    setScanType('paint');
                    setActiveAnomalyIdx(0);
                    triggerToast("Switched CCTV focus to coatings DFT.");
                  }}
                  className={`px-2.5 py-0.5 text-[9px] font-bold rounded cursor-pointer ${
                    scanType === 'paint' ? 'bg-primary text-text-inverse' : 'text-text-muted'
                  }`}
                >
                  Paint DFT Coating
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Canvas Visualizer */}
              <div className="md:col-span-2 relative bg-black/45 rounded-lg overflow-hidden border border-border/60">
                <canvas
                  ref={canvasRef}
                  width={480}
                  height={180}
                  onClick={handleCanvasClick}
                  className="w-full h-full object-cover rounded-lg cursor-pointer"
                />
                
                <div className="absolute bottom-2 right-2 bg-bg-surface/85 backdrop-blur px-2 py-0.5 rounded text-[8px] font-mono border border-border/80 text-text-secondary">
                  Click on joints to inspect
                </div>
              </div>

              {/* Selected Defect Info Details */}
              <div className="p-3 rounded-lg bg-bg-overlay border border-border flex flex-col justify-between font-mono text-[10px] text-text-secondary leading-relaxed">
                <div>
                  <div className="text-critical font-bold flex items-center gap-1 border-b border-border/60 pb-1.5 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-critical shrink-0" />
                    {currentAnomaly.severity.toUpperCase()} DEFECT FLAGGED
                  </div>
                  <div>Joint ID: <span className="text-text-primary font-bold block text-xs">{currentAnomaly.id}</span></div>
                  <div className="mt-1">Class: <span className="text-accent font-semibold">{currentAnomaly.type}</span></div>
                  <div>Measured: <span className="text-text-primary">{currentAnomaly.measured}</span></div>
                  <div>Target: <span className="text-text-muted">{currentAnomaly.target}</span></div>
                </div>

                <button
                  onClick={() => setIsAddingNcr(true)}
                  className="mt-3 w-full py-1.5 bg-critical hover:bg-critical/90 text-text-inverse font-bold rounded-lg cursor-pointer transition-colors text-center text-[9px] uppercase tracking-wider"
                >
                  Generate Quality NCR
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Hold Points and NCR Creation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Class Society Hold Points Gate */}
        <div className="card p-4 space-y-3">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border/80 pb-2">
            Class Society Hold Points Gate Tracker
          </h3>
          
          <div className="space-y-2.5 text-xs">
            {Object.entries(holdPoints).map(([name, status]) => (
              <div key={name} className="flex items-center justify-between p-2.5 rounded bg-bg-overlay border border-border">
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

        {/* Add NCR Form - takes 2 cols */}
        <div className="lg:col-span-2">
          {isAddingNcr ? (
            <form onSubmit={handleSubmitNcr} className="card p-4 bg-bg-surface border-border space-y-4">
              <h4 className="text-xs font-bold text-text-primary uppercase border-b border-border/80 pb-2">
                Log New Non-Conformance Report (NCR) for {currentAnomaly.id}
              </h4>
              
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
                  rows={2}
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
          ) : (
            <div className="card p-5 bg-bg-overlay border border-border border-dashed h-full flex flex-col items-center justify-center text-center text-xs text-text-muted">
              <Camera className="w-8 h-8 text-text-muted mb-2 animate-pulse" />
              <span>Select any marked defect on the Live Camera scan to review and log a Non-Conformance Report (NCR).</span>
            </div>
          )}
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
            <Plus className="w-3.5 h-3.5" /> Log Custom NCR
          </button>
        </div>

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
