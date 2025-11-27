
import React from 'react';
import { OrganismConfig } from './types';

export const ORGANISM_CONFIGS: OrganismConfig[] = [
  {
    id: 'producer',
    name: '생산자',
    description: '스스로 양분을 만드는 식물',
    icon: <span className="text-4xl" role="img" aria-label="Producer">🌱</span>,
    min: 0,
    max: 200,
    step: 5,
  },
  {
    id: 'primary',
    name: '1차 소비자',
    description: '생산자를 먹는 초식동물',
    icon: <span className="text-4xl" role="img" aria-label="Primary Consumer">🐇</span>,
    min: 0,
    max: 100,
    step: 1,
  },
  {
    id: 'secondary',
    name: '2차 소비자',
    description: '1차 소비자를 먹는 육식동물',
    icon: <span className="text-4xl" role="img" aria-label="Secondary Consumer">🦊</span>,
    min: 0,
    max: 50,
    step: 1,
  },
  {
    id: 'decomposer',
    name: '분해자',
    description: '죽은 생물을 분해하는 미생물',
    icon: <span className="text-4xl" role="img" aria-label="Decomposer">🍄</span>,
    min: 0,
    max: 100,
    step: 5,
  },
];

export const GOLDEN_RATIO = {
  producer: 100,
  primary: 50,
  secondary: 10,
  decomposer: 25,
};

export const SUCCESS_TOLERANCE = 15; // Total difference allowed from golden ratio sum