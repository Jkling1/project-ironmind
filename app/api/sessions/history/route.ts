// API Route: GET /api/sessions/history
// Returns session history with filtering and stats

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = 1; // TODO: Get from auth session
    const type = searchParams.get('type'); // swim, bike, run, strength, or null for all
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = `
      SELECT
        s.*,
        dp.date,
        dp.day_index,
        dp.phase_name,
        dp.phase_color
      FROM sessions s
      JOIN daily_protocols dp ON s.daily_protocol_id = dp.id
      WHERE s.completed = 1
    `;

    const params: any[] = [];

    if (type) {
      query += ` AND s.type = ?`;
      params.push(type);
    }

    query += ` ORDER BY dp.date DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const sessions = db.prepare(query).all(...params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as count FROM sessions WHERE completed = 1`;
    const countParams: any[] = [];

    if (type) {
      countQuery += ` AND type = ?`;
      countParams.push(type);
    }

    const countResult = db.prepare(countQuery).get(...countParams) as { count: number };

    // Calculate statistics
    const stats = calculateSessionStats(userId, type);

    return NextResponse.json({
      success: true,
      sessions,
      stats,
      pagination: {
        total: countResult.count,
        limit,
        offset,
        hasMore: offset + limit < countResult.count
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

function calculateSessionStats(userId: number, type?: string | null) {
  let query = `
    SELECT
      COUNT(*) as total_sessions,
      SUM(actual_duration) as total_duration,
      SUM(actual_distance) as total_distance,
      AVG(actual_duration) as avg_duration,
      AVG(actual_distance) as avg_distance,
      AVG(rpe) as avg_rpe,
      MAX(actual_distance) as longest_distance,
      MAX(actual_duration) as longest_duration
    FROM sessions
    WHERE completed = 1
  `;

  const params: any[] = [];

  if (type) {
    query += ` AND type = ?`;
    params.push(type);
  }

  const result = db.prepare(query).get(...params);

  // Get sessions by feeling
  let feelingQuery = `
    SELECT feeling, COUNT(*) as count
    FROM sessions
    WHERE completed = 1 AND feeling IS NOT NULL
  `;

  if (type) {
    feelingQuery += ` AND type = ?`;
  }

  feelingQuery += ` GROUP BY feeling`;

  const feelingStats = db.prepare(feelingQuery).all(...(type ? [type] : []));

  // Get sessions by month
  let monthlyQuery = `
    SELECT
      strftime('%Y-%m', dp.date) as month,
      COUNT(*) as count,
      SUM(s.actual_duration) as total_duration,
      SUM(s.actual_distance) as total_distance
    FROM sessions s
    JOIN daily_protocols dp ON s.daily_protocol_id = dp.id
    WHERE s.completed = 1
  `;

  if (type) {
    monthlyQuery += ` AND s.type = ?`;
  }

  monthlyQuery += ` GROUP BY strftime('%Y-%m', dp.date) ORDER BY month DESC LIMIT 12`;

  const monthlyStats = db.prepare(monthlyQuery).all(...(type ? [type] : []));

  return {
    ...result,
    feelingDistribution: feelingStats,
    monthlyBreakdown: monthlyStats
  };
}
