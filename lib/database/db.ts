import Database from 'better-sqlite3';
import path from 'path';

// Create database connection
const dbPath = path.join(process.cwd(), 'ironmind.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      start_date TEXT NOT NULL,
      race_date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Athlete profiles
  db.exec(`
    CREATE TABLE IF NOT EXISTS athlete_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      experience TEXT DEFAULT 'intermediate',
      weekly_hours_base REAL DEFAULT 10.0,
      weekly_hours_peak REAL DEFAULT 16.0,
      availability TEXT,
      constraints TEXT,
      injuries TEXT,
      strengths TEXT,
      weaknesses TEXT,
      equipment TEXT,
      preferences TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id)
    )
  `);

  // Training protocols
  db.exec(`
    CREATE TABLE IF NOT EXISTS training_protocols (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      start_date TEXT NOT NULL,
      race_date TEXT NOT NULL,
      total_days INTEGER NOT NULL,
      weekly_load_curve TEXT,
      generated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      version TEXT DEFAULT '1.0',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Training phases
  db.exec(`
    CREATE TABLE IF NOT EXISTS phases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      protocol_id INTEGER NOT NULL,
      phase_key TEXT NOT NULL,
      name TEXT NOT NULL,
      start_day INTEGER NOT NULL,
      end_day INTEGER NOT NULL,
      duration_weeks INTEGER NOT NULL,
      goals TEXT,
      focus TEXT,
      load_multiplier REAL DEFAULT 1.0,
      color TEXT,
      FOREIGN KEY (protocol_id) REFERENCES training_protocols(id) ON DELETE CASCADE
    )
  `);

  // Daily protocols
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_protocols (
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

      nutrition TEXT,
      recovery TEXT,
      mindset TEXT,
      admin TEXT,
      guardrails TEXT,

      why_matters TEXT,
      coach_note TEXT,

      completed INTEGER DEFAULT 0,
      completed_at TEXT,
      adherence_score INTEGER,

      created_at TEXT DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (protocol_id) REFERENCES training_protocols(id) ON DELETE CASCADE,
      UNIQUE(user_id, date)
    )
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_daily_protocols_date
    ON daily_protocols(user_id, date)
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_daily_protocols_day_index
    ON daily_protocols(user_id, day_index)
  `);

  // Sessions
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      daily_protocol_id INTEGER NOT NULL,
      session_order INTEGER NOT NULL,
      type TEXT NOT NULL,

      planned_duration INTEGER,
      planned_distance REAL,
      planned_intensity TEXT,
      planned_zones TEXT,
      planned_description TEXT,
      planned_purpose TEXT,
      planned_alternatives TEXT,

      completed INTEGER DEFAULT 0,
      actual_duration INTEGER,
      actual_distance REAL,
      avg_heart_rate INTEGER,
      avg_power INTEGER,
      avg_pace TEXT,
      rpe INTEGER,
      notes TEXT,
      feeling TEXT,

      strava_id TEXT,
      completed_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (daily_protocol_id) REFERENCES daily_protocols(id) ON DELETE CASCADE
    )
  `);

  // Daily check-ins
  db.exec(`
    CREATE TABLE IF NOT EXISTS checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,

      sleep_duration REAL,
      sleep_quality INTEGER,

      mood INTEGER,

      soreness_overall INTEGER,
      soreness_locations TEXT,

      stress INTEGER,
      weight REAL,

      ready_to_train INTEGER,
      readiness_score INTEGER,

      notes TEXT,

      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, date)
    )
  `);

  // Progress snapshots
  db.exec(`
    CREATE TABLE IF NOT EXISTS progress_snapshots (
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

      insights TEXT,

      created_at TEXT DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, week_number)
    )
  `);

  // Streaks
  db.exec(`
    CREATE TABLE IF NOT EXISTS streaks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,

      current INTEGER DEFAULT 0,
      longest INTEGER DEFAULT 0,
      last_activity_date TEXT,

      can_recover INTEGER DEFAULT 0,
      recovery_deadline TEXT,

      milestones TEXT,

      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, type)
    )
  `);

  // Badges
  db.exec(`
    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      badge_key TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      requirement TEXT,

      earned INTEGER DEFAULT 0,
      earned_at TEXT,

      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, badge_key)
    )
  `);

  console.log('✅ Project IronMind database initialized successfully');
}

// Initialize on import
initDatabase();

export default db;
