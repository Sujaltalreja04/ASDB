import React, { useState, useEffect } from 'react';
import { useYardDataStore } from '../../lib/mock-data/store';
import DataTable from '../../components/ui/DataTable';
import { Shield, Plus, ShieldAlert, CheckCircle2, AlertTriangle, Users, Compass, Eye, Flame, Trash2, Check, Radio, Activity, FileText } from 'lucide-react';
import { Permit, PermitType } from '../../types/adsb';

// Hardcoded initial ADSB-specific permits to guarantee high-fidelity
const adsbInitialPermits: Permit[] = [
  {
    id: 'ptw-1',
    permitNumber: 'PTW-HN301-HW-142',
    title: 'Keel Double Bottom Welding',
    description: 'Hot work welding on structural plate frame 42 of HN-301.',
    type: 'HotWork',
    status: 'Active',
    location: 'HN-301 Build Bay 1, Bottom structure',
    zone: 'Bay1',
    requestedBy: 'Amit Sharma (Supervisor)',
    requestedAt: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    approvalSteps: [],
    hazards: ['Weld Fumes', 'Flash Burn', 'Heat Stress'],
    ppe: ['Welding Hood', 'Leather Apron', 'High-Vis Vest', 'Gas Monitor'],
    personnel: ['Rajesh Kumar', 'Ali Al-Hassani'],
    maxPersonnel: 4,
    currentPersonnel: 2,
    gasReadings: [
      { gas: 'O2', value: 20.9, unit: '%', limit: 19.5, status: 'Safe' },
      { gas: 'LEL', value: 0, unit: '%', limit: 10, status: 'Safe' },
      { gas: 'H2S', value: 0.0, unit: 'ppm', limit: 10, status: 'Safe' },
      { gas: 'CO', value: 2.0, unit: 'ppm', limit: 35, status: 'Safe' }
    ]
  },
  {
    id: 'ptw-2',
    permitNumber: 'PTW-HN301-CS-089',
    title: 'Fuel Tank Main Inspection',
    description: 'Confined space entry for visual checking of fuel tank compartment seals.',
    type: 'ConfinedSpace',
    status: 'PendingHSE',
    location: 'HN-301 Compartment B3, Fuel Cell',
    zone: 'Bay1',
    requestedBy: 'Faisal Al-Zaabi (HSE Lead)',
    requestedAt: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    approvalSteps: [],
    hazards: ['Confined Space', 'Oxygen Deficiency', 'Slip Hazard'],
    ppe: ['Safety Harness', 'Oxygen Meter', 'Explosion-proof Torch'],
    personnel: ['Vikram Singh'],
    maxPersonnel: 2,
    currentPersonnel: 1,
    gasReadings: [
      { gas: 'O2', value: 20.2, unit: '%', limit: 19.5, status: 'Safe' },
      { gas: 'LEL', value: 2, unit: '%', limit: 10, status: 'Safe' },
      { gas: 'H2S', value: 1.5, unit: 'ppm', limit: 10, status: 'Safe' },
      { gas: 'CO', value: 5.0, unit: 'ppm', limit: 35, status: 'Safe' }
    ]
  },
  {
    id: 'ptw-3',
    permitNumber: 'PTW-HN302-WAH-214',
    title: 'Mast Antenna Radar Fitment',
    description: 'Mounting and alignment of tactical radar array systems on Mast frame.',
    type: 'WorkingAtHeight',
    status: 'Active',
    location: 'HN-302 Outfitting quay, Mast top',
    zone: 'Quayside',
    requestedBy: 'Elena Rostova (QA)',
    requestedAt: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    approvalSteps: [],
    hazards: ['Falling objects', 'High winds', 'Fall hazard'],
    ppe: ['Double-Lanyard Harness', 'Tool Lanyards', 'Safety Helmet'],
    personnel: ['John Doe', 'Ahmed Al-Mansoori'],
    maxPersonnel: 3,
    currentPersonnel: 2
  },
  {
    id: 'ptw-4',
    permitNumber: 'PTW-HN201-EI-305',
    title: 'Switchboard LOTO Isolation',
    description: 'Electrical lock-out tag-out on main auxiliary generator control panel.',
    type: 'ElectricalIsolation',
    status: 'Active',
    location: 'HN-201 Commissioning Berth, Aux room',
    zone: 'MinaZayed',
    requestedBy: 'Saeed Al-Qubaisi (Ops)',
    requestedAt: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    approvalSteps: [],
    hazards: ['High voltage', 'Arc flash'],
    ppe: ['Insulated Gloves', 'Safety Glasses', 'LOTO Padlock'],
    personnel: ['Klaus Mueller'],
    maxPersonnel: 1,
    currentPersonnel: 1
  },
  {
    id: 'ptw-5',
    permitNumber: 'PTW-HN301-CS-112',
    title: 'Ballast Tank Grinding Check',
    description: 'Surface preparation grinding in confined bilge compartment.',
    type: 'ConfinedSpace',
    status: 'Suspended',
    location: 'HN-301 Double-bottom bilge tank 12',
    zone: 'Bay1',
    requestedBy: 'Amit Sharma (Supervisor)',
    requestedAt: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    approvalSteps: [],
    hazards: ['Toxic gases', 'Fume build-up', 'Sparks'],
    ppe: ['Respirator Mask', 'Confined-space harness', 'Gas detector'],
    personnel: ['Rajesh Kumar'],
    maxPersonnel: 2,
    currentPersonnel: 1,
    gasReadings: [
      { gas: 'O2', value: 18.2, unit: '%', limit: 19.5, status: 'Danger' },
      { gas: 'LEL', value: 14, unit: '%', limit: 10, status: 'Danger' },
      { gas: 'H2S', value: 12.0, unit: 'ppm', limit: 10, status: 'Danger' },
      { gas: 'CO', value: 42.0, unit: 'ppm', limit: 35, status: 'Danger' }
    ]
  },
  {
    id: 'ptw-6',
    permitNumber: 'PTW-HN301-HW-155',
    title: 'Superstructure Bracket Welds',
    description: 'Hot work welding for superstructure bridge mounts.',
    type: 'HotWork',
    status: 'Draft',
    location: 'HN-301 Build Bay 1, Deck level 2',
    zone: 'Bay1',
    requestedBy: 'Ahmed Al-Mansoori (Apprentice)',
    requestedAt: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validTo: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    approvalSteps: [],
    hazards: ['Weld rays', 'Fire hazard'],
    ppe: ['Face shield', 'Welding gloves', 'Fire blanket'],
    personnel: [],
    maxPersonnel: 2,
    currentPersonnel: 0
  }
];

