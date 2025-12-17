// API Route: GET /api/weekly-review?week=N
// Returns weekly review data with insights

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = 1; // TODO: Get from auth session
    const weekParam = searchParams.get('week');

    // Calculate current week number
    const user = db.prepare('SELECT start_date FROM users WHERE id = ?').get(userId) as { start_date: string };
    if (!user) {
      throw new Error('User not found');
    }

    const startDate = new Date(user.start_date);
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const currentWeek = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)));

    const weekNumber = weekParam ? parseInt(weekParam) : currentWeek;

    // Calculate week date range
    const weekStart = new Date(startDate);
    weekStart.setDate(weekStart.getDate() + (weekNumber - 1) * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    // Get all daily protocols for this week
    const dailyProtocols = db.prepare(`
      SELECT * FROM daily_protocols
      WHERE user_id = ? AND date >= ? AND date <= ?
      ORDER BY date ASC
    `).all(userId, weekStartStr, weekEndStr);

    // Get all sessions for this week
    const sessions = db.prepare(`
      SELECT s.*, dp.date
      FROM sessions s
      JOIN daily_protocols dp ON s.daily_protocol_id = dp.id
      WHERE dp.user_id = ? AND dp.date >= ? AND dp.date <= ?
    `).all(userId, weekStartStr, weekEndStr);

    // Calculate planned vs actual
    const plannedLoad = dailyProtocols.reduce((sum: number, dp: any) => sum + (dp.daily_load_target || 0), 0);
    const plannedSessions = sessions.length;
    const completedSessions = sessions.filter((s: any) => s.completed === 1);
    const actualDuration = completedSessions.reduce((sum: number, s: any) => sum + (s.actual_duration || 0), 0);
    const actualDistance = completedSessions.reduce((sum: number, s: any) => sum + (s.actual_distance || 0), 0);

    // Calculate adherence rate
    const adherenceRate = plannedSessions > 0
      ? Math.round((completedSessions.length / plannedSessions) * 100)
      : 0;

    // Get check-ins for this week
    const checkins = db.prepare(`
      SELECT * FROM checkins
      WHERE user_id = ? AND date >= ? AND date <= ?
      ORDER BY date ASC
    `).all(userId, weekStartStr, weekEndStr);

    // Calculate average readiness
    const avgReadiness = checkins.length > 0
      ? Math.round(checkins.reduce((sum: number, c: any) => sum + (c.readiness_score || 0), 0) / checkins.length)
      : null;

    // Get best and worst sessions
    const sortedByFeeling = completedSessions.sort((a: any, b: any) => {
      const feelingScore: Record<string, number> = {
        great: 5,
        good: 4,
        okay: 3,
        tired: 2,
        struggled: 1,
        pain: 0
      };
      return (feelingScore[b.feeling] || 0) - (feelingScore[a.feeling] || 0);
    });

    const bestSession = sortedByFeeling[0] || null;
    const worstSession = sortedByFeeling[sortedByFeeling.length - 1] || null;

    // Get longest session
    const longestSession = [...completedSessions].sort((a: any, b: any) => b.actual_duration - a.actual_duration)[0] || null;

    // Get sessions by type
    const sessionsByType: Record<string, number> = {};
    completedSessions.forEach((s: any) => {
      sessionsByType[s.type] = (sessionsByType[s.type] || 0) + 1;
    });

    // Get average RPE
    const avgRPE = completedSessions.length > 0
      ? (completedSessions.reduce((sum: number, s: any) => sum + (s.rpe || 0), 0) / completedSessions.length).toFixed(1)
      : null;

    // Get next week preview
    const nextWeekStart = new Date(weekEnd);
    nextWeekStart.setDate(nextWeekStart.getDate() + 1);

    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 6);

    const nextWeekStartStr = nextWeekStart.toISOString().split('T')[0];
    const nextWeekEndStr = nextWeekEnd.toISOString().split('T')[0];

    const nextWeekProtocols = db.prepare(`
      SELECT * FROM daily_protocols
      WHERE user_id = ? AND date >= ? AND date <= ?
      ORDER BY date ASC
    `).all(userId, nextWeekStartStr, nextWeekEndStr);

    const nextWeekSessions = db.prepare(`
      SELECT s.*, dp.date
      FROM sessions s
      JOIN daily_protocols dp ON s.daily_protocol_id = dp.id
      WHERE dp.user_id = ? AND dp.date >= ? AND dp.date <= ?
    `).all(userId, nextWeekStartStr, nextWeekEndStr);

    // Generate insights
    const insights = generateInsights({
      adherenceRate,
      avgReadiness,
      sessionsByType,
      avgRPE: parseFloat(avgRPE || '0'),
      weekNumber
    });

    return NextResponse.json({
      success: true,
      week: {
        number: weekNumber,
        startDate: weekStartStr,
        endDate: weekEndStr,
        isCurrent: weekNumber === currentWeek
      },
      summary: {
        plannedLoad,
        actualLoad: Math.round(plannedLoad * (adherenceRate / 100)), // Approximation
        plannedSessions,
        completedSessions: completedSessions.length,
        adherenceRate,
        totalDuration: actualDuration,
        totalDistance: Math.round(actualDistance || 0),
        avgReadiness,
        avgRPE: avgRPE ? parseFloat(avgRPE) : null
      },
      highlights: {
        bestSession,
        worstSession,
        longestSession,
        sessionsByType
      },
      checkins: {
        total: checkins.length,
        avgReadiness
      },
      nextWeek: {
        startDate: nextWeekStartStr,
        endDate: nextWeekEndStr,
        plannedSessions: nextWeekSessions.length,
        phase: nextWeekProtocols[0]?.phase_name || 'Unknown'
      },
      insights
    });
  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateInsights(data: any): string[] {
  const insights: string[] = [];

  // Adherence insights
  if (data.adherenceRate >= 90) {
    insights.push('🎯 Outstanding adherence! You completed 90%+ of planned sessions.');
  } else if (data.adherenceRate >= 70) {
    insights.push('👍 Good adherence. Keep showing up consistently.');
  } else if (data.adherenceRate < 70 && data.adherenceRate > 0) {
    insights.push('⚠️ Adherence below 70%. Consider adjusting your schedule or protocol.');
  }

  // Readiness insights
  if (data.avgReadiness !== null) {
    if (data.avgReadiness >= 75) {
      insights.push('💪 Your body is responding well. Average readiness is excellent.');
    } else if (data.avgReadiness < 60) {
      insights.push('😴 Low readiness scores suggest you need more recovery.');
    }
  }

  // RPE insights
  if (data.avgRPE > 7) {
    insights.push('🔥 High average RPE. Make sure you\'re recovering adequately.');
  } else if (data.avgRPE < 5) {
    insights.push('✅ Moderate RPE suggests good intensity control.');
  }

  // Training balance
  const types = Object.keys(data.sessionsByType);
  if (types.length === 1) {
    insights.push('⚖️ Consider adding variety - you only trained in one discipline this week.');
  }

  // Progress insights
  if (data.weekNumber % 4 === 0) {
    insights.push('📊 This is a recovery week. Use it to absorb your training gains.');
  }

  if (insights.length === 0) {
    insights.push('Keep up the great work! Stay consistent with your training.');
  }

  return insights;
}
