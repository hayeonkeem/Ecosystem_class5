import React from 'react';
import type { OrganismConfig } from '../types';

interface OrganismControlProps {
  config: OrganismConfig;
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}

const OrganismControl: React.FC<OrganismControlProps> = ({ config, value, onChange, disabled }) => {
  return (
    <div className={`transition-opacity duration-300 ${disabled ? 'opacity-50 grayscale' : 'opacity-100'}`}>
      <div className="flex items-end justify-between mb-2">
        <label htmlFor={config.id} className="flex items-center gap-3 cursor-pointer group">
          <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 group-hover:shadow-md transition-all duration-200">
             {config.icon}
          </div>
          <div>
            <span className="font-bold text-slate-800 text-lg tracking-tight group-hover:text-emerald-700 transition-colors">{config.name}</span>
            <p className="text-xs text-slate-500 font-medium">{config.description}</p>
          </div>
        </label>
        <span className="font-mono font-bold text-xl text-emerald-600 w-12 text-right">{value}</span>
      </div>
      <div className="relative h-6 flex items-center">
        {/* Track Background */}
        <div className="absolute w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
             <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-80" 
                style={{ width: `${(value / config.max) * 100}%` }}
             ></div>
        </div>
        
        <input
          type="range"
          id={config.id}
          min={config.min}
          max={config.max}
          step={config.step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full h-full opacity-0 absolute cursor-pointer z-10" 
        />
        {/* Visual Input */}
         <input
          type="range"
          id={config.id}
          min={config.min}
          max={config.max}
          step={config.step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full absolute z-20"
        />
      </div>
    </div>
  );
};

export default OrganismControl;