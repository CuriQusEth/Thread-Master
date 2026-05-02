/**
 * ERC-8021 Transaction Attribution Test Cases
 * 
 * Comprehensive test suite validating all ERC-8021 specification requirements
 * including security, parsing, validation, and edge cases.
 */

import {
  generateAttributionSuffix,
  appendAttribution,
  parseAttribution,
  isValidCode,
  validateCodes,
  SchemaId,
  type AttributionConfig,
} from './erc8021';

/**
 * Test Case 1: Single entity attribution with canonical registry
 * 
 * Input: 0xdddddddd62617365617070070080218021802180218021802180218021
 * Expected:
 * - txData: 0xdddddddd
 * - schemaId: 0
 * - codes: ["baseapp"]
 * - registry: canonical
 */
export function testSingleEntityCanonicalRegistry() {
  const input = '0xdddddddd62617365617070070080218021802180218021802180218021';
  
  const parsed = parseAttribution(input);
  
  const expected = {
    txData: '0xdddddddd',
    schemaId: SchemaId.CANONICAL_REGISTRY,
    codes: ['baseapp'],
  };
  
  console.log('Test 1: Single Entity + Canonical Registry');
  console.log('Input:', input);
  console.log('Parsed:', parsed);
  console.log('Expected:', expected);
  console.log('Pass:', 
    parsed?.codes[0] === expected.codes[0] && 
    parsed?.schemaId === expected.schemaId
  );
  
  return parsed;
}

/**
 * Test Case 2: Multiple entity attribution with custom registry
 * 
 * Input: 0xddddddddcccccccccccccccccccccccccccccccccccccccc210502626173656170702c6d6f7270686f0e0180218021802180218021802180218021
 * Expected:
 * - txData: 0xdddddddd
 * - schemaId: 1
 * - codes: ["baseapp", "morpho"]
 * - codeRegistryChainId: 8453
 * - codeRegistryAddress: 0xcccccccccccccccccccccccccccccccccccccccc
 */
export function testMultiEntityCustomRegistry() {
  const input = '0xddddddddcccccccccccccccccccccccccccccccccccccccc210502626173656170702c6d6f7270686f0e0180218021802180218021802180218021';
  
  const parsed = parseAttribution(input);
  
  const expected = {
    txData: '0xdddddddd',
    schemaId: SchemaId.CUSTOM_REGISTRY,
    codes: ['baseapp', 'morpho'],
    customRegistry: {
      chainId: BigInt(8453),
      address: '0xcccccccccccccccccccccccccccccccccccccccc',
    },
  };
  
  console.log('\nTest 2: Multi Entity + Custom Registry');
  console.log('Input:', input);
  console.log('Parsed:', parsed);
  console.log('Expected:', expected);
  console.log('Pass:',
    parsed?.codes[0] === expected.codes[0] &&
    parsed?.codes[1] === expected.codes[1] &&
    parsed?.schemaId === expected.schemaId &&
    parsed?.customRegistry?.chainId === expected.customRegistry.chainId
  );
  
  return parsed;
}

/**
 * Test Case 3: Invalid schema ID handling
 * 
 * Input: 0xddddddddff80218021802180218021802180218021
 * Expected: Parsing stops, unknown schemaId (returns null)
 */
export function testInvalidSchemaId() {
  const input = '0xddddddddff80218021802180218021802180218021';
  
  const parsed = parseAttribution(input);
  
  console.log('\nTest 3: Invalid Schema ID');
  console.log('Input:', input);
  console.log('Parsed:', parsed);
  console.log('Expected: null (unknown schemaId)');
  console.log('Pass:', parsed === null);
  
  return parsed;
}

/**
 * Test Case 4: Code validation
 */
export function testCodeValidation() {
  const testCases = [
    { code: 'threadmaster', valid: true },
    { code: 'baseapp', valid: true },
    { code: '', valid: false }, // empty
    { code: 'app,wallet', valid: false }, // contains comma
    { code: 'app™', valid: false }, // non-ASCII
    { code: 'validCode123', valid: true },
  ];
  
  console.log('\nTest 4: Code Validation');
  testCases.forEach(({ code, valid }: { code: string; valid: boolean }) => {
    const result = isValidCode(code);
    console.log(`Code: "${code}" | Expected: ${valid} | Got: ${result} | Pass: ${result === valid}`);
  });
}

/**
 * Test Case 5: Round-trip encoding and parsing
 */
