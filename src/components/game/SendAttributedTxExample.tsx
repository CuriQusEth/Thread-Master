'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useSendAttributedTransaction } from '@/hooks/useSendAttributedTransaction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Wallet, Send, Check, Loader2, AlertCircle, Copy, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { ATTRIBUTION_CONFIG, PUBLIC_DISPLAY } from '@/config/attribution';

/**
 * Example component showing how to send attributed transactions with Wagmi useSendCalls
 * Demonstrates official Base Builder Codes integration with secure configuration
 */
export function SendAttributedTxExample() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendAttributedTransaction, callsId, isPending, isSuccess, error } =
    useSendAttributedTransaction();

  // Example values for demonstration (not real addresses)
  const [recipient, setRecipient] = useState<string>('0x0000000000000000000000000000000000000000');
  const [calldata, setCalldata] = useState<string>('0x');

  const handleSendTx = async () => {
    if (!recipient.startsWith('0x') || recipient.length !== 42) {
      toast.error('Invalid recipient address format');
      return;
    }

    if (!calldata.startsWith('0x')) {
      toast.error('Invalid calldata format');
      return;
    }

    try {
      await sendAttributedTransaction({
        to: recipient as `0x${string}`,
        data: calldata as `0x${string}`,
        builderCode: ATTRIBUTION_CONFIG.BUILDER_CODE,
      });
      toast.success('Transaction sent with secure attribution!');
    } catch (err) {
      console.error('Transaction error:', err);
      toast.error('Transaction failed');
    }
  };

  const copyExample = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <Card className="bg-purple-900/30 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-100">
          <Send className="h-5 w-5" />
          Send Attributed Transaction
        </CardTitle>
        <CardDescription className="text-purple-300">
          Official Base Builder Codes integration using Wagmi useSendCalls (ERC-5792)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Notice */}
        <div className="flex gap-3 p-3 rounded-lg border border-green-500/20 bg-green-950/10">
          <ShieldCheck className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-green-300 font-medium">Secure Attribution Configured</p>
            <p className="text-gray-400 text-xs mt-1">
              Builder code: {PUBLIC_DISPLAY.BUILDER_CODE_MASKED} | All transactions automatically attributed
            </p>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="space-y-2">
          <Label className="text-purple-200">Wallet Connection</Label>
          {!isConnected ? (
            <div className="flex flex-wrap gap-2">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-800/30"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {connector.name}
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-purple-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-green-500 text-green-400">
                  <Check className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
                <code className="text-xs text-purple-300">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </code>
              </div>
              <Button
                onClick={() => disconnect()}
                variant="ghost"
                size="sm"
                className="text-purple-400 hover:text-purple-200"
              >
                Disconnect
              </Button>
            </div>
          )}
        </div>

        {/* Transaction Form */}
        {isConnected && (
          <>
            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-purple-200">
                Recipient Address
              </Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="bg-purple-900/50 border-purple-500/30 text-purple-100"
              />
              <p className="text-xs text-purple-400">
                Enter the recipient wallet address (42 characters starting with 0x)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calldata" className="text-purple-200">
                Transaction Calldata
              </Label>
              <Input
                id="calldata"
                value={calldata}
                onChange={(e) => setCalldata(e.target.value)}
                placeholder="0x"
                className="bg-purple-900/50 border-purple-500/30 text-purple-100"
              />
              <p className="text-xs text-purple-400">
                Enter the transaction data (hex format starting with 0x)
              </p>
            </div>

            {/* Attribution Info */}
            <div className="rounded-lg border border-purple-500/20 bg-purple-950/30 p-3">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-purple-200">Attribution Configuration</Label>
                <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                  Secure
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-400">Builder Code</p>
                  <p className="text-purple-300 font-mono">{PUBLIC_DISPLAY.BUILDER_CODE_MASKED}</p>
                </div>
                <div>
                  <p className="text-gray-400">Registry</p>
                  <p className="text-purple-300 font-mono">{PUBLIC_DISPLAY.REGISTRY_TYPE}</p>
                </div>
              </div>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendTx}
              disabled={isPending || !recipient || !calldata}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send with Secure Attribution
                </>
              )}
            </Button>

            {/* Transaction Status */}
            {isSuccess && callsId && (
              <div className="p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-400">Transaction Sent!</p>
                    <p className="text-xs text-green-300 mt-1 font-mono break-all">{callsId}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      ✓ Transaction attributed with secure builder code
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-400">Transaction Failed</p>
                    <p className="text-xs text-red-300 mt-1">{error.message}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Code Example */}
        <div className="space-y-2 pt-4 border-t border-purple-500/30">
          <div className="flex items-center justify-between">
            <Label className="text-purple-200">Code Example</Label>
            <Button
              onClick={() =>
                copyExample(`import { useSendAttributedTransaction } from '@/hooks/useSendAttributedTransaction';
import { ATTRIBUTION_CONFIG } from '@/config/attribution';

const { sendAttributedTransaction } = useSendAttributedTransaction();

await sendAttributedTransaction({
  to: '${recipient}',
  data: '${calldata}',
  builderCode: ATTRIBUTION_CONFIG.BUILDER_CODE
});`)
              }
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-200"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <pre className="p-3 bg-purple-950/50 border border-purple-500/30 rounded-lg overflow-x-auto text-xs text-purple-200">
            <code>{`import { useSendAttributedTransaction } from '@/hooks/useSendAttributedTransaction';
import { ATTRIBUTION_CONFIG } from '@/config/attribution';

const { sendAttributedTransaction } = useSendAttributedTransaction();

await sendAttributedTransaction({
  to: '${recipient}',
  data: '${calldata}',
  builderCode: ATTRIBUTION_CONFIG.BUILDER_CODE
});`}</code>
          </pre>
        </div>

        {/* Security Info */}
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-950/10 p-3 text-xs text-gray-400">
          <p className="text-yellow-300 font-medium mb-1">Security Best Practices</p>
          <ul className="space-y-1 ml-4 list-disc">
            <li>Builder codes are securely stored in configuration files</li>
            <li>Sensitive data is never exposed in the user interface</li>
            <li>All transactions are automatically attributed</li>
            <li>Attribution tracking is transparent and auditable on-chain</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
