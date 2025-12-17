// Workout templates for each discipline and phase
// Used by protocol generator to create daily sessions

import { Phase } from './phases';

export interface WorkoutTemplate {
  type: 'swim' | 'bike' | 'run' | 'strength' | 'brick';
  name: string;
  duration: number; // minutes
  distance?: number; // miles or yards depending on type
  intensity: 'easy' | 'moderate' | 'tempo' | 'threshold' | 'interval' | 'recovery';
  zones: string[];
  description: string;
  purpose: string;
  alternatives?: string;
}

// ==============================================
// SWIM TEMPLATES
// ==============================================

export const SWIM_TEMPLATES = {
  TRANSITION: [
    {
      type: 'swim' as const,
      name: 'Pool Reintroduction',
      duration: 30,
      distance: 800,
      intensity: 'easy' as const,
      zones: ['Warm-up: 200y easy', 'Main: 4x100y @ 2:30', 'Cool-down: 200y easy'],
      description: 'Gentle reintroduction to swimming. Focus on breathing and relaxation.',
      purpose: 'Assess baseline swim fitness and get comfortable in water.',
      alternatives: 'If no pool access: substitute with 30min walk'
    }
  ],

  FOUNDATION: [
    {
      type: 'swim' as const,
      name: 'Aerobic Base Swim',
      duration: 45,
      distance: 1500,
      intensity: 'easy' as const,
      zones: ['300y warm-up', 'Main: 3x300y @ Z2 with 45sec rest', 'Cool-down: 300y'],
      description: 'Build aerobic base with steady swimming. Focus on technique and breathing rhythm.',
      purpose: 'Develop aerobic capacity and improve swim efficiency.',
      alternatives: 'If tired: reduce main set to 2x300y'
    },
    {
      type: 'swim' as const,
      name: 'Technique Focus',
      duration: 40,
      distance: 1200,
      intensity: 'easy' as const,
      zones: ['200y warm-up', 'Drills: 6x50y (catch-up, fingertip drag, fist)', 'Main: 600y steady', 'Cool-down: 200y'],
      description: 'Drill-focused session to improve stroke mechanics.',
      purpose: 'Refine technique to swim more efficiently at race pace.',
      alternatives: 'If pool crowded: reduce drill variety, focus on catch-up drill'
    }
  ],

  BASE_1: [
    {
      type: 'swim' as const,
      name: 'Threshold Intervals',
      duration: 50,
      distance: 2000,
      intensity: 'tempo' as const,
      zones: ['400y warm-up Z1-Z2', 'Main: 5x200y @ Z3-Z4 with 30sec rest', 'Cool-down: 400y Z1'],
      description: 'Threshold pace intervals. Hold consistent pace across all 200s.',
      purpose: 'Build lactate threshold and race pace stamina.',
      alternatives: 'If struggling: extend rest to 45sec between intervals'
    }
  ],

  BASE_2: [
    {
      type: 'swim' as const,
      name: 'Long Steady Swim',
      duration: 60,
      distance: 3000,
      intensity: 'moderate' as const,
      zones: ['500y warm-up Z1-Z2', 'Main: 2000y continuous @ Z2-Z3', 'Cool-down: 500y Z1'],
      description: 'Long continuous swim at steady pace. Practice race nutrition if needed.',
      purpose: 'Build endurance for 2.4-mile race swim.',
      alternatives: 'Break into 2x1000y if needed with 60sec rest'
    }
  ],

  BUILD_1: [
    {
      type: 'swim' as const,
      name: 'Race Pace Intervals',
      duration: 55,
      distance: 2500,
      intensity: 'threshold' as const,
      zones: ['400y warm-up', 'Main: 5x300y @ goal Ironman pace with 20sec rest', 'Cool-down: 400y'],
      description: 'Race pace practice. Nail your target 100y splits.',
      purpose: 'Build confidence at goal race pace.',
      alternatives: 'If too hard: reduce to 4x300y and extend rest'
    }
  ],

  BUILD_2: [
    {
      type: 'swim' as const,
      name: 'Race Simulation',
      duration: 70,
      distance: 4200,
      intensity: 'moderate' as const,
      zones: ['Full 2.4-mile continuous swim at race effort'],
      description: 'Full Ironman distance swim. Practice sighting, pacing, and nutrition.',
      purpose: 'Mental and physical preparation for race day swim.',
      alternatives: 'If exhausted: swim 3000y and call it a win'
    }
  ],

  PEAK: [
    {
      type: 'swim' as const,
      name: 'Sharpening Intervals',
      duration: 45,
      distance: 2000,
      intensity: 'threshold' as const,
      zones: ['400y warm-up', 'Main: 8x150y @ race pace with 15sec rest', 'Cool-down: 400y'],
      description: 'Short, sharp race pace efforts to maintain fitness.',
      purpose: 'Keep swim speed sharp while reducing volume.',
      alternatives: 'Reduce to 6x150y if fatigued'
    }
  ],

  TAPER: [
    {
      type: 'swim' as const,
      name: 'Taper Swim',
      duration: 30,
      distance: 1200,
      intensity: 'easy' as const,
      zones: ['300y warm-up easy', 'Main: 3x200y @ race pace with 30sec rest', 'Cool-down: 300y'],
      description: 'Short swim with brief race pace segments. Stay loose.',
      purpose: 'Maintain feel for race pace without fatigue.',
      alternatives: 'If tired: just swim 1000y easy continuous'
    }
  ],

  RACE_WEEK: [
    {
      type: 'swim' as const,
      name: 'Race Week Easy Swim',
      duration: 20,
      distance: 800,
      intensity: 'easy' as const,
      zones: ['Easy continuous swimming with a few pickups'],
      description: 'Short, easy swim. Just stay loose and feel the water.',
      purpose: 'Maintain swim feel without adding fatigue.',
      alternatives: 'Skip if you need extra rest'
    }
  ]
};

