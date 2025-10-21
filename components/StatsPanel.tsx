'use client'

import { UserData } from '@/types'
import { getWeeklyData } from '@/lib/storage'
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts'
import { Trophy, Zap, Target, ThumbsUp } from 'lucide-react'

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
