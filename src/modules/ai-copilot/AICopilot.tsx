import React, { useState, useRef, useEffect } from 'react';
import { useYardDataStore } from '../../lib/mock-data/store';
import { Bot, User, Send, ShieldAlert, Sparkles, ChevronRight, Mic, Check } from 'lucide-react';
import { ChatMessage, CopilotMode } from '../../types/adsb';

const copilotModes = [
  { id: 'naval-engineering', label: 'Engineering Assistant', desc: 'Queries on vessel design, MTU engine systems, steel grades' },
  { id: 'maintenance', label: 'Maintenance Copilot', desc: 'Equipment remaining useful life, spare parts tracking, anomalies' },
  { id: 'safety', label: 'Safety & PTW Analyst', desc: 'Permit-to-work requirements, PPE regulations, confined spaces' },
  { id: 'programme', label: 'Programme Coordinator', desc: 'Vessel milestones, HN progress, schedule risks' },
  { id: 'executive', label: 'Executive Briefing Generator', desc: 'Weekly reports, cost performance indexes, cross-program metrics' },
  { id: 'document-intelligence', label: 'Document Analyzer', desc: 'Semantic search on technical manuals, Lloyds Register rules' }
];

const suggestQueries: Record<string, string[]> = {
  'naval-engineering': [
    'What is the status of HN-301?',
    'What grade steel is used for HN-301 keel?',
    'Explain steel nesting yield'
  ],
  'maintenance': [
    'Query gantry crane GC-02 health status',
    'What is the failure downtime of sandblast SBS-02?'
  ],
  'safety': [
    'Are there any open safety breaches?',
    'Show active Permit-to-Work (PTW) count'
  ],
  'programme': [
    'Show active vessels in shipyard',
    'Show milestone delays due to blasting bottleneck'
  ]
};

