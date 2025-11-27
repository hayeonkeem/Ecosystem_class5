import React from 'react';

interface IntroScreenProps {
  onStart: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-sky-50">
      {/* Animated Background Elements - Light Theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-emerald-50 to-teal-50 z-0"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-300/20 rounded-full blur-[100px] animate-pulse z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-300/20 rounded-full blur-[100px] animate-pulse z-0" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-blue-300/20 rounded-full blur-[80px] animate-bounce z-0" style={{ animationDuration: '8s' }}></div>

      {/* Main Glass Card */}
      <div className="relative z-10 bg-white/60 backdrop-blur-xl border border-white/60 p-8 sm:p-14 rounded-3xl shadow-xl max-w-4xl w-full flex flex-col items-center text-center overflow-hidden group ring-1 ring-white/50">
        
        {/* Decorative Shine Effect */}
        <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 group-hover:animate-[shine_1.5s_ease-in-out_infinite] pointer-events-none"></div>

        {/* Hero Icons */}
        <div className="flex gap-6 mb-8 animate-[float_6s_ease-in-out_infinite]">
            <div className="bg-white p-4 rounded-2xl border border-white/50 shadow-md backdrop-blur-sm transform -rotate-6 transition hover:rotate-0 hover:scale-110 duration-300 cursor-default">
                <span className="text-6xl drop-shadow-sm">🦊</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-white/50 shadow-md backdrop-blur-sm transform translate-y-[-10px] transition hover:scale-110 duration-300 cursor-default">
                <span className="text-6xl drop-shadow-sm">🌿</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-white/50 shadow-md backdrop-blur-sm transform rotate-6 transition hover:rotate-0 hover:scale-110 duration-300 cursor-default">
                <span className="text-6xl drop-shadow-sm">🐇</span>
            </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 drop-shadow-sm">
          ECOSYSTEM<br/>SIMULATOR
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mb-10 font-medium leading-relaxed">
          자연의 섭리를 경험해보세요.<br/>
          <span className="text-emerald-700 font-bold">생산자</span>, <span className="text-emerald-700 font-bold">소비자</span>, <span className="text-emerald-700 font-bold">분해자</span>의 완벽한 균형을 찾아<br/>
          지속 가능한 세상을 설계하는 것은 당신의 몫입니다.
        </p>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="relative group px-12 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-xl sm:text-2xl text-white shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/60 transform transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden ring-1 ring-white/30"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
          <span className="relative flex items-center gap-3">
            시뮬레이션 시작하기
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>

        {/* Footer Note */}
        <p className="mt-8 text-sm text-slate-400 uppercase tracking-widest font-bold">
          Interactive Web Experience
        </p>
      </div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-200%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
      `}</style>
    </div>
  );
};

export default IntroScreen;