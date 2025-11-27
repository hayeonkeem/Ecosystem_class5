
import React from 'react';
import PopulationGraph from './PopulationGraph';
import type { OrganismType, GameStatus, GameMode } from '../types';
import { GOLDEN_RATIO } from '../constants';

interface ResultModalProps {
  status: GameStatus;
  onRetry: () => void;
  feedback: string;
  populationHistory: Record<OrganismType, number>[];
  populations: Record<OrganismType, number>;
  gameMode?: GameMode;
}

const ResultModal: React.FC<ResultModalProps> = ({ status, onRetry, feedback, populationHistory, populations, gameMode }) => {
  const isSuccess = status === 'success';

  // --- Dynamic Theme Styles ---
  const theme = isSuccess
    ? {
        // Success (Blue/Teal/Emerald)
        overlay: "bg-emerald-900/30",
        modalBorder: "border-emerald-100",
        modalShadow: "shadow-emerald-200/50",
        gradientText: "from-emerald-600 via-teal-500 to-sky-600",
        icon: "🎉",
        mainTitle: "생태계 균형 달성!",
        subTitle: gameMode === 'hard' ? "대재앙을 이겨내고 생태계를 지켜냈습니다!" : "완벽한 조화를 이루었습니다.",
        reportBg: "bg-emerald-50/80",
        reportBorder: "border-emerald-100",
        reportTitle: "text-emerald-800",
        reportIconBg: "bg-emerald-100",
        reportText: "text-slate-700",
        buttonGradient: "from-emerald-500 to-teal-500",
        buttonShadow: "shadow-emerald-200/50",
        buttonHoverShadow: "hover:shadow-emerald-300/60",
      }
    : {
        // Failure (Red/Rose/Orange)
        overlay: "bg-red-900/30",
        modalBorder: "border-red-100",
        modalShadow: "shadow-red-200/50",
        gradientText: "from-red-600 via-rose-500 to-orange-600",
        icon: "🚨",
        mainTitle: "생태계 붕괴...",
        subTitle: gameMode === 'hard' ? "재난을 견디지 못하고 멸종했습니다." : "균형이 무너지며 생태계가 파괴되었습니다.",
        reportBg: "bg-red-50/80",
        reportBorder: "border-red-100",
        reportTitle: "text-red-800",
        reportIconBg: "bg-red-100",
        reportText: "text-slate-700",
        buttonGradient: "from-red-500 to-rose-500",
        buttonShadow: "shadow-red-200/50",
        buttonHoverShadow: "hover:shadow-red-300/60",
      };

  // Animation classes
  const fadeInScale = "animate-[fadeInScale_0.4s_ease-out_forwards]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
       {/* Backdrop with blur */}
      <div className={`absolute inset-0 ${theme.overlay} backdrop-blur-[8px] transition-all duration-500`}></div>

      {/* Modal Card */}
      <div className={`relative bg-white/95 backdrop-blur-2xl border ${theme.modalBorder} rounded-[2.5rem] shadow-2xl ${theme.modalShadow} p-6 sm:p-10 w-full max-w-5xl overflow-hidden flex flex-col items-center text-center ${fadeInScale} ring-1 ring-white/50`}>
        
        {/* Background Decorative Blobs */}
        <div className={`absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full blur-[80px] pointer-events-none opacity-30 ${isSuccess ? 'bg-emerald-300' : 'bg-red-300'}`}></div>
        <div className={`absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full blur-[80px] pointer-events-none opacity-30 ${isSuccess ? 'bg-sky-300' : 'bg-orange-300'}`}></div>

        {/* Header Section */}
        <div className="relative z-10 mb-8 w-full">
          <div className="text-7xl mb-4 animate-[bounce_2s_infinite] drop-shadow-sm inline-block">
            {theme.icon}
          </div>
          <h2 className={`text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText} drop-shadow-sm mb-2`}>
            {theme.mainTitle}
          </h2>
          <p className="text-lg text-slate-500 font-bold tracking-tight">
            {theme.subTitle}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Left Col: AI Report Card */}
            <div className={`${theme.reportBg} border ${theme.reportBorder} rounded-3xl p-6 text-left shadow-sm flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group`}>
                
                {/* Decorative scanning line for AI feel */}
                {!isSuccess && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-50 animate-[scan_3s_linear_infinite]"></div>}
                
                <div className="flex items-center gap-3 mb-4">
                    <div className={`${theme.reportIconBg} p-2 rounded-xl text-2xl shadow-sm`}>🤖</div>
                    <div>
                        <h3 className={`font-bold ${theme.reportTitle} text-lg tracking-tight`}>AI 생태계 분석 리포트</h3>
                        <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Analysis Code: {isSuccess ? 'SUCCESS_200' : 'CRITICAL_FAIL_500'}</p>
                    </div>
                </div>
                
                <div className="flex-grow bg-white/60 rounded-2xl p-4 border border-white/50 mb-4 shadow-inner">
                    <p className={`${theme.reportText} font-medium leading-relaxed text-lg break-keep`}>
                        {isSuccess ? (
                            "축하합니다! 모든 생물군이 멸종 위기 없이 안정적인 개체 수를 유지했습니다. 생산자와 소비자 간의 에너지 흐름이 매우 이상적입니다."
                        ) : (
                            feedback
                        )}
                    </p>
                </div>

                {/* Stat Hints */}
                <div className="bg-white/80 rounded-2xl p-4 border border-white/60 shadow-sm">
                    <h4 className="font-bold text-slate-800 text-xs mb-3 flex justify-between items-center uppercase tracking-wider opacity-60">
                    <span>{gameMode === 'hard' ? "🛡️ SURVIVAL GUIDE" : "🔑 GOLDEN RATIO"}</span>
                    </h4>
                    
                    <div className="grid grid-cols-4 gap-2 text-center">
                    {/* Producer */}
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 bg-green-100 text-green-700 rounded-lg flex items-center justify-center text-sm shadow-sm">🌱</div>
                        <span className="font-black text-slate-700 text-sm">{gameMode === 'hard' ? "많음" : GOLDEN_RATIO.producer}</span>
                    </div>
                        {/* Primary */}
                        <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 bg-yellow-100 text-yellow-700 rounded-lg flex items-center justify-center text-sm shadow-sm">🐇</div>
                        <span className="font-black text-slate-700 text-sm">{gameMode === 'hard' ? "중간" : GOLDEN_RATIO.primary}</span>
                    </div>
                        {/* Secondary */}
                        <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 bg-red-100 text-red-700 rounded-lg flex items-center justify-center text-sm shadow-sm">🦊</div>
                        <span className="font-black text-slate-700 text-sm">{GOLDEN_RATIO.secondary}</span>
                    </div>
                        {/* Decomposer */}
                        <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center text-sm shadow-sm">🍄</div>
                        <span className="font-black text-slate-700 text-sm">{GOLDEN_RATIO.decomposer}</span>
                    </div>
                    </div>
                </div>
            </div>
            
            {/* Right Col: Graph */}
            <div className="bg-white/60 border border-slate-200/60 rounded-3xl p-4 h-80 lg:h-auto shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <PopulationGraph 
                    gamePhase="result"
                    populations={populations}
                    populationHistory={populationHistory}
                    showTarget={gameMode === 'normal'}
                />
            </div>
        </div>

        {/* Action Button */}
        <div className="relative z-10 w-full flex justify-center">
          <button 
            onClick={onRetry} 
            className={`group relative px-12 py-4 bg-gradient-to-r ${theme.buttonGradient} rounded-2xl font-bold text-xl text-white shadow-lg ${theme.buttonShadow} hover:shadow-xl ${theme.buttonHoverShadow} transform transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden ring-1 ring-white/30`}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
            <span className="flex items-center gap-3">
                {isSuccess ? "메인으로 돌아가기" : "다시 시도하기"}
                <span className="text-2xl group-hover:rotate-12 transition-transform">{isSuccess ? '🏠' : '💪'}</span>
            </span>
          </button>
        </div>

      </div>

      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes scan {
            0% { top: 0; opacity: 0; }
            10% { opacity: 0.5; }
            90% { opacity: 0.5; }
            100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ResultModal;
