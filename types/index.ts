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
  baseline?: BaselineAssessment
  dailyLogs: DailyLog[]
  streaks: StreakData
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

export type TrainingPhase =
  | 'FOUNDATION'
  | 'BUILD'
  | 'PEAK BUILD'
  | 'RACE-SHARPEN'
  | 'TAPER'
  | 'RACE WEEK'
  | 'RACE DAY'
  | 'POST-RACE'

export interface BaselineAssessment {
  weight_lbs: number
  longest_run_miles: number
  longest_bike_miles: number
  swim_comfort: string
  training_days_per_week: number
  known_injuries: string
  typical_sleep_hours: number
  alcohol_drinks_per_week: number
  meals_out_per_week: number
  race_goal: string
  assessment_date: string
}

export interface DailyMetrics {
  weight_lbs?: number
  sleep_hours?: number
  hydration_oz?: number
  alcohol_today: boolean
  alcohol_amount?: string
  ate_out_today: boolean
  ate_out_what?: string
  home_cooked_meal: boolean
  steps_or_activity?: string
}

export interface TrainingLog {
  planned: string
  completed: string
  rpe: number // 1-10
}

export interface NutritionLog {
  quality_summary: 'high' | 'medium' | 'trash gremlin'
  pre_workout_fueling?: string
  post_workout_fueling?: string
}

export interface MindsetLog {
  mood: number // 1-10
  mood_label: string
  stress_level: number // 1-10
  dominant_thought: string
}

export interface DailyLog {
  date: string
  day_index: number
  days_to_race: number
  phase: TrainingPhase
  training: TrainingLog
  metrics: DailyMetrics
  nutrition: NutritionLog
  mindset: MindsetLog
  ironmind_diary: string
  compliance_score: number // 0-100
  tomorrow_focus: string[]
}

export interface StreakData {
  training_streak_days: number
  alcohol_free_streak_days: number
  home_cooked_streak_days: number
}

export interface DailyLesson {
  id: string
  day: number
  phase: TrainingPhase
  category: 'training' | 'nutrition' | 'psychology' | 'systems'
  title: string
  content: string
}
