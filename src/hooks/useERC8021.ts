'use client';

import { useCallback, useMemo } from 'react';
import type { AttributionConfig } from '@/lib/erc8021';
import {
  appendAttribution,
  generateAttributionSuffix,
  createDataSuffixCapability,
  THREAD_MASTER_ATTRIBUTION,
  SchemaId,
} from '@/lib/erc8021';

/**
 * React hook for ERC-8021 Transaction Attribution
 * 
 * Provides utilities for adding attribution to blockchain transactions
 * 
 * @example
 * const { attributeTransaction, generateSuffix } = useERC8021();
 * 
 * // Add attribution to transaction
 * const txData = '0x123...';
 * const attributed = attributeTransaction(txData);
 * 
 * // Send with wallet_sendCalls
 * const capability = generateWalletCapability();
 */
export function useERC8021(customConfig?: AttributionConfig) {
  const config = useMemo(() => 
    customConfig || THREAD_MASTER_ATTRIBUTION,
    [customConfig]
  );

  /**
   * Adds attribution suffix to transaction calldata
   */
  const attributeTransaction = useCallback((calldata: string): string => {
    return appendAttribution(calldata, config);
  }, [config]);

  /**
   * Generates just the attribution suffix (without prepending to calldata)
   */
  const generateSuffix = useCallback((): string => {
    return generateAttributionSuffix(config);
  }, [config]);

  /**
   * Creates ERC-5792 wallet capability for wallet_sendCalls
   */
  const generateWalletCapability = useCallback((): { dataSuffix: string } => {
    return createDataSuffixCapability(config);
  }, [config]);

  /**
   * Creates a new config with additional codes
   */
  const addCodes = useCallback((additionalCodes: string[]): AttributionConfig => {
    return {
      ...config,
      codes: [...config.codes, ...additionalCodes],
    };
  }, [config]);

  return {
    /** Current attribution configuration */
    config,
    /** Add attribution to transaction calldata */
    attributeTransaction,
    /** Generate attribution suffix only */
    generateSuffix,
    /** Generate ERC-5792 wallet capability */
    generateWalletCapability,
    /** Create config with additional codes */
    addCodes,
  };
}

/**
 * Hook for multi-entity attribution (app + wallet)
 * 
 * @example
 * const { attributeWithWallet } = useMultiAttribution({
 *   appCode: 'threadmaster',
 *   walletCode: 'coinbase'
 * });
 * 
 * const txData = '0x123...';
 * const attributed = attributeWithWallet(txData);
 */
export function useMultiAttribution(params: {
  appCode: string;
  walletCode?: string;
  customRegistry?: {
    chainId: bigint;
    address: string;
  };
}) {
  const { appCode, walletCode, customRegistry } = params;

  const config = useMemo((): AttributionConfig => {
    const codes = walletCode ? [appCode, walletCode] : [appCode];
    
    return {
      codes,
      schemaId: customRegistry ? SchemaId.CUSTOM_REGISTRY : SchemaId.CANONICAL_REGISTRY,
      customRegistry,
    };
  }, [appCode, walletCode, customRegistry]);

  const { attributeTransaction, generateSuffix, generateWalletCapability } = useERC8021(config);

  return {
    config,
    attributeWithWallet: attributeTransaction,
    generateSuffix,
    generateWalletCapability,
  };
}
