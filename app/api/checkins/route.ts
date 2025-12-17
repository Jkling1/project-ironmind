// API Route: POST /api/checkins
// Creates or updates daily check-in

import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateCheckin, getCheckin } from '@/lib/database/operations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      userId = 1,
      date,
      checkin
    } = body;

    // Validate required fields
    if (!date || !checkin) {
      return NextResponse.json(
        { error: 'date and checkin data are required' },
        { status: 400 }
      );
    }

    // Validate checkin structure
    const { sleep, mood, soreness, stress } = checkin;
    if (!sleep || mood === undefined || !soreness || stress === undefined) {
      return NextResponse.json(
        { error: 'checkin must include: sleep, mood, soreness, stress' },
        { status: 400 }
      );
    }

    // Calculate readiness score (0-100)
    const readinessScore = calculateReadinessScore(checkin);
    const readyToTrain = readinessScore >= 60;

    // Create or update check-in
    const result = createOrUpdateCheckin(userId, date, {
      ...checkin,
      readinessScore,
      readyToTrain
    });

    return NextResponse.json({
      success: true,
      date,
      readinessScore,
      readyToTrain,
      message: 'Check-in saved successfully'
    });

  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const userId = 1; // TODO: Get from auth session

    if (!date) {
      return NextResponse.json(
        { error: 'date query parameter is required' },
        { status: 400 }
      );
    }

    const checkin = getCheckin(userId, date);

    if (!checkin) {
      return NextResponse.json(
        { error: `No check-in found for date: ${date}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      checkin
    });

  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Calculate readiness score from check-in data
function calculateReadinessScore(checkin: any): number {
  const {
    sleep,
    mood,
    soreness,
    stress
  } = checkin;

  // Sleep score (0-30 points)
  const sleepScore = Math.min(30, (sleep.duration / 8) * 25 + (sleep.quality / 10) * 5);

  // Mood score (0-25 points)
  const moodScore = (mood / 10) * 25;

  // Soreness score (0-25 points, inverted)
  const sorenessScore = ((10 - soreness.overall) / 10) * 25;

  // Stress score (0-20 points, inverted)
  const stressScore = ((10 - stress) / 10) * 20;

  const total = sleepScore + moodScore + sorenessScore + stressScore;
  return Math.round(Math.min(100, Math.max(0, total)));
}
