// API Route: GET /api/badges
// Returns all badges with earned status and progress

import { NextRequest, NextResponse } from 'next/server';
import { getAllStreaks, getUserBadges as getUserBadgesFromDb } from '@/lib/database/operations';
import { getUserBadges, getNextBadgeToEarn, BADGES } from '@/lib/badges';
import db from '@/lib/database/db';

export async function GET(request: NextRequest) {
  try {
    const userId = 1; // TODO: Get from auth session

    // Get user stats
    const stats = calculateUserStats(userId);

    // Get earned badges from database
    const earnedBadgesFromDb = getUserBadgesFromDb(userId);
    const earnedBadgeKeys = earnedBadgesFromDb.map((b: any) => b.badge_key);

    // Get all badges with earned status and progress
    const badges = getUserBadges(stats, earnedBadgeKeys);

    // Get next badge to earn
    const nextBadge = getNextBadgeToEarn(stats, earnedBadgeKeys);

    // Group by category
    const byCategory = {
      streaks: badges.filter(b => b.category === 'streaks'),
      volume: badges.filter(b => b.category === 'volume'),
      milestones: badges.filter(b => b.category === 'milestones'),
      consistency: badges.filter(b => b.category === 'consistency'),
      special: badges.filter(b => b.category === 'special')
    };

    const earnedCount = badges.filter(b => b.earned).length;

    return NextResponse.json({
      success: true,
      badges,
      byCategory,
      nextBadge,
      stats: {
        total: BADGES.length,
        earned: earnedCount,
        remaining: BADGES.length - earnedCount,
        percentage: Math.round((earnedCount / BADGES.length) * 100)
      }
    });
  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Calculate user stats for badge checking
function calculateUserStats(userId: number): any {
  // Get streaks
  const streaks = getAllStreaks(userId);
  const trainingStreak = streaks.find((s: any) => s.type === 'training');
  const checkinStreak = streaks.find((s: any) => s.type === 'checkin');

  // Get total sessions
  const totalSessions = db.prepare(`
    SELECT COUNT(*) as count FROM sessions WHERE completed = 1
  `).get() as { count: number };

  // Get sessions by type
  const sessionsByType = db.prepare(`
    SELECT type, COUNT(*) as count
    FROM sessions
    WHERE completed = 1
    GROUP BY type
  `).all() as Array<{ type: string; count: number }>;

  const sessionCounts: Record<string, number> = {};
  sessionsByType.forEach(row => {
    sessionCounts[row.type] = row.count;
  });

  // Get total distance by type (convert yards to meters for swim)
  const distanceByType = db.prepare(`
    SELECT type, SUM(actual_distance) as total
    FROM sessions
    WHERE completed = 1 AND actual_distance IS NOT NULL
    GROUP BY type
  `).all() as Array<{ type: string; total: number }>;

  const totalDistance: Record<string, number> = { swim: 0, bike: 0, run: 0 };
  distanceByType.forEach(row => {
    if (row.type === 'swim') {
      // Convert yards to meters (1 yard = 0.9144 meters)
      totalDistance.swim = row.total * 0.9144;
    } else {
      totalDistance[row.type] = row.total || 0;
    }
  });

  // Get total duration
  const totalDuration = db.prepare(`
    SELECT SUM(actual_duration) as total FROM sessions WHERE completed = 1
  `).get() as { total: number };

  return {
    currentStreak: trainingStreak?.current_streak || 0,
    longestStreak: trainingStreak?.longest_streak || 0,
    checkinStreak: checkinStreak?.current_streak || 0,
    totalSessions: totalSessions.count,
    sessionsByType: sessionCounts,
    totalDistance,
    totalDuration: totalDuration.total || 0
  };
}
