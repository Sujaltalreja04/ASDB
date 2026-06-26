import React, { useState, useEffect, useRef } from 'react';
import { Camera, Compass, Award, CheckCircle2, Check, ArrowRight, ArrowLeft, RotateCcw, Video, VideoOff, Wrench } from 'lucide-react';

const arSteps = [
  { id: 1, title: 'BED MOUNT ALIGNMENT CHECK', desc: 'Inspect dampers and measure bed clearance. Adjust the shim slider until bed frame flatness deviation is below 0.12mm.', target: 'BED FLATNESS: < 0.12mm' },
  { id: 2, title: 'FUEL INJECTOR VALVE CALIBRATION', desc: 'Tighten the fuel injector valve mountings. Click all 6 hex bolts in a star sequence (1-4-2-5-3-6) to lock torque load.', target: 'TORQUE TARGET: 740 Nm' },
  { id: 3, title: 'SHORE POWER COUPLER SOCKET FIT', desc: 'Secure the coupler connection. Engage the ground pins toggle first, then slide the Lock Pins latch down.', target: 'INSULATION PINS: LOCKED' }
];

// ==========================================
// AR Interactive View Component
// ==========================================
interface ARViewProps {
  activeStepIdx: number;
  useWebcam: boolean;
  shimValue: number;
  completedBolts: number[];
  handleBoltClick: (idx: number) => void;
  pinsEngaged: boolean;
  groundEngaged: boolean;
}

