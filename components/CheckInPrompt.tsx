'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, Moon, Smile, Activity, Brain, X, Check } from 'lucide-react';

interface CheckInPromptProps {
  date: string;
  onCheckInComplete: () => void;
}

export default function CheckInPrompt({ date, onCheckInComplete }: CheckInPromptProps) {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [sleepDuration, setSleepDuration] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState(7);
  const [mood, setMood] = useState(7);
  const [overallSoreness, setOverallSoreness] = useState(3);
  const [stress, setStress] = useState(5);
  const [weight, setWeight] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          checkin: {
            sleep: {
              duration: sleepDuration,
              quality: sleepQuality
            },
            mood,
            soreness: {
              overall: overallSoreness
            },
            stress,
            weight: weight > 0 ? weight : null,
            notes: notes.trim() || null
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit check-in');
      }

      const data = await response.json();
      setShowModal(false);
      onCheckInComplete();

      // Show readiness score feedback
      if (data.readinessScore) {
        alert(`Check-in complete! Readiness Score: ${data.readinessScore}/100\n${data.readyToTrain ? '✅ Ready to train!' : '⚠️ Consider adjusting today\'s protocol'}`);
      }
    } catch (error) {
      console.error('Error submitting check-in:', error);
      alert('Failed to submit check-in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Prompt Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <ClipboardCheck className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Daily Check-In
              </h3>
              <p className="text-white/70 text-sm">
                How are you feeling today? (2 min)
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-green-500/20 border border-green-400/40 rounded-xl text-green-400 font-semibold">
            Start Check-In
          </div>
        </div>
      </motion.div>

      {/* Check-In Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Daily Check-In</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              <p className="text-white/70 mb-6">
                Help your protocol adapt to how you're really feeling. This takes 2 minutes and dramatically improves your training.
              </p>

              {/* Sleep Duration */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Moon className="w-5 h-5 text-blue-400" />
                  <label className="text-white font-semibold">
                    Sleep Duration
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="4"
                    max="12"
                    step="0.5"
                    value={sleepDuration}
                    onChange={(e) => setSleepDuration(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <div className="text-2xl font-bold text-white w-24 text-right">
                    {sleepDuration} hrs
                  </div>
                </div>
              </div>

              {/* Sleep Quality */}
              <div className="mb-6">
                <label className="text-white font-semibold mb-3 block">
                  Sleep Quality (1-10)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="text-2xl font-bold text-white w-12 text-center">
                    {sleepQuality}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>Terrible</span>
                  <span>Perfect</span>
                </div>
              </div>

              {/* Mood */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Smile className="w-5 h-5 text-yellow-400" />
                  <label className="text-white font-semibold">
                    Mood (1-10)
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={mood}
                    onChange={(e) => setMood(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="text-2xl font-bold text-white w-12 text-center">
                    {mood}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>Awful</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Soreness */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-5 h-5 text-orange-400" />
                  <label className="text-white font-semibold">
                    Overall Soreness (1-10)
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={overallSoreness}
                    onChange={(e) => setOverallSoreness(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="text-2xl font-bold text-white w-12 text-center">
                    {overallSoreness}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>No soreness</span>
                  <span>Very sore</span>
                </div>
              </div>

              {/* Stress */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <label className="text-white font-semibold">
                    Stress Level (1-10)
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stress}
                    onChange={(e) => setStress(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="text-2xl font-bold text-white w-12 text-center">
                    {stress}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>Relaxed</span>
                  <span>Very stressed</span>
                </div>
              </div>

              {/* Weight (optional) */}
              <div className="mb-6">
                <label className="text-white font-semibold mb-3 block">
                  Weight (lbs, optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weight || ''}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  placeholder="Leave blank to skip"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="text-white font-semibold mb-3 block">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything else? Injuries, concerns, wins?"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold text-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-6 h-6" />
                    Complete Check-In
                  </>
                )}
              </button>

              <p className="text-white/40 text-xs text-center mt-4">
                Your readiness score will be calculated and used to optimize today's training.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