// ==============================================
// BIKE TEMPLATES
// ==============================================

export const BIKE_TEMPLATES = {
  TRANSITION: [
    {
      type: 'bike' as const,
      name: 'Easy Spin',
      duration: 45,
      distance: 15,
      intensity: 'easy' as const,
      zones: ['Z1-Z2: 45 minutes easy spinning'],
      description: 'Gentle ride to reintroduce cycling. No intensity.',
      purpose: 'Assess bike fitness and get comfortable on the bike.',
      alternatives: 'Indoor trainer if weather is bad'
    }
  ],

  FOUNDATION: [
    {
      type: 'bike' as const,
      name: 'Long Steady Ride',
      duration: 120,
      distance: 40,
      intensity: 'easy' as const,
      zones: ['Z2: 2 hours steady aerobic pace'],
      description: 'Long easy ride building aerobic base. Conversational pace.',
      purpose: 'Build aerobic endurance and time in saddle.',
      alternatives: 'Indoor trainer if weather is bad, add variety with Zwift'
    }
  ],

  BASE_1: [
    {
      type: 'bike' as const,
      name: 'Tempo Ride',
      duration: 90,
      distance: 32,
      intensity: 'tempo' as const,
      zones: ['15min warm-up Z1-Z2', '60min @ Z3 tempo pace', '15min cool-down Z1'],
      description: 'Sustained tempo effort. Slightly uncomfortable but sustainable.',
      purpose: 'Build lactate threshold and improve sustained power.',
      alternatives: 'Break tempo into 2x30min if needed'
    }
  ],

  BASE_2: [
    {
      type: 'bike' as const,
      name: 'Long Endurance Ride',
      duration: 240,
      distance: 80,
      intensity: 'moderate' as const,
      zones: ['Z2: 4 hours at aerobic pace with nutrition practice'],
      description: 'Long ride at race effort. Practice fueling every 20min.',
      purpose: 'Build endurance for 112-mile race. Practice nutrition strategy.',
      alternatives: 'Indoor trainer acceptable, break into 2x2hr if needed'
    }
  ],

  BUILD_1: [
    {
      type: 'bike' as const,
      name: 'Threshold Intervals',
      duration: 90,
      distance: 32,
      intensity: 'threshold' as const,
      zones: ['15min warm-up', 'Main: 3x15min @ Z4 threshold with 5min recovery', '15min cool-down'],
      description: 'Hard sustained efforts at threshold. Focus on pacing discipline.',
      purpose: 'Build race pace power and mental toughness.',
      alternatives: 'Reduce to 2x15min if struggling'
    }
  ],

  BUILD_2: [
    {
      type: 'bike' as const,
      name: 'Race Simulation Ride',
      duration: 300,
      distance: 100,
      intensity: 'moderate' as const,
      zones: ['100 miles at goal Ironman effort with race nutrition'],
      description: 'Full century ride at race pace. Full dress rehearsal.',
      purpose: 'Build confidence for race day bike leg.',
      alternatives: 'Reduce to 80 miles if weather is bad'
    }
  ],

  PEAK: [
    {
      type: 'bike' as const,
      name: 'Final Long Ride',
      duration: 240,
      distance: 85,
      intensity: 'moderate' as const,
      zones: ['Z2-Z3: 4 hours steady with a few race pace blocks'],
      description: 'Last long ride before taper. Ride within yourself.',
      purpose: 'Maintain endurance while beginning to taper volume.',
      alternatives: 'Indoor if needed, focus on maintaining feel'
    }
  ],

  TAPER: [
    {
      type: 'bike' as const,
      name: 'Taper Ride',
      duration: 60,
      distance: 20,
      intensity: 'easy' as const,
      zones: ['45min easy Z1-Z2 with 3x5min @ race pace'],
      description: 'Short ride with brief race pace efforts. Stay fresh.',
      purpose: 'Maintain bike fitness without accumulating fatigue.',
      alternatives: 'Indoor trainer acceptable'
    }
  ],

  RACE_WEEK: [
    {
      type: 'bike' as const,
      name: 'Race Week Spin',
      duration: 30,
      distance: 10,
      intensity: 'easy' as const,
      zones: ['Easy spinning with a few 30-second pickups'],
      description: 'Short easy spin to keep legs loose.',
      purpose: 'Maintain bike feel without adding stress.',
      alternatives: 'Skip if legs need extra rest'
    }
  ]
};

