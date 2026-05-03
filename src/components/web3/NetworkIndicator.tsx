'use client';

import React from 'react';
import { useChainId } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Network Status Indicator Component
 * 
 * Shows current network connection status with visual feedback
 */
export function NetworkIndicator() {
  const chainId = useChainId();

  const getNetworkInfo = () => {
    switch (chainId) {
      case base.id:
        return {
          name: 'Base Mainnet',
          color: 'bg-blue-500',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/30',
          bgColor: 'bg-blue-950/20',
          icon: CheckCircle2,
        };
      case baseSepolia.id:
        return {
          name: 'Base Sepolia',
          color: 'bg-purple-500',
          textColor: 'text-purple-400',
          borderColor: 'border-purple-500/30',
          bgColor: 'bg-purple-950/20',
          icon: Activity,
        };
      default:
        return {
          name: chainId ? 'Unknown Network' : 'Disconnected',
          color: 'bg-gray-500',
          textColor: 'text-gray-400',
          borderColor: 'border-gray-500/30',
          bgColor: 'bg-gray-950/20',
          icon: AlertCircle,
        };
    }
  };

  const network = getNetworkInfo();
  const Icon = network.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 transition-all",
        network.borderColor,
        network.bgColor
      )}
    >
      <div className={cn("w-2 h-2 rounded-full animate-pulse", network.color)} />
      <Icon className={cn("h-3.5 w-3.5", network.textColor)} />
      <span className={cn("text-xs font-medium", network.textColor)}>
        {network.name}
      </span>
    </Badge>
  );
}
