'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Trophy, Heart, Zap } from 'lucide-react';

interface ResultsDialogProps {
  open: boolean;
  onContinue: () => void;
  isCorrect: boolean;
  score: number;
  combo: number;
  lives: number;
  level: number;
}

export function ResultsDialog({
  open,
  onContinue,
  isCorrect,
  score,
  combo,
  lives,
  level,
}: ResultsDialogProps): JSX.Element {
  const isGameOver = lives <= 0;

  return (
    <Dialog open={open} onOpenChange={onContinue}>
      <DialogContent className="bg-gradient-to-br from-purple-950 to-indigo-950 border-purple-500/50 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            {isGameOver ? (
              <>
                <Trophy className="h-7 w-7 text-yellow-400" />
                Game Over!
              </>
            ) : isCorrect ? (
              <>
                <CheckCircle2 className="h-7 w-7 text-green-400" />
                Perfect Thread! 🎉
              </>
            ) : (
              <>
                <XCircle className="h-7 w-7 text-red-400" />
                Not Quite Right
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-purple-300">
            {isGameOver
              ? 'Thanks for playing Thread Master!'
              : isCorrect
              ? 'You reconstructed the thread perfectly!'
              : 'The thread order wasn\'t correct. Try again!'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-900/50 rounded-lg p-4 text-center">
              <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{score}</div>
              <div className="text-xs text-purple-300">Total Score</div>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4 text-center">
              <Zap className="h-6 w-6 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{combo}</div>
              <div className="text-xs text-purple-300">Combo</div>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4 text-center">
              <Heart className="h-6 w-6 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">{lives}</div>
              <div className="text-xs text-purple-300">Lives Left</div>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🧵</div>
              <div className="text-2xl font-bold">{level}</div>
              <div className="text-xs text-purple-300">Level</div>
            </div>
          </div>

          {isCorrect && !isGameOver && combo > 0 && (
            <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border border-orange-500/50 rounded-lg p-3 text-center">
              <div className="text-sm font-semibold text-orange-300">
                🔥 Combo Multiplier: x{combo}
              </div>
              <div className="text-xs text-orange-400 mt-1">
                Keep going to increase your score!
              </div>
            </div>
          )}

          {isGameOver && (
            <div className="bg-purple-900/50 border border-purple-500/50 rounded-lg p-4 text-center">
              <p className="text-sm text-purple-300 mb-2">
                Your final score has been saved to the leaderboard!
              </p>
              <p className="text-xs text-purple-400">
                Share your score on Farcaster and challenge your friends!
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            {isGameOver ? 'Play Again' : 'Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
