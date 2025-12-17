'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <motion.div
      animate={{
        opacity: [0.4, 0.6, 0.4],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`bg-white/10 rounded ${className}`}
    />
  );
}

export function SessionCardSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-24 h-4" />
          </div>
        </div>
        <Skeleton className="w-24 h-10 rounded-xl" />
      </div>
      <Skeleton className="w-full h-4 mb-2" />
      <Skeleton className="w-3/4 h-4" />
    </div>
  );
}

export function ProgressBarSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <Skeleton className="w-32 h-8" />
          <Skeleton className="w-48 h-4" />
        </div>
        <Skeleton className="w-32 h-10 rounded-xl" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-24 h-8" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-24 h-8" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-24 h-8" />
        </div>
      </div>
      <Skeleton className="w-full h-3 rounded-full" />
    </div>
  );
}

export function PhaseIndicatorSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-64 h-4" />
          </div>
        </div>
        <Skeleton className="w-24 h-8 rounded-xl" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <ProgressBarSkeleton />
      <PhaseIndicatorSkeleton />
      <div className="space-y-4">
        <SessionCardSkeleton />
        <SessionCardSkeleton />
      </div>
    </div>
  );
}
