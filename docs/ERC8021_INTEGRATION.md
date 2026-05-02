# ERC-8021 Transaction Attribution Integration

## Overview

Thread Master integrates **ERC-8021: Transaction Attribution**, a standardized method for attributing blockchain transactions to applications and wallets. This enables interoperable attribution tracking and reward distribution across the Base ecosystem.

## What is ERC-8021?

ERC-8021 defines a structured data suffix format that gets appended to transaction calldata. This suffix contains:
- **Attribution codes** (e.g., "threadmaster", "coinbase")
- **Schema information** (canonical or custom registry)
- **Registry references** (for payout addresses and metadata)

### Key Benefits

1. **Reward Distribution**: Protocols can identify and reward apps/wallets that drive transactions
2. **Multi-Party Attribution**: Support for multiple entities (app + wallet) in a single transaction
3. **Interoperable**: Works across all Base protocols that support ERC-8021
4. **Backward Compatible**: Transactions work normally even if contracts don't recognize attribution

## Architecture

```
Transaction Calldata Structure:
┌─────────────────┬──────────────────────────────────────────┐
│ Original Data   │ Attribution Suffix                       │
│ (0x123...abc)   │ {codes}{codesLength}{schemaId}{ercSuffix}│
└─────────────────┴──────────────────────────────────────────┘
```

### Suffix Components

1. **codes**: ASCII-encoded attribution codes (comma-separated)
2. **codesLength**: Length of codes in bytes
3. **schemaId**: Schema version (0 = canonical, 1 = custom registry)
4. **ercSuffix**: Fixed identifier (0x80218021802180218021802180218021)

## Implementation

### 1. Basic Attribution (Single Entity)

```typescript
import { useERC8021 } from '@/hooks/useERC8021';

function MyComponent() {
  const { attributeTransaction } = useERC8021();
  
  const sendTransaction = async () => {
    // Original transaction data
    const calldata = '0xa9059cbb...';
    
    // Add Thread Master attribution
    const attributed = attributeTransaction(calldata);
    
    // Send transaction
    await walletClient.sendTransaction({
      to: '0x...',
      data: attributed,
    });
  };
}
```

### 2. Multi-Entity Attribution (App + Wallet)

```typescript
import { useMultiAttribution } from '@/hooks/useERC8021';

function RewardComponent() {
  const { attributeWithWallet } = useMultiAttribution({
    appCode: 'threadmaster',
    walletCode: 'coinbase', // Wallet adds their code
  });
  
  const claimReward = async () => {
    const calldata = '0x...';
    const attributed = attributeWithWallet(calldata);
    
    // Both Thread Master and Coinbase get attribution
    await sendTx(attributed);
  };
}
```

### 3. Custom Registry Attribution

```typescript
import { useERC8021 } from '@/hooks/useERC8021';
import { SchemaId } from '@/lib/erc8021';

function CustomRegistryExample() {
  const { attributeTransaction } = useERC8021({
    codes: ['threadmaster', 'morpho'],
    schemaId: SchemaId.CUSTOM_REGISTRY,
    customRegistry: {
      chainId: BigInt(8453), // Base mainnet
      address: '0x1234...', // Custom registry contract
    },
  });
  
  // Transaction will reference the custom registry
  const attributed = attributeTransaction(calldata);
}
```

### 4. ERC-5792 Integration (wallet_sendCalls)

```typescript
import { useERC8021 } from '@/hooks/useERC8021';

function WalletCallsExample() {
  const { generateWalletCapability } = useERC8021();
  
  const sendCalls = async () => {
    // Generate capability for wallet_sendCalls
    const capability = generateWalletCapability();
    
    await walletClient.request({
      method: 'wallet_sendCalls',
      params: [{
        calls: [
          { to: '0x...', data: '0x...' },
          { to: '0x...', data: '0x...' },
        ],
        capabilities: {
          dataSuffix: capability, // Wallet appends suffix to all calls
        },
      }],
    });
  };
}
```

## Use Cases in Thread Master

### 1. NFT Badge Claims

When players claim achievement badges as NFTs:

```typescript
const { attributeTransaction } = useERC8021();

const claimBadge = async (badgeId: number) => {
  const claimData = encodeFunctionData({
    abi: BadgeABI,
    functionName: 'claim',
    args: [badgeId],
  });
  
  // Add Thread Master attribution
  const attributed = attributeTransaction(claimData);
  
  // Protocol sees this came from Thread Master
  await mintBadge(attributed);
};
```

### 2. Leaderboard Reward Distribution

When distributing prizes to top players:

```typescript
const { attributeWithWallet } = useMultiAttribution({
  appCode: 'threadmaster',
  walletCode: playerWalletCode,
});

const distributeRewards = async (winners: Address[]) => {
  const rewardData = encodeFunctionData({
    abi: RewardABI,
    functionName: 'batchDistribute',
    args: [winners],
  });
  
  // Both Thread Master and player's wallet get credit
  const attributed = attributeWithWallet(rewardData);
  await sendRewards(attributed);
};
```

