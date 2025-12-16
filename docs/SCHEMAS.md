# Project IronMind: Data Schemas

## Core Entities

### 1. TrainingProtocol

The master plan for 326 days.

```typescript
interface TrainingProtocol {
  id: string;
  userId: number;
  startDate: string; // "2025-12-16"
  raceDate: string;  // "2026-11-07"
  totalDays: number; // 326
  phases: Phase[];
  weeklyLoadCurve: number[]; // 47 weeks of load targets
  generated: string; // ISO timestamp
  version: string; // "1.0"
}
```

### 2. Phase

Training phases (Transition, Foundation, Base 1/2, Build 1/2, Peak, Taper, Race).

```typescript
interface Phase {
  key: string; // "FOUNDATION"
  name: string; // "Foundation Phase"
  startDay: number; // day index (1-326)
  endDay: number;
  durationWeeks: number;
  goals: string[];
  focus: string; // "Build aerobic base"
  loadMultiplier: number; // 0.7 = 70% of peak
  color: string; // hex color for UI
}
```

### 3. DailyProtocol

The heart of the system - what to do today.

```typescript
interface DailyProtocol {
  id: string;
  userId: number;
  date: string; // "2025-12-16"
  dayIndex: number; // 1-326
  daysToRace: number; // 326 → 1
  percentComplete: number; // 0.3% → 100%

  phase: {
    key: string;
    name: string;
    color: string;
  };

  weekNumber: number; // 1-47
  weekDayNumber: number; // 1-7 (Mon=1)
  isRecoveryWeek: boolean;

  sessions: Session[];

  dailyLoadTarget: number; // TSS-like score

  nutrition: {
    preWorkout: string;
    duringWorkout: string;
    postWorkout: string;
    dailyProtein: string;
    hydration: string;
  };

  recovery: {
    sleepTarget: string; // "8 hours"
    stretching: string;
    foam rolling: boolean;
    ice bath: boolean;
  };

  mindset: {
    prompt: string; // "Why does today matter?"
    affirmation: string;
  };

  admin: string[]; // ["Check tire pressure", "Prep race bag"]

  guardrails: {
    sleepMin: number; // hours
    maxIntensitySessions: number;
    requiresRestIfSoreAbove: number; // 1-10 scale
  };

  whyThisDayMatters: string; // AI-generated explanation

  completed: boolean;
  completedAt?: string;
  adherenceScore?: number; // 0-100
}
```

### 4. Session

Individual swim/bike/run/strength workout.

```typescript
interface Session {
  id: string;
  dailyProtocolId: string;
  type: "swim" | "bike" | "run" | "strength" | "brick";
  order: number; // 1, 2, 3 for multi-session days

  planned: {
    duration: number; // minutes
    distance?: number; // miles or yards
    intensity: "easy" | "moderate" | "tempo" | "threshold" | "interval" | "recovery";
    zones: string[]; // ["Z2: 60min", "Z4: 5x5min"]
    description: string; // "Long steady ride with 3x10min tempo"
    purpose: string; // "Build aerobic endurance"
    alternatives: string; // "If tired: cut to 90min easy"
  };

  actual?: {
    completed: boolean;
    duration: number;
    distance?: number;
    avgHeartRate?: number;
    avgPower?: number;
    avgPace?: string; // "8:30 min/mi"
    rpe: number; // 1-10
    notes: string;
    feeling: "great" | "good" | "okay" | "tough" | "terrible";
  };

  stravaId?: string; // if imported
  completedAt?: string;
}
```

### 5. CheckIn

Daily quick check-in (10 seconds).

```typescript
interface CheckIn {
  id: string;
  userId: number;
  date: string;
  timestamp: string;

  sleep: {
    duration: number; // hours
    quality: number; // 1-10
  };

  mood: number; // 1-10 (1=terrible, 10=amazing)

  soreness: {
    overall: number; // 1-10
    locations: string[]; // ["calves", "quads", "lower back"]
  };

  stress: number; // 1-10

  weight?: number; // lbs

  readyToTrain: boolean; // derived from above
  readinessScore: number; // 0-100

  notes?: string;
}
```

### 6. ProgressSnapshot

Weekly rollup for the graph.

```typescript
interface ProgressSnapshot {
  id: string;
  userId: number;
  weekNumber: number;
  startDate: string;
  endDate: string;

  load: {
    target: number;
    actual: number;
    percentOfTarget: number;
  };

  volume: {
    swim: number; // yards
    bike: number; // miles
    run: number; // miles
    strength: number; // sessions
  };

  adherence: {
    sessionsPlanned: number;
    sessionsCompleted: number;
    adherenceRate: number; // 0-100
  };

  streak: {
    current: number;
    longest: number;
  };

  insights: string[]; // AI-generated
}
```

### 7. Streak

Gamification system.

```typescript
interface Streak {
  id: string;
  userId: number;
  type: "training" | "checkin" | "alcohol-free" | "home-cooked";

  current: number; // days
  longest: number;
  lastActivityDate: string;

  canRecover: boolean; // within 3-day window?
  recoveryDeadline?: string;

  milestones: {
    days: number;
    achievedAt: string;
    badgeEarned: string;
  }[];
}
```

### 8. Badge

Achievement system.

```typescript
interface Badge {
  id: string;
  key: string; // "FIRST_CENTURY"
  name: string; // "Century Rider"
  description: string;
  icon: string; // emoji or icon name
  requirement: string; // "Complete 100-mile bike ride"
  earned: boolean;
  earnedAt?: string;
}
```

### 9. AthleteProfile

Extended user profile for protocol generation.

