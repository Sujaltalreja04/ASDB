import React, { useState, useEffect, useRef } from 'react';
import { useYardDataStore } from '../../lib/mock-data/store';
import DataTable from '../../components/ui/DataTable';
import { Leaf, BarChart3, Wind, ShieldCheck, Check, Info, Zap, RefreshCw, Sun, BatteryCharging } from 'lucide-react';
import { ESGMetric } from '../../types/adsb';

interface BuildingEnergyState {
  name: string;
  load: number; // in kW
  ecoMode: boolean;
  gridOverride: boolean;
}

export default function SustainabilityIntelligence() {
  const { esgMetrics } = useYardDataStore();
  const [solarAllocation, setSolarAllocation] = useState(35);
  const [panelArea, setPanelArea] = useState(1200); // m^2
  const [panelEfficiency, setPanelEfficiency] = useState(22); // %
  const [sunlightHours, setSunlightHours] = useState(6.5); // hours/day
  const [ecoOptimized, setEcoOptimized] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Selected building details for the solar calculator / config
  const [selectedBuilding, setSelectedBuilding] = useState<string>('Assembly Bay A');
  const [buildings, setBuildings] = useState<BuildingEnergyState[]>([
    { name: 'Assembly Bay A', load: 180, ecoMode: true, gridOverride: false },
    { name: 'Dry Dock Control', load: 75, ecoMode: false, gridOverride: false },
    { name: 'Warehouse Hub', load: 120, ecoMode: true, gridOverride: false }
  ]);

  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const chartRequestRef = useRef<number | null>(null);

  // Time tracker for particle animations
  const timeRef = useRef<number>(0);

  // Live emission history data
  const [emissionsHistory, setEmissionsHistory] = useState<number[]>([42, 45, 41, 39, 43, 38, 35, 34, 32, 29, 31, 30]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSolarAllocation(val);
  };

  // Solar Calculator: Real-time generation calculations
  // Daily generation (kWh) = Area (m2) * Efficiency * Sunlight * Performance Ratio (approx 0.75)
  const calculateSolarGen = () => {
    const dailyKwh = panelArea * (panelEfficiency / 100) * sunlightHours * 0.75;
    return Math.round(dailyKwh);
  };

  // Daily offset in kg CO2 (approx 0.4 kg CO2 per kWh)
  const calculateCo2Offset = () => {
    const dailyKwh = calculateSolarGen();
    const offsetKg = dailyKwh * 0.405; // 0.405 kg CO2 per kWh (Abu Dhabi grid average)
    return (offsetKg / 1000).toFixed(2); // Convert to tonnes
  };

  // Dynamically calculate Scope 2 Carbon based on solar allocation
  const baseScope2 = 120.0;
  const currentScope2 = (baseScope2 * (1 - solarAllocation / 100)).toFixed(1);

  const getFilteredMetrics = () => {
    return esgMetrics.map(metric => {
      if (metric.metric.includes('Scope 2')) {
        return { ...metric, value: Number(currentScope2) };
      }
      if (metric.metric.includes('Solar offset')) {
        return { ...metric, value: solarAllocation };
      }
      return metric;
    });
  };

  const displayMetrics = getFilteredMetrics();

  // Handle building settings change
  const toggleBuildingEco = (name: string) => {
    setBuildings(prev =>
      prev.map(b => (b.name === name ? { ...b, ecoMode: !b.ecoMode } : b))
    );
    const target = buildings.find(b => b.name === name);
    triggerToast(`${name} Eco Mode set to ${!target?.ecoMode ? 'ACTIVE' : 'INACTIVE'}`);
  };

  const toggleBuildingGrid = (name: string) => {
    setBuildings(prev =>
      prev.map(b => (b.name === name ? { ...b, gridOverride: !b.gridOverride } : b))
    );
    const target = buildings.find(b => b.name === name);
    triggerToast(`${name} Grid Override set to ${!target?.gridOverride ? 'ACTIVE' : 'INACTIVE'}`);
  };

  // Dynamic particle flow & schematic rendering
  useEffect(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      timeRef.current += 0.05;
      const t = timeRef.current;

      // Draw dark grid environment
      ctx.fillStyle = '#060D1A';
      ctx.fillRect(0, 0, 500, 220);

      // Cyber style background grids
      ctx.strokeStyle = 'rgba(0, 212, 160, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 500; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 220); ctx.stroke();
      }
      for (let y = 0; y < 220; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(500, y); ctx.stroke();
      }

      // 1. Grid Substation Node (Top Center)
      const subX = 250, subY = 25;
      ctx.fillStyle = '#1A2E46';
      ctx.strokeStyle = '#2D5A88';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(subX, subY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#E8EDF5';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('AL WATHBA GRID', subX, subY - 18);

      // 2. Solar Panels Source Node (Top Left)
      const solX = 70, solY = 25;
      ctx.fillStyle = '#0B2D26';
      ctx.strokeStyle = '#00D4A0';
      ctx.beginPath();
      ctx.arc(solX, solY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#E8EDF5';
      ctx.fillText('SOLAR FIELD', solX, solY - 18);

      // Draw simple solar panel symbols in it
      ctx.strokeStyle = '#00D4A0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(solX - 6, solY - 6); ctx.lineTo(solX + 6, solY + 6);
      ctx.moveTo(solX - 6, solY + 6); ctx.lineTo(solX + 6, solY - 6);
      ctx.stroke();

      // 3. Yard Batteries Storage Node (Top Right)
      const batX = 430, batY = 25;
      ctx.fillStyle = '#1B2C24';
      ctx.strokeStyle = '#FFB400';
      ctx.beginPath();
      ctx.arc(batX, batY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#E8EDF5';
      ctx.fillText('BESS BATTERY', batX, batY - 18);

      // Draw buildings at bottom
      const buildingNodes = [
        { name: 'Assembly Bay A', x: 90, y: 155, w: 100, h: 45, eco: buildings[0].ecoMode, grid: buildings[0].gridOverride },
        { name: 'Dry Dock Control', x: 250, y: 160, w: 90, h: 40, eco: buildings[1].ecoMode, grid: buildings[1].gridOverride },
        { name: 'Warehouse Hub', x: 410, y: 150, w: 100, h: 50, eco: buildings[2].ecoMode, grid: buildings[2].gridOverride }
      ];

      buildingNodes.forEach(node => {
        const isSelected = selectedBuilding === node.name;
        // Background card for building
        ctx.fillStyle = isSelected ? '#0D1F2D' : '#0B121F';
        ctx.strokeStyle = isSelected ? '#00D4A0' : '#1A2A44';
        ctx.lineWidth = isSelected ? 2 : 1;
        
        // Draw building card
        ctx.beginPath();
        ctx.roundRect(node.x - node.w / 2, node.y - 10, node.w, node.h, 6);
        ctx.fill();
        ctx.stroke();

        // Solar panels layout pattern on the roof
        ctx.fillStyle = '#163B4F';
        ctx.fillRect(node.x - node.w / 2 + 5, node.y - 5, node.w - 10, 4);

        // Building Label
        ctx.fillStyle = '#E8EDF5';
        ctx.font = 'bold 9px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + 12);

        // Eco & Grid badges
        ctx.font = '6px monospace';
        if (node.eco) {
          ctx.fillStyle = '#00D4A0';
          ctx.fillRect(node.x - node.w / 2 + 8, node.y + 20, 24, 8);
          ctx.fillStyle = '#060D1A';
          ctx.fillText('ECO', node.x - node.w / 2 + 20, node.y + 26);
        } else {
          ctx.fillStyle = 'rgba(143, 165, 192, 0.2)';
          ctx.fillRect(node.x - node.w / 2 + 8, node.y + 20, 24, 8);
          ctx.fillStyle = '#E8EDF5';
          ctx.fillText('NORM', node.x - node.w / 2 + 20, node.y + 26);
        }

        if (node.grid) {
          ctx.fillStyle = '#FFB400';
          ctx.fillRect(node.x + node.w / 2 - 32, node.y + 20, 24, 8);
          ctx.fillStyle = '#060D1A';
          ctx.fillText('GRID', node.x + node.w / 2 - 20, node.y + 26);
        } else {
          ctx.fillStyle = '#00D4A0';
          ctx.fillRect(node.x + node.w / 2 - 32, node.y + 20, 24, 8);
          ctx.fillStyle = '#060D1A';
          ctx.fillText('AUTO', node.x + node.w / 2 - 20, node.y + 26);
        }
      });

      // 4. Power flow pathways (lines)
      ctx.lineWidth = 1.5;
      
      // Solar to buildings (green lines)
      const drawFlowLine = (sx: number, sy: number, ex: number, ey: number, color: string, rate: number, reverse: boolean = false) => {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // Draw flowing dots/particles along the line
        ctx.fillStyle = color;
        const dist = Math.hypot(ex - sx, ey - sy);
        const particleCount = Math.floor(dist / 25);
        for (let i = 0; i < particleCount; i++) {
          let progress = ((t * rate) + (i / particleCount)) % 1;
          if (reverse) progress = 1 - progress;
          const px = sx + (ex - sx) * progress;
          const py = sy + (ey - sy) * progress;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      // Solar to Battery
      drawFlowLine(solX, solY, batX, batY, '#00D4A0', 1.2 * (solarAllocation / 100));

      // Substation Grid lines (grey)
      buildingNodes.forEach(node => {
        const gridPowerPercent = node.grid ? 1.0 : (1 - solarAllocation / 100);
        // Connect Al Wathba Substation to building
        drawFlowLine(subX, subY, node.x, node.y - 10, 'rgba(143, 165, 192, 0.4)', 0.8 * gridPowerPercent);

        // Connect Solar to building (green lines)
        const solarPowerPercent = node.grid ? 0.0 : (solarAllocation / 100);
        if (solarPowerPercent > 0.05) {
          drawFlowLine(solX, solY, node.x, node.y - 10, '#00D4A0', 1.5 * solarPowerPercent);
        }

        // Battery to building (yellow if eco and battery supporting)
        if (node.eco && solarAllocation > 40) {
          drawFlowLine(batX, batY, node.x, node.y - 10, '#FFB400', 0.9);
        }
      });

      // Quick telemetry panel details inside Canvas
      ctx.fillStyle = 'rgba(0, 212, 160, 0.3)';
      ctx.font = '8px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`SOLAR POWER FIELD GEN: ${calculateSolarGen()} kWh | CO2 REDUCTION: ${calculateCo2Offset()} t`, 15, 210);

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [solarAllocation, panelArea, panelEfficiency, sunlightHours, selectedBuilding, buildings]);

  // Real-time emissions history chart loop
  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderChart = () => {
      ctx.fillStyle = '#060D1A';
      ctx.fillRect(0, 0, 500, 180);

      // Gridlines
      ctx.strokeStyle = 'rgba(143, 165, 192, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 40; x < 500; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, 150); ctx.stroke();
      }
      for (let y = 20; y <= 150; y += 26) {
        ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(480, y); ctx.stroke();
      }

      const points = emissionsHistory;
      const step = 440 / (points.length - 1);
      
      // Plot grid background bounds
      ctx.fillStyle = 'rgba(0, 212, 160, 0.03)';
      ctx.beginPath();
      ctx.moveTo(40, 150);
      points.forEach((val, idx) => {
        const x = 40 + idx * step;
        // Dynamically shift value down if solar allocation increases
        const adjustedVal = idx === points.length - 1 
          ? Number(currentScope2) 
          : val * (1 - (solarAllocation * 0.003));
        const y = 150 - (adjustedVal / 140) * 120;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(480, 150);
      ctx.closePath();
      ctx.fill();

      // Main line plot
      ctx.strokeStyle = '#00D4A0';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      points.forEach((val, idx) => {
        const x = 40 + idx * step;
        const adjustedVal = idx === points.length - 1 
          ? Number(currentScope2) 
          : val * (1 - (solarAllocation * 0.003));
        const y = 150 - (adjustedVal / 140) * 120;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw points with values
      ctx.fillStyle = '#E8EDF5';
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      points.forEach((val, idx) => {
        const x = 40 + idx * step;
        const adjustedVal = idx === points.length - 1 
          ? Number(currentScope2) 
          : val * (1 - (solarAllocation * 0.003));
        const y = 150 - (adjustedVal / 140) * 120;
        
        ctx.fillStyle = '#00D4A0';
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#060D1A';
        ctx.stroke();

        ctx.fillStyle = '#8FA5C0';
        ctx.fillText(Math.round(adjustedVal).toString(), x, y - 8);
      });

      // Axis labels
      ctx.fillStyle = '#8FA5C0';
      ctx.font = '8px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('140 t', 32, 20);
      ctx.fillText('70 t', 32, 85);
      ctx.fillText('0 t', 32, 150);

      ctx.textAlign = 'center';
      const labelMonths = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
      labelMonths.forEach((m, idx) => {
        ctx.fillText(m, 40 + idx * step, 166);
      });

      chartRequestRef.current = requestAnimationFrame(renderChart);
    };

    renderChart();

    return () => {
      if (chartRequestRef.current) cancelAnimationFrame(chartRequestRef.current);
    };
  }, [emissionsHistory, solarAllocation, currentScope2]);

  // Click handler to select buildings from canvas coordinates
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Check hit boxes of buildings
    const buildingNodes = [
      { name: 'Assembly Bay A', x: 90, y: 155, w: 100, h: 45 },
      { name: 'Dry Dock Control', x: 250, y: 160, w: 90, h: 40 },
      { name: 'Warehouse Hub', x: 410, y: 150, w: 100, h: 50 }
    ];

    let found = false;
    buildingNodes.forEach(node => {
      const left = node.x - node.w / 2;
      const right = node.x + node.w / 2;
      const top = node.y - 10;
      const bottom = node.y - 10 + node.h;
      if (x >= left && x <= right && y >= top && y <= bottom) {
        setSelectedBuilding(node.name);
        found = true;
        triggerToast(`Switched active monitor to ${node.name}`);
      }
    });

    if (!found) {
      // Check if solar field was clicked
      if (Math.hypot(x - 70, y - 25) < 18) {
        triggerToast("Solar panel field arrays loaded. Active panel calculator opened.");
      }
    }
  };

  const handleEcoOptimization = () => {
    setEcoOptimized(true);
    setSolarAllocation(85);
    setPanelEfficiency(24);
    setPanelArea(1500);
    setBuildings(prev => prev.map(b => ({ ...b, ecoMode: true, gridOverride: false })));
    triggerToast("Executing ADSB Yard-wide ESG optimization parameters. Solar offset set to max eco mode (85%).");
  };

  const resetEcoParameters = () => {
    setEcoOptimized(false);
    setSolarAllocation(35);
    setPanelEfficiency(22);
    setPanelArea(1200);
    setBuildings([
      { name: 'Assembly Bay A', load: 180, ecoMode: true, gridOverride: false },
      { name: 'Dry Dock Control', load: 75, ecoMode: false, gridOverride: false },
      { name: 'Warehouse Hub', load: 120, ecoMode: true, gridOverride: false }
    ]);
    triggerToast("ESG optimization parameter resets to yard baseline.");
  };

  const activeBuilding = buildings.find(b => b.name === selectedBuilding) || buildings[0];

  const columns = [
    { header: 'Metric Category', accessor: 'category' as const },
    { header: 'Sustainability Target', accessor: 'metric' as const },
    { header: 'Measured Value', accessor: (row: ESGMetric) => `${row.value} ${row.unit}` },
    { header: 'EDGE Group Target', accessor: (row: ESGMetric) => `${row.target} ${row.unit}` },
    { header: 'Trend Status', accessor: (row: ESGMetric) => (
        <span className={`badge ${
          row.trend === 'down' || row.metric.includes('Scope 2') ? 'badge-success' : 'badge-neutral'
        }`}>
          {row.trend === 'down' || row.metric.includes('Scope 2') ? 'Improving' : 'Stable'}
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
      <div className="border-b border-border/80 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
            SUSTAINABILITY & ESG INTELLIGENCE
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Shipyard carbon emissions (Scope 1-3), solar offset modeling, BESS battery flow, and recycling registries.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleEcoOptimization}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover text-text-inverse text-xs font-bold rounded-lg cursor-pointer transition-all"
          >
            <Zap className="w-3.5 h-3.5" /> Auto ESG Optimize
          </button>
          {ecoOptimized && (
            <button
              onClick={resetEcoParameters}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-surface hover:bg-bg-muted border border-border text-text-primary text-xs font-bold rounded-lg cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Yard
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Visual Flow schematic and carbon stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Solar Flow Canvas (Grid schematic) - Takes 2 Columns */}
        <div className="lg:col-span-2 card p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-black uppercase text-text-primary tracking-wider">
                ADSB Shipyard Microgrid Power Flow Schematic
              </h3>
            </div>
            <span className="text-[10px] text-text-secondary font-mono bg-bg-overlay px-2 py-0.5 rounded border border-border">
              Interactive Blueprint (Click Buildings)
            </span>
          </div>

          <div className="relative bg-black/40 rounded-lg overflow-hidden border border-border/70 flex items-center justify-center">
            <canvas
              ref={gridCanvasRef}
              width={500}
              height={220}
              onClick={handleCanvasClick}
              className="w-full h-full object-cover rounded-lg cursor-pointer"
            />
            
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-bg-surface/90 border border-border px-2 py-1 rounded text-[8px] font-mono">
              <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span>LIVE MICROGRID SIMULATION</span>
            </div>
          </div>
        </div>

        {/* Selected Building Controller & Solar Calculator */}
        <div className="card p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border-b border-border/80 pb-2">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Building Energy Controller
              </h3>
              <div className="text-xs font-black text-text-primary mt-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-primary" /> {activeBuilding.name}
              </div>
            </div>

            {/* Building Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-bg-overlay border border-border">
                <div className="text-[9px] text-text-secondary">LOAD DEMAND</div>
                <div className="font-bold text-text-primary">{activeBuilding.load} kW</div>
              </div>
              <div className="p-2 rounded bg-bg-overlay border border-border">
                <div className="text-[9px] text-text-secondary">SOLAR SHARE</div>
                <div className="font-bold text-accent">
                  {activeBuilding.gridOverride ? '0' : solarAllocation}%
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary">HSE Eco-Mode (Limit Peak)</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeBuilding.ecoMode}
                    onChange={() => toggleBuildingEco(activeBuilding.name)}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-accent peer-checked:after:bg-text-inverse"></div>
                </label>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary">Force Grid Override</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeBuilding.gridOverride}
                    onChange={() => toggleBuildingGrid(activeBuilding.name)}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-critical peer-checked:after:bg-text-inverse"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Calculator Parameters */}
          <div className="border-t border-border/80 pt-3 space-y-3">
            <h4 className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
              Solar Fields Parameters (m² Area)
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary">Installed Panels Area</span>
                <span className="text-text-primary font-mono">{panelArea} m²</span>
              </div>
              <input
                type="range"
                min={200}
                max={3000}
                step={100}
                value={panelArea}
                onChange={(e) => setPanelArea(Number(e.target.value))}
                className="w-full accent-primary h-1 bg-bg-muted rounded-lg appearance-none cursor-pointer"
              />

              <div className="flex justify-between">
                <span className="text-text-secondary">Silicon Cell Efficiency</span>
                <span className="text-text-primary font-mono">{panelEfficiency}%</span>
              </div>
              <input
                type="range"
                min={15}
                max={26}
                step={1}
                value={panelEfficiency}
                onChange={(e) => setPanelEfficiency(Number(e.target.value))}
                className="w-full accent-primary h-1 bg-bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Charts and Emissions Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Emissions Graph Canvas - Takes 2 Columns */}
        <div className="lg:col-span-2 card p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase text-text-primary tracking-wider">
                Monthly Emissions Profile (t CO2e Scope 1-3)
              </h3>
            </div>
            <span className="text-[10px] text-text-secondary font-mono">
              Live Offset Projection
            </span>
          </div>

          <div className="bg-black/40 rounded-lg overflow-hidden border border-border/70">
            <canvas
              ref={chartCanvasRef}
              width={500}
              height={180}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Dynamic offsets dials & Scope stats */}
        <div className="card p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-border/80 pb-2">
              <Wind className="w-4 h-4 text-primary" />
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Carbon Footprint Summary
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-bg-overlay border border-border">
                <div>
                  <div className="font-bold text-text-primary">Scope 1 (Direct Gases)</div>
                  <div className="text-[9px] text-text-muted mt-0.5">Heavy machineries & welding</div>
                </div>
                <span className="font-bold text-text-primary font-mono">34.2 t</span>
              </div>

              <div className="flex justify-between p-2 rounded bg-bg-overlay border border-border">
                <div>
                  <div className="font-bold text-text-primary">Scope 2 (Electricity Power)</div>
                  <div className="text-[9px] text-text-muted mt-0.5">Grid offset: {solarAllocation}%</div>
                </div>
                <span className="font-bold text-accent font-mono animate-pulse">{currentScope2} t</span>
              </div>

              <div className="flex justify-between p-2 rounded bg-bg-overlay border border-border">
                <div>
                  <div className="font-bold text-text-primary">Scope 3 (Supply Chain)</div>
                  <div className="text-[9px] text-text-muted mt-0.5">Steel shipping & materials</div>
                </div>
                <span className="font-bold text-text-primary font-mono">195.4 t</span>
              </div>
            </div>
          </div>

          {/* Renewable Solar Offset allocation slider */}
          <div className="pt-2 border-t border-border/80 space-y-2.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">Solar Allocation Target</span>
              <span className="text-accent font-mono">{solarAllocation}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={solarAllocation}
              onChange={handleSliderChange}
              className="w-full accent-accent cursor-pointer h-1 bg-bg-muted rounded-lg appearance-none"
            />
            <div className="text-[8px] text-text-secondary leading-relaxed bg-primary-muted/12 border border-primary/20 p-2 rounded flex items-start gap-1">
              <BatteryCharging className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Simulates live solar array cells offsetting industrial grid drawing. Adjust to recalculate.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: ESG Registry */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-accent" /> Operational Sustainability ESG Registry
        </h3>
        <DataTable
          columns={columns}
          data={displayMetrics}
          emptyMessage="No ESG records registered."
        />
      </div>
    </div>
  );
}
