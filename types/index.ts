export interface DailyTask {
  id: string
  type: 'fitness' | 'mindset' | 'growth'
  title: string
  description: string
  completed: boolean
  date: string
}

export interface DayProgress {
  date: string
  dayNumber: number
  fitnessTask: DailyTask
  mindsetTask: DailyTask
  growthTask: DailyTask
  goalAchieved: boolean | null
  reflection?: string
  props: number
}

export interface UserData {
  startDate: string
  raceDate: string
  currentStreak: number
  longestStreak: number
  totalDaysCompleted: number
  history: DayProgress[]
}

export interface WeeklyData {
  day: string
  completed: number
}