// Hardcoded ADSB pre-canned answers for the demo
const adsbPreCannedAnswers: Record<string, string> = {
  'what is the status of hn-301?': `### 🚢 Vessel Status Profile: HN-301 (Al Noukhitha)
*   **Programme**: UAE Navy Falaj 3 (Lead Vessel)
*   **Construction Phase**: Steel Fabrication / Block Assembly
*   **Completion Rate**: 34.2%
*   **Last Inspection**: NDT UT check on June 24, 2026 (Weld Joint: \`WJ-HN301-FR42-STBD\`)
*   **Open NCRs**: 2 active (1 Major weld porosity, 1 Minor paint DFT deviation)
*   **Schedule Status**: Lagging by 6 days (SPI: 0.94) due to sandblast unit SBS-02 downtime.
*   **Next Milestones**: Double-bottom block erection (scheduled for July 12, 2026).`,

  'show active vessels': `### 📋 Active Shipyard Construction Log (ADSB Mussafah)
1.  **HN-301 (Al Noukhitha)**: 62m Missile Boat | Status: **Active** | Completion: **34.2%** | Phase: Steel Fabrication
2.  **HN-302 (Jalboot)**: 62m Missile Boat | Status: **Active** | Completion: **12.5%** | Phase: Keel Layout
3.  **HN-201 (Al Hili)**: Falaj 3 OPV | Status: **Active** | Completion: **78.4%** | Phase: Outfitting / Commissioning
4.  **HN-202 (Murban)**: Falaj 3 OPV | Status: **Active** | Completion: **61.1%** | Phase: Superstructure Fit`,

  'show active vessels in shipyard': `### 📋 Active Shipyard Construction Log (ADSB Mussafah)
1.  **HN-301 (Al Noukhitha)**: 62m Missile Boat | Status: **Active** | Completion: **34.2%** | Phase: Steel Fabrication
2.  **HN-302 (Jalboot)**: 62m Missile Boat | Status: **Active** | Completion: **12.5%** | Phase: Keel Layout
3.  **HN-201 (Al Hili)**: Falaj 3 OPV | Status: **Active** | Completion: **78.4%** | Phase: Outfitting / Commissioning
4.  **HN-202 (Murban)**: Falaj 3 OPV | Status: **Active** | Completion: **61.1%** | Phase: Superstructure Fit`,

  'are there any open safety breaches?': `### ⚠️ HSE Safety Breach Incident Alert
*   **Status**: **ACTIVE CRITICAL ALERT**
*   **Zone**: Build Bay 1 (Drydock Quayside)
*   **Details**: CCTV Cam-03 flagged a **PPE Hard Hat Violation** at 16:42:15.
*   **Incident**: Welder (Rajesh Kumar) detected working near Crane GC-02 track boundary without safety helmet.
*   **Action Taken**: Muster alarm flashed in Zone B, area supervisor paged, incident logged to EDGE Group safety database.`,

  'list current ndt weld defects (joint ids)': `### 🔍 Hull QA/QC Weld Defect Register
*   **WJ-HN301-FR42-STBD**: Porosity Cluster in Bulkhead Seam | Severity: **Major** | Hold: Bureau Veritas (BV)
*   **WJ-HN301-FR56-PORT**: Lack of Fusion in Main Deck plate | Severity: **Minor** | Hold: None (Local Rework)
*   **WJ-HN301-FR12-KEEL**: Slag Inclusion in Bottom Keel Plate | Severity: **Critical** | Hold: Lloyd's Register (LR)
*   **WJ-HN302-FR05-KEEL**: Porosity in keel backing bar | Severity: **Minor** | Hold: None`,

  'show active permit-to-work (ptw) count': `### 📋 Active Permit-to-Work (PTW) Status
Total Open Permits: **6 Active**
*   **Hot Work**: 3 active (\`PTW-HN301-HW-142\` in Keel, \`PTW-HN301-HW-155\` in Superstructure, \`PTW-HN302-HW-05\` in Keel)
*   **Confined Space**: 2 active (\`PTW-HN301-CS-089\` in Fuel Tank, \`PTW-HN301-CS-112\` in Ballast Tank)
*   **Working at Heights**: 1 active (\`PTW-HN302-WAH-214\` on Mast Antenna)`,

  'explain steel nesting yield': `### 📐 TII Nesting Optimizer Telemetry
*   **Nesting Density Yield**: 96.0% (Previous baseline: 82%)
*   **Scrap Metal Yield**: Reduced to 4.0% (approx. 2.4 tonnes of plate scrap)
*   **Estimated Cost Reduction**: **$29,600 USD** saved on plasma cutting layouts for HN-301 deck brackets.
*   **Optimizing Engine**: TII Nesting V4.2`,

  'query gantry crane gc-02 health status': `### ⚙️ Machine Telemetry: Gantry Crane GC-02
*   **Health Score**: 84% (Warning threshold)
*   **Critical Sensor**: Brake system temperature is elevated at **89.5°C** (Alarm: 95°C).
*   **Remaining Useful Life (RUL)**: 82 days.
*   **Action**: Work Order \`#WO-40291\` dispatched to Maintenance Crew for pad calibration.`
};

