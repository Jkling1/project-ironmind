// Check database contents
// Run with: node scripts/check-database.js

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'ironmind.db');
const db = new Database(dbPath, { readonly: true });

console.log('═══════════════════════════════════════════════');
console.log('📊 Project IronMind Database Status');
console.log('═══════════════════════════════════════════════\n');

// Check users
const users = db.prepare('SELECT * FROM users').all();
console.log(`👥 Users: ${users.length}`);
users.forEach(user => {
  console.log(`   - ${user.name} (ID: ${user.id})`);
  console.log(`     Start: ${user.start_date}, Race: ${user.race_date}`);
});

// Check athlete profiles
const profiles = db.prepare('SELECT * FROM athlete_profiles').all();
console.log(`\n🏃 Athlete Profiles: ${profiles.length}`);

// Check training protocols
const protocols = db.prepare('SELECT * FROM training_protocols').all();
console.log(`\n📋 Training Protocols: ${protocols.length}`);
if (protocols.length > 0) {
  protocols.forEach(p => {
    console.log(`   - Protocol #${p.id}: ${p.total_days} days`);
    console.log(`     ${p.start_date} → ${p.race_date}`);
  });
}

// Check daily protocols
const dailyProtocols = db.prepare('SELECT COUNT(*) as count FROM daily_protocols').get();
console.log(`\n📅 Daily Protocols: ${dailyProtocols.count}`);

// Check sessions
const sessions = db.prepare('SELECT COUNT(*) as count FROM sessions').get();
console.log(`\n🏋️ Sessions: ${sessions.count}`);

// Check completed sessions
const completedSessions = db.prepare('SELECT COUNT(*) as count FROM sessions WHERE completed = 1').get();
console.log(`   - Completed: ${completedSessions.count}`);

// Check check-ins
const checkins = db.prepare('SELECT COUNT(*) as count FROM checkins').get();
console.log(`\n✅ Check-ins: ${checkins.count}`);

// Check streaks
const streaks = db.prepare('SELECT * FROM streaks').all();
console.log(`\n🔥 Streaks: ${streaks.length}`);
streaks.forEach(s => {
  console.log(`   - ${s.type}: ${s.current_streak} days (longest: ${s.longest_streak})`);
});

// Check progress snapshots
const snapshots = db.prepare('SELECT COUNT(*) as count FROM progress_snapshots').get();
console.log(`\n📈 Progress Snapshots: ${snapshots.count}`);

console.log('\n═══════════════════════════════════════════════');

if (protocols.length === 0) {
  console.log('\n⚠️  No training protocol found!');
  console.log('\nTo generate your 326-day protocol:');
  console.log('  1. Start dev server: npm run dev');
  console.log('  2. Visit: http://localhost:3000/generate');
  console.log('  3. Or use API:');
  console.log('     curl -X POST http://localhost:3000/api/protocol/generate \\');
  console.log('       -H "Content-Type: application/json" \\');
  console.log('       -d \'{"userId": 1, "startDate": "2025-12-17", "raceDate": "2026-11-07"}\'');
  console.log('');
} else {
  console.log('\n✅ Database is ready to use!');
  console.log('\nNext steps:');
  console.log('  1. Start dev server: npm run dev');
  console.log('  2. Visit: http://localhost:3000/today');
  console.log('  3. Complete your daily check-in');
  console.log('  4. Log your training sessions\n');
}

db.close();
