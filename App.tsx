import React, { useState, useCallback, useRef } from 'react';
import ResultModal from './components/ResultModal';
import EcosystemVisualizer from './components/EcosystemVisualizer';
import PopulationGraph from './components/PopulationGraph';
import IntroScreen from './components/IntroScreen';
import ModeSelectionScreen from './components/ModeSelectionScreen';
import OrganismControl from './components/OrganismControl';
import EventNotification from './components/EventNotification';
import GameManual from './components/GameManual';
import { ORGANISM_CONFIGS, GOLDEN_RATIO, SUCCESS_TOLERANCE } from './constants';
import type { OrganismType, GameStatus, GamePhase, SimulationEvent, GameMode } from './types';

// Modified: Not the golden ratio anymore. User must find it.
const INITIAL_POPULATIONS: Record<OrganismType, number> = {
  producer: 50,
  primary: 30,
  secondary: 10,
  decomposer: 20,
};

const ZERO_POPULATIONS: Record<OrganismType, number> = {
  producer: 0,
  primary: 0,
  secondary: 0,
  decomposer: 0,
};

const NORMAL_DURATION = 10000; // 10 seconds for normal mode
const HARD_DURATION = 20000;   // 20 seconds for hard mode
const SIMULATION_STEPS = 100; 

function App() {
  const [populations, setPopulations] = useState<Record<OrganismType, number>>(ZERO_POPULATIONS);
  const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
  const [gameMode, setGameMode] = useState<GameMode>('normal');
  const [resultStatus, setResultStatus] = useState<GameStatus>('playing');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [populationHistory, setPopulationHistory] = useState<Record<OrganismType, number>[]>([]);
  const [currentEvent, setCurrentEvent] = useState<SimulationEvent | null>(null);
  const [showManual, setShowManual] = useState(false);
  
  // New state to track if user has failed at least once
  const [hasFailed, setHasFailed] = useState(false);
  
  const simulationInterval = useRef<number | null>(null);
  const eventTimeout = useRef<number | null>(null);

  const handlePopulationChange = useCallback((organism: OrganismType, value: number) => {
    if (gamePhase === 'configuring') {
      setPopulations(prev => ({ ...prev, [organism]: value }));
    }
  }, [gamePhase]);

  const startSimulation = () => {
    setGamePhase('simulating');
    setCurrentEvent(null);
    
    const initialSnapshot = { ...populations };
    const history: Record<OrganismType, number>[] = [initialSnapshot];
    setPopulationHistory(history);

    let step = 0;
    let disasterHasOccurred = false;

    // Set duration based on game mode
    const duration = gameMode === 'normal' ? NORMAL_DURATION : HARD_DURATION;

    simulationInterval.current = window.setInterval(() => {
      step++;
      // Get previous state
      const prev = history[history.length - 1];
      
      // Use floating point for calculation
      let P = prev.producer;
      let C1 = prev.primary;
      let C2 = prev.secondary;
      let D = prev.decomposer;
      
      // --- Disaster Event Logic (Only in Hard Mode) ---
      // DIFFICULTY TUNING: Stop disasters after 70% to allow recovery.
      if (gameMode === 'hard' && !disasterHasOccurred && step > SIMULATION_STEPS * 0.2 && step < SIMULATION_STEPS * 0.7) {
         if (Math.random() < 0.05) { // 5% chance per step in the danger window
             disasterHasOccurred = true;
             const rand = Math.random();
             let event: SimulationEvent;

             // Reduced penalties for better playability
             if (rand < 0.25) {
                 event = { type: 'drought', name: '극심한 가뭄', description: '비가 오지 않아 식물이 말라 죽습니다!' };
                 P = Math.floor(P * 0.85); // 15% loss
             } else if (rand < 0.5) {
                 event = { type: 'flood', name: '대홍수 발생', description: '불어난 물이 지표면을 휩쓸고 지나갑니다!' };
                 P = Math.floor(P * 0.9); 
                 D = Math.floor(D * 0.8);
             } else if (rand < 0.75) {
                 event = { type: 'typhoon', name: '강력한 태풍', description: '강풍이 생태계 전체를 강타합니다!' };
                 P = Math.floor(P * 0.9);
                 C1 = Math.floor(C1 * 0.9);
                 C2 = Math.floor(C2 * 0.95);
             } else {
                 event = { type: 'invasive', name: '외래종 유입', description: '천적이 없는 외래종이 토종 생물을 위협합니다!' };
                 C1 = Math.floor(C1 * 0.85);
                 C2 = Math.floor(C2 * 0.95);
             }

             setCurrentEvent(event);
             if (eventTimeout.current) clearTimeout(eventTimeout.current);
             eventTimeout.current = window.setTimeout(() => setCurrentEvent(null), 4000);
         }
      }

      // --- SIMULATION LOGIC ---
      
      // 1. Producer
      const pGrowth = 0.2 * P * (1 - P / 500);
      const pLoss = 0.32 * C1;
      const dP = pGrowth - pLoss;

      // 2. Primary Consumer
      const c1Growth = 0.1 * C1 * (P / 100); 
      const c1Loss = 0.5 * C2;
      const dC1 = c1Growth - c1Loss;

      // 3. Secondary Consumer
      const c2Growth = 0.1 * C2 * (C1 / 50);
      const c2Death = 0.1 * C2;
      const dC2 = c2Growth - c2Death;

      // 4. Decomposer
      const targetD = (P + C1 + C2) * 0.15;
      const dD = (targetD - D) * 0.1;

      // Apply changes
      P += dP;
      C1 += dC1;
      C2 += dC2;
      D += dD;

      // Construct new state
      const newPopulations = {
        producer: Math.max(0, Math.min(500, Math.round(P))),
        primary: Math.max(0, Math.min(300, Math.round(C1))),
        secondary: Math.max(0, Math.min(100, Math.round(C2))),
        decomposer: Math.max(0, Math.min(200, Math.round(D))),
      };

      setPopulations(newPopulations);
      history.push(newPopulations);
      setPopulationHistory([...history]);

      if (step >= SIMULATION_STEPS) {
        if (simulationInterval.current) clearInterval(simulationInterval.current);
        setGamePhase('result');
        setCurrentEvent(null);

        // Check Success Logic
        const hasExtinction = 
            newPopulations.producer <= 5 || 
            newPopulations.primary <= 5 || 
            newPopulations.secondary <= 1;

        let isSuccess = false;

        if (gameMode === 'hard') {
            // HARD MODE WIN CONDITION: SURVIVAL IS VICTORY
            // If nothing went extinct, you win regardless of the exact ratio.
            if (!hasExtinction) {
                isSuccess = true;
                setFeedbackMessage("대재앙 속에서도 생태계가 살아남았습니다! 끈질긴 생명력의 승리입니다.");
            } else {
                isSuccess = false;
            }
        } else {
            // NORMAL MODE WIN CONDITION: BALANCE
            const finalTotalDiff = 
                Math.abs(newPopulations.producer - GOLDEN_RATIO.producer) +
                Math.abs(newPopulations.primary - GOLDEN_RATIO.primary) +
                Math.abs(newPopulations.secondary - GOLDEN_RATIO.secondary);
            
            if (!hasExtinction && finalTotalDiff <= SUCCESS_TOLERANCE * 2) {
                isSuccess = true;
                setFeedbackMessage("완벽합니다! 모든 생물이 조화롭게 공존하고 있습니다.");
            }
        }

        if (isSuccess) {
            setResultStatus('success');
        } else {
            setResultStatus('failure');
            setHasFailed(true);
            
            // Failure Feedback
            if (newPopulations.producer <= 5) {
                setFeedbackMessage("실패: 풀이 멸종했습니다. 기후 위기 때는 생산자를 더 많이 심어 대비하세요.");
            } else if (newPopulations.primary <= 5) {
                setFeedbackMessage("실패: 토끼가 멸종했습니다. 여우가 너무 많거나 먹이가 부족했습니다.");
            } else if (newPopulations.secondary <= 1) {
                setFeedbackMessage("실패: 여우가 굶어 죽었습니다. 먹이사슬 기초가 튼튼해야 합니다.");
            } else {
                setFeedbackMessage(`균형이 무너졌습니다. ${gameMode === 'hard' ? '기후 위기 모드에서는 멸종하지 않는 것이 목표입니다.' : '생산자 > 1차 > 2차 소비자 순서의 피라미드를 기억하세요.'}`);
            }
        }
      }
    }, duration / SIMULATION_STEPS);
  };

  const handleRetry = useCallback(() => {
    if (resultStatus === 'success') {
        setPopulations(INITIAL_POPULATIONS);
        setResultStatus('playing');
        setFeedbackMessage('');
        setPopulationHistory([]);
        setCurrentEvent(null);
        setGamePhase('intro');
        setHasFailed(false);
    } else {
        setResultStatus('playing');
        setFeedbackMessage('');
        setPopulationHistory([]);
        setCurrentEvent(null);
        setGamePhase('configuring');
    }
  }, [resultStatus]);

  const handleIntroStart = useCallback(() => {
    setGamePhase('mode-select');
  }, []);

  const handleModeSelect = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setPopulations(INITIAL_POPULATIONS);
    setGamePhase('configuring');
    setHasFailed(false);
  }, []);

  const handleBackToModeSelect = useCallback(() => {
    if (simulationInterval.current) {
        window.clearInterval(simulationInterval.current);
        simulationInterval.current = null;
    }
    if (eventTimeout.current) {
        window.clearTimeout(eventTimeout.current);
        eventTimeout.current = null;
    }
    
    setGamePhase('mode-select');
    setResultStatus('playing');
    setFeedbackMessage('');
    setPopulationHistory([]);
    setCurrentEvent(null);
    setHasFailed(false);
  }, []);

  const handleBackToIntro = useCallback(() => {
    setGamePhase('intro');
  }, []);

  if (gamePhase === 'intro') {
    return <IntroScreen onStart={handleIntroStart} />;
  }
  
  if (gamePhase === 'mode-select') {
    return <ModeSelectionScreen onSelectMode={handleModeSelect} onBack={handleBackToIntro} />;
  }

  const isUIActive = gamePhase === 'configuring';

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4 lg:p-6 transition-colors duration-1000 relative overflow-hidden">
      
      {/* Background Atmosphere - Light Theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-emerald-50 to-teal-50 z-0 pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-white/40 rounded-full blur-[100px] z-0 pointer-events-none"></div>

      <GameManual isOpen={showManual} onClose={() => setShowManual(false)} />
      
      {/* Back Button for Game Screen */}
      <button 
        onClick={handleBackToModeSelect}
        className="fixed top-6 left-6 z-40 group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all duration-300"
      >
        <div className="p-2.5 rounded-full bg-white/70 border border-white/60 shadow-md backdrop-blur-sm group-hover:bg-white transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </div>
        <span className="hidden sm:inline font-bold text-sm drop-shadow-sm opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">모드 선택으로</span>
      </button>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl mx-auto h-[85vh] relative z-10">
        
        {/* Visualizer Section */}
        <div className="w-full h-full min-h-[300px] lg:min-h-0 relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 ring-1 ring-black/5 group bg-sky-200">
           <EventNotification event={currentEvent} />
           <EcosystemVisualizer populations={populations} currentEvent={currentEvent} />
           
           <div className="absolute top-4 right-4 flex gap-2 z-20">
             {gameMode === 'hard' && (
               <div className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm font-bold flex items-center gap-1 border border-red-400">
                  🔥 기후 위기 모드
               </div>
             )}
             {gameMode === 'normal' && (
               <div className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm font-bold flex items-center gap-1 border border-blue-400">
                  🌿 평화 모드
               </div>
             )}
           </div>
        </div>
        
        {/* Controls Section - Light Glassmorphism */}
        <div className="flex flex-col h-full gap-4 relative">
          <div className="bg-white/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-xl border border-white/60 flex flex-col gap-6 h-full relative ring-1 ring-white/50">
            
            <button 
                onClick={() => setShowManual(true)}
                className="absolute top-6 right-6 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100/50 px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 border border-transparent hover:border-emerald-200"
            >
                <span className="text-lg">📘</span> 매뉴얼
            </button>
            
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                생태계 제어 패널
                <div className={`w-2.5 h-2.5 rounded-full ${isUIActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}></div>
            </h2>

            <div className="space-y-5 flex-shrink-0 mt-2">
                {ORGANISM_CONFIGS.map(config => (
                <OrganismControl
                    key={config.id}
                    config={config}
                    value={populations[config.id]}
                    onChange={(value) => handlePopulationChange(config.id, value)}
                    disabled={!isUIActive}
                />
                ))}
            </div>

            <div className="flex-grow min-h-0 pt-2 pb-2"> 
                <PopulationGraph 
                    gamePhase={gamePhase} 
                    populations={populations} 
                    populationHistory={populationHistory}
                    showTarget={hasFailed} 
                />
            </div>

            <button
                onClick={startSimulation}
                disabled={!isUIActive}
                className="w-full relative group overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg py-4 px-8 rounded-2xl shadow-lg hover:shadow-emerald-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:bg-none disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none flex-shrink-0"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                    {isUIActive ? (
                        <>시뮬레이션 시작 <span className="text-xl">🚀</span></>
                    ) : (
                        <><span className="animate-spin">⏳</span> 생태계 관찰 중...</>
                    )}
                </span>
            </button>
          </div>
        </div>
      </main>
      
      {gamePhase === 'result' && (
        <ResultModal 
          status={resultStatus} 
          onRetry={handleRetry} 
          feedback={feedbackMessage}
          populationHistory={populationHistory}
          populations={populations}
          gameMode={gameMode} // Pass game mode to show specific tips
        />
      )}
    </div>
  );
}

export default App;