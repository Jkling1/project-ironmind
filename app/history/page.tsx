'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Filter, TrendingUp, Award, Clock, MapPin } from 'lucide-react';

interface Session {
  id: number;
  type: string;
  date: string;
  day_index: number;
  phase_name: string;
  phase_color: string;
  planned_duration: number;
  actual_duration: number;
  planned_distance?: number;
  actual_distance?: number;
  rpe: number;
  feeling: string;
  notes?: string;
}

interface SessionStats {
  total_sessions: number;
  total_duration: number;
  total_distance: number;
  avg_duration: number;
  avg_distance: number;
  avg_rpe: number;
  longest_distance: number;
  longest_duration: number;
  feelingDistribution: Array<{ feeling: string; count: number }>;
  monthlyBreakdown: Array<{ month: string; count: number; total_duration: number; total_distance: number }>;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    fetchHistory();
  }, [selectedType]);

  async function fetchHistory() {
    setLoading(true);
    try {
      const typeParam = selectedType === 'all' ? '' : `?type=${selectedType}`;
      const response = await fetch(`/api/sessions/history${typeParam}`);
      if (!response.ok) throw new Error('Failed to fetch history');

      const data = await response.json();
      setSessions(data.sessions);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  }

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

  const getFeelingColor = (feeling: string) => {
    switch (feeling?.toLowerCase()) {
      case 'great': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'okay': return 'text-yellow-400';
      case 'tired': return 'text-orange-400';
      case 'struggled': return 'text-red-400';
      case 'pain': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading history...</div>
      </div>
    );
  }

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
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            📊 Session History
          </h1>
          <p className="text-white/60 text-lg">
            Review all your completed training sessions
          </p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span className="text-white/60 text-sm">Total Sessions</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.total_sessions}</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-white/60 text-sm">Total Time</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {Math.round(stats.total_duration / 60)}h
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-white/60 text-sm">Total Distance</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {Math.round(stats.total_distance || 0)}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <span className="text-white/60 text-sm">Avg RPE</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {stats.avg_rpe ? stats.avg_rpe.toFixed(1) : 'N/A'}
              </div>
            </div>
          </motion.div>
        )}

        {/* Type Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-8"
        >
          <Filter className="w-5 h-5 text-white/60" />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'swim', 'bike', 'run', 'strength'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  selectedType === type
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {type === 'all' ? 'All' : getSessionIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sessions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {sessions.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              No sessions logged yet. Start training to see your history!
            </div>
          ) : (
            sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between">
                  {/* Left: Session Info */}
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{getSessionIcon(session.type)}</div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-bold capitalize">{session.type}</h3>
                        <span
                          className="px-2 py-1 text-xs font-bold rounded"
                          style={{
                            backgroundColor: `${session.phase_color}30`,
                            color: session.phase_color
                          }}
                        >
                          {session.phase_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span>📅 {new Date(session.date).toLocaleDateString()}</span>
                        <span>Day {session.day_index}</span>
                      </div>
                      {session.notes && (
                        <p className="text-sm text-white/70 mt-2 italic">"{session.notes}"</p>
                      )}
                    </div>
                  </div>

                  {/* Right: Stats */}
                  <div className="text-right">
                    <div className="flex items-center gap-4 mb-2">
                      <div>
                        <div className="text-xs text-white/60">Duration</div>
                        <div className="text-white font-semibold">{session.actual_duration}min</div>
                      </div>
                      {session.actual_distance && (
                        <div>
                          <div className="text-xs text-white/60">Distance</div>
                          <div className="text-white font-semibold">
                            {session.actual_distance.toFixed(1)} {session.type === 'swim' ? 'yd' : 'mi'}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-white/60">RPE</div>
                        <div className="text-white font-semibold">{session.rpe}/10</div>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${getFeelingColor(session.feeling)}`}>
                      {session.feeling?.charAt(0).toUpperCase() + session.feeling?.slice(1)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
