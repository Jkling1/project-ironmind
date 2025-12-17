// API Route: GET /api/progress/graph
// Returns weekly training load data for progress visualization

import { NextRequest, NextResponse } from 'next/server';
import { getProgressSnapshots, getTrainingProtocol } from '@/lib/database/operations';

export async function GET(request: NextRequest) {
  try {
    const userId = 1; // TODO: Get from auth session
    const searchParams = request.nextUrl.searchParams;
    const weeks = parseInt(searchParams.get('weeks') || '12');

    // Get training protocol
    const protocol = getTrainingProtocol(userId);

    if (!protocol) {
      return NextResponse.json(
        { error: 'No training protocol found. Generate protocol first.' },
        { status: 404 }
      );
    }

    // Parse weekly load curve
    const weeklyLoadCurve = JSON.parse(protocol.weekly_load_curve || '[]');

    // Get actual progress snapshots
    const snapshots = getProgressSnapshots(userId, weeks);

    // Create graph data combining planned and actual
    const graphData = [];
    const today = new Date();
    const startDate = new Date(protocol.start_date);

    // Calculate current week number
    const diffTime = today.getTime() - startDate.getTime();
    const currentWeek = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)));

    // Generate data for requested number of weeks
    for (let weekNum = Math.max(1, currentWeek - weeks + 1); weekNum <= Math.min(currentWeek + 4, weeklyLoadCurve.length); weekNum++) {
      const snapshot = snapshots.find(s => s.week_number === weekNum);

      graphData.push({
        week: weekNum,
        loadTarget: weeklyLoadCurve[weekNum - 1] || 0,
        loadActual: snapshot?.load_actual || null,
        adherenceRate: snapshot?.adherence_rate || null,
        isCurrentWeek: weekNum === currentWeek,
        isPastWeek: weekNum < currentWeek,
        isFutureWeek: weekNum > currentWeek
      });
    }

    return NextResponse.json({
      success: true,
      currentWeek,
      totalWeeks: weeklyLoadCurve.length,
      graphData,
      protocol: {
        id: protocol.id,
        startDate: protocol.start_date,
        raceDate: protocol.race_date,
        totalDays: protocol.total_days
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
