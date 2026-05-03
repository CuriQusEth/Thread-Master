'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Loading Skeleton for Transaction Cards
 */
export function TransactionSkeleton() {
  return (
    <Card className="border-purple-500/20 bg-purple-950/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Loading Skeleton for Wallet Connection
 */
export function WalletConnectSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
  );
}

/**
 * Loading Skeleton for Game Board
 */
export function GameBoardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}

/**
 * Loading Skeleton for Attribution Dashboard
 */
export function AttributionDashboardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
      </div>
      <Skeleton className="h-32 rounded-lg" />
    </div>
  );
}

/**
 * Page Loading State with Full Screen Skeleton
 */
export function PageLoader({ title = 'Loading...' }: { title?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-4 w-64 mx-auto" />
        <div className="flex gap-2 justify-center">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
