import ProtectedRoute from '@/components/protected-route';
import TokenPurchaseSection from '@/components/token-purchase-section';

export default function BuyHKT() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TokenPurchaseSection />
        </div>
      </div>
    </ProtectedRoute>
  );
}