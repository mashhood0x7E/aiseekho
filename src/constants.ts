/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Point, Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = { x: 0, y: -1 };
export const GAME_SPEED = 100;

export const DEMO_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'CyberAI',
    url: 'https://cdn.pixabay.com/audio/2023/05/08/audio_3b567d2e8b.mp3', // Synthwave style
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'Synthetic Mind',
    url: 'https://cdn.pixabay.com/audio/2022/11/22/audio_19f39df317.mp3', // Electronic pulse
  },
  {
    id: '3',
    title: 'Midnight Code',
    artist: 'The Architect',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a1b6a1.mp3', // Ambient electronic
  },
];
