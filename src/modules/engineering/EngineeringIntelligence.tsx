import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { FileText, Search, Code, Terminal, BookOpen, Layers, Check, Bot, Send } from 'lucide-react';

const exampleDocs = {
  wps: `// ADSB WELDING PROCEDURE SPECIFICATION (WPS)
// WPS ID: WPS-DH36-SMAW-28
// Standard: Lloyd's Register Naval Vessel Rules Ch 4, Sec 2

SECTION 1: MATERIALS & JOINT DESIGN
- Base Metal: DH36 Grade High-Tensile Structural Steel
- Plate Thickness Range: 10mm to 25mm Butt joints
- Joint Design: Single-V butt weld, 60-degree angle
- Root Opening: 2.0mm - 3.0mm

SECTION 2: WELDING PROCESS & PARAMETERS
- Process: Shielded Metal Arc Welding (SMAW - Manual)
- Welding Position: 6G Inclined Pipe / Flat Plate butt weld
- Filler Metal: E7018 low-hydrogen electrodes (3.2mm / 4.0mm)
- Shielding Gas: N/A (Flux coated electrode)

SECTION 3: ELECTRICAL PARAMETERS
- Current Type: DCEP (Direct Current Electrode Positive)
- Welding Current: 110A - 145A (for 3.2mm electrode)
- Voltage Range: 22V - 26V
- Travel Speed: 12 - 18 cm/min

SECTION 4: PREHEAT & POST-WELD HEAT TREATMENT
- Minimum Preheat Temp: 75°C (continuous monitor)
- Maximum Interpass Temp: 220°C
- Post-Weld Heat Treatment: None required for DH36 < 25mm`,
  mtu: `// ADSB PROPULSION OVERHAUL SPECIFICATIONS
// MTU Series 4000 Engine Mounting Calibration
// Document Reference: MTU-4000-SOP-012

1. PRE-MOUNT COMPARTMENT ALIGNMENT CHECK
- Validate engine bed frame flatness within 0.12mm/m tolerance
- Measure compartment ambient temperature (must be between 15°C and 40°C)
- Inspect rubber mounting dampers for cracks or deflection

2. TORQUE SPECIFICATIONS
- M24 Bed mounting bolts: Torque to 740 Nm (Dampened mounting)
- M16 Coupler bolts: Torque to 220 Nm in star sequence pattern
- Thread locker compound: Loctite 243 blue high-tensile`
};