// ==============================================
// RUN TEMPLATES
// ==============================================

export const RUN_TEMPLATES = {
  TRANSITION: [
    {
      type: 'run' as const,
      name: 'Easy Run',
      duration: 30,
      distance: 3,
      intensity: 'easy' as const,
      zones: ['Z1-Z2: 30 minutes easy conversational pace'],
      description: 'Gentle running. Focus on form, not speed.',
      purpose: 'Reintroduce running movement pattern.',
      alternatives: 'Walk if any pain appears. Movement over intensity.'
    }
  ],

  FOUNDATION: [
    {
      type: 'run' as const,
      name: 'Long Easy Run',
      duration: 75,
      distance: 8,
      intensity: 'easy' as const,
      zones: ['Z1-Z2: 75 minutes easy aerobic pace'],
      description: 'Long easy run building aerobic base. Truly easy pace.',
      purpose: 'Build running endurance and leg strength.',
      alternatives: 'Add walking breaks if needed (run 5min, walk 1min)'
    }
  ],

  BASE_1: [
    {
      type: 'run' as const,
      name: 'Tempo Run',
      duration: 60,
      distance: 7,
      intensity: 'tempo' as const,
      zones: ['15min warm-up Z1-Z2', '30min @ Z3 tempo pace', '15min cool-down'],
      description: 'Sustained tempo effort. Comfortably hard pace.',
      purpose: 'Build lactate threshold and goal race pace.',
      alternatives: 'Break tempo into 2x15min if struggling'
    }
  ],

  BASE_2: [
    {
      type: 'run' as const,
      name: 'Long Run',
      duration: 120,
      distance: 13,
      intensity: 'easy' as const,
      zones: ['Z2: 2 hours easy with last 20min @ marathon pace'],
      description: 'Long run building marathon endurance. Practice nutrition.',
      purpose: 'Build endurance for 26.2-mile race run.',
      alternatives: 'Add walk breaks every 20min if needed'
    }
  ],

  BUILD_1: [
    {
      type: 'run' as const,
      name: 'Threshold Intervals',
      duration: 60,
      distance: 7,
      intensity: 'threshold' as const,
      zones: ['15min warm-up', 'Main: 5x5min @ Z4 threshold with 2min recovery jog', '10min cool-down'],
      description: 'Hard interval work at threshold pace.',
      purpose: 'Build speed and mental toughness at race pace.',
      alternatives: 'Reduce to 4x5min if very fatigued'
    }
  ],

  BUILD_2: [
    {
      type: 'run' as const,
      name: 'Race Pace Long Run',
      duration: 135,
      distance: 15,
      intensity: 'moderate' as const,
      zones: ['60min easy Z2', '60min @ goal Ironman marathon pace', '15min cool-down'],
      description: 'Long run with sustained race pace block. Mental preparation.',
      purpose: 'Build confidence at goal marathon pace off the bike.',
      alternatives: 'Reduce race pace block to 45min if struggling'
    }
  ],

  PEAK: [
    {
      type: 'run' as const,
      name: 'Half Marathon at Race Pace',
      duration: 120,
      distance: 13.1,
      intensity: 'moderate' as const,
      zones: ['15min warm-up easy', '13.1 miles @ goal Ironman marathon pace', 'Cool-down'],
      description: 'Half marathon distance at race pace. Confidence builder.',
      purpose: 'Final validation of race pace strategy.',
      alternatives: 'Reduce to 10 miles if weather is bad'
    }
  ],

  TAPER: [
    {
      type: 'run' as const,
      name: 'Taper Run',
      duration: 30,
      distance: 3,
      intensity: 'easy' as const,
      zones: ['20min easy Z1-Z2', '4x1min @ race pace', '10min easy'],
      description: 'Short easy run with brief race pace segments.',
      purpose: 'Maintain running legs without accumulating fatigue.',
      alternatives: 'Skip race pace segments if legs feel heavy'
    }
  ],

  RACE_WEEK: [
    {
      type: 'run' as const,
      name: 'Race Week Easy Jog',
      duration: 20,
      distance: 2,
      intensity: 'easy' as const,
      zones: ['15min easy jog', '4x30sec strides', '5min cool-down'],
      description: 'Short easy jog with a few pickups to keep legs fresh.',
      purpose: 'Maintain run feel without adding stress.',
      alternatives: 'Skip if legs need extra recovery'
    }
  ]
};

