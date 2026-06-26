import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { useYardDataStore } from '../../lib/mock-data/store';
import { Search, Ship, Wrench, Shield, FileText, X } from 'lucide-react';

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setActiveModule } = useAppStore();
  const { vessels, assets, permits, ncrs } = useYardDataStore();
  const [query, setQuery] = useState('');

  // Handle hotkey (CMD+K or CTRL+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  // Filter items based on query
  const searchVessels = vessels.filter(
    (v) =>
      v.name.toLowerCase().includes(query.toLowerCase()) ||
      v.hullNumber.toLowerCase().includes(query.toLowerCase()) ||
      v.vesselClass.toLowerCase().includes(query.toLowerCase())
  );

  const searchAssets = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.assetId.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  const searchPermits = permits.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.permitNumber.toLowerCase().includes(query.toLowerCase()) ||
      p.type.toLowerCase().includes(query.toLowerCase())
  );

  const searchNCRs = ncrs.filter(
    (n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.ncrNumber.toLowerCase().includes(query.toLowerCase()) ||
      n.defectType.toLowerCase().includes(query.toLowerCase())
  );

  const hasResults =
    searchVessels.length > 0 ||
    searchAssets.length > 0 ||
    searchPermits.length > 0 ||
    searchNCRs.length > 0;

  const navigateTo = (moduleId: string) => {
    setActiveModule(moduleId);
    setCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Dialog Box */}
      <div className="relative w-full max-w-2xl rounded-xl bg-bg-elevated border border-border shadow-elevated overflow-hidden z-50 flex flex-col max-h-[500px]">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Search vessels, hull numbers, assets, permits, NCRs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-text-primary placeholder-text-muted focus:outline-none text-sm"
            autoFocus
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 rounded hover:bg-bg-overlay text-text-muted hover:text-text-primary cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {!hasResults ? (
            <div className="p-8 text-center text-text-muted text-xs">
              No matching records found. Try searching for "HN-301", "Gantry", "welding", or "NCR".
            </div>
          ) : (
            <>
              {/* Vessels */}
              {searchVessels.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    Vessels & Programmes
                  </div>
                  <div className="grid gap-0.5 mt-1">
                    {searchVessels.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => navigateTo('programme-command')}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-bg-overlay text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Ship className="w-4 h-4 text-primary group-hover:text-accent flex-shrink-0" />
                          <span className="text-xs font-semibold text-text-primary truncate">
                            {v.hullNumber} - {v.name}
                          </span>
                        </div>
                        <span className="badge badge-info shrink-0">{v.vesselClass}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Assets */}
              {searchAssets.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    Shipyard Equipment & Assets
                  </div>
                  <div className="grid gap-0.5 mt-1">
                    {searchAssets.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => navigateTo('asset-maintenance')}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-bg-overlay text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Wrench className="w-4 h-4 text-primary group-hover:text-accent flex-shrink-0" />
                          <span className="text-xs font-semibold text-text-primary truncate">
                            {a.assetId} - {a.name}
                          </span>
                        </div>
                        <span className={`badge shrink-0 ${
                          a.status === 'Operational' ? 'badge-success' : 'badge-critical'
                        }`}>
                          {a.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Permits */}
              {searchPermits.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    Permits-to-Work (PTW)
                  </div>
                  <div className="grid gap-0.5 mt-1">
                    {searchPermits.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => navigateTo('safety')}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-bg-overlay text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Shield className="w-4 h-4 text-primary group-hover:text-accent flex-shrink-0" />
                          <span className="text-xs font-semibold text-text-primary truncate">
                            {p.permitNumber} - {p.title}
                          </span>
                        </div>
                        <span className="badge badge-neutral shrink-0">{p.status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* NCRs */}
              {searchNCRs.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    Non-Conformance Reports (NCR)
                  </div>
                  <div className="grid gap-0.5 mt-1">
                    {searchNCRs.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => navigateTo('hull-quality')}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-bg-overlay text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 text-primary group-hover:text-accent flex-shrink-0" />
                          <span className="text-xs font-semibold text-text-primary truncate">
                            {n.ncrNumber} - {n.title}
                          </span>
                        </div>
                        <span className={`badge shrink-0 ${
                          n.severity === 'Critical' ? 'badge-critical' : 'badge-warning'
                        }`}>
                          {n.severity}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-bg-muted border-t border-border flex items-center justify-between text-[11px] text-text-muted">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-bg-overlay border border-border">Esc</kbd> to close
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-bg-overlay border border-border">↵</kbd> to select
            </span>
          </div>
          <div>ADSB NavalOS Command Palette</div>
        </div>
      </div>
    </div>
  );
}
