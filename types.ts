
// FIX: Import `ReactNode` to resolve the 'Cannot find namespace JSX' error.
import type { ReactNode } from 'react';

export type OrganismType = 'producer' | 'primary' | 'secondary' | 'decomposer';

export type GameStatus = 'playing' | 'success' | 'failure';

export type GamePhase = 'intro' | 'mode-select' | 'configuring' | 'simulating' | 'result';

export type GameMode = 'normal' | 'hard';

export type EventType = 'drought' | 'typhoon' | 'invasive' | 'flood';

export interface SimulationEvent {
  type: EventType;
  name: string;
  description: string;
}

export interface OrganismConfig {
  id: OrganismType;
  name: string;
  description: string;
  icon: ReactNode;
  min: number;
  max: number;
  step: number;
}
