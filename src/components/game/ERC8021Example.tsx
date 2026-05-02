'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useERC8021, useMultiAttribution } from '@/hooks/useERC8021';
import { SchemaId } from '@/lib/erc8021';
import { Copy, Check, Send, Code2, ShieldCheck } from 'lucide-react';
import { ATTRIBUTION_CONFIG, PUBLIC_DISPLAY, isDevelopmentMode } from '@/config/attribution';

/**
 * Example component demonstrating ERC-8021 Transaction Attribution
 * 
 * Shows attribution implementation without exposing sensitive configuration
 */
export function ERC8021Example(): JSX.Element {
  const [copied, setCopied] = useState<boolean>(false);
  const [exampleTx] = useState<string>('0xa9059cbb0000000000000000000000001234567890123456789012345678901234567890');

  // Simple single-entity attribution (uses secure internal config)
  const { attributeTransaction, generateSuffix } = useERC8021();

  // Multi-entity attribution example
  const { attributeWithWallet } = useMultiAttribution({
    appCode: ATTRIBUTION_CONFIG.BUILDER_CODE,
    walletCode: 'wallet_partner',
  });

  // Custom registry attribution (example only)
  const customConfig = {
    codes: [ATTRIBUTION_CONFIG.BUILDER_CODE, 'protocol_partner'],
    schemaId: SchemaId.CUSTOM_REGISTRY,
    customRegistry: {
      chainId: BigInt(8453),
      address: '0x0000000000000000000000000000000000000000', // Example registry
    },
  };
  const { attributeTransaction: attributeCustom } = useERC8021(customConfig);

  // Generate attributed transaction examples
  const singleAttributed = attributeTransaction(exampleTx);
  const multiAttributed = attributeWithWallet(exampleTx);
  const customAttributed = attributeCustom(exampleTx);
  const suffixOnly = generateSuffix();

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const showDebugInfo = isDevelopmentMode();

  return (
    <div className="space-y-6 max-w-4xl">
      <Card className="bg-purple-900/30 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-300 flex items-center gap-2">
            <Code2 className="h-6 w-6" />
            ERC-8021 Transaction Attribution
          </CardTitle>
          <CardDescription className="text-purple-400">
            Standardized method for attributing blockchain transactions to apps and wallets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Security Notice */}
          <div className="flex gap-3 p-3 rounded-lg border border-yellow-500/20 bg-yellow-950/10">
            <ShieldCheck className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-yellow-300 font-medium">Secure Attribution Active</p>
              <p className="text-gray-400 text-xs mt-1">
                Sensitive attribution codes are securely configured and automatically applied to all transactions
              </p>
            </div>
          </div>

          {/* Original Transaction */}
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">
              Example Transaction Data
            </h3>
            <div className="bg-purple-950/50 p-3 rounded-lg font-mono text-xs break-all text-purple-200">
              {exampleTx}
            </div>
            <p className="text-sm text-purple-400 mt-2">
              Example ERC-20 transfer transaction (unattributed)
            </p>
          </div>

          {/* Single Attribution */}
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">
              1. Single Attribution (App)
            </h3>
            <div className="bg-purple-950/50 p-3 rounded-lg font-mono text-xs break-all text-purple-200">
              {singleAttributed}
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                className="border-purple-500 text-purple-300"
                onClick={() => copyToClipboard(singleAttributed)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <p className="text-sm text-purple-400 mt-2">
              Uses Schema ID 0 with canonical Base registry • Attribution: <span className="text-green-400">Thread Master</span>
            </p>
          </div>

          {/* Multi-Entity Attribution */}
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">
              2. Multi-Entity Attribution (App + Partner)
            </h3>
            <div className="bg-purple-950/50 p-3 rounded-lg font-mono text-xs break-all text-purple-200">
              {multiAttributed}
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                className="border-purple-500 text-purple-300"
                onClick={() => copyToClipboard(multiAttributed)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <p className="text-sm text-purple-400 mt-2">
              Attributes to multiple parties for reward splitting
            </p>
          </div>

          {/* Custom Registry Attribution */}
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">
              3. Custom Registry (App + Protocol)
            </h3>
            <div className="bg-purple-950/50 p-3 rounded-lg font-mono text-xs break-all text-purple-200">
              {customAttributed}
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                className="border-purple-500 text-purple-300"
                onClick={() => copyToClipboard(customAttributed)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <p className="text-sm text-purple-400 mt-2">
              Uses Schema ID 1 with custom registry on Base (chain 8453)
            </p>
          </div>

          {/* Suffix Only */}
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">
              4. Attribution Suffix (ERC-5792)
            </h3>
            <div className="bg-purple-950/50 p-3 rounded-lg font-mono text-xs break-all text-purple-200">
              {suffixOnly}
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                className="border-purple-500 text-purple-300"
                onClick={() => copyToClipboard(suffixOnly)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <p className="text-sm text-purple-400 mt-2">
              Suffix only - use with wallet_sendCalls dataSuffix capability
            </p>
          </div>

          {/* How Attribution Works */}
          <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-lg font-semibold text-purple-300 mb-3">
              How Attribution Works
            </h3>
            <ul className="space-y-2 text-sm text-purple-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>
                  <strong>Automatic Tracking:</strong> Attribution codes are securely appended to all transactions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>
                  <strong>Reward Distribution:</strong> Protocol reads codes and distributes rewards to registered addresses
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>
                  <strong>Multi-Party Splits:</strong> Multiple codes enable automatic reward sharing
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>
                  <strong>Backward Compatible:</strong> Suffix ignored by contracts that don&apos;t support ERC-8021
                </span>
              </li>
            </ul>
          </div>

          {/* Integration Code Example */}
          <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-lg font-semibold text-purple-300 mb-3">
              Integration Example
            </h3>
            <pre className="text-xs bg-purple-950/50 p-3 rounded overflow-x-auto text-purple-200">
              <code>{`import { useERC8021 } from '@/hooks/useERC8021';

const { attributeTransaction } = useERC8021();

// Automatically applies secure attribution
const attributedTx = attributeTransaction(txData);

await sendTransaction({ data: attributedTx });`}</code>
            </pre>
          </div>

          {/* Debug Info (Dev Mode Only) */}
          {showDebugInfo && (
            <div className="bg-orange-900/20 rounded-lg p-3 border border-orange-500/20">
              <p className="text-xs text-orange-400 font-mono">
                [DEV MODE] Builder Code: {PUBLIC_DISPLAY.BUILDER_CODE_MASKED} | Status: {PUBLIC_DISPLAY.ATTRIBUTION_STATUS}
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => {
                console.log('🔗 ERC-8021 Attribution Examples:', {
                  single: singleAttributed,
                  multi: multiAttributed,
                  custom: customAttributed,
                  suffix: suffixOnly,
                });
              }}
            >
              <Send className="mr-2 h-5 w-5" />
              Log Examples to Console
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