### 3. In-Game Purchases

When players buy power-ups or items:

```typescript
const { attributeTransaction } = useERC8021();

const purchaseItem = async (itemId: number) => {
  const purchaseData = encodeFunctionData({
    abi: ShopABI,
    functionName: 'buy',
    args: [itemId],
  });
  
  // Thread Master gets attribution for driving commerce
  const attributed = attributeTransaction(purchaseData);
  await buyItem(attributed);
};
```

## Code Registry

### What is a Code Registry?

A smart contract that maps attribution codes to:
- **Payout Address**: Where rewards should be sent
- **Metadata URI**: JSON file with app information
- **Validation**: Code format and registration status

### Interface

```solidity
interface ICodeRegistry {
    function payoutAddress(string memory code) external view returns (address);
    function codeURI(string memory code) external view returns (string memory);
    function isValidCode(string memory code) external view returns (bool);
    function isRegistered(string memory code) external view returns (bool);
}
```

### Canonical Registries

| Chain | Address |
|-------|---------|
| Base Mainnet (8453) | TBD |
| Base Sepolia (84532) | TBD |

### Code Metadata Format

```json
{
  "app": {
    "name": "Thread Master",
    "url": "https://threadmaster.app"
  }
}
```

## Parsing Attribution

If you need to parse attribution data from transactions:

```typescript
import { parseAttribution } from '@/lib/erc8021';

const attribution = parseAttribution(txData);

if (attribution) {
  console.log('Attribution codes:', attribution.codes);
  console.log('Schema ID:', attribution.schemaId);
  
  if (attribution.customRegistry) {
    console.log('Custom registry:', attribution.customRegistry.address);
    console.log('Chain:', attribution.customRegistry.chainId);
  }
}
```

## Validation

The library automatically validates:
- **Code format**: 7-bit ASCII, no commas
- **Schema support**: Only Schema 0 and 1
- **Address format**: Proper 0x-prefixed addresses
- **Calldata format**: Proper hex encoding

```typescript
import { isValidCode, validateCodes } from '@/lib/erc8021';

// Validate single code
if (!isValidCode('my-app')) {
  console.error('Invalid code');
}

// Validate multiple codes
const { valid, errors } = validateCodes(['threadmaster', 'coinbase']);
if (!valid) {
  console.error('Validation errors:', errors);
}
```

## Best Practices

### 1. Always Attribute Game Transactions

Any transaction initiated from Thread Master should include attribution:
- Badge/NFT claims
- Reward distributions  
- In-game purchases
- Leaderboard interactions

### 2. Use Multi-Attribution When Appropriate

If the wallet supports its own attribution code, combine them:

```typescript
// Thread Master + Coinbase Wallet = both get credit
const { attributeWithWallet } = useMultiAttribution({
  appCode: 'threadmaster',
  walletCode: 'coinbase',
});
```

### 3. Handle Attribution Errors Gracefully

```typescript
try {
  const attributed = attributeTransaction(calldata);
  await sendTx(attributed);
} catch (error) {
  console.error('Attribution failed:', error);
  // Fall back to original transaction
  await sendTx(calldata);
}
```

### 4. Test with Different Scenarios

- Single entity (Thread Master only)
- Multi-entity (Thread Master + wallet)
- Custom registry (for partnerships)
- Long code lists (stress test)

## Example: Complete Integration

```typescript
'use client';

import { useERC8021 } from '@/hooks/useERC8021';
import { Button } from '@/components/ui/button';

export function BadgeClaimButton({ badgeId }: { badgeId: number }) {
  const { attributeTransaction } = useERC8021();
  
  const claimBadge = async () => {
    try {
      // Prepare claim transaction
      const calldata = encodeFunctionData({
        abi: BadgeABI,
        functionName: 'claim',
        args: [badgeId],
      });
      
      // Add Thread Master attribution
      const attributed = attributeTransaction(calldata);
      
      // Send transaction
      const hash = await walletClient.sendTransaction({
        to: BADGE_CONTRACT_ADDRESS,
        data: attributed,
      });
      
      console.log('Badge claimed with attribution:', hash);
      
    } catch (error) {
      console.error('Failed to claim badge:', error);
    }
  };
  
  return (
    <Button onClick={claimBadge}>
      Claim Badge
    </Button>
  );
}
```

## Resources

- **ERC-8021 Spec**: https://eips.ethereum.org/EIPS/eip-8021
- **Code Registry**: [To be deployed on Base]
- **Thread Master Code**: `threadmaster`
- **Base Builder Address**: `0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B`

## Future Enhancements

1. **Automatic Registry Registration**: On-chain registry for Thread Master code
2. **Reward Dashboard**: View attribution analytics and earned rewards
3. **Partner Integrations**: Custom registries for game partnerships
4. **Attribution Analytics**: Track which features drive the most transactions

---

**Ready to attribute?** Import `useERC8021` and start adding attribution to your blockchain transactions!