// ==============================================
// STRENGTH TEMPLATES
// ==============================================

export const STRENGTH_TEMPLATES = {
  TRANSITION: [
    {
      type: 'strength' as const,
      name: 'Foundation Strength',
      duration: 30,
      intensity: 'moderate' as const,
      zones: ['Bodyweight only - no external load'],
      description: 'Foundation movements: 3x10 squats, lunges, planks, bird-dogs, bridges.',
      purpose: 'Build durable athlete foundation. Injury prevention.',
      alternatives: 'Skip if extremely sore from previous sessions'
    }
  ],

  FOUNDATION: [
    {
      type: 'strength' as const,
      name: 'Core Stability',
      duration: 40,
      intensity: 'moderate' as const,
      zones: ['Core-focused with light weights'],
      description: 'Planks (front/side), dead bugs, pallof press, single-leg deadlifts, step-ups.',
      purpose: 'Build core stability for swim/bike/run efficiency.',
      alternatives: 'Reduce volume if very fatigued from endurance sessions'
    }
  ],

  BASE_1: [
    {
      type: 'strength' as const,
      name: 'Functional Strength',
      duration: 45,
      intensity: 'moderate' as const,
      zones: ['Moderate weights focusing on endurance'],
      description: 'Squats, lunges, deadlifts, rows, push-ups, core work. 3x12-15 reps.',
      purpose: 'Build functional strength for injury prevention.',
      alternatives: 'Use lighter weights if legs are very fatigued'
    }
  ],

  BASE_2: [
    {
      type: 'strength' as const,
      name: 'Maintenance Strength',
      duration: 30,
      intensity: 'moderate' as const,
      zones: ['Light weights, bodyweight focus'],
      description: 'Reduced volume strength to maintain gains during high endurance volume.',
      purpose: 'Maintain strength without interfering with endurance training.',
      alternatives: 'Skip if overreaching on endurance volume'
    }
  ],

  BUILD_1: [
    {
      type: 'strength' as const,
      name: 'Power Endurance',
      duration: 35,
      intensity: 'moderate' as const,
      zones: ['Sport-specific movements'],
      description: 'Single-leg squats, box jumps, kettlebell swings, pull-ups. 3x10 reps.',
      purpose: 'Build power endurance for race performance.',
      alternatives: 'Reduce to bodyweight if very fatigued'
    }
  ],

  BUILD_2: [
    {
      type: 'strength' as const,
      name: 'Minimal Strength',
      duration: 30,
      intensity: 'easy' as const,
      zones: ['Bodyweight only'],
      description: 'Light core and mobility work. Injury prevention focus only.',
      purpose: 'Maintain strength without adding fatigue during peak training.',
      alternatives: 'Skip entirely if needed for recovery'
    }
  ],

  PEAK: [
    {
      type: 'strength' as const,
      name: 'Mobility Focus',
      duration: 30,
      intensity: 'easy' as const,
      zones: ['Mobility and activation only'],
      description: 'Hip openers, shoulder mobility, core activation. No heavy lifting.',
      purpose: 'Maintain mobility and prevent injury.',
      alternatives: 'Can replace with yoga session'
    }
  ],

  TAPER: [],

  RACE_WEEK: []
};

