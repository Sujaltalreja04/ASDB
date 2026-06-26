import React, { useState, useEffect, useRef } from 'react';
import { Video, ShieldAlert, AlertTriangle, Check, RefreshCw, Eye, EyeOff, Sliders, Settings2, Maximize2, Activity, Play, Shield, ShieldCheck, MapPin, ListCollapse, Volume2, VolumeX } from 'lucide-react';

// ==========================================
// CAM 1: Mussafah Bay 1 (HN-301 Assembly)
// ==========================================
interface Worker {
  id: string;
  name: string;
  x: number;
  y: number;
  tx: number;
  ty: number;
  helmet: boolean;
}

function Cam1AssemblyFeed({ 
  showBoxes, 
  showHeatmaps, 
  breachActive, 
  privacyMode 
}: { 
  showBoxes: boolean; 
  showHeatmaps: boolean; 
  breachActive: boolean; 
  privacyMode: boolean; 
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workersRef = useRef<Worker[]>([
    { id: 'W-01', x: 70, y: 150, tx: 70, ty: 150, helmet: true, name: 'A. Mansoori' },
    { id: 'W-02', x: 120, y: 180, tx: 120, ty: 180, helmet: true, name: 'S. Dutt' },
    { id: 'W-03', x: 320, y: 160, tx: 320, ty: 160, helmet: true, name: 'J. Smith' }
  ]);
  const trailsRef = useRef<Array<{ x: number; y: number }>>([]);
  const frameCountRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const updateAndDraw = () => {
      frameCountRef.current++;
      
      // Update workers positions
      workersRef.current.forEach((w) => {
        if (w.id === 'W-03') {
          if (breachActive) {
            w.tx = 220;
            w.ty = 130;
            w.helmet = false;
          } else {
            w.helmet = true;
            if (w.tx === 220 && w.ty === 130) {
              w.tx = 320;
              w.ty = 160;
            }
          }
        }

        // Move towards target coordinates
        w.x += (w.tx - w.x) * 0.03;
        w.y += (w.ty - w.y) * 0.03;

        // Pick new random wander target if arrived
        const dist = Math.hypot(w.tx - w.x, w.ty - w.y);
        if (dist < 6 && (!breachActive || w.id !== 'W-03')) {
          if (w.id === 'W-01') {
            w.tx = 30 + Math.random() * 110;
            w.ty = 110 + Math.random() * 80;
          } else if (w.id === 'W-02') {
            w.tx = 100 + Math.random() * 80;
            w.ty = 130 + Math.random() * 70;
          } else if (w.id === 'W-03') {
            w.tx = 280 + Math.random() * 90;
            w.ty = 120 + Math.random() * 80;
          }
        }

        // Add trail points for heatmap
        if (frameCountRef.current % 15 === 0) {
          trailsRef.current.push({ x: w.x, y: w.y });
          if (trailsRef.current.length > 60) {
            trailsRef.current.shift();
          }
        }
      });

      const time = Date.now();
      const craneX = 180 + Math.sin(time * 0.001) * 70;

      // Draw background
      ctx.fillStyle = '#060D1A';
      ctx.fillRect(0, 0, 400, 240);

      // Draw cyber-style grid lines
      ctx.strokeStyle = 'rgba(45, 156, 219, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 400; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 240);
        ctx.stroke();
      }
      for (let y = 0; y < 240; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(400, y);
        ctx.stroke();
      }

      // Draw HN-301 build outline structure
      ctx.strokeStyle = 'rgba(143, 165, 192, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, 190);
      ctx.lineTo(360, 190);
      ctx.lineTo(330, 90);
      ctx.lineTo(70, 90);
      ctx.closePath();
      ctx.stroke();

      // Crane exclusion zone boundary
      const flashAlarm = breachActive && (frameCountRef.current % 30 < 15);
      ctx.strokeStyle = flashAlarm ? 'rgba(255, 59, 71, 0.85)' : 'rgba(255, 59, 71, 0.35)';
      ctx.fillStyle = flashAlarm ? 'rgba(255, 59, 71, 0.08)' : 'rgba(255, 59, 71, 0.02)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.rect(170, 80, 100, 110);
      ctx.stroke();
      ctx.fill();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(255, 59, 71, 0.7)';
      ctx.font = '7px monospace';
      ctx.fillText("CRANE EXCLUSION ZONE", 175, 92);

      // Render heatmaps
      if (showHeatmaps) {
        trailsRef.current.forEach((t) => {
          const grad = ctx.createRadialGradient(t.x, t.y, 1, t.x, t.y, 18);
          grad.addColorStop(0, 'rgba(255, 90, 0, 0.18)');
          grad.addColorStop(1, 'rgba(255, 90, 0, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 18, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Gantry Crane structure
      ctx.strokeStyle = '#FFB400';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(craneX - 30, 50);
      ctx.lineTo(craneX + 30, 50);
      ctx.stroke();

      ctx.strokeStyle = '#8FA5C0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(craneX, 50);
      ctx.lineTo(craneX, 110);
      ctx.stroke();

      ctx.fillStyle = '#FFB400';
      ctx.fillRect(craneX - 8, 110, 16, 10);

      // Render Workers
      workersRef.current.forEach((w) => {
        const isBreaching = !w.helmet && breachActive;

        // Draw dot points
        ctx.fillStyle = isBreaching ? '#FF3B47' : '#00D4A0';
        ctx.beginPath();
        ctx.arc(w.x, w.y, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isBreaching ? '#FF3B47' : '#00D4A0';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(w.x, w.y);
        ctx.lineTo(w.x, w.y + 7);
        ctx.stroke();

        // Privacy Blur Mode
        if (privacyMode) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
          ctx.beginPath();
          ctx.arc(w.x, w.y - 2, 7, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bounding Boxes
        if (showBoxes) {
          ctx.strokeStyle = isBreaching ? '#FF3B47' : 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = isBreaching ? 1.5 : 1;
          ctx.beginPath();
          ctx.rect(w.x - 12, w.y - 8, 24, 22);
          ctx.stroke();

          ctx.fillStyle = isBreaching ? 'rgba(255, 59, 71, 0.9)' : 'rgba(10, 22, 40, 0.8)';
          ctx.fillRect(w.x - 12, w.y - 17, 24, 9);
          
          ctx.fillStyle = isBreaching ? '#FFFFFF' : '#E8EDF5';
          ctx.font = '6px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(isBreaching ? "NO HELMET" : "WORKER", w.x, w.y - 10);
        }
      });

      // HUD feeds info overlay
      ctx.fillStyle = 'rgba(0, 212, 160, 0.4)';
      ctx.font = '7px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`FPS: ${(59.7 + Math.random() * 0.5).toFixed(1)}`, 15, 225);
      ctx.fillText(`ZONE: BAY_1_ASSY`, 15, 215);

      animationId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [showBoxes, showHeatmaps, breachActive, privacyMode]);

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={240} 
      className="w-full h-full object-cover" 
    />
  );
}

// ==========================================
// CAM 2: Blasting Area SBS-02 Inlet
// ==========================================
interface BlastingParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

function Cam2BlastingFeed({ 
  showBoxes, 
  showHeatmaps, 
  calibrationActive, 
  setCalibrationActive,
  calibProgress,
  setCalibProgress,
  pressure,
  setPressure
}: { 
  showBoxes: boolean; 
  showHeatmaps: boolean; 
  calibrationActive: boolean;
  setCalibrationActive: (v: boolean) => void;
  calibProgress: number;
  setCalibProgress: React.Dispatch<React.SetStateAction<number>>;
  pressure: number;
  setPressure: (v: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<BlastingParticle[]>([]);
  const pressureHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    if (pressureHistoryRef.current.length === 0) {
      for (let i = 0; i < 40; i++) {
        pressureHistoryRef.current.push(3.1 + Math.random() * 0.2);
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const updateAndDraw = () => {
      let currentP = pressure;

      // Calibration progress logic
      if (calibrationActive) {
        currentP = 3.2 + (4.6 * (calibProgress / 100));
      } else {
        if (pressure > 5.0) {
          currentP = 7.6 + Math.sin(Date.now() * 0.005) * 0.2;
        } else {
          currentP = 3.1 + Math.sin(Date.now() * 0.002) * 0.1;
        }
      }

      // Record pressure history
      if (Date.now() % 10 === 0 || pressureHistoryRef.current.length < 40) {
        pressureHistoryRef.current.push(currentP);
        if (pressureHistoryRef.current.length > 40) {
          pressureHistoryRef.current.shift();
        }
      }

      const nozzleX = 280;
      const nozzleY = 90 + Math.sin(Date.now() * 0.003) * 35;
      const isNormal = currentP > 5.0;

      // Emit sandblast grits
      const emitCount = isNormal ? 5 : 1;
      for (let i = 0; i < emitCount; i++) {
        particlesRef.current.push({
          x: nozzleX,
          y: nozzleY,
          vx: -5 - Math.random() * 5,
          vy: (Math.random() - 0.5) * 4,
          life: 0,
          maxLife: 30 + Math.random() * 15
        });
      }

      // Update grits
      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life > p.maxLife || p.x < 50) {
          particlesRef.current.splice(idx, 1);
        }
      });

      // Clear
      ctx.fillStyle = '#060D1A';
      ctx.fillRect(0, 0, 400, 240);

      // Grid
      ctx.strokeStyle = 'rgba(45, 156, 219, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 400; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 240);
        ctx.stroke();
      }

      // Draw Keel block workpiece plate
      ctx.fillStyle = '#17273C';
      ctx.fillRect(40, 40, 25, 160);
      ctx.strokeStyle = '#8FA5C0';
      ctx.strokeRect(40, 40, 25, 160);

      // Blasting blast hotspot heatmap
      if (showHeatmaps) {
        const grad = ctx.createRadialGradient(65, nozzleY, 4, 65, nozzleY, 45);
        grad.addColorStop(0, isNormal ? 'rgba(255, 90, 0, 0.35)' : 'rgba(255, 90, 0, 0.08)');
        grad.addColorStop(1, 'rgba(255, 90, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(65, nozzleY, 45, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw grits particles
      particlesRef.current.forEach((p) => {
        const alpha = 1 - (p.life / p.maxLife);
        ctx.fillStyle = isNormal ? `rgba(255, 180, 0, ${alpha})` : `rgba(143, 165, 192, ${alpha * 0.6})`;
        ctx.fillRect(p.x, p.y, 2, 2);
      });

      // Draw robotic nozzle body
      ctx.fillStyle = '#2A3F5A';
      ctx.fillRect(nozzleX, nozzleY - 10, 40, 20);
      ctx.strokeStyle = '#8FA5C0';
      ctx.strokeRect(nozzleX, nozzleY - 10, 40, 20);
      ctx.fillStyle = '#0D1E36';
      ctx.fillRect(nozzleX - 10, nozzleY - 4, 10, 8);

      // Bounding box nozzle robot
      if (showBoxes) {
        ctx.strokeStyle = !isNormal ? '#FF3B47' : 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(nozzleX - 15, nozzleY - 15, 60, 30);
        ctx.stroke();

        ctx.fillStyle = 'rgba(10, 22, 40, 0.85)';
        ctx.fillRect(nozzleX - 15, nozzleY - 24, 60, 9);
        
        ctx.fillStyle = !isNormal ? '#FF3B47' : '#E8EDF5';
        ctx.font = '6px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("NOZZLE_ARM", nozzleX + 15, nozzleY - 18);
      }

      // Calibration routine display overlays
      if (calibrationActive) {
        ctx.fillStyle = 'rgba(6, 13, 26, 0.85)';
        ctx.fillRect(0, 0, 400, 240);

        // Spinner circle
        ctx.strokeStyle = '#00D4A0';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(200, 110, 24, -Math.PI / 2, (Math.PI * 2) * (calibProgress / 100) - Math.PI / 2);
        ctx.stroke();

        ctx.fillStyle = '#E8EDF5';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`SCADA CALIBRATING... ${calibProgress}%`, 200, 160);
      }

      // Telemetry log HUD inside feed
      ctx.fillStyle = !isNormal ? '#FF3B47' : '#00D4A0';
      ctx.font = '7px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`PRESSURE: ${currentP.toFixed(2)} BAR`, 15, 215);
      ctx.fillStyle = 'rgba(0, 212, 160, 0.4)';
      ctx.fillText(`SCADA_STATUS: ${!isNormal ? "LOW_PRESSURE_ALERT" : "NOMINAL"}`, 15, 225);

      // Realtime sparkline graph widget inside bottom corner
      const graphX = 265;
      const graphY = 190;
      ctx.strokeStyle = 'rgba(143, 165, 192, 0.2)';
      ctx.strokeRect(graphX, graphY, 120, 35);
      ctx.fillStyle = 'rgba(6, 13, 26, 0.6)';
      ctx.fillRect(graphX, graphY, 120, 35);

      ctx.strokeStyle = !isNormal ? '#FF3B47' : '#00D4A0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      pressureHistoryRef.current.forEach((val, idx) => {
        const xPos = graphX + (idx / 40) * 120;
        const normVal = (val - 2.0) / 7.0; // range 2 to 9
        const yPos = graphY + 35 - (Math.max(0, Math.min(1, normVal)) * 30);
        if (idx === 0) {
          ctx.moveTo(xPos, yPos);
        } else {
          ctx.lineTo(xPos, yPos);
        }
      });
      ctx.stroke();

      animationId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [showBoxes, showHeatmaps, calibrationActive, calibProgress, pressure]);

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={240} 
      className="w-full h-full object-cover" 
    />
  );
}

// ==========================================
// CAM 3: Quayside OPV Fitting Wharf
// ==========================================
interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

function Cam3FittingFeed({ 
  showBoxes, 
  showHeatmaps, 
  thermalMode 
}: { 
  showBoxes: boolean; 
  showHeatmaps: boolean; 
  thermalMode: boolean; 
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const radarAngleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const updateAndDraw = () => {
      radarAngleRef.current += 0.035;
      if (radarAngleRef.current > Math.PI * 2) {
        radarAngleRef.current -= Math.PI * 2;
      }

      // Generate welder welding sparks
      if (Math.random() < 0.75) {
        for (let i = 0; i < 2; i++) {
          sparksRef.current.push({
            x: 130,
            y: 120,
            vx: (Math.random() - 0.5) * 2.5,
            vy: -1.5 - Math.random() * 2.5,
            alpha: 1.0,
            size: 1 + Math.random() * 1.5
          });
        }
      }

      // Update sparks physics
      sparksRef.current.forEach((s, index) => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.12; // gravity pulling sparks
        s.alpha -= 0.025;
        if (s.alpha <= 0 || s.y > 175) {
          sparksRef.current.splice(index, 1);
        }
      });

      // Clear
      ctx.fillStyle = '#060D1A';
      ctx.fillRect(0, 0, 400, 240);

      // Water body
      ctx.fillStyle = '#091629';
      ctx.fillRect(0, 175, 400, 65);

      ctx.strokeStyle = 'rgba(45, 156, 219, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 180 + Math.sin(Date.now() * 0.002) * 1.8);
      ctx.lineTo(400, 180 + Math.sin(Date.now() * 0.002) * 1.8);
      ctx.stroke();

      if (thermalMode) {
        // Thermal layout
        ctx.fillStyle = '#0F092B';
        ctx.fillRect(0, 0, 400, 240);

        // Water glows cool violet
        ctx.fillStyle = '#1D0D4B';
        ctx.fillRect(0, 175, 400, 65);

        // Vessel hull in thermograph spectrum
        ctx.fillStyle = '#2A1F85';
        ctx.beginPath();
        ctx.moveTo(35, 155);
        ctx.lineTo(365, 155);
        ctx.lineTo(335, 95);
        ctx.lineTo(125, 95);
        ctx.closePath();
        ctx.fill();

        // Engine core thermal glow
        const engineGrad = ctx.createRadialGradient(235, 135, 2, 235, 135, 30);
        engineGrad.addColorStop(0, '#FFFFFF'); // white hot
        engineGrad.addColorStop(0.3, '#FFB400'); // orange
        engineGrad.addColorStop(0.65, '#FF3B47'); // red
        engineGrad.addColorStop(1, '#2A1F85');
        ctx.fillStyle = engineGrad;
        ctx.beginPath();
        ctx.arc(235, 135, 30, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Normal Steel grey hull structure
        ctx.fillStyle = '#1E3555';
        ctx.beginPath();
        ctx.moveTo(35, 155);
        ctx.lineTo(365, 155);
        ctx.lineTo(335, 95);
        ctx.lineTo(125, 95);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#8FA5C0';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#0E1E34';
        ctx.fillRect(150, 68, 120, 28);
        ctx.strokeRect(150, 68, 120, 28);
      }

      // Radar mast
      const rx = 210;
      const ry = 55;
      ctx.strokeStyle = '#8FA5C0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(rx, 68);
      ctx.lineTo(rx, ry);
      ctx.stroke();

      ctx.fillStyle = '#E8EDF5';
      ctx.beginPath();
      ctx.ellipse(rx, ry, 7, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sweeping radar scan cone line
      ctx.fillStyle = 'rgba(0, 212, 160, 0.12)';
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.arc(rx, ry, 75, radarAngleRef.current - 0.2, radarAngleRef.current + 0.2);
      ctx.closePath();
      ctx.fill();

      // Welding spark particles
      sparksRef.current.forEach((s) => {
        ctx.fillStyle = `rgba(255, 230, 80, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Welder worker outline
      ctx.fillStyle = '#00D4A0';
      ctx.beginPath();
      ctx.arc(120, 115, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#00D4A0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(120, 115);
      ctx.lineTo(120, 122);
      ctx.stroke();

      // Welding glowing spot
      const flashGrad = ctx.createRadialGradient(130, 120, 0.5, 130, 120, 7);
      flashGrad.addColorStop(0, '#FFFFFF');
      flashGrad.addColorStop(0.3, 'rgba(0, 212, 160, 0.8)');
      flashGrad.addColorStop(1, 'rgba(0, 212, 160, 0)');
      ctx.fillStyle = flashGrad;
      ctx.beginPath();
      ctx.arc(130, 120, 7, 0, Math.PI * 2);
      ctx.fill();

      // Heatmaps weld workspace
      if (showHeatmaps) {
        const heatGrad = ctx.createRadialGradient(130, 120, 2, 130, 120, 25);
        heatGrad.addColorStop(0, 'rgba(255, 90, 0, 0.3)');
        heatGrad.addColorStop(1, 'rgba(255, 90, 0, 0)');
        ctx.fillStyle = heatGrad;
        ctx.beginPath();
        ctx.arc(130, 120, 25, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Bounding Boxes
      if (showBoxes) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(108, 107, 24, 20);
        ctx.stroke();

        ctx.fillStyle = 'rgba(10, 22, 40, 0.8)';
        ctx.fillRect(108, 99, 24, 8);
        ctx.fillStyle = '#E8EDF5';
        ctx.font = '5px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("WELDER", 120, 105);

        ctx.strokeStyle = '#00D4A0';
        ctx.beginPath();
        ctx.rect(198, 48, 24, 25);
        ctx.stroke();

        ctx.fillStyle = 'rgba(10, 22, 40, 0.8)';
        ctx.fillRect(198, 40, 24, 8);
        ctx.fillStyle = '#00D4A0';
        ctx.fillText("RADAR_AI", 210, 46);
      }

      // HUD Feed stats overlay
      ctx.fillStyle = 'rgba(0, 212, 160, 0.4)';
      ctx.font = '7px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`CAM3: OPV_FITTING_WHARF`, 15, 215);
      ctx.fillText(`SPECTRA: ${thermalMode ? "THERMAL_IR" : "VISUAL_RGB"}`, 15, 225);

      animationId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [showBoxes, showHeatmaps, thermalMode]);

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={240} 
      className="w-full h-full object-cover" 
    />
  );
}

// ==========================================
// CAM 4: Marine Store Warehouse 1
// ==========================================
function Cam4WarehouseFeed({ 
  showBoxes, 
  showHeatmaps, 
  speedLimitThreshold 
}: { 
  showBoxes: boolean; 
  showHeatmaps: boolean; 
  speedLimitThreshold: number; 
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const forkliftPosRef = useRef({ x: 50, y: 70, targetIdx: 0 });
  const trailsRef = useRef<Array<{ x: number; y: number }>>([]);
  const frameCountRef = useRef(0);

  const waypoints = [
    { x: 50, y: 70 },
    { x: 50, y: 170 },
    { x: 180, y: 170 },
    { x: 180, y: 70 },
    { x: 320, y: 70 },
    { x: 320, y: 170 },
    { x: 180, y: 170 },
    { x: 180, y: 70 }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const updateAndDraw = () => {
      frameCountRef.current++;
      
      const fk = forkliftPosRef.current;
      const target = waypoints[fk.targetIdx];
      const isOverspeed = speedLimitThreshold < 6.0;
      const currentSpeed = isOverspeed ? 8.2 : 4.4;
      const speedPx = isOverspeed ? 1.4 : 0.75;

      const dx = target.x - fk.x;
      const dy = target.y - fk.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 4) {
        fk.targetIdx = (fk.targetIdx + 1) % waypoints.length;
      } else {
        fk.x += (dx / dist) * speedPx;
        fk.y += (dy / dist) * speedPx;
      }

      // Log movement path trail for heatmap visualization
      if (frameCountRef.current % 12 === 0) {
        trailsRef.current.push({ x: fk.x, y: fk.y });
        if (trailsRef.current.length > 50) {
          trailsRef.current.shift();
        }
      }

      // Clear
      ctx.fillStyle = '#060D1A';
      ctx.fillRect(0, 0, 400, 240);

      // Draw warehouse racks layout
      ctx.fillStyle = '#0D1E35';
      ctx.strokeStyle = 'rgba(143, 165, 192, 0.25)';
      ctx.lineWidth = 1.5;

      // Rack rows 
      ctx.fillRect(90, 50, 40, 50);
      ctx.strokeRect(90, 50, 40, 50);
      ctx.fillRect(90, 130, 40, 50);
      ctx.strokeRect(90, 130, 40, 50);

      ctx.fillRect(230, 50, 40, 50);
      ctx.strokeRect(230, 50, 40, 50);
      ctx.fillRect(230, 130, 40, 50);
      ctx.strokeRect(230, 130, 40, 50);

      // Shelf designations labels
      ctx.fillStyle = 'rgba(143, 165, 192, 0.4)';
      ctx.font = '6px monospace';
      ctx.textAlign = 'center';
      ctx.fillText("RACK A-1", 110, 77);
      ctx.fillText("RACK A-2", 110, 157);
      ctx.fillText("RACK B-1", 250, 77);
      ctx.fillText("RACK B-2", 250, 157);

      // Render heatmap path trail lines
      if (showHeatmaps) {
        ctx.strokeStyle = 'rgba(0, 212, 160, 0.35)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        trailsRef.current.forEach((t, idx) => {
          if (idx === 0) ctx.moveTo(t.x, t.y);
          else ctx.lineTo(t.x, t.y);
        });
        ctx.stroke();
      }

      // Draw forklift yellow vehicle
      ctx.fillStyle = isOverspeed ? '#FF3B47' : '#FFB400';
      ctx.beginPath();
      ctx.arc(fk.x, fk.y, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Forks extension outline
      const angle = Math.atan2(dy, dx);
      ctx.strokeStyle = '#8FA5C0';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(fk.x, fk.y);
      ctx.lineTo(fk.x + Math.cos(angle) * 11, fk.y + Math.sin(angle) * 11);
      ctx.stroke();

      // Forklift Bounding Box
      if (showBoxes) {
        ctx.strokeStyle = isOverspeed ? '#FF3B47' : 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(fk.x - 14, fk.y - 14, 28, 28);
        ctx.stroke();

        ctx.fillStyle = 'rgba(10, 22, 40, 0.8)';
        ctx.fillRect(fk.x - 14, fk.y - 23, 28, 9);
        
        ctx.fillStyle = isOverspeed ? '#FF3B47' : '#E8EDF5';
        ctx.font = '5px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(isOverspeed ? "OVER_SPD" : "LIFT_TRK", fk.x, fk.y - 16);
      }

      // Live velocity indicator overlay
      ctx.fillStyle = isOverspeed ? '#FF3B47' : '#00D4A0';
      ctx.font = '7px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`FORKLIFT: FL-03 (${currentSpeed.toFixed(1)} KM/H)`, 15, 215);
      ctx.fillStyle = 'rgba(0, 212, 160, 0.4)';
      ctx.fillText(`SPEED_ZONE: WAREHOUSE_1`, 15, 225);

      animationId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [showBoxes, showHeatmaps, speedLimitThreshold]);

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={240} 
      className="w-full h-full object-cover" 
    />
  );
}

// ==========================================
// Main Vision Intelligence Component
// ==========================================
interface EventLog {
  time: string;
  camera: string;
  msg: string;
  severity: 'info' | 'warning' | 'critical';
}

export default function ShipyardVisionIntelligence() {
  const [showBoxes, setShowBoxes] = useState(true);
  const [showHeatmaps, setShowHeatmaps] = useState(false);
  const [breachActive, setBreachActive] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Expanded panel active features
  const [selectedCam, setSelectedCam] = useState<'cam1' | 'cam2' | 'cam3' | 'cam4'>('cam1');
  const [privacyMode, setPrivacyMode] = useState(false);
  const [calibrationActive, setCalibrationActive] = useState(false);
  const [calibProgress, setCalibProgress] = useState(0);
  const [pressure, setPressure] = useState(3.2); // Default is faulted (3.2 BAR)
  const [thermalMode, setThermalMode] = useState(false);
  const [speedLimitThreshold, setSpeedLimitThreshold] = useState(8.0);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);

  const [logs, setLogs] = useState<EventLog[]>([
    { time: '17:40:12', camera: 'CAM 1', msg: 'PPE AI check completed. 14 personnel registered.', severity: 'info' },
    { time: '17:41:05', camera: 'CAM 2', msg: 'SBS-02 compressor low pressure fault trigger: 3.20 BAR.', severity: 'critical' },
    { time: '17:41:48', camera: 'CAM 4', msg: 'Forklift FL-03 velocity normal (4.8 km/h).', severity: 'info' },
    { time: '17:42:01', camera: 'CAM 3', msg: 'Welding joint spark diagnostics online on OPV Wharf.', severity: 'info' }
  ]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const addLog = (camera: string, msg: string, severity: 'info' | 'warning' | 'critical') => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [{ time: timeStr, camera, msg, severity }, ...prev.slice(0, 15)]);
  };

  // Telemetry logs appender interval loop to feel alive
  useEffect(() => {
    const messages = [
      { cam: 'CAM 1', msg: 'Gantry crane overhead load oscillation within limits: 0.08m.', sev: 'info' },
      { cam: 'CAM 4', msg: 'Warehouse aisle A storage occupancy index validated at 74.2%.', sev: 'info' },
      { cam: 'CAM 3', msg: 'Radar antenna frequency sweep verified. Scan sector clear.', sev: 'info' },
      { cam: 'CAM 1', msg: 'Safety zones status check: All personnel wear hard hats.', sev: 'info' }
    ];

    const interval = setInterval(() => {
      const selected = messages[Math.floor(Math.random() * messages.length)];
      
      // Don't add normal logs for things that are currently in warning/alert states
      if (selected.cam === 'CAM 1' && breachActive) return;
      if (selected.cam === 'CAM 2' && pressure < 5.0 && !calibrationActive) return;

      addLog(selected.cam, selected.msg, selected.sev as any);
    }, 9000);

    return () => clearInterval(interval);
  }, [breachActive, pressure, calibrationActive]);

  const handleSimulateBreach = () => {
    setBreachActive(!breachActive);
    if (!breachActive) {
      triggerToast("Safety Alarm: hard-hat exclusion breach detected on CAM 1.");
      addLog("CAM 1", "PPE BREACH ALARM: Worker J. Smith entered crane swing exclusion area without hard hat protection!", "critical");
    } else {
      triggerToast("Safety alert cleared. All yard zones secure.");
      addLog("CAM 1", "Safety breach resolved. Worker J. Smith exited crane zone; PPE verified.", "info");
    }
  };

  const handleCalibrateCompressor = () => {
    if (calibrationActive) return;
    setCalibrationActive(true);
    setCalibProgress(0);
    addLog("CAM 2", "Triggering SCADA calibration diagnostic sequence...", "warning");
    triggerToast("Initiating SBS-02 Compressor calibration routine...");
  };

  // Watch calibration progress to update pressure and throw log once done
  useEffect(() => {
    if (calibrationActive && calibProgress >= 100) {
      setPressure(7.8);
      addLog("CAM 2", "Compressor calibration successful. Pressure returned to 7.80 BAR.", "info");
      triggerToast("Compressor Calibrated. Pressure restored.");
    }
  }, [calibProgress, calibrationActive]);

  return (
    <div className="space-y-6">
      {/* Toast popup */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-bg-elevated border border-critical p-3.5 rounded-xl shadow-elevated flex items-center gap-3 animate-fade-up">
          <div className="w-7 h-7 rounded-full bg-critical/20 flex items-center justify-center text-critical">
            <ShieldAlert className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-text-primary">
              {breachActive ? 'PPE BREACH ALERT' : 'SAFETY LOG UPDATE'}
            </div>
            <div className="text-[10px] text-text-secondary mt-0.5">{toastMsg}</div>
          </div>
        </div>
      )}

      {/* Critical Safety Alert Banner */}
      {breachActive && (
        <div className="alert-banner alert-banner-critical animate-pulse border border-critical/30 mb-2">
          <ShieldAlert className="w-5 h-5 text-critical shrink-0" />
          <div className="flex-1">
            <div className="text-xs font-bold text-critical uppercase">CRITICAL SAFETY BREACH DETECTED</div>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Bay 1 CCTV AI analysis: Worker identified inside scaffold zone without hard hat protection.
            </p>
          </div>
          <button
            onClick={() => {
              setBreachActive(false);
              addLog("CAM 1", "Safety breach alert manually dismissed. Zone confirmed secure.", "info");
              triggerToast("Hard hat alert dismissed. Zone secure.");
            }}
            className="text-[10px] font-bold text-text-inverse bg-critical px-2.5 py-1 rounded cursor-pointer hover:bg-critical-muted transition-colors"
          >
            Dismiss Alert
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="border-b border-border/85 pb-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
            SHIPYARD VISION INTELLIGENCE (CCTV AI)
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Computer vision safety camera feeds, automatic PPE detection, vehicle speeds, and restricted zone alerts.
          </p>
        </div>

        {/* View toggle controllers */}
        <div className="flex items-center gap-2 select-none">
          <button
            onClick={() => {
              setShowBoxes(!showBoxes);
              triggerToast(showBoxes ? "Disabled Bounding Boxes" : "Enabled Bounding Boxes");
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              showBoxes 
                ? 'border-white text-text-primary bg-white/5' 
                : 'border-border text-text-secondary hover:border-text-primary'
            }`}
          >
            Bounding Boxes
          </button>
          
          <button
            onClick={() => {
              setShowHeatmaps(!showHeatmaps);
              triggerToast(showHeatmaps ? "Disabled AI Heatmaps" : "Enabled AI Heatmaps");
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              showHeatmaps 
                ? 'border-white text-text-primary bg-white/5' 
                : 'border-border text-text-secondary hover:border-text-primary'
            }`}
          >
            AI Heatmaps
          </button>
          
          <button
            onClick={handleSimulateBreach}
            className={`text-xs font-bold px-3 py-1 cursor-pointer transition-colors ${
              breachActive ? 'text-critical' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {breachActive ? 'Resolve Breach' : 'Simulate Breach'}
          </button>
        </div>
      </div>

      {/* Camera feeds panel + Diagnostics details split view */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side: 2x2 Feeds Grid */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CAM 1 */}
          <div 
            onClick={() => setSelectedCam('cam1')}
            className={`card bg-bg-surface overflow-hidden border cursor-pointer transition-all flex flex-col justify-between min-h-[250px] ${
              selectedCam === 'cam1' ? 'border-primary shadow-glow-primary' : 'border-border hover:border-border-strong'
            }`}
          >
            <div className="h-[200px] bg-black/60 relative flex items-center justify-center overflow-hidden">
              <Cam1AssemblyFeed 
                showBoxes={showBoxes}
                showHeatmaps={showHeatmaps}
                breachActive={breachActive}
                privacyMode={privacyMode}
              />

              <div className="absolute top-3 left-3 bg-black/65 px-2 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1.5 border border-border/40 text-text-primary">
                <Video className={`w-3 h-3 ${breachActive ? 'text-critical animate-pulse' : 'text-accent'}`} />
                LIVE // CAM1
              </div>

              {selectedCam === 'cam1' && (
                <div className="absolute top-3 right-3 bg-primary/20 text-primary border border-primary/50 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                  Active Diag
                </div>
              )}
            </div>

            <div className="p-4 bg-bg-muted flex justify-between items-center text-xs border-t border-border">
              <div>
                <div className="font-bold text-text-primary">Mussafah Bay 1 (HN-301 Assembly)</div>
                <div className="text-[10px] text-text-muted mt-1 font-medium">14 Workers in view</div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider shrink-0 ${
                breachActive 
                  ? 'border-critical/30 bg-critical-muted/20 text-critical' 
                  : 'border-success/30 bg-success-muted/20 text-success'
              }`}>
                {breachActive ? 'SAFETY ALARM' : 'COMPLIANCE OK'}
              </span>
            </div>
          </div>

          {/* CAM 2 */}
          <div 
            onClick={() => setSelectedCam('cam2')}
            className={`card bg-bg-surface overflow-hidden border cursor-pointer transition-all flex flex-col justify-between min-h-[250px] ${
              selectedCam === 'cam2' ? 'border-primary shadow-glow-primary' : 'border-border hover:border-border-strong'
            }`}
          >
            <div className="h-[200px] bg-black/60 relative flex items-center justify-center overflow-hidden">
              <Cam2BlastingFeed 
                showBoxes={showBoxes}
                showHeatmaps={showHeatmaps}
                calibrationActive={calibrationActive}
                setCalibrationActive={setCalibrationActive}
                calibProgress={calibProgress}
                setCalibProgress={setCalibProgress}
                pressure={pressure}
                setPressure={setPressure}
              />

              <div className="absolute top-3 left-3 bg-black/65 px-2 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1.5 border border-border/40 text-text-primary">
                <Video className={`w-3 h-3 ${pressure < 5.0 ? 'text-critical' : 'text-accent'}`} />
                LIVE // CAM2
              </div>

              {selectedCam === 'cam2' && (
                <div className="absolute top-3 right-3 bg-primary/20 text-primary border border-primary/50 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                  Active Diag
                </div>
              )}
            </div>

            <div className="p-4 bg-bg-muted flex justify-between items-center text-xs border-t border-border">
              <div>
                <div className="font-bold text-text-primary">Blasting Area SBS-02 Inlet</div>
                <div className="text-[10px] text-text-muted mt-1 font-medium">Automatic Blasting active</div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider shrink-0 ${
                pressure < 5.0 
                  ? 'border-critical/30 bg-critical-muted/20 text-critical' 
                  : 'border-success/30 bg-success-muted/20 text-success'
              }`}>
                {pressure < 5.0 ? 'SCADA ALARM' : 'INLET NOMINAL'}
              </span>
            </div>
          </div>

          {/* CAM 3 */}
          <div 
            onClick={() => setSelectedCam('cam3')}
            className={`card bg-bg-surface overflow-hidden border cursor-pointer transition-all flex flex-col justify-between min-h-[250px] ${
              selectedCam === 'cam3' ? 'border-primary shadow-glow-primary' : 'border-border hover:border-border-strong'
            }`}
          >
            <div className="h-[200px] bg-black/60 relative flex items-center justify-center overflow-hidden">
              <Cam3FittingFeed 
                showBoxes={showBoxes}
                showHeatmaps={showHeatmaps}
                thermalMode={thermalMode}
              />

              <div className="absolute top-3 left-3 bg-black/65 px-2 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1.5 border border-border/40 text-text-primary">
                <Video className="w-3 h-3 text-accent" />
                LIVE // CAM3
              </div>

              {selectedCam === 'cam3' && (
                <div className="absolute top-3 right-3 bg-primary/20 text-primary border border-primary/50 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                  Active Diag
                </div>
              )}
            </div>

            <div className="p-4 bg-bg-muted flex justify-between items-center text-xs border-t border-border">
              <div>
                <div className="font-bold text-text-primary">Quayside OPV Fitting Wharf</div>
                <div className="text-[10px] text-text-muted mt-1 font-medium">Radar / Weld integrations</div>
              </div>
              
              <span className="px-3 py-1 rounded-full text-[10px] font-bold border border-primary/30 bg-primary-muted/20 text-primary uppercase tracking-wider shrink-0">
                WELD ACTIVE
              </span>
            </div>
          </div>

          {/* CAM 4 */}
          <div 
            onClick={() => setSelectedCam('cam4')}
            className={`card bg-bg-surface overflow-hidden border cursor-pointer transition-all flex flex-col justify-between min-h-[250px] ${
              selectedCam === 'cam4' ? 'border-primary shadow-glow-primary' : 'border-border hover:border-border-strong'
            }`}
          >
            <div className="h-[200px] bg-black/60 relative flex items-center justify-center overflow-hidden">
              <Cam4WarehouseFeed 
                showBoxes={showBoxes}
                showHeatmaps={showHeatmaps}
                speedLimitThreshold={speedLimitThreshold}
              />

              <div className="absolute top-3 left-3 bg-black/65 px-2 py-0.5 rounded text-[9px] font-bold uppercase flex items-center gap-1.5 border border-border/40 text-text-primary">
                <Video className="w-3 h-3 text-accent" />
                LIVE // CAM4
              </div>

              {selectedCam === 'cam4' && (
                <div className="absolute top-3 right-3 bg-primary/20 text-primary border border-primary/50 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                  Active Diag
                </div>
              )}
            </div>

            <div className="p-4 bg-bg-muted flex justify-between items-center text-xs border-t border-border">
              <div>
                <div className="font-bold text-text-primary">Marine Store Warehouse 1</div>
                <div className="text-[10px] text-text-muted mt-1 font-medium">Forklifts monitoring</div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider shrink-0 ${
                speedLimitThreshold < 6.0 
                  ? 'border-warning/30 bg-warning-muted/20 text-warning' 
                  : 'border-success/30 bg-success-muted/20 text-success'
              }`}>
                {speedLimitThreshold < 6.0 ? 'SPEED ALERT' : 'SPEED NORMAL'}
              </span>
            </div>
          </div>

        </div>

        {/* Right Side: Active Diagnostics Sidebar panel */}
        <div className="flex flex-col gap-6">
          
          {/* Diagnostic controls details card */}
          <div className="card p-5 bg-bg-surface border border-border flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <Settings2 className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-black uppercase text-text-primary tracking-wider">
                  AI Feed Diagnostics Panel
                </h3>
              </div>

              {/* Feed specific telemetry info details */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary">Selected Channel:</span>
                  <span className="font-bold text-primary uppercase">
                    {selectedCam === 'cam1' && 'CAM 1: Bay 1 Assembly'}
                    {selectedCam === 'cam2' && 'CAM 2: Blasting Inlet'}
                    {selectedCam === 'cam3' && 'CAM 3: OPV Wharf'}
                    {selectedCam === 'cam4' && 'CAM 4: Warehouse'}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary">Location Code:</span>
                  <span className="font-mono text-text-primary font-bold">
                    {selectedCam === 'cam1' && 'MUSS_BAY1_E'}
                    {selectedCam === 'cam2' && 'MUSS_BLST_02'}
                    {selectedCam === 'cam3' && 'MUSS_QWAY_OPV'}
                    {selectedCam === 'cam4' && 'MUSS_WHS1_A'}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary">Confidence Level:</span>
                  <span className="font-mono text-accent font-bold">{(94.2 + Math.sin(Date.now() * 0.001) * 2.5).toFixed(2)}%</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary">CCTV Framerate:</span>
                  <span className="font-mono text-text-primary">60.0 FPS</span>
                </div>
              </div>

              {/* Diagnostics controls fields */}
              <div className="border-t border-border/80 pt-4 space-y-4">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Parameters & Adjustments</h4>
                
                {/* Confidence threshold slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">AI Threshold Confidence:</span>
                    <span className="font-mono text-text-primary font-bold">{confidenceThreshold}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={50} 
                    max={99} 
                    value={confidenceThreshold} 
                    onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                    className="w-full accent-primary h-1 bg-bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Switch inputs depending on which camera is active */}
                {selectedCam === 'cam1' && (
                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-secondary">Privacy Face Masking:</span>
                      <button 
                        onClick={() => setPrivacyMode(!privacyMode)}
                        className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-250 ease-in-out cursor-pointer ${
                          privacyMode ? 'bg-primary' : 'bg-bg-overlay border border-border'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-250 ease-in-out ${
                          privacyMode ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-bg-muted rounded-xl border border-border/60">
                      <Shield className="w-5 h-5 text-accent" />
                      <div className="text-[10px] text-text-secondary leading-normal">
                        Zone limits enforced. High-precision AI safety scanner verified active.
                      </div>
                    </div>
                  </div>
                )}

                {selectedCam === 'cam2' && (
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-secondary">Compressor SCADA Link:</span>
                      <span className={`text-[10px] font-bold ${pressure < 5.0 ? 'text-critical' : 'text-success'}`}>
                        {pressure < 5.0 ? 'FAULT / FAILING' : 'LINK NOMINAL'}
                      </span>
                    </div>

                    <button 
                      onClick={handleCalibrateCompressor}
                      disabled={calibrationActive || pressure > 5.0}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                        pressure > 5.0 
                          ? 'border-border text-text-muted bg-transparent cursor-not-allowed'
                          : 'border-primary text-text-primary bg-primary/10 hover:bg-primary/20 active:scale-[0.98]'
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${calibrationActive ? 'animate-spin' : ''}`} />
                      {calibrationActive ? 'Calibrating...' : pressure > 5.0 ? 'Compressor Calibrated' : 'Calibrate Compressor'}
                    </button>
                  </div>
                )}

                {selectedCam === 'cam3' && (
                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-secondary">Thermal Infrared (IR) Mode:</span>
                      <button 
                        onClick={() => setThermalMode(!thermalMode)}
                        className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-250 ease-in-out cursor-pointer ${
                          thermalMode ? 'bg-primary' : 'bg-bg-overlay border border-border'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-250 ease-in-out ${
                          thermalMode ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-bg-muted rounded-xl border border-border/60">
                      <Activity className="w-5 h-5 text-accent" />
                      <div className="text-[10px] text-text-secondary leading-normal">
                        Thermal imaging monitors engines compartment temperature parameters directly.
                      </div>
                    </div>
                  </div>
                )}

                {selectedCam === 'cam4' && (
                  <div className="space-y-4 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-text-secondary">Vehicle Speed Limit:</span>
                        <span className="font-mono text-text-primary font-bold">{speedLimitThreshold} km/h</span>
                      </div>
                      <input 
                        type="range" 
                        min={4.0} 
                        max={10.0} 
                        step={0.5}
                        value={speedLimitThreshold} 
                        onChange={(e) => setSpeedLimitThreshold(Number(e.target.value))}
                        className="w-full accent-primary h-1 bg-bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {speedLimitThreshold < 6.0 && (
                      <div className="flex items-center gap-3 p-3 bg-warning-muted/10 border border-warning/30 rounded-xl">
                        <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
                        <div className="text-[10px] text-warning font-medium leading-normal">
                          Speed Alert active. Forklifts speed (8.2 km/h) exceeds {speedLimitThreshold} km/h threshold limit.
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Quick calibration status strip */}
            <div className="border-t border-border/80 pt-4 mt-4 flex items-center justify-between text-[10px] text-text-secondary">
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${breachActive ? 'bg-critical animate-pulse' : 'bg-accent'}`} />
                AI Inference Engine Online
              </div>
              <span>Latency: 4.2ms</span>
            </div>
          </div>

          {/* CCTV AI Event logs Panel */}
          <div className="card p-5 bg-bg-surface border border-border h-[220px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-2 shrink-0">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-primary" />
                <h3 className="text-xs font-black uppercase text-text-primary tracking-wider">
                  Real-time Detections Log
                </h3>
              </div>
              <span className="text-[9px] font-mono text-text-secondary bg-bg-muted px-2 py-0.5 rounded border border-border/40">
                LIVE LOGGING
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 text-[11px] border-b border-border/30 pb-1.5 leading-relaxed">
                  <div className="flex gap-2">
                    <span className="font-mono text-text-muted select-none">{log.time}</span>
                    <span className={`font-bold select-none text-[10px] px-1 rounded border uppercase ${
                      log.severity === 'critical' ? 'border-critical/30 bg-critical-muted/20 text-critical' :
                      log.severity === 'warning' ? 'border-warning/30 bg-warning-muted/20 text-warning' :
                      'border-primary/30 bg-primary-muted/20 text-primary'
                    }`}>
                      {log.camera}
                    </span>
                    <span className="text-text-secondary">{log.msg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

