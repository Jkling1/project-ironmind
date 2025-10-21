'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface ReflectionModalProps {
  onSubmit: (reflection: string) => void
  onClose: () => void
}

export default function ReflectionModal({ onSubmit, onClose }: ReflectionModalProps) {
  const [reflection, setReflection] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (reflection.trim()) {
      onSubmit(reflection)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-dark-card border border-neon-purple rounded-lg p-8 max-w-md w-full shadow-neon-purple">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neon-purple text-glow-purple">
            Reflection Time
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-300 mb-6">
          Every setback is a setup for a comeback. Take a moment to reflect on what
          happened today and how you'll improve tomorrow.
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="What got in the way? What will you do differently tomorrow?"
            className="w-full bg-dark-bg border border-dark-border rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple min-h-[150px] mb-4"
            autoFocus
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-dark-bg hover:bg-dark-border border border-dark-border text-gray-400 font-bold py-3 px-6 rounded-lg transition-all"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={!reflection.trim()}
              className="flex-1 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple text-neon-purple font-bold py-3 px-6 rounded-lg transition-all hover:shadow-neon-purple disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
