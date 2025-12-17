// API Route: POST /api/sessions/complete
// Completes a training session with actual performance data

import { NextRequest, NextResponse } from 'next/server';
import { completeSession } from '@/lib/database/operations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      sessionId,
      actual
    } = body;

    // Validate required fields
    if (!sessionId || !actual) {
      return NextResponse.json(
        { error: 'sessionId and actual data are required' },
        { status: 400 }
      );
    }

    // Validate actual data structure
    const { duration, rpe, feeling } = actual;
    if (!duration || !rpe || !feeling) {
      return NextResponse.json(
        { error: 'actual must include: duration, rpe, feeling' },
        { status: 400 }
      );
    }

    // Complete the session
    const result = completeSession(sessionId, {
      duration: actual.duration,
      distance: actual.distance || null,
      avgHeartRate: actual.avgHeartRate || null,
      avgPower: actual.avgPower || null,
      avgPace: actual.avgPace || null,
      rpe: actual.rpe,
      notes: actual.notes || null,
      feeling: actual.feeling
    });

    return NextResponse.json({
      success: true,
      sessionId,
      message: 'Session completed successfully',
      changes: result.changes
    });

  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
