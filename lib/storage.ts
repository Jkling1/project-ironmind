import { UserData, DayProgress, DailyTask } from '@/types'
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
  }
}

export const loadUserData = (): UserData => {
  if (typeof window === 'undefined') return getDefaultUserData()

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return getDefaultUserData()
    return JSON.parse(stored)
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
