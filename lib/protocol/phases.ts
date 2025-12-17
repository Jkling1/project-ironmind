// Training phases for 326-day Ironman protocol
// Based on periodization principles and athlete profile

export interface Phase {
  key: string;
  name: string;
  durationWeeks: number;
  goals: string[];
  focus: string;
  loadMultiplier: number; // relative to peak training
  color: string;
  weeklyPattern: {
    swim: number; // sessions per week
    bike: number;
    run: number;
    strength: number;
  };
  intensityDistribution: {
    easy: number; // percentage
    moderate: number;
    hard: number;
  };
  keyWorkouts: string[];
}

// 8 training phases for Ironman preparation
// Total: 47 weeks (329 days, allowing 3 buffer days)
export const TRAINING_PHASES: Phase[] = [
  {
    key: 'TRANSITION',
    name: 'Transition Phase',
    durationWeeks: 2,
    goals: [
      'Reintroduce training after break',
      'Assess baseline fitness',
      'Build movement habits',
      'No intensity pressure'
    ],
    focus: 'Easy aerobic movement. Form over speed. Consistency over intensity.',
    loadMultiplier: 0.4,
    color: '#6366F1', // Indigo
    weeklyPattern: {
      swim: 2,
      bike: 2,
      run: 3,
      strength: 2
    },
    intensityDistribution: {
      easy: 100,
      moderate: 0,
      hard: 0
    },
    keyWorkouts: [
      'Easy 30-45min runs',
      'Short technique swims',
      'Easy spin on bike',
      'Foundation strength work'
    ]
  },

  {
    key: 'FOUNDATION',
    name: 'Foundation Phase',
    durationWeeks: 8,
    goals: [
      'Build aerobic base',
      'Develop technical proficiency',
      'Strengthen connective tissue',
      'Establish training routine'
    ],
    focus: 'Volume over intensity. 80% easy, 20% moderate. Build durability.',
    loadMultiplier: 0.6,
    color: '#10B981', // Green
    weeklyPattern: {
      swim: 3,
      bike: 3,
      run: 4,
      strength: 2
    },
    intensityDistribution: {
      easy: 80,
      moderate: 20,
      hard: 0
    },
    keyWorkouts: [
      'Long easy runs (60-90min)',
      'Threshold swim intervals',
      'Long steady rides (2-3 hours)',
      'Core stability training'
    ]
  },

  {
    key: 'BASE_1',
    name: 'Base Building Phase 1',
    durationWeeks: 8,
    goals: [
      'Increase weekly volume 10-15%',
      'Introduce tempo work',
      'Build aerobic capacity',
      'Maintain technical focus'
    ],
    focus: 'Progressive volume increase. Start adding tempo intervals.',
    loadMultiplier: 0.75,
    color: '#3B82F6', // Blue
    weeklyPattern: {
      swim: 3,
      bike: 4,
      run: 4,
      strength: 2
    },
    intensityDistribution: {
      easy: 70,
      moderate: 25,
      hard: 5
    },
    keyWorkouts: [
      'Tempo runs (20-30min at threshold)',
      'CSS intervals in pool',
      'Long rides with tempo blocks',
      'Functional strength'
    ]
  },

  {
    key: 'BASE_2',
    name: 'Base Building Phase 2',
    durationWeeks: 8,
    goals: [
      'Peak aerobic volume',
      'Dial in race nutrition',
      'Build mental stamina',
      'Long brick workouts'
    ],
    focus: 'Maximum volume weeks. Practice race-day fueling.',
    loadMultiplier: 0.85,
    color: '#0EA5E9', // Cyan
    weeklyPattern: {
      swim: 3,
      bike: 4,
      run: 4,
      strength: 1
    },
    intensityDistribution: {
      easy: 65,
      moderate: 30,
      hard: 5
    },
    keyWorkouts: [
      'Long runs up to 2 hours',
      'Long swims (3000-4000y)',
      '4-5 hour bike rides',
      'Bike-run bricks'
    ]
  },

  {
    key: 'BUILD_1',
    name: 'Build Phase 1',
    durationWeeks: 8,
    goals: [
      'Increase intensity at race pace',
      'Reduce volume slightly',
      'Race-specific intervals',
      'Build lactate threshold'
    ],
    focus: 'Shift from volume to intensity. Race pace confidence.',
    loadMultiplier: 0.9,
    color: '#F59E0B', // Amber
    weeklyPattern: {
      swim: 3,
      bike: 4,
      run: 4,
      strength: 1
    },
    intensityDistribution: {
      easy: 60,
      moderate: 30,
      hard: 10
    },
    keyWorkouts: [
      'Threshold intervals on all three',
      'Race pace blocks',
      'Long ride with race pace segments',
      'Tempo runs at goal pace'
    ]
  },

  {
    key: 'BUILD_2',
    name: 'Build Phase 2',
    durationWeeks: 6,
    goals: [
      'Peak training load',
      'Race simulation workouts',
      'Mental preparation',
      'Fine-tune pacing strategy'
    ],
    focus: 'Maximum training stress. Full dress rehearsals.',
    loadMultiplier: 1.0,
    color: '#EF4444', // Red
    weeklyPattern: {
      swim: 3,
      bike: 4,
      run: 4,
      strength: 1
    },
    intensityDistribution: {
      easy: 55,
      moderate: 35,
      hard: 10
    },
    keyWorkouts: [
      'Race simulation: 2.4mi swim',
      '100-mile bike at race effort',
      '20-mile run at goal pace',
      'Full brick workouts'
    ]
  },

  {
    key: 'PEAK',
    name: 'Peak Phase',
    durationWeeks: 3,
    goals: [
      'Maintain fitness gains',
      'Sharpen race readiness',
      'Begin taper preparation',
      'Address any weak points'
    ],
    focus: 'Short, sharp efforts. Maintain intensity, reduce volume.',
    loadMultiplier: 0.8,
    color: '#8B5CF6', // Purple
    weeklyPattern: {
      swim: 2,
      bike: 3,
      run: 3,
      strength: 1
    },
    intensityDistribution: {
      easy: 60,
      moderate: 30,
      hard: 10
    },
    keyWorkouts: [
      'Short race pace efforts',
      'Final long ride (80-100mi)',
      'Half marathon at goal pace',
      'Open water swim practice'
    ]
  },

  {
    key: 'TAPER',
    name: 'Taper Phase',
    durationWeeks: 3,
    goals: [
      'Reduce training volume 40-60%',
      'Maintain intensity (not volume)',
      'Optimize recovery and freshness',
      'Mental preparation'
    ],
    focus: 'Rest is training. Let adaptations solidify.',
    loadMultiplier: 0.4,
    color: '#EC4899', // Pink
    weeklyPattern: {
      swim: 2,
      bike: 2,
      run: 2,
      strength: 0
    },
    intensityDistribution: {
      easy: 80,
      moderate: 15,
      hard: 5
    },
    keyWorkouts: [
      'Short swims with race pace segments',
      'Easy rides with 5min race efforts',
      'Short runs with strides',
      'Visualization and mental prep'
    ]
  },

  {
    key: 'RACE_WEEK',
    name: 'Race Week',
    durationWeeks: 1,
    goals: [
      'Final rest and recovery',
      'Stay loose and fresh',
      'Execute race prep checklist',
      'Mental confidence building'
    ],
    focus: 'Trust your training. Stay calm. Execute the plan.',
    loadMultiplier: 0.15,
    color: '#F97316', // Orange
    weeklyPattern: {
      swim: 1,
      bike: 1,
      run: 2,
      strength: 0
    },
    intensityDistribution: {
      easy: 90,
      moderate: 10,
      hard: 0
    },
    keyWorkouts: [
      'Short 15min easy swim',
      '20min easy spin',
      '15min easy jog with 4x30sec strides',
      'Gear prep and mental rehearsal'
    ]
  }
];

