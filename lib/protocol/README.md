# Protocol Generator System

AI-powered 326-day Ironman training protocol generator for Project IronMind.

## Overview

This system generates a complete, personalized training protocol from day 1 to race day, incorporating periodization principles, athlete-specific customization, and intelligent workout distribution.

## Architecture

```
protocol/
├── phases.ts       # 8 training phases with periodization rules
├── templates.ts    # 100+ workout templates for each phase/discipline
├── generator.ts    # Main protocol generation logic
└── README.md       # This file
```

## Training Phases (8 Total, 47 Weeks)

1. **TRANSITION** (2 weeks) - Easy reintroduction, no intensity
2. **FOUNDATION** (8 weeks) - Build aerobic base, 80% easy
3. **BASE_1** (8 weeks) - Increase volume, add tempo work
4. **BASE_2** (8 weeks) - Peak aerobic volume, race nutrition practice
5. **BUILD_1** (8 weeks) - Shift to intensity, race pace intervals
6. **BUILD_2** (6 weeks) - Peak training load, race simulations
7. **PEAK** (3 weeks) - Maintain fitness, begin taper prep
8. **TAPER** (3 weeks) - Reduce volume 40-60%, maintain intensity
9. **RACE_WEEK** (1 week) - Final rest, mental prep, race day

Total: 47 weeks (329 days)

## Workout Distribution

### Weekly Pattern (Example from BASE_1)

- **Monday**: Swim (technique) + Strength
- **Tuesday**: Bike (tempo) + Run (easy)
- **Wednesday**: Swim (intervals) + Strength
- **Thursday**: Bike (endurance)
- **Friday**: Run (tempo) + Swim (easy)
- **Saturday**: Long Bike (2-5 hours)
- **Sunday**: Long Run (75-120 min)

### Recovery Weeks

Every 4th week is a recovery week with:
- 25% reduction in volume
- 30% reduction in intensity sessions
- Extra focus on sleep and nutrition

## Daily Protocol Structure

Each day includes:

```typescript
{
  date: "2025-12-16",
  dayIndex: 1,
  daysToRace: 326,
  phase: { key, name, color },
  sessions: [
    {
      type: "run",
      planned: {
        duration: 30,
        distance: 3.0,
        intensity: "easy",
        zones: ["Z1-Z2: 30 minutes"],
        description: "Easy aerobic run...",
        purpose: "Reintroduce running movement",
        alternatives: "Walk if any pain..."
      }
    }
  ],
  nutrition: { preWorkout, duringWorkout, postWorkout, ... },
  recovery: { sleepTarget, stretching, foamRolling, ... },
  mindset: { prompt, affirmation, focus, mantra },
  admin: ["Check bike", "Prep gear", ...],
  guardrails: { sleepMin, maxIntensitySessions, ... },
  whyThisDayMatters: "Day 1 sets the tone...",
  coachNote: "Welcome to Day 1..."
}
```

## Usage

### Generate Full Protocol

```typescript
import generateFullProtocol from '@/lib/protocol/generator';

const result = await generateFullProtocol({
  userId: 1,
  startDate: '2025-12-16',
  raceDate: '2026-11-07',
  useAI: false // true to use GPT-4 for enhanced generation
});

console.log(result.protocolId); // Created protocol ID
```

### Via API Endpoint

```bash
POST /api/protocol/generate
{
  "userId": 1,
  "startDate": "2025-12-16",
  "raceDate": "2026-11-07",
  "athleteProfile": {
    "experience": "intermediate",
    "weeklyHoursBase": 10.0,
    "weeklyHoursPeak": 16.0,
    ...
  }
}
```

### Test Script

```bash
npm run test:protocol
```

This runs the full protocol generation and validates:
- User creation
- Athlete profile setup
- 326-day protocol generation
- Daily protocol retrieval
- Phase transitions
- Race week protocols

## Workout Templates

### Swim Templates (by phase)
- Easy technique work (Foundation)
- Threshold intervals (Base 1)
- Long steady swims (Base 2)
- Race pace practice (Build 1/2)
- Race simulation: 2.4 miles (Build 2)
- Taper maintenance (Taper)

### Bike Templates
- Easy spins (Transition)
- Long steady rides 2-5 hours (Foundation/Base)
- Tempo rides with intervals (Base 1/Build 1)
- Century rides at race pace (Build 2)
- Brick workouts: bike → run (Build phases)
- Final long rides (Peak)

### Run Templates
- Easy aerobic runs (Foundation)
- Tempo runs with threshold work (Base 1)
- Long runs up to 2 hours (Base 2)
- Race pace long runs (Build phases)
- Half marathon at goal pace (Peak)
- Taper runs with strides (Taper)

