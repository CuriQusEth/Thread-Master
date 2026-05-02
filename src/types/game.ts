export interface Cast {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp?: string;
}

export interface ThreadPuzzle {
  id: string;
  difficulty: number;
  theme: 'tech' | 'meme' | 'chaos' | 'debate' | 'launch';
  casts: Cast[];
}

export interface GameState {
  currentLevel: number;
  score: number;
  lives: number;
  combo: number;
  timeRemaining: number;
  isPlaying: boolean;
  showResults: boolean;
  showLeaderboard: boolean;
}

export interface LeaderboardEntry {
  score: number;
  date: string;
}
