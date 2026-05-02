'use client';

import type { Cast } from '@/types/game';
import { X, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface CastBubbleProps {
  cast: Cast;
  index?: number;
  isDraggable: boolean;
  onRemove?: () => void;
}

export function CastBubble({ cast, index, isDraggable, onRemove }: CastBubbleProps): JSX.Element {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`
        bg-gradient-to-r from-purple-800/60 to-indigo-800/60 backdrop-blur-md
        border border-purple-400/40 rounded-xl p-4
        shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]
        transition-all duration-200
        ${isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer hover:bg-purple-800/70'}
      `}
    >
      <div className="flex items-start gap-3">
        {isDraggable && (
          <div className="text-purple-400 mt-1">
            <GripVertical className="h-5 w-5" />
          </div>
        )}
        
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg shadow-lg">
            {cast.avatar}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {index !== undefined && (
              <span className="text-xs font-bold text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded">
                #{index}
              </span>
            )}
            <span className="font-semibold text-purple-200">{cast.author}</span>
          </div>
          <p className="text-white text-sm leading-relaxed">{cast.content}</p>
        </div>

        {onRemove && (
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-purple-400 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
