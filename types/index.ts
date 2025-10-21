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
  budget: BudgetData
}

export interface WeeklyData {
  day: string
  completed: number
}

export interface Expense {
  id: string
  category: ExpenseCategory
  name: string
  amount: number
  date: string
  isPaid: boolean
  notes?: string
}

export type ExpenseCategory =
  | 'registration'
  | 'gear'
  | 'nutrition'
  | 'travel'
  | 'coaching'
  | 'medical'
  | 'other'

export interface BudgetData {
  totalBudget: number
  expenses: Expense[]
  savingsGoal: number
  currentSavings: number
}

export interface MoneyTip {
  id: string
  title: string
  description: string
  category: 'earn' | 'save'
  icon: string
}