### Strength Templates
- Foundation movements: bodyweight only (Transition)
- Core stability work (Foundation/Base)
- Functional strength (Base/Build)
- Maintenance only (Build 2)
- Mobility focus (Peak)
- None (Taper/Race Week)

## Training Zones

### Swim Zones
- **Z1**: Easy aerobic, <70% max HR
- **Z2**: Steady aerobic, 70-80% max HR
- **Z3**: Tempo, 80-85% max HR
- **Z4**: Threshold, 85-90% max HR
- **Z5**: VO2 max, 90-95% max HR
- **CSS**: Critical Swim Speed (race pace)

### Bike Zones (Power-Based)
- **Z1**: Recovery, <55% FTP
- **Z2**: Endurance, 55-75% FTP
- **Z3**: Tempo, 75-85% FTP
- **Z4**: Threshold, 85-95% FTP
- **Z5**: VO2 max, 95-105% FTP
- **Z6**: Anaerobic, >105% FTP

### Run Zones (Heart Rate)
- **Z1**: Recovery, <70% max HR
- **Z2**: Easy aerobic, 70-80% max HR
- **Z3**: Tempo, 80-85% max HR
- **Z4**: Threshold, 85-90% max HR
- **Z5**: VO2 max, 90-95% max HR

## Nutrition Strategy

- **< 60min**: Water only
- **60-90min**: Water + electrolytes
- **90min+**: Fuel every 20min (60-90g carbs/hour)
- **Post-workout**: Protein + carbs within 30min
- **Daily target**: 180g+ protein across 4-5 meals
- **Hydration**: Half bodyweight in oz (100oz+ for 200lb athlete)

## Recovery Protocols

### Daily
- 7.5-8.5 hours sleep minimum
- 10min post-workout stretching
- Protein within 30min

### Weekly
- One complete rest day (or active recovery)
- Full 20min stretch routine on rest day
- Foam rolling for sore areas

### Every 4th Week
- Recovery week: 25% volume reduction
- 8-9 hours sleep target
- Extra focus on nutrition and hydration

## Guardrails

The system includes safety mechanisms:

```typescript
guardrails: {
  sleepMin: 7.0,                    // Minimum hours of sleep
  maxIntensitySessions: 2,          // Max hard sessions per week
  requiresRestIfSoreAbove: 7,       // Rest if soreness > 7/10
  notes: "Listen to your body..."
}
```

If check-in data shows:
- Sleep < 7 hours
- Soreness > 7/10
- Readiness score < 60

The system can adapt the protocol (future feature).

## Load Management

Training load is calculated using a TSS-like (Training Stress Score) system:

- **Transition**: 40% of peak load
- **Foundation**: 60% of peak load
- **Base 1**: 75% of peak load
- **Base 2**: 85% of peak load
- **Build 1**: 90% of peak load
- **Build 2**: 100% of peak load (PEAK WEEK)
- **Peak**: 80% of peak load
- **Taper**: 40% of peak load
- **Race Week**: 15% of peak load

Recovery weeks: 70% of phase load

## Future Enhancements

### AI-Powered Generation (GPT-4)
When `useAI: true`, the generator will:
- Analyze athlete profile in depth
- Create custom workout descriptions
- Generate personalized coach notes
- Provide contextual "why this matters" explanations
- Adapt workouts to specific goals and constraints

### Adaptive Protocol
- Real-time adjustments based on check-in data
- Injury risk detection and prevention
- Performance trend analysis
- Automatic workout modifications

### Integration
- Strava workout sync
- Calendar integration
- Weather-based adaptations
- Real-time coach feedback via VANTAGE

## API Endpoints

- `POST /api/protocol/generate` - Generate full protocol
- `GET /api/protocol/[date]` - Get daily protocol
- `POST /api/sessions/complete` - Log completed session
- `POST /api/checkins` - Submit daily check-in
- `GET /api/progress/graph` - Weekly load visualization

## Database Schema

Protocols are stored in SQLite (dev) / PostgreSQL (prod):

- `training_protocols` - Master protocol record
- `phases` - 8 phase definitions with date ranges
- `daily_protocols` - 326 daily protocol records
- `sessions` - Individual workouts (planned + actual)
- `checkins` - Daily readiness data
- `progress_snapshots` - Weekly rollup statistics

## Success Criteria

✅ Generate 326-day protocol in < 30 seconds
✅ Every day has appropriate workouts for phase
✅ Weekly load follows periodization curve
✅ Recovery weeks every 4th week
✅ Race week properly tapered
✅ All sessions include purpose, alternatives, and coach notes

## Testing

Run the test suite:

```bash
npm run test:protocol
```

Expected output:
- User created ✅
- Athlete profile created ✅
- Protocol generated ✅ (10-30 seconds)
- Day 1 retrieved ✅
- Day 100 retrieved ✅
- Race week retrieved ✅

---

**Built for Project IronMind**
*Transform yourself. One day at a time.*
