
import React from 'react';
import type { SimulationEvent } from '../types';

interface EventNotificationProps {
  event: SimulationEvent | null;
}

const EventNotification: React.FC<EventNotificationProps> = ({ event }) => {
  if (!event) return null;

  let icon = '⚠️';
  let colorClass = 'bg-red-500';

  switch (event.type) {
    case 'drought':
      icon = '☀️';
      colorClass = 'bg-orange-500';
      break;
    case 'typhoon':
      icon = '🌪️';
      colorClass = 'bg-slate-600';
      break;
    case 'invasive':
      icon = '🐸';
      colorClass = 'bg-purple-600';
      break;
    case 'flood':
      icon = '🌊';
      colorClass = 'bg-blue-600';
      break;
  }

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce w-3/4 max-w-md">
      <div className={`${colorClass} text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border-4 border-white/30`}>
        <span className="text-4xl filter drop-shadow-md">{icon}</span>
        <div className="text-left flex-1">
          <h3 className="font-black text-xl leading-none mb-1">{event.name}</h3>
          <p className="text-sm font-medium text-white/90 leading-tight">{event.description}</p>
        </div>
      </div>
    </div>
  );
};

export default EventNotification;
