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
    // FOUNDATION Phase (Days 1-95)
    { id: '1', day: 1, phase: 'FOUNDATION', category: 'psychology', title: 'Identity Before Action', content: 'You don\'t become an Ironman on race day. You become one today. Every decision you make either confirms or contradicts that identity. The person who finishes Ironman Florida doesn\'t suddenly appear in 365 days—they\'re built one boring Tuesday at a time.' },
    { id: '2', day: 2, phase: 'FOUNDATION', category: 'training', title: 'Zone 2 Is Your Foundation', content: 'Most of your training (80%) should feel absurdly easy. Zone 2 = conversational pace. You should be able to talk in full sentences. This builds aerobic base—your engine for endurance. Going hard every session trains your ego, not your mitochondria. Slow down to go long.' },
    { id: '3', day: 3, phase: 'FOUNDATION', category: 'systems', title: 'Environment Beats Willpower', content: 'Willpower is finite. Environment is engineered. Lay out your workout gear the night before. Prep tomorrow\'s meals today. Put your phone in another room before bed. Design your space so the default action is the right action. Discipline is just good systems in disguise.' },
    { id: '4', day: 4, phase: 'FOUNDATION', category: 'nutrition', title: 'Fuel for Aerobic Work', content: 'Your body runs on fat at low intensities. Don\'t carb-load for easy sessions. Save the carbs for hard efforts. For Zone 2 work, hydrate well and eat normally. Train your body to be metabolically flexible—able to burn fat efficiently during long, slow distance.' },
    { id: '5', day: 5, phase: 'FOUNDATION', category: 'psychology', title: 'Boring is Beautiful', content: 'The person who can do boring things consistently beats the person who does heroic things sporadically. Most days should feel unremarkable. That\'s the point. You\'re building a base, not a highlight reel. Embrace the mundane—it\'s where champions are forged.' },
    { id: '6', day: 6, phase: 'FOUNDATION', category: 'training', title: 'Recovery is Training', content: 'Rest days aren\'t "off days"—they\'re when your body rebuilds stronger. Sleep 7-9 hours. Walk. Stretch. Foam roll. Active recovery beats couch sitting, but hard training beats proper recovery. Your gains happen during rest, not during the workout.' },
    { id: '7', day: 7, phase: 'FOUNDATION', category: 'systems', title: 'The 5-Minute Rule', content: 'Commit to starting for just 5 minutes. Gear on. Out the door. Most resistance is in the transition, not the work itself. Once you\'re moving, momentum takes over. This hack works for training, meal prep, mobility—anything you\'re avoiding.' },
    { id: '8', day: 8, phase: 'FOUNDATION', category: 'nutrition', title: 'Hydration Matters More Than You Think', content: 'Dehydration kills performance before you feel thirsty. Aim for pale yellow urine. Drink water consistently throughout the day—not just during workouts. Electrolytes matter for sessions over 90 minutes. Start building this habit now, not in month 10.' },
    { id: '9', day: 9, phase: 'FOUNDATION', category: 'psychology', title: 'Process Over Outcome', content: 'You can\'t control finishing. You CAN control showing up today. Focus on the system: train consistently, eat well, sleep enough, stay injury-free. The outcome (finishing Ironman) is a byproduct of the process. Trust the process, and the outcome follows.' },
    { id: '10', day: 10, phase: 'FOUNDATION', category: 'training', title: 'Aerobic Decoupling Test', content: 'Track heart rate and pace on easy runs. If your HR stays steady but pace slows (or HR rises while pace stays same), you\'re losing aerobic efficiency. This means you need MORE easy work, not harder work. Build the engine first. Speed comes later.' },

    // BUILD Phase (Days 96-185)
    { id: '11', day: 96, phase: 'BUILD', category: 'training', title: 'Volume Over Intensity', content: 'In the BUILD phase, gradually increase weekly training volume. Add 10% per week maximum. Your body adapts to stress + rest, not stress alone. More isn\'t always better—consistent, sustainable increases beat random spikes that lead to injury.' },
    { id: '12', day: 100, phase: 'BUILD', category: 'nutrition', title: 'Carbs Are Fuel, Not the Enemy', content: 'As training volume increases, so do carb needs. You\'re not "eating clean"—you\'re fueling performance. Rice, pasta, oats, potatoes. Real food beats gels for daily training. Save the science experiments for race-specific nutrition later.' },
    { id: '13', day: 105, phase: 'BUILD', category: 'systems', title: 'Stack Your Habits', content: 'Link new habits to existing ones. After your morning coffee → 10-minute mobility. After dinner → lay out tomorrow\'s gear. After brushing teeth → review tomorrow\'s training plan. Habit stacking makes consistency automatic.' },
    { id: '14', day: 110, phase: 'BUILD', category: 'psychology', title: 'The Mid-Training Slump', content: 'Around month 3-4, novelty fades. This is where most people quit. Expect this phase. It\'s not failure—it\'s predictable. Recommit to your why. Revisit your race goal. This slump is temporary. The people who push through here separate themselves from the crowd.' },
    { id: '15', day: 115, phase: 'BUILD', category: 'training', title: 'Brick Workouts Explained', content: 'Bike-to-run transitions (bricks) teach your legs to run on fatigued muscles. Start small: 30-min bike + 15-min run. Frequency beats length early on. Your body learns to switch fuel systems and recruit different muscles. This is race-specific training.' },

    // PEAK BUILD Phase (Days 186-275)
    { id: '16', day: 186, phase: 'PEAK BUILD', category: 'training', title: 'Long Days Build Mental Toughness', content: 'Peak weeks include 5+ hour sessions. This isn\'t just physical—it\'s psychological. You\'re teaching yourself: "I can keep going when it\'s hard." Nutrition, pacing, mental management—this is where you practice being an Ironman before race day.' },
    { id: '17', day: 195, phase: 'PEAK BUILD', category: 'nutrition', title: 'Gut Training is Non-Negotiable', content: 'Your stomach needs training too. Practice race nutrition during long sessions. Can you digest 60-90g carbs/hour while riding? While running? Find what works NOW, not on race day. Gels, blocks, real food—test everything. Write it down.' },
    { id: '18', day: 200, phase: 'PEAK BUILD', category: 'psychology', title: 'Pain is Temporary, Quitting is Forever', content: 'You will have bad days. Days where every pedal stroke hurts. Days where you want to quit. This is where the race is won. Not on race day—right here, in training, when you choose to keep going. Every hard day is a deposit in your mental bank.' },
    { id: '19', day: 210, phase: 'PEAK BUILD', category: 'systems', title: 'Dialing In Race Logistics', content: 'Start thinking through race day logistics. Gear checklist. Transition layout. Pacing strategy. Where will supporters be? What\'s your fueling plan? The more you visualize and plan now, the calmer you\'ll be on race day. Anxiety lives in uncertainty.' },
    { id: '20', day: 220, phase: 'PEAK BUILD', category: 'training', title: 'Respect Fatigue', content: 'Peak training is cumulative fatigue by design. You should feel tired. BUT—there\'s a difference between "trained hard" tired and "breaking down" tired. Listen to your body. One missed workout beats two weeks injured. Know when to push, know when to back off.' },

    // RACE-SHARPEN Phase (Days 276-305)
    { id: '21', day: 276, phase: 'RACE-SHARPEN', category: 'training', title: 'Quality Over Quantity Now', content: 'Volume drops, intensity stays. Race-pace intervals. Tempo work. Teaching your body what race day feels like. No more hero workouts. Everything is intentional and race-specific. You\'re sharpening the blade, not building it.' },
    { id: '22', day: 285, phase: 'RACE-SHARPEN', category: 'nutrition', title: 'Lock In Your Race Nutrition', content: 'No experiments after this phase. You should know EXACTLY what you\'re eating/drinking on race day. Practice it in training. Write it down. Buy extra. Nothing new on race day—this includes gels, drinks, breakfast, pre-race meals. Zero surprises.' },
    { id: '23', day: 290, phase: 'RACE-SHARPEN', category: 'psychology', title: 'Trust Your Training', content: 'Self-doubt will creep in. "Did I do enough?" "Am I ready?" Yes. You\'ve put in the work. Your job now is to trust the process. Stop comparing yourself to others. Your race is yours alone. Trust your training. Trust yourself.' },

    // TAPER Phase (Days 306-335)
    { id: '24', day: 306, phase: 'TAPER', category: 'training', title: 'Less is More', content: 'Your body is rebuilding. Volume drops 40-60%. You\'ll feel restless. That\'s normal. Do NOT add extra workouts. Do NOT panic-train. The work is done. Your job now is to arrive at the start line fresh, healthy, and ready. Trust the taper.' },
    { id: '25', day: 315, phase: 'TAPER', category: 'psychology', title: 'Taper Madness is Real', content: 'You\'ll feel slow. Heavy. Anxious. Every ache becomes a potential injury. This is taper madness—it\'s psychological, not physical. Keep training light, keep moving, but don\'t overreact. Everyone feels weird during taper. It passes. You\'re adapting.' },
    { id: '26', day: 320, phase: 'TAPER', category: 'systems', title: 'Final Gear Check', content: 'Go through your gear checklist. Test everything one last time. Bike tune-up. New goggles if needed. Race-day outfit試運転. Pack your transition bags. Write your checklist. Preparation kills anxiety. Be meticulous now, be calm later.' },
    { id: '27', day: 325, phase: 'TAPER', category: 'nutrition', title: 'No Diet Changes', content: 'This is NOT the time to cut weight or try new foods. Eat normally. Stay hydrated. Sleep as much as possible. Your body is repairing. Give it fuel and rest. The fittest person on the start line is the one who stayed healthy and well-fueled.' },

    // RACE WEEK (Days 336-358)
    { id: '28', day: 350, phase: 'RACE WEEK', category: 'psychology', title: 'Calm the Mind', content: 'Race week is about managing nerves, not training. Visualize the race. Walk through transitions mentally. Imagine different scenarios and how you\'ll respond. This mental rehearsal builds confidence and reduces anxiety. You\'re ready. You\'ve done the work.' },
    { id: '29', day: 353, phase: 'RACE WEEK', category: 'systems', title: 'Course Study', content: 'Know the course. Where are the hills? Where are aid stations? Where will you see supporters? What\'s your pacing strategy for each segment? Knowledge is confidence. Visualize yourself moving through each mile. See yourself succeeding.' },
    { id: '30', day: 356, phase: 'RACE WEEK', category: 'training', title: 'Keep Moving, Stay Loose', content: 'Short, easy sessions only. 20-30 min swim, bike, run. Keep the engine warm, don\'t empty the tank. Stretch. Foam roll. Stay active but not fatigued. You\'re maintaining readiness, not building fitness. The hay is in the barn.' },

    // RACE DAY
    { id: '31', day: 365, phase: 'RACE DAY', category: 'psychology', title: 'Execute the Plan', content: 'This is your day. 365 days of work brought you here. Start conservative. Trust your pacing. Fuel early and often. Stay present. When it gets hard—and it will—remember every hard training day that prepared you for this. You are ready. You are an Ironman. Go prove it.' },
  ]

  // Find lesson for this day, or cycle through phase-appropriate lessons
  let lesson = lessons.find(l => l.day === dayIndex)
  if (!lesson) {
    // Filter lessons by current phase
    const phaseLessons = lessons.filter(l => l.phase === phase)
    if (phaseLessons.length > 0) {
      lesson = phaseLessons[dayIndex % phaseLessons.length]
    } else {
      // Fallback to cycling through all lessons
      lesson = lessons[dayIndex % lessons.length]
    }
  }
  return lesson
}
