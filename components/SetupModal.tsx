'use client'

import { useState } from 'react'
import { format, addDays } from 'date-fns'

interface SetupModalProps {
  onComplete: (startDate: string, raceDate: string) => void
  onClose: () => void
}

export default function SetupModal({ onComplete, onClose }: SetupModalProps) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const defaultRaceDate = format(addDays(new Date(), 365), 'yyyy-MM-dd')

  const [startDate, setStartDate] = useState(today)
  const [raceDate, setRaceDate] = useState(defaultRaceDate)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(startDate, raceDate)
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-dark-card border border-neon-blue rounded-lg p-8 max-w-md w-full shadow-neon-blue">
        <h2 className="text-3xl font-bold text-neon-blue text-glow-blue mb-2">
          Welcome to IronMind
        </h2>
        <p className="text-gray-400 mb-8">
          Let's set up your transformation journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Training Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Ironman Race Date
            </label>
            <input
              type="date"
              value={raceDate}
              onChange={(e) => setRaceDate(e.target.value)}
              min={startDate}
              className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue text-neon-blue font-bold py-4 px-6 rounded-lg transition-all hover:shadow-neon-blue text-lg"
          >
            Begin Transformation
          </button>
        </form>
      </div>
    </div>
  )
}
