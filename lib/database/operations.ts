import db from './db';

// ============================================
// USER OPERATIONS
// ============================================

export function getOrCreateUser(userId: number = 1) {
  let user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

  if (!user) {
    const today = new Date().toISOString().split('T')[0];
    const raceDate = '2026-11-07'; // Ironman Florida

    const insert = db.prepare(`
      INSERT INTO users (id, name, start_date, race_date)
      VALUES (?, ?, ?, ?)
    `);
    insert.run(userId, 'Jordan', today, raceDate);

    user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  }

  return user;
}

export function updateUser(userId: number, data: any) {
  return db.prepare(`
    UPDATE users
    SET name = ?, start_date = ?, race_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(data.name, data.startDate, data.raceDate, userId);
}

// ============================================
// ATHLETE PROFILE OPERATIONS
// ============================================

export function getAthleteProfile(userId: number) {
  return db.prepare('SELECT * FROM athlete_profiles WHERE user_id = ?').get(userId);
}

export function createOrUpdateAthleteProfile(userId: number, profile: any) {
  const existing = getAthleteProfile(userId);

  if (existing) {
    return db.prepare(`
      UPDATE athlete_profiles
      SET experience = ?,
          weekly_hours_base = ?,
          weekly_hours_peak = ?,
          availability = ?,
          constraints = ?,
          injuries = ?,
          strengths = ?,
          weaknesses = ?,
          equipment = ?,
          preferences = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(
      profile.experience,
      profile.weeklyHoursBase,
      profile.weeklyHoursPeak,
      JSON.stringify(profile.availability || {}),
      JSON.stringify(profile.constraints || {}),
      JSON.stringify(profile.injuries || []),
      JSON.stringify(profile.strengths || []),
      JSON.stringify(profile.weaknesses || []),
      JSON.stringify(profile.equipment || {}),
      JSON.stringify(profile.preferences || {}),
      userId
    );
  } else {
    return db.prepare(`
      INSERT INTO athlete_profiles (
        user_id, experience, weekly_hours_base, weekly_hours_peak,
        availability, constraints, injuries, strengths, weaknesses,
        equipment, preferences
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      profile.experience || 'intermediate',
      profile.weeklyHoursBase || 10.0,
      profile.weeklyHoursPeak || 16.0,
      JSON.stringify(profile.availability || {}),
      JSON.stringify(profile.constraints || {}),
      JSON.stringify(profile.injuries || []),
      JSON.stringify(profile.strengths || []),
      JSON.stringify(profile.weaknesses || []),
      JSON.stringify(profile.equipment || {}),
      JSON.stringify(profile.preferences || {})
    );
  }
}

// ============================================
// TRAINING PROTOCOL OPERATIONS
// ============================================

export function createTrainingProtocol(userId: number, protocol: any) {
  return db.prepare(`
    INSERT INTO training_protocols (
      user_id, start_date, race_date, total_days, weekly_load_curve, version
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    protocol.startDate,
    protocol.raceDate,
    protocol.totalDays,
    JSON.stringify(protocol.weeklyLoadCurve || []),
    protocol.version || '1.0'
  );
}

export function getTrainingProtocol(userId: number) {
  return db.prepare('SELECT * FROM training_protocols WHERE user_id = ? ORDER BY id DESC LIMIT 1').get(userId);
}

export function deleteTrainingProtocol(protocolId: number) {
  return db.prepare('DELETE FROM training_protocols WHERE id = ?').run(protocolId);
}

// ============================================
// PHASE OPERATIONS
// ============================================

export function createPhase(protocolId: number, phase: any) {
  return db.prepare(`
    INSERT INTO phases (
      protocol_id, phase_key, name, start_day, end_day,
      duration_weeks, goals, focus, load_multiplier, color
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    protocolId,
    phase.key,
    phase.name,
    phase.startDay,
    phase.endDay,
    phase.durationWeeks,
    JSON.stringify(phase.goals || []),
    phase.focus,
    phase.loadMultiplier || 1.0,
    phase.color
  );
}

export function getPhases(protocolId: number) {
  return db.prepare('SELECT * FROM phases WHERE protocol_id = ? ORDER BY start_day').all(protocolId);
}

// ============================================
// DAILY PROTOCOL OPERATIONS
// ============================================

export function createDailyProtocol(userId: number, protocol: any) {
  return db.prepare(`
    INSERT INTO daily_protocols (
      user_id, protocol_id, date, day_index, days_to_race, percent_complete,
      phase_key, phase_name, phase_color,
      week_number, week_day_number, is_recovery_week,
      daily_load_target, nutrition, recovery, mindset, admin, guardrails,
      why_matters, coach_note
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    protocol.protocolId,
    protocol.date,
    protocol.dayIndex,
    protocol.daysToRace,
    protocol.percentComplete,
    protocol.phase.key,
    protocol.phase.name,
    protocol.phase.color,
    protocol.weekNumber,
    protocol.weekDayNumber,
    protocol.isRecoveryWeek ? 1 : 0,
    protocol.dailyLoadTarget,
    JSON.stringify(protocol.nutrition || {}),
    JSON.stringify(protocol.recovery || {}),
    JSON.stringify(protocol.mindset || {}),
    JSON.stringify(protocol.admin || []),
    JSON.stringify(protocol.guardrails || {}),
    protocol.whyThisDayMatters,
    protocol.coachNote
  );
}

export function getDailyProtocol(userId: number, date: string) {
  const protocol: any = db.prepare('SELECT * FROM daily_protocols WHERE user_id = ? AND date = ?').get(userId, date);

  if (!protocol) return null;

  // Parse JSON fields
  protocol.nutrition = JSON.parse(protocol.nutrition || '{}');
  protocol.recovery = JSON.parse(protocol.recovery || '{}');
  protocol.mindset = JSON.parse(protocol.mindset || '{}');
  protocol.admin = JSON.parse(protocol.admin || '[]');
  protocol.guardrails = JSON.parse(protocol.guardrails || '{}');

  // Get sessions for this protocol
  protocol.sessions = getSessions(protocol.id);

  return protocol;
}

export function getDailyProtocolByIndex(userId: number, dayIndex: number) {
  const protocol: any = db.prepare('SELECT * FROM daily_protocols WHERE user_id = ? AND day_index = ?').get(userId, dayIndex);

  if (!protocol) return null;

  protocol.nutrition = JSON.parse(protocol.nutrition || '{}');
  protocol.recovery = JSON.parse(protocol.recovery || '{}');
  protocol.mindset = JSON.parse(protocol.mindset || '{}');
  protocol.admin = JSON.parse(protocol.admin || '[]');
  protocol.guardrails = JSON.parse(protocol.guardrails || '{}');
  protocol.sessions = getSessions(protocol.id);

  return protocol;
}

export function completeDailyProtocol(userId: number, date: string, adherenceScore: number) {
  return db.prepare(`
    UPDATE daily_protocols
    SET completed = 1, completed_at = CURRENT_TIMESTAMP, adherence_score = ?
    WHERE user_id = ? AND date = ?
  `).run(adherenceScore, userId, date);
}

// ============================================
// SESSION OPERATIONS
// ============================================

export function createSession(dailyProtocolId: number, session: any) {
  return db.prepare(`
    INSERT INTO sessions (
      daily_protocol_id, session_order, type,
      planned_duration, planned_distance, planned_intensity,
      planned_zones, planned_description, planned_purpose, planned_alternatives
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    dailyProtocolId,
    session.order,
    session.type,
    session.planned.duration,
    session.planned.distance || null,
    session.planned.intensity,
    JSON.stringify(session.planned.zones || []),
    session.planned.description,
    session.planned.purpose,
    session.planned.alternatives || null
  );
}

export function getSessions(dailyProtocolId: number) {
  const sessions: any[] = db.prepare('SELECT * FROM sessions WHERE daily_protocol_id = ? ORDER BY session_order').all(dailyProtocolId);

  // Parse JSON fields
  return sessions.map(session => ({
    ...session,
    planned_zones: JSON.parse(session.planned_zones || '[]')
  }));
}

export function completeSession(sessionId: number, actual: any) {
  return db.prepare(`
    UPDATE sessions
    SET completed = 1,
        actual_duration = ?,
        actual_distance = ?,
        avg_heart_rate = ?,
        avg_power = ?,
        avg_pace = ?,
        rpe = ?,
        notes = ?,
        feeling = ?,
        completed_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    actual.duration,
    actual.distance || null,
    actual.avgHeartRate || null,
    actual.avgPower || null,
    actual.avgPace || null,
    actual.rpe,
    actual.notes || null,
    actual.feeling,
    sessionId
  );
}

// ============================================
// CHECK-IN OPERATIONS
// ============================================

export function createOrUpdateCheckin(userId: number, date: string, checkin: any) {
  const existing = db.prepare('SELECT * FROM checkins WHERE user_id = ? AND date = ?').get(userId, date);

  if (existing) {
    return db.prepare(`
      UPDATE checkins
      SET sleep_duration = ?,
          sleep_quality = ?,
          mood = ?,
          soreness_overall = ?,
          soreness_locations = ?,
          stress = ?,
          weight = ?,
          ready_to_train = ?,
          readiness_score = ?,
          notes = ?,
          timestamp = CURRENT_TIMESTAMP
      WHERE user_id = ? AND date = ?
    `).run(
      checkin.sleep.duration,
      checkin.sleep.quality,
      checkin.mood,
      checkin.soreness.overall,
      JSON.stringify(checkin.soreness.locations || []),
      checkin.stress,
      checkin.weight || null,
      checkin.readyToTrain ? 1 : 0,
      checkin.readinessScore,
      checkin.notes || null,
      userId,
      date
    );
  } else {
    return db.prepare(`
      INSERT INTO checkins (
        user_id, date, sleep_duration, sleep_quality, mood,
        soreness_overall, soreness_locations, stress, weight,
        ready_to_train, readiness_score, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      date,
      checkin.sleep.duration,
      checkin.sleep.quality,
      checkin.mood,
      checkin.soreness.overall,
      JSON.stringify(checkin.soreness.locations || []),
      checkin.stress,
      checkin.weight || null,
      checkin.readyToTrain ? 1 : 0,
      checkin.readinessScore,
      checkin.notes || null
    );
  }
}

export function getCheckin(userId: number, date: string) {
  const checkin: any = db.prepare('SELECT * FROM checkins WHERE user_id = ? AND date = ?').get(userId, date);

  if (!checkin) return null;

  checkin.soreness_locations = JSON.parse(checkin.soreness_locations || '[]');
  return checkin;
}

export function getRecentCheckins(userId: number, limit: number = 7) {
  const checkins: any[] = db.prepare('SELECT * FROM checkins WHERE user_id = ? ORDER BY date DESC LIMIT ?').all(userId, limit);

  return checkins.map(c => ({
    ...c,
    soreness_locations: JSON.parse(c.soreness_locations || '[]')
  }));
}

// ============================================
// STREAK OPERATIONS
// ============================================

export function getOrCreateStreak(userId: number, type: string) {
  let streak = db.prepare('SELECT * FROM streaks WHERE user_id = ? AND type = ?').get(userId, type);

  if (!streak) {
    db.prepare(`
      INSERT INTO streaks (user_id, type, current, longest)
      VALUES (?, ?, 0, 0)
    `).run(userId, type);

    streak = db.prepare('SELECT * FROM streaks WHERE user_id = ? AND type = ?').get(userId, type);
  }

  return streak;
}

export function updateStreak(userId: number, type: string, current: number, longest: number) {
  return db.prepare(`
    UPDATE streaks
    SET current = ?, longest = ?, last_activity_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ? AND type = ?
  `).run(current, longest, new Date().toISOString().split('T')[0], userId, type);
}

export function getAllStreaks(userId: number) {
  return db.prepare('SELECT * FROM streaks WHERE user_id = ?').all(userId);
}

// ============================================
// BADGE OPERATIONS
// ============================================

export function createBadge(userId: number, badge: any) {
  return db.prepare(`
    INSERT INTO badges (
      user_id, badge_key, name, description, icon, requirement, earned
    ) VALUES (?, ?, ?, ?, ?, ?, 0)
  `).run(
    userId,
    badge.key,
    badge.name,
    badge.description,
    badge.icon,
    badge.requirement
  );
}

export function earnBadge(userId: number, badgeKey: string) {
  return db.prepare(`
    UPDATE badges
    SET earned = 1, earned_at = CURRENT_TIMESTAMP
    WHERE user_id = ? AND badge_key = ?
  `).run(userId, badgeKey);
}

export function getUserBadges(userId: number, earnedOnly: boolean = false) {
  if (earnedOnly) {
    return db.prepare('SELECT * FROM badges WHERE user_id = ? AND earned = 1 ORDER BY earned_at DESC').all(userId);
  }
  return db.prepare('SELECT * FROM badges WHERE user_id = ?').all(userId);
}

// ============================================
// PROGRESS OPERATIONS
// ============================================

export function createProgressSnapshot(userId: number, snapshot: any) {
  return db.prepare(`
    INSERT INTO progress_snapshots (
      user_id, week_number, start_date, end_date,
      load_target, load_actual, load_percent,
      swim_yards, bike_miles, run_miles, strength_sessions,
      sessions_planned, sessions_completed, adherence_rate,
      streak_current, streak_longest, insights
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    snapshot.weekNumber,
    snapshot.startDate,
    snapshot.endDate,
    snapshot.load.target,
    snapshot.load.actual,
    snapshot.load.percentOfTarget,
    snapshot.volume.swim,
    snapshot.volume.bike,
    snapshot.volume.run,
    snapshot.volume.strength,
    snapshot.adherence.sessionsPlanned,
    snapshot.adherence.sessionsCompleted,
    snapshot.adherence.adherenceRate,
    snapshot.streak.current,
    snapshot.streak.longest,
    JSON.stringify(snapshot.insights || [])
  );
}

export function getProgressSnapshots(userId: number, limit: number = 12) {
  const snapshots: any[] = db.prepare('SELECT * FROM progress_snapshots WHERE user_id = ? ORDER BY week_number DESC LIMIT ?').all(userId, limit);

  return snapshots.map(s => ({
    ...s,
    insights: JSON.parse(s.insights || '[]')
  }));
}
