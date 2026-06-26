import React from 'react';
import { useAppStore } from '../../store/appStore';
import { useYardDataStore } from '../../lib/mock-data/store';
import { Bell, Check, AlertTriangle, Info, ShieldAlert, X } from 'lucide-react';

export default function NotificationsPanel() {
  const { notificationsOpen, setNotificationsOpen } = useAppStore();
  const { alerts, acknowledgeAlert } = useYardDataStore();

  if (!notificationsOpen) return null;

  const unreadAlerts = alerts.filter((a) => !a.isAcknowledged);
  const readAlerts = alerts.filter((a) => a.isAcknowledged);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => setNotificationsOpen(false)}
      />

      {/* Slide-out Panel */}
      <div className="absolute right-4 top-16 w-[380px] max-w-[calc(100vw-32px)] rounded-xl bg-bg-elevated border border-border shadow-elevated z-50 overflow-hidden flex flex-col max-h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-text-primary">Operational Alerts</span>
            {unreadAlerts.length > 0 && (
              <span className="badge badge-critical font-bold text-[10px]">
                {unreadAlerts.length} New
              </span>
            )}
          </div>
          <button
            onClick={() => setNotificationsOpen(false)}
            className="p-1 rounded hover:bg-bg-overlay text-text-muted hover:text-text-primary cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {alerts.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-xs">
              No alerts active in the yard.
            </div>
          ) : (
            alerts.map((alert) => {
              const isCrit = alert.severity === 'critical';
              const isWarn = alert.severity === 'warning';
              
              return (
                <div
                  key={alert.id}
                  className={`p-3.5 transition-colors relative group ${
                    alert.isAcknowledged ? 'opacity-65' : 'bg-primary-muted/5'
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    {/* Status Badge */}
                    <div className="mt-0.5 flex-shrink-0">
                      {isCrit ? (
                        <ShieldAlert className="w-4.5 h-4.5 text-critical animate-pulse" />
                      ) : isWarn ? (
                        <AlertTriangle className="w-4.5 h-4.5 text-warning" />
                      ) : (
                        <Info className="w-4.5 h-4.5 text-primary" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-text-primary truncate">
                          {alert.title}
                        </span>
                        <span className="text-[10px] text-text-muted whitespace-nowrap">
                          {new Date(alert.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1 leading-normal line-clamp-3">
                        {alert.description}
                      </p>
                      
                      {alert.zone && (
                        <div className="mt-1.5 flex items-center gap-1">
                          <span className="text-[10px] bg-bg-overlay border border-border px-1.5 py-0.5 rounded text-text-muted">
                            Zone: {alert.zone}
                          </span>
                          {alert.hullNumber && (
                            <span className="text-[10px] bg-bg-overlay border border-border px-1.5 py-0.5 rounded text-primary font-semibold">
                              {alert.hullNumber}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Button */}
                      {!alert.isAcknowledged && (
                        <div className="mt-2.5 flex justify-end">
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="flex items-center gap-1 text-[11px] font-bold text-accent hover:text-accent-hover bg-accent-muted px-2 py-1 rounded transition-colors cursor-pointer"
                          >
                            <Check className="w-3 h-3" /> Acknowledge
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-bg-muted border-t border-border flex items-center justify-center text-[10px] text-text-muted">
          Defense-grade shipyard safety control system
        </div>
      </div>
    </>
  );
}
