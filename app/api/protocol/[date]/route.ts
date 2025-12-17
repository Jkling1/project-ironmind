// API Route: GET /api/protocol/[date]
// Retrieves daily protocol for a specific date

import { NextRequest, NextResponse } from 'next/server';
import { getDailyProtocol } from '@/lib/database/operations';

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const { date } = params;
    const userId = 1; // TODO: Get from auth session

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Get daily protocol
    const protocol = getDailyProtocol(userId, date);

    if (!protocol) {
      return NextResponse.json(
        { error: `No protocol found for date: ${date}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      protocol
    });

  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
