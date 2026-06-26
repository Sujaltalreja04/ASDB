import React, { useState } from 'react';
import { useYardDataStore } from '../../lib/mock-data/store';
import DataTable from '../../components/ui/DataTable';
import { Shield, Plus, ShieldAlert, CheckCircle2, AlertTriangle, Users, Compass, Eye, Flame, Trash2, Check, Radio } from 'lucide-react';
import { Permit, PermitType } from '../../types/adsb';

export default function SafetyIntelligence() {
  const { permits, envReadings, addPermit, updatePermitStatus } = useYardDataStore();
  const [selectedPermitId, setSelectedPermitId] = useState<string | null>(null);
  const [isRequestingPermit, setIsRequestingPermit] = useState(false);
  const [drillActive, setDrillActive] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // local gas telemetry override for ventilation demo
  const [gasOverride, setGasOverride] = useState<Record<string, number>>({});

  // Form State
  const [pTitle, setPTitle] = useState('');
  const [pType, setPType] = useState<PermitType>('HotWork');
  const [pLocation, setPLocation] = useState('');
  const [pZone, setPZone] = useState('Bay1');
  const [pHazards, setPHazards] = useState('Flammable Environment, Heat Stress');

  const selectedPermit = permits.find(p => p.id === selectedPermitId) || permits[0];

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreatePermit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle.trim() || !pLocation.trim()) return;

    addPermit({
      title: pTitle,
      description: pTitle,
      type: pType,
      location: pLocation,
      zone: pZone,
      requestedBy: 'Amit Sharma (Supervisor)',
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      hazards: pHazards.split(',').map(h => h.trim()),
      ppe: ['Safety Helmet', 'High-Vis Vest', 'Steel-toe boots', 'Gas detector'],
      personnel: ['Rajesh Kumar', 'Ali Al-Hassani'],
      maxPersonnel: 4,
      currentPersonnel: 2
    });

    // Reset Form
    setPTitle('');
    setPLocation('');
    setIsRequestingPermit(false);
    triggerToast("PTW permit request submitted successfully.");
  };

  const handleVentilate = () => {
    if (!selectedPermit) return;
    const updatedGases: Record<string, number> = {};
    selectedPermit.gasReadings?.forEach(g => {
      if (g.gas === 'LEL') updatedGases['LEL'] = 0;
      if (g.gas === 'H2S') updatedGases['H2S'] = 0;
      if (g.gas === 'CO') updatedGases['CO'] = 1;
      if (g.gas === 'O2') updatedGases['O2'] = 20.9;
    });
    setGasOverride(updatedGases);
    triggerToast("Ventilation active: gas readings normalized.");
  };

  const columns = [
    { header: 'Permit Number', accessor: 'permitNumber' as const },
    { header: 'Permit Title', accessor: (row: Permit) => (
        <div>
          <div className="font-bold text-text-primary">{row.title}</div>
          <div className="text-[10px] text-text-muted mt-0.5">{row.location}</div>
        </div>
      )
    },
    { header: 'Type', accessor: (row: Permit) => (
        <span className="badge badge-neutral">{row.type.replace(/([A-Z])/g, ' $1').trim()}</span>
      )
    },
    { header: 'Valid Untill', accessor: (row: Permit) => (
        <span className="font-mono text-xs">{new Date(row.validTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      )
    },
    { header: 'Status', accessor: (row: Permit) => (
        <span className={`badge ${
          row.status === 'Active' ? 'badge-success' : row.status === 'PendingHSE' ? 'badge-warning' : 'badge-neutral'
        }`}>
          {row.status}
        </span>
      )
    },
    { header: 'Action', accessor: (row: Permit) => (
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPermitId(row.id)}
            className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
          >
            Review Details
          </button>
          {row.status !== 'Active' && row.status !== 'Closed' && (
            <>
              <span className="text-text-muted">|</span>
              <button
                onClick={() => {
                  updatePermitStatus(row.id, 'Active');
                  triggerToast(`Permit ${row.permitNumber} marked as ACTIVE`);
                }}
                className="text-[10px] font-bold text-success hover:underline cursor-pointer"
              >
                Approve (T5)
              </button>
            </>
          )}
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

      {/* Evacuation Alert Banner */}
      {drillActive && (
        <div className="alert-banner alert-banner-critical animate-pulse border border-critical/30 mb-2">
          <ShieldAlert className="w-5 h-5 text-critical shrink-0" />
          <div className="flex-1">
            <div className="text-xs font-bold text-critical uppercase">EMERGENCY DRILL ALARM ACTIVE</div>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Evacuate all non-essential personnel to designated assembly points. Abu Dhabi Civil Defence simulated dispatch.
            </p>
          </div>
          <button
            onClick={() => {
              setDrillActive(false);
              triggerToast("Emergency muster alarm drills terminated.");
            }}
            className="text-[10px] font-bold text-text-primary bg-critical/20 px-2 py-1 rounded cursor-pointer"
          >
            Dismiss Drill
          </button>
        </div>
      )}

      {/* Welcome banner & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
            SAFETY & EMERGENCY CONTROL CENTER
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Permit-to-work (PTW) workflows, gas & fire telemetry, muster points, and environmental readings.
          </p>
        </div>

        <button
          onClick={() => setIsRequestingPermit(!isRequestingPermit)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-text-inverse text-xs font-bold rounded-lg cursor-pointer transition-all shadow-glow-primary"
        >
          <Plus className="w-3.5 h-3.5" /> Request PTW Permit
        </button>
      </div>

      {/* Sensor telemetry & Permit info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Confined Space Gas Readings */}
        <div className="card p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Confined Space Gas Readings
            </h3>
            {selectedPermit && (
              <button
                onClick={handleVentilate}
                className="text-[9px] font-bold text-accent bg-accent-muted px-2 py-0.5 rounded cursor-pointer"
              >
                Ventilate Area
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {selectedPermit && selectedPermit.gasReadings ? (
              selectedPermit.gasReadings.map((gas, idx) => {
                const currentVal = gasOverride[gas.gas] !== undefined ? gasOverride[gas.gas] : gas.value;
                const currentStatus = gasOverride[gas.gas] !== undefined ? 'Safe' : gas.status;
                return (
                  <div key={idx} className="p-2.5 rounded bg-bg-overlay border border-border flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-text-primary">{gas.gas}</div>
                      <div className="text-[10px] text-text-muted mt-0.5">Threshold: &lt;{gas.limit}{gas.unit}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-black text-sm ${currentStatus === 'Safe' ? 'text-success' : 'text-critical'}`}>
                        {currentVal} {gas.unit}
                      </div>
                      <span className={`badge text-[9px] mt-0.5 ${currentStatus === 'Safe' ? 'badge-success' : 'badge-critical'}`}>
                        {currentStatus}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-text-muted text-xs">
                Select an active permit to monitor localized gas readings.
              </div>
            )}
          </div>
        </div>

        {/* Environmental Monitors */}
        <div className="card p-4 space-y-3">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Yard Environmental Sensors
          </h3>

          <div className="space-y-3 text-xs">
            {envReadings.map((reading) => (
              <div key={reading.id} className="p-2.5 rounded bg-bg-overlay border border-border flex items-center justify-between">
                <div>
                  <div className="font-bold text-text-primary">{reading.sensor}</div>
                  <div className="text-[10px] text-text-muted mt-0.5">Limit: {reading.limit}{reading.unit}</div>
                </div>
                <div className="text-right">
                  <div className={`font-black ${reading.status === 'Normal' ? 'text-text-primary' : 'text-critical'}`}>
                    {reading.value} {reading.unit}
                  </div>
                  <span className={`badge text-[9px] mt-0.5 ${
                    reading.status === 'Normal' ? 'badge-success' : 'badge-critical'
                  }`}>
                    {reading.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Mustering Station */}
        <div className="card p-4 space-y-3 bg-bg-surface border-l-2 border-l-primary relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Emergency Muster Headcount
              </h3>
              <button
                onClick={() => {
                  setDrillActive(true);
                  triggerToast("Evacuation drill alarm triggered.");
                }}
                className="text-[9px] font-bold text-critical bg-critical/20 px-2 py-0.5 rounded cursor-pointer flex items-center gap-1"
              >
                <Radio className="w-3 h-3 animate-pulse" /> Trigger Drill
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-bg-overlay border border-border rounded text-center">
                <span className="text-2xl font-black text-text-primary">642</span>
                <div className="text-[9px] font-bold text-text-muted uppercase mt-1">Total Onsite</div>
              </div>
              <div className="p-3 bg-bg-overlay border border-border rounded text-center">
                <span className={`text-2xl font-black ${drillActive ? 'text-critical animate-pulse' : 'text-accent'}`}>
                  {drillActive ? '94%' : '100%'}
                </span>
                <div className="text-[9px] font-bold text-text-muted uppercase mt-1">Accounted</div>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-primary-muted/12 border border-primary/20 text-[10px] text-text-secondary leading-relaxed">
            Station A (Quayside): 245. Station B (Outfitting): 397. Drill status: {drillActive ? 'DRILL IN PROGRESS' : 'STANDBY'}.
          </div>
        </div>
      </div>

      {/* PTW Request Form */}
      {isRequestingPermit && (
        <form onSubmit={handleCreatePermit} className="card p-4 bg-bg-surface border-border space-y-4">
          <h4 className="text-xs font-bold text-text-primary uppercase">Create Permit-to-Work (PTW) Request</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Permit Title</label>
              <input
                type="text"
                placeholder="e.g., Keel Weld Grinding"
                value={pTitle}
                onChange={(e) => setPTitle(e.target.value)}
                className="w-full bg-bg-overlay border border-border rounded-lg text-text-primary p-2 text-xs focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Permit Type</label>
              <select
                value={pType}
                onChange={(e) => setPType(e.target.value as any)}
                className="w-full bg-bg-overlay border border-border rounded-lg text-text-primary p-2 text-xs focus:outline-none"
              >
                <option value="HotWork">Hot Work</option>
                <option value="ConfinedSpace">Confined Space</option>
                <option value="WorkingAtHeight">Working at Height</option>
                <option value="ElectricalIsolation">Electrical isolation (LOTO)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Yard Area Zone</label>
              <select
                value={pZone}
                onChange={(e) => setPZone(e.target.value)}
                className="w-full bg-bg-overlay border border-border rounded-lg text-text-primary p-2 text-xs focus:outline-none"
              >
                <option value="Bay1">Build Bay 1</option>
                <option value="Bay2">Build Bay 2</option>
                <option value="Quayside">Outfitting Quayside</option>
                <option value="MinaZayed">Mina Zayed Dock</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Location Details</label>
              <input
                type="text"
                placeholder="e.g., Hull HN-301 Double Bottom tank DB02"
                value={pLocation}
                onChange={(e) => setPLocation(e.target.value)}
                className="w-full bg-bg-overlay border border-border rounded-lg text-text-primary p-2 text-xs focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Key Hazards</label>
              <input
                type="text"
                placeholder="Confined space, toxic fumes, weld rays"
                value={pHazards}
                onChange={(e) => setPHazards(e.target.value)}
                className="w-full bg-bg-overlay border border-border rounded-lg text-text-primary p-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-text-inverse font-bold text-xs rounded-lg cursor-pointer hover:bg-accent-hover transition-colors"
            >
              Submit Request
            </button>
            <button
              type="button"
              onClick={() => setIsRequestingPermit(false)}
              className="px-4 py-2 bg-bg-overlay border border-border text-text-secondary text-xs rounded-lg cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* PTW Active Permits log */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-text-muted">
          Active Permit-to-Work Register
        </h3>
        
        <DataTable
          columns={columns}
          data={permits}
          emptyMessage="No active permits requested."
        />
      </div>
    </div>
  );
}
