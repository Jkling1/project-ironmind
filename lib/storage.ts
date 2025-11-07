import { UserData, DayProgress, DailyTask, TrainingPhase, DailyLesson } from '@/types'
import { format, differenceInDays, startOfDay, subDays } from 'date-fns'

const STORAGE_KEY = 'ironmind_user_data'

export const getDefaultUserData = (): UserData => {
  const today = new Date()
  const raceDate = new Date(today)
  raceDate.setDate(today.getDate() + 365) // Default: 365 days from now

  return {
    startDate: format(today, 'yyyy-MM-dd'),
    raceDate: format(raceDate, 'yyyy-MM-dd'),
    currentStreak: 0,
    longestStreak: 0,
    totalDaysCompleted: 0,
    history: [],
    budget: {
      totalBudget: 0,
      expenses: [],
      savingsGoal: 0,
      currentSavings: 0,
    },
    dailyLogs: [],
    streaks: {
      training_streak_days: 0,
      alcohol_free_streak_days: 0,
      home_cooked_streak_days: 0,
    },
  }
}

export const loadUserData = (): UserData => {
  if (typeof window === 'undefined') return getDefaultUserData()

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return getDefaultUserData()
    const data = JSON.parse(stored)

    // Backwards compatibility: add budget if it doesn't exist
    if (!data.budget) {
      data.budget = {
        totalBudget: 0,
        expenses: [],
        savingsGoal: 0,
        currentSavings: 0,
      }
    }

    // Backwards compatibility: add IronMind coach features
    if (!data.dailyLogs) {
      data.dailyLogs = []
    }
    if (!data.streaks) {
      data.streaks = {
        training_streak_days: 0,
        alcohol_free_streak_days: 0,
        home_cooked_streak_days: 0,
      }
    }

    return data
  } catch (error) {
    console.error('Error loading user data:', error)
    return getDefaultUserData()
  }
}

export const saveUserData = (data: UserData): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving user data:', error)
  }
}

export const getCurrentDayNumber = (startDate: string): number => {
  const start = new Date(startDate)
  const today = startOfDay(new Date())
  return differenceInDays(today, start) + 1
}

export const getDaysUntilRace = (raceDate: string): number => {
  const race = new Date(raceDate)
  const today = startOfDay(new Date())
  return differenceInDays(race, today)
}

export const getTodayProgress = (userData: UserData): DayProgress | null => {
  const today = format(new Date(), 'yyyy-MM-dd')
  return userData.history.find(p => p.date === today) || null
}

export const createDailyTasks = (dayNumber: number): {
  fitness: DailyTask
  mindset: DailyTask
  growth: DailyTask
} => {
  const today = format(new Date(), 'yyyy-MM-dd')

  const fitnessPlans = [
    'Complete 30-minute easy run',
    'Swim 1000m with focus on technique',
    'Bike 45 minutes at moderate pace',
    '60-minute long run at conversational pace',
    'Brick workout: 30min bike + 15min run',
    'Recovery swim - 800m easy',
    'Rest day - light stretching and mobility',
  ]

  const mindsetPrompts = [
    'What does becoming an Ironman mean to you?',
    'Identify one fear and how you\'ll overcome it',
    'Write about a time you pushed past your limits',
    'What are you grateful for in your training journey?',
    'Visualize crossing the finish line - describe the feeling',
    'What mental strategies will you use when it gets hard?',
    'Reflect on your progress - what have you learned?',
  ]

  const growthChallenges = [
    'Learn proper breathing technique for swimming',
    'Research and plan your race nutrition strategy',
    'Practice quick transitions (T1 or T2)',
    'Study the race course and create a game plan',
    'Connect with another triathlete for advice',
    'Calculate your target pace zones',
    'Watch a video on bike maintenance',
  ]

  return {
    fitness: {
      id: `fitness-${today}`,
      type: 'fitness',
      title: 'Fitness Task',
      description: fitnessPlans[dayNumber % fitnessPlans.length],
      completed: false,
      date: today,
    },
    mindset: {
      id: `mindset-${today}`,
      type: 'mindset',
      title: 'Mindset Task',
      description: mindsetPrompts[dayNumber % mindsetPrompts.length],
      completed: false,
      date: today,
    },
    growth: {
      id: `growth-${today}`,
      type: 'growth',
      title: 'Growth Task',
      description: growthChallenges[dayNumber % growthChallenges.length],
      completed: false,
      date: today,
    },
  }
}

export const updateStreak = (userData: UserData): UserData => {
  const sortedHistory = [...userData.history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  let currentStreak = 0
  const today = startOfDay(new Date())

  for (let i = 0; i < sortedHistory.length; i++) {
    const expectedDate = subDays(today, i)
    const historyDate = startOfDay(new Date(sortedHistory[i].date))

    if (
      format(historyDate, 'yyyy-MM-dd') === format(expectedDate, 'yyyy-MM-dd') &&
      sortedHistory[i].goalAchieved
    ) {
      currentStreak++
    } else {
      break
    }
  }

  const longestStreak = Math.max(userData.longestStreak, currentStreak)

  return {
    ...userData,
    currentStreak,
    longestStreak,
  }
}

export const getWeeklyData = (userData: UserData) => {
  const weekData = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayProgress = userData.history.find(p => p.date === dateStr)

    weekData.push({
      day: format(date, 'EEE'),
      completed: dayProgress?.goalAchieved ? 1 : 0,
    })
  }

  return weekData
}

