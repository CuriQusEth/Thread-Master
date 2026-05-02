# 🔗 ERC-8021 Transaction Attribution - Quick Start

## Overview

Thread Master integrates **ERC-8021**, a standardized method for attributing blockchain transactions to apps and wallets. This enables reward distribution and attribution tracking across the Base ecosystem.

## 🚀 Quick Start

### 1. Basic Attribution

```typescript
import { useERC8021 } from '@/hooks/useERC8021';

function MyComponent() {
  const { attributeTransaction } = useERC8021();
  
  const sendTx = async () => {
    const calldata = '0xa9059cbb...'; // Your transaction data
    const attributed = attributeTransaction(calldata); // Add attribution
    
    await walletClient.sendTransaction({
      to: contractAddress,
      data: attributed, // Transaction now has Thread Master attribution
    });
  };
}
```

### 2. Multi-Entity Attribution (App + Wallet)

```typescript
import { useMultiAttribution } from '@/hooks/useERC8021';

function RewardClaim() {
  const { attributeWithWallet } = useMultiAttribution({
    appCode: 'threadmaster',
    walletCode: 'coinbase', // Both get credit
  });
  
  const claim = async () => {
    const data = attributeWithWallet(claimCalldata);
    await sendTx(data); // Both Thread Master and Coinbase wallet get attribution
  };
}
```

## 📦 What's Included

- **`src/lib/erc8021.ts`** - Core attribution utilities
- **`src/hooks/useERC8021.ts`** - React hooks for easy integration
- **`src/components/game/ERC8021Example.tsx`** - Interactive examples
- **`docs/ERC8021_INTEGRATION.md`** - Comprehensive documentation

## 🎮 Use Cases in Thread Master

| Feature | Attribution Use |
|---------|----------------|
| **NFT Badge Claims** | Track which app drove the mint |
| **Reward Distribution** | Credit app + wallet for facilitating rewards |
| **In-Game Purchases** | Attribute commerce transactions |
| **Leaderboard Interactions** | Track on-chain leaderboard updates |

## 🧩 How It Works

```
Original Transaction:
0xa9059cbb0000000000000000000000001234567890123456789012345678901234567890

With Attribution:
0xa9059cbb0000000000000000000000001234567890123456789012345678901234567890
  746872656164...0c0080218021802180218021802180218021
  └──────────────────────────────────────┘
         Attribution Suffix
```

The suffix contains:
- **codes**: "threadmaster" (encoded)
- **codesLength**: 0x0c (12 bytes)
- **schemaId**: 0x00 (canonical registry)
- **ercSuffix**: 0x80218021... (ERC-8021 identifier)

## 🔍 Parsing Attribution

```typescript
import { parseAttribution } from '@/lib/erc8021';

const result = parseAttribution(txData);

if (result) {
  console.log('Codes:', result.codes); // ['threadmaster', 'coinbase']
  console.log('Schema:', result.schemaId); // 0 or 1
}
```

## 🎯 Configuration

### Default (Thread Master only)

```typescript
{
  codes: ['threadmaster'],
  schemaId: SchemaId.CANONICAL_REGISTRY
}
```

### Custom (with wallet)

```typescript
{
  codes: ['threadmaster', 'coinbase'],
  schemaId: SchemaId.CANONICAL_REGISTRY
}
```

### Custom Registry

```typescript
{
  codes: ['threadmaster', 'morpho'],
  schemaId: SchemaId.CUSTOM_REGISTRY,
  customRegistry: {
    chainId: BigInt(8453), // Base
    address: '0x...'
  }
}
```

## 🔐 Validation

Codes must:
- Follow 7-bit ASCII encoding
- Not contain commas (reserved as delimiter)
- Not be empty strings

```typescript
import { isValidCode, validateCodes } from '@/lib/erc8021';

isValidCode('threadmaster'); // true
isValidCode('thread,master'); // false (comma not allowed)
isValidCode(''); // false (empty not allowed)

validateCodes(['threadmaster', 'coinbase']);
// { valid: true, errors: [] }
```

## 🌐 Code Registry

### What is it?

A smart contract that maps codes to:
- **Payout addresses** (where to send rewards)
- **Metadata URIs** (app information)
- **Validation status**

### Canonical Registries

| Chain | Address |
|-------|---------|
| Base Mainnet (8453) | TBD |
| Base Sepolia (84532) | TBD |

### Interface

```solidity
interface ICodeRegistry {
    function payoutAddress(string code) external view returns (address);
    function codeURI(string code) external view returns (string);
    function isValidCode(string code) external view returns (bool);
    function isRegistered(string code) external view returns (bool);
}
```

## 📚 Resources

- **Full Documentation**: [`docs/ERC8021_INTEGRATION.md`](docs/ERC8021_INTEGRATION.md)
- **Example Component**: [`src/components/game/ERC8021Example.tsx`](src/components/game/ERC8021Example.tsx)
- **ERC-8021 Spec**: https://eips.ethereum.org/EIPS/eip-8021
- **Thread Master Code**: `threadmaster`
- **Base Builder**: `0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B`

## 🤝 Integration Checklist

- [x] Farcaster SDK initialized with `ready()` call
- [x] BaseBuilder config added to manifest
- [x] ERC-8021 utilities created
- [x] React hooks for attribution
- [x] Example component with live demos
- [ ] Register "threadmaster" code in Base registry (when available)
- [ ] Integrate with NFT badge claiming
- [ ] Add to reward distribution flows
- [ ] Track attribution analytics

## 💡 Best Practices

1. **Always attribute game transactions** - NFT claims, rewards, purchases
2. **Use multi-attribution** when wallet supports it
3. **Handle errors gracefully** - fall back to original calldata if attribution fails
4. **Test different scenarios** - single entity, multi-entity, custom registry

## 🚧 Future Enhancements

- Automatic code registry registration
- Attribution analytics dashboard
- Partner integration templates
- Reward tracking UI

---

**Ready to start?** Import `useERC8021` and add attribution to your blockchain transactions!

```typescript
import { useERC8021 } from '@/hooks/useERC8021';
const { attributeTransaction } = useERC8021();
```
