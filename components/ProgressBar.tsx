'use client';

import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

interface ProgressBarProps {
  dayIndex: number;
  totalDays: number;
  daysToRace: number;
  percentComplete: number;
  date: string;
}

export default function ProgressBar({
  dayIndex,
  totalDays,
  daysToRace,
  percentComplete,
  date
}: ProgressBarProps) {
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">
            YOU ARE HERE
          </h2>
          <p className="text-white/60">
            {formatDate(date)}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-xl">
          <Target className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 font-bold">
            {daysToRace} days to race
          </span>
        </div>
      </div>

      {/* Progress Info */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-white/60 text-sm mb-1">Day</div>
          <div className="text-white text-2xl font-bold">
            {dayIndex}
            <span className="text-white/40 text-lg ml-1">/ {totalDays}</span>
          </div>
        </div>
        <div>
          <div className="text-white/60 text-sm mb-1">Progress</div>
          <div className="text-white text-2xl font-bold">
            {percentComplete.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-white/60 text-sm mb-1">To Ironman</div>
          <div className="text-white text-2xl font-bold">
            {daysToRace}
            <span className="text-white/40 text-lg ml-1">days</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentComplete}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative"
          >
            {/* Animated shimmer effect */}
            <motion.div
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </motion.div>
        </div>

        {/* Milestone markers */}
        {[25, 50, 75].map((milestone) => (
          <div
            key={milestone}
            className="absolute top-0 h-3 w-0.5 bg-white/30"
            style={{ left: `${milestone}%` }}
          >
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white/40 whitespace-nowrap">
              {milestone}%
            </div>
          </div>
        ))}
      </div>

      {/* Motivational Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-white/70 text-sm">
          {percentComplete < 10 && "The journey of a thousand miles begins with a single step."}
          {percentComplete >= 10 && percentComplete < 25 && "Building the foundation. Trust the process."}
          {percentComplete >= 25 && percentComplete < 50 && "One quarter down. Momentum is building."}
          {percentComplete >= 50 && percentComplete < 75 && "Past the halfway point. You're becoming an Ironman."}
          {percentComplete >= 75 && percentComplete < 90 && "Final stretch. Everything you've done leads to this."}
          {percentComplete >= 90 && percentComplete < 100 && "Race week approaches. Stay calm. You're ready."}
          {percentComplete >= 100 && "Race day is here. Trust your training. You are an Ironman."}
        </p>
      </motion.div>
    </div>
  );
}
