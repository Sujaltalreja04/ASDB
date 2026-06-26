import React, { useState } from 'react';
import { useYardDataStore } from '../../lib/mock-data/store';
import DataTable from '../../components/ui/DataTable';
import { Wrench, Heart, Compass, ShieldAlert, Calendar, BarChart3, AlertCircle, Check } from 'lucide-react';
import { MaintenanceAsset } from '../../types/adsb';

export default function AssetMaintenance() {
  const { assets } = useYardDataStore();
  const [selectedAssetId, setSelectedAssetId] = useState('gc01');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Local overrides for calibration interactivity demo
  const [calibratedAssets, setCalibratedAssets] = useState<Record<string, { health: number, rul: number }>>({});

  const activeAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  const currentHealth = calibratedAssets[activeAsset.id] 
    ? calibratedAssets[activeAsset.id].health 
    : activeAsset.healthScore;
    
  const currentRul = calibratedAssets[activeAsset.id] 
    ? calibratedAssets[activeAsset.id].rul 
    : activeAsset.rul;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCalibrate = () => {
    setCalibratedAssets(prev => ({
      ...prev,
      [activeAsset.id]: { health: 99, rul: 180 }
    }));
    triggerToast(`Calibration complete: ${activeAsset.assetId} health reset to 99%.`);
  };

  const getHealthColorClass = (score: number) => {
    if (score > 85) return 'text-success';
    if (score > 60) return 'text-warning';
    return 'text-critical';
  };

  const columns = [
    { header: 'ID', accessor: 'assetId' as const },
    { header: 'Asset Name', accessor: 'name' as const },
    { header: 'Health Score', accessor: (row: MaintenanceAsset) => {
        const h = calibratedAssets[row.id] ? calibratedAssets[row.id].health : row.healthScore;
        return (
          <span className={`font-black ${getHealthColorClass(h)}`}>
            {h}%
          </span>
        );
      }
    },
    { header: 'RUL (Days)', accessor: (row: MaintenanceAsset) => {
        const r = calibratedAssets[row.id] ? calibratedAssets[row.id].rul : row.rul;
        return <span className="font-mono text-xs">{r} days</span>;
      }
    },
    { header: 'Status', accessor: (row: MaintenanceAsset) => {
        const isCalibrated = !!calibratedAssets[row.id];
        const status = isCalibrated ? 'Operational' : row.status;
        return (
          <span className={`badge ${
            status === 'Operational' ? 'badge-success' : status === 'Fault' ? 'badge-critical' : 'badge-neutral'
          }`}>
            {status}
          </span>
        );
      }
    },
    { header: 'Action', accessor: (row: MaintenanceAsset) => (
        <button
          onClick={() => setSelectedAssetId(row.id)}
          className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
        >
          View Telemetry
        </button>
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

      {/* Welcome banner */}
      <div className="border-b border-border/80 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
          ASSET & PREDICTIVE MAINTENANCE
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Remaining Useful Life (RUL) monitoring, vibration telemetry, and planned overhaul scheduling.
        </p>
      </div>

      {/* RUL Gauge and Sensor dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RUL widget */}
        <div className="card p-4 flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
                Focus Asset Health Profile
              </h3>
              <div className="text-sm font-black text-text-primary mt-1">
                {activeAsset.assetId} - {activeAsset.name}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">Category: {activeAsset.category}</div>
            </div>
            
            <button
              onClick={handleCalibrate}
              className="text-[9px] font-bold text-accent bg-accent-muted px-2 py-0.5 rounded cursor-pointer"
            >
              Perform Calibration
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="p-3 rounded bg-bg-overlay border border-border">
              <div className="text-lg font-black text-text-primary">{currentRul} days</div>
              <span className="text-[9px] text-text-muted uppercase font-bold">REMAINING LIFE (RUL)</span>
            </div>
            <div className="p-3 rounded bg-bg-overlay border border-border">
              <div className={`text-lg font-black ${getHealthColorClass(currentHealth)}`}>
                {currentHealth}%
              </div>
              <span className="text-[9px] text-text-muted uppercase font-bold">HEALTH INDEX</span>
            </div>
          </div>

          <div className="text-[10px] text-text-muted font-mono leading-relaxed">
            MTU / Konecranes operational cycle data synchronized. Next overhaul scheduled: {activeAsset.nextMaintenance}.
          </div>
        </div>

        {/* Real-time vibration telemetry */}
        <div className="card p-4 space-y-4">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Real-time Sensor Telemetry
          </h3>

          <div className="space-y-3">
            {activeAsset.sensors.map((sensor) => (
              <div key={sensor.id} className="p-2.5 rounded bg-bg-overlay border border-border text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary">{sensor.name}</span>
                  <span className={`font-mono font-black ${
                    sensor.status === 'Normal' ? 'text-success' : 'text-critical'
                  }`}>
                    {sensor.value} {sensor.unit}
                  </span>
                </div>
                <div className="flex justify-between text-[9px] text-text-muted mt-1 leading-none">
                  <span>Threshold: &lt;{sensor.warningThreshold}{sensor.unit}</span>
                  <span className="capitalize">Status: {sensor.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Maintenance Probability */}
        <div className="card p-4 space-y-3 bg-bg-surface border-l-2 border-l-primary relative overflow-hidden">
          <h3 className="text-[10px] font-bold text-primary uppercase tracking-wider">
            Failure Probability Projections (AI)
          </h3>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">7-Day Horizon</span>
              <span className="font-black text-text-primary">
                {calibratedAssets[activeAsset.id] ? '0.0%' : `${(activeAsset.failureProbability7d * 100).toFixed(1)}%`}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">14-Day Horizon</span>
              <span className="font-black text-text-primary">
                {calibratedAssets[activeAsset.id] ? '0.0%' : `${(activeAsset.failureProbability14d * 100).toFixed(1)}%`}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">30-Day Horizon</span>
              <span className={`font-black ${activeAsset.failureProbability30d > 0.5 && !calibratedAssets[activeAsset.id] ? 'text-critical font-bold' : 'text-text-primary'}`}>
                {calibratedAssets[activeAsset.id] ? '0.0%' : `${(activeAsset.failureProbability30d * 100).toFixed(1)}%`}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-primary-muted/12 border border-primary/20 text-[10px] text-text-secondary leading-relaxed">
            <div className="font-bold text-text-primary flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-warning animate-pulse" />
              Sensor Alert Threshold Analysis
            </div>
            Vibration signature analysis reports normal bearing friction. Oil viscosity level optimal.
          </div>
        </div>
      </div>

      {/* Equipment lists */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-text-muted">
          Active Equipment Health Register
        </h3>
        
        <DataTable
          columns={columns}
          data={assets}
          emptyMessage="No equipment records registered."
        />
      </div>
    </div>
  );
}