// Budget helper functions
export const getTotalExpenses = (userData: UserData): number => {
  return userData.budget.expenses.reduce((sum, expense) => sum + expense.amount, 0)
}

export const getPaidExpenses = (userData: UserData): number => {
  return userData.budget.expenses
    .filter(e => e.isPaid)
    .reduce((sum, expense) => sum + expense.amount, 0)
}

export const getRemainingBudget = (userData: UserData): number => {
  const totalExpenses = getTotalExpenses(userData)
  return userData.budget.totalBudget - totalExpenses
}

export const getSavingsProgress = (userData: UserData): number => {
  if (userData.budget.savingsGoal === 0) return 0
  return Math.round((userData.budget.currentSavings / userData.budget.savingsGoal) * 100)
}

export const getExpensesByCategory = (userData: UserData) => {
  const categories = ['registration', 'gear', 'nutrition', 'travel', 'coaching', 'medical', 'other']
  return categories.map(cat => ({
    category: cat,
    total: userData.budget.expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0),
  }))
}

// IronMind Coach Functions
export const getCurrentPhase = (daysToRace: number): TrainingPhase => {
  if (daysToRace < 0) return 'POST-RACE'
  if (daysToRace === 0) return 'RACE DAY'
  if (daysToRace <= 7) return 'RACE WEEK'
  if (daysToRace <= 30) return 'TAPER'
  if (daysToRace <= 90) return 'RACE-SHARPEN'
  if (daysToRace <= 180) return 'PEAK BUILD'
  if (daysToRace <= 270) return 'BUILD'
  return 'FOUNDATION'
}

export const updateStreaks = (userData: UserData): UserData => {
  const logs = [...userData.dailyLogs].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Calculate training streak
  let trainingStreak = 0
  let alcoholFreeStreak = 0
  let homeCookedStreak = 0
  const today = startOfDay(new Date())

  for (let i = 0; i < logs.length; i++) {
    const expectedDate = subDays(today, i)
    const logDate = startOfDay(new Date(logs[i].date))

    if (format(logDate, 'yyyy-MM-dd') !== format(expectedDate, 'yyyy-MM-dd')) {
      break
    }

    // Training streak: completed training and compliance > 70%
    if (logs[i].training.completed && logs[i].compliance_score >= 70) {
      trainingStreak++
    } else if (trainingStreak === 0) {
      // Only break streak if we haven't started counting yet
    } else {
      break
    }

    // Alcohol-free streak
    if (!logs[i].metrics.alcohol_today) {
      alcoholFreeStreak = i + 1
    }

    // Home-cooked streak
    if (logs[i].metrics.home_cooked_meal) {
      homeCookedStreak = i + 1
    }
  }

  return {
    ...userData,
    streaks: {
      training_streak_days: trainingStreak,
      alcohol_free_streak_days: alcoholFreeStreak,
      home_cooked_streak_days: homeCookedStreak,
    },
  }
}

export const getDailyLesson = (dayIndex: number, phase: TrainingPhase): DailyLesson => {
  const lessons: DailyLesson[] = [
    {
      id: 'foundation-1',
      day: 1,
      phase: 'FOUNDATION',
      category: 'psychology',
      title: 'Identity Before Action',
      content: 'You don\'t become an Ironman on race day. You become one today. Every decision you make either confirms or contradicts that identity. The person who finishes Ironman Florida doesn\'t suddenly appear in 365 days—they\'re built one boring Tuesday at a time. Start thinking: "What would the person who finishes an Ironman do right now?"'
    },
    {
      id: 'foundation-2',
      day: 2,
      phase: 'FOUNDATION',
      category: 'training',
      title: 'Zone 2 Is Your Foundation',
      content: 'Most of your training (80%) should feel absurdly easy. Zone 2 = conversational pace. You should be able to talk in full sentences. This builds aerobic base—your engine for endurance. Going hard every session trains your ego, not your mitochondria. Slow down to go long.'
    },
    {
      id: 'foundation-3',
      day: 3,
      phase: 'FOUNDATION',
      category: 'systems',
      title: 'Environment Beats Willpower',
      content: 'Willpower is finite. Environment is engineered. Lay out your workout gear the night before. Prep tomorrow\'s meals today. Put your phone in another room before bed. Design your space so the default action is the right action. Discipline is just good systems in disguise.'
    },
    // Add more lessons as needed
  ]

  // Find lesson for this day or cycle through available lessons
  const lesson = lessons.find(l => l.day === dayIndex) || lessons[dayIndex % lessons.length]
  return lesson
}
