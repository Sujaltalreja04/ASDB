import React, { useState, useEffect, useRef } from 'react';
import { useYardDataStore } from '../../lib/mock-data/store';
import DataTable from '../../components/ui/DataTable';
import { Layers, Box, TrendingUp, AlertTriangle, Plus, Check, Compass, Radio, Truck, RefreshCw, BarChart } from 'lucide-react';
import { InventoryItem } from '../../types/adsb';

// ==========================================
// Interactive Warehouse Canvas Map Component
// ==========================================
interface WarehouseMapProps {
  selectedWarehouseZone: string | null;
  setSelectedWarehouseZone: (zone: string | null) => void;
  showHeatmaps: boolean;
  showBoxes: boolean;
  inventory: any[];
}

function WarehouseMap({
  selectedWarehouseZone,
  setSelectedWarehouseZone,
  showHeatmaps,
  showBoxes,
  inventory
}: WarehouseMapProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const forkliftPosRef = useRef({ x: 60, y: 90, targetIdx: 0 });
  const pickerPosRef = useRef({ x: 120, y: 140, tx: 120, ty: 140, isMoving: false });
  const trailsRef = useRef<Array<{ x: number; y: number }>>([]);
  const frameCountRef = useRef(0);

  const waypoints = [
    { x: 60, y: 90 },
    { x: 180, y: 90 },
    { x: 180, y: 170 },
    { x: 300, y: 170 },
    { x: 300, y: 90 },
    { x: 420, y: 90 },
    { x: 420, y: 170 },
    { x: 60, y: 170 }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Scale screen click relative to internal coordinate resolution (500x220)
      const scaleX = 500 / rect.width;
      const scaleY = 220 / rect.height;
      const canvasX = x * scaleX;
      const canvasY = y * scaleY;

      // Detect sector rack collision bounds
      if (canvasX >= 80 && canvasX <= 160 && canvasY >= 25 && canvasY <= 175) {
        setSelectedWarehouseZone(selectedWarehouseZone === 'A' ? null : 'A');
      } else if (canvasX >= 210 && canvasX <= 290 && canvasY >= 25 && canvasY <= 175) {
        setSelectedWarehouseZone(selectedWarehouseZone === 'Chemical' ? null : 'Chemical');
      } else if (canvasX >= 340 && canvasX <= 420 && canvasY >= 25 && canvasY <= 175) {
        setSelectedWarehouseZone(selectedWarehouseZone === 'Spare' ? null : 'Spare');
      }
    };

    canvas.addEventListener('click', handleCanvasClick);

    const updateAndDraw = () => {
      frameCountRef.current++;

      // Update forklift vehicle along waypoint tracks
      const fk = forkliftPosRef.current;
      const target = waypoints[fk.targetIdx];
      const dx = target.x - fk.x;
      const dy = target.y - fk.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 4) {
        fk.targetIdx = (fk.targetIdx + 1) % waypoints.length;
      } else {
        fk.x += (dx / dist) * 0.95;
        fk.y += (dy / dist) * 0.95;
      }

      // Update picker technician dot wander path
      const pk = pickerPosRef.current;
      if (!pk.isMoving || Math.hypot(pk.tx - pk.x, pk.ty - pk.y) < 5) {
        pk.isMoving = true;
        pk.tx = 40 + Math.random() * 420;
        pk.ty = 85 + Math.random() * 95;
      } else {
        pk.x += (pk.tx - pk.x) * 0.02;
        pk.y += (pk.ty - pk.y) * 0.02;
      }

      // Save trails positions
      if (frameCountRef.current % 12 === 0) {
        trailsRef.current.push({ x: fk.x, y: fk.y });
        if (trailsRef.current.length > 40) {
          trailsRef.current.shift();
        }
      }

      // Draw background
      ctx.fillStyle = '#060D1A';
      ctx.fillRect(0, 0, 500, 220);

      // Draw gridlines
      ctx.strokeStyle = 'rgba(45, 156, 219, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 500; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 220);
        ctx.stroke();
      }
      for (let y = 0; y < 220; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(500, y);
        ctx.stroke();
      }

      // Draw aisles lanes
      ctx.fillStyle = 'rgba(45, 156, 219, 0.02)';
      ctx.fillRect(30, 80, 440, 30);
      ctx.fillRect(30, 160, 440, 30);

      // Draw Sector A (Racks A-1, A-2) - Steel Plates
      const isASelected = selectedWarehouseZone === 'A';
      ctx.fillStyle = isASelected ? 'rgba(0, 212, 160, 0.25)' : 'rgba(0, 212, 160, 0.08)';
      ctx.strokeStyle = isASelected ? '#00D4A0' : 'rgba(0, 212, 160, 0.4)';
      ctx.lineWidth = isASelected ? 2.2 : 1.2;
      ctx.fillRect(90, 30, 45, 50);
      ctx.strokeRect(90, 30, 45, 50);
      ctx.fillRect(90, 110, 45, 50);
      ctx.strokeRect(90, 110, 45, 50);

      // Draw Sector B (Racks B-1, B-2) - Chemicals Coatings
      const isBSelected = selectedWarehouseZone === 'Chemical';
      ctx.fillStyle = isBSelected ? 'rgba(255, 59, 71, 0.25)' : 'rgba(255, 59, 71, 0.08)';
      ctx.strokeStyle = isBSelected ? '#FF3B47' : 'rgba(255, 59, 71, 0.4)';
      ctx.lineWidth = isBSelected ? 2.2 : 1.2;
      ctx.fillRect(225, 30, 45, 50);
      ctx.strokeRect(225, 30, 45, 50);
      ctx.fillRect(225, 110, 45, 50);
      ctx.strokeRect(225, 110, 45, 50);

      // Draw Sector C (Racks C-1, C-2) - Engines Spares
      const isCSelected = selectedWarehouseZone === 'Spare';
      ctx.fillStyle = isCSelected ? 'rgba(255, 180, 0, 0.25)' : 'rgba(255, 180, 0, 0.08)';
      ctx.strokeStyle = isCSelected ? '#FFB400' : 'rgba(255, 180, 0, 0.4)';
      ctx.lineWidth = isCSelected ? 2.2 : 1.2;
      ctx.fillRect(360, 30, 45, 50);
      ctx.strokeRect(360, 30, 45, 50);
      ctx.fillRect(360, 110, 45, 50);
      ctx.strokeRect(360, 110, 45, 50);

      // Titles Labels text
      ctx.fillStyle = '#8FA5C0';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText("SECTOR A (STEEL)", 112, 22);
      ctx.fillText("SECTOR B (CHEM)", 247, 22);
      ctx.fillText("SECTOR C (SPAR)", 382, 22);

      // Heatmaps density overlays
      if (showHeatmaps) {
        // Sector A (Steel) healthy glow
        const g1 = ctx.createRadialGradient(112, 55, 1, 112, 55, 24);
        g1.addColorStop(0, 'rgba(0, 212, 160, 0.38)');
        g1.addColorStop(1, 'rgba(0, 212, 160, 0)');
        ctx.fillStyle = g1;
        ctx.beginPath(); ctx.arc(112, 55, 24, 0, Math.PI * 2); ctx.fill();

        // Sector B (Chemical) low stock glow
        const g2 = ctx.createRadialGradient(247, 135, 1, 247, 135, 24);
        g2.addColorStop(0, 'rgba(255, 59, 71, 0.45)');
        g2.addColorStop(1, 'rgba(255, 59, 71, 0)');
        ctx.fillStyle = g2;
        ctx.beginPath(); ctx.arc(247, 135, 24, 0, Math.PI * 2); ctx.fill();

        // Path transit history line
        ctx.strokeStyle = 'rgba(45, 156, 219, 0.35)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        trailsRef.current.forEach((t, idx) => {
          if (idx === 0) ctx.moveTo(t.x, t.y);
          else ctx.lineTo(t.x, t.y);
        });
        ctx.stroke();
      }

      // Draw picker technician dot
      ctx.fillStyle = '#00D4A0';
      ctx.beginPath();
      ctx.arc(pk.x, pk.y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw Forklift
      ctx.fillStyle = '#FFB400';
      ctx.beginPath();
      ctx.arc(fk.x, fk.y, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Forklift Bounding Box labels
      if (showBoxes) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(fk.x - 10, fk.y - 10, 20, 20);
        ctx.stroke();

        ctx.fillStyle = 'rgba(10, 22, 40, 0.8)';
        ctx.fillRect(fk.x - 10, fk.y - 17, 20, 7);
        ctx.fillStyle = '#E8EDF5';
        ctx.font = '5px Inter, sans-serif';
        ctx.fillText("FL-03", fk.x - 6, fk.y - 12);
      }

      // General map coordinates overlay
      ctx.fillStyle = 'rgba(0, 212, 160, 0.4)';
      ctx.font = '7px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`RFID SCAN CHANNELS ONLINE`, 15, 208);

      animationId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [selectedWarehouseZone, showHeatmaps, showBoxes]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={220}
      className="w-full h-full object-cover rounded-lg border border-border"
    />
  );
}

