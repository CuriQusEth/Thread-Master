'use client';

import { useCallback } from 'react';
import { useSendCalls } from 'wagmi/experimental';
import { Attribution } from 'ox/erc8021';
import type { SendCallsParameters } from 'wagmi/experimental';

/**
 * Hook for sending transactions with ERC-8021 attribution using Wagmi's useSendCalls
 * 
 * This is the official Base Builder Codes integration method using wallet_sendCalls (ERC-5792)
 * 
 * @example
 * const { sendAttributedTransaction } = useSendAttributedTransaction();
 * 
 * await sendAttributedTransaction({
 *   to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
 *   data: '0xdeadbeef',
 *   builderCode: 'threadmaster'
 * });
 */
export function useSendAttributedTransaction() {
  const { sendCalls, data: callsId, isPending, isSuccess, error } = useSendCalls();

  /**
   * Sends a transaction with ERC-8021 attribution
   * 
   * @param to - Recipient address
   * @param data - Transaction calldata
   * @param builderCode - Your builder code from base.dev (e.g., "bc_aisit0mq", "threadmaster")
   * @param value - Optional ETH value to send
   * @returns Transaction ID from wallet_sendCalls
   */
  const sendAttributedTransaction = useCallback(
    async (params: {
      to: `0x${string}`;
      data: `0x${string}`;
      builderCode: string;
      value?: bigint;
      chainId?: number;
    }) => {
      const { to, data, builderCode, value, chainId } = params;

      // Generate ERC-8021 attribution suffix using ox/erc8021
      const dataSuffix = Attribution.toDataSuffix({
        codes: [builderCode],
      });

      // Prepare calls with attribution capability
      const callsParams: SendCallsParameters = {
        calls: [
          {
            to,
            data,
            value,
          },
        ],
        capabilities: {
          dataSuffix: {
            dataSuffix,
          },
        },
        ...(chainId && { chainId }),
      };

      return await sendCalls(callsParams);
    },
    [sendCalls]
  );

  /**
   * Sends multiple transactions with attribution
   * Useful for batch operations like NFT minting + reward distribution
   */
  const sendAttributedBatch = useCallback(
    async (params: {
      calls: Array<{
        to: `0x${string}`;
        data: `0x${string}`;
        value?: bigint;
      }>;
      builderCode: string;
      chainId?: number;
    }) => {
      const { calls, builderCode, chainId } = params;

      const dataSuffix = Attribution.toDataSuffix({
        codes: [builderCode],
      });

      const callsParams: SendCallsParameters = {
        calls,
        capabilities: {
          dataSuffix: {
            dataSuffix,
          },
        },
        ...(chainId && { chainId }),
      };

      return await sendCalls(callsParams);
    },
    [sendCalls]
  );

  /**
   * Sends transaction with multi-entity attribution (app + wallet)
   * Both entities receive credit for the transaction
   */
  const sendMultiAttributed = useCallback(
    async (params: {
      to: `0x${string}`;
      data: `0x${string}`;
      appCode: string;
      walletCode: string;
      value?: bigint;
      chainId?: number;
    }) => {
      const { to, data, appCode, walletCode, value, chainId } = params;

      // Multi-code attribution
      const dataSuffix = Attribution.toDataSuffix({
        codes: [appCode, walletCode],
      });

      const callsParams: SendCallsParameters = {
        calls: [{ to, data, value }],
        capabilities: {
          dataSuffix: {
            dataSuffix,
          },
        },
        ...(chainId && { chainId }),
      };

      return await sendCalls(callsParams);
    },
    [sendCalls]
  );

  return {
    /** Send single transaction with attribution */
    sendAttributedTransaction,
    /** Send batch transactions with attribution */
    sendAttributedBatch,
    /** Send transaction with multi-entity attribution */
    sendMultiAttributed,
    /** Transaction ID from wallet_sendCalls */
    callsId,
    /** Is transaction pending */
    isPending,
    /** Transaction success */
    isSuccess,
    /** Transaction error */
    error,
  };
}

/**
 * Helper hook that pre-configures Thread Master's builder code
 * 
 * @example
 * const { sendTransaction } = useThreadMasterTransaction();
 * await sendTransaction({
 *   to: '0x...',
 *   data: '0x...'
 * });
 */
export function useThreadMasterTransaction() {
  const { sendAttributedTransaction, ...rest } = useSendAttributedTransaction();

  const sendTransaction = useCallback(
    async (params: {
      to: `0x${string}`;
      data: `0x${string}`;
      value?: bigint;
      chainId?: number;
    }) => {
      return sendAttributedTransaction({
        ...params,
        builderCode: 'bc_aisit0mq', // Official Thread Master builder code from base.dev
      });
    },
    [sendAttributedTransaction]
  );

  return {
    sendTransaction,
    ...rest,
  };
}
