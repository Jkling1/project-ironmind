'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Award, Lock, TrendingUp } from 'lucide-react';

interface Badge {
  key: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  tier?: string;
  earned: boolean;
  progress: number;
}

interface BadgeStats {
  total: number;
  earned: number;
  remaining: number;
  percentage: number;
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [byCategory, setByCategory] = useState<Record<string, Badge[]>>({});
  const [nextBadge, setNextBadge] = useState<Badge | null>(null);
  const [stats, setStats] = useState<BadgeStats>({ total: 0, earned: 0, remaining: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchBadges();
  }, []);

  async function fetchBadges() {
    try {
      const response = await fetch('/api/badges');
      if (!response.ok) throw new Error('Failed to fetch badges');

      const data = await response.json();
      setBadges(data.badges);
      setByCategory(data.byCategory);
      setNextBadge(data.nextBadge);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  }

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'bronze': return 'from-amber-600 to-yellow-700';
      case 'silver': return 'from-gray-400 to-gray-500';
      case 'gold': return 'from-yellow-400 to-yellow-500';
      case 'platinum': return 'from-purple-400 to-purple-500';
      default: return 'from-blue-400 to-blue-500';
    }
  };

  const displayBadges = selectedCategory === 'all'
    ? badges
    : byCategory[selectedCategory] || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading badges...</div>
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
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            🏆 Badge Gallery
          </h1>
          <p className="text-white/60 text-lg">
            Earn badges by crushing your training goals
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-white/60 text-sm">Earned</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.earned}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-white/60 text-sm">Locked</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.remaining}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-white/60 text-sm">Progress</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.percentage}%</div>
          </div>

          {nextBadge && (
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-400/30 rounded-xl p-4">
              <div className="text-white/80 text-sm mb-1">Next Badge</div>
              <div className="text-lg font-bold text-white">{nextBadge.name}</div>
              <div className="text-xs text-white/60 mt-1">{nextBadge.progress}% complete</div>
            </div>
          )}
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-2"
        >
          {['all', 'streaks', 'volume', 'milestones', 'consistency', 'special'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Badges Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {displayBadges.map((badge, index) => (
            <motion.div
              key={badge.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`relative rounded-2xl p-6 text-center ${
                badge.earned
                  ? `bg-gradient-to-br ${getTierColor(badge.tier)} border border-white/20`
                  : 'bg-white/5 backdrop-blur-xl border border-white/10'
              }`}
            >
              {/* Badge Icon */}
              <div className={`text-6xl mb-3 ${!badge.earned ? 'opacity-30 grayscale' : ''}`}>
                {badge.earned ? badge.icon : '🔒'}
              </div>

              {/* Badge Name */}
              <h3 className={`font-bold mb-2 ${badge.earned ? 'text-white' : 'text-white/60'}`}>
                {badge.name}
              </h3>

              {/* Badge Description */}
              <p className={`text-sm mb-3 ${badge.earned ? 'text-white/80' : 'text-white/40'}`}>
                {badge.description}
              </p>

              {/* Progress Bar (if not earned) */}
              {!badge.earned && badge.progress > 0 && (
                <div className="mt-4">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-white/60 mt-1">{badge.progress}%</div>
                </div>
              )}

              {/* Tier Badge */}
              {badge.tier && badge.earned && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/30 rounded-full text-xs font-bold text-white">
                  {badge.tier.toUpperCase()}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {displayBadges.length === 0 && (
          <div className="text-center py-12 text-white/60">
            No badges in this category yet
          </div>
        )}
      </div>
    </div>
  );
}
