// Badge definitions and earning logic for Project IronMind

export interface Badge {
  key: string;
  name: string;
  description: string;
  icon: string;
  category: 'streaks' | 'volume' | 'milestones' | 'consistency' | 'special';
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirement: {
    type: 'streak' | 'sessions' | 'distance' | 'duration' | 'checkins' | 'special';
    threshold: number;
    discipline?: 'swim' | 'bike' | 'run' | 'all';
  };
}

export const BADGES: Badge[] = [
  // STREAK BADGES
  {
    key: 'STREAK_7',
    name: 'Week Warrior',
    description: 'Train 7 days in a row',
    icon: '🔥',
    category: 'streaks',
    tier: 'bronze',
    requirement: { type: 'streak', threshold: 7 }
  },
  {
    key: 'STREAK_14',
    name: 'Fortnight Force',
    description: 'Train 14 days in a row',
    icon: '⚡',
    category: 'streaks',
    tier: 'silver',
    requirement: { type: 'streak', threshold: 14 }
  },
  {
    key: 'STREAK_30',
    name: 'Month Master',
    description: 'Train 30 days in a row',
    icon: '💪',
    category: 'streaks',
    tier: 'gold',
    requirement: { type: 'streak', threshold: 30 }
  },
  {
    key: 'STREAK_100',
    name: 'Century Crusher',
    description: 'Train 100 days in a row',
    icon: '👑',
    category: 'streaks',
    tier: 'platinum',
    requirement: { type: 'streak', threshold: 100 }
  },

  // CHECKIN STREAKS
  {
    key: 'CHECKIN_7',
    name: 'Check-In Champion',
    description: 'Complete 7 check-ins in a row',
    icon: '✅',
    category: 'consistency',
    tier: 'bronze',
    requirement: { type: 'checkins', threshold: 7 }
  },
  {
    key: 'CHECKIN_30',
    name: 'Data Devotee',
    description: 'Complete 30 check-ins in a row',
    icon: '📊',
    category: 'consistency',
    tier: 'gold',
    requirement: { type: 'checkins', threshold: 30 }
  },

  // VOLUME BADGES - Sessions
  {
    key: 'SESSIONS_10',
    name: 'Getting Started',
    description: 'Complete 10 training sessions',
    icon: '🎯',
    category: 'volume',
    tier: 'bronze',
    requirement: { type: 'sessions', threshold: 10, discipline: 'all' }
  },
  {
    key: 'SESSIONS_50',
    name: 'Committed Athlete',
    description: 'Complete 50 training sessions',
    icon: '🏃',
    category: 'volume',
    tier: 'silver',
    requirement: { type: 'sessions', threshold: 50, discipline: 'all' }
  },
  {
    key: 'SESSIONS_100',
    name: 'Triple Digit',
    description: 'Complete 100 training sessions',
    icon: '💯',
    category: 'volume',
    tier: 'gold',
    requirement: { type: 'sessions', threshold: 100, discipline: 'all' }
  },
  {
    key: 'SESSIONS_250',
    name: 'Training Machine',
    description: 'Complete 250 training sessions',
    icon: '🤖',
    category: 'volume',
    tier: 'platinum',
    requirement: { type: 'sessions', threshold: 250, discipline: 'all' }
  },

  // SWIM BADGES
  {
    key: 'SWIM_50K',
    name: 'Swim 50K',
    description: 'Swim 50 kilometers total',
    icon: '🏊‍♂️',
    category: 'volume',
    tier: 'bronze',
    requirement: { type: 'distance', threshold: 50000, discipline: 'swim' }
  },
  {
    key: 'SWIM_100K',
    name: 'Century Swimmer',
    description: 'Swim 100 kilometers total',
    icon: '🏊‍♂️',
    category: 'volume',
    tier: 'gold',
    requirement: { type: 'distance', threshold: 100000, discipline: 'swim' }
  },

  // BIKE BADGES
  {
    key: 'BIKE_500MI',
    name: 'Bike 500 Miles',
    description: 'Ride 500 miles total',
    icon: '🚴‍♂️',
    category: 'volume',
    tier: 'bronze',
    requirement: { type: 'distance', threshold: 500, discipline: 'bike' }
  },
  {
    key: 'BIKE_1000MI',
    name: 'Bike 1000 Miles',
    description: 'Ride 1,000 miles total',
    icon: '🚴‍♂️',
    category: 'volume',
    tier: 'silver',
    requirement: { type: 'distance', threshold: 1000, discipline: 'bike' }
  },
  {
    key: 'BIKE_2500MI',
    name: 'Bike 2500 Miles',
    description: 'Ride 2,500 miles total',
    icon: '🚴‍♂️',
    category: 'volume',
    tier: 'gold',
    requirement: { type: 'distance', threshold: 2500, discipline: 'bike' }
  },

  // RUN BADGES
  {
    key: 'RUN_100MI',
    name: 'Run 100 Miles',
    description: 'Run 100 miles total',
    icon: '🏃‍♂️',
    category: 'volume',
    tier: 'bronze',
    requirement: { type: 'distance', threshold: 100, discipline: 'run' }
  },
  {
    key: 'RUN_250MI',
    name: 'Run 250 Miles',
    description: 'Run 250 miles total',
    icon: '🏃‍♂️',
    category: 'volume',
    tier: 'silver',
    requirement: { type: 'distance', threshold: 250, discipline: 'run' }
  },
  {
    key: 'RUN_500MI',
    name: 'Run 500 Miles',
    description: 'Run 500 miles total',
    icon: '🏃‍♂️',
    category: 'volume',
    tier: 'gold',
    requirement: { type: 'distance', threshold: 500, discipline: 'run' }
  },
  {
    key: 'RUN_MARATHON',
    name: 'Marathon Distance',
    description: 'Run 26.2 miles in a single session',
    icon: '🎖️',
    category: 'milestones',
    tier: 'gold',
    requirement: { type: 'distance', threshold: 26.2, discipline: 'run' }
  },

  // MILESTONE BADGES
  {
    key: 'FIRST_SESSION',
    name: 'First Step',
    description: 'Complete your first training session',
    icon: '🌟',
    category: 'milestones',
    tier: 'bronze',
    requirement: { type: 'sessions', threshold: 1, discipline: 'all' }
  },
  {
    key: 'FIRST_SWIM',
    name: 'Water Initiation',
    description: 'Complete your first swim',
    icon: '💦',
    category: 'milestones',
    tier: 'bronze',
    requirement: { type: 'sessions', threshold: 1, discipline: 'swim' }
  },
  {
    key: 'FIRST_BIKE',
    name: 'Wheels Down',
    description: 'Complete your first bike ride',
    icon: '🚲',
    category: 'milestones',
    tier: 'bronze',
    requirement: { type: 'sessions', threshold: 1, discipline: 'bike' }
  },
  {
    key: 'FIRST_RUN',
    name: 'First Mile',
    description: 'Complete your first run',
    icon: '👟',
    category: 'milestones',
    tier: 'bronze',
    requirement: { type: 'sessions', threshold: 1, discipline: 'run' }
  },
  {
    key: 'FULL_WEEK',
    name: 'Complete Week',
    description: 'Complete all sessions in a week',
    icon: '📅',
    category: 'consistency',
    tier: 'silver',
    requirement: { type: 'special', threshold: 1 }
  },

  // SPECIAL BADGES
  {
    key: 'EARLY_BIRD',
    name: 'Early Bird',
    description: 'Complete 10 sessions before 7am',
    icon: '🌅',
    category: 'special',
    requirement: { type: 'special', threshold: 10 }
  },
  {
    key: 'NIGHT_OWL',
    name: 'Night Owl',
    description: 'Complete 10 sessions after 8pm',
    icon: '🦉',
    category: 'special',
    requirement: { type: 'special', threshold: 10 }
  },
  {
    key: 'PERFECT_WEEK',
    name: 'Perfect Week',
    description: '100% adherence for a full week',
    icon: '⭐',
    category: 'consistency',
    tier: 'gold',
    requirement: { type: 'special', threshold: 1 }
  }
];

