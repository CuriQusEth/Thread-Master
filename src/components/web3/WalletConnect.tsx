'use client';

import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Wallet, LogOut, Copy, Check, ChevronDown, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * Modern Wallet Connection Component
 * 
 * Features:
 * - Clean wallet selection UI
 * - Network indicator
 * - Address copy functionality
 * - Connection status
 * - Support for EOA and Smart Wallets (ERC-4337)
 */
export function WalletConnect() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { address, isConnected, connector } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  // Get current network name
  const getNetworkName = () => {
    switch (chainId) {
      case base.id:
        return 'Base Mainnet';
      case baseSepolia.id:
        return 'Base Sepolia';
      default:
        return 'Unknown Network';
    }
  };

  // Get network color
  const getNetworkColor = () => {
    switch (chainId) {
      case base.id:
        return 'bg-blue-500';
      case baseSepolia.id:
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = (connector: typeof connectors[number]) => {
    try {
      connect({ connector });
      setIsOpen(false);
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info('Wallet disconnected');
  };

  // Shorten address for display
  const shortAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isConnected ? (
        // Not Connected State
        <DialogTrigger asChild>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 transition-all duration-300"
            size="lg"
          >
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet
          </Button>
        </DialogTrigger>
      ) : (
        // Connected State
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="border-purple-500/30 bg-purple-900/20 hover:bg-purple-900/40 text-purple-100"
              size="sm"
            >
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  getNetworkColor()
                )} />
                <span className="font-mono">{shortAddress}</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-64 bg-purple-950/95 border-purple-500/30 backdrop-blur-sm"
          >
            {/* Network Info */}
            <div className="px-3 py-2 border-b border-purple-500/20">
              <div className="flex items-center gap-2 mb-1">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  getNetworkColor()
                )} />
                <span className="text-xs text-purple-300 font-medium">
                  {getNetworkName()}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Shield className="h-3 w-3" />
                <span>ERC-4337 Ready</span>
              </div>
            </div>

            {/* Address */}
            <div className="px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Address</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyAddress}
                  className="h-6 px-2 text-xs text-purple-300 hover:text-purple-100"
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <p className="font-mono text-sm text-purple-100 mt-1">
                {shortAddress}
              </p>
            </div>

            {/* Connector Name */}
            {connector && (
              <div className="px-3 py-2 border-t border-purple-500/20">
                <span className="text-xs text-gray-400">Connected via</span>
                <p className="text-sm text-purple-200">{connector.name}</p>
              </div>
            )}

            {/* Disconnect */}
            <div className="px-3 py-2 border-t border-purple-500/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDisconnect}
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Connection Dialog */}
      <DialogContent className="bg-purple-950/95 border-purple-500/30 backdrop-blur-sm max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-purple-100 flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription className="text-purple-300">
            Choose a wallet to connect to Thread Master on Base
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {connectors.map((conn) => (
            <Button
              key={conn.id}
              onClick={() => handleConnect(conn)}
              variant="outline"
              className="justify-start h-14 border-purple-500/30 hover:bg-purple-900/40 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-purple-400" />
                <div className="text-left">
                  <p className="font-medium text-purple-100">{conn.name}</p>
                  <p className="text-xs text-purple-400">
                    {conn.id.includes('coinbase') 
                      ? 'Smart Wallet & EOA supported' 
                      : 'EOA Wallet'}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Security Notice */}
        <div className="mt-4 p-3 rounded-lg bg-green-950/20 border border-green-500/20">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-green-400 mt-0.5" />
            <div className="text-xs text-green-300">
              <p className="font-medium">Secure Connection</p>
              <p className="text-green-400/80 mt-0.5">
                Your wallet connects securely. Never share your private keys or seed phrase.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
