import React, { useState } from 'react';
import { Activity, Database, CheckCircle2, AlertTriangle, ArrowRight, Check } from 'lucide-react';

export default function OperationsIntelligence() {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [lloydsStatus, setLloydsStatus] = useState<'Degraded' | 'Online'>('Degraded');
  const [lloydsPing, setLloydsPing] = useState('1.2s');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleReconnect = () => {
    triggerToast("Initiated gateway socket handshake...");
    setTimeout(() => {
      setLloydsStatus('Online');
      setLloydsPing('45ms');
      triggerToast("Lloyds Register API connection restored.");
    }, 1200);
  };

  const integrations = [
    { name: 'SAP ERP (Ariba & Logistics)', desc: 'Material requisitions, Purchase Orders', status: 'Online', delay: '12ms' },
    { name: 'MES Yard Tracking', desc: 'Active weld counts, block shifts', status: 'Online', delay: '42ms' },
    { name: 'SCADA Paint Chamber Controls', desc: 'PC-01 Climate logs, temperature logs', status: 'Online', delay: '85ms' },
    { name: 'EDGE Group Data Lake API', desc: 'KPI uploads and report uploads', status: 'Online', delay: '142ms' }
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

      <div className="border-b border-border/80 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
          OPERATIONS INTELLIGENCE & INTEGRATIONS
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Systems connection status layer (SAP ERP, SCADA sensors, MES, and Classification society surveyor links).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Connection status logs */}
        <div className="lg:col-span-2 card p-4 space-y-4">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Enterprise systems Integration Layer
          </h3>

          <div className="space-y-2">
            {integrations.map((item, idx) => (
              <div key={idx} className="p-3 rounded bg-bg-overlay border border-border flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <span className="font-bold text-text-primary">{item.name}</span>
                    <span className="text-[10px] text-text-muted block mt-0.5">{item.desc}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-mono">
                  <span className="text-text-muted">Ping: {item.delay}</span>
                  <span className="badge badge-success">{item.status}</span>
                </div>
              </div>
            ))}

            {/* Lloyds Register API - Interactive Reconnect */}
            <div className="p-3 rounded bg-bg-overlay border border-border flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="font-bold text-text-primary">Lloyds Register Surveyor API</span>
                  <span className="text-[10px] text-text-muted block mt-0.5">Survey hold point marks</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="text-text-muted">Ping: {lloydsPing}</span>
                <span className={`badge ${lloydsStatus === 'Online' ? 'badge-success' : 'badge-critical'}`}>
                  {lloydsStatus}
                </span>
                {lloydsStatus === 'Degraded' && (
                  <button
                    onClick={handleReconnect}
                    className="px-2 py-0.5 bg-primary text-text-inverse font-sans font-bold text-[10px] rounded cursor-pointer hover:bg-primary-hover"
                  >
                    Reconnect Link
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Operational supply chain KPIs */}
        <div className="card p-4 space-y-4">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Supply Chain & Subcontractor OTD
          </h3>
          
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-bg-overlay border border-border rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-text-primary">CMN Naval (Angola Hulls)</span>
                <span className="text-success font-bold">96% OTD</span>
              </div>
              <div className="text-[10px] text-text-muted">HN-201 structural assembly validation complete.</div>
            </div>
            
            <div className="p-3 bg-bg-overlay border border-border rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-text-primary">Leonardo S.p.A. (Radar LRUs)</span>
                <span className="text-warning font-bold">88% OTD</span>
              </div>
              <div className="text-[10px] text-text-muted">Delay in transmitter parts delivery expected.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
