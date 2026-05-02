# 🚀 Quick Start: Wagmi + ERC-8021 Attribution

Get started with attributed transactions in **2 minutes**!

## ⚡ Installation

Already done! These packages are pre-installed:
```bash
✅ wagmi@2.14.13
✅ viem@2.22.11  
✅ ox@0.10.0
✅ @tanstack/react-query@5.62.15
```

## 📝 Step 1: Import the Hook

```typescript
import { useSendAttributedTransaction } from '@/hooks/useSendAttributedTransaction';
```

## 🔌 Step 2: Connect Wallet (Optional in UI)

The `SendAttributedTxExample` component handles this:
- Click "ERC-8021 Attribution" on game start screen
- Choose wallet: Coinbase, MetaMask, or WalletConnect
- Approve connection

## 💸 Step 3: Send Transaction

```typescript
function MyComponent() {
  const { sendAttributedTransaction, isPending, isSuccess } = 
    useSendAttributedTransaction();

  const handleSend = async () => {
    await sendAttributedTransaction({
      to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
      data: '0xdeadbeef',
      builderCode: 'threadmaster', // Replace with your code from base.dev
    });
  };

  return (
    <button onClick={handleSend} disabled={isPending}>
      {isPending ? 'Sending...' : 'Send Transaction'}
    </button>
  );
}
```

## 🎮 Live Demo

Already integrated in Thread Master!

1. **Launch the app**
2. **Click "ERC-8021 Attribution"** button
3. **Connect wallet**
4. **Fill transaction details:**
   - Recipient: `0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC`
   - Calldata: `0xdeadbeef`
   - Builder Code: `threadmaster`
5. **Click "Send with Attribution"**
6. **View transaction ID** ✨

## 📖 Common Use Cases

### Use Case 1: NFT Minting
```typescript
import { encodeFunctionData } from 'viem';
import { useSendAttributedTransaction } from '@/hooks/useSendAttributedTransaction';

const { sendAttributedTransaction } = useSendAttributedTransaction();

// Mint NFT with attribution
const mintNFT = async () => {
  const data = encodeFunctionData({
    abi: nftAbi,
    functionName: 'mint',
    args: [recipient],
  });

  await sendAttributedTransaction({
    to: NFT_CONTRACT_ADDRESS,
    data,
    builderCode: 'threadmaster',
  });
};
```

### Use Case 2: Token Transfer
```typescript
// Send ETH with attribution
await sendAttributedTransaction({
  to: '0x...',
  data: '0x',
  value: parseEther('0.1'),
  builderCode: 'threadmaster',
});
```

### Use Case 3: Multi-Entity (App + Wallet)
```typescript
const { sendMultiAttributed } = useSendAttributedTransaction();

await sendMultiAttributed({
  to: '0x...',
  data: '0x...',
  appCode: 'threadmaster',
  walletCode: 'player', // Both get credit!
});
```

## 🔧 Customization

### Replace Builder Code

Update your builder code after registering on [base.dev](https://base.dev):

```typescript
// Before (example code)
builderCode: 'threadmaster'

// After (your real code from base.dev)
builderCode: 'bc_aisit0mq'
```

### Pre-configured Helper

Use the Thread Master helper for automatic builder code:

```typescript
import { useThreadMasterTransaction } from '@/hooks/useSendAttributedTransaction';

const { sendTransaction } = useThreadMasterTransaction();

// Builder code already set!
await sendTransaction({
  to: '0x...',
  data: '0x...',
});
```

## ✅ That's It!

You're now sending attributed transactions with Base Builder Codes.

### Next Steps:
1. ✅ **Register on base.dev** → Get your official builder code
2. ✅ **Replace "threadmaster"** → Use your real code
3. ✅ **Test on Base Sepolia** → Safe testing environment
4. ✅ **Deploy to mainnet** → Go live!
5. ✅ **Track analytics** → View rewards on base.dev

## 📚 Need More?

- **Full Documentation**: [WAGMI_INTEGRATION.md](./WAGMI_INTEGRATION.md)
- **ERC-8021 Spec**: [ERC8021_INTEGRATION.md](./ERC8021_INTEGRATION.md)
- **Base Docs**: https://docs.base.org/base-builder-codes
- **Wagmi Docs**: https://wagmi.sh

## 🆘 Quick Troubleshooting

**Q: Wallet not connecting?**  
A: Ensure you're on Base/Base Sepolia network.

**Q: Transaction failing?**  
A: Check builder code format and calldata validity.

**Q: "pino-pretty" warning?**  
A: Safe to ignore - WalletConnect internal logging.

---

**Built with 💜 | Ready in 2 minutes** ⚡
