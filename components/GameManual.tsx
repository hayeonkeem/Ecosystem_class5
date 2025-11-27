
import React from 'react';

interface GameManualProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameManual: React.FC<GameManualProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            📘 생태계 생존 매뉴얼
          </h2>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
          
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-emerald-100 pb-2">
              🏆 승리 조건 (황금 비율)
            </h3>
            <p className="text-gray-600 leading-relaxed bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              생태계가 유지되려면 <strong>피라미드 구조</strong>가 필요합니다.<br/>
              <span className="text-emerald-700 font-bold">생산자(풀)</span>가 가장 많아야 하고, 상위 포식자로 갈수록 개체 수가 줄어들어야 합니다.<br/>
              적절한 비율을 찾아보세요!
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-red-100 pb-2">
              🚨 기후 위기 재난 (하드 모드)
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">☀️</span>
                  <h4 className="font-bold text-orange-800">극심한 가뭄</h4>
                </div>
                <p className="text-sm text-gray-700">
                  비가 오지 않아 <span className="font-bold text-green-600">생산자(풀)</span>가 말라 죽습니다.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🌊</span>
                  <h4 className="font-bold text-blue-800">대홍수</h4>
                </div>
                <p className="text-sm text-gray-700">
                  물이 범람하여 <span className="font-bold text-green-600">생산자</span>와 <span className="font-bold text-purple-600">분해자</span>가 휩쓸려갑니다.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🌪️</span>
                  <h4 className="font-bold text-slate-800">강력한 태풍</h4>
                </div>
                <p className="text-sm text-gray-700">
                  생태계 전체에 큰 피해를 줍니다. 모든 생물의 개체 수가 감소합니다.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🐸</span>
                  <h4 className="font-bold text-purple-800">외래종 유입</h4>
                </div>
                <p className="text-sm text-gray-700">
                  생태계를 교란시킵니다. <span className="font-bold text-yellow-600">소비자</span>들의 개체 수가 변동됩니다.
                </p>
              </div>
            </div>
          </section>

           <section>
            <h3 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-100 pb-2">
              💡 팁
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 bg-gray-50 p-4 rounded-xl">
              <li>실패하더라도 포기하지 마세요! "다시 조정하기"로 값을 조금씩 바꿔보세요.</li>
              <li>하드 모드에서는 재난 후 회복할 수 있도록 <strong>생산자</strong>를 넉넉히 두는 것이 좋습니다.</li>
            </ul>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-center">
          <button 
            onClick={onClose}
            className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameManual;