// Check if a badge should be earned based on user stats
export function checkBadgeEarned(badge: Badge, stats: any): boolean {
  const { requirement } = badge;

  switch (requirement.type) {
    case 'streak':
      return stats.currentStreak >= requirement.threshold;

    case 'checkins':
      return stats.checkinStreak >= requirement.threshold;

    case 'sessions':
      if (requirement.discipline === 'all') {
        return stats.totalSessions >= requirement.threshold;
      } else {
        const disciplineCount = stats.sessionsByType?.[requirement.discipline] || 0;
        return disciplineCount >= requirement.threshold;
      }

    case 'distance':
      if (requirement.discipline === 'swim') {
        return (stats.totalDistance?.swim || 0) >= requirement.threshold;
      } else if (requirement.discipline === 'bike') {
        return (stats.totalDistance?.bike || 0) >= requirement.threshold;
      } else if (requirement.discipline === 'run') {
        return (stats.totalDistance?.run || 0) >= requirement.threshold;
      }
      return false;

    case 'duration':
      return stats.totalDuration >= requirement.threshold;

    case 'special':
      // Special badges need custom logic
      return false;

    default:
      return false;
  }
}

// Get all badges with earned status
export function getUserBadges(userStats: any, earnedBadges: string[]): Array<Badge & { earned: boolean; progress: number }> {
  return BADGES.map(badge => {
    const earned = earnedBadges.includes(badge.key) || checkBadgeEarned(badge, userStats);
    const progress = calculateBadgeProgress(badge, userStats);

    return {
      ...badge,
      earned,
      progress
    };
  });
}

// Calculate progress toward earning a badge (0-100)
export function calculateBadgeProgress(badge: Badge, stats: any): number {
  const { requirement } = badge;
  let current = 0;
  const target = requirement.threshold;

  switch (requirement.type) {
    case 'streak':
      current = stats.currentStreak || 0;
      break;

    case 'checkins':
      current = stats.checkinStreak || 0;
      break;

    case 'sessions':
      if (requirement.discipline === 'all') {
        current = stats.totalSessions || 0;
      } else {
        current = stats.sessionsByType?.[requirement.discipline] || 0;
      }
      break;

    case 'distance':
      if (requirement.discipline) {
        current = stats.totalDistance?.[requirement.discipline] || 0;
      }
      break;

    case 'duration':
      current = stats.totalDuration || 0;
      break;

    default:
      current = 0;
  }

  return Math.min(100, Math.round((current / target) * 100));
}

// Get badges by category
export function getBadgesByCategory(category: Badge['category']): Badge[] {
  return BADGES.filter(b => b.category === category);
}

// Get next badge to earn
export function getNextBadgeToEarn(userStats: any, earnedBadges: string[]): Badge | null {
  const unearnedBadges = BADGES.filter(badge => !earnedBadges.includes(badge.key) && !checkBadgeEarned(badge, userStats));

  if (unearnedBadges.length === 0) return null;

  // Sort by progress (closest to earning)
  const withProgress = unearnedBadges.map(badge => ({
    badge,
    progress: calculateBadgeProgress(badge, userStats)
  }));

  withProgress.sort((a, b) => b.progress - a.progress);

  return withProgress[0].badge;
}
