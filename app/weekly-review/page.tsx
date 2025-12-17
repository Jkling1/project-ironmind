'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, TrendingUp, Award, Clock, Target, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

interface WeeklyReview {
  week: {
    number: number;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
  };
  summary: {
    plannedLoad: number;
    actualLoad: number;
    plannedSessions: number;
    completedSessions: number;
    adherenceRate: number;
    totalDuration: number;
    totalDistance: number;
    avgReadiness: number | null;
    avgRPE: number | null;
  };
  highlights: {
    bestSession: any;
    worstSession: any;
    longestSession: any;
    sessionsByType: Record<string, number>;
  };
  checkins: {
    total: number;
    avgReadiness: number | null;
  };
  nextWeek: {
    startDate: string;
    endDate: string;
    plannedSessions: number;
    phase: string;
  };
  insights: string[];
}

export default function WeeklyReviewPage() {
  const [review, setReview] = useState<WeeklyReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [weekNumber, setWeekNumber] = useState<number | null>(null);

  useEffect(() => {
    fetchReview();
  }, [weekNumber]);

  async function fetchReview() {
    setLoading(true);
    try {
      const weekParam = weekNumber ? `?week=${weekNumber}` : '';
      const response = await fetch(`/api/weekly-review${weekParam}`);
      if (!response.ok) throw new Error('Failed to fetch review');

      const data = await response.json();
      setReview(data);
      if (!weekNumber) {
        setWeekNumber(data.week.number);
      }
    } catch (error) {
      console.error('Error fetching review:', error);
    } finally {
      setLoading(false);
    }
  }

  function goToPreviousWeek() {
    if (weekNumber && weekNumber > 1) {
      setWeekNumber(weekNumber - 1);
    }
  }

  function goToNextWeek() {
    if (weekNumber) {
      setWeekNumber(weekNumber + 1);
    }
  }

  function goToCurrentWeek() {
    setWeekNumber(null);
  }

  const getSessionIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'swim': return '🏊‍♂️';
      case 'bike': return '🚴‍♂️';
      case 'run': return '🏃‍♂️';
      case 'strength': return '💪';
      default: return '🏋️';
    }
  };

  if (loading || !review) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading review...</div>
      </div>
    );
  }

  const { week, summary, highlights, checkins, nextWeek, insights } = review;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                📊 Weekly Review
              </h1>
              <p className="text-white/60 text-lg">
                Reflect on your training and plan ahead
              </p>
            </div>
          </div>
        </motion.div>

        {/* Week Navigator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousWeek}
              disabled={week.number === 1}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <div className="text-center">
              <div className="text-sm text-white/60 mb-1">
                {new Date(week.startDate).toLocaleDateString()} - {new Date(week.endDate).toLocaleDateString()}
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                Week {week.number}
              </div>
              {week.isCurrent && (
                <span className="px-3 py-1 bg-green-500/20 border border-green-400/40 rounded-full text-green-400 text-xs font-bold">
                  Current Week
                </span>
              )}
              {!week.isCurrent && week.number < (weekNumber || 0) && (
                <button
                  onClick={goToCurrentWeek}
                  className="text-blue-400 text-sm hover:text-blue-300"
                >
                  Jump to Current Week
                </button>
              )}
            </div>

            <button
              onClick={goToNextWeek}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-white/60 text-sm">Adherence</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{summary.adherenceRate}%</div>
            <div className="text-xs text-white/60">
              {summary.completedSessions}/{summary.plannedSessions} sessions
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-white/60 text-sm">Total Time</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {Math.round(summary.totalDuration / 60)}h
            </div>
            <div className="text-xs text-white/60">{summary.totalDuration}min total</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-white/60 text-sm">Avg RPE</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {summary.avgRPE ? summary.avgRPE.toFixed(1) : 'N/A'}
            </div>
            <div className="text-xs text-white/60">Rate of Perceived Exertion</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
              <span className="text-white/60 text-sm">Readiness</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {summary.avgReadiness ? summary.avgReadiness : 'N/A'}
            </div>
            <div className="text-xs text-white/60">Average score</div>
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {/* Training Breakdown */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Training Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(highlights.sessionsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getSessionIcon(type)}</span>
                    <span className="text-white capitalize">{type}</span>
                  </div>
                  <span className="text-white/60">{count} sessions</span>
                </div>
              ))}
            </div>
          </div>

          {/* Best Session */}
          {highlights.bestSession && (
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">🌟 Best Session</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getSessionIcon(highlights.bestSession.type)}</span>
                  <span className="text-white capitalize font-semibold">{highlights.bestSession.type}</span>
                </div>
                <div className="text-white/80">
                  {highlights.bestSession.actual_duration}min
                  {highlights.bestSession.actual_distance && ` • ${highlights.bestSession.actual_distance.toFixed(1)}mi`}
                </div>
                <div className="text-green-400 font-semibold">
                  Feeling: {highlights.bestSession.feeling}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Insights & Recommendations</h3>
          </div>
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div key={index} className="text-white/80 leading-relaxed">
                {insight}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Next Week Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">📅 Next Week Preview</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="text-white/60 text-sm mb-1">Dates</div>
              <div className="text-white">
                {new Date(nextWeek.startDate).toLocaleDateString()} - {new Date(nextWeek.endDate).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-white/60 text-sm mb-1">Phase</div>
              <div className="text-white font-semibold">{nextWeek.phase}</div>
            </div>
            <div>
              <div className="text-white/60 text-sm mb-1">Planned Sessions</div>
              <div className="text-white font-semibold">{nextWeek.plannedSessions}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
