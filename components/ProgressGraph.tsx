'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Target, Zap } from 'lucide-react';

interface GraphDataPoint {
  week: number;
  loadTarget: number;
  loadActual: number | null;
  adherenceRate: number | null;
  isCurrentWeek: boolean;
  isPastWeek: boolean;
  isFutureWeek: boolean;
}

interface ProtocolInfo {
  id: number;
  startDate: string;
  raceDate: string;
  totalDays: number;
}

interface ProgressGraphProps {
  weeks?: number;
}

export default function ProgressGraph({ weeks = 12 }: ProgressGraphProps) {
  const [graphData, setGraphData] = useState<GraphDataPoint[]>([]);
  const [protocol, setProtocol] = useState<ProtocolInfo | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [totalWeeks, setTotalWeeks] = useState(47);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'line' | 'bar'>('line');

  useEffect(() => {
    fetchProgressData();
  }, [weeks]);

  async function fetchProgressData() {
    try {
      const response = await fetch(`/api/progress/graph?weeks=${weeks}`);
      if (!response.ok) {
        throw new Error('Failed to fetch progress data');
      }
      const data = await response.json();
      setGraphData(data.graphData);
      setProtocol(data.protocol);
      setCurrentWeek(data.currentWeek);
      setTotalWeeks(data.totalWeeks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Calculate statistics
  const stats = {
    avgPlannedLoad: 0,
    avgActualLoad: 0,
    avgAdherence: 0,
    totalWeeksCompleted: 0,
    trend: 0
  };

  if (graphData.length > 0) {
    const pastWeeks = graphData.filter(d => d.isPastWeek && d.loadActual !== null);
    stats.avgPlannedLoad = Math.round(graphData.reduce((sum, d) => sum + d.loadTarget, 0) / graphData.length);
    stats.avgActualLoad = pastWeeks.length > 0
      ? Math.round(pastWeeks.reduce((sum, d) => sum + (d.loadActual || 0), 0) / pastWeeks.length)
      : 0;
    stats.avgAdherence = pastWeeks.length > 0
      ? Math.round(pastWeeks.reduce((sum, d) => sum + (d.adherenceRate || 0), 0) / pastWeeks.length)
      : 0;
    stats.totalWeeksCompleted = pastWeeks.length;

    // Calculate trend (comparing last 3 weeks to previous 3)
    if (pastWeeks.length >= 6) {
      const recent = pastWeeks.slice(-3);
      const previous = pastWeeks.slice(-6, -3);
      const recentAvg = recent.reduce((sum, d) => sum + (d.loadActual || 0), 0) / 3;
      const previousAvg = previous.reduce((sum, d) => sum + (d.loadActual || 0), 0) / 3;
      stats.trend = ((recentAvg - previousAvg) / previousAvg) * 100;
    }
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-xl">
          <p className="text-white font-bold mb-2">Week {data.week}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-white/70 text-sm">Planned Load:</span>
              <span className="text-white font-semibold">{data.loadTarget}</span>
            </div>
            {data.loadActual !== null && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-white/70 text-sm">Actual Load:</span>
                  <span className="text-white font-semibold">{data.loadActual}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span className="text-white/70 text-sm">Adherence:</span>
                  <span className="text-white font-semibold">{data.adherenceRate}%</span>
                </div>
              </>
            )}
            {data.isCurrentWeek && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <span className="text-yellow-400 text-xs font-semibold">← Current Week</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-white/60">Loading progress data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
        <p className="text-red-400">Error loading progress: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-white/60 text-sm">Avg Planned</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.avgPlannedLoad}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-white/60 text-sm">Avg Actual</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.avgActualLoad}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-white/60 text-sm">Adherence</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.avgAdherence}%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            {stats.trend >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className="text-white/60 text-sm">Trend</span>
          </div>
          <div className={`text-2xl font-bold ${stats.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.trend >= 0 ? '+' : ''}{stats.trend.toFixed(1)}%
          </div>
        </motion.div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">
            Training Load (Week {currentWeek} of {totalWeeks})
          </h3>
          <p className="text-white/60 text-sm">
            Showing {weeks} weeks • {stats.totalWeeksCompleted} weeks completed
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('line')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              viewMode === 'line'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setViewMode('bar')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              viewMode === 'bar'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      {/* Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <ResponsiveContainer width="100%" height={400}>
          {viewMode === 'line' ? (
            <AreaChart data={graphData}>
              <defs>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="week"
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ color: '#fff' }}
                iconType="circle"
              />

              {/* Current week indicator */}
              {graphData.find(d => d.isCurrentWeek) && (
                <ReferenceLine
                  x={graphData.find(d => d.isCurrentWeek)?.week}
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{
                    value: 'Current Week',
                    fill: '#F59E0B',
                    fontSize: 12,
                    position: 'top'
                  }}
                />
              )}

              <Area
                type="monotone"
                dataKey="loadTarget"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#colorTarget)"
                name="Planned Load"
              />
              <Area
                type="monotone"
                dataKey="loadActual"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#colorActual)"
                name="Actual Load"
                connectNulls
              />
            </AreaChart>
          ) : (
            <BarChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="week"
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ color: '#fff' }}
                iconType="circle"
              />

              {/* Current week indicator */}
              {graphData.find(d => d.isCurrentWeek) && (
                <ReferenceLine
                  x={graphData.find(d => d.isCurrentWeek)?.week}
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              )}

              <Bar
                dataKey="loadTarget"
                fill="#3B82F6"
                name="Planned Load"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="loadActual"
                fill="#10B981"
                name="Actual Load"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </motion.div>

      {/* Insights */}
      {stats.totalWeeksCompleted > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-6"
        >
          <h4 className="text-white font-bold mb-3">Insights</h4>
          <div className="space-y-2 text-white/80 text-sm">
            {stats.avgAdherence >= 80 && (
              <p>✅ Outstanding adherence! You're completing {stats.avgAdherence}% of planned training.</p>
            )}
            {stats.avgAdherence >= 60 && stats.avgAdherence < 80 && (
              <p>👍 Good adherence at {stats.avgAdherence}%. Keep pushing for 80%+.</p>
            )}
            {stats.avgAdherence < 60 && stats.avgAdherence > 0 && (
              <p>⚠️ Adherence at {stats.avgAdherence}%. Consider adjusting your protocol or schedule.</p>
            )}
            {stats.trend > 10 && (
              <p>📈 Training load increasing by {stats.trend.toFixed(1)}% - great progression!</p>
            )}
            {stats.trend < -10 && (
              <p>📉 Training load decreased by {Math.abs(stats.trend).toFixed(1)}%. Recovery week or planned taper?</p>
            )}
            <p>📊 You've completed {stats.totalWeeksCompleted} of {totalWeeks} training weeks ({((stats.totalWeeksCompleted / totalWeeks) * 100).toFixed(1)}%).</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