```typescript
interface AthleteProfile {
  userId: number;

  experience: "beginner" | "intermediate" | "advanced";

  weeklyHoursBase: number; // 8-12 for you
  weeklyHoursPeak: number; // 15-18

  availability: {
    longRideDay: "saturday" | "sunday";
    strengthDays: string[]; // ["tuesday", "thursday"]
    swimDays: string[]; // ["monday", "wednesday", "friday"]
  };

  constraints: {
    indoor: boolean; // have trainer?
    pool: boolean; // have pool access?
    gym: boolean; // have gym access?
  };

  injuries: string[];
  strengths: string[];
  weaknesses: string[];

  equipment: {
    bike: string;
    wetsuit: boolean;
    powerMeter: boolean;
    hrMonitor: boolean;
  };

  preferences: {
    morningPerson: boolean;
    preferredIntensity: "conservative" | "moderate" | "aggressive";
  };
}
```

---

## Database Schema (SQL)

### New Tables for MVP

```sql
-- Training protocol master record
CREATE TABLE training_protocols (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  race_date TEXT NOT NULL,
  total_days INTEGER NOT NULL,
  weekly_load_curve TEXT, -- JSON array
  generated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  version TEXT DEFAULT '1.0',
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Training phases
CREATE TABLE phases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  protocol_id INTEGER NOT NULL,
  phase_key TEXT NOT NULL,
  name TEXT NOT NULL,
  start_day INTEGER NOT NULL,
  end_day INTEGER NOT NULL,
  duration_weeks INTEGER NOT NULL,
  goals TEXT, -- JSON array
  focus TEXT,
  load_multiplier REAL DEFAULT 1.0,
  color TEXT,
  FOREIGN KEY (protocol_id) REFERENCES training_protocols(id)
);

-- Daily protocols (the core!)
CREATE TABLE daily_protocols (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  protocol_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  day_index INTEGER NOT NULL,
  days_to_race INTEGER NOT NULL,
  percent_complete REAL NOT NULL,

  phase_key TEXT NOT NULL,
  phase_name TEXT NOT NULL,
  phase_color TEXT,

  week_number INTEGER NOT NULL,
  week_day_number INTEGER NOT NULL,
  is_recovery_week INTEGER DEFAULT 0,

  daily_load_target REAL,

  nutrition TEXT, -- JSON
  recovery TEXT, -- JSON
  mindset TEXT, -- JSON
  admin TEXT, -- JSON array
  guardrails TEXT, -- JSON

  why_matters TEXT,

  completed INTEGER DEFAULT 0,
  completed_at TEXT,
  adherence_score INTEGER,

  created_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (protocol_id) REFERENCES training_protocols(id),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_protocols_date ON daily_protocols(user_id, date);
CREATE INDEX idx_daily_protocols_day_index ON daily_protocols(user_id, day_index);

-- Sessions (swim/bike/run/strength)
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  daily_protocol_id INTEGER NOT NULL,
  session_order INTEGER NOT NULL,
  type TEXT NOT NULL, -- swim|bike|run|strength|brick

  -- Planned
  planned_duration INTEGER, -- minutes
  planned_distance REAL,
  planned_intensity TEXT,
  planned_zones TEXT, -- JSON array
  planned_description TEXT,
  planned_purpose TEXT,
  planned_alternatives TEXT,

  -- Actual
  completed INTEGER DEFAULT 0,
  actual_duration INTEGER,
  actual_distance REAL,
  avg_heart_rate INTEGER,
  avg_power INTEGER,
  avg_pace TEXT,
  rpe INTEGER, -- 1-10
  notes TEXT,
  feeling TEXT,

  strava_id TEXT,
  completed_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (daily_protocol_id) REFERENCES daily_protocols(id)
);

-- Daily check-ins
CREATE TABLE checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP,

  sleep_duration REAL,
  sleep_quality INTEGER, -- 1-10

  mood INTEGER, -- 1-10

  soreness_overall INTEGER, -- 1-10
  soreness_locations TEXT, -- JSON array

  stress INTEGER, -- 1-10

  weight REAL,

  ready_to_train INTEGER, -- boolean
  readiness_score INTEGER, -- 0-100

  notes TEXT,

  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, date)
);

-- Progress snapshots (weekly rollups)
CREATE TABLE progress_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  week_number INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,

  load_target REAL,
  load_actual REAL,
  load_percent REAL,

  swim_yards REAL DEFAULT 0,
  bike_miles REAL DEFAULT 0,
  run_miles REAL DEFAULT 0,
  strength_sessions INTEGER DEFAULT 0,

  sessions_planned INTEGER,
  sessions_completed INTEGER,
  adherence_rate REAL,

  streak_current INTEGER,
  streak_longest INTEGER,

  insights TEXT, -- JSON array

  created_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, week_number)
);

-- Streaks (gamification)
CREATE TABLE streaks_v2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL, -- training|checkin|alcohol-free|home-cooked

  current INTEGER DEFAULT 0,
  longest INTEGER DEFAULT 0,
  last_activity_date TEXT,

  can_recover INTEGER DEFAULT 0,
  recovery_deadline TEXT,

  milestones TEXT, -- JSON array

  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, type)
);

-- Badges
CREATE TABLE badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  badge_key TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  requirement TEXT,

  earned INTEGER DEFAULT 0,
  earned_at TEXT,

  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, badge_key)
);

-- Athlete profile
CREATE TABLE athlete_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,

  experience TEXT DEFAULT 'intermediate',
  weekly_hours_base REAL DEFAULT 10.0,
  weekly_hours_peak REAL DEFAULT 16.0,

  availability TEXT, -- JSON
  constraints TEXT, -- JSON
  injuries TEXT, -- JSON array
  strengths TEXT, -- JSON array
  weaknesses TEXT, -- JSON array
  equipment TEXT, -- JSON
  preferences TEXT, -- JSON

  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id)
);
```
