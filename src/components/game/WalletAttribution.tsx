'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useERC8021, useMultiAttribution } from '@/hooks/useERC8021';
import { SchemaId } from '@/lib/erc8021';
import { Wallet, Copy, Check, Award, ShieldCheck } from 'lucide-react';
import { ATTRIBUTION_CONFIG, PUBLIC_DISPLAY, maskSensitiveData } from '@/config/attribution';

/**
 * Wallet Attribution Component
 * 
 * Demonstrates ERC-8021 integration with secure attribution tracking
 * Sensitive data is masked in production for security
 */
export function WalletAttribution() {
  const [copied, setCopied] = useState<string | null>(null);

  // Single attribution (Thread Master only) - uses internal config
  const { attributeTransaction, generateSuffix } = useERC8021();

  // Multi attribution (Thread Master + Player)
  const { attributeWithWallet } = useMultiAttribution({
    appCode: ATTRIBUTION_CONFIG.BUILDER_CODE,
    walletCode: 'player',
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Example transaction (ERC20 transfer)
  const exampleTx = '0xa9059cbb000000000000000000000000742d35cc6634c0532925a3b844bc9e7595f0615f0000000000000000000000000000000000000000000000000000000000000064';

  // Generate attributed transactions
  const appOnlyTx = attributeTransaction(exampleTx);
  const appAndWalletTx = attributeWithWallet(exampleTx);

  return (
    <div className="space-y-6">
      {/* Attribution Status Card */}
      <Card className="border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-200">
            <ShieldCheck className="h-5 w-5" />
            Attribution Status
          </CardTitle>
          <CardDescription className="text-gray-400">
            Secure transaction attribution for reward tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Display */}
          <div className="rounded-lg border border-green-500/20 bg-green-950/10 p-4">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-300">
                  ✓ Attribution Active
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  All Thread Master transactions are securely tracked for reward distribution
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Info (Masked) */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded bg-purple-950/20 p-2">
              <p className="text-gray-400">Code Registry</p>
              <p className="text-purple-300 font-mono">{PUBLIC_DISPLAY.REGISTRY_TYPE}</p>
            </div>
            <div className="rounded bg-purple-950/20 p-2">
              <p className="text-gray-400">Status</p>
              <p className="text-green-400 font-mono">{PUBLIC_DISPLAY.ATTRIBUTION_STATUS}</p>
            </div>
            <div className="rounded bg-purple-950/20 p-2">
              <p className="text-gray-400">Builder Code</p>
              <p className="text-purple-300 font-mono">{PUBLIC_DISPLAY.BUILDER_CODE_MASKED}</p>
            </div>
            <div className="rounded bg-purple-950/20 p-2">
              <p className="text-gray-400">Payout Address</p>
              <p className="text-purple-300 font-mono">{PUBLIC_DISPLAY.PAYOUT_ADDRESS_MASKED}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How Attribution Works */}
      <Card className="border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-blue-950/20">
        <CardHeader>
          <CardTitle className="text-purple-200">How Attribution Works</CardTitle>
          <CardDescription className="text-gray-400">
            Understanding transaction attribution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Example 1: App Only */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-purple-300">
                1. App Attribution
              </h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(appOnlyTx, 'app-only')}
                className="h-7 border-purple-500/20 hover:bg-purple-500/10"
              >
                {copied === 'app-only' ? (
                  <Check className="h-3 w-3 mr-1 text-green-400" />
                ) : (
                  <Copy className="h-3 w-3 mr-1" />
                )}
                <span className="text-xs">Copy</span>
              </Button>
            </div>
            <div className="rounded-lg border border-purple-500/20 bg-black/20 p-3">
              <p className="text-xs text-gray-400 mb-1">Transaction Data (Attributed)</p>
              <p className="text-xs font-mono text-purple-200 break-all">
                {appOnlyTx.slice(0, 50)}...
              </p>
              <div className="mt-2 pt-2 border-t border-purple-500/20">
                <p className="text-xs text-gray-400">
                  ✓ Attribution: <span className="text-green-400">Thread Master</span>
                </p>
                <p className="text-xs text-gray-400">Rewards tracked to app</p>
              </div>
            </div>
          </div>

          {/* Example 2: App + Player */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-purple-300">
                2. Multi-Party Attribution
              </h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(appAndWalletTx, 'app-wallet')}
                className="h-7 border-purple-500/20 hover:bg-purple-500/10"
              >
                {copied === 'app-wallet' ? (
                  <Check className="h-3 w-3 mr-1 text-green-400" />
                ) : (
                  <Copy className="h-3 w-3 mr-1" />
                )}
                <span className="text-xs">Copy</span>
              </Button>
            </div>
            <div className="rounded-lg border border-purple-500/20 bg-black/20 p-3">
              <p className="text-xs text-gray-400 mb-1">Transaction Data (Multi-Attributed)</p>
              <p className="text-xs font-mono text-purple-200 break-all">
                {appAndWalletTx.slice(0, 50)}...
              </p>
              <div className="mt-2 pt-2 border-t border-purple-500/20">
                <p className="text-xs text-gray-400">
                  ✓ Attribution: <span className="text-green-400">Thread Master + Player</span>
                </p>
                <p className="text-xs text-gray-400">Rewards split between parties</p>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-purple-300">
              Technical Implementation
            </h4>
            <div className="rounded-lg border border-purple-500/20 bg-black/20 p-3">
              <p className="text-xs text-gray-400 mb-1">ERC-8021 Data Suffix</p>
              <p className="text-xs font-mono text-purple-200 break-all">
                {generateSuffix()}
              </p>
              <div className="mt-2 pt-2 border-t border-purple-500/20 text-xs text-gray-400">
                <p>Format: {'{'}codes{'}{'}length{'}{'}schema{'}{'}erc_suffix{'}'}</p>
                <p className="mt-1 text-purple-300">
                  This suffix is automatically appended to all transactions
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward Use Cases */}
      <Card className="border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-blue-950/20">
        <CardHeader>
          <CardTitle className="text-purple-200">Reward Distribution</CardTitle>
          <CardDescription className="text-gray-400">
            How attribution enables rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-300 font-bold">1</span>
              </div>
              <div>
                <p className="text-purple-200 font-medium">NFT Badge Claims</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Achievement badges track Thread Master attribution for platform rewards
                </p>
              </div>
            </div>

            <div className="flex gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-300 font-bold">2</span>
              </div>
              <div>
                <p className="text-purple-200 font-medium">Leaderboard Prizes</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Prize distributions automatically track attribution for reward splits
                </p>
              </div>
            </div>

            <div className="flex gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-300 font-bold">3</span>
              </div>
              <div>
                <p className="text-purple-200 font-medium">Protocol Incentives</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Base ecosystem protocols recognize Thread Master activity
                </p>
              </div>
            </div>

            <div className="flex gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-300 font-bold">4</span>
              </div>
              <div>
                <p className="text-purple-200 font-medium">Builder Rewards</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Official Base Builder Code ensures proper reward attribution
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-950/10 to-orange-950/10">
        <CardContent className="pt-6">
          <div className="flex gap-3 text-sm">
            <ShieldCheck className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-300 font-medium mb-1">Security Notice</p>
              <p className="text-xs text-gray-400">
                Attribution codes and payout addresses are securely configured and not exposed in the UI for security purposes. 
                All transactions are automatically attributed using ERC-8021 standard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