// Calculate day ranges for each phase
export function calculatePhaseDays(startDate: Date, raceDate: Date): Array<{
  phase: Phase;
  startDay: number;
  endDay: number;
}> {
  let currentDay = 1;
  const phaseSchedule = [];

  for (const phase of TRAINING_PHASES) {
    const daysInPhase = phase.durationWeeks * 7;
    phaseSchedule.push({
      phase,
      startDay: currentDay,
      endDay: currentDay + daysInPhase - 1
    });
    currentDay += daysInPhase;
  }

  return phaseSchedule;
}

// Get phase for a specific day
export function getPhaseForDay(dayIndex: number): { phase: Phase; dayInPhase: number; weekInPhase: number } | null {
  let currentDay = 1;

  for (const phase of TRAINING_PHASES) {
    const daysInPhase = phase.durationWeeks * 7;
    if (dayIndex >= currentDay && dayIndex < currentDay + daysInPhase) {
      const dayInPhase = dayIndex - currentDay + 1;
      const weekInPhase = Math.ceil(dayInPhase / 7);
      return { phase, dayInPhase, weekInPhase };
    }
    currentDay += daysInPhase;
  }

  return null;
}

// Calculate weekly load curve (47 weeks)
export function generateLoadCurve(baseLoad: number = 100): number[] {
  const curve: number[] = [];

  for (const phase of TRAINING_PHASES) {
    for (let week = 0; week < phase.durationWeeks; week++) {
      // Apply recovery week every 3rd or 4th week
      const isRecoveryWeek = (week + 1) % 4 === 0;
      const recoveryMultiplier = isRecoveryWeek ? 0.7 : 1.0;

      const weekLoad = baseLoad * phase.loadMultiplier * recoveryMultiplier;
      curve.push(Math.round(weekLoad));
    }
  }

  return curve;
}

// Training zones definition
export const TRAINING_ZONES = {
  swim: {
    Z1: 'Easy aerobic - conversational pace - <70% max HR',
    Z2: 'Steady aerobic - sustainable - 70-80% max HR',
    Z3: 'Tempo - slightly uncomfortable - 80-85% max HR',
    Z4: 'Threshold - hard but controlled - 85-90% max HR',
    Z5: 'VO2 max - very hard, short intervals - 90-95% max HR',
    CSS: 'Critical Swim Speed - race pace for Ironman distance'
  },
  bike: {
    Z1: 'Recovery - very easy spinning - <55% FTP',
    Z2: 'Endurance - all-day pace - 55-75% FTP',
    Z3: 'Tempo - moderate effort - 75-85% FTP',
    Z4: 'Threshold - hard sustained - 85-95% FTP',
    Z5: 'VO2 max - very hard intervals - 95-105% FTP',
    Z6: 'Anaerobic - maximal efforts - >105% FTP'
  },
  run: {
    Z1: 'Recovery - easy conversational - <70% max HR',
    Z2: 'Easy aerobic - comfortable - 70-80% max HR',
    Z3: 'Tempo - comfortably hard - 80-85% max HR',
    Z4: 'Threshold - hard but controlled - 85-90% max HR',
    Z5: 'VO2 max - very hard - 90-95% max HR'
  }
};

export default TRAINING_PHASES;
