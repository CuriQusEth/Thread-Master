# Wagmi useSendCalls + ERC-8021 Attribution Integration

Complete guide for sending attributed transactions using Wagmi's `useSendCalls` hook with Base Builder Codes (ERC-8021).

## 🎯 Overview

Thread Master now supports **official Base Builder Codes** integration using:
- ✅ **Wagmi 2.14.13** - React hooks for Ethereum
- ✅ **ox/erc8021** - Official ERC-8021 implementation
- ✅ **useSendCalls** - ERC-5792 wallet_sendCalls hook
- ✅ **Base network** - Mainnet & Sepolia support

## 📦 Installed Packages

```json
{
  "wagmi": "2.14.13",
  "viem": "2.22.11",
  "@tanstack/react-query": "5.62.15",
  "ox": "0.10.0"
}
```

## 🏗️ Architecture

### 1. Wagmi Configuration (`src/lib/wagmi.ts`)

```typescript
import { createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Thread Master' }),
    walletConnect({ projectId }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});
```

### 2. Provider Setup (`src/providers/WagmiProvider.tsx`)

Wraps the entire app with Wagmi and React Query:

```typescript
import { WagmiProvider as WagmiProviderBase } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';

export function WagmiProvider({ children }) {
  return (
    <WagmiProviderBase config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProviderBase>
  );
}
```

### 3. Attribution Hook (`src/hooks/useSendAttributedTransaction.ts`)

Main hook for sending transactions with attribution:

```typescript
import { useSendCalls } from 'wagmi/experimental';
import { Attribution } from 'ox/erc8021';

export function useSendAttributedTransaction() {
  const { sendCalls } = useSendCalls();

  const sendAttributedTransaction = async ({
    to,
    data,
    builderCode,
    value,
  }) => {
    // Generate ERC-8021 suffix
    const dataSuffix = Attribution.toDataSuffix({
      codes: [builderCode],
    });

    // Send with attribution
    return await sendCalls({
      calls: [{ to, data, value }],
      capabilities: {
        dataSuffix: { dataSuffix },
      },
    });
  };

  return { sendAttributedTransaction };
}
```

## 🚀 Usage Examples

### Example 1: Simple Transaction

```typescript
import { useSendAttributedTransaction } from '@/hooks/useSendAttributedTransaction';

function MyComponent() {
  const { sendAttributedTransaction, isPending } = useSendAttributedTransaction();

  const handleSend = async () => {
    await sendAttributedTransaction({
      to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
      data: '0xdeadbeef',
      builderCode: 'threadmaster', // Your code from base.dev
    });
  };

  return (
    <button onClick={handleSend} disabled={isPending}>
      {isPending ? 'Sending...' : 'Send Transaction'}
    </button>
  );
}
```

### Example 2: Multi-Entity Attribution

```typescript
const { sendMultiAttributed } = useSendAttributedTransaction();

await sendMultiAttributed({
  to: '0x...',
  data: '0x...',
  appCode: 'threadmaster',
  walletCode: 'coinbase', // Both get credit!
});
```

### Example 3: Batch Transactions

```typescript
const { sendAttributedBatch } = useSendAttributedTransaction();

await sendAttributedBatch({
  calls: [
    { to: '0x...', data: '0x...' },
    { to: '0x...', data: '0x...' },
    { to: '0x...', data: '0x...' },
  ],
  builderCode: 'threadmaster',
});
```

### Example 4: Thread Master Helper

Pre-configured with Thread Master's builder code:

```typescript
import { useThreadMasterTransaction } from '@/hooks/useSendAttributedTransaction';

const { sendTransaction } = useThreadMasterTransaction();

await sendTransaction({
  to: '0x...',
  data: '0x...',
});
```

## 🎮 Interactive Demo

Access the live demo in Thread Master:
1. Click "ERC-8021 Attribution" button on start screen
2. Connect your wallet (Coinbase, MetaMask, WalletConnect)
3. Fill in transaction details
4. Send attributed transaction
5. View transaction ID and status

## 🔗 Integration Points

### In-Game Use Cases

#### 1. NFT Badge Minting
```typescript
// Mint achievement badge with attribution
const mintBadge = async (achievementId: number) => {
  const data = encodeFunctionData({
    abi: badgeAbi,
    functionName: 'mint',
    args: [achievementId],
  });

  await sendAttributedTransaction({
    to: BADGE_CONTRACT,
    data,
    builderCode: 'threadmaster',
  });
};
```

