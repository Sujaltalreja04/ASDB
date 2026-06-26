import React, { useRef, useEffect, useState } from 'react';
import { Compass, Ship, Cpu, Eye, Info, Check, RefreshCw, Layers, Waves, AlertTriangle } from 'lucide-react';

const telemetryData: Record<string, { hull: string; progress: string; cranes: string; temp: string; defects: string }> = {
  'Bay 1': { hull: 'HN-301 AL NOUKHITHA', progress: '34% complete', cranes: '250T North: 85.4T load', temp: '28.2°C', defects: '4 Open NCRs' },
  'Bay 2': { hull: 'HN-202 NIMBA', progress: '22% complete', cranes: '250T South: 142.1T load', temp: '27.5°C', defects: '3 Open NCRs' },
  'Drydock': { hull: 'Mina Zayed FDD-01', progress: 'Operational', cranes: '50T Mobile: Standby', temp: '29.1°C', defects: '0 Open NCRs' }
};

export default function ShipyardDigitalTwin() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedBay, setSelectedBay] = useState<'Bay 1' | 'Bay 2' | 'Drydock'>('Bay 1');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Digital Twin Ballast States
  const [ballastMode, setBallastMode] = useState<'Flooding' | 'Draining' | 'Neutral'>('Neutral');
  const [ballastLevel, setBallastLevel] = useState(15); // Percentage of ballast tanks filled
  const [pumpFlowRate, setPumpFlowRate] = useState(0); // Liters/min

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Ballast pump SCADA logic simulation loop
  useEffect(() => {
    if (ballastMode === 'Neutral') {
      setPumpFlowRate(0);
      return;
    }

    const interval = setInterval(() => {
      setPumpFlowRate(1850 + Math.floor(Math.random() * 200));

      setBallastLevel((prev) => {
        if (ballastMode === 'Flooding') {
          if (prev >= 98) {
            setBallastMode('Neutral');
            triggerToast("Dry Dock Ballast Tanks flooded. Submersion level reached.");
            return 100;
          }
          return prev + 2;
        } else {
          if (prev <= 2) {
            setBallastMode('Neutral');
            triggerToast("Dry Dock Ballast Tanks drained. Dock fully afloat.");
            return 0;
          }
          return prev - 2;
        }
      });
    }, 200);

    return () => clearInterval(interval);
  }, [ballastMode]);

  // Main canvas draw loop for Isometric Shipyard
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, 650, 360);

      // Background grid
      ctx.strokeStyle = 'rgba(45, 156, 219, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 650; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 360); ctx.stroke();
      }
      for (let y = 0; y < 360; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(650, y); ctx.stroke();
      }

      // Draw Isometric Projection helper
      const projectIso = (x: number, y: number, z: number) => {
        const isoX = 325 + (x - y) * 0.86;
        const isoY = 150 + (x + y) * 0.5 - z;
        return { x: isoX, y: isoY };
      };

      // Draw isometric bounding blocks
      const drawIsoBlock = (
        x: number, 
        y: number, 
        w: number, 
        h: number, 
        z: number, 
        baseColor: string, 
        label: string, 
        isHighlighted: boolean
      ) => {
        const p1 = projectIso(x, y, 0);
        const p2 = projectIso(x + w, y, 0);
        const p3 = projectIso(x + w, y + h, 0);
        const p4 = projectIso(x, y + h, 0);

        const p1z = projectIso(x, y, z);
        const p2z = projectIso(x + w, y, z);
        const p3z = projectIso(x + w, y + h, z);
        const p4z = projectIso(x, y + h, z);

        // Highlight coloring
        const fillCol = isHighlighted ? 'rgba(0, 212, 160, 0.35)' : baseColor;
        const strokeCol = isHighlighted ? '#00D4A0' : 'rgba(143, 165, 192, 0.35)';

        // Draw bottom footprint
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = isHighlighted ? 2 : 1;

        // Draw columns walls
        ctx.fillStyle = fillCol;
        ctx.beginPath();
        ctx.moveTo(p1z.x, p1z.y); ctx.lineTo(p2z.x, p2z.y);
        ctx.lineTo(p3z.x, p3z.y); ctx.lineTo(p4z.x, p4z.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Left face shading
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y); ctx.lineTo(p4.x, p4.y);
        ctx.lineTo(p4z.x, p4z.y); ctx.lineTo(p1z.x, p1z.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Labels
        ctx.fillStyle = isHighlighted ? '#00D4A0' : '#E8EDF5';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, p1z.x + (p3z.x - p1z.x)/2, p1z.y - 8);
      };

      // Draw Water sea bay area at the bottom right
      ctx.fillStyle = '#081427';
      ctx.beginPath();
      const w1 = projectIso(50, 50, 0);
      const w2 = projectIso(250, 50, 0);
      const w3 = projectIso(250, 250, 0);
      const w4 = projectIso(50, 250, 0);
      ctx.moveTo(w1.x, w1.y); ctx.lineTo(w2.x, w2.y);
      ctx.lineTo(w3.x, w3.y); ctx.lineTo(w4.x, w4.y);
      ctx.closePath();
      ctx.fill();

      // Floating Outfitting Barge wave bobbing animation
      const bobY = Math.sin(frame * 0.04) * 2;
      const bColor = 'rgba(45, 156, 219, 0.2)';
      drawIsoBlock(120, 160, 45, 30, 8 + bobY, bColor, "BARGE FDD-W", selectedBay === 'Drydock');

      // Floating drydock water flood level indicator
      const dockDepth = (ballastLevel / 100) * 12; // submerge depth
      drawIsoBlock(-140, 120, 55, 60, 15 - dockDepth, 'rgba(45, 156, 219, 0.25)', `DRYDOCK FDD-01`, selectedBay === 'Drydock');

      // Render inner ballast water level inside drydock structure
      const innerWp1 = projectIso(-140, 120, 10 - dockDepth);
      const innerWp2 = projectIso(-85, 120, 10 - dockDepth);
      const innerWp3 = projectIso(-85, 180, 10 - dockDepth);
      const innerWp4 = projectIso(-140, 180, 10 - dockDepth);
      ctx.fillStyle = `rgba(0, 212, 160, ${0.1 + (ballastLevel / 100) * 0.35})`;
      ctx.beginPath();
      ctx.moveTo(innerWp1.x, innerWp1.y); ctx.lineTo(innerWp2.x, innerWp2.y);
      ctx.lineTo(innerWp3.x, innerWp3.y); ctx.lineTo(innerWp4.x, innerWp4.y);
      ctx.closePath();
      ctx.fill();

      // Gantry Crane rails tracks
      ctx.strokeStyle = 'rgba(143, 165, 192, 0.3)';
      ctx.lineWidth = 1.5;
      const t1 = projectIso(-120, -120, 0);
      const t2 = projectIso(120, -120, 0);
      ctx.beginPath(); ctx.moveTo(t1.x, t1.y); ctx.lineTo(t2.x, t2.y); ctx.stroke();

      // Draw Gantry Crane arches sliding along tracks
      const cranePos = Math.sin(frame * 0.008) * 80;
      drawIsoBlock(cranePos - 10, -120, 20, 15, 32, 'rgba(255, 180, 0, 0.3)', "GANTRY CRANE", selectedBay === 'Bay 1');

      // Draw Shipyard bays blocks
      drawIsoBlock(-110, -60, 60, 50, 20, 'rgba(45, 156, 219, 0.15)', "BUILD BAY 1", selectedBay === 'Bay 1');
      drawIsoBlock(-20, -10, 60, 50, 20, 'rgba(139, 92, 246, 0.15)', "BUILD BAY 2", selectedBay === 'Bay 2');

      // HUD feeds overlays
      ctx.fillStyle = 'rgba(0, 212, 160, 0.45)';
      ctx.font = '7px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`SCADA LINK STATUS: NOMINAL`, 15, 330);
      ctx.fillText(`YARD OVERHEAD COORDINATES PROJECTION: L1`, 15, 340);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [selectedBay, ballastLevel]);

  const handleFlooding = () => {
    if (ballastMode === 'Flooding') return;
    setBallastMode('Flooding');
    triggerToast("Opening drydock ballast inlet valves. Flooding tanks...");
  };

  const handleDraining = () => {
    if (ballastMode === 'Draining') return;
    setBallastMode('Draining');
    triggerToast("Activating ballast pumps. Draining tanks...");
  };

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

      {/* Header bar */}
      <div className="border-b border-border/80 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
          SHIPYARD TWIN 3D (DIGITAL TWIN)
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Interactive telemetry projection model. Visualizing build bays, floating dry dock ballast systems, and active hulls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Render Canvas Screen - takes 3 cols */}
        <div className="lg:col-span-3 card bg-bg-surface overflow-hidden border border-border relative flex flex-col justify-between">
          <div className="p-3 bg-bg-muted border-b border-border flex justify-between items-center text-xs">
            <span className="font-bold flex items-center gap-1.5 text-primary">
              <Cpu className="w-4 h-4" /> Operational 3D Projection Layer
            </span>
            <span className="text-[10px] text-text-muted font-mono">Render engine: Canvas2D / ISO</span>
          </div>

          <div className="flex-1 min-h-[360px] relative bg-black/40 flex items-center justify-center">
            <canvas ref={canvasRef} width={650} height={360} className="max-w-full" />
            
            {/* Simulation controls overlay */}
            <div className="absolute bottom-4 right-4 bg-bg-elevated/90 backdrop-blur border border-border p-3 rounded-lg text-[10px] space-y-1.5">
              <div className="font-bold text-text-secondary uppercase">SCADA Ballasting Monitor</div>
              <div className="flex justify-between gap-4">
                <span>Ballast capacity:</span>
                <span className="font-bold text-accent">{ballastLevel}%</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Pump flow rate:</span>
                <span className="font-bold text-accent">{pumpFlowRate} L/min</span>
              </div>
              <div className="flex justify-between gap-4 font-mono text-[9px]">
                <span>State:</span>
                <span className={`font-bold ${ballastMode === 'Flooding' ? 'text-critical animate-pulse' : ballastMode === 'Draining' ? 'text-accent animate-pulse' : 'text-text-muted'}`}>
                  {ballastMode === 'Neutral' ? 'NOMINAL' : ballastMode.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Information controls */}
        <div className="space-y-6">
          <div className="card p-4 space-y-3">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
              Focus Bay Details & Telemetry
            </h3>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => {
                  setSelectedBay('Bay 1');
                  triggerToast("Focused digital twin on Build Bay 1.");
                }}
                className={`w-full flex justify-between p-2.5 rounded text-left border cursor-pointer transition-all ${
                  selectedBay === 'Bay 1' ? 'bg-primary-muted/20 border-primary' : 'bg-bg-overlay border-border hover:border-border-strong'
                }`}
              >
                <div>
                  <div className="font-bold text-text-primary">Build Bay 1</div>
                  <div className="text-[10px] text-text-muted mt-0.5">HN-301 (34%)</div>
                </div>
                <span className="badge badge-success">OK</span>
              </button>

              <button
                onClick={() => {
                  setSelectedBay('Bay 2');
                  triggerToast("Focused digital twin on Build Bay 2.");
                }}
                className={`w-full flex justify-between p-2.5 rounded text-left border cursor-pointer transition-all ${
                  selectedBay === 'Bay 2' ? 'bg-primary-muted/20 border-primary' : 'bg-bg-overlay border-border hover:border-border-strong'
                }`}
              >
                <div>
                  <div className="font-bold text-text-primary">Build Bay 2</div>
                  <div className="text-[10px] text-text-muted mt-0.5">HN-202 (22%)</div>
                </div>
                <span className="badge badge-success">OK</span>
              </button>

              <button
                onClick={() => {
                  setSelectedBay('Drydock');
                  triggerToast("Focused digital twin on Mina Zayed Floating Dock.");
                }}
                className={`w-full flex justify-between p-2.5 rounded text-left border cursor-pointer transition-all ${
                  selectedBay === 'Drydock' ? 'bg-primary-muted/20 border-primary' : 'bg-bg-overlay border-border hover:border-border-strong'
                }`}
              >
                <div>
                  <div className="font-bold text-text-primary">Mina Zayed Drydock</div>
                  <div className="text-[10px] text-text-muted mt-0.5">FDD-01 Ballast system</div>
                </div>
                <span className="badge badge-success">OK</span>
              </button>
            </div>
          </div>

          {/* Ballast controls if Drydock selected */}
          {selectedBay === 'Drydock' && (
            <div className="card p-4 space-y-3 bg-bg-surface border-l-2 border-l-primary animate-fade-up">
              <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider">Dry Dock Ballast Controls</h4>
              <div className="flex gap-2">
                <button
                  onClick={handleFlooding}
                  disabled={ballastMode === 'Flooding' || ballastLevel >= 100}
                  className="flex-1 py-1.5 bg-critical hover:bg-critical-muted text-text-inverse rounded text-[11px] font-bold disabled:opacity-50 cursor-pointer text-center"
                >
                  Flood Tanks
                </button>
                <button
                  onClick={handleDraining}
                  disabled={ballastMode === 'Draining' || ballastLevel <= 0}
                  className="flex-1 py-1.5 bg-accent hover:bg-accent-hover text-text-inverse rounded text-[11px] font-bold disabled:opacity-50 cursor-pointer text-center"
                >
                  Drain Tanks
                </button>
              </div>
            </div>
          )}

          {/* Telemetry sidebar specs */}
          <div className="card p-4 space-y-2 text-xs">
            <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Localized Metrics</h4>
            <div className="space-y-1.5 text-text-secondary leading-normal">
              <div><strong className="text-text-primary">Active hull:</strong> {telemetryData[selectedBay].hull}</div>
              <div><strong className="text-text-primary">State:</strong> {telemetryData[selectedBay].progress}</div>
              <div><strong className="text-text-primary">Crane status:</strong> {telemetryData[selectedBay].cranes}</div>
              <div><strong className="text-text-primary">Defects:</strong> {telemetryData[selectedBay].defects}</div>
              <div><strong className="text-text-primary">Ambient:</strong> {telemetryData[selectedBay].temp}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
