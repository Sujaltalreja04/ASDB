import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, UserCheck, Key, Database, Cpu, Check, AlertTriangle, Terminal, ShieldAlert, Wifi, RefreshCw } from 'lucide-react';

interface AuditConsoleLog {
  timestamp: string;
  category: 'AUDIT' | 'NETWORK' | 'SYSTEM' | 'SECURITY' | 'THREAT';
  level: 'INFO' | 'WARN' | 'CRITICAL' | 'SUCCESS';
  message: string;
}

export default function PlatformFoundation() {
  const [clearanceTier, setClearanceTier] = useState<number>(5);
  const [threatLevel, setThreatLevel] = useState<'NORMAL' | 'ELEVATED' | 'BREACH'>('NORMAL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Toggle switch states
  const [idsActive, setIdsActive] = useState(true);
  const [airGapped, setAirGapped] = useState(true);
  const [dbSync, setDbSync] = useState(true);
  const [ssoActive, setSsoActive] = useState(true);

  // Console logs state
  const [consoleLogs, setConsoleLogs] = useState<AuditConsoleLog[]>([
    { timestamp: '17:48:02', category: 'SYSTEM', level: 'SUCCESS', message: 'ADSB SSO Link established with EDGE Group Central Directory' },
    { timestamp: '17:48:05', category: 'NETWORK', level: 'INFO', message: 'Purdue security model isolation active for Level 2 & 3 networks' },
    { timestamp: '17:48:10', category: 'AUDIT', level: 'INFO', message: 'HSE quality inspection audits encrypted with AES-256' },
    { timestamp: '17:49:00', category: 'SECURITY', level: 'SUCCESS', message: 'User Faisal Al-Zaabi logged out securely from HSE terminal' }
  ]);

  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const addLog = (category: AuditConsoleLog['category'], level: AuditConsoleLog['level'], message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [...prev.slice(-99), { timestamp, category, level, message }]);
  };

  // Scroll to bottom of terminal whenever logs update
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  // Periodic security auditor log loop
  useEffect(() => {
    const normalMsgs = [
      'Heartbeat check on air-gapped firewall: OK',
      'Scanning connected workforce tracking wearables: 0 anomalies',
      'Database replication status: SYNCED. Latency: 0.8ms',
      'Checking NDT thickness scan registry checksum: VALID',
      'Vessel program timeline database query executed by admin',
      'Automatic threat vector scanning: 0 breaches detected',
      'Active directory SSO token refresh successful for all active nodes',
      'Drydock gate pump controller PLC network traffic: STABLE'
    ];

    const elevatedMsgs = [
      'SSO scan detected multiple API calls from shipyard zone B',
      'IDS analyzer flagged minor port scanning on Purdue Level 1',
      'Verifying digital twin replication package integrity...',
      'SSO Active Directory check: Latency increased to 120ms',
      'Warning: Non-critical telemetry pipeline is reporting packet drops',
      'Firewall alert: Blocked suspicious query on port 8080 from zone A'
    ];

    const breachMsgs = [
      'CRITICAL: DDoS incident pattern identified on Hull Quality control PLCs',
      'ALERT: Host intrusion detection system (HIDS) triggered in Command Center',
      'WARNING: Segments isolation threshold crossed. Preparing auto failover',
      'AIR-GAP SECURITY VIOLATION: Remote node attempted handshake on serial connection',
      'IMMEDIATE ACTION REQUIRED: Unauthorized write command blocked on Drydock pump PLC',
      'EMERGENCY: Port scanning surge detected from external subnetwork'
    ];

    const interval = setInterval(() => {
      let randMsg = '';
      let cat: AuditConsoleLog['category'] = 'SYSTEM';
      let lvl: AuditConsoleLog['level'] = 'INFO';

      if (threatLevel === 'NORMAL') {
        randMsg = normalMsgs[Math.floor(Math.random() * normalMsgs.length)];
        cat = Math.random() > 0.5 ? 'SYSTEM' : 'NETWORK';
        lvl = Math.random() > 0.8 ? 'SUCCESS' : 'INFO';
      } else if (threatLevel === 'ELEVATED') {
        randMsg = elevatedMsgs[Math.floor(Math.random() * elevatedMsgs.length)];
        cat = Math.random() > 0.5 ? 'NETWORK' : 'AUDIT';
        lvl = 'WARN';
      } else {
        randMsg = breachMsgs[Math.floor(Math.random() * breachMsgs.length)];
        cat = Math.random() > 0.5 ? 'THREAT' : 'SECURITY';
        lvl = 'CRITICAL';
      }

      addLog(cat, lvl, randMsg);
    }, 3500);

    return () => clearInterval(interval);
  }, [threatLevel]);

  const handleClearanceChange = (tier: number) => {
    setClearanceTier(tier);
    let msg = `RBAC clearance tier shift token updated to Tier ${tier}.`;
    if (tier === 6) {
      msg = `RBAC clearance tier updated to Tier 6. ATTENTION: Classified Combat Systems activated.`;
      addLog('SECURITY', 'WARN', 'OPERATOR SHIFT: Clearance changed to TIER 6 (Classified Combat Systems). Audited.');
    } else if (tier === 5) {
      addLog('SECURITY', 'SUCCESS', 'OPERATOR SHIFT: Clearance changed to TIER 5 (Executive Operations).');
    } else {
      addLog('SECURITY', 'INFO', 'OPERATOR SHIFT: Clearance changed to TIER 3 (Engineer Technical).');
    }
    triggerToast(msg);
  };

  const handleThreatShift = (level: 'NORMAL' | 'ELEVATED' | 'BREACH') => {
    setThreatLevel(level);
    if (level === 'NORMAL') {
      addLog('SECURITY', 'SUCCESS', 'THREAT RESET: Shipyard intelligence platform threat status returned to NORMAL.');
      triggerToast("Threat level set to NORMAL.");
    } else if (level === 'ELEVATED') {
      addLog('THREAT', 'WARN', 'THREAT CONTEXT CHANGE: Threat status elevated to LEVEL 3 (ELEVATED WARNING).');
      triggerToast("Threat level set to ELEVATED.");
    } else {
      addLog('THREAT', 'CRITICAL', 'ALERT: Threat level forced to TIER 1 (SIMULATED MALICIOUS BREACH). Security response team notified.');
      triggerToast("Simulating Security breach!");
    }
  };

  // Toggle click logs
  const handleToggleIds = () => {
    setIdsActive(!idsActive);
    addLog('SECURITY', !idsActive ? 'SUCCESS' : 'WARN', `HIDS Analyzer engine ${!idsActive ? 'ENABLED' : 'DISABLED'}`);
  };

  const handleToggleAirgap = () => {
    setAirGapped(!airGapped);
    addLog('NETWORK', !airGapped ? 'SUCCESS' : 'WARN', `Air-Gapped secure bridging network isolation ${!airGapped ? 'ENABLED' : 'DISABLED'}`);
  };

  const handleToggleDbsync = () => {
    setDbSync(!dbSync);
    addLog('SYSTEM', !dbSync ? 'SUCCESS' : 'WARN', `Real-time database transaction logs sync ${!dbSync ? 'ENABLED' : 'DISABLED'}`);
  };

  const handleToggleSso = () => {
    setSsoActive(!ssoActive);
    addLog('SECURITY', !ssoActive ? 'SUCCESS' : 'WARN', `Active Directory single sign-on verification ${!ssoActive ? 'ENABLED' : 'DISABLED'}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast popup */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-bg-elevated border border-accent p-3.5 rounded-xl shadow-elevated flex items-center gap-3 animate-fade-up">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${threatLevel === 'BREACH' ? 'bg-critical/20 text-critical' : 'bg-accent/20 text-accent'}`}>
            <Check className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-text-primary">{toastMsg}</div>
        </div>
      )}

      {/* Header bar */}
      <div className="border-b border-border/80 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
          PLATFORM FOUNDATION & RBAC SETTINGS
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Identity management (Active Directory SSO), user clearance logs, air-gapped sync, and real-time security audits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Security Controls & Tiers */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* RBAC Tiers Card */}
          <div className="card p-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/80 pb-2">
              <UserCheck className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase text-text-primary tracking-wider">
                RBAC Clearance settings
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-2.5 bg-bg-overlay border border-border rounded-lg items-center">
                <div>
                  <span className="font-semibold text-text-primary block">Tier 6: Combat Systems</span>
                  <span className="text-[9px] text-text-muted">Ammunition & tactical networks</span>
                </div>
                <button
                  onClick={() => handleClearanceChange(6)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                    clearanceTier === 6 ? 'bg-critical text-text-inverse shadow-glow' : 'bg-bg-surface border border-border text-text-secondary hover:bg-bg-muted'
                  }`}
                >
                  {clearanceTier === 6 ? 'Active T6' : 'Select'}
                </button>
              </div>
              
              <div className="flex justify-between p-2.5 bg-bg-overlay border border-border rounded-lg items-center">
                <div>
                  <span className="font-semibold text-text-primary block">Tier 5: Executive Ops View</span>
                  <span className="text-[9px] text-text-muted">Shipyard financials & schedules</span>
                </div>
                <button
                  onClick={() => handleClearanceChange(5)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                    clearanceTier === 5 ? 'bg-primary text-text-inverse shadow-glow' : 'bg-bg-surface border border-border text-text-secondary hover:bg-bg-muted'
                  }`}
                >
                  {clearanceTier === 5 ? 'Active T5' : 'Select'}
                </button>
              </div>

              <div className="flex justify-between p-2.5 bg-bg-overlay border border-border rounded-lg items-center">
                <div>
                  <span className="font-semibold text-text-primary block">Tier 3: Engineer Technical</span>
                  <span className="text-[9px] text-text-muted">Telemetry, IoT & CCTV feeds</span>
                </div>
                <button
                  onClick={() => handleClearanceChange(3)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-all ${
                    clearanceTier === 3 ? 'bg-primary text-text-inverse shadow-glow' : 'bg-bg-surface border border-border text-text-secondary hover:bg-bg-muted'
                  }`}
                >
                  {clearanceTier === 3 ? 'Active T3' : 'Select'}
                </button>
              </div>
            </div>
          </div>

          {/* Simulated Threat Status Card */}
          <div className="card p-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/80 pb-2">
              <ShieldAlert className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-black uppercase text-text-primary tracking-wider">
                Simulated Yard Threat Level
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => handleThreatShift('NORMAL')}
                className={`py-2 px-1 text-center font-bold rounded-lg cursor-pointer transition-all ${
                  threatLevel === 'NORMAL' ? 'bg-success/20 text-success border border-success' : 'bg-bg-overlay border border-border text-text-secondary hover:bg-bg-muted'
                }`}
              >
                NORMAL (T5)
              </button>
              <button
                onClick={() => handleThreatShift('ELEVATED')}
                className={`py-2 px-1 text-center font-bold rounded-lg cursor-pointer transition-all ${
                  threatLevel === 'ELEVATED' ? 'bg-warning/20 text-warning border border-warning' : 'bg-bg-overlay border border-border text-text-secondary hover:bg-bg-muted'
                }`}
              >
                ELEVATED
              </button>
              <button
                onClick={() => handleThreatShift('BREACH')}
                className={`py-2 px-1 text-center font-bold rounded-lg cursor-pointer transition-all ${
                  threatLevel === 'BREACH' ? 'bg-critical/25 text-critical border border-critical animate-pulse font-black' : 'bg-bg-overlay border border-border text-text-secondary hover:bg-bg-muted'
                }`}
              >
                BREACH
              </button>
            </div>
            
            <p className="text-[10px] text-text-muted leading-relaxed">
              *Toggling threat status alters the streaming audit trail log frequency and intensity parameters.
            </p>
          </div>

          {/* Air-Gapped Firewall Status / IoT Security Switchboard */}
          <div className="card p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-border/80 pb-2">
              <Wifi className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase text-text-primary tracking-wider">
                Platform Sync Toggles
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary font-medium">SSO Directory Link</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ssoActive}
                    onChange={handleToggleSso}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-accent peer-checked:after:bg-text-inverse"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-text-secondary font-medium">Real-Time Database Sync</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dbSync}
                    onChange={handleToggleDbsync}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-accent peer-checked:after:bg-text-inverse"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-text-secondary font-medium">Purdue Air-Gapped Wall</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={airGapped}
                    onChange={handleToggleAirgap}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-accent peer-checked:after:bg-text-inverse"></div>
                </label>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-text-secondary font-medium">Intrusion Detection (HIDS)</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={idsActive}
                    onChange={handleToggleIds}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 bg-bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary after:border-border after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-accent peer-checked:after:bg-text-inverse"></div>
                </label>
              </div>
            </div>
          </div>

        </div>

        {/* Real-time terminal style Security Auditor Log Console - Takes 2 Columns */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="card p-4 flex-1 flex flex-col justify-between min-h-[460px]">
            <div className="flex justify-between items-center border-b border-border/80 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-accent animate-pulse" />
                <h3 className="text-xs font-black uppercase text-text-primary tracking-wider">
                  Cyber Security Auditor Live Log Console
                </h3>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-text-secondary font-mono bg-bg-overlay px-2 py-0.5 rounded border border-border">
                <RefreshCw className="w-3 h-3 text-accent animate-spin" />
                <span>STREAMING INTERACTIVE RAW SHELL</span>
              </div>
            </div>

            {/* Terminal Screen */}
            <div className="flex-1 bg-black/85 rounded-lg border border-border/70 p-4 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[380px] shadow-inner text-[#00D4A0]">
              <div className="space-y-1.5">
                <div className="text-text-muted border-b border-border/20 pb-2 mb-2">
                  ADSB NavalOS Security Console v2.84-stable. Connection: Air-Gapped-Link. Encryption: Key-Rotating.
                </div>

                {consoleLogs.map((log, index) => {
                  let badgeColor = 'text-accent';
                  if (log.level === 'WARN') badgeColor = 'text-warning font-bold';
                  if (log.level === 'CRITICAL') badgeColor = 'text-critical font-extrabold animate-pulse';
                  if (log.level === 'SUCCESS') badgeColor = 'text-success font-semibold';

                  return (
                    <div key={index} className="hover:bg-bg-surface/10 rounded px-1 transition-all">
                      <span className="text-text-muted">[{log.timestamp}]</span>{' '}
                      <span className={`px-1 rounded bg-bg-overlay border border-border/20 text-[9px] mr-1`}>{log.category}</span>{' '}
                      <span className={`${badgeColor} mr-1`}>[{log.level}]</span>{' '}
                      <span className="text-text-primary">{log.message}</span>
                    </div>
                  );
                })}
                <div ref={consoleEndRef} />
              </div>
            </div>

            {/* Quick Audit stats footer inside panel */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border/80 text-[10px] font-mono text-text-secondary">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${ssoActive ? 'bg-success' : 'bg-critical'}`} />
                <span>ADSSO: {ssoActive ? 'CONNECTED' : 'DISCONNECTED'}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center">
                <div className={`w-2 h-2 rounded-full ${airGapped ? 'bg-success' : 'bg-warning'}`} />
                <span>AIR-GAP: {airGapped ? 'ACTIVE' : 'BRIDGING'}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <div className={`w-2 h-2 rounded-full ${dbSync ? 'bg-success' : 'bg-critical'}`} />
                <span>DB SYNC: {dbSync ? 'ON-LINE' : 'PAUSED'}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