export function testRoundTrip() {
  const config: AttributionConfig = {
    codes: ['threadmaster'],
    schemaId: SchemaId.CANONICAL_REGISTRY,
  };
  
  const originalTxData = '0xa9059cbb000000000000000000000000742d35cc6634c0532925a3b844bc9e7595f0615f0000000000000000000000000000000000000000000000000000000000000064';
  
  // Append attribution
  const attributed = appendAttribution(originalTxData, config);
  
  // Parse it back
  const parsed = parseAttribution(attributed);
  
  console.log('\nTest 5: Round-trip Encoding/Parsing');
  console.log('Original TX:', originalTxData);
  console.log('Attributed TX:', attributed);
  console.log('Parsed codes:', parsed?.codes);
  console.log('Pass:', parsed?.codes[0] === config.codes[0]);
}

/**
 * Test Case 6: Security - Malformed data handling
 */
export function testSecurityMalformedData() {
  const testCases = [
    { input: '0x', description: 'Empty calldata' },
    { input: '0x1234', description: 'Too short' },
    { input: 'invalid', description: 'Missing 0x prefix' },
    { input: '0xdddddddd12345678901234567890123456789012', description: 'Wrong ERC suffix' },
  ];
  
  console.log('\nTest 6: Security - Malformed Data');
  testCases.forEach(({ input, description }: { input: string; description: string }) => {
    try {
      const parsed = parseAttribution(input);
      console.log(`${description}: ${parsed === null ? 'Safely ignored ✓' : 'Unexpectedly parsed ✗'}`);
    } catch (error) {
      console.log(`${description}: Exception caught (safe) ✓`);
    }
  });
}

/**
 * Test Case 7: Multi-code generation
 */
export function testMultiCodeGeneration() {
  const config: AttributionConfig = {
    codes: ['threadmaster', 'coinbase', 'base'],
    schemaId: SchemaId.CANONICAL_REGISTRY,
  };
  
  const suffix = generateAttributionSuffix(config);
  const txData = '0xdddddddd';
  const attributed = txData + suffix.slice(2);
  const parsed = parseAttribution(attributed);
  
  console.log('\nTest 7: Multi-code Generation');
  console.log('Input codes:', config.codes);
  console.log('Generated suffix:', suffix);
  console.log('Parsed codes:', parsed?.codes);
  console.log('Pass:', 
    parsed?.codes.length === 3 &&
    parsed?.codes[0] === 'threadmaster' &&
    parsed?.codes[1] === 'coinbase' &&
    parsed?.codes[2] === 'base'
  );
}

/**
 * Test Case 8: Custom registry with different chain IDs
 */
export function testCustomRegistryChains() {
  const testCases = [
    { chainId: BigInt(1), name: 'Ethereum Mainnet' },
    { chainId: BigInt(8453), name: 'Base' },
    { chainId: BigInt(84532), name: 'Base Sepolia' },
    { chainId: BigInt(10), name: 'Optimism' },
  ];
  
  console.log('\nTest 8: Custom Registry - Different Chains');
  testCases.forEach(({ chainId, name }: { chainId: bigint; name: string }) => {
    const config: AttributionConfig = {
      codes: ['testapp'],
      schemaId: SchemaId.CUSTOM_REGISTRY,
      customRegistry: {
        chainId,
        address: '0x1234567890123456789012345678901234567890',
      },
    };
    
    const suffix = generateAttributionSuffix(config);
    const txData = '0xabcdef';
    const attributed = txData + suffix.slice(2);
    const parsed = parseAttribution(attributed);
    
    console.log(`${name} (${chainId}): ${parsed?.customRegistry?.chainId === chainId ? '✓' : '✗'}`);
  });
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.log('=== ERC-8021 Transaction Attribution Test Suite ===\n');
  
  testSingleEntityCanonicalRegistry();
  testMultiEntityCustomRegistry();
  testInvalidSchemaId();
  testCodeValidation();
  testRoundTrip();
  testSecurityMalformedData();
  testMultiCodeGeneration();
  testCustomRegistryChains();
  
  console.log('\n=== Test Suite Complete ===');
}

/**
 * Validation results for codes
 */
export function validateCodesWithResults(codes: string[]): void {
  const result = validateCodes(codes);
  console.log('Validation Result:', result);
  if (!result.valid) {
    console.error('Validation Errors:', result.errors);
  }
}
