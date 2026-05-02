/**
 * Attribution Configuration
 * 
 * Centralized configuration for ERC-8021 attribution and sensitive data
 * This file should be treated as sensitive and not exposed in UI
 */

/**
 * PRODUCTION CONFIGURATION
 * These values are used internally by the app but should not be displayed in the UI
 */
export const ATTRIBUTION_CONFIG = {
  /** Official Base Builder Code - DO NOT DISPLAY IN UI */
  BUILDER_CODE: 'bc_aisit0mq',
  
  /** Thread Master payout wallet address - DO NOT DISPLAY IN UI */
  PAYOUT_ADDRESS: '0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B',
  
  /** App metadata */
  APP_NAME: 'Thread Master',
  APP_DESCRIPTION: 'Untangle the chaos, master the thread',
} as const;

/**
 * PUBLIC DISPLAY STRINGS
 * These are safe to show in the UI as masked/generic versions
 */
export const PUBLIC_DISPLAY = {
  BUILDER_CODE_MASKED: 'bc_••••••••',
  PAYOUT_ADDRESS_MASKED: '0x2953...9b7B',
  ATTRIBUTION_STATUS: 'Active',
  REGISTRY_TYPE: 'Base Canonical',
} as const;

/**
 * Get masked version of sensitive data for UI display
 */
export function maskSensitiveData(type: 'builder' | 'address', value: string): string {
  switch (type) {
    case 'builder':
      return value.slice(0, 3) + '••••••••';
    case 'address':
      return value.slice(0, 6) + '...' + value.slice(-4);
    default:
      return '••••••••';
  }
}

/**
 * Check if running in development mode
 * In dev mode, we can show more details for debugging
 */
export const isDevelopmentMode = (): boolean => {
  return process.env.NODE_ENV === 'development';
};
