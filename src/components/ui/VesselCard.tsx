import React from 'react';
import { Vessel } from '../../types/adsb';
import { Shield, ShieldAlert, Award, FileWarning, Calendar, DollarSign } from 'lucide-react';

interface VesselCardProps {
  vessel: Vessel;
  onClick?: () => void;
}

export default function VesselCard({ vessel, onClick }: VesselCardProps) {
  const isLagging = vessel.spi < 1.0;
  const isOverCost = vessel.cpi < 1.0;

  // Color code based on program
  const getProgBadgeClass = () => {
    switch (vessel.programme) {
      case 'Kuwait': return 'badge-kuwait';
      case 'Angola': return 'badge-angola';
      case 'UAE': return 'badge-uae';
      case 'Commercial': return 'badge-commercial';
      default: return 'badge-edge';
    }
  };

  const getPhaseColor = () => {
    switch (vessel.currentPhase) {
      case 'Contract':
      case 'Design':
        return 'text-text-muted bg-bg-overlay border-border';
      case 'SteelCutting':
      case 'SteelFabrication':
      case 'BlockAssembly':
      case 'ModuleAssembly':
      case 'Erection':
        return 'text-primary bg-primary-muted/12 border-primary/25';
      case 'Launch':
      case 'Outfitting':
        return 'text-warning bg-warning-muted/12 border-warning/25';
      case 'SeaTrials':
        return 'text-accent bg-accent-muted/12 border-accent/25';
      case 'Delivery':
        return 'text-success bg-success-muted/12 border-accent/25';
    }
  };

  return (
    <div
      onClick={onClick}
      className="card p-4 hover:border-primary/40 hover:shadow-glow-primary transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[220px]"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-text-primary tracking-tight">
                {vessel.hullNumber}
              </span>
              <span className="text-xs text-text-secondary font-semibold">
                {vessel.name}
              </span>
            </div>
            <div className="text-[10px] text-text-muted font-bold tracking-wider mt-0.5">
              CLASS: {vessel.vesselClass}
            </div>
          </div>
          <span className={`badge ${getProgBadgeClass()}`}>
            {vessel.programme}
          </span>
        </div>

        {/* Phase Timeline Segment */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-[10px] mb-1.5 font-bold">
            <span className="text-text-muted">BUILD PHASE</span>
            <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase ${getPhaseColor()}`}>
              {vessel.currentPhase.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${vessel.completionPercent}%` }}
              />
            </div>
            <span className="text-xs font-extrabold text-text-primary w-8 text-right">
              {vessel.completionPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Detail Metrics */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 pt-3.5 border-t border-border/60">
        <div className="flex items-center gap-2 min-w-0">
          <Calendar className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <div className="min-w-0">
            <div className="text-[9px] font-bold text-text-muted leading-none">SPI (SCHEDULE)</div>
            <div className={`text-xs font-black mt-0.5 ${isLagging ? 'text-critical' : 'text-success'}`}>
              {vessel.spi.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <DollarSign className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <div className="min-w-0">
            <div className="text-[9px] font-bold text-text-muted leading-none">CPI (COST)</div>
            <div className={`text-xs font-black mt-0.5 ${isOverCost ? 'text-critical' : 'text-success'}`}>
              {vessel.cpi.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <FileWarning className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <div className="min-w-0">
            <div className="text-[9px] font-bold text-text-muted leading-none">OPEN NCRs</div>
            <div className={`text-xs font-black mt-0.5 ${vessel.ncrsOpen > 0 ? 'text-critical animate-pulse' : 'text-text-secondary'}`}>
              {vessel.ncrsOpen}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <Award className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <div className="min-w-0">
            <div className="text-[9px] font-bold text-text-muted leading-none">QUALITY SCORE</div>
            <div className="text-xs font-black text-text-primary mt-0.5">
              {vessel.qualityScore}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
