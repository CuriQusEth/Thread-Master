'use client';

import { Reorder } from 'framer-motion';
import { CastBubble } from './CastBubble';
import { Button } from '@/components/ui/button';
import type { Cast } from '@/types/game';
import { CheckCircle2, GripVertical } from 'lucide-react';

interface GameBoardProps {
  scrambledCasts: Cast[];
  playerOrder: Cast[];
  onReorder: (newOrder: Cast[]) => void;
  onSubmit: () => void;
  canSubmit: boolean;
}

export function GameBoard({
  scrambledCasts,
  playerOrder,
  onReorder,
  onSubmit,
  canSubmit,
}: GameBoardProps): JSX.Element {
  const availableCasts = scrambledCasts.filter(
    (cast: Cast) => !playerOrder.some((p: Cast) => p.id === cast.id)
  );

  const handleDragFromScrambled = (cast: Cast): void => {
    onReorder([...playerOrder, cast]);
  };

  return (
    <div className="space-y-6 mt-8">
      {/* Player's ordered thread */}
      <div className="bg-purple-900/40 backdrop-blur-sm border-2 border-purple-500/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.3)] min-h-[320px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
            <GripVertical className="h-5 w-5" />
            Your Thread Order
          </h2>
          <span className="text-sm text-purple-400">
            {playerOrder.length} / {scrambledCasts.length} casts
          </span>
        </div>

        {playerOrder.length === 0 ? (
          <div className="text-center py-12 text-purple-400/60">
            <p className="text-sm">Drag casts here to build your thread</p>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={playerOrder}
            onReorder={onReorder}
            className="space-y-3"
          >
            {playerOrder.map((cast: Cast, index: number) => (
              <Reorder.Item key={cast.id} value={cast}>
                <CastBubble
                  cast={cast}
                  index={index + 1}
                  isDraggable={true}
                  onRemove={() => {
                    onReorder(playerOrder.filter((c: Cast) => c.id !== cast.id));
                  }}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}

        {canSubmit && (
          <Button
            onClick={onSubmit}
            className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg shadow-[0_0_20px_rgba(34,197,94,0.4)]"
            size="lg"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Submit Thread
          </Button>
        )}
      </div>

      {/* Available scrambled casts */}
      <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-4">
          Available Casts
        </h3>
        <div className="space-y-3">
          {availableCasts.map((cast: Cast) => (
            <div
              key={cast.id}
              onClick={() => handleDragFromScrambled(cast)}
              className="cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <CastBubble cast={cast} isDraggable={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
