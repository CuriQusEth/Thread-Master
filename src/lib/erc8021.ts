/**
 * ERC-8021 Transaction Attribution Utilities (Base Builder Codes)
 * 
 * Official implementation using ox/erc8021 library
 * A standardized method for attributing transactions to applications and wallets
 * through data suffixes, enabling interoperable attribution tracking and reward distribution.
 * 
 * @see https://docs.base.org/base-builder-codes
 * @see https://eips.ethereum.org/EIPS/eip-8021
 */

import { Attribution } from 'ox/erc8021';
import type { Attribution as AttributionType } from 'ox/erc8021';
import { ATTRIBUTION_CONFIG } from '@/config/attribution';

/**
 * Schema IDs for different attribution formats
 */
export enum SchemaId {
  /** Single/multi entity with canonical Code Registry */
  CANONICAL_REGISTRY = 0,
  /** Single/multi entity with custom Code Registry */
  CUSTOM_REGISTRY = 1,
}

/**
 * Configuration for ERC-8021 attribution
 */
export interface AttributionConfig {
  /** Attribution codes (e.g., ["threadmaster"], ["baseapp", "morpho"]) */
  codes: string[];
  /** Schema ID to use */
  schemaId?: SchemaId;
  /** Custom registry configuration (required for Schema ID 1) */
  customRegistry?: {
    chainId: bigint;
    address: string;
  };
}

/**
 * Code Registry interface for querying attribution metadata
 */
export interface ICodeRegistry {
  /** Address to receive rewards for this code */
  payoutAddress(code: string): Promise<string>;
  /** URI pointing to metadata about this code */
  codeURI(code: string): Promise<string>;
  /** Check if a code is valid format */
  isValidCode(code: string): Promise<boolean>;
  /** Check if a code is registered */
  isRegistered(code: string): Promise<boolean>;
}

/**
 * Code metadata structure
 */
export interface CodeMetadata {
  app: {
    name: string;
    url: string;
  };
}

/**
 * Canonical Code Registry addresses by chain ID
 */
export const CANONICAL_REGISTRIES: Record<number, string> = {
  8453: '0x0000000000000000000000000000000000000000', // Base Mainnet (TBD)
  84532: '0x0000000000000000000000000000000000000000', // Base Sepolia (TBD)
};

/**
 * Validates attribution codes
 * - Must follow 7-bit ASCII encoding
 * - Cannot contain commas (reserved as delimiter)
 * - Cannot be empty
 */
export function isValidCode(code: string): boolean {
  if (!code || code.length === 0) return false;
  if (code.includes(',')) return false;
  
  // Check 7-bit ASCII (0-127)
  for (let i = 0; i < code.length; i++) {
    const charCode = code.charCodeAt(i);
    if (charCode > 127) return false;
  }
  
  return true;
}

/**
 * Validates all codes in an array
 */
