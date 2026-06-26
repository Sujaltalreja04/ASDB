import React, { useState, useRef, useEffect } from 'react';
import { useYardDataStore } from '../../lib/mock-data/store';
import { Bot, User, Send, ShieldAlert, Sparkles, FileText, ChevronRight, Mic, Check } from 'lucide-react';
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
    'What grade steel is used for HN-301 keel?',
    'What waterjet systems are fitted with MTU engines?',
  ],
  'maintenance': [
    'Query gantry crane GC-02 health status',
    'What is the failure downtime of sandblast SBS-02?',
  ],
  'safety': [
    'Inspect active hot work permits in engine room',
    'List hazards for confined space double bottom tank',
  ],
  'programme': [
    'Generate weekly progress report for HN-301',
    'Show milestone delays due to blasting bottleneck',
  ]
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

    const apiKey = import.meta.env.VITE_GROK_API_KEY;

    try {
      if (apiKey) {
        // Real Live xAI Grok call!
        const res = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'grok-beta',
            messages: [
              {
                role: 'system',
                content: `You are ADSB NavalOS Copilot, an AI naval operating system assistant built for Abu Dhabi Ship Building (ADSB). 
                The user has clearance tier 5 (Executive). Mode active: ${activeMode}. 
                Respond concisely using shipyard terminology like HN-301, hull numbers, Lloyd's Register rules, MTU engines, etc.`
              },
              ...messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
              { role: 'user', content: textToSend }
            ],
            temperature: 0.2
          })
        });

        if (!res.ok) throw new Error('Failed to reach Grok API');
        const data = await res.json();
        
        const assistantMsg: ChatMessage = {
          id: `msg_assistant_${Date.now()}`,
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        // Fallback Intelligent ADSB-specific Mock Assistant Response
        await new Promise((resolve) => setTimeout(resolve, 800));
        let responseText = '';

        const query = textToSend.toLowerCase();

        if (query.includes('weekly progress report') || query.includes('generate weekly')) {
          responseText = `### WEEKLY SHIPYARD OPERATIONS REPORT: HN-301 AL NOUKHITHA
Date: ${new Date().toLocaleDateString()}
Compiled By: ADSB Operations Intelligence Copilot

1. STATUS OVERVIEW
- Completion Rate: 34% (Steel Fabrication phase)
- SPI: 0.94 (Lagging by 6 days due to SBS-02 sandblast compressor downtime)
- CPI: 0.97 (Cost parameters holding within contingency threshold)

2. COMPLETED MILESTONES
- Design Freeze [Completed: 2025-06-12]
- Steel Cutting [Completed: 2025-09-28]

3. CRITICAL ACTIONS (NEXT 14 DAYS)
- Rectify compressor pump at SBS-02 to restart block surface blasting.
- Renew welder certification WQ-47 (Rajesh Kumar, SMAW 6G) prior to double-bottom assembly welds.

*Report compiled under executive clearance tier 5 constraints.*`;
        } else if (activeMode === 'naval-engineering') {
          if (query.includes('engine') || query.includes('propulsion')) {
            responseText = "**MTU 16V 4000 M93L** engine sets are integrated with **Kongsberg Kamewa S63-4** waterjets. Rated power output is 4,300 HP per engine at 2,100 RPM. Typical outfitting schedule assigns block mount positioning 14 days before superstructure erection.";
          } else if (query.includes('steel') || query.includes('grade') || query.includes('keel')) {
            responseText = "ADSB Hull fabrication utilizes high-tensile structural steel: **DH36** (high-strength, qualified for low temperatures) for bottom structures and **AH36** for deck bulkheads. Weld certification requires ISO 9606-1 standard validation.";
          } else {
            responseText = "Naval Engineering Database query complete. Reference design file [GA-HN301-REV3.dwg] shows the structural frame layout of the Al-Dorra missile boat class. Is there a specific component specification you need?";
          }
        } else if (activeMode === 'maintenance') {
          if (query.includes('crane') || query.includes('gc02')) {
            responseText = "Gantry Crane **GC-02** shows an elevated brake temperature sensor reading of **89.5°C** (Warning threshold: 95°C). RUL is estimated at 82 days. Work Order #WO-40291 was scheduled for visual calibration.";
          } else if (query.includes('sbs02') || query.includes('blasting')) {
            responseText = "Sandblasting unit **SBS-02** is currently flagged as **FAULT** due to air intake pressure dropping below 3.5 Bar. Active downtime is **74 hours**, causing 6 days block assembly lag for HN-301. Priority Work Order generated.";
          } else {
            responseText = "Asset health parameters normal across panel lines. Standard preventive cycle for plasma cutters (PCT-01/02) requires nozzle inspection every 40 arc-hours.";
          }
        } else if (activeMode === 'safety') {
          if (query.includes('permit') || query.includes('hot') || query.includes('engine')) {
            responseText = "Active hot work permits in **Zone B3 (HN-301 Engine Room)** stands at **4**. Confined space entry checks require continuous O2 monitor checks (current telemetry: 20.9% - Safe). Minimum Safety Watch is 1 Safety Officer per 3 active welders.";
          } else {
            responseText = "Permit-to-work guidelines for ADSB shipyard require: Gas testing every 4 hours for confined spaces, high-vis harness anchors above 1.8m height, and dry-powder extinguisher standing by at hot work zones.";
          }
        } else if (activeMode === 'programme') {
          responseText = "Vessel Programme analysis: **HN-301** (Al Noukhitha) is at **34% completion** in Steel Fabrication phase. Launch milestone is scheduled for **Nov 28, 2026** (forecast deviation: +8 days due to SBS-02 downtime). SPI is 0.94.";
        } else if (activeMode === 'executive') {
          responseText = "Consolidated Executive Summary: Overall shipyard SPI is 0.98, CPI is 0.96. Active programmes value is $245M. Angolan BR71 Corvette Program HN-202 is running 2 days ahead of schedule in block assembly.";
        } else {
          responseText = "Document intelligence parsed 4 related Lloyd's Register naval rules files. Reference Chapter 4, Section 2: 'Hull Weld Structural Integrity - Non-destructive Testing (NDT) guidelines'. All butt joints require 100% UT scanning.";
        }

        const assistantMsg: ChatMessage = {
          id: `msg_assistant_${Date.now()}`,
          role: 'assistant',
          content: responseText,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      const errMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: "Operational Telemetry Error: Failed to generate Copilot response. Please verify system network status or Grok API configuration.",
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
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
            Grok LLM engine initialized. Active context windows trace Lloyds Rules and MTU engine schematics.
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
                  <div className="whitespace-pre-line font-medium">{msg.content}</div>
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