export default function SafetyIntelligence() {
  const { envReadings } = useYardDataStore();
  
  // Manage permits state locally to allow additions and status approvals
  const [permitsList, setPermitsList] = useState<Permit[]>(adsbInitialPermits);
  const [selectedPermitId, setSelectedPermitId] = useState<string>('ptw-1');
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

  const selectedPermit = permitsList.find(p => p.id === selectedPermitId) || permitsList[0];

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreatePermit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle.trim() || !pLocation.trim()) return;

    const newNumber = `PTW-HN301-${pType === 'HotWork' ? 'HW' : pType === 'ConfinedSpace' ? 'CS' : 'WAH'}-${Math.floor(100 + Math.random() * 900)}`;

    const newPermit: Permit = {
      id: `ptw-${Date.now()}`,
      permitNumber: newNumber,
      title: pTitle,
      description: pTitle,
      type: pType,
      status: 'PendingHSE',
      location: pLocation,
      zone: pZone,
      requestedBy: 'Amit Sharma (Supervisor)',
      requestedAt: new Date().toISOString(),
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      approvalSteps: [],
      hazards: pHazards.split(',').map(h => h.trim()),
      ppe: ['Safety Helmet', 'High-Vis Vest', 'Steel-toe boots', 'Gas detector'],
      personnel: ['Rajesh Kumar'],
      maxPersonnel: 4,
      currentPersonnel: 1,
      gasReadings: [
        { gas: 'O2', value: 20.9, unit: '%', limit: 19.5, status: 'Safe' },
        { gas: 'LEL', value: 0, unit: '%', limit: 10, status: 'Safe' },
        { gas: 'H2S', value: 0.0, unit: 'ppm', limit: 10, status: 'Safe' },
        { gas: 'CO', value: 2.0, unit: 'ppm', limit: 35, status: 'Safe' }
      ]
    };

    setPermitsList(prev => [...prev, newPermit]);
    setSelectedPermitId(newPermit.id);

    // Reset Form
    setPTitle('');
    setPLocation('');
    setIsRequestingPermit(false);
    triggerToast(`PTW permit request ${newNumber} submitted successfully.`);
  };

  const handleApprovePermit = (id: string) => {
    setPermitsList(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'Active' as const } : p))
    );
    const target = permitsList.find(p => p.id === id);
    triggerToast(`Permit ${target?.permitNumber} marked as ACTIVE / AUTHORIZED`);
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

    // Also update current permit status back to active if it was suspended
    if (selectedPermit.status === 'Suspended') {
      setPermitsList(prev =>
        prev.map(p => (p.id === selectedPermitId ? { ...p, status: 'Active' as const } : p))
      );
    }

    triggerToast("Ventilation active: confined space gases normalized and permit re-authorized.");
  };

  // Calculate live counts
  const totalOpen = permitsList.length;
  const activeCount = permitsList.filter(p => p.status === 'Active').length;
  const pendingCount = permitsList.filter(p => p.status === 'PendingHSE').length;
  const suspendedCount = permitsList.filter(p => p.status === 'Suspended').length;

  const columns = [
    { header: 'Permit Number', accessor: 'permitNumber' as const },
    { header: 'Permit Title & Scope', accessor: (row: Permit) => (
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
    { header: 'Requested By', accessor: 'requestedBy' as const },
    { header: 'Status', accessor: (row: Permit) => {
        let badgeClass = 'badge-neutral';
        if (row.status === 'Active') badgeClass = 'badge-success';
        if (row.status === 'PendingHSE') badgeClass = 'badge-warning';
        if (row.status === 'Suspended') badgeClass = 'badge-critical animate-pulse font-bold';
        return <span className={`badge ${badgeClass}`}>{row.status.toUpperCase()}</span>;
      }
    },
    { header: 'Action', accessor: (row: Permit) => (
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedPermitId(row.id)}
            className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
          >
            Review Sensors
          </button>
          {row.status === 'PendingHSE' && (
            <>
              <span className="text-text-muted">|</span>
              <button
                onClick={() => handleApprovePermit(row.id)}
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

      {/* 1. PTW Live Count KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-3 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold text-text-muted uppercase">Total PTW Open</span>
            <div className="text-xl font-black text-text-primary font-mono">{totalOpen}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        <div className="card p-3 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold text-text-muted uppercase">Authorized (Active)</span>
            <div className="text-xl font-black text-success font-mono">{activeCount}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="card p-3 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold text-text-muted uppercase">Pending HSE Review</span>
            <div className="text-xl font-black text-warning font-mono">{pendingCount}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center text-warning">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
        </div>

        <div className="card p-3 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold text-text-muted uppercase">Suspended / Alarm</span>
            <div className={`text-xl font-black font-mono ${suspendedCount > 0 ? 'text-critical animate-pulse' : 'text-text-muted'}`}>{suspendedCount}</div>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${suspendedCount > 0 ? 'bg-critical/20 text-critical' : 'bg-bg-overlay text-text-muted'}`}>
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. Visual PTW Board Grid */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
          ADSB Shipyard Permit-to-Work Active Board (Select card to inspect)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {permitsList.map((permit) => {
            const isSelected = selectedPermitId === permit.id;
            let statusStyle = 'border-border bg-bg-surface';
            let badgeStyle = 'badge-neutral';
            
            if (permit.status === 'Active') {
              statusStyle = isSelected ? 'border-success bg-success-muted/5' : 'border-success/30 hover:border-success/60';
              badgeStyle = 'badge-success';
            } else if (permit.status === 'PendingHSE') {
              statusStyle = isSelected ? 'border-warning bg-warning-muted/5' : 'border-warning/30 hover:border-warning/60';
              badgeStyle = 'badge-warning';
            } else if (permit.status === 'Suspended') {
              statusStyle = 'border-critical bg-critical-muted/5 animate-pulse';
              badgeStyle = 'badge-critical';
            } else if (permit.status === 'Draft') {
              statusStyle = isSelected ? 'border-border bg-bg-surface' : 'border-border/30 hover:border-border/60';
              badgeStyle = 'badge-neutral';
            }

            return (
              <div
                key={permit.id}
                onClick={() => setSelectedPermitId(permit.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between min-h-[110px] ${statusStyle}`}
              >
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-[9px] font-mono font-bold text-text-primary truncate">
                      {permit.permitNumber}
                    </span>
                    <span className={`badge text-[7px] px-1 py-0 ${badgeStyle}`}>
                      {permit.status}
                    </span>
                  </div>
                  <h4 className="text-[10px] font-black text-text-primary mt-1 line-clamp-2 leading-tight">
                    {permit.title}
                  </h4>
                  <p className="text-[8px] text-text-muted mt-0.5 truncate leading-none">
                    {permit.location}
                  </p>
                </div>

                <div className="text-[8px] text-text-secondary mt-2 flex justify-between items-center border-t border-border/40 pt-1.5">
                  <span className="truncate">{permit.requestedBy.split(' ')[0]}</span>
                  {permit.gasReadings && (
                    <span className="text-[7px] text-accent font-bold">GAS TESTED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sensor telemetry & Permit info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Confined Space Gas Readings */}
        <div className="card p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-border/80 pb-2">
            <div>
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider leading-none">
                Confined Space Gas Telemetry
              </h3>
              <span className="text-[8px] font-mono text-text-secondary mt-1 block">
                Source: {selectedPermit.permitNumber}
              </span>
            </div>
            {selectedPermit && selectedPermit.gasReadings && (
              <button
                onClick={handleVentilate}
                className="text-[9px] font-bold text-accent bg-accent-muted px-2 py-0.5 rounded cursor-pointer border border-accent/20"
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
                      <div className={`font-black text-sm ${currentStatus === 'Safe' ? 'text-success' : 'text-critical animate-pulse'}`}>
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
                Select an active permit from the Board to monitor gas readings.
              </div>
            )}
          </div>
        </div>

        {/* Environmental Monitors */}
        <div className="card p-4 space-y-3">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border/80 pb-2">
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
            <div className="flex justify-between items-center mb-1 border-b border-border/80 pb-2">
              <h3 className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Emergency Muster Headcount
              </h3>
              <button
                onClick={() => {
                  setDrillActive(true);
                  triggerToast("Evacuation drill alarm triggered.");
                }}
                className="text-[9px] font-bold text-critical bg-critical/20 px-2 py-0.5 rounded cursor-pointer flex items-center gap-1 border border-critical/30"
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
          <h4 className="text-xs font-bold text-text-primary uppercase border-b border-border/80 pb-2">
            Create Permit-to-Work (PTW) Request
          </h4>
          
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
          Active Permit-to-Work Register List
        </h3>
        
        <DataTable
          columns={columns}
          data={permitsList}
          emptyMessage="No active permits requested."
        />
      </div>
    </div>
  );
}
