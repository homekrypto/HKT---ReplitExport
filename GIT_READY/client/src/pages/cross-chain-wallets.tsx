import { useScrollToTop } from '@/hooks/useScrollToTop';
import CrossChainWalletManager from '@/components/cross-chain-wallet-manager';
import AuthGuard from '@/components/auth-guard';

export default function CrossChainWallets() {
  useScrollToTop();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white dark:bg-black py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CrossChainWalletManager />
        </div>
      </div>
    </AuthGuard>
  );
}