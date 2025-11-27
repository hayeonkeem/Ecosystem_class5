import React from 'react';
import { ORGANISM_CONFIGS, GOLDEN_RATIO } from '../constants';
import type { OrganismType, GamePhase } from '../types';

interface PopulationGraphProps {
  gamePhase: GamePhase;
  populations: Record<OrganismType, number>;
  populationHistory?: Record<OrganismType, number>[];
  showTarget?: boolean;
}

const LINE_COLORS: Record<OrganismType, string> = {
  producer: '#10b981', // emerald-500 (Darker for light bg)
  primary: '#eab308', // yellow-500
  secondary: '#ef4444', // red-500
  decomposer: '#8b5cf6', // violet-500
};

const MAX_Y_AXIS = 200;

const Legend: React.FC = () => (
    <div className="flex justify-center gap-4 mb-2 text-xs">
        {ORGANISM_CONFIGS.map(config => (
            <div key={config.id} className="flex items-center gap-1.5">
                <div 
                    className="w-2.5 h-2.5 rounded-full shadow-sm border border-black/5" 
                    style={{ backgroundColor: LINE_COLORS[config.id] }}
                ></div>
                <span className="text-slate-500 font-bold">{config.name}</span>
            </div>
        ))}
    </div>
);

const BarChart: React.FC<{ populations: Record<OrganismType, number>; showTarget?: boolean }> = ({ populations, showTarget }) => (
    <div className="flex-grow flex justify-around items-end gap-4 px-2 pb-2 h-full">
    {ORGANISM_CONFIGS.map(config => {
      const value = populations[config.id];
      const target = GOLDEN_RATIO[config.id];
      
      // Clamp bar height
      const clampedValue = Math.min(value, MAX_Y_AXIS * 1.2);
      const barHeight = `${(clampedValue / MAX_Y_AXIS) * 100}%`;
      const targetLineOffset = `${100 - (target / MAX_Y_AXIS) * 100}%`;

      return (
        <div key={config.id} className="h-full w-full flex flex-col items-center justify-end relative group">
           {/* Tooltip on hover */}
           <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
             {value} (목표: {target})
           </div>

           <div className="w-full h-full flex items-end justify-center relative bg-white/40 rounded-t-lg ring-1 ring-slate-200">
             <div
               className="w-4/5 max-w-[40px] rounded-t-lg relative graph-bar shadow-sm"
               style={{ 
                 height: barHeight,
                 backgroundColor: LINE_COLORS[config.id]
                }}
             >
                {/* Glossy highlight */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/40 to-transparent rounded-t-lg"></div>
             </div>
             {showTarget && (
                <div 
                    className="absolute w-full border-t-2 border-dashed border-slate-400 z-10"
                    style={{ top: targetLineOffset }}
                ></div>
             )}
           </div>
        </div>
      );
    })}
  </div>
);

const LineChart: React.FC<{ history: Record<OrganismType, number>[] }> = ({ history }) => {
    if (!history || history.length < 2) return <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm animate-pulse">데이터 수집 중...</div>;

    const svgWidth = 400;
    const svgHeight = 150;
    const padding = 10;

    // Grid lines
    const gridLines = [];
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i / 5) * (svgHeight - 2 * padding);
        gridLines.push(
            <line 
                key={i} 
                x1={0} 
                y1={y} 
                x2={svgWidth} 
                y2={y} 
                stroke="rgba(0,0,0,0.05)" 
                strokeWidth="1" 
                strokeDasharray="4 4"
            />
        );
    }

    const paths = (Object.keys(history[0]) as OrganismType[]).map(organism => {
        const points = history.map((snapshot, i) => {
            const x = (i / (history.length - 1)) * svgWidth;
            const rawY = snapshot[organism];
            const clampedY = Math.min(rawY, 250); 
            const y = svgHeight - padding - (clampedY / 250) * (svgHeight - 2 * padding);
            return `${x},${y}`;
        }).join(' ');
        
        return (
            <React.Fragment key={organism}>
                <polyline 
                    points={points} 
                    fill="none" 
                    stroke={LINE_COLORS[organism]} 
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-sm"
                    opacity="0.9"
                />
            </React.Fragment>
        );
    });

    return (
        <div className="w-full h-full flex justify-center items-center bg-white/50 rounded-lg overflow-hidden relative border border-slate-100">
             <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none" className="w-full h-full">
                {gridLines}
                {paths}
            </svg>
        </div>
    );
}


const PopulationGraph: React.FC<PopulationGraphProps> = ({ gamePhase, populations, populationHistory = [], showTarget = false }) => {
  const isLineChartMode = gamePhase === 'simulating' || gamePhase === 'result';

  return (
    <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/60 h-full flex flex-col justify-between shadow-inner ring-1 ring-slate-100">
      <div className="flex justify-between items-center mb-2 px-1">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            {gamePhase === 'configuring' ? "📈 실시간 개체수" : "📊 생태계 변화 추이"}
        </h3>
        {(gamePhase === 'simulating' || gamePhase === 'result') && <Legend />}
      </div>
      
      {isLineChartMode ? (
        <LineChart history={populationHistory} />
      ) : (
        <BarChart populations={populations} showTarget={showTarget} />
      )}
    </div>
  );
};

export default PopulationGraph;