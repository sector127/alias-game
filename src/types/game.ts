export type GameState =
  | 'setup'
  | 'ready'
  | 'countdown'
  | 'playing'
  | 'paused'
  | 'turnEnd'
  | 'gameEnd';

export type ControlMode = 'both' | 'swipe' | 'buttons';

export interface PlayedWord {
  id: string;
  word: string;
  isCorrect: boolean;
}

export interface Team {
  id: string;
  name: string;
  score: number;
  roundScore: number;
  totalCorrect: number;
  totalSkipped: number;
  colorIndex: number;
}

export interface TeamColor {
  bg: string;
  border: string;
  light: string;
  badge: string;
  accent: string;
}