function ARView({
  activeStepIdx,
  useWebcam,
  shimValue,
  completedBolts,
  handleBoltClick,
  pinsEngaged,
  groundEngaged,
  showBoxes = true
}: ARViewProps & { showBoxes?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoActive, setVideoActive] = useState(false);
  const frameCountRef = useRef(0);

  // Setup webcam stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    const video = videoRef.current;

    if (useWebcam && video) {
      navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 300 } })
        .then((s) => {
          stream = s;
          video.srcObject = s;
          video.onloadedmetadata = () => {
            video.play();
            setVideoActive(true);
          };
        })
        .catch((err) => {
          console.error("Camera access denied or unavailable: ", err);
          setVideoActive(false);
        });
    } else {
      setVideoActive(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useWebcam]);

  // Main canvas draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      frameCountRef.current++;

      // Clear or draw video frame
      if (useWebcam && videoActive && videoRef.current) {
        try {
          ctx.drawImage(videoRef.current, 0, 0, 480, 260);
          
          // Draw a semi-transparent screen color mask to keep it looking green/cyber
          ctx.fillStyle = 'rgba(0, 212, 160, 0.15)';
          ctx.fillRect(0, 0, 480, 260);
        } catch (e) {
          // fallback in case of drawImage race conditions
          ctx.fillStyle = '#060D1A';
          ctx.fillRect(0, 0, 480, 260);
        }
      } else {
        ctx.fillStyle = '#060D1A';
        ctx.fillRect(0, 0, 480, 260);
      }

      // Draw AR Grid crosshairs HUD overlays
      ctx.strokeStyle = 'rgba(0, 212, 160, 0.18)';
      ctx.lineWidth = 1;
      
      // Corners brackets
      ctx.beginPath();
      // top-left
      ctx.moveTo(20, 40); ctx.lineTo(20, 20); ctx.lineTo(40, 20);
      // top-right
      ctx.moveTo(460, 40); ctx.lineTo(460, 20); ctx.lineTo(440, 20);
      // bottom-left
      ctx.moveTo(20, 220); ctx.lineTo(20, 240); ctx.lineTo(40, 240);
      // bottom-right
      ctx.moveTo(460, 220); ctx.lineTo(460, 240); ctx.lineTo(440, 240);
      ctx.stroke();

      // Center crosshair
      ctx.strokeStyle = 'rgba(0, 212, 160, 0.4)';
      ctx.beginPath();
      ctx.moveTo(230, 130); ctx.lineTo(250, 130);
      ctx.moveTo(240, 120); ctx.lineTo(240, 140);
      ctx.stroke();

      // Dynamic graphic based on active step
      if (activeStepIdx === 0) {
        // STEP 1: Bed Mount Flatness check drawing
        ctx.strokeStyle = '#8FA5C0';
        ctx.lineWidth = 2;
        ctx.strokeRect(100, 90, 280, 80);

        // Bed mounting plate
        const shimOffset = (shimValue - 50) * 0.4;
        ctx.fillStyle = shimValue >= 76 && shimValue <= 84 ? '#00D4A0' : '#FF3B47';
        ctx.fillRect(120, 130 + shimOffset, 240, 15);
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(120, 130 + shimOffset, 240, 15);

        // Dampeners icons
        ctx.fillStyle = '#2A3F5A';
        ctx.fillRect(140, 145 + shimOffset, 30, 25);
        ctx.fillRect(310, 145 + shimOffset, 30, 25);

        // Accuracy readout text overlays
        const errorPercent = Math.abs(shimValue - 80) * 0.01;
        const deviation = 0.08 + (errorPercent * 0.8);
        ctx.fillStyle = deviation < 0.12 ? '#00D4A0' : '#FF3B47';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`FLATNESS DEVIATION: ${deviation.toFixed(2)}mm`, 120, 75);
        ctx.fillText(deviation < 0.12 ? "ALIGNMENT: PASS" : "ALIGNMENT: FAIL (EXCESS DEVIATION)", 120, 62);

        // Calibration indicator dials
        ctx.strokeStyle = deviation < 0.12 ? '#00D4A0' : '#FF3B47';
        ctx.beginPath();
        ctx.arc(385, 68, 12, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(385, 68);
        const dialAngle = -Math.PI / 2 + (shimValue / 100) * Math.PI;
        ctx.lineTo(385 + Math.cos(dialAngle)*10, 68 + Math.sin(dialAngle)*10);
        ctx.stroke();

      } else if (activeStepIdx === 1) {
        // STEP 2: Fuel Injector star bolts check
        ctx.fillStyle = 'rgba(42, 63, 90, 0.4)';
        ctx.beginPath();
        ctx.arc(240, 130, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#8FA5C0';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Core valve tip nozzle
        ctx.fillStyle = '#0F1F3A';
        ctx.beginPath();
        ctx.arc(240, 130, 15, 0, Math.PI * 2);
        ctx.fill();

        // 6 Bolts positions in circular formation
        const boltPositions = [
          { x: 240, y: 70, label: '1' },
          { x: 290, y: 100, label: '2' },
          { x: 290, y: 160, label: '3' },
          { x: 240, y: 190, label: '4' },
          { x: 190, y: 160, label: '5' },
          { x: 190, y: 100, label: '6' }
        ];

        boltPositions.forEach((b, idx) => {
          const isDone = completedBolts.includes(idx);
          ctx.fillStyle = isDone ? '#00D4A0' : '#FF3B47';
          ctx.beginPath();
          ctx.arc(b.x, b.y, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#060D1A';
          ctx.font = 'bold 8px Inter';
          ctx.textAlign = 'center';
          ctx.fillText(b.label, b.x, b.y + 3);

          if (showBoxes) {
            ctx.strokeStyle = isDone ? '#00D4A0' : '#FF3B47';
            ctx.strokeRect(b.x - 12, b.y - 12, 24, 24);
          }
        });

        // Current sequence instruction HUD overlay
        ctx.fillStyle = '#E8EDF5';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`BOLTS TIGHTENED: [${completedBolts.length}/6]`, 60, 50);
        ctx.fillText("TARGET PATTERN: 1 -> 4 -> 2 -> 5 -> 3 -> 6", 60, 62);
        
        if (completedBolts.length === 6) {
          ctx.fillStyle = '#00D4A0';
          ctx.fillText("VALVE MOUNT SECURED - TORQUE 740 Nm CALIBRATED", 60, 74);
        }

      } else if (activeStepIdx === 2) {
        // STEP 3: Coupler Insulative socket check
        ctx.strokeStyle = '#8FA5C0';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(120, 80, 240, 100);

        // Ground wire connector
        ctx.fillStyle = groundEngaged ? '#00D4A0' : '#FF3B47';
        ctx.fillRect(150, 100, 180, 15);
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeRect(150, 100, 180, 15);
        
        ctx.fillStyle = '#E8EDF5';
        ctx.font = 'bold 7px monospace';
        ctx.fillText("GROUND_LINE_PIN", 160, 110);

        // Lock Pins blocks
        ctx.fillStyle = pinsEngaged ? '#00D4A0' : '#2A3F5A';
        ctx.fillRect(170, 130, 40, 30);
        ctx.fillRect(270, 130, 40, 30);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText("PIN_A", 180, 148);
        ctx.fillText("PIN_B", 280, 148);

        // HUD Insulative metrics
        ctx.fillStyle = groundEngaged && pinsEngaged ? '#00D4A0' : '#FFB400';
        ctx.font = 'bold 8px monospace';
        ctx.fillText(`GROUND CONNECTION: ${groundEngaged ? 'CONNECTED' : 'DISCONNECTED'}`, 60, 50);
        ctx.fillText(`LOCKING LATCH PINS: ${pinsEngaged ? 'ENGAGED / INSULATED' : 'RETRACTED'}`, 60, 62);
      }

      // HUD parameters text labels
      ctx.fillStyle = 'rgba(0, 212, 160, 0.45)';
      ctx.font = '7px monospace';
      ctx.textAlign = 'left';
      ctx.fillText("AR SCAN MODULE VER: 4.19", 15, 235);
      ctx.fillText("DEVICE FRAME BUFFER: VALID", 15, 245);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [activeStepIdx, useWebcam, videoActive, shimValue, completedBolts, pinsEngaged, groundEngaged]);

  return (
    <div className="relative w-full h-full min-h-[260px] flex items-center justify-center bg-black/40">
      <video 
        ref={videoRef} 
        style={{ display: 'none' }} 
        playsInline 
        muted 
      />
      <canvas 
        ref={canvasRef} 
        width={480} 
        height={260} 
        className="max-w-full rounded-lg border border-border"
        onClick={(e) => {
          // If in step 2, check if user clicked on a bolt to tighten it
          if (activeStepIdx !== 1) return;
          const canvas = canvasRef.current;
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          const clickX = (e.clientX - rect.left) * (480 / rect.width);
          const clickY = (e.clientY - rect.top) * (260 / rect.height);

          const boltPositions = [
            { x: 240, y: 70 },
            { x: 290, y: 100 },
            { x: 290, y: 160 },
            { x: 240, y: 190 },
            { x: 190, y: 160 },
            { x: 190, y: 100 }
          ];

          boltPositions.forEach((b, idx) => {
            if (Math.hypot(b.x - clickX, b.y - clickY) < 14) {
              handleBoltClick(idx);
            }
          });
        }}
      />
    </div>
  );
}