// ==============================================
// BRICK TEMPLATES (bike → run)
// ==============================================

export const BRICK_TEMPLATES = {
  BASE_2: [
    {
      type: 'brick' as const,
      name: 'Short Brick',
      duration: 105,
      intensity: 'moderate' as const,
      zones: ['60min bike @ Z2-Z3', 'Quick transition', '30min run @ race pace', '15min cool-down'],
      description: 'Bike followed immediately by run. Practice transitions.',
      purpose: 'Train body for bike-to-run transition and race pacing.',
      alternatives: 'Reduce run to 20min if legs are very heavy'
    }
  ],

  BUILD_1: [
    {
      type: 'brick' as const,
      name: 'Long Brick',
      duration: 165,
      intensity: 'moderate' as const,
      zones: ['90min bike @ race effort', 'Quick transition', '60min run @ race pace', '15min cool-down'],
      description: 'Long brick workout simulating race conditions.',
      purpose: 'Build confidence running off the bike at race pace.',
      alternatives: 'Reduce run to 45min if very fatigued'
    }
  ],

  BUILD_2: [
    {
      type: 'brick' as const,
      name: 'Race Simulation Brick',
      duration: 300,
      intensity: 'moderate' as const,
      zones: ['3 hours bike @ race watts', 'Full transition practice', '2 hours run @ goal pace'],
      description: 'Full race simulation. Bike + run at goal effort with nutrition.',
      purpose: 'Mental and physical preparation for race day.',
      alternatives: 'This is non-negotiable unless injured'
    }
  ]
};

// Helper function to get templates for a phase
export function getTemplatesForPhase(phaseKey: string, discipline: 'swim' | 'bike' | 'run' | 'strength' | 'brick'): WorkoutTemplate[] {
  switch (discipline) {
    case 'swim':
      return SWIM_TEMPLATES[phaseKey as keyof typeof SWIM_TEMPLATES] || [];
    case 'bike':
      return BIKE_TEMPLATES[phaseKey as keyof typeof BIKE_TEMPLATES] || [];
    case 'run':
      return RUN_TEMPLATES[phaseKey as keyof typeof RUN_TEMPLATES] || [];
    case 'strength':
      return STRENGTH_TEMPLATES[phaseKey as keyof typeof STRENGTH_TEMPLATES] || [];
    case 'brick':
      return BRICK_TEMPLATES[phaseKey as keyof typeof BRICK_TEMPLATES] || [];
    default:
      return [];
  }
}

export function selectRandomTemplate(templates: WorkoutTemplate[]): WorkoutTemplate | null {
  if (templates.length === 0) return null;
  return templates[Math.floor(Math.random() * templates.length)];
}