export function validateCodes(codes: string[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (codes.length === 0) {
    errors.push('At least one code is required');
  }
  
  codes.forEach((code: string, index: number) => {
    if (!isValidCode(code)) {
      errors.push(`Code at index ${index} is invalid: "${code}"`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generates ERC-8021 attribution suffix using official ox/erc8021 library
 * 
 * @example
 * generateAttributionSuffix({ codes: ['threadmaster'] })
 * // Returns: "0x746872656164...080218021802180218021802180218021"
 * 
 * @example
 * generateAttributionSuffix({ 
 *   codes: ['threadmaster', 'baseapp'],
 *   schemaId: SchemaId.CUSTOM_REGISTRY,
 *   customRegistry: { chainId: 8453n, address: '0x...' }
 * })
 */
export function generateAttributionSuffix(config: AttributionConfig): string {
  const { codes, schemaId = SchemaId.CANONICAL_REGISTRY, customRegistry } = config;
  
  // Validate codes
  const validation = validateCodes(codes);
  if (!validation.valid) {
    throw new Error(`Invalid codes: ${validation.errors.join(', ')}`);
  }

  // Use ox/erc8021 Attribution.toDataSuffix
  if (schemaId === SchemaId.CANONICAL_REGISTRY) {
    // Schema 0: Canonical registry (default)
    return Attribution.toDataSuffix({ codes });
  } else if (schemaId === SchemaId.CUSTOM_REGISTRY) {
    // Schema 1: Custom registry
    if (!customRegistry) {
      throw new Error('Custom registry configuration required for Schema ID 1');
    }

    const { chainId, address } = customRegistry;
    
    // Validate address format
    if (!address.startsWith('0x') || address.length !== 42) {
      throw new Error('Invalid registry address format');
    }

    return Attribution.toDataSuffix({
      codes,
      registry: {
        chainId: Number(chainId),
        address: address as `0x${string}`,
      },
    });
  } else {
    throw new Error(`Unsupported schema ID: ${schemaId}`);
  }
}

/**
 * Appends ERC-8021 attribution suffix to transaction calldata
 * 
 * @param calldata - Original transaction calldata (hex string)
 * @param config - Attribution configuration
 * @returns Calldata with attribution suffix appended
 * 
 * @example
 * const txData = '0xa9059cbb...';
 * const attributed = appendAttribution(txData, {
 *   codes: ['threadmaster']
 * });
 */
export function appendAttribution(calldata: string, config: AttributionConfig): string {
  if (!calldata.startsWith('0x')) {
    throw new Error('Calldata must start with 0x');
  }
  
  const suffix = generateAttributionSuffix(config);
  return calldata + suffix.slice(2); // Remove 0x from suffix before appending
}

/**
 * Parses ERC-8021 attribution suffix from calldata
 * 
 * @param calldata - Transaction calldata with attribution suffix
 * @returns Parsed attribution data or null if no valid suffix found
 * 
 * @example
 * const parsed = parseAttribution('0x123456...threadmaster...8021');
 * // Returns: { codes: ['threadmaster'], schemaId: 0 }
 */
export function parseAttribution(calldata: string): {
  codes: string[];
  schemaId: SchemaId;
  customRegistry?: {
    chainId: bigint;
    address: string;
  };
} | null {
  if (!calldata.startsWith('0x')) {
    throw new Error('Calldata must start with 0x');
  }

  try {
    const data = calldata.slice(2); // Remove 0x prefix
    
    // Check for ERC suffix (last 16 bytes = 32 hex chars)
    if (data.length < 32) return null;
    
    const ercSuffix = '0x' + data.slice(-32);
    const ERC_SUFFIX = '0x80218021802180218021802180218021';
    if (ercSuffix !== ERC_SUFFIX) return null;
    
    // Extract schema ID (1 byte = 2 hex chars before ERC suffix)
    const schemaIdHex = data.slice(-34, -32);
    const schemaId = parseInt(schemaIdHex, 16);
    
    if (schemaId === SchemaId.CANONICAL_REGISTRY) {
      // Schema 0: {codes}{codesLength}{schemaId}{ercSuffix}
      const codesLengthHex = data.slice(-36, -34);
      const codesLength = parseInt(codesLengthHex, 16);
      const codesStart = data.length - 36 - (codesLength * 2);
      const codesHex = data.slice(codesStart, codesStart + (codesLength * 2));
      const codesString = Buffer.from(codesHex, 'hex').toString('utf-8');
      const codes = codesString.split(',');
      
      return { codes, schemaId: SchemaId.CANONICAL_REGISTRY };
      
    } else if (schemaId === SchemaId.CUSTOM_REGISTRY) {
      // Schema 1: {codeRegistryAddress}{codeRegistryChainId}{codeRegistryChainIdLength}{codes}{codesLength}{schemaId}{ercSuffix}
      const codesLengthHex = data.slice(-36, -34);
      const codesLength = parseInt(codesLengthHex, 16);
      const codesStart = data.length - 36 - (codesLength * 2);
      const codesEnd = codesStart + (codesLength * 2);
      const codesHex = data.slice(codesStart, codesEnd);
      const codesString = Buffer.from(codesHex, 'hex').toString('utf-8');
      const codes = codesString.split(',');
      
      // Extract chain ID length and chain ID
      const chainIdLengthHex = data.slice(codesStart - 2, codesStart);
      const chainIdLength = parseInt(chainIdLengthHex, 16);
      const chainIdStart = codesStart - 2 - (chainIdLength * 2);
      const chainIdHex = data.slice(chainIdStart, chainIdStart + (chainIdLength * 2));
      const chainId = BigInt('0x' + chainIdHex);
      
      // Extract registry address (20 bytes = 40 hex chars)
      const registryAddress = '0x' + data.slice(chainIdStart - 40, chainIdStart);
      
      return {
        codes,
        schemaId: SchemaId.CUSTOM_REGISTRY,
        customRegistry: {
          chainId,
          address: registryAddress,
        },
      };
    }
    
    return null;
  } catch (error) {
    // Invalid or no attribution suffix
    console.error('Failed to parse attribution:', error);
    return null;
  }
}

/**
 * Creates ERC-5792 data suffix capability for wallet_sendCalls
 * 
 * @example
 * const capability = createDataSuffixCapability({
 *   codes: ['threadmaster']
 * });
 * 
 * // Use with Wagmi useSendCalls
 * await sendCalls({
 *   calls: [...],
 *   capabilities: {
 *     dataSuffix: capability.dataSuffix
 *   }
 * });
 */
export function createDataSuffixCapability(config: AttributionConfig): { dataSuffix: string } {
  const suffix = generateAttributionSuffix(config);
  return { dataSuffix: suffix };
}

/**
 * Thread Master default attribution configuration
 * Uses secure builder code from config with canonical Base registry
 * 
 * Note: Builder code is imported from secure config to prevent exposure in UI
 */
export const THREAD_MASTER_ATTRIBUTION: AttributionConfig = {
  codes: [ATTRIBUTION_CONFIG.BUILDER_CODE],
  schemaId: SchemaId.CANONICAL_REGISTRY,
};

/**
 * Helper to create attributed transaction data for Thread Master
 * 
 * @param calldata - Original transaction calldata
 * @returns Calldata with Thread Master attribution
 * 
 * @example
 * const attributed = attributeToThreadMaster('0xa9059cbb...');
 * await sendTransaction({ data: attributed });
 */
export function attributeToThreadMaster(calldata: string): string {
  return appendAttribution(calldata, THREAD_MASTER_ATTRIBUTION);
}

/**
 * Multi-entity attribution helper
 * Attributes to both app and wallet
 * 
 * @example
 * const attributed = attributeToMultiple('0x123...', {
 *   codes: ['threadmaster', 'wallet']
 * });
 */
export function attributeToMultiple(calldata: string, config: AttributionConfig): string {
  return appendAttribution(calldata, config);
}
