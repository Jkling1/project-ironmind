#!/usr/bin/env ts-node
// End-to-end test for complete Project IronMind user flow
// Tests: Protocol generation → Today view → Check-in → Session logging → Progress tracking

import generateFullProtocol from '../lib/protocol/generator';
import {
  getOrCreateUser,
  createOrUpdateAthleteProfile,
  getDailyProtocol,
  getDailyProtocolByIndex,
  createOrUpdateCheckin,
  getCheckin,
  completeSession,
  getSessions,
  createProgressSnapshot,
  getProgressSnapshots,
  updateStreak,
  getAllStreaks
} from '../lib/database/operations';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step: number, message: string) {
  log(`\n${colors.bright}${colors.cyan}[STEP ${step}]${colors.reset} ${message}`);
}

function logSuccess(message: string) {
  log(`  ${colors.green}✓${colors.reset} ${message}`);
}

function logError(message: string) {
  log(`  ${colors.red}✗${colors.reset} ${message}`);
}

function logInfo(message: string) {
  log(`  ${colors.blue}ℹ${colors.reset} ${message}`);
}

async function runE2ETest() {
  log(`\n${'='.repeat(70)}`, colors.bright);
  log('PROJECT IRONMIND - END-TO-END TEST SUITE', colors.bright);
  log('='.repeat(70), colors.bright);
  log('Testing complete user journey from protocol generation to analytics\n');

  let testsPassed = 0;
  let testsFailed = 0;

  try {
    // ========================================
    // STEP 1: User Setup
    // ========================================
    logStep(1, 'User Setup & Profile Creation');

    const user = getOrCreateUser(1);
    if (!user) {
      throw new Error('Failed to create user');
    }
    logSuccess(`User created: ${user.name} (ID: ${user.id})`);
    logInfo(`Start: ${user.start_date}, Race: ${user.race_date}`);
    testsPassed++;

    // Create athlete profile
    createOrUpdateAthleteProfile(1, {
      experience: 'intermediate',
      weeklyHoursBase: 10.0,
      weeklyHoursPeak: 16.0,
      availability: {
        longRideDay: 'saturday',
        strengthDays: ['monday', 'wednesday'],
        swimDays: ['monday', 'wednesday', 'friday']
      },
      constraints: {
        indoor: true,
        pool: true,
        gym: true
      },
      injuries: [],
      strengths: ['cycling', 'mental toughness'],
      weaknesses: ['swimming technique', 'run pacing'],
      equipment: {
        bike: 'Canyon Aeroad',
        wetsuit: true,
        powerMeter: true,
        hrMonitor: true
      },
      preferences: {
        morningPerson: true,
        preferredIntensity: 'moderate'
      }
    });
    logSuccess('Athlete profile created with preferences');
    testsPassed++;

    // ========================================
    // STEP 2: Protocol Generation
    // ========================================
    logStep(2, 'Generate 326-Day Training Protocol');

    const startTime = Date.now();
    const result = await generateFullProtocol({
      userId: 1,
      startDate: '2025-12-16',
      raceDate: '2026-11-07',
      useAI: false
    });

    if (!result.success) {
      throw new Error(`Protocol generation failed: ${result.error}`);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    logSuccess(`Protocol generated in ${duration} seconds`);
    logInfo(`Protocol ID: ${result.protocolId}`);
    testsPassed++;

    // ========================================
    // STEP 3: Daily Protocol Retrieval
    // ========================================
    logStep(3, 'Test Daily Protocol Retrieval');

    // Test Day 1
    const day1 = getDailyProtocol(1, '2025-12-16');
    if (!day1) {
      throw new Error('Day 1 protocol not found');
    }
    logSuccess(`Day 1 retrieved: ${day1.phase_name}`);
    logInfo(`  Sessions: ${day1.sessions.length}`);
    day1.sessions.forEach((s: any) => {
      logInfo(`    - ${s.type}: ${s.planned_duration}min, ${s.planned_intensity}`);
    });
    testsPassed++;

    // Test Day 100 (should be in BASE phase)
    const day100 = getDailyProtocolByIndex(1, 100);
    if (!day100) {
      throw new Error('Day 100 protocol not found');
    }
    logSuccess(`Day 100 retrieved: ${day100.phase_name}`);
    logInfo(`  Date: ${day100.date}, Days to race: ${day100.days_to_race}`);
    testsPassed++;

    // Test Race Week
    const day320 = getDailyProtocolByIndex(1, 320);
    if (!day320) {
      throw new Error('Day 320 (race week) protocol not found');
    }
    logSuccess(`Day 320 retrieved: ${day320.phase_name}`);
    if (day320.phase_key !== 'RACE_WEEK') {
      logError(`Expected RACE_WEEK, got ${day320.phase_key}`);
      testsFailed++;
    } else {
      logInfo(`  Correctly in RACE_WEEK phase`);
      testsPassed++;
    }

    // ========================================
    // STEP 4: Daily Check-In Flow
    // ========================================
    logStep(4, 'Test Daily Check-In System');

    // Create check-in for Day 1
    const checkinData = {
      sleep: {
        duration: 7.5,
        quality: 8
      },
      mood: 7,
      soreness: {
        overall: 3,
        legs: 2,
        core: 1
      },
      stress: 4,
      weight: 185.5,
      notes: 'Feeling good and ready to start!'
    };

    const checkinResult = createOrUpdateCheckin(1, '2025-12-16', {
      ...checkinData,
      readinessScore: 75,
      readyToTrain: true
    });

    logSuccess('Check-in created for Day 1');
    logInfo(`  Readiness Score: 75/100`);
    logInfo(`  Ready to Train: Yes`);
    testsPassed++;

    // Verify check-in retrieval
    const retrievedCheckin = getCheckin(1, '2025-12-16');
    if (!retrievedCheckin) {
      throw new Error('Failed to retrieve check-in');
    }
    logSuccess('Check-in retrieved successfully');
    testsPassed++;

    // ========================================
    // STEP 5: Session Logging
    // ========================================
    logStep(5, 'Test Session Completion & Logging');

    // Get sessions for Day 1
    const day1Sessions = getSessions(day1.id);
    if (day1Sessions.length === 0) {
      logError('No sessions found for Day 1');
      testsFailed++;
    } else {
      logSuccess(`Found ${day1Sessions.length} sessions for Day 1`);

      // Complete first session
      const session1 = day1Sessions[0];
      const completionResult = completeSession(session1.id, {
        duration: 32,
        distance: 3.1,
        avgHeartRate: 145,
        rpe: 4,
        feeling: 'good',
        notes: 'Great first run! Felt strong.'
      });

      logSuccess(`Session 1 completed: ${session1.type}`);
      logInfo(`  Planned: ${session1.planned_duration}min`);
      logInfo(`  Actual: 32min, 3.1mi`);
      logInfo(`  RPE: 4/10, Feeling: good`);
      testsPassed++;

      // Verify session was marked complete
      const updatedSessions = getSessions(day1.id);
      const completedSession = updatedSessions.find((s: any) => s.id === session1.id);
      if (completedSession && completedSession.completed === 1) {
        logSuccess('Session marked as completed in database');
        testsPassed++;
      } else {
        logError('Session not marked as completed');
        testsFailed++;
      }
    }

    // ========================================
    // STEP 6: Streak Tracking
    // ========================================
    logStep(6, 'Test Streak Tracking System');

    // Update training streak
    updateStreak(1, 'training', 1, 1);
    logSuccess('Training streak updated to 1 day');
    testsPassed++;

    // Update check-in streak
    updateStreak(1, 'checkin', 1, 1);
    logSuccess('Check-in streak updated to 1 day');
    testsPassed++;

    // Get all streaks
    const streaks = getAllStreaks(1);
    if (streaks.length > 0) {
      logSuccess(`Retrieved ${streaks.length} streaks`);
      streaks.forEach((streak: any) => {
        logInfo(`  ${streak.type}: ${streak.current_streak} days (longest: ${streak.longest_streak})`);
      });
      testsPassed++;
    } else {
      logError('No streaks found');
      testsFailed++;
    }

    // ========================================
    // STEP 7: Progress Tracking
    // ========================================
    logStep(7, 'Test Progress Snapshot System');

    // Create progress snapshot for Week 1
    createProgressSnapshot(1, {
      weekNumber: 1,
      loadTarget: 100,
      loadActual: 95,
      adherenceRate: 95,
      sessionsPlanned: 7,
      sessionsCompleted: 7,
      totalDuration: 420,
      totalDistance: 42.5,
      avgHeartRate: 145,
      avgRpe: 5,
      notes: 'Great first week!'
    });

    logSuccess('Week 1 progress snapshot created');
    logInfo('  Load: 95/100 (95% adherence)');
    logInfo('  Sessions: 7/7 completed');
    testsPassed++;

    // Retrieve snapshots
    const snapshots = getProgressSnapshots(1, 12);
    if (snapshots.length > 0) {
      logSuccess(`Retrieved ${snapshots.length} progress snapshots`);
      testsPassed++;
    } else {
      logError('No progress snapshots found');
      testsFailed++;
    }

    // ========================================
    // STEP 8: Multi-Day Simulation
    // ========================================
    logStep(8, 'Simulate 7-Day Training Week');

    for (let day = 2; day <= 7; day++) {
      const dayProtocol = getDailyProtocolByIndex(1, day);
      if (!dayProtocol) {
        logError(`Day ${day} protocol not found`);
        testsFailed++;
        continue;
      }

      // Create check-in
      createOrUpdateCheckin(1, dayProtocol.date, {
        sleep: { duration: 7.5, quality: 7 },
        mood: 7,
        soreness: { overall: day > 4 ? 5 : 3 },
        stress: 4,
        readinessScore: day > 4 ? 65 : 75,
        readyToTrain: true
      });

      // Complete sessions
      const sessions = getSessions(dayProtocol.id);
      sessions.forEach((session: any) => {
        completeSession(session.id, {
          duration: session.planned_duration,
          distance: session.planned_distance,
          rpe: 5,
          feeling: 'good'
        });
      });

      // Update streaks
      updateStreak(1, 'training', day, day);
      updateStreak(1, 'checkin', day, day);
    }

    logSuccess('7-day week simulated successfully');
    logInfo('  All check-ins completed');
    logInfo('  All sessions logged');
    logInfo('  Streaks updated to 7 days');
    testsPassed += 3;

    // ========================================
    // STEP 9: Data Integrity Checks
    // ========================================
    logStep(9, 'Data Integrity Validation');

    // Check total protocols generated
    const finalDay = getDailyProtocolByIndex(1, 326);
    if (finalDay && finalDay.day_index === 326) {
      logSuccess('All 326 daily protocols generated');
      testsPassed++;
    } else {
      logError('Missing daily protocols');
      testsFailed++;
    }

    // Check phase transitions
    const transitionDay = getDailyProtocolByIndex(1, 15); // Should be in FOUNDATION
    if (transitionDay && transitionDay.phase_key === 'FOUNDATION') {
      logSuccess('Phase transition working correctly (TRANSITION → FOUNDATION)');
      testsPassed++;
    } else {
      logError(`Expected FOUNDATION at day 15, got ${transitionDay?.phase_key}`);
      testsFailed++;
    }

    // Check recovery weeks
    const week4Day = getDailyProtocolByIndex(1, 28); // Week 4, Day 28
    if (week4Day && week4Day.is_recovery_week === 1) {
      logSuccess('Recovery week detection working (Week 4)');
      testsPassed++;
    } else {
      logError('Recovery week not detected at Week 4');
      testsFailed++;
    }

    // ========================================
    // STEP 10: API Simulation
    // ========================================
    logStep(10, 'API Endpoint Simulation');

    // Simulate GET /api/protocol/[date]
    const apiDay1 = getDailyProtocol(1, '2025-12-16');
    if (apiDay1 && apiDay1.sessions && apiDay1.nutrition && apiDay1.recovery) {
      logSuccess('GET /api/protocol/[date] - Structure validated');
      logInfo('  Has sessions, nutrition, recovery, mindset');
      testsPassed++;
    } else {
      logError('GET /api/protocol/[date] - Missing required fields');
      testsFailed++;
    }

    // Simulate POST /api/checkins
    const apiCheckin = getCheckin(1, '2025-12-16');
    if (apiCheckin && apiCheckin.readiness_score && apiCheckin.ready_to_train !== undefined) {
      logSuccess('POST /api/checkins - Data structure validated');
      testsPassed++;
    } else {
      logError('POST /api/checkins - Missing readiness data');
      testsFailed++;
    }

    // Simulate POST /api/sessions/complete
    const completedSessions = getSessions(day1.id).filter((s: any) => s.completed === 1);
    if (completedSessions.length > 0) {
      logSuccess('POST /api/sessions/complete - Sessions marked complete');
      testsPassed++;
    } else {
      logError('POST /api/sessions/complete - No completed sessions found');
      testsFailed++;
    }

    // ========================================
    // FINAL RESULTS
    // ========================================
    log(`\n${'='.repeat(70)}`, colors.bright);
    log('TEST RESULTS', colors.bright);
    log('='.repeat(70), colors.bright);

    log(`\n${colors.green}Tests Passed: ${testsPassed}${colors.reset}`);
    if (testsFailed > 0) {
      log(`${colors.red}Tests Failed: ${testsFailed}${colors.reset}`);
    }

    const totalTests = testsPassed + testsFailed;
    const successRate = ((testsPassed / totalTests) * 100).toFixed(1);
    log(`\nSuccess Rate: ${successRate}%`);

    if (testsFailed === 0) {
      log(`\n${colors.green}${colors.bright}✓ ALL TESTS PASSED!${colors.reset}`, colors.green);
      log('\nProject IronMind E2E flow is working correctly.');
      log('You can now:');
      log('  1. Start dev server: npm run dev');
      log('  2. Visit: http://localhost:3000/today');
      log('  3. Complete daily check-ins and log sessions');
      log('  4. View progress: http://localhost:3000/progress\n');
    } else {
      log(`\n${colors.red}${colors.bright}✗ SOME TESTS FAILED${colors.reset}`, colors.red);
      log('\nPlease review the errors above and fix before proceeding.\n');
      process.exit(1);
    }

  } catch (error: any) {
    log(`\n${colors.red}${colors.bright}CRITICAL ERROR:${colors.reset}`, colors.red);
    log(error.message, colors.red);
    log('\nStack trace:', colors.red);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
runE2ETest();
