'use client';

import { Heart, Trophy, Zap, Clock } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  combo: number;
  lives: number;
  timeRemaining: number;
  level: number;
}

export function ScoreDisplay({
  score,
  combo,
  lives,
  timeRemaining,
  level,
}: ScoreDisplayProps): JSX.Element {
  const getTimeColor = (): string => {
    if (timeRemaining > 30) return 'text-green-400';
    if (timeRemaining > 15) return 'text-yellow-400';
    return 'text-red-400 animate-pulse';
  };

  return (
    <div className="bg-purple-900/40 backdrop-blur-sm border border-purple-500/50 rounded-2xl p-4 mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Score */}
        <div className="flex items-center gap-3 bg-purple-800/40 rounded-xl p-3">
          <Trophy className="h-6 w-6 text-yellow-400" />
          <div>
            <div className="text-xs text-purple-300">Score</div>
            <div className="text-xl font-bold text-white">{score}</div>
          </div>
        </div>

        {/* Combo */}
        <div className="flex items-center gap-3 bg-purple-800/40 rounded-xl p-3">
          <Zap className={`h-6 w-6 ${combo > 0 ? 'text-orange-400 animate-pulse' : 'text-purple-400'}`} />
          <div>
            <div className="text-xs text-purple-300">Combo</div>
            <div className={`text-xl font-bold ${combo > 0 ? 'text-orange-400' : 'text-white'}`}>
              {combo > 0 ? `x${combo}` : '-'}
            </div>
          </div>
        </div>

        {/* Lives */}
        <div className="flex items-center gap-3 bg-purple-800/40 rounded-xl p-3">
          <Heart className="h-6 w-6 text-red-400" />
          <div>
            <div className="text-xs text-purple-300">Lives</div>
            <div className="text-xl font-bold text-white flex gap-1">
              {Array.from({ length: lives }).map((_: unknown, i: number) => (
                <span key={i}>💜</span>
              ))}
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3 bg-purple-800/40 rounded-xl p-3">
          <Clock className={`h-6 w-6 ${getTimeColor()}`} />
          <div>
            <div className="text-xs text-purple-300">Time</div>
            <div className={`text-xl font-bold ${getTimeColor()}`}>{timeRemaining}s</div>
          </div>
        </div>

        {/* Level */}
        <div className="flex items-center gap-3 bg-purple-800/40 rounded-xl p-3">
          <div className="h-6 w-6 text-purple-400 font-bold flex items-center justify-center">
            🧵
          </div>
          <div>
            <div className="text-xs text-purple-300">Level</div>
            <div className="text-xl font-bold text-white">{level}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
