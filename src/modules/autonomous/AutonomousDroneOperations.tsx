import React, { useState, useEffect, useRef } from 'react';
import { Compass, Ship, Calendar, AlertTriangle, Play, Check, Trash2, ShieldAlert, Zap, Navigation, Crosshair } from 'lucide-react';

interface Waypoint {
  x: number;
  y: number;
}

interface USV {
  id: string;
  name: string;
  mission: string;
  speedKts: number;
  batteryPercent: number;
  status: 'Active' | 'Docked' | 'Standby';
}

export default function AutonomousDroneOperations() {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Drone Telemetry States
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [dronePos, setDronePos] = useState({ x: 50, y: 150 });
  const [targetIdx, setTargetIdx] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [battery, setBattery] = useState(100);
  const [altitude, setAltitude] = useState(0);
  const [airspeed, setAirspeed] = useState(0);
  const [corrosionCount, setCorrosionCount] = useState(0);

  // USV Fleet States
  const [usvFleet, setUsvFleet] = useState<USV[]>([
    { id: 'usv1', name: 'USV Stealth-01', mission: 'Mussafah Port Patrol', speedKts: 12, batteryPercent: 92, status: 'Active' },
    { id: 'usv2', name: 'USV Mine-Counter-02', mission: 'Inspecting Outfitting Wharf', speedKts: 0, batteryPercent: 88, status: 'Docked' }
  ]);
  const [selectedUsvId, setSelectedUsvId] = useState<string>('usv1');
  const [deployUsvSpeed, setDeployUsvSpeed] = useState(15);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameCountRef = useRef(0);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const defaultWaypoints: Waypoint[] = [
    { x: 50, y: 150 },
    { x: 140, y: 60 },
    { x: 230, y: 140 },
    { x: 320, y: 60 },
    { x: 410, y: 150 }
  ];

  const activeWaypoints = waypoints.length > 0 ? waypoints : defaultWaypoints;

  // Drone flight physics and telemetry update loop
  useEffect(() => {
    if (!isScanning) {
      // Recharging when docked
      if (battery < 100) {
        const timer = setTimeout(() => setBattery(b => Math.min(100, b + 2)), 1000);
        return () => clearTimeout(timer);
      }
      setAltitude(0);
      setAirspeed(0);
      return;
    }

    let animId: number;

    const fly = () => {
      frameCountRef.current++;
      
      const target = activeWaypoints[targetIdx];
      const dx = target.x - dronePos.x;
      const dy = target.y - dronePos.y;
      const dist = Math.hypot(dx, dy);

      // Fluctuations in telemetry
      setAirspeed(11.8 + Math.sin(frameCountRef.current * 0.1) * 0.8);
      setAltitude(18.5 + Math.sin(frameCountRef.current * 0.05) * 0.5);

      // Battery depletion
      if (frameCountRef.current % 60 === 0) {
        setBattery(b => Math.max(5, b - 1));
      }

      // Simulated camera corrosion scanning markers triggers
      if (frameCountRef.current % 90 === 0 && Math.random() < 0.6) {
        setCorrosionCount(c => c + 1);
        triggerToast("Corrosion scan hotspot registered on ship hull structure.");
      }

      if (dist < 4) {
        if (targetIdx < activeWaypoints.length - 1) {
          setTargetIdx(t => t + 1);
        } else {
          // Mission finished
          setIsScanning(false);
          setTargetIdx(0);
          setDronePos({ x: 50, y: 150 });
          triggerToast("UAV corrosion scan patrol completed. Inspection logs saved.");
        }
      } else {
        setDronePos(prev => ({
          x: prev.x + (dx / dist) * 1.5,
          y: prev.y + (dy / dist) * 1.5
        }));
      }

      animId = requestAnimationFrame(fly);
    };

    fly();

    return () => cancelAnimationFrame(animId);
  }, [isScanning, targetIdx, dronePos, activeWaypoints, battery]);

  // Main canvas flight map rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background shipyard map grid
    ctx.fillStyle = '#060D1A';
    ctx.fillRect(0, 0, 500, 220);

    // Map Grid Lines
    ctx.strokeStyle = 'rgba(45, 156, 219, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 500; x += 25) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 220); ctx.stroke();
    }

    // Shipyard zones drawing
    ctx.fillStyle = 'rgba(143, 165, 192, 0.08)';
    ctx.strokeStyle = 'rgba(143, 165, 192, 0.2)';
    ctx.lineWidth = 1.5;
    
    // Bay 1 Assembly Ship block representation
    ctx.fillRect(80, 40, 90, 45);
    ctx.strokeRect(80, 40, 90, 45);
    ctx.fillStyle = '#E8EDF5';
    ctx.font = '7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText("BAY 1 ASSEMBLY", 125, 65);

    // OPV docked at outfitting wharf
    ctx.fillStyle = 'rgba(30, 58, 95, 0.3)';
    ctx.beginPath();
    ctx.moveTo(280, 160);
    ctx.lineTo(440, 160);
    ctx.lineTo(420, 120);
    ctx.lineTo(300, 120);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#E8EDF5';
    ctx.fillText("HN-301 AL NOUKHITHA", 360, 145);

    // Draw waypoints paths
    ctx.strokeStyle = '#00D4A0';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    activeWaypoints.forEach((wp, idx) => {
      if (idx === 0) ctx.moveTo(wp.x, wp.y);
      else ctx.lineTo(wp.x, wp.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw waypoints dots
    activeWaypoints.forEach((wp, idx) => {
      ctx.fillStyle = idx === targetIdx && isScanning ? '#FF3B47' : '#00D4A0';
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '6px Inter';
      ctx.fillText(`WP${idx + 1}`, wp.x, wp.y - 6);
    });

    // Draw flying Drone
    ctx.fillStyle = '#00D4A0';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(dronePos.x, dronePos.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Drone propellers
    ctx.strokeStyle = 'rgba(0, 212, 160, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(dronePos.x - 10, dronePos.y); ctx.lineTo(dronePos.x + 10, dronePos.y);
    ctx.moveTo(dronePos.x, dronePos.y - 10); ctx.lineTo(dronePos.x, dronePos.y + 10);
    ctx.stroke();

  }, [dronePos, activeWaypoints, targetIdx, isScanning]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isScanning) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (500 / rect.width);
    const y = (e.clientY - rect.top) * (220 / rect.height);

    setWaypoints(prev => [...prev, { x, y }]);
    triggerToast(`Added Waypoint ${waypoints.length + 1} at coordinates (${x.toFixed(0)}, ${y.toFixed(0)}).`);
  };

  const handleLaunchScan = () => {
    setIsScanning(true);
    setTargetIdx(0);
    setCorrosionCount(0);
    setDronePos(activeWaypoints[0]);
    triggerToast("UAV inspection launch initiated. Starboard scanning online.");
  };

  const handleClearWaypoints = () => {
    if (isScanning) return;
    setWaypoints([]);
    triggerToast("Cleared custom flight path. Reset to default shipyard patrol path.");
  };

  const handleDeployUsv = (e: React.FormEvent) => {
    e.preventDefault();
    setUsvFleet(prev => prev.map(u => {
      if (u.id === selectedUsvId) {
        return {
          ...u,
          status: 'Active',
          speedKts: deployUsvSpeed,
          mission: u.id === 'usv1' ? 'Sector B security sweep' : 'Dockyard channel sweep'
        };
      }
      return u;
    }));
    triggerToast(`Successfully deployed ${usvFleet.find(u => u.id === selectedUsvId)?.name} at ${deployUsvSpeed} knots.`);
  };

  const activeUSV = usvFleet.find(u => u.id === selectedUsvId);

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

      {/* Header Bar */}
      <div className="border-b border-border/80 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
            AUTONOMOUS & DRONE OPERATIONS
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            UAV hull corrosion inspection missions and autonomous surface vehicle (USV) fleet tracking telemetry.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleClearWaypoints}
            disabled={isScanning || waypoints.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-text-secondary hover:text-text-primary hover:border-text-primary text-xs font-bold rounded-lg cursor-pointer transition-all disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Paths
          </button>
          
          <button
            onClick={handleLaunchScan}
            disabled={isScanning || battery < 20}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-bold rounded-lg cursor-pointer transition-all shadow-glow-primary active:scale-[0.98]"
          >
            <Play className="w-3.5 h-3.5" /> {isScanning ? 'Inspection Scanning...' : 'Launch UAV Scan'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Interactive Waypoint Mapper Map Card */}
        <div className="xl:col-span-2 card p-4 flex flex-col justify-between min-h-[300px]">
          <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase text-text-primary tracking-wider">
                Click Map to plot custom UAV inspection waypoints
              </h3>
            </div>
            <span className="text-[9px] font-mono text-text-muted">
              {isScanning ? 'UAV FLIGHT ACTIVE' : `${waypoints.length} WAYPOINTS PLOTTED`}
            </span>
          </div>

          <div className="flex-1 bg-black/40 flex items-center justify-center relative min-h-[220px]">
            <canvas
              ref={canvasRef}
              width={500}
              height={220}
              onClick={handleCanvasClick}
              className={`w-full h-full object-cover rounded-lg border border-border ${isScanning ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
            />

            <div className="absolute bottom-3 left-3 bg-bg-surface/85 backdrop-blur border border-border p-2 rounded text-[9px] flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-critical animate-pulse' : 'bg-text-muted'}`} />
              Mission: <span className="font-bold text-text-primary">{isScanning ? 'Hull corrosion NDT scan active' : 'Awaiting launch command'}</span>
            </div>
          </div>
        </div>

        {/* Drone live telemetry and settings */}
        <div className="card p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border/80 pb-3">
              <Navigation className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase text-text-primary tracking-wider">
                UAV Diagnostics & Telemetry
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Battery level */}
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">UAV Battery status:</span>
                <span className={`font-mono font-bold flex items-center gap-1 ${battery < 30 ? 'text-critical' : 'text-accent'}`}>
                  <Zap className="w-3.5 h-3.5 fill-current" /> {battery}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${battery < 30 ? 'bg-critical' : 'bg-accent'}`}
                  style={{ width: `${battery}%` }}
                />
              </div>

              {/* Telemetry indices */}
              <div className="flex justify-between text-xs pt-1">
                <span className="text-text-secondary">Airspeed sensor:</span>
                <span className="font-mono text-text-primary font-bold">{airspeed.toFixed(1)} m/s</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Barometric Altitude:</span>
                <span className="font-mono text-text-primary font-bold">{altitude.toFixed(1)} m</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Corrosion Hotspots:</span>
                <span className={`font-mono font-bold ${corrosionCount > 0 ? 'text-critical' : 'text-text-muted'}`}>
                  {corrosionCount} detected
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-bg-muted border border-border rounded-xl mt-4 flex gap-2.5 items-center">
            <ShieldAlert className={`w-5 h-5 shrink-0 ${corrosionCount > 0 ? 'text-critical animate-pulse' : 'text-text-muted'}`} />
            <div className="text-[10px] text-text-secondary leading-normal">
              {corrosionCount > 0 
                ? `Hull corrosion points localized in Starboard sector. NDT inspection report compiled.`
                : 'UAV cameras optical sensors aligned. Steel surfaces structural inspection ready.'
              }
            </div>
          </div>
        </div>

      </div>

      {/* USV Fleet status & Deploy control panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* USV Fleet table */}
        <div className="lg:col-span-2 card p-4 space-y-3">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border/80 pb-2">
            Autonomous Surface USV Fleet Logs
          </h3>

          <div className="space-y-2 text-xs">
            {usvFleet.map((u) => (
              <div 
                key={u.id}
                onClick={() => setSelectedUsvId(u.id)}
                className={`flex justify-between p-3 rounded-xl border cursor-pointer transition-all items-center ${
                  selectedUsvId === u.id 
                    ? 'border-primary bg-primary-muted/10' 
                    : 'border-border bg-bg-overlay hover:border-border-strong'
                }`}
              >
                <div>
                  <div className="font-bold text-text-primary">{u.name}</div>
                  <div className="text-[10px] text-text-muted mt-0.5">Active Mission: {u.mission}</div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span className="font-mono text-text-secondary">{u.speedKts} Kts</span>
                  <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                    {u.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* USV deployment adjustments */}
        <form onSubmit={handleDeployUsv} className="card p-5 bg-bg-surface border-l-2 border-l-primary flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-wider border-b border-border/80 pb-2">
              Deploy USV Patrol Course
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-text-secondary">Selected Drone Vessel:</span>
                <span className="font-bold text-text-primary uppercase">{activeUSV?.name}</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary">Target Patrol Speed:</span>
                  <span className="font-mono text-text-primary font-bold">{deployUsvSpeed} Knots</span>
                </div>
                <input 
                  type="range" 
                  min={5} 
                  max={30} 
                  value={deployUsvSpeed} 
                  onChange={(e) => setDeployUsvSpeed(Number(e.target.value))}
                  className="w-full accent-primary h-1 bg-bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2 bg-primary hover:bg-primary-hover text-text-inverse font-bold text-xs rounded-lg transition-colors cursor-pointer text-center"
          >
            Deploy USV Patrol
          </button>
        </form>

      </div>
    </div>
  );
}