// ==========================================
// Main Marine Stores Module
// ==========================================
interface RFIDScan {
  time: string;
  sku: string;
  location: string;
  tagId: string;
}

export default function MarineStores() {
  const { inventory } = useYardDataStore();
  const [selectedWarehouseZone, setSelectedWarehouseZone] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [reqSku, setReqSku] = useState('STEEL-AH36-PL12');
  const [reqQty, setReqQty] = useState(1);

  // View parameters
  const [showBoxes, setShowBoxes] = useState(true);
  const [showHeatmaps, setShowHeatmaps] = useState(false);

  // Stock refill / override states
  const [inventoryOverrides, setInventoryOverrides] = useState<Record<string, number>>({});
  const [restockingPaint, setRestockingPaint] = useState(false);
  const [restockProgress, setRestockProgress] = useState(0);

  // RFID scan logs state
  const [rfidScans, setRfidScans] = useState<RFIDScan[]>([
    { time: '17:45:01', sku: 'STEEL-AH36-PL12', location: 'Gate A Entrance', tagId: 'RFID-ST-AH36-12-0042' },
    { time: '17:46:12', sku: 'WELD-E7018-32', location: 'Aisle C Aisle 3', tagId: 'RFID-WD-E7018-32-0982' },
    { time: '17:47:04', sku: 'ENG-MTU-INJECTOR', location: 'Aisle E Lockbox 1', tagId: 'RFID-EG-MTU-FI-018' }
  ]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find(i => i.sku === reqSku);
    if (!item) return;

    const currentVal = inventoryOverrides[item.id] !== undefined ? inventoryOverrides[item.id] : item.currentStock;
    if (currentVal < reqQty) {
      triggerToast(`Error: Insufficient stock for ${reqSku}`);
      return;
    }

    setInventoryOverrides(prev => ({
      ...prev,
      [item.id]: currentVal - reqQty
    }));

    // Add to RFID scanner feed
    const timeStr = new Date().toTimeString().split(' ')[0];
    const rfidTag = item.rfidTagId || `RFID-${item.category.slice(0,2).toUpperCase()}-${Math.floor(100+Math.random()*900)}`;
    setRfidScans(prev => [
      { time: timeStr, sku: item.sku, location: `Dispatch Gate ${Math.floor(1+Math.random()*3)}`, tagId: rfidTag },
      ...prev
    ]);

    triggerToast(`Success: Dispatched ${reqQty} units of ${reqSku}.`);
  };

  const handleRestockPaint = () => {
    if (restockingPaint) return;
    setRestockingPaint(true);
    setRestockProgress(0);
    triggerToast("Initiating material replenishment dispatch...");
  };

  // Animate paint restock loading progress bar
  useEffect(() => {
    if (!restockingPaint) return;
    const interval = setInterval(() => {
      setRestockProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRestockingPaint(false);
          // Update Paint stock (Jotun is inv003)
          setInventoryOverrides(prevOverrides => ({
            ...prevOverrides,
            'inv003': 33 // Restocked value (minimum 10 + 23)
          }));
          triggerToast("Paint Restocked. Jotun SeaForce 90 inventory replenished (33 drums).");
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [restockingPaint]);

  // Telemetry RFID scans generator
  useEffect(() => {
    const interval = setInterval(() => {
      const items = inventory.filter(i => i.id !== 'inv003' || (inventoryOverrides['inv003'] !== undefined ? inventoryOverrides['inv003'] : i.currentStock) > 0);
      if (items.length === 0) return;

      const randomItem = items[Math.floor(Math.random() * items.length)];
      const gates = ['Warehouse Gate A', 'Warehouse Gate B', 'Aisle Corridor 2', 'Aisle Corridor 4'];
      const timeStr = new Date().toTimeString().split(' ')[0];
      const tag = randomItem.rfidTagId || `RFID-TAG-${Math.floor(1000 + Math.random() * 9000)}`;

      setRfidScans(prev => [
        { time: timeStr, sku: randomItem.sku, location: gates[Math.floor(Math.random() * gates.length)], tagId: tag },
        ...prev.slice(0, 10)
      ]);
    }, 8500);

    return () => clearInterval(interval);
  }, [inventory, inventoryOverrides]);

  const getStockStatusClass = (status: InventoryItem['stockStatus']) => {
    if (status === 'Healthy') return 'badge-success';
    if (status === 'Low') return 'badge-warning';
    return 'badge-critical';
  };

  const getFilteredInventory = () => {
    let list = inventory.map(item => {
      const currentVal = inventoryOverrides[item.id] !== undefined ? inventoryOverrides[item.id] : item.currentStock;
      const status: InventoryItem['stockStatus'] = currentVal <= item.minimumStock 
        ? 'Critical' 
        : currentVal <= item.reorderPoint 
        ? 'Low' 
        : 'Healthy';
      return { ...item, currentStock: currentVal, stockStatus: status };
    });

    if (selectedWarehouseZone) {
      if (selectedWarehouseZone === 'A') {
        list = list.filter(i => i.warehouse.includes('Area A') || i.category === 'Structural');
      } else if (selectedWarehouseZone === 'Chemical') {
        list = list.filter(i => i.warehouse.includes('Chemical') || i.category === 'Consumable');
      } else {
        list = list.filter(i => i.category === 'SparePart');
      }
    }
    return list;
  };

  const filteredItems = getFilteredInventory();
  const jotunPaint = filteredItems.find(i => i.id === 'inv003');
  const showPaintWarning = jotunPaint && (jotunPaint.currentStock <= jotunPaint.minimumStock);

  const columns = [
    { header: 'SKU', accessor: 'sku' as const },
    { header: 'Part Name', accessor: 'name' as const },
    { header: 'Category', accessor: 'category' as const },
    { header: 'Warehouse Location', accessor: 'location' as const },
    { header: 'Qty Available', accessor: (row: InventoryItem) => `${row.currentStock} ${row.unit}` },
    { header: 'Status', accessor: (row: InventoryItem) => (
        <span className={`badge ${getStockStatusClass(row.stockStatus)}`}>
          {row.stockStatus}
        </span>
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

      {/* Header bar */}
      <div className="border-b border-border/80 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
            MARINE STORES & INVENTORY
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Material allocation, heatmaps, stock availability alerts, and RFID tracking logs.
          </p>
        </div>

        {/* View toggle knobs */}
        <div className="flex items-center gap-2 select-none">
          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              showBoxes 
                ? 'border-white text-text-primary bg-white/5' 
                : 'border-border text-text-secondary hover:border-text-primary'
            }`}
          >
            Bin Bounding Boxes
          </button>
          
          <button
            onClick={() => setShowHeatmaps(!showHeatmaps)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              showHeatmaps 
                ? 'border-white text-text-primary bg-white/5' 
                : 'border-border text-text-secondary hover:border-text-primary'
            }`}
          >
            Stock Density Maps
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Warehouse map layout - 2 cols */}
        <div className="xl:col-span-2 card p-4 flex flex-col justify-between min-h-[300px]">
          <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase text-text-primary tracking-wider">
                Mussafah Warehouse 1 Material Layout
              </h3>
            </div>
            <span className="text-[9px] font-mono text-text-muted">
              {selectedWarehouseZone ? `FILTERED: Sector ${selectedWarehouseZone}` : 'CLICK SECTOR TO FILTER LIST'}
            </span>
          </div>

          <div className="flex-1 bg-black/30 flex items-center justify-center relative min-h-[220px]">
            <WarehouseMap 
              selectedWarehouseZone={selectedWarehouseZone}
              setSelectedWarehouseZone={setSelectedWarehouseZone}
              showBoxes={showBoxes}
              showHeatmaps={showHeatmaps}
              inventory={filteredItems}
            />
          </div>
        </div>

        {/* Requisition dispatcher forms */}
        <div className="flex flex-col gap-6">
          
          <form onSubmit={handleRequisition} className="card p-5 bg-bg-surface border-l-2 border-l-accent flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <Truck className="w-4 h-4 text-accent" />
                <h3 className="text-xs font-black uppercase text-text-primary tracking-wider">
                  Material Dispatch Requisition
                </h3>
              </div>
              
              <div className="space-y-3 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-text-secondary">Select Stock SKU:</span>
                  <select
                    value={reqSku}
                    onChange={(e) => setReqSku(e.target.value)}
                    className="bg-bg-overlay border border-border rounded p-2 text-text-primary focus:outline-none w-full"
                  >
                    {inventory.map(i => (
                      <option key={i.id} value={i.sku}>{i.sku} ({i.name})</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-text-secondary">Quantity to Dispatch:</span>
                  <input
                    type="number"
                    min={1}
                    value={reqQty}
                    onChange={(e) => setReqQty(Math.max(1, Number(e.target.value)))}
                    className="bg-bg-overlay border border-border rounded p-2 text-text-primary focus:outline-none w-full font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-2 bg-accent hover:bg-accent-hover text-text-inverse font-bold text-xs rounded-lg transition-colors cursor-pointer text-center"
            >
              Dispatch Requisition
            </button>
          </form>

        </div>

      </div>

      {/* RFID scanner feed & stock warning notifications row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* RFID scans log */}
        <div className="card p-4 space-y-3 h-[200px] flex flex-col">
          <div className="flex items-center justify-between border-b border-border/80 pb-2">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-accent" /> RFID Reader Activity Stream
            </h3>
            <span className="text-[8px] font-mono bg-bg-muted px-2 py-0.5 rounded text-accent border border-accent/20">SCANNERS ON</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin text-xs pr-1">
            {rfidScans.map((scan, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-border/30 pb-1">
                <span className="font-mono text-text-muted">{scan.time}</span>
                <span className="font-bold text-text-primary">{scan.sku}</span>
                <span className="text-text-secondary">{scan.location}</span>
                <span className="font-mono text-accent text-[10px]">{scan.tagId}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Refill alerts and lead times */}
        <div className="card p-4 space-y-4 h-[200px] flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Inventory Refills & Spares Alerts
            </h3>

            {/* Low stock refill alert */}
            {showPaintWarning ? (
              <div className="flex items-center justify-between bg-critical-muted/10 border border-critical/30 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-critical shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-critical uppercase">CRITICAL STOCK: JOTUN COATINGS</div>
                    <div className="text-[9px] text-text-secondary mt-0.5">{jotunPaint.currentStock} drums remaining. Minimum: 10.</div>
                  </div>
                </div>

                <button
                  onClick={handleRestockPaint}
                  disabled={restockingPaint}
                  className="px-2.5 py-1 bg-critical hover:bg-critical-muted text-text-inverse font-bold text-[9px] rounded uppercase cursor-pointer transition-colors"
                >
                  {restockingPaint ? `Refilling ${restockProgress}%` : 'Refill Stock'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 bg-success-muted/10 border border-success/30 p-3 rounded-xl">
                <Check className="w-4 h-4 text-success shrink-0" />
                <div>
                  <div className="text-[10px] font-bold text-success uppercase">All Stock Categories Healthy</div>
                  <div className="text-[9px] text-text-secondary mt-0.5">Critical material reorder metrics secure.</div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-border/80 pt-3">
            <div>
              <span className="text-text-muted">Long-Lead Spares:</span>
              <div className="font-bold text-text-primary mt-0.5">MTU Injectors (45 days)</div>
            </div>
            <div>
              <span className="text-text-muted">Supply Chain Lead:</span>
              <div className="font-bold text-text-primary mt-0.5">Combat System Radar (90 days)</div>
            </div>
          </div>
        </div>

      </div>

      {/* Active registry table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-wider text-text-muted">
            Active Stock Registry {selectedWarehouseZone ? `(Filtered: Sector ${selectedWarehouseZone})` : ''}
          </h3>
          {selectedWarehouseZone && (
            <button
              onClick={() => setSelectedWarehouseZone(null)}
              className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>
        <DataTable
          columns={columns}
          data={filteredItems}
          emptyMessage="No material records registered."
        />
      </div>
    </div>
  );
}
