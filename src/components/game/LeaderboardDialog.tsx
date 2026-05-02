'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trophy, Medal, Award } from 'lucide-react';
import type { LeaderboardEntry } from '@/types/game';

interface LeaderboardDialogProps {
  open: boolean;
  onClose: () => void;
}

export function LeaderboardDialog({ open, onClose }: LeaderboardDialogProps): JSX.Element {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (open) {
      try {
        const data = localStorage.getItem('threadMasterLeaderboard');
        if (data) {
          const parsed = JSON.parse(data) as LeaderboardEntry[];
          setEntries(parsed);
        }
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      }
    }
  }, [open]);

  const getRankIcon = (index: number): JSX.Element => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <div className="h-6 w-6 flex items-center justify-center text-purple-400 font-bold">{index + 1}</div>;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-purple-950 to-indigo-950 border-purple-500/50 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Trophy className="h-7 w-7 text-yellow-400" />
            Leaderboard
          </DialogTitle>
          <DialogDescription className="text-purple-300">
            Top 10 Thread Masters
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[400px] overflow-y-auto py-4">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-purple-400">
              <p className="text-sm">No scores yet. Be the first!</p>
            </div>
          ) : (
            entries.map((entry: LeaderboardEntry, index: number) => (
              <div
                key={index}
                className={`
                  flex items-center gap-4 p-4 rounded-lg
                  ${index < 3
                    ? 'bg-gradient-to-r from-purple-800/60 to-pink-800/60 border border-purple-400/40'
                    : 'bg-purple-900/30 border border-purple-500/20'
                  }
                  transition-all hover:scale-[1.02]
                `}
              >
                <div className="flex-shrink-0">
                  {getRankIcon(index)}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-white">{entry.score}</div>
                  <div className="text-xs text-purple-300">
                    {formatDate(entry.date)}
                  </div>
                </div>
                {index < 3 && (
                  <div className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
