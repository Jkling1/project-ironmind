// AI-powered protocol generator for 326-day Ironman training plan
// Uses GPT-4 to create intelligent, personalized daily protocols

import OpenAI from 'openai';
import {
  TRAINING_PHASES,
  getPhaseForDay,
  generateLoadCurve,
  calculatePhaseDays
} from './phases';
import {
  getTemplatesForPhase,
  selectRandomTemplate,
  WorkoutTemplate
} from './templates';
import {
  createTrainingProtocol,
  createPhase,
  createDailyProtocol,
  createSession,
  getAthleteProfile
} from '../database/operations';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateProtocolOptions {
  userId: number;
  startDate: string; // "2025-12-16"
  raceDate: string;  // "2026-11-07"
  useAI?: boolean;   // default true - set false for faster template-based generation
}

// Calculate days between two dates
function daysBetween(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Add days to a date
function addDays(dateString: string, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

// Get day of week (1 = Monday, 7 = Sunday)
function getDayOfWeek(dateString: string): number {
  const date = new Date(dateString);
  const day = date.getDay();
  return day === 0 ? 7 : day; // Convert Sunday from 0 to 7
}

// Main protocol generator
export async function generateFullProtocol(options: GenerateProtocolOptions): Promise<{
  success: boolean;
  protocolId?: number;
  error?: string;
}> {
  try {
    const { userId, startDate, raceDate, useAI = true } = options;

    console.log(`🏊‍♂️ Generating 326-day Ironman protocol for user ${userId}...`);
    console.log(`Start: ${startDate} → Race: ${raceDate}`);

    // Validate dates
    const totalDays = daysBetween(startDate, raceDate);
    if (totalDays < 300 || totalDays > 365) {
      throw new Error(`Invalid training period: ${totalDays} days. Expected 300-365 days.`);
    }

    // Get athlete profile for personalization
    const profile = await getAthleteProfile(userId);
    if (!profile) {
      throw new Error('Athlete profile not found. Create profile first.');
    }

    // Generate weekly load curve (47 weeks)
    const weeklyLoadCurve = generateLoadCurve(100); // base load of 100

    // Create master training protocol record
    const protocolResult = createTrainingProtocol(userId, {
      startDate,
      raceDate,
      totalDays,
      weeklyLoadCurve,
      version: '1.0'
    });

    const protocolId = protocolResult.lastInsertRowid;
    console.log(`✅ Created training protocol #${protocolId}`);

    // Create phase records
    const phaseSchedule = calculatePhaseDays(new Date(startDate), new Date(raceDate));
    for (const { phase, startDay, endDay } of phaseSchedule) {
      createPhase(protocolId as number, {
        key: phase.key,
        name: phase.name,
        startDay,
        endDay,
        durationWeeks: phase.durationWeeks,
        goals: phase.goals,
        focus: phase.focus,
        loadMultiplier: phase.loadMultiplier,
        color: phase.color
      });
    }
    console.log(`✅ Created ${phaseSchedule.length} training phases`);

    // Generate daily protocols (day by day)
    console.log(`🔄 Generating ${totalDays} daily protocols...`);

    let generatedCount = 0;
    for (let dayIndex = 1; dayIndex <= totalDays; dayIndex++) {
      const currentDate = addDays(startDate, dayIndex - 1);
      const daysToRace = totalDays - dayIndex + 1;
      const percentComplete = ((dayIndex / totalDays) * 100).toFixed(1);

      // Get phase for this day
      const phaseInfo = getPhaseForDay(dayIndex);
      if (!phaseInfo) {
        console.warn(`⚠️  No phase found for day ${dayIndex}`);
        continue;
      }

      const { phase, dayInPhase, weekInPhase } = phaseInfo;

      // Calculate week number and day of week
      const weekNumber = Math.ceil(dayIndex / 7);
      const weekDayNumber = getDayOfWeek(currentDate);
      const isRecoveryWeek = weekNumber % 4 === 0;

      // Get daily load target from curve
      const weekIndex = weekNumber - 1;
      const dailyLoadTarget = weeklyLoadCurve[weekIndex] / 7; // divide weekly load by 7

      // Generate sessions for this day
      const sessions = await generateDailySessions({
        phase,
        dayOfWeek: weekDayNumber,
        weekInPhase,
        isRecoveryWeek,
        profile,
        useAI
      });

      // Generate daily protocol
      const dailyProtocolData = {
        protocolId,
        date: currentDate,
        dayIndex,
        daysToRace,
        percentComplete: parseFloat(percentComplete),
        phase: {
          key: phase.key,
          name: phase.name,
          color: phase.color
        },
        weekNumber,
        weekDayNumber,
        isRecoveryWeek,
        dailyLoadTarget: Math.round(dailyLoadTarget),
        nutrition: generateNutrition(sessions),
        recovery: generateRecovery(isRecoveryWeek, weekDayNumber),
        mindset: generateMindset(phase, dayIndex, daysToRace),
        admin: generateAdmin(weekDayNumber, phase),
        guardrails: generateGuardrails(phase, isRecoveryWeek),
        whyThisDayMatters: generateWhyMatters(phase, dayIndex, sessions),
        coachNote: generateCoachNote(phase, dayIndex, isRecoveryWeek)
      };

      // Create daily protocol record
      const dailyResult = createDailyProtocol(userId, dailyProtocolData);
      const dailyProtocolId = dailyResult.lastInsertRowid;

      // Create session records
      for (const session of sessions) {
        createSession(dailyProtocolId as number, session);
      }

      generatedCount++;

      // Progress indicator every 50 days
      if (dayIndex % 50 === 0) {
        console.log(`   Progress: ${dayIndex}/${totalDays} days (${percentComplete}%)`);
      }
    }

    console.log(`✅ Generated ${generatedCount} daily protocols with sessions`);
    console.log(`🎉 Protocol generation complete!`);

    return {
      success: true,
      protocolId: protocolId as number
    };

  } catch (error: any) {
    console.error('❌ Protocol generation failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Generate sessions for a specific day
async function generateDailySessions(params: {
  phase: any;
  dayOfWeek: number;
  weekInPhase: number;
  isRecoveryWeek: boolean;
  profile: any;
  useAI: boolean;
}): Promise<any[]> {
  const { phase, dayOfWeek, isRecoveryWeek, profile } = params;
  const sessions: any[] = [];

  // Determine which workouts for this day based on phase and day of week
  // Monday (1): Swim + Strength
  // Tuesday (2): Bike + Run
  // Wednesday (3): Swim + Strength
  // Thursday (4): Bike
  // Friday (5): Run + Swim
  // Saturday (6): Long Bike or Long Brick
  // Sunday (7): Long Run or Rest

  const phaseKey = phase.key;

  // Rest day on Sunday for TRANSITION and early phases
  if (dayOfWeek === 7 && ['TRANSITION', 'FOUNDATION'].includes(phaseKey)) {
    return []; // Complete rest day
  }

  // Saturday: Long bike day
  if (dayOfWeek === 6) {
    const bikeTemplates = getTemplatesForPhase(phaseKey, 'bike');
    const longBike = bikeTemplates.find(t => t.name.includes('Long')) || bikeTemplates[0];
    if (longBike) {
      sessions.push({
        order: 1,
        type: longBike.type,
        planned: {
          duration: longBike.duration,
          distance: longBike.distance,
          intensity: longBike.intensity,
          zones: longBike.zones,
          description: longBike.description,
          purpose: longBike.purpose,
          alternatives: longBike.alternatives
        }
      });
    }

    // Add brick run in BUILD phases
    if (['BUILD_1', 'BUILD_2'].includes(phaseKey)) {
      const runTemplates = getTemplatesForPhase(phaseKey, 'run');
      const brickRun = runTemplates[0];
      if (brickRun) {
        sessions.push({
          order: 2,
          type: brickRun.type,
          planned: {
            duration: Math.floor(brickRun.duration / 2), // Shorter run after bike
            distance: brickRun.distance ? brickRun.distance / 2 : undefined,
            intensity: brickRun.intensity,
            zones: ['30min @ race pace after bike'],
            description: 'Brick run immediately after bike. Practice race transitions.',
            purpose: 'Train running legs off the bike.',
            alternatives: 'Skip if extremely fatigued'
          }
        });
      }
    }
  }

  // Sunday: Long run day
  if (dayOfWeek === 7 && !['TRANSITION', 'FOUNDATION'].includes(phaseKey)) {
    const runTemplates = getTemplatesForPhase(phaseKey, 'run');
    const longRun = runTemplates.find(t => t.name.includes('Long')) || runTemplates[0];
    if (longRun) {
      sessions.push({
        order: 1,
        type: longRun.type,
        planned: {
          duration: longRun.duration,
          distance: longRun.distance,
          intensity: longRun.intensity,
          zones: longRun.zones,
          description: longRun.description,
          purpose: longRun.purpose,
          alternatives: longRun.alternatives
        }
      });
    }
  }

  // Monday: Swim + Strength
  if (dayOfWeek === 1) {
    const swimTemplates = getTemplatesForPhase(phaseKey, 'swim');
    const swim = selectRandomTemplate(swimTemplates);
    if (swim) {
      sessions.push({
        order: 1,
        type: swim.type,
        planned: {
          duration: swim.duration,
          distance: swim.distance,
          intensity: swim.intensity,
          zones: swim.zones,
          description: swim.description,
          purpose: swim.purpose,
          alternatives: swim.alternatives
        }
      });
    }

    const strengthTemplates = getTemplatesForPhase(phaseKey, 'strength');
    const strength = selectRandomTemplate(strengthTemplates);
    if (strength && !isRecoveryWeek) {
      sessions.push({
        order: 2,
        type: strength.type,
        planned: {
          duration: strength.duration,
          intensity: strength.intensity,
          zones: strength.zones,
          description: strength.description,
          purpose: strength.purpose,
          alternatives: strength.alternatives
        }
      });
    }
  }

  // Tuesday: Bike + Run
  if (dayOfWeek === 2) {
    const bikeTemplates = getTemplatesForPhase(phaseKey, 'bike');
    const bike = selectRandomTemplate(bikeTemplates.filter(t => !t.name.includes('Long')));
    if (bike) {
      sessions.push({
        order: 1,
        type: bike.type,
        planned: {
          duration: bike.duration,
          distance: bike.distance,
          intensity: bike.intensity,
          zones: bike.zones,
          description: bike.description,
          purpose: bike.purpose,
          alternatives: bike.alternatives
        }
      });
    }

    const runTemplates = getTemplatesForPhase(phaseKey, 'run');
    const run = selectRandomTemplate(runTemplates.filter(t => !t.name.includes('Long')));
    if (run) {
      sessions.push({
        order: 2,
        type: run.type,
        planned: {
          duration: run.duration,
          distance: run.distance,
          intensity: run.intensity,
          zones: run.zones,
          description: run.description,
          purpose: run.purpose,
          alternatives: run.alternatives
        }
      });
    }
  }

  // Wednesday: Swim + Strength
  if (dayOfWeek === 3) {
    const swimTemplates = getTemplatesForPhase(phaseKey, 'swim');
    const swim = selectRandomTemplate(swimTemplates);
    if (swim) {
      sessions.push({
        order: 1,
        type: swim.type,
        planned: {
          duration: swim.duration,
          distance: swim.distance,
          intensity: swim.intensity,
          zones: swim.zones,
          description: swim.description,
          purpose: swim.purpose,
          alternatives: swim.alternatives
        }
      });
    }

    const strengthTemplates = getTemplatesForPhase(phaseKey, 'strength');
    const strength = selectRandomTemplate(strengthTemplates);
    if (strength && !isRecoveryWeek) {
      sessions.push({
        order: 2,
        type: strength.type,
        planned: {
          duration: strength.duration,
          intensity: strength.intensity,
          zones: strength.zones,
          description: strength.description,
          purpose: strength.purpose,
          alternatives: strength.alternatives
        }
      });
    }
  }

  // Thursday: Bike
  if (dayOfWeek === 4) {
    const bikeTemplates = getTemplatesForPhase(phaseKey, 'bike');
    const bike = selectRandomTemplate(bikeTemplates.filter(t => !t.name.includes('Long')));
    if (bike) {
      sessions.push({
        order: 1,
        type: bike.type,
        planned: {
          duration: bike.duration,
          distance: bike.distance,
          intensity: bike.intensity,
          zones: bike.zones,
          description: bike.description,
          purpose: bike.purpose,
          alternatives: bike.alternatives
        }
      });
    }
  }

  // Friday: Run + Swim
  if (dayOfWeek === 5) {
    const runTemplates = getTemplatesForPhase(phaseKey, 'run');
    const run = selectRandomTemplate(runTemplates.filter(t => !t.name.includes('Long')));
    if (run) {
      sessions.push({
        order: 1,
        type: run.type,
        planned: {
          duration: run.duration,
          distance: run.distance,
          intensity: run.intensity,
          zones: run.zones,
          description: run.description,
          purpose: run.purpose,
          alternatives: run.alternatives
        }
      });
    }

    const swimTemplates = getTemplatesForPhase(phaseKey, 'swim');
    const swim = selectRandomTemplate(swimTemplates);
    if (swim) {
      sessions.push({
        order: 2,
        type: swim.type,
        planned: {
          duration: swim.duration,
          distance: swim.distance,
          intensity: swim.intensity,
          zones: swim.zones,
          description: swim.description,
          purpose: swim.purpose,
          alternatives: swim.alternatives
        }
      });
    }
  }

  // Scale down volume on recovery weeks
  if (isRecoveryWeek) {
    sessions.forEach(session => {
      session.planned.duration = Math.floor(session.planned.duration * 0.75);
      if (session.planned.distance) {
        session.planned.distance = Math.floor(session.planned.distance * 0.75);
      }
    });
  }

  return sessions;
}

// Generate nutrition guidance
function generateNutrition(sessions: any[]): any {
  const totalDuration = sessions.reduce((sum, s) => sum + (s.planned.duration || 0), 0);
  const hasLongSession = sessions.some(s => s.planned.duration >= 90);

  return {
    preWorkout: totalDuration > 60 ? 'Carbs 60-90min before: oatmeal, banana, coffee' : 'Light carbs 30-60min before: banana + coffee',
    duringWorkout: hasLongSession ? 'Fuel every 20min: gels, sports drink, or bars' : totalDuration > 60 ? 'Water + electrolytes' : 'Water only',
    postWorkout: 'Protein + carbs within 30min: shake, eggs, or recovery meal',
    dailyProtein: 'Target 180g+ protein spread across 4-5 meals',
    hydration: 'Half bodyweight in oz (100oz+). Urine should be pale yellow.',
    sodium: hasLongSession ? 'Extra sodium: salt on meals, electrolyte tabs in bottles' : 'Normal diet sufficient',
    notes: hasLongSession ? 'Practice race nutrition strategy. Test everything in training first.' : 'Stay consistent with meal timing'
  };
}

// Generate recovery guidance
function generateRecovery(isRecoveryWeek: boolean, dayOfWeek: number): any {
  return {
    sleepTarget: isRecoveryWeek ? '8-9 hours - extra recovery needed' : '7.5-8.5 hours minimum',
    stretching: dayOfWeek === 7 ? 'Full 20min routine: all major muscle groups' : '10min post-workout: hips, hamstrings, calves',
    foamRolling: dayOfWeek === 7 || isRecoveryWeek,
    iceBath: false, // Generally not recommended for Ironman training
    compression: dayOfWeek === 7 ? true : false,
    notes: isRecoveryWeek ? 'This is a recovery week - prioritize sleep over everything' : 'Sleep is non-negotiable. Adaptation happens during rest.'
  };
}

// Generate mindset prompts
function generateMindset(phase: any, dayIndex: number, daysToRace: number): any {
  const prompts = [
    'Why did you choose Ironman Florida?',
    'What does finishing strong mean to you?',
    'Who are you doing this for?',
    'What will you tell yourself at mile 20 of the run?'
  ];

  const affirmations = [
    'I am building the version of myself I respect.',
    'Every session makes me stronger.',
    'I show up even when I don\'t feel like it.',
    'I trust the process.',
    'I am becoming an Ironman.'
  ];

  return {
    prompt: prompts[Math.floor(Math.random() * prompts.length)],
    affirmation: affirmations[Math.floor(Math.random() * affirmations.length)],
    focus: phase.focus,
    mantra: 'One day, one session, one breath.'
  };
}

// Generate admin tasks
function generateAdmin(dayOfWeek: number, phase: any): string[] {
  const tasks: string[] = [];

  if (dayOfWeek === 1) tasks.push('Review week ahead in calendar');
  if (dayOfWeek === 5) tasks.push('Prep nutrition for weekend long sessions');
  if (dayOfWeek === 6) tasks.push('Check bike: tire pressure, chain lube, bottles clean');
  if (phase.key === 'BUILD_2') tasks.push('Check race registration and travel details');
  if (phase.key === 'TAPER') tasks.push('Finalize race day gear checklist');

  return tasks;
}

// Generate guardrails
function generateGuardrails(phase: any, isRecoveryWeek: boolean): any {
  return {
    sleepMin: 7.0,
    maxIntensitySessions: phase.key === 'TRANSITION' ? 0 : phase.key === 'FOUNDATION' ? 1 : 2,
    requiresRestIfSoreAbove: isRecoveryWeek ? 6 : 7,
    notes: phase.key === 'TRANSITION'
      ? 'This is transition. If tired, rest. No heroes week 1.'
      : isRecoveryWeek
      ? 'Recovery week - listen to your body. Rest is training.'
      : 'Push when fresh, rest when broken. Consistency beats heroics.'
  };
}

// Generate "why this day matters" explanation
function generateWhyMatters(phase: any, dayIndex: number, sessions: any[]): string {
  if (dayIndex === 1) {
    return 'Day 1 sets the tone for 326 days. You\'re not trying to be fast today—you\'re showing your body that you\'re serious about consistency. Every Ironman starts with one easy run.';
  }

  const hasLongSession = sessions.some(s => s.planned.duration >= 120);
  if (hasLongSession) {
    return `Big day today. This long session builds the aerobic engine that will carry you through 140.6 miles. ${phase.focus}`;
  }

  if (sessions.length === 0) {
    return 'Rest day. Your body adapts during recovery, not during training. Today you get stronger by doing nothing.';
  }

  return `${phase.focus} Every session counts. You\'re building the athlete who will cross that finish line in ${Math.ceil((327 - dayIndex) / 30)} months.`;
}

// Generate coach note
function generateCoachNote(phase: any, dayIndex: number, isRecoveryWeek: boolean): string {
  if (dayIndex === 1) return 'Welcome to Day 1. No pressure. Just movement. Check in after and tell me how it felt.';
  if (isRecoveryWeek) return 'Recovery week. Listen to your body. If something feels off, back off. We\'re building for the long game.';
  if (phase.key === 'BUILD_2') return 'Peak training. This is where champions are made. Trust your training. You\'re ready for this.';
  if (phase.key === 'TAPER') return 'Taper jitters are normal. Trust the process. Your body is absorbing all the training. Stay patient.';
  if (phase.key === 'RACE_WEEK') return 'Race week. Stay calm. You\'ve done the work. Now we just stay loose and visualize success.';

  return 'One day at a time. Show up, do the work, recover, repeat. You\'ve got this.';
}

export default generateFullProtocol;
