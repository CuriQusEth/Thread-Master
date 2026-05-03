'use client';

import React from 'react';
import { Loader2, CheckCircle2, XCircle, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Transaction Status Component
 * 
 * Displays transaction state with appropriate styling and animations
 */
export type TransactionState = 'pending' | 'confirming' | 'success' | 'error';

interface TransactionStatusProps {
  state: TransactionState;
  message?: string;
  txHash?: string;
  onRetry?: () => void;
}

export function TransactionStatus({
  state,
  message,
  txHash,
  onRetry,
}: TransactionStatusProps) {
  const getStatusConfig = () => {
    switch (state) {
      case 'pending':
        return {
          icon: Loader2,
          iconClass: 'animate-spin text-yellow-400',
          bgClass: 'bg-yellow-950/20',
          borderClass: 'border-yellow-500/30',
          textClass: 'text-yellow-300',
          label: 'Pending',
        };
      case 'confirming':
        return {
          icon: Activity,
          iconClass: 'animate-pulse text-blue-400',
          bgClass: 'bg-blue-950/20',
          borderClass: 'border-blue-500/30',
          textClass: 'text-blue-300',
          label: 'Confirming',
        };
      case 'success':
        return {
          icon: CheckCircle2,
          iconClass: 'text-green-400',
          bgClass: 'bg-green-950/20',
          borderClass: 'border-green-500/30',
          textClass: 'text-green-300',
          label: 'Success',
        };
      case 'error':
        return {
          icon: XCircle,
          iconClass: 'text-red-400',
          bgClass: 'bg-red-950/20',
          borderClass: 'border-red-500/30',
          textClass: 'text-red-300',
          label: 'Failed',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-all duration-300",
        config.bgClass,
        config.borderClass
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.iconClass)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                config.borderClass,
                config.textClass
              )}
            >
              {config.label}
            </Badge>
          </div>
          
          {message && (
            <p className={cn("text-sm", config.textClass)}>{message}</p>
          )}
          
          {txHash && (
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-400 hover:text-purple-300 underline mt-1 block"
            >
              View on Basescan →
            </a>
          )}
          
          {state === 'error' && onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
