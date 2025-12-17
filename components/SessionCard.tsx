'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Check, Clock, MapPin, Zap, Heart, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface Session {
  id: number;
  type: string;
  order: number;
  planned_duration: number;
  planned_distance?: number;
  planned_intensity: string;
  planned_zones: any;
  planned_description: string;
  planned_purpose: string;
  planned_alternatives?: string;
  completed: boolean;
}

interface SessionCardProps {
  session: Session;
  index: number;
  onComplete: () => void;
}

export default function SessionCard({ session, index, onComplete }: SessionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logging, setLogging] = useState(false);

  // Form state
  const [duration, setDuration] = useState(session.planned_duration);
  const [distance, setDistance] = useState(session.planned_distance || 0);
  const [rpe, setRpe] = useState(5);
  const [feeling, setFeeling] = useState('good');
  const [notes, setNotes] = useState('');

  const getSessionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'swim': return '🏊‍♂️';
      case 'bike': return '🚴‍♂️';
      case 'run': return '🏃‍♂️';
      case 'strength': return '💪';
      case 'brick': return '🧱';
      default: return '🏋️';
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity.toLowerCase()) {
      case 'easy':
      case 'recovery':
        return 'from-green-500/20 to-emerald-500/20 border-green-400/30';
      case 'moderate':
      case 'tempo':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-400/30';
      case 'threshold':
      case 'interval':
        return 'from-orange-500/20 to-red-500/20 border-orange-400/30';
      default:
        return 'from-gray-500/20 to-slate-500/20 border-gray-400/30';
    }
  };

  const handleLogSession = async () => {
    setLogging(true);
    try {
      const response = await fetch('/api/sessions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          actual: {
            duration,
            distance: distance > 0 ? distance : null,
            rpe,
            feeling,
            notes: notes.trim() || null
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to log session');
      }

      setShowLogModal(false);
      onComplete();
    } catch (error) {
      console.error('Error logging session:', error);
      alert('Failed to log session. Please try again.');
    } finally {
      setLogging(false);
    }
  };

  const zones = Array.isArray(session.planned_zones)
    ? session.planned_zones
    : (typeof session.planned_zones === 'string' ? [session.planned_zones] : []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`bg-gradient-to-br ${getIntensityColor(session.planned_intensity)} backdrop-blur-xl border rounded-2xl overflow-hidden`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{getSessionIcon(session.type)}</div>
              <div>
                <h3 className="text-xl font-bold text-white capitalize">
                  {session.type} {session.planned_intensity && `• ${session.planned_intensity}`}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-white/60 text-sm">
                  {session.planned_duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{session.planned_duration} min</span>
                    </div>
                  )}
                  {session.planned_distance && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{session.planned_distance} {session.type === 'swim' ? 'yd' : 'mi'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {session.completed ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/40 rounded-xl">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">Complete</span>
              </div>
            ) : (
              <button
                onClick={() => setShowLogModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
              >
                <Play className="w-4 h-4" />
                Log Session
              </button>
            )}
          </div>

          {/* Description */}
          <p className="text-white/80 mb-3 leading-relaxed">
            {session.planned_description}
          </p>

          {/* Zones */}
          {zones.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-white/70">Training Zones</span>
              </div>
              <div className="space-y-1">
                {zones.map((zone: string, i: number) => (
                  <div key={i} className="text-sm text-white/60 pl-6">
                    • {zone}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expand/Collapse */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors mt-4"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {expanded ? 'Show less' : 'Show more details'}
          </button>

          {/* Expanded Details */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                  {/* Purpose */}
                  <div>
                    <div className="text-sm font-semibold text-white/70 mb-1">Purpose</div>
                    <div className="text-sm text-white/60">{session.planned_purpose}</div>
                  </div>

                  {/* Alternatives */}
                  {session.planned_alternatives && (
                    <div>
                      <div className="text-sm font-semibold text-white/70 mb-1">Alternatives</div>
                      <div className="text-sm text-white/60">{session.planned_alternatives}</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Log Session Modal */}
      <AnimatePresence>
        {showLogModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowLogModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Log {session.type.charAt(0).toUpperCase() + session.type.slice(1)} Session
              </h2>

              {/* Duration */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white/70 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Distance (if applicable) */}
              {session.planned_distance && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-white/70 mb-2">
                    Distance ({session.type === 'swim' ? 'yards' : 'miles'})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={distance}
                    onChange={(e) => setDistance(parseFloat(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* RPE */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white/70 mb-2">
                  Rate of Perceived Exertion (1-10)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={rpe}
                    onChange={(e) => setRpe(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="text-2xl font-bold text-white w-12 text-center">
                    {rpe}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>Very Easy</span>
                  <span>Maximal</span>
                </div>
              </div>

              {/* Feeling */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white/70 mb-2">
                  How did you feel?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['great', 'good', 'okay', 'tired', 'struggled', 'pain'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFeeling(f)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                        feeling === f
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white/70 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did it go? Any observations?"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogModal(false)}
                  disabled={logging}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogSession}
                  disabled={logging}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {logging ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Complete Session
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
