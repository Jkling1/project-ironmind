'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Zap, Calendar, Target, Loader2 } from 'lucide-react';

export default function GeneratePage() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Default values
  const [startDate, setStartDate] = useState('2025-12-17');
  const [raceDate, setRaceDate] = useState('2026-11-07');

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/protocol/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          startDate,
          raceDate,
          athleteProfile: {
            experience: 'intermediate',
            weeklyHoursBase: 10.0,
            weeklyHoursPeak: 16.0,
            availability: {
              longRideDay: 'saturday',
              strengthDays: ['monday', 'wednesday'],
              swimDays: ['monday', 'wednesday', 'friday']
            },
            constraints: {
              indoor: true,
              pool: true,
              gym: true
            },
            injuries: [],
            strengths: ['cycling', 'mental toughness'],
            weaknesses: ['swimming technique', 'run pacing'],
            equipment: {
              bike: 'Canyon Aeroad',
              wetsuit: true,
              powerMeter: true,
              hrMonitor: true
            },
            preferences: {
              morningPerson: true,
              preferredIntensity: 'moderate'
            }
          }
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate protocol');
      }

      const data = await response.json();
      setSuccess(true);

      // Redirect to today dashboard after 2 seconds
      setTimeout(() => {
        router.push('/today');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
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
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-4 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full mb-6">
            <Zap className="w-12 h-12 text-orange-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Generate Your Protocol
          </h1>
          <p className="text-white/70 text-lg">
            Create your personalized 326-day Ironman training plan in seconds
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          {!success ? (
            <>
              {/* Start Date */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-white font-semibold mb-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-white/60 text-sm mt-2">
                  When do you want to start training?
                </p>
              </div>

              {/* Race Date */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-white font-semibold mb-3">
                  <Target className="w-5 h-5 text-orange-400" />
                  Race Date
                </label>
                <input
                  type="date"
                  value={raceDate}
                  onChange={(e) => setRaceDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-white/60 text-sm mt-2">
                  Ironman Florida: November 7, 2026
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-6">
                <p className="text-blue-300 text-sm">
                  <strong>What you'll get:</strong> A complete 326-day training protocol with daily workouts,
                  nutrition guidance, recovery plans, and adaptive programming across 8 periodized phases.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 mb-6">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Generating Protocol...
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    Generate 326-Day Protocol
                  </>
                )}
              </button>

              <p className="text-white/40 text-xs text-center mt-4">
                This will take 10-30 seconds. Please wait...
              </p>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="inline-block p-4 bg-green-500/20 rounded-full mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  ✅
                </motion.div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Protocol Generated!
              </h2>
              <p className="text-white/70 mb-6">
                Your 326-day Ironman training plan is ready
              </p>
              <div className="text-white/60 text-sm">
                Redirecting to Today Dashboard...
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Back Link */}
        {!generating && !success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-6"
          >
            <a
              href="/"
              className="text-white/60 hover:text-white transition-colors"
            >
              ← Back to Home
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