export default function AICopilot() {
  const [activeMode, setActiveMode] = useState<CopilotMode>('naval-engineering');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: "Awaiting instruction, Commander Saeed. I am ADSB NavalOS Copilot, configured with clearance tier 5. Select a sub-specialization on the left or query shipyard operational data in natural language.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
      mode: activeMode
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const queryLower = textToSend.toLowerCase().trim();

    // 1. Check if we have a pre-canned ADSB answer for the demo
    if (adsbPreCannedAnswers[queryLower]) {
      await new Promise((resolve) => setTimeout(resolve, 800)); // simulated thinking delay
      const assistantMsg: ChatMessage = {
        id: `msg_assistant_${Date.now()}`,
        role: 'assistant',
        content: adsbPreCannedAnswers[queryLower],
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
      return;
    }

    // 2. Otherwise execute Groq LLM API call
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    const model = import.meta.env.VITE_GROQ_MODEL || 'openai/gpt-oss-120b';

    if (apiKey) {
      try {
        // Attempt Groq completion fetch
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: `You are ADSB NavalOS Copilot, an AI naval operating system assistant built for Abu Dhabi Ship Building (ADSB).
                The user has clearance tier 5 (Executive). Mode active: ${activeMode}. 
                Respond concisely using shipyard terminology like HN-301, hull numbers, Lloyd's Register rules, MTU engines, weld joint IDs, etc.
                Ensure you are friendly, brief, and structure your responses with markdown bullet points where appropriate.`
              },
              ...messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
              { role: 'user', content: textToSend }
            ],
            temperature: 0.7,
            max_tokens: 1024
          })
        });

        if (!res.ok) {
          // If the custom model fails or is rate-limited, fallback to standard Llama model on Groq
          throw new Error('Groq custom model failed');
        }

        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `msg_assistant_${Date.now()}`,
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        // Fallback retry using standard groq model llama3-8b-8192
        try {
          const fallbackRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'llama3-8b-8192',
              messages: [
                {
                  role: 'system',
                  content: `You are ADSB NavalOS Copilot, an AI naval operating system assistant built for Abu Dhabi Ship Building (ADSB). Mode: ${activeMode}. Respond using shipyard terms.`
                },
                { role: 'user', content: textToSend }
              ]
            })
          });
          const fallbackData = await fallbackRes.json();
          const assistantMsg: ChatMessage = {
            id: `msg_assistant_${Date.now()}`,
            role: 'assistant',
            content: fallbackData.choices[0].message.content,
            timestamp: new Date().toISOString()
          };
          setMessages((prev) => [...prev, assistantMsg]);
        } catch (innerErr) {
          const errMsg: ChatMessage = {
            id: `msg_err_${Date.now()}`,
            role: 'assistant',
            content: "Operational Telemetry Error: Failed to generate response from Groq. Pre-canned prompts work immediately.",
            timestamp: new Date().toISOString()
          };
          setMessages((prev) => [...prev, errMsg]);
        }
      }
    } else {
      // Offline fallback
      await new Promise((resolve) => setTimeout(resolve, 800));
      const assistantMsg: ChatMessage = {
        id: `msg_assistant_${Date.now()}`,
        role: 'assistant',
        content: `I received: "${textToSend}". To see custom responses, select one of the pre-canned suggest queries at the bottom, or verify your .env VITE_GROQ_API_KEY credentials.`,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }

    setLoading(false);
  };

  const handleSuggestClick = (queryText: string) => {
    handleSendMessage(queryText);
  };

  const handleExportChat = () => {
    setToastMsg("Chat transcript exported to engineering repository.");
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col md:flex-row gap-4">
      {/* Toast popup */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-bg-elevated border border-accent p-3.5 rounded-xl shadow-elevated flex items-center gap-3 animate-fade-up">
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <Check className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-text-primary">{toastMsg}</div>
        </div>
      )}

      {/* Sidebar Mode Selector */}
      <div className="md:w-72 bg-bg-surface border border-border rounded-xl p-3 space-y-2 flex flex-col justify-between shrink-0">
        <div>
          <div className="px-2 py-1.5 flex items-center gap-2 mb-2 border-b border-border">
            <Sparkles className="w-4.5 h-4.5 text-accent" />
            <span className="text-xs font-black text-text-primary uppercase tracking-wider">
              Copilot Intel Analyst
            </span>
          </div>

          <div className="space-y-1">
            {copilotModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode.id as CopilotMode);
                  setMessages([
                    {
                      id: `msg_welcome_${mode.id}`,
                      role: 'assistant',
                      content: `I am now configured in ${mode.label} mode. How may I assist you with specialized ADSB shipyard data?`,
                      timestamp: new Date().toISOString()
                    }
                  ]);
                }}
                className={`w-full text-left p-2 rounded-lg transition-all text-xs group cursor-pointer ${
                  activeMode === mode.id
                    ? 'bg-primary-muted/25 border-l-2 border-primary text-primary font-semibold'
                    : 'text-text-secondary hover:bg-bg-overlay hover:text-text-primary'
                }`}
              >
                <div>{mode.label}</div>
                <div className="text-[10px] text-text-muted mt-0.5 font-normal line-clamp-1">
                  {mode.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Informational Panel */}
        <div className="space-y-2.5">
          <button
            onClick={handleExportChat}
            className="w-full py-1.5 bg-bg-overlay border border-border rounded text-[10px] font-bold text-text-secondary hover:text-text-primary cursor-pointer text-center"
          >
            Export Chat Log
          </button>
          
          <div className="p-2.5 rounded bg-bg-overlay border border-border text-[10px] text-text-muted leading-relaxed">
            <div className="font-bold text-text-secondary flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-warning" />
              Clearance Tier 5 Mode
            </div>
            Groq SDK API client initialized with model: VITE_GROQ_MODEL. Context windows trace Lloyds Rules and MTU engine schematics.
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-bg-surface border border-border rounded-xl overflow-hidden min-w-0">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-border bg-bg-muted flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <div>
              <span className="text-xs font-bold text-text-primary">
                NavalOS AI Copilot Engine
              </span>
              <span className="text-[9px] text-accent font-bold uppercase tracking-wider block leading-none">
                Active Mode: {copilotModes.find(m => m.id === activeMode)?.label}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-text-muted">v2.1.2-secure</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  isAI ? 'bg-accent/10 border-accent/25 text-accent' : 'bg-primary/10 border-primary/25 text-primary'
                }`}>
                  {isAI ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                </div>

                {/* Bubble */}
                <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  isAI
                    ? 'bg-bg-elevated border-border text-text-primary'
                    : 'bg-primary-muted/15 border-primary/30 text-text-primary'
                }`}>
                  <div className="whitespace-pre-line font-medium prose prose-invert">{msg.content}</div>
                  <span className="text-[9px] text-text-muted block text-right mt-1.5 select-none">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Skeletons while typing */}
          {loading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/25 text-accent flex items-center justify-center animate-pulse">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="flex gap-1.5 p-3.5 rounded-xl bg-bg-elevated border border-border">
                <span className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-accent animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-accent animate-bounce delay-200" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {suggestQueries[activeMode] && suggestQueries[activeMode].length > 0 && (
          <div className="px-3 py-2 bg-bg-muted border-t border-border flex flex-wrap gap-1.5 shrink-0 select-none">
            {suggestQueries[activeMode].map((qText, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestClick(qText)}
                className="text-[10px] px-2.5 py-1 rounded bg-bg-surface hover:bg-bg-overlay border border-border hover:border-primary/45 text-text-secondary hover:text-text-primary cursor-pointer transition-all truncate max-w-[280px]"
              >
                {qText}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
            setInput('');
          }}
          className="p-3 border-t border-border bg-bg-muted flex gap-2 shrink-0"
        >
          <button
            type="button"
            className="p-2 rounded-lg bg-bg-overlay hover:bg-bg-elevated text-text-muted hover:text-text-primary border border-border cursor-pointer transition-colors"
            title="Voice-to-text input (Yard operations)"
          >
            <Mic className="w-4.5 h-4.5" />
          </button>
          
          <input
            type="text"
            placeholder={`Query AI on ${copilotModes.find(m => m.id === activeMode)?.label.toLowerCase()}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary px-3 text-xs"
          />

          <button
            type="submit"
            disabled={loading}
            className="p-2 rounded-lg bg-primary hover:bg-primary-hover text-text-inverse shadow-glow-primary transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
