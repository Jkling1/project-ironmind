// API Route: GET /api/streaks
// Returns all streaks for a user

import { NextRequest, NextResponse } from 'next/server';
import { getAllStreaks } from '@/lib/database/operations';

export async function GET(request: NextRequest) {
  try {
    const userId = 1; // TODO: Get from auth session

    const streaks = getAllStreaks(userId);

    // Format streaks into a more usable object
    const formattedStreaks: Record<string, any> = {};
    streaks.forEach((streak: any) => {
      formattedStreaks[streak.type] = {
        current: streak.current_streak,
        longest: streak.longest_streak,
        lastActivity: streak.last_activity_date,
        updatedAt: streak.updated_at
      };
    });

    return NextResponse.json({
      success: true,
      streaks: formattedStreaks,
      raw: streaks
    });
  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