// ==========================================
// Main Apprentice Training Component
// ==========================================
export default function ARMaintenance() {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Webcam state
  const [useWebcam, setUseWebcam] = useState(false);

  // Training exercise states
  const [shimValue, setShimValue] = useState(40); // 80 is nominal target
  const [completedBolts, setCompletedBolts] = useState<number[]>([]);
  const [pinsEngaged, setPinsEngaged] = useState(false);
  const [groundEngaged, setGroundEngaged] = useState(false);

  // Training scores
  const [drillScore, setDrillScore] = useState(0);

  const step = arSteps[activeStepIdx];

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleBoltClick = (idx: number) => {
    // Correct star sequence order: 1 (0), 4 (3), 2 (1), 5 (4), 3 (2), 6 (5)
    const sequenceOrder = [0, 3, 1, 4, 2, 5];
    const expectedBoltIdx = sequenceOrder[completedBolts.length];

    if (completedBolts.includes(idx)) {
      triggerToast("Bolt already tightened.");
      return;
    }

    if (idx === expectedBoltIdx) {
      setCompletedBolts(prev => [...prev, idx]);
      triggerToast(`Tightened Bolt ${idx + 1}. Torque locked.`);
      setDrillScore(prev => prev + 15);
    } else {
      triggerToast(`Sequence Error: Tightening Bolt ${idx + 1} violated star layout pattern!`);
      // Subtract penalty
      setDrillScore(prev => Math.max(0, prev - 10));
    }
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (activeStepIdx === 0) {
      const errorPercent = Math.abs(shimValue - 80) * 0.01;
      const deviation = 0.08 + (errorPercent * 0.8);
      if (deviation > 0.12) {
        triggerToast("Error: Bed alignment deviation exceeds maximum allowed tolerance! Cannot proceed.");
        return;
      }
      setDrillScore(prev => prev + 10);
    } else if (activeStepIdx === 1) {
      if (completedBolts.length < 6) {
        triggerToast("Error: Injector valves mounting bolts must be fully tightened first.");
        return;
      }
    } else if (activeStepIdx === 2) {
      if (!groundEngaged || !pinsEngaged) {
        triggerToast("Error: Electrical insulated coupler sockets not secure.");
        return;
      }
    }

    if (activeStepIdx < arSteps.length - 1) {
      setActiveStepIdx(prev => prev + 1);
      triggerToast(`Loaded training step ${activeStepIdx + 2}`);
    } else {
      setDrillScore(prev => prev + 25);
      triggerToast("AR Training module checklist complete! Standard certificate updated.");
    }
  };

  const handleResetDrill = () => {
    setActiveStepIdx(0);
    setShimValue(40);
    setCompletedBolts([]);
    setPinsEngaged(false);
    setGroundEngaged(false);
    setDrillScore(0);
    triggerToast("Training curriculum resets. Restarting simulation.");
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

      <div className="border-b border-border/80 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
            AR MAINTENANCE & APPRENTICE TRAINING
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Augmented reality overlay guides for MTU overhauls, NDT weld inspections, and safety training modules.
          </p>
        </div>

        {/* Camera device toggle switches */}
        <button
          onClick={() => {
            setUseWebcam(!useWebcam);
            triggerToast(!useWebcam ? "Requesting device camera access..." : "Deactivating camera feed");
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
            useWebcam
              ? 'border-accent text-accent bg-accent/10 shadow-glow-accent'
              : 'border-border text-text-secondary hover:border-text-primary'
          }`}
        >
          {useWebcam ? (
            <>
              <Camera className="w-3.5 h-3.5" /> Disable Device Camera
            </>
          ) : (
            <>
              <Camera className="w-3.5 h-3.5" /> Enable Webcam Overlay
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AR Viewport canvas - takes 2 cols */}
        <div className="lg:col-span-2 card bg-bg-surface overflow-hidden border border-border flex flex-col justify-between min-h-[320px]">
          <div className="p-3 bg-bg-muted border-b border-border flex justify-between items-center text-xs">
            <span className="font-bold text-text-primary">Technician AR HUD Simulator</span>
            <span className="text-[10px] text-text-muted font-mono">Step {activeStepIdx + 1} of {arSteps.length}</span>
          </div>
          
          <div className="flex-1 bg-black/60 relative flex items-center justify-center min-h-[260px]">
            <ARView 
              activeStepIdx={activeStepIdx}
              useWebcam={useWebcam}
              shimValue={shimValue}
              completedBolts={completedBolts}
              handleBoltClick={handleBoltClick}
              pinsEngaged={pinsEngaged}
              groundEngaged={groundEngaged}
            />

            {/* Instruction tooltip overlay */}
            <div className="border border-accent w-64 p-3 bg-black/85 rounded text-[10px] absolute top-3 right-3 shadow-elevated">
              <div className="font-bold text-accent">STEP {step.id}: {step.title}</div>
              <p className="mt-1 text-text-secondary leading-normal">{step.desc}</p>
              <div className="mt-2 text-text-primary font-bold">{step.target}</div>
            </div>
          </div>
        </div>

        {/* Exercises Controls panel */}
        <div className="card p-5 flex flex-col justify-between min-h-[320px]">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border/80 pb-2">
              Interactive Training Guide
            </h3>

            {/* Exercise panel inputs depending on active step */}
            {activeStepIdx === 0 && (
              <div className="space-y-3 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary">Shimming Adjuster slider:</span>
                  <span className="font-mono text-text-primary font-bold">{shimValue}%</span>
                </div>
                <input 
                  type="range" 
                  min={10} 
                  max={120} 
                  value={shimValue} 
                  onChange={(e) => setShimValue(Number(e.target.value))}
                  className="w-full accent-primary h-1 bg-bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-[10px] text-text-muted">
                  Slide the adjuster until the deviation gauge on the AR HUD shows a green value (target: 80% shim).
                </div>
              </div>
            )}

            {activeStepIdx === 1 && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2 p-2 bg-primary-muted/10 border border-primary/20 rounded-xl">
                  <Wrench className="w-4 h-4 text-primary shrink-0" />
                  <div className="text-[10px] text-text-secondary">
                    Click the red bolts directly on the AR HUD canvas screen in the star sequence to tighten them.
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[9px]">
                  {[0,1,2,3,4,5].map((idx) => (
                    <div 
                      key={idx}
                      className={`p-1.5 rounded border ${
                        completedBolts.includes(idx) 
                          ? 'border-success bg-success-muted/15 text-success' 
                          : 'border-border text-text-muted'
                      }`}
                    >
                      Bolt {idx + 1}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStepIdx === 2 && (
              <div className="space-y-4 pt-1 text-xs">
                {/* Ground wire toggle */}
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Hook Ground Line First:</span>
                  <button 
                    onClick={() => {
                      setGroundEngaged(!groundEngaged);
                      setDrillScore(prev => prev + (groundEngaged ? -10 : 15));
                      triggerToast(groundEngaged ? "Insulative ground line disconnected" : "Ground line connected first.");
                    }}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-250 ease-in-out cursor-pointer ${
                      groundEngaged ? 'bg-primary' : 'bg-bg-overlay border border-border'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-250 ease-in-out ${
                      groundEngaged ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Insulative pins slider latch */}
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Slide Latching Lock Pins:</span>
                  <button 
                    onClick={() => {
                      if (!groundEngaged) {
                        triggerToast("Safety Error: Connect ground line before engaging lock pins!");
                        return;
                      }
                      setPinsEngaged(!pinsEngaged);
                      setDrillScore(prev => prev + (pinsEngaged ? -15 : 20));
                      triggerToast(pinsEngaged ? "Pins retracted" : "Insulative latching pins locked.");
                    }}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-250 ease-in-out cursor-pointer ${
                      pinsEngaged ? 'bg-primary' : 'bg-bg-overlay border border-border'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-250 ease-in-out ${
                      pinsEngaged ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            )}

            {/* Score tracker */}
            <div className="border-t border-border/80 pt-3 mt-3 flex justify-between items-center text-xs">
              <span className="text-text-muted">Training drill Score:</span>
              <span className="font-bold text-accent font-mono">{drillScore} pts</span>
            </div>

          </div>

          {/* Navigation Controls buttons */}
          <div className="space-y-2 mt-4">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (activeStepIdx > 0) {
                    setActiveStepIdx(prev => prev - 1);
                    triggerToast(`Loaded training step ${activeStepIdx}`);
                  }
                }}
                disabled={activeStepIdx === 0}
                className="flex-1 py-2 bg-bg-overlay border border-border rounded-lg text-xs font-bold text-text-secondary disabled:opacity-50 flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back Step
              </button>
              
              <button
                onClick={handleNext}
                className="flex-1 py-2 bg-primary hover:bg-primary-hover text-text-inverse rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-[0.98] transition-all"
              >
                {activeStepIdx === arSteps.length - 1 ? 'Verify Certificate' : 'Next Step'} 
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleResetDrill}
              className="w-full py-1.5 border border-dashed border-border rounded-lg text-[10px] text-text-muted hover:text-text-secondary cursor-pointer text-center"
            >
              Reset Training Checklist
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
