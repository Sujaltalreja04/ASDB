import React, { useState } from 'react';
import { useYardDataStore } from '../../lib/mock-data/store';
import { Calendar, AlertTriangle, TrendingUp, Check } from 'lucide-react';

export default function AIAnalyticsForecasting() {
  const { vessels } = useYardDataStore();
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const activeHulls = vessels.filter(v => v.completionPercent > 0 && v.completionPercent < 100);

  // Dynamic delivery date forecasting based on overtime hours allocation
  const getAdjustedForecast = (hullNumber: string, originalDateStr: string, currentAdherence: number) => {
    if (hullNumber === 'HN-301') {
      const reduction = Math.min(6, Math.floor(overtimeHours / 10)); // max 6 days reduction
      const newDelta = currentAdherence + reduction;
      
      const baselineDate = new Date(originalDateStr);
      baselineDate.setDate(baselineDate.getDate() + Math.abs(newDelta));
      return {
        date: baselineDate.toISOString().split('T')[0],
        delta: newDelta
      };
    }
    return { date: originalDateStr, delta: currentAdherence };
  };

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
          AI ANALYTICS & PREDICTIVE FORECASTING
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Machine learning delivery predictions, workforce demand curves, and quality failure regressions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ML Delivery Date predictions */}
        <div className="lg:col-span-2 card p-4 space-y-4">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            AI-Estimated Delivery milestones
          </h3>

          <div className="space-y-3">
            {activeHulls.map((hull) => {
              const baseDelta = hull.scheduleAdherenceDays;
              const { date: forecastDate, delta: adjustedDelta } = getAdjustedForecast(hull.hullNumber, hull.forecastDelivery, baseDelta);

              return (
                <div key={hull.id} className="p-3 rounded bg-bg-overlay border border-border flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-text-primary block">{hull.hullNumber} - {hull.name}</span>
                    <span className="text-[10px] text-text-muted mt-0.5">Class: {hull.vesselClass}</span>
                  </div>

                  <div className="flex gap-6 text-[11px] font-mono">
                    <div>
                      <span className="text-text-muted block text-[9px] font-bold font-sans">CONTRACT DATE</span>
                      <span className="text-text-secondary">{hull.targetDelivery}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block text-[9px] font-bold font-sans">AI FORECAST</span>
                      <span className={`font-bold ${adjustedDelta < 0 ? 'text-critical animate-pulse' : 'text-success'}`}>
                        {forecastDate} ({adjustedDelta > 0 ? `+${adjustedDelta}` : adjustedDelta} days)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workforce Scenario Planner */}
        <div className="card p-4 space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Workforce Overtime Scenario Planner
            </h3>

            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-secondary">Overtime Hours Allocation</span>
                  <span className="text-text-primary">{overtimeHours} hrs/week</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={10}
                  value={overtimeHours}
                  onChange={(e) => {
                    setOvertimeHours(Number(e.target.value));
                    triggerToast(`Recalculating ML delivery date forecasting.`);
                  }}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              <div className="p-2.5 rounded bg-bg-overlay border border-border text-xs text-text-secondary">
                Forecasted delay reduction:{' '}
                <strong className="text-text-primary">{Math.min(6, Math.floor(overtimeHours / 10))} Days saved</strong>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-primary-muted/12 border border-primary/20 text-[10px] text-text-secondary leading-relaxed">
            Increasing scheduled overtime shifts adjusts structural welding speed velocity constraints in AI models.
          </div>
        </div>

      </div>
    </div>
  );
}
