'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Award, Flame } from 'lucide-react';
import ProgressGraph from '@/components/ProgressGraph';
import Link from 'next/link';

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Progress & Analytics
          </h1>
          <p className="text-white/60 text-lg">
            Track your training load, adherence, and performance trends
          </p>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <Link href="/today">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-semibold">Today</div>
                  <div className="text-white/60 text-xs">Daily training</div>
                </div>
              </div>
            </div>
          </Link>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-white font-semibold">Progress</div>
                <div className="text-white/60 text-xs">Active view</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-white font-semibold">Badges</div>
                <div className="text-white/60 text-xs">Coming soon</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="text-white font-semibold">Streaks</div>
                <div className="text-white/60 text-xs">Coming soon</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Progress Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProgressGraph weeks={12} />
        </motion.div>
      </div>
    </div>
  );
}
