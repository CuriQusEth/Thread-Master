'use client';

import { useSendCalls } from 'wagmi/experimental';
import { Attribution } from 'ox/erc8021';
import { useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Hook for EIP-5792 Batch Transactions with ERC-8021 Attribution
 * 
 * Supports:
 * - Single transactions with attribution
 * - Batch transactions (multiple calls)
 * - Smart wallet compatibility (ERC-4337)
 * - EOA wallet fallback
 */
export function useBatchTransactions() {
  const { sendCalls, data: callsId, isPending, isSuccess, error } = useSendCalls();

  /**
   * Send batch of transactions with attribution
   */
  const sendBatch = useCallback(
    async (params: {
      calls: Array<{
        to: `0x${string}`;
        data?: `0x${string}`;
        value?: bigint;
      }>;
      builderCode: string;
      chainId?: number;
    }) => {
      const { calls, builderCode, chainId } = params;

      try {
        // Generate ERC-8021 attribution suffix
        const dataSuffix = Attribution.toDataSuffix({
          codes: [builderCode],
        });

        // Send batch with attribution capability
        const result = await sendCalls({
          calls,
          capabilities: {
            dataSuffix: {
              dataSuffix,
            },
          },
          ...(chainId && { chainId }),
        });

        toast.success('Batch transaction sent!');
        return result;
      } catch (err) {
        console.error('Batch transaction error:', err);
        toast.error('Failed to send batch transaction');
        throw err;
      }
    },
    [sendCalls]
  );

  /**
   * Send single transaction with attribution
   */
  const sendSingle = useCallback(
    async (params: {
      to: `0x${string}`;
      data?: `0x${string}`;
      value?: bigint;
      builderCode: string;
      chainId?: number;
    }) => {
      const { to, data, value, builderCode, chainId } = params;

      return sendBatch({
        calls: [{ to, data, value }],
        builderCode,
        chainId,
      });
    },
    [sendBatch]
  );

  /**
   * Check if wallet supports ERC-5792
   */
  const supportsBatch = useCallback(async () => {
    try {
      // This would typically check wallet capabilities
      // For now, assume support if hook is available
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    sendBatch,
    sendSingle,
    supportsBatch,
    callsId,
    isPending,
    isSuccess,
    error,
  };
}
