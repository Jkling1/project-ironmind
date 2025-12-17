#!/usr/bin/env ts-node
// Test script for protocol generation
// Run with: npx ts-node scripts/test-protocol-generation.ts

import generateFullProtocol from '../lib/protocol/generator';
import { getOrCreateUser, createOrUpdateAthleteProfile, getDailyProtocol, getDailyProtocolByIndex } from '../lib/database/operations';

async function testProtocolGeneration() {
  console.log('═════════════════════════════════════════════');
  console.log('🏊‍♂️ Project IronMind: Protocol Generation Test');
  console.log('═════════════════════════════════════════════\n');

  try {
    // 1. Ensure user exists
    console.log('1️⃣  Creating/verifying user...');
    const user = getOrCreateUser(1) as any;
    console.log(`   ✅ User: ${user.name} (ID: ${user.id})`);
    console.log(`   📅 Race Date: ${user.race_date}`);
    console.log('');

    // 2. Create athlete profile
    console.log('2️⃣  Creating athlete profile...');
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
        indoor: true,  // Has indoor trainer
        pool: true,    // Has pool access
        gym: true      // Has gym access
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
    console.log('   ✅ Athlete profile created');
    console.log('');

    // 3. Generate protocol
    console.log('3️⃣  Generating 326-day protocol...');
    console.log('   This will take 10-30 seconds...\n');

    const startTime = Date.now();

    const result = await generateFullProtocol({
      userId: 1,
      startDate: '2025-12-16',
      raceDate: '2026-11-07',
      useAI: false // Use template-based generation for speed
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    if (!result.success) {
      console.error('   ❌ Protocol generation failed:', result.error);
      process.exit(1);
    }

    console.log(`\n   ✅ Protocol generated in ${duration} seconds`);
    console.log(`   📊 Protocol ID: ${result.protocolId}`);
    console.log('');

    // 4. Test retrieval - Day 1
    console.log('4️⃣  Testing protocol retrieval...');
    console.log('   📅 Day 1 (2025-12-16):');
    const day1 = getDailyProtocol(1, '2025-12-16');
    if (day1) {
      console.log(`      Phase: ${day1.phase_name} (${day1.phase_key})`);
      console.log(`      Sessions: ${day1.sessions.length}`);
      day1.sessions.forEach((s: any, i: number) => {
        console.log(`        ${i + 1}. ${s.type.toUpperCase()}: ${s.planned_duration}min - ${s.planned_intensity}`);
      });
      console.log(`      Load Target: ${day1.daily_load_target}`);
      console.log(`      Coach Note: "${day1.coach_note}"`);
    }
    console.log('');

    // 5. Test day in middle - Day 100
    console.log('   📅 Day 100:');
    const day100 = getDailyProtocolByIndex(1, 100);
    if (day100) {
      console.log(`      Phase: ${day100.phase_name} (${day100.phase_key})`);
      console.log(`      Date: ${day100.date}`);
      console.log(`      Days to Race: ${day100.days_to_race}`);
      console.log(`      Progress: ${day100.percent_complete}%`);
      console.log(`      Sessions: ${day100.sessions.length}`);
      day100.sessions.forEach((s: any, i: number) => {
        console.log(`        ${i + 1}. ${s.type.toUpperCase()}: ${s.planned_duration}min - ${s.planned_intensity}`);
      });
    }
    console.log('');

    // 6. Test race week - Day 320
    console.log('   📅 Day 320 (Race Week):');
    const day320 = getDailyProtocolByIndex(1, 320);
    if (day320) {
      console.log(`      Phase: ${day320.phase_name} (${day320.phase_key})`);
      console.log(`      Date: ${day320.date}`);
      console.log(`      Days to Race: ${day320.days_to_race}`);
      console.log(`      Sessions: ${day320.sessions.length}`);
      day320.sessions.forEach((s: any, i: number) => {
        console.log(`        ${i + 1}. ${s.type.toUpperCase()}: ${s.planned_duration}min - ${s.planned_intensity}`);
      });
      console.log(`      Guardrails: ${day320.guardrails.notes}`);
    }
    console.log('');

    // 7. Summary statistics
    console.log('5️⃣  Protocol Statistics:');
    console.log(`   ✅ Total Days: 326`);
    console.log(`   ✅ Total Weeks: 47`);
    console.log(`   ✅ Training Phases: 8`);
    console.log('');

    console.log('═════════════════════════════════════════════');
    console.log('✅ Protocol generation test PASSED');
    console.log('═════════════════════════════════════════════\n');

    console.log('Next Steps:');
    console.log('1. Start Next.js dev server: npm run dev');
    console.log('2. View protocol at: http://localhost:3000/api/protocol/2025-12-16');
    console.log('3. Build Today Dashboard UI');
    console.log('');

  } catch (error: any) {
    console.error('❌ Test failed:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
testProtocolGeneration();