#### 2. Leaderboard Rewards
```typescript
// Claim prize with multi-attribution
const claimPrize = async (amount: bigint) => {
  const data = encodeFunctionData({
    abi: rewardAbi,
    functionName: 'claim',
    args: [amount],
  });

  await sendMultiAttributed({
    to: REWARD_CONTRACT,
    data,
    appCode: 'threadmaster',
    walletCode: 'player',
  });
};
```

#### 3. Token Purchases
```typescript
// Buy in-game items with attribution
const purchaseItem = async (itemId: number, price: bigint) => {
  await sendAttributedTransaction({
    to: SHOP_CONTRACT,
    data: encodeFunctionData({
      abi: shopAbi,
      functionName: 'purchase',
      args: [itemId],
    }),
    value: price,
    builderCode: 'threadmaster',
  });
};
```

## 📊 Benefits

### For Thread Master:
- ✅ **Reward tracking** - Earn from attributed transactions
- ✅ **Analytics** - View transaction data on base.dev
- ✅ **User insights** - Understand player blockchain activity
- ✅ **Revenue share** - Participate in Base reward programs

### For Players:
- ✅ **Transparent** - Clear attribution of transactions
- ✅ **Wallet choice** - Use any compatible wallet
- ✅ **Batch support** - Efficient multi-transaction operations
- ✅ **Standards compliant** - Interoperable with other apps

## 🔐 Security

### Best Practices:
1. **Always validate inputs** before sending transactions
2. **Use type-safe addresses** (`0x${string}`)
3. **Handle errors gracefully** with try-catch
4. **Show transaction status** to users (pending, success, error)
5. **Never expose private keys** or sensitive data

### Example Error Handling:
```typescript
try {
  await sendAttributedTransaction({
    to: recipient,
    data: calldata,
    builderCode: 'threadmaster',
  });
  toast.success('Transaction sent!');
} catch (error) {
  console.error('Transaction failed:', error);
  toast.error(error.message);
}
```

## 📝 Configuration

### Environment Variables

Create `.env.local`:

```bash
# Optional: WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Base Builder Code (get from base.dev)
NEXT_PUBLIC_BUILDER_CODE=threadmaster
```

### Customization

Update `src/lib/wagmi.ts` to customize:
- **Chains** - Add more networks
- **Connectors** - Configure wallet providers
- **Metadata** - Update app name, icons, description

## 🧪 Testing

### Local Testing:
1. Start dev server: `npm run dev`
2. Navigate to "ERC-8021 Attribution"
3. Connect wallet (Base Sepolia recommended)
4. Send test transaction
5. Verify attribution on block explorer

### Test Networks:
- **Base Sepolia** - https://sepolia.basescan.org
- **Base Mainnet** - https://basescan.org

## 📚 Resources

### Official Documentation:
- [Base Builder Codes](https://docs.base.org/base-builder-codes)
- [ERC-8021 Spec](https://eips.ethereum.org/EIPS/eip-8021)
- [Wagmi Documentation](https://wagmi.sh)
- [ox/erc8021 API](https://oxlib.sh/erc8021)

### Base.dev Registration:
1. Visit https://base.dev
2. Register your app
3. Receive your builder code
4. Update `NEXT_PUBLIC_BUILDER_CODE`
5. Start earning from attributed transactions!

## 🐛 Troubleshooting

### Issue: "pino-pretty not found" warning
**Solution:** This is harmless - WalletConnect's internal logging. Ignore or install:
```bash
npm install pino-pretty --save-optional
```

### Issue: "Wallet not connecting"
**Solution:** 
- Check wallet is on correct network (Base/Base Sepolia)
- Verify WalletConnect Project ID is valid
- Try different connector (Injected vs WalletConnect)

### Issue: "Transaction fails silently"
**Solution:**
- Check builder code is valid
- Verify contract address and calldata
- Ensure wallet has sufficient funds (gas + value)
- Check network congestion

## 🚀 Next Steps

1. **Register on base.dev** → Get official builder code
2. **Update builder code** → Replace "threadmaster" with your code
3. **Test transactions** → Use Base Sepolia for testing
4. **Deploy to mainnet** → Go live on Base Mainnet
5. **Monitor analytics** → Track performance on base.dev

## 💡 Tips

- Use **Base Sepolia** for testing to avoid mainnet gas costs
- Implement **transaction history** to show past attributed transactions
- Add **rewards dashboard** to display earned attribution rewards
- Create **leaderboards** based on attributed transaction volume
- Consider **gasless transactions** for better UX (use relayers)

---

Built with 💜 by Thread Master Team | Powered by Base Builder Codes