export default function EngineeringIntelligence() {
  const [selectedDoc, setSelectedDoc] = useState<'wps' | 'mtu'>('wps');
  const [searchVal, setSearchVal] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  
  // Interactive Document assistant
  const [chatInput, setChatInput] = useState('');
  const [chatResponses, setChatResponses] = useState<string[]>([
    "Document analyzed. Query specific section content using text box below."
  ]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDocChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    let reply = '';
    const q = chatInput.toLowerCase();

    if (selectedDoc === 'wps') {
      if (q.includes('preheat')) {
        reply = "Section 4 specifies: 'Minimum Preheat Temp: 75°C (continuous monitor)' and 'Maximum Interpass Temp: 220°C'.";
      } else if (q.includes('current') || q.includes('voltage')) {
        reply = "Section 3 specifies: 'Current Type: DCEP', 'Welding Current: 110A - 145A', and 'Voltage Range: 22V - 26V'.";
      } else {
        reply = "According to WPS-DH36-SMAW-28, this process utilizes E7018 low-hydrogen electrodes for plate thicknesses between 10mm and 25mm.";
      }
    } else {
      if (q.includes('torque') || q.includes('mount')) {
        reply = "Section 2 specifies: 'M24 Bed mounting bolts: Torque to 740 Nm' and 'M16 Coupler bolts: Torque to 220 Nm in star pattern'.";
      } else {
        reply = "MTU Series 4000 mount specification requires bed frame flatness calibration within a 0.12mm/m tolerance limit.";
      }
    }

    setChatResponses(prev => [...prev, `User: ${chatInput}`, `System Analyst: ${reply}`]);
    setChatInput('');
  };

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      {/* Toast popup */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-bg-elevated border border-accent p-3.5 rounded-xl shadow-elevated flex items-center gap-3 animate-fade-up">
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <Check className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-text-primary">{toastMsg}</div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border/80 pb-3 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
            ENGINEERING DOCUMENT INTELLIGENCE
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Semantic design drawing lookup, Lloyd's Register rules engine, and welding specification manager.
          </p>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        
        {/* Left Side: Search & Document Tree */}
        <div className="w-full lg:w-80 bg-bg-surface border border-border rounded-xl p-3 flex flex-col gap-3 shrink-0">
          {/* Document Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search drawings & manuals..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-bg-overlay border border-border rounded-lg text-text-primary placeholder-text-muted pl-9 pr-3 py-2 text-xs focus:outline-none"
            />
          </div>

          {/* Library Tree */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Active SOP Procedures
              </div>
              <div className="mt-1.5 space-y-1">
                <button
                  onClick={() => {
                    setSelectedDoc('wps');
                    triggerToast("Loaded Welding Procedure Specification.");
                  }}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs transition-all cursor-pointer ${
                    selectedDoc === 'wps' ? 'bg-primary-muted/20 text-primary font-bold' : 'text-text-secondary hover:bg-bg-overlay'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="truncate">WPS-DH36 Welds (LR rules)</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedDoc('mtu');
                    triggerToast("Loaded MTU engine mounting calibration specs.");
                  }}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs transition-all cursor-pointer ${
                    selectedDoc === 'mtu' ? 'bg-primary-muted/20 text-primary font-bold' : 'text-text-secondary hover:bg-bg-overlay'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="truncate">MTU Engine Mounting SOP</span>
                </button>
              </div>
            </div>

            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Reference Handbooks (Lloyd's Register)
              </div>
              <div className="mt-1.5 space-y-1 text-text-muted text-[11px] px-2 space-y-1.5">
                <div className="flex items-center gap-1.5 hover:text-text-primary cursor-pointer"><BookOpen className="w-3.5 h-3.5" /> Ch 3: Hull Scantlings</div>
                <div className="flex items-center gap-1.5 hover:text-text-primary cursor-pointer"><BookOpen className="w-3.5 h-3.5" /> Ch 4: Weld Connections</div>
                <div className="flex items-center gap-1.5 hover:text-text-primary cursor-pointer"><BookOpen className="w-3.5 h-3.5" /> Ch 6: Piping & Systems</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Monaco Code Editor Workspace */}
        <div className="flex-1 bg-bg-surface border border-border rounded-xl flex flex-col overflow-hidden relative">
          {/* Editor Header tab bar */}
          <div className="px-4 py-2.5 border-b border-border bg-bg-muted flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Code className="w-4.5 h-4.5 text-primary" />
              <span className="text-xs font-bold text-text-primary font-mono">
                {selectedDoc === 'wps' ? 'WPS-DH36-SMAW-28.json' : 'MTU-4000-SOP-012.txt'}
              </span>
            </div>
            <span className="badge badge-info">Clearance Tier 3 Required</span>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 w-full relative min-h-[220px]">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={exampleDocs[selectedDoc]}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 12,
                fontFamily: "JetBrains Mono, Fira Code, monospace",
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                lineDecorationsWidth: 4,
                padding: { top: 12 }
              }}
            />
          </div>
        </div>

        {/* Localized Document AI Assistant Chat */}
        <div className="w-full lg:w-72 bg-bg-surface border border-border rounded-xl p-3 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-1.5 pb-2 border-b border-border mb-2">
              <Bot className="w-4.5 h-4.5 text-accent" />
              <span className="text-[10px] font-black text-text-primary uppercase tracking-wider">Document AI Copilot</span>
            </div>

            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 text-[11px] leading-relaxed text-text-secondary">
              {chatResponses.map((msg, idx) => (
                <div key={idx} className={`p-2 rounded border ${
                  msg.startsWith('User:') ? 'bg-primary-muted/10 border-primary/20 text-text-primary' : 'bg-bg-overlay border-border'
                }`}>
                  {msg}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleDocChat} className="flex gap-1.5 border-t border-border pt-2 mt-2">
            <input
              type="text"
              placeholder="Ask document questions..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-bg-overlay border border-border rounded text-[10px] px-2 py-1 text-text-primary focus:outline-none"
            />
            <button type="submit" className="p-1 bg-accent text-text-inverse rounded cursor-pointer">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
