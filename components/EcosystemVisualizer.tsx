
import React, { useMemo } from 'react';
import type { OrganismType, SimulationEvent } from '../types';
import { ORGANISM_CONFIGS } from '../constants';

interface EcosystemVisualizerProps {
  populations: Record<OrganismType, number>;
  currentEvent: SimulationEvent | null;
}

const VISUALIZATION_SCALE = 4;
const MAX_ICONS_PER_TYPE = 40; // Reduced slightly to prevent overcrowding

interface OrganismIconProps {
  icon: React.ReactNode;
  position: { top: string; left: string; };
  delay: string;
  isFlying?: boolean;
}

const OrganismIcon: React.FC<OrganismIconProps> = ({ icon, position, delay, isFlying }) => (
  <div
    className={`absolute z-10 transition-all duration-500 ${isFlying ? 'animate-pulse' : 'animate-bounce'}`}
    style={{
      top: position.top,
      left: position.left,
      animationDuration: isFlying ? '2s' : '3s',
      animationDelay: delay,
      transform: `scale(${0.8 + Math.random() * 0.4})`,
    }}
  >
    {icon}
  </div>
);

const EcosystemVisualizer: React.FC<EcosystemVisualizerProps> = ({ populations, currentEvent }) => {
  const organismPositions = useMemo(() => {
    const positions: Record<OrganismType, { top: string; left: string; }[]> = {
      producer: [],
      primary: [],
      secondary: [],
      decomposer: [],
    };

    // FIX: Adjusted zones to ensure animals are on the ground (50%+) not in the sky (0-50%)
    const zoneConfig = {
      producer:   { topMin: 60, topMax: 90, leftMin: 5, leftMax: 95 },   // Grass on hills
      primary:    { topMin: 65, topMax: 92, leftMin: 10, leftMax: 90 },  // Rabbits on ground
      secondary:  { topMin: 62, topMax: 88, leftMin: 15, leftMax: 85 },  // Foxes on ground
      decomposer: { topMin: 85, topMax: 98, leftMin: 5, leftMax: 95 },   // Mushrooms at bottom
    };

    for (const config of ORGANISM_CONFIGS) {
      const type = config.id;
      const count = Math.min(
        Math.floor(populations[type] / VISUALIZATION_SCALE),
        MAX_ICONS_PER_TYPE
      );
      const zone = zoneConfig[type];

      for (let i = 0; i < count; i++) {
        positions[type].push({
          top: `${zone.topMin + Math.random() * (zone.topMax - zone.topMin)}%`,
          left: `${zone.leftMin + Math.random() * (zone.leftMax - zone.leftMin)}%`,
        });
      }
    }
    return positions;
  }, [populations]);

  // Determine overlay style based on event
  let overlayClass = "";
  if (currentEvent?.type === 'drought') overlayClass = "bg-orange-500/30 mix-blend-color-burn";
  if (currentEvent?.type === 'typhoon') overlayClass = "bg-slate-800/50 mix-blend-hard-light backdrop-blur-[1px]";
  if (currentEvent?.type === 'invasive') overlayClass = "bg-purple-500/30 mix-blend-hue";
  if (currentEvent?.type === 'flood') overlayClass = "bg-blue-800/50 mix-blend-multiply";

  return (
    <div className="w-full h-full bg-sky-400 rounded-2xl shadow-inner relative overflow-hidden border-4 border-white/50 transition-all duration-1000 min-h-[300px]">
      {/* Sky */}
      <div className={`absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 transition-colors duration-1000 ${currentEvent ? 'grayscale-[50%]' : ''}`}></div>
      
      {/* Clouds (Decorative) */}
      <div className="absolute top-10 left-10 text-6xl opacity-80 animate-float" style={{ animationDuration: '10s' }}>☁️</div>
      <div className="absolute top-20 right-20 text-5xl opacity-60 animate-float" style={{ animationDuration: '15s' }}>☁️</div>

      {/* Sun */}
      <div className={`absolute top-[5%] right-[5%] w-16 h-16 sm:w-20 sm:h-20 bg-yellow-300 rounded-full shadow-[0_0_40px_rgba(253,224,71,0.6)] opacity-90 transition-all duration-1000 ${currentEvent?.type === 'drought' ? 'scale-150 bg-orange-400 shadow-[0_0_80px_rgba(251,146,60,0.8)]' : ''} ${currentEvent?.type === 'typhoon' || currentEvent?.type === 'flood' ? 'opacity-20' : ''}`}></div>
      
      {/* Ground / Hills */}
      <div 
        className="absolute bottom-0 left-[-20%] w-[140%] h-[55%] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-[100%] shadow-lg transition-colors duration-1000"
        style={{ 
          filter: currentEvent?.type === 'drought' ? 'sepia(0.9) saturate(0.5)' : 'none'
        }}
      ></div>
      <div 
        className="absolute bottom-[-10%] right-[-20%] w-[140%] h-[50%] bg-gradient-to-t from-green-700 to-green-500 rounded-t-[100%] shadow-lg transition-colors duration-1000"
        style={{ 
           filter: currentEvent?.type === 'drought' ? 'sepia(0.8) saturate(0.6)' : 'none'
        }}
      ></div>
      
      {/* Organisms */}
      {ORGANISM_CONFIGS.map(config => (
        <React.Fragment key={config.id}>
          {organismPositions[config.id].map((pos, index) => (
            <OrganismIcon 
              key={`${config.id}-${index}`} 
              icon={config.icon} 
              position={pos}
              delay={`${Math.random() * 2}s`}
            />
          ))}
        </React.Fragment>
      ))}

      {/* Rain Effect for Typhoon/Flood */}
      {(currentEvent?.type === 'typhoon' || currentEvent?.type === 'flood') && (
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20 animate-pulse"></div>
      )}

      {/* Weather Event Overlay */}
      <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${overlayClass}`}></div>
    </div>
  );
};

export default EcosystemVisualizer;
