'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, LayoutDashboard, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
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
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            PROJECT IRONMIND
          </h1>
          <p className="text-white/70 text-xl">
            Your AI-powered Ironman training OS
          </p>
        </motion.div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Today Dashboard */}
          <Link href="/today">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 cursor-pointer group"
            >
              <div className="p-4 bg-blue-500/20 rounded-xl w-fit mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Today Dashboard</h2>
              <p className="text-white/70">
                View today's training protocol, log sessions, and complete your daily check-in.
              </p>
              <div className="mt-6 text-blue-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Open Dashboard
                <span>→</span>
              </div>
            </motion.div>
          </Link>

          {/* Mission Control */}
          <Link href="/mission-control">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 cursor-pointer group"
            >
              <div className="p-4 bg-purple-500/20 rounded-xl w-fit mb-4 group-hover:bg-purple-500/30 transition-colors">
                <LayoutDashboard className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Mission Control</h2>
              <p className="text-white/70">
                Overview of your entire training journey, progress graphs, and analytics.
              </p>
              <div className="mt-6 text-purple-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Open Mission Control
                <span>→</span>
              </div>
            </motion.div>
          </Link>

          {/* Progress & Analytics */}
          <Link href="/progress">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 cursor-pointer group"
            >
              <div className="p-4 bg-green-500/20 rounded-xl w-fit mb-4 group-hover:bg-green-500/30 transition-colors">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Progress & Analytics</h2>
              <p className="text-white/70">
                Track your training load, streaks, badges, and performance trends.
              </p>
              <div className="mt-6 text-green-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                View Progress
                <span>→</span>
              </div>
            </motion.div>
          </Link>

          {/* Generate Protocol */}
          <Link href="/generate">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-orange-500/20 to-pink-500/20 border border-orange-400/30 rounded-2xl p-8 cursor-pointer group"
            >
              <div className="text-4xl mb-4">⚡</div>
              <h2 className="text-2xl font-bold text-white mb-2">Generate Protocol</h2>
              <p className="text-white/70">
                Create your personalized 326-day Ironman training plan.
              </p>
              <div className="mt-6 text-orange-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Generate Now
                <span>→</span>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-4">
            <p className="text-white/60 text-sm mb-2">Next Up</p>
            <p className="text-white text-lg font-semibold">
              Visit Today Dashboard to start your training
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
