'use client'

import { UserData } from '@/types'
import { getWeeklyData } from '@/lib/storage'
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts'
import { Trophy, Zap, Target, ThumbsUp, Flame, Wine, UtensilsCrossed } from 'lucide-react'

interface StatsPanelProps {
  userData: UserData
  onProps: () => void
  propsCount: number
}

export default function StatsPanel({ userData, onProps, propsCount }: StatsPanelProps) {
  const weeklyData = getWeeklyData(userData)
  const progressPercent = Math.round((userData.totalDaysCompleted / 365) * 100)

  return (
    <div className="space-y-6">
      <div className="bg-dark-card border border-dark-border rounded-lg p-6">
        <h2 className="text-2xl font-bold text-neon-purple text-glow-purple mb-6">
          Mission Control
        </h2>

        <div className="space-y-6">
          {/* Streaks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-neon-blue" />
                <span className="text-gray-400">Current Streak</span>
              </div>
              <span className="text-2xl font-bold text-neon-blue text-glow-blue">
                {userData.currentStreak}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-neon-purple" />
                <span className="text-gray-400">Longest Streak</span>
              </div>
              <span className="text-2xl font-bold text-neon-purple text-glow-purple">
                {userData.longestStreak}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-neon-green" />
                <span className="text-gray-400">Days Completed</span>
              </div>
              <span className="text-2xl font-bold text-neon-green text-glow-green">
                {userData.totalDaysCompleted}
              </span>
            </div>
          </div>

          {/* IronMind Streaks */}
          <div className="pt-4 border-t border-dark-border space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
              IronMind Streaks
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-gray-400">Training</span>
              </div>
              <span className="text-lg font-bold text-orange-400">
                {userData.streaks.training_streak_days} days
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wine className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Alcohol-Free</span>
              </div>
              <span className="text-lg font-bold text-blue-400">
                {userData.streaks.alcohol_free_streak_days} days
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Home-Cooked</span>
              </div>
              <span className="text-lg font-bold text-green-400">
                {userData.streaks.home_cooked_streak_days} days
              </span>
            </div>

            {userData.streaks.training_streak_days >= 7 && (
              <div className="bg-neon-blue/10 border border-neon-blue rounded p-2 mt-2">
                <p className="text-xs text-neon-blue text-center">
                  Streak: {userData.streaks.training_streak_days} days aligned. This is how people quietly become dangerous.
                </p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="pt-4 border-t border-dark-border">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Overall Progress</span>
              <span className="text-neon-blue font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink transition-all duration-500 shadow-neon-blue"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Weekly Graph */}
          <div className="pt-4 border-t border-dark-border">
            <h3 className="text-sm text-gray-400 mb-4">Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={weeklyData}>
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={false}
                />
                <Bar dataKey="completed" fill="#00f0ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Props Button */}
          <div className="pt-4 border-t border-dark-border">
            <button
              onClick={onProps}
              className="w-full bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink text-neon-pink font-bold py-3 px-6 rounded-lg transition-all hover:shadow-neon-pink flex items-center justify-center gap-2"
            >
              <ThumbsUp className="w-5 h-5" />
              Give Props ({propsCount})
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Celebrate your progress!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
