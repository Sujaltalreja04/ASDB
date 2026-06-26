import React, { useState, useEffect, useRef } from 'react';
import { Lock, ShieldAlert, Cpu, Database, Activity, Check, ShieldCheck, Terminal, Play } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  level: number;
  x: number;
  y: number;
  status: 'Nominal' | 'Alert' | 'Isolated';
  details: string;
}

interface Packet {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  type: 'data' | 'threat';
}

export default function OTSecurity() {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [intrusionSim, setIntrusionSim] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('plc4');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameCountRef = useRef(0);

  // Network Nodes definitions (Purdue model structure coordinates)
  const [nodes, setNodes] = useState<NetworkNode[]>([
    { id: 'op3', name: 'MES/ERP DB Server', level: 3, x: 250, y: 35, status: 'Nominal', details: 'Purdue Level 3. SAP ERP database sync active.' },
    { id: 'scada2', name: 'SCADA Workstation', level: 2, x: 250, y: 105, status: 'Nominal', details: 'Purdue Level 2. HMI supervisory controls active.' },
    { id: 'plc1', name: 'PLC-01 Weld Line', level: 1, x: 100, y: 175, status: 'Nominal', details: 'Purdue Level 1. Bay 1 Weld Joint controller.' },
    { id: 'plc2', name: 'PLC-02 Blasting Area', level: 1, x: 200, y: 175, status: 'Nominal', details: 'Purdue Level 1. Blasting SBS-02 Compressor regulator.' },
    { id: 'plc3', name: 'PLC-03 Ballast Pump', level: 1, x: 300, y: 175, status: 'Nominal', details: 'Purdue Level 1. Mina Zayed Ballast pump controller.' },
    { id: 'plc4', name: 'PLC-04 Warehouse HMI', level: 1, x: 400, y: 175, status: 'Nominal', details: 'Purdue Level 1. RFID storage scan coordinator.' }
  ]);

  const [packets, setPackets] = useState<Packet[]>([]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSimulateAttack = () => {
    setIntrusionSim(true);
    // Set PLC-04 (plc4) to Alert state
    setNodes(prev => prev.map(n => n.id === 'plc4' ? { ...n, status: 'Alert' } : n));
    triggerToast("Critical intrusion: Unauthorized Modbus scan collision on PLC segment Level 1.");
  };

  const handleIsolateNode = (id: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, status: 'Isolated' } : n));
    setIntrusionSim(false);
    triggerToast(`Segment ${nodes.find(n => n.id === id)?.name} isolated. Malware threat neutralized.`);
  };

  const handleRestoreNode = (id: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, status: 'Nominal' } : n));
    triggerToast(`Segment ${nodes.find(n => n.id === id)?.name} reconnected. Network sync operational.`);
  };

  // Main network topology render and logic update loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const animate = () => {
      frameCountRef.current++;

      // Generate data transmission packets dynamically
      if (frameCountRef.current % 35 === 0) {
        // Send packet from ERP to SCADA
        const erp = nodes.find(n => n.id === 'op3')!;
        const scada = nodes.find(n => n.id === 'scada2')!;
        setPackets(prev => [...prev, { x: erp.x, y: erp.y, targetX: scada.x, targetY: scada.y, progress: 0, type: 'data' }]);
      }

      if (frameCountRef.current % 45 === 0) {
        // Send packet from SCADA to normal PLCs
        const scada = nodes.find(n => n.id === 'scada2')!;
        const targets = nodes.filter(n => n.level === 1 && n.status !== 'Isolated');
        if (targets.length > 0) {
          const tar = targets[Math.floor(Math.random() * targets.length)];
          setPackets(prev => [...prev, { x: scada.x, y: scada.y, targetX: tar.x, targetY: tar.y, progress: 0, type: 'data' }]);
        }
      }

      // Generate malicious threat packets if intrusion simulated
      if (intrusionSim && frameCountRef.current % 25 === 0) {
        const plc4 = nodes.find(n => n.id === 'plc4')!;
        if (plc4 && plc4.status !== 'Isolated') {
          // Threat sweeps from right border gateway towards PLC-04
          setPackets(prev => [...prev, { x: 480, y: 105, targetX: plc4.x, targetY: plc4.y, progress: 0, type: 'threat' }]);
        }
      }

      // Update packets progress
      setPackets(prev => prev.map(p => ({
        ...p,
        progress: p.progress + 0.02
      })).filter(p => p.progress < 1.0));

      // Draw background
      ctx.fillStyle = '#060D1A';
      ctx.fillRect(0, 0, 500, 240);

      // Draw grid
      ctx.strokeStyle = 'rgba(45, 156, 219, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 500; x += 25) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 240); ctx.stroke();
      }

      // Draw connections lines
      ctx.strokeStyle = 'rgba(45, 156, 219, 0.2)';
      ctx.lineWidth = 1.5;
      
      const erp = nodes.find(n => n.id === 'op3')!;
      const scada = nodes.find(n => n.id === 'scada2')!;

      // ERP to SCADA line
      ctx.beginPath(); ctx.moveTo(erp.x, erp.y); ctx.lineTo(scada.x, scada.y); ctx.stroke();

      // SCADA to PLCs lines
      nodes.filter(n => n.level === 1).forEach(plc => {
        ctx.strokeStyle = plc.status === 'Isolated' ? 'rgba(255, 59, 71, 0.25)' : 'rgba(45, 156, 219, 0.25)';
        ctx.setLineDash(plc.status === 'Isolated' ? [3, 3] : []);
        ctx.beginPath(); ctx.moveTo(scada.x, scada.y); ctx.lineTo(plc.x, plc.y); ctx.stroke();
      });
      ctx.setLineDash([]);

      // Threat source entry path line
      if (intrusionSim) {
        ctx.strokeStyle = 'rgba(255, 59, 71, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(480, 105);
        ctx.lineTo(nodes.find(n => n.id === 'plc4')!.x, nodes.find(n => n.id === 'plc4')!.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw data/threat packets
      packets.forEach(p => {
        const currX = p.x + (p.targetX - p.x) * p.progress;
        const currY = p.y + (p.targetY - p.y) * p.progress;

        ctx.fillStyle = p.type === 'threat' ? '#FF3B47' : '#00D4A0';
        ctx.beginPath();
        ctx.arc(currX, currY, p.type === 'threat' ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fill();

        if (p.type === 'threat') {
          // outer glow ring for threat
          ctx.strokeStyle = 'rgba(255, 59, 71, 0.5)';
          ctx.beginPath();
          ctx.arc(currX, currY, 6, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Draw threat entry terminal gateway block
      if (intrusionSim) {
        ctx.fillStyle = 'rgba(255, 59, 71, 0.2)';
        ctx.strokeStyle = '#FF3B47';
        ctx.lineWidth = 1.5;
        ctx.fillRect(455, 90, 30, 30);
        ctx.strokeRect(455, 90, 30, 30);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 6px monospace';
        ctx.fillText("ATTACK", 470, 108);
      }

      // Draw Network Nodes
      nodes.forEach(n => {
        const isSelected = selectedNodeId === n.id;
        
        // Node coloring based on state
        let strokeColor = 'rgba(45, 156, 219, 0.4)';
        let fillColor = 'rgba(15, 31, 58, 0.8)';
        
        if (n.status === 'Alert') {
          strokeColor = '#FF3B47';
          fillColor = 'rgba(255, 59, 71, 0.15)';
        } else if (n.status === 'Isolated') {
          strokeColor = 'rgba(100, 116, 139, 0.4)';
          fillColor = 'rgba(20, 20, 20, 0.9)';
        } else if (isSelected) {
          strokeColor = '#00D4A0';
          fillColor = 'rgba(0, 212, 160, 0.15)';
        }

        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = isSelected || n.status === 'Alert' ? 2 : 1.2;
        
        // draw rounded rectangle node
        const nw = 75;
        const nh = 26;
        const nx = n.x - nw/2;
        const ny = n.y - nh/2;
        ctx.fillRect(nx, ny, nw, nh);
        ctx.strokeRect(nx, ny, nw, nh);

        // Draw isolated indicator cross
        if (n.status === 'Isolated') {
          ctx.strokeStyle = '#FF3B47';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(nx - 4, ny - 4); ctx.lineTo(nx + nw + 4, ny + nh + 4);
          ctx.moveTo(nx + nw + 4, ny - 4); ctx.lineTo(nx - 4, ny + nh + 4);
          ctx.stroke();
        }

        // Title Labels
        ctx.fillStyle = n.status === 'Alert' ? '#FF3B47' : n.status === 'Isolated' ? '#64748B' : '#E8EDF5';
        ctx.font = 'bold 7px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.name, n.x, n.y - 2);

        ctx.fillStyle = '#8FA5C0';
        ctx.font = '6px monospace';
        ctx.fillText(n.status === 'Isolated' ? 'ISOLATED' : `L${n.level} SEGMENT`, n.x, n.y + 6);
      });

      // HUD feeds status overlay text
      ctx.fillStyle = 'rgba(0, 212, 160, 0.45)';
      ctx.font = '7px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`SCADA PACKET INSPECTION ONLINE`, 15, 222);

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animId);
  }, [nodes, packets, intrusionSim, selectedNodeId]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (500 / rect.width);
    const clickY = (e.clientY - rect.top) * (240 / rect.height);

    // Check click collision with nodes
    nodes.forEach(n => {
      if (Math.abs(n.x - clickX) < 40 && Math.abs(n.y - clickY) < 15) {
        setSelectedNodeId(n.id);
        triggerToast(`Selected network node segment: ${n.name}`);
      }
    });
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

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

      {/* Critical breach warning banner */}
      {intrusionSim && (
        <div className="alert-banner alert-banner-critical animate-pulse border border-critical/30 mb-2">
          <ShieldAlert className="w-5 h-5 text-critical shrink-0" />
          <div className="flex-1">
            <div className="text-xs font-bold text-critical uppercase">UNAUTHORIZED MODBUS ATTEMPT ON PLC-04</div>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Level 1 PLC is executing unscheduled Modbus read coils command blocks. Network threat level elevated.
            </p>
          </div>
          <button
            onClick={() => handleIsolateNode('plc4')}
            className="text-[10px] font-bold text-text-inverse bg-critical px-2.5 py-1 rounded cursor-pointer hover:bg-critical-muted transition-all active:scale-[0.98]"
          >
            Isolate PLC Network Segment
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="border-b border-border/80 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
            INDUSTRIAL & OT NETWORK SECURITY
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Cyber-physical threat protection, SCADA/PLC node scans, and air-gapped network monitoring (Purdue model Level 0-3).
          </p>
        </div>

        {!intrusionSim && (
          <button
            onClick={handleSimulateAttack}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-critical hover:bg-critical/80 text-text-inverse text-xs font-bold rounded-lg cursor-pointer transition-all shadow-glow-critical active:scale-[0.98]"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-text-inverse animate-bounce" /> Simulate PLC Attack
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Network topology canvas - 2 cols */}
        <div className="lg:col-span-2 card p-4 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-2 shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase text-text-primary tracking-wider">
                Industrial OT Network Topology (Purdue Model)
              </h3>
            </div>
            <span className="text-[9px] font-mono text-text-muted">
              CLICK NODES ON TOPOLOGY TO RUN ISOLATIONS
            </span>
          </div>

          <div className="flex-1 bg-black/40 relative flex items-center justify-center min-h-[240px]">
            <canvas
              ref={canvasRef}
              width={500}
              height={240}
              onClick={handleCanvasClick}
              className="w-full h-full object-cover rounded-lg border border-border cursor-pointer"
            />
          </div>
        </div>

        {/* Selected Node Diagnostic Controls sidebar */}
        <div className="flex flex-col gap-6">
          
          <div className="card p-5 bg-bg-surface border-l-2 border-l-primary flex-1 flex flex-col justify-between min-h-[240px]">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <Cpu className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-black uppercase text-text-primary tracking-wider">
                  Node Diagnostic Inspector
                </h3>
              </div>

              {selectedNode ? (
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Selected Node:</span>
                    <span className="font-bold text-text-primary">{selectedNode.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-text-secondary">Purdue Model:</span>
                    <span className="font-mono text-text-primary font-bold">Level {selectedNode.level} Layer</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Network Link Status:</span>
                    <span className={`badge ${
                      selectedNode.status === 'Nominal' ? 'badge-success' :
                      selectedNode.status === 'Alert' ? 'badge-critical' :
                      'badge-neutral'
                    }`}>
                      {selectedNode.status}
                    </span>
                  </div>

                  <div className="p-3 bg-bg-muted border border-border rounded-xl text-[10px] text-text-secondary leading-normal">
                    {selectedNode.details}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-text-muted">Select a network node to view diagnostic tools.</div>
              )}
            </div>

            {selectedNode && (
              <div className="space-y-2 mt-4">
                {selectedNode.status === 'Isolated' ? (
                  <button
                    onClick={() => handleRestoreNode(selectedNode.id)}
                    className="w-full py-2 bg-accent hover:bg-accent-hover text-text-inverse font-bold text-xs rounded-lg transition-all cursor-pointer text-center active:scale-[0.98]"
                  >
                    Restore Network Link
                  </button>
                ) : (
                  <button
                    onClick={() => handleIsolateNode(selectedNode.id)}
                    disabled={selectedNode.level !== 1}
                    className={`w-full py-2 text-xs font-bold rounded-lg transition-all text-center border cursor-pointer ${
                      selectedNode.level !== 1
                        ? 'border-border text-text-muted cursor-not-allowed bg-transparent'
                        : 'border-critical text-text-primary bg-critical-muted/10 hover:bg-critical/10 active:scale-[0.98]'
                    }`}
                  >
                    Isolate Segment Link
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
