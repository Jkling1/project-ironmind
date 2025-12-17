// Simple database setup script
// Run with: node scripts/setup-database.js

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'ironmind.db');

// Remove existing database if it exists
if (fs.existsSync(dbPath)) {
  console.log('🗑️  Removing existing database...');
  fs.unlinkSync(dbPath);
}

console.log('🏗️  Creating new database...');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('📋 Creating tables...\n');

// 1. Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    start_date TEXT NOT NULL,
    race_date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log('  ✅ users');

// 2. Athlete profiles table
db.exec(`
  CREATE TABLE IF NOT EXISTS athlete_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    experience TEXT,
    weekly_hours_base REAL,
    weekly_hours_peak REAL,
    availability TEXT,
    constraints TEXT,
    injuries TEXT,
    strengths TEXT,
    weaknesses TEXT,
    equipment TEXT,
    preferences TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id)
  )
`);
console.log('  ✅ athlete_profiles');

// 3. Training protocols table
db.exec(`
  CREATE TABLE IF NOT EXISTS training_protocols (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    race_date TEXT NOT NULL,
    total_days INTEGER NOT NULL,
    weekly_load_curve TEXT,
    version TEXT DEFAULT '1.0',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);
console.log('  ✅ training_protocols');

// 4. Phases table
db.exec(`
  CREATE TABLE IF NOT EXISTS phases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    protocol_id INTEGER NOT NULL,
    phase_key TEXT NOT NULL,
    phase_name TEXT NOT NULL,
    start_day INTEGER NOT NULL,
    end_day INTEGER NOT NULL,
    duration_weeks INTEGER NOT NULL,
    goals TEXT,
    focus TEXT,
    load_multiplier REAL,
    color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (protocol_id) REFERENCES training_protocols(id)
  )
`);
console.log('  ✅ phases');

// 5. Daily protocols table
db.exec(`
  CREATE TABLE IF NOT EXISTS daily_protocols (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    protocol_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    day_index INTEGER NOT NULL,
    days_to_race INTEGER NOT NULL,
    percent_complete REAL,
    phase_key TEXT NOT NULL,
    phase_name TEXT NOT NULL,
    phase_color TEXT,
    week_number INTEGER,
    week_day_number INTEGER,
    is_recovery_week BOOLEAN DEFAULT 0,
    daily_load_target INTEGER,
    nutrition TEXT,
    recovery TEXT,
    mindset TEXT,
    admin TEXT,
    guardrails TEXT,
    why_this_day_matters TEXT,
    coach_note TEXT,
    completed BOOLEAN DEFAULT 0,
    adherence_score INTEGER,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (protocol_id) REFERENCES training_protocols(id),
    UNIQUE(user_id, date)
  )
`);
console.log('  ✅ daily_protocols');

// 6. Sessions table
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
    completed BOOLEAN DEFAULT 0,
    actual_duration INTEGER,
    actual_distance REAL,
    avg_heart_rate INTEGER,
    avg_power INTEGER,
    avg_pace TEXT,
    rpe INTEGER,
    feeling TEXT,
    notes TEXT,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (daily_protocol_id) REFERENCES daily_protocols(id)
  )
`);
console.log('  ✅ sessions');

// 7. Check-ins table
db.exec(`
  CREATE TABLE IF NOT EXISTS checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    sleep_duration REAL,
    sleep_quality INTEGER,
    mood INTEGER,
    soreness_overall INTEGER,
    soreness_legs INTEGER,
    soreness_core INTEGER,
    soreness_arms INTEGER,
    stress INTEGER,
    weight REAL,
    readiness_score INTEGER,
    ready_to_train BOOLEAN,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date)
  )
`);
console.log('  ✅ checkins');

// 8. Progress snapshots table
db.exec(`
  CREATE TABLE IF NOT EXISTS progress_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    week_number INTEGER NOT NULL,
    load_target INTEGER,
    load_actual INTEGER,
    adherence_rate INTEGER,
    sessions_planned INTEGER,
    sessions_completed INTEGER,
    total_duration INTEGER,
    total_distance REAL,
    avg_heart_rate INTEGER,
    avg_rpe INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, week_number)
  )
`);
console.log('  ✅ progress_snapshots');

// 9. Streaks table
db.exec(`
  CREATE TABLE IF NOT EXISTS streaks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, type)
  )
`);
console.log('  ✅ streaks');

// 10. Badges table
db.exec(`
  CREATE TABLE IF NOT EXISTS badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    badge_key TEXT NOT NULL,
    badge_name TEXT NOT NULL,
    description TEXT,
    earned BOOLEAN DEFAULT 0,
    earned_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, badge_key)
  )
`);
console.log('  ✅ badges');

// Create indexes
console.log('\n📇 Creating indexes...\n');

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_daily_protocols_date ON daily_protocols(user_id, date);
  CREATE INDEX IF NOT EXISTS idx_daily_protocols_day_index ON daily_protocols(user_id, day_index);
  CREATE INDEX IF NOT EXISTS idx_sessions_daily_protocol ON sessions(daily_protocol_id);
  CREATE INDEX IF NOT EXISTS idx_checkins_date ON checkins(user_id, date);
`);
console.log('  ✅ All indexes created');

// Insert default user
console.log('\n👤 Creating default user...\n');

const today = new Date().toISOString().split('T')[0];
const raceDate = '2026-11-07'; // Ironman Florida

db.prepare(`
  INSERT INTO users (id, name, start_date, race_date)
  VALUES (?, ?, ?, ?)
`).run(1, 'Jordan', today, raceDate);

console.log('  ✅ User created: Jordan (ID: 1)');
console.log(`  📅 Start: ${today}`);
console.log(`  🏁 Race: ${raceDate}`);

db.close();

console.log('\n═══════════════════════════════════════════════');
console.log('✅ Database setup complete!');
console.log('═══════════════════════════════════════════════');
console.log('\nDatabase location: ironmind.db');
console.log('\nNext steps:');
console.log('  1. Start dev server: npm run dev');
console.log('  2. Visit: http://localhost:3000');
console.log('  3. Generate protocol via UI or API\n');
