'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SessionCard from '@/components/SessionCard';
import PhaseIndicator from '@/components/PhaseIndicator';
import ProgressBar from '@/components/ProgressBar';
import CheckInPrompt from '@/components/CheckInPrompt';
import { Calendar, TrendingUp, Flame } from 'lucide-react';

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

interface DailyProtocol {
  id: number;
  date: string;
  day_index: number;
  days_to_race: number;
  percent_complete: number;
  phase_key: string;
  phase_name: string;
  phase_color: string;
  week_number: number;
  week_day_number: number;
  is_recovery_week: boolean;
  daily_load_target: number;
  nutrition: any;
  recovery: any;
  mindset: any;
  admin: string[];
  guardrails: any;
  why_this_day_matters: string;
  coach_note: string;
  sessions: Session[];
}

interface Streak {
  training_current: number;
  checkin_current: number;
}

export default function TodayDashboard() {
  const [protocol, setProtocol] = useState<DailyProtocol | null>(null);
  const [streaks, setStreaks] = useState<Streak>({ training_current: 0, checkin_current: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTodayProtocol();
    checkIfCheckedIn();
    fetchStreaks();
  }, []);

  async function fetchTodayProtocol() {
    try {
      const response = await fetch(`/api/protocol/${today}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No protocol found. Generate your protocol first.');
        }
        throw new Error('Failed to fetch protocol');
      }
      const data = await response.json();
      setProtocol(data.protocol);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function checkIfCheckedIn() {
    try {
      const response = await fetch(`/api/checkins?date=${today}`);
      setHasCheckedIn(response.ok);
    } catch (err) {
      setHasCheckedIn(false);
    }
  }

  async function fetchStreaks() {
    // TODO: Implement streaks API endpoint
    // For now, use mock data
    setStreaks({ training_current: 0, checkin_current: 0 });
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function getDayName(dayNum: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum];
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white text-2xl font-light"
        >
          Loading your protocol...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
        >
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-2">Protocol Not Found</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <a
            href="/generate"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            Generate Your Protocol
          </a>
        </motion.div>
      </div>
    );
  }

  if (!protocol) return null;

  const completedSessions = protocol.sessions.filter(s => s.completed).length;
  const totalSessions = protocol.sessions.length;
  const sessionsProgress = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🏊‍♂️ PROJECT IRONMIND
          </h1>
          <p className="text-white/60 text-lg">Your daily training OS</p>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <ProgressBar
            dayIndex={protocol.day_index}
            totalDays={326}
            daysToRace={protocol.days_to_race}
            percentComplete={protocol.percent_complete}
            date={protocol.date}
          />
        </motion.div>

        {/* Phase Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <PhaseIndicator
            phaseKey={protocol.phase_key}
            phaseName={protocol.phase_name}
            phaseColor={protocol.phase_color}
            weekNumber={protocol.week_number}
            dayName={getDayName(protocol.week_day_number)}
            daysToRace={protocol.days_to_race}
            isRecoveryWeek={protocol.is_recovery_week}
          />
        </motion.div>

        {/* Check-in Prompt */}
        {!hasCheckedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <CheckInPrompt
              date={protocol.date}
              onCheckInComplete={() => setHasCheckedIn(true)}
            />
          </motion.div>
        )}

        {/* Today's Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Today's Sessions</h2>
            {totalSessions > 0 && (
              <span className="ml-auto text-sm text-white/60">
                {completedSessions}/{totalSessions} complete
              </span>
            )}
          </div>

          {protocol.sessions.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🛌</div>
              <h3 className="text-white text-xl font-bold mb-2">Rest Day</h3>
              <p className="text-white/70">
                Your body adapts during recovery, not during training. Today you get stronger by doing nothing.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {protocol.sessions.map((session, index) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  index={index}
                  onComplete={() => fetchTodayProtocol()}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Why Today Matters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Why Today Matters</h3>
                <p className="text-white/80 leading-relaxed">
                  {protocol.why_this_day_matters}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Coach Note */}
        {protocol.coach_note && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💬</div>
                <div>
                  <h3 className="text-lg font-semibold text-white/90 mb-1">Coach's Note</h3>
                  <p className="text-white/70 italic">"{protocol.coach_note}"</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Streaks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Flame className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl font-bold text-white">Streaks</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-1">
                  {streaks.training_current}
                </div>
                <div className="text-white/60 text-sm">Training Days</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {streaks.checkin_current}
                </div>
                <div className="text-white/60 text-sm">Check-ins</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mindset */}
        {protocol.mindset && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Today's Mindset</h3>
              {protocol.mindset.affirmation && (
                <p className="text-white/80 text-lg font-medium mb-2">
                  "{protocol.mindset.affirmation}"
                </p>
              )}
              {protocol.mindset.prompt && (
                <p className="text-white/60 text-sm">
                  Reflection: {protocol.mindset.prompt}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
