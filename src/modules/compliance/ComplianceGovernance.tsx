import React, { useState } from 'react';
import { useYardDataStore } from '../../lib/mock-data/store';
import DataTable from '../../components/ui/DataTable';
import { Shield, ShieldAlert, Check, Play } from 'lucide-react';
import { ComplianceRecord } from '../../types/adsb';

export default function ComplianceGovernance() {
  const { compliance } = useYardDataStore();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSimulateAudit = async () => {
    setIsAuditing(true);
    setAuditResult(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAuditing(false);
    setAuditResult("Audit Score: 98.2% Pass. 1 Minor Observation logged at warehouse scrap grids.");
    triggerToast("ISO 45001 Compliance checklist successfully verified.");
  };

  const columns = [
    { header: 'Standard / Regulations', accessor: 'standard' as const },
    { header: 'Compliance Requirement', accessor: 'requirement' as const },
    { header: 'Status', accessor: (row: ComplianceRecord) => (
        <span className={`badge ${
          row.status === 'Compliant' ? 'badge-success' : 'badge-warning'
        }`}>
          {row.status}
        </span>
      )
    },
    { header: 'Last Audit', accessor: (row: ComplianceRecord) => row.lastAuditDate || 'TBD' },
    { header: 'Open CARs', accessor: (row: ComplianceRecord) => (
        <span className={`font-bold ${row.openCARs > 0 ? 'text-critical' : 'text-text-secondary'}`}>
          {row.openCARs} findings
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

      <div className="border-b border-border/80 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
            COMPLIANCE & GOVERNANCE
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Regulatory audits monitoring (ISO 9001, 14001, 45001), Classification rules, and Corrective Action Requests (CAR).
          </p>
        </div>

        <button
          onClick={handleSimulateAudit}
          disabled={isAuditing}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-bold rounded-lg cursor-pointer transition-all shadow-glow-primary"
        >
          <Play className="w-3.5 h-3.5" /> {isAuditing ? 'Auditing...' : 'Run Audit Check'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-4 space-y-3">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Upcoming Audits Schedule
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-bg-overlay border border-border flex items-center justify-between">
              <div>
                <div className="font-bold text-text-primary">TASNEEF UAE Flag State Audit</div>
                <div className="text-[10px] text-text-muted mt-0.5">Focus: HN-101 OPV Acceptance</div>
              </div>
              <span className="font-mono text-xs">2026-07-15</span>
            </div>
            <div className="p-2.5 rounded bg-bg-overlay border border-border flex items-center justify-between">
              <div>
                <div className="font-bold text-text-primary">Bureau Veritas (BV) Quality Audit</div>
                <div className="text-[10px] text-text-muted mt-0.5">Focus: Block Fabrication standards</div>
              </div>
              <span className="font-mono text-xs">2026-08-02</span>
            </div>
          </div>
        </div>

        {/* Dynamic Audit Results */}
        <div className="card p-4 space-y-3 bg-bg-surface border-l-2 border-l-primary flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Audit Simulation Log
            </h3>
            {auditResult ? (
              <div className="p-2.5 rounded bg-bg-overlay border border-border text-xs text-text-primary font-mono mt-2 leading-relaxed">
                {auditResult}
              </div>
            ) : (
              <p className="text-xs text-text-secondary mt-2">
                Launch the simulation tool by clicking the "Run Audit Check" button above.
              </p>
            )}
          </div>
          
          <div className="p-2.5 rounded bg-primary-muted/10 border border-primary/20 text-[11px] leading-relaxed text-text-secondary mt-2">
            <strong>Standard ISO 45001:2018 requirement:</strong> Complete safety briefing and hazard check sheet prior to hot work or rigging lifts. HSE audit is scheduled weekly.
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-text-muted">
          Operational Standards compliance Registry
        </h3>
        <DataTable
          columns={columns}
          data={compliance}
          emptyMessage="No standard records registered."
        />
      </div>
    </div>
  );
}
