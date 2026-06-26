import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Award, Zap, HelpCircle, Check, Play, RefreshCw, Layers } from 'lucide-react';

interface NestingPart {
  id: string;
  name: string;
  w: number;
  h: number;
  color: string;
  // Unoptimized coordinates
  ux: number;
  uy: number;
  // Optimized coordinates
  ox: number;
  oy: number;
  // Current coordinates
  cx: number;
  cy: number;
}

export default function NavalInnovationHub() {
  const [density, setDensity] = useState(82);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [optProgress, setOptProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Nesting Parts list
  const [parts, setParts] = useState<NestingPart[]>([
    { id: 'p1', name: 'Deck Brkt-01', w: 80, h: 50, color: '#2D9CDB', ux: 40, uy: 30, ox: 30, oy: 30, cx: 40, cy: 30 },
    { id: 'p2', name: 'Gusset Plate', w: 50, h: 80, color: '#00D4A0', ux: 140, uy: 110, ox: 115, oy: 30, cx: 140, cy: 110 },
    { id: 'p3', name: 'HN-301 Rib-A', w: 110, h: 40, color: '#FFB400', ux: 240, uy: 40, ox: 30, oy: 85, cx: 240, cy: 40 },
    { id: 'p4', name: 'HN-301 Rib-B', w: 110, h: 40, color: '#FFB400', ux: 330, uy: 120, ox: 30, oy: 130, cx: 330, cy: 120 },
    { id: 'p5', name: 'Hull Bracket', w: 70, h: 70, color: '#2D9CDB', ux: 70, uy: 130, ox: 170, oy: 30, cx: 70, cy: 130 },
    { id: 'p6', name: 'Collar Plate', w: 40, h: 45, color: '#00D4A0', ux: 280, uy: 100, ox: 145, oy: 125, cx: 280, cy: 100 },
    { id: 'p7', name: 'NDT Test Joint', w: 70, h: 30, color: '#64748B', ux: 390, uy: 40, ox: 190, oy: 140, cx: 390, cy: 40 }
  ]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Interpolate coordinates based on current slider density level (range 80 to 96)
  useEffect(() => {
    if (optimizing) return;
    const factor = Math.max(0, Math.min(1, (density - 80) / 16)); // scale factor between 0.0 and 1.0

    setParts((prev) => prev.map((p) => ({
      ...p,
      cx: p.ux + (p.ox - p.ux) * factor,
      cy: p.uy + (p.oy - p.uy) * factor
    })));
  }, [density, optimizing]);

  // Nesting canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const draw = () => {
      ctx.fillStyle = '#060D1A';
      ctx.fillRect(0, 0, 500, 200);

      // Plate grid sheets lines
      ctx.strokeStyle = 'rgba(143, 165, 192, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 500; x += 15) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 200); ctx.stroke();
      }
      for (let y = 0; y < 200; y += 15) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(500, y); ctx.stroke();
      }

      // Draw active metal template border limit bounds
      ctx.strokeStyle = '#8FA5C0';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, 460, 160);

      // Draw nesting parts templates
      parts.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.cx, p.cy, p.w, p.h);
        ctx.strokeStyle = '#060D1A';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(p.cx, p.cy, p.w, p.h);

        // Labels
        ctx.fillStyle = '#060D1A';
        ctx.font = 'bold 6px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(p.name, p.cx + 4, p.cy + 10);
      });

      // Show optimization progress indicator overlays
      if (optimizing) {
        ctx.fillStyle = 'rgba(6, 13, 26, 0.8)';
        ctx.fillRect(0, 0, 500, 200);

        ctx.strokeStyle = '#00D4A0';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(250, 90, 20, -Math.PI/2, (Math.PI * 2) * (optProgress / 100) - Math.PI/2);
        ctx.stroke();

        ctx.fillStyle = '#E8EDF5';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`NESTING ALGORITHM OPTIMIZING... ${optProgress}%`, 250, 140);
      }

      // Overlay details HUD inside feed
      ctx.fillStyle = 'rgba(0, 212, 160, 0.45)';
      ctx.font = '7px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`PLATE: MUSS_EH36_42 | ALGORITHM: TII_NEST_V4.2`, 25, 23);

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animId);
  }, [parts, optimizing, optProgress]);

  const handleOptimize = () => {
    if (optimizing) return;
    setOptimizing(true);
    setOptProgress(0);
    triggerToast("Starting TII steel nesting optimizer sequence...");

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setOptProgress(progress);

      // Animate coordinates dynamically sliding into place
      const factor = progress / 100;
      setParts((prev) => prev.map((p) => ({
        ...p,
        cx: p.ux + (p.ox - p.ux) * factor,
        cy: p.uy + (p.oy - p.uy) * factor
      })));

      if (progress >= 100) {
        clearInterval(interval);
        setOptimizing(false);
        setDensity(96);
        triggerToast("Steel nesting optimization algorithm complete. Density resolved to 96%.");
      }
    }, 120);
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
          NAVAL INNOVATION HUB (R&D)
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Collaboration workspace with the Technology Innovation Institute (TII) — Steel nesting optimization and IP/Patent registries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Nesting Optimizer Canvas - takes 2 cols */}
        <div className="lg:col-span-2 card p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-border/80 pb-3 mb-2 shrink-0">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase text-text-primary tracking-wider">
                Steel Plate Nesting Optimization Algorithm
              </h3>
            </div>
            
            <button
              onClick={handleOptimize}
              disabled={optimizing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-text-inverse text-xs font-bold rounded-lg cursor-pointer transition-all active:scale-[0.98]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${optimizing ? 'animate-spin' : ''}`} /> Optimize Blocks
            </button>
          </div>
          
          <div className="flex-1 bg-black/40 relative flex items-center justify-center min-h-[200px]">
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              className="w-full h-full object-cover rounded-lg border border-border"
            />

            <div className="absolute bottom-3 left-3 bg-bg-surface/85 backdrop-blur border border-border p-2 rounded text-[10px]">
              Nesting efficiency: <span className="text-success font-bold">{density}%</span> (Scrap: {((100 - density) * 0.16).toFixed(2)} tonnes)
            </div>
          </div>
        </div>

        {/* Nesting Slider Controls */}
        <div className="card p-5 flex flex-col justify-between min-h-[250px]">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
              Nesting Density Adjuster
            </h3>

            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-secondary">Density Factor</span>
                  <span className="text-text-primary">{density}%</span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={96}
                  value={density}
                  disabled={optimizing}
                  onChange={(e) => setDensity(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer h-1 bg-bg-muted rounded-lg appearance-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-bg-overlay border border-border text-xs text-text-secondary">
                Estimated Steel Plate cost reduction:{' '}
                <strong className="text-text-primary font-mono block mt-1 text-sm">${((density - 80) * 1850).toLocaleString()} USD</strong>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-primary-muted/12 border border-primary/20 text-[10px] text-text-secondary leading-relaxed mt-4">
            ADSB-TII R&D patent layout tracks plate waste minimization patterns on plasma cutters in real-time.
          </div>
        </div>

      </div>
    </div>
  );
}
