import React, { useState } from 'react';
import { useYardDataStore } from '../../lib/mock-data/store';
import DataTable from '../../components/ui/DataTable';
import { Users, Award, ShieldAlert, CheckCircle2, Check } from 'lucide-react';
import { Employee } from '../../types/adsb';

export default function WorkforceIntelligence() {
  const { employees } = useYardDataStore();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  
  // Local state override for qualification renewal demo
  const [renewedCerts, setRenewedCerts] = useState<Record<string, boolean>>({});

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRenewCert = (empId: string) => {
    setRenewedCerts(prev => ({ ...prev, [empId]: true }));
    triggerToast("Welder qualification (WQ-47, SMAW, DH36) renewed for 24 months.");
  };

  const columns = [
    { header: 'Badge ID', accessor: 'badgeId' as const },
    { header: 'Full Name', accessor: 'name' as const },
    { header: 'Designation & Trade', accessor: (row: Employee) => (
        <div>
          <div className="font-bold text-text-primary">{row.role}</div>
          <div className="text-[10px] text-text-muted mt-0.5">{row.department}</div>
        </div>
      )
    },
    { header: 'Type', accessor: 'contractType' as const },
    { header: 'Clearance', accessor: (row: Employee) => `Tier ${row.clearanceTier}` },
    { header: 'Qualification Status', accessor: (row: Employee) => {
        const cert = row.certifications[0];
        if (!cert) return <span className="text-text-muted">None</span>;
        
        const isValid = renewedCerts[row.id] ? true : cert.status === 'Valid';
        return (
          <span className={`badge ${
            isValid ? 'badge-success' : 'badge-critical'
          }`}>
            {cert.code} ({isValid ? 'Valid' : 'Expired'})
          </span>
        );
      }
    },
    { header: 'Action', accessor: (row: Employee) => {
        const cert = row.certifications[0];
        if (!cert || cert.status === 'Valid' || renewedCerts[row.id]) return <span className="text-text-muted">No Action</span>;
        return (
          <button
            onClick={() => handleRenewCert(row.id)}
            className="text-[10px] font-bold text-accent hover:underline cursor-pointer"
          >
            Renew Cert
          </button>
        );
      }
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

      <div className="border-b border-border/80 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
          WORKFORCE & CERTIFICATION INTELLIGENCE
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Attendance tracking, welder ISO qualification registers, shift scheduling, and Emirati technician progress.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Emirati Tech development tracking progress */}
        <div className="card p-4 space-y-4">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Emirati Technician Development Program
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Apprentice Development (40 Technicians)</span>
                <span>64% Complete</span>
              </div>
              <div className="progress-bar mt-1.5"><div className="progress-fill" style={{ width: '64%' }} /></div>
              <span className="text-[10px] text-text-muted mt-1 block">Curriculum target: 1,120 training hours</span>
            </div>

            <div className="p-3 bg-bg-overlay border border-border rounded text-xs leading-relaxed text-text-secondary">
              Currently, 15% of the yard welding team consists of Emirate vocational trainees under mentoring supervision.
            </div>
          </div>
        </div>

        {/* Headcount tracker summary */}
        <div className="card p-4 space-y-3">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Headcount breakdown (Current Shift)
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-bg-overlay border border-border rounded">
              <span className="font-semibold text-text-primary">ADSB Permanent Staff</span>
              <span className="font-bold text-primary">342 Workers</span>
            </div>
            <div className="flex justify-between p-2 bg-bg-overlay border border-border rounded">
              <span className="font-semibold text-text-primary">Contractor Welder Teams</span>
              <span className="font-bold text-primary">280 Workers</span>
            </div>
            <div className="flex justify-between p-2 bg-bg-overlay border border-border rounded">
              <span className="font-semibold text-text-primary">Navy Embedded Officers</span>
              <span className="font-bold text-accent">20 Officers</span>
            </div>
          </div>
        </div>

        {/* Cert critical gap alerts */}
        <div className="card p-4 space-y-3 bg-bg-surface border-l-2 border-l-critical flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-bold text-critical uppercase tracking-wider">
              Certification Expiry Warnings
            </h3>
            <div className="space-y-2 text-xs mt-2">
              <div className="p-2.5 rounded bg-critical-muted/20 border border-critical/30">
                <div className="font-bold text-critical">Weld Qualification WQ-47 Expiring</div>
                <p className="text-[10px] text-text-secondary mt-1">
                  Structural welder Rajesh Kumar's 6G certification expires in 14 days. 3 active joints require renewal.
                </p>
              </div>
            </div>
          </div>
          
          {!renewedCerts['emp004'] && (
            <button
              onClick={() => handleRenewCert('emp004')}
              className="w-full mt-3 py-1.5 bg-critical hover:bg-critical/80 text-text-inverse font-bold text-xs rounded transition-colors cursor-pointer text-center"
            >
              Dispatch Fast-Track Renewal
            </button>
          )}
        </div>

      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-text-muted">
          Active Yard Personnel Register
        </h3>
        <DataTable
          columns={columns}
          data={employees}
          emptyMessage="No personnel records registered."
        />
      </div>
    </div>
  );
}
