// API Route: POST /api/protocol/generate
// Generates complete 326-day Ironman training protocol

import { NextRequest, NextResponse } from 'next/server';
import generateFullProtocol from '@/lib/protocol/generator';
import { getOrCreateUser, createOrUpdateAthleteProfile } from '@/lib/database/operations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      userId = 1,
      startDate,
      raceDate,
      athleteProfile
    } = body;

    // Validate required fields
    if (!startDate || !raceDate) {
      return NextResponse.json(
        { error: 'startDate and raceDate are required' },
        { status: 400 }
      );
    }

    // Ensure user exists
    getOrCreateUser(userId);

    // Create or update athlete profile if provided
    if (athleteProfile) {
      createOrUpdateAthleteProfile(userId, athleteProfile);
      console.log('✅ Athlete profile updated');
    }

    // Generate the protocol
    console.log('🚀 Starting protocol generation...');
    const result = await generateFullProtocol({
      userId,
      startDate,
      raceDate,
      useAI: false // Set to true when ready to use GPT-4 for enhanced generation
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Protocol generation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      protocolId: result.protocolId,
      message: 'Protocol generated successfully',
      stats: {
        userId,
        startDate,
        raceDate,
        totalDays: calculateDays(startDate, raceDate)
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

function calculateDays(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
