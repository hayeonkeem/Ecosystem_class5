import React from 'react';
import type { GameMode } from '../types';

interface ModeSelectionScreenProps {
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({ onSelectMode, onBack }) => {
  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-emerald-50 to-teal-50 z-0"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-300/10 rounded-full blur-[100px] animate-pulse z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-300/10 rounded-full blur-[100px] animate-pulse z-0" style={{ animationDelay: '2s' }}></div>

      {/* Back Button to Intro */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 group flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-all duration-300 z-20"
        aria-label="뒤로 가기"
      >
        <div className="p-2 rounded-full bg-white/60 border border-white/50 shadow-sm group-hover:bg-white transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        <span className="font-bold text-sm opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">처음으로</span>
      </button>

      <div className="relative z-10 w-full max-w-5xl px-4 animate-fadeIn">
        <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 mb-4 drop-shadow-sm">
          모드 선택
        </h2>
        <p className="text-slate-600 mb-12 text-lg font-medium">
          원하는 시뮬레이션 난이도를 선택하여 생태계를 설계하세요.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
          {/* Normal Mode Card */}
          <button 
            onClick={() => onSelectMode('normal')}
            className="group relative h-80 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-200/50 border border-white/60 bg-white/60 hover:bg-white text-left p-8 flex flex-col justify-between backdrop-blur-md shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 text-4xl shadow-sm border border-blue-200 group-hover:scale-110 transition-transform duration-300">
                🌿
              </div>
              <h3 className="text-3xl font-bold text-slate-800 group-hover:text-blue-700 mb-2">평화 모드</h3>
              <div className="h-1 w-12 bg-blue-400 rounded-full mb-4 group-hover:w-20 transition-all duration-300"></div>
              <p className="text-slate-500 group-hover:text-slate-700 text-sm leading-relaxed font-medium">
                외부 재난 없는 평화로운 환경입니다.<br/>
                생태계 균형의 기초를 배우기에 적합합니다.
              </p>
            </div>
            
            <div className="relative z-10 flex items-center text-blue-500 text-sm font-bold group-hover:translate-x-2 transition-transform duration-300">
              선택하기 <span className="ml-2">→</span>
            </div>
          </button>

          {/* Hard Mode Card */}
          <button 
            onClick={() => onSelectMode('hard')}
            className="group relative h-80 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-200/50 border border-white/60 bg-white/60 hover:bg-white text-left p-8 flex flex-col justify-between backdrop-blur-md shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-6 text-4xl shadow-sm border border-red-200 group-hover:scale-110 transition-transform duration-300">
                🔥
              </div>
              <h3 className="text-3xl font-bold text-slate-800 group-hover:text-red-700 mb-2">기후 위기 모드</h3>
              <div className="h-1 w-12 bg-red-400 rounded-full mb-4 group-hover:w-20 transition-all duration-300"></div>
              <p className="text-slate-500 group-hover:text-slate-700 text-sm leading-relaxed font-medium">
                가뭄, 홍수 등 예측 불가능한 재난이 발생합니다.<br/>
                극한 상황에서의 생존 전략이 필요합니다.
              </p>
            </div>

            <div className="relative z-10 flex items-center text-red-500 text-sm font-bold group-hover:translate-x-2 transition-transform duration-300">
              도전하기 <span className="ml-2">→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelectionScreen;