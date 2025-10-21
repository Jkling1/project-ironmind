'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { UserData, DayProgress } from '@/types'
import {
  loadUserData,
  saveUserData,
  getCurrentDayNumber,
  getDaysUntilRace,
  getTodayProgress,
  createDailyTasks,
  updateStreak,
} from '@/lib/storage'
import Header from './Header'
import TaskCard from './TaskCard'
import StatsPanel from './StatsPanel'
import ReflectionModal from './ReflectionModal'
import SetupModal from './SetupModal'
import BudgetTracker from './BudgetTracker'
import MoneyTips from './MoneyTips'

export default function MissionControl() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [todayProgress, setTodayProgress] = useState<DayProgress | null>(null)
  const [showReflection, setShowReflection] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [dayNumber, setDayNumber] = useState(1)
  const [daysUntilRace, setDaysUntilRace] = useState(365)
  const [activeView, setActiveView] = useState<'tasks' | 'budget'>('tasks')

  useEffect(() => {
    const data = loadUserData()
    setUserData(data)

    // Check if this is first time setup
    if (data.history.length === 0) {
      setShowSetup(true)
    }

    const today = format(new Date(), 'yyyy-MM-dd')
    let progress = getTodayProgress(data)

    // Create today's tasks if they don't exist
    if (!progress) {
      const dayNum = getCurrentDayNumber(data.startDate)
      const tasks = createDailyTasks(dayNum)

      progress = {
        date: today,
        dayNumber: dayNum,
        fitnessTask: tasks.fitness,
        mindsetTask: tasks.mindset,
        growthTask: tasks.growth,
        goalAchieved: null,
        props: 0,
      }

      data.history.push(progress)
      saveUserData(data)
    }

    setTodayProgress(progress)
    setDayNumber(getCurrentDayNumber(data.startDate))
    setDaysUntilRace(getDaysUntilRace(data.raceDate))
  }, [])

  const handleTaskToggle = (taskType: 'fitness' | 'mindset' | 'growth') => {
    if (!userData || !todayProgress) return

    const updatedProgress = { ...todayProgress }
    const taskKey = `${taskType}Task` as keyof Pick<
      DayProgress,
      'fitnessTask' | 'mindsetTask' | 'growthTask'
    >

    updatedProgress[taskKey] = {
      ...updatedProgress[taskKey],
      completed: !updatedProgress[taskKey].completed,
    }

    const historyIndex = userData.history.findIndex(
      p => p.date === todayProgress.date
    )
    if (historyIndex !== -1) {
      userData.history[historyIndex] = updatedProgress
      saveUserData(userData)
      setUserData({ ...userData })
      setTodayProgress(updatedProgress)
    }
  }

  const handleGoalAnswer = (achieved: boolean) => {
    if (!userData || !todayProgress) return

    const updatedProgress = { ...todayProgress, goalAchieved: achieved }
    const historyIndex = userData.history.findIndex(
      p => p.date === todayProgress.date
    )

    if (historyIndex !== -1) {
      userData.history[historyIndex] = updatedProgress

      if (achieved) {
        userData.totalDaysCompleted++
      } else {
        setShowReflection(true)
      }

      const updatedData = updateStreak(userData)
      saveUserData(updatedData)
      setUserData({ ...updatedData })
      setTodayProgress(updatedProgress)
    }
  }

  const handleReflectionSubmit = (reflection: string) => {
    if (!userData || !todayProgress) return

    const updatedProgress = { ...todayProgress, reflection }
    const historyIndex = userData.history.findIndex(
      p => p.date === todayProgress.date
    )

    if (historyIndex !== -1) {
      userData.history[historyIndex] = updatedProgress
      saveUserData(userData)
      setUserData({ ...userData })
      setTodayProgress(updatedProgress)
    }

    setShowReflection(false)
  }

  const handleProps = () => {
    if (!userData || !todayProgress) return

    const updatedProgress = { ...todayProgress, props: todayProgress.props + 1 }
    const historyIndex = userData.history.findIndex(
      p => p.date === todayProgress.date
    )

    if (historyIndex !== -1) {
      userData.history[historyIndex] = updatedProgress
      saveUserData(userData)
      setUserData({ ...userData })
      setTodayProgress(updatedProgress)
    }
  }

  const handleSetupComplete = (startDate: string, raceDate: string) => {
    const newUserData = loadUserData()
    newUserData.startDate = startDate
    newUserData.raceDate = raceDate
    saveUserData(newUserData)
    setUserData(newUserData)
    setShowSetup(false)
    setDayNumber(getCurrentDayNumber(startDate))
    setDaysUntilRace(getDaysUntilRace(raceDate))
  }

  const handleUpdateBudget = (budget: UserData['budget']) => {
    if (!userData) return

    const updatedUserData = { ...userData, budget }
    saveUserData(updatedUserData)
    setUserData(updatedUserData)
  }

  if (!userData || !todayProgress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-neon-blue text-2xl animate-pulse">
          Loading Mission Control...
        </div>
      </div>
    )
  }

  const allTasksCompleted =
    todayProgress.fitnessTask.completed &&
    todayProgress.mindsetTask.completed &&
    todayProgress.growthTask.completed

  return (
    <div className="max-w-7xl mx-auto">
      <Header dayNumber={dayNumber} daysUntilRace={daysUntilRace} />

      {/* View Toggle */}
      <div className="flex gap-4 mt-8 mb-6">
        <button
          onClick={() => setActiveView('tasks')}
          className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
            activeView === 'tasks'
              ? 'bg-neon-blue/20 border border-neon-blue text-neon-blue shadow-neon-blue'
              : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white'
          }`}
        >
          Daily Protocol
        </button>
        <button
          onClick={() => setActiveView('budget')}
          className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
            activeView === 'budget'
              ? 'bg-neon-green/20 border border-neon-green text-neon-green shadow-neon-green'
              : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white'
          }`}
        >
          Race Budget
        </button>
      </div>

      {activeView === 'tasks' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-neon-blue text-glow-blue">
              Today's Protocol
            </h2>

            <TaskCard
              task={todayProgress.fitnessTask}
              onToggle={() => handleTaskToggle('fitness')}
              color="blue"
            />

            <TaskCard
              task={todayProgress.mindsetTask}
              onToggle={() => handleTaskToggle('mindset')}
              color="purple"
            />

            <TaskCard
              task={todayProgress.growthTask}
              onToggle={() => handleTaskToggle('growth')}
              color="green"
            />
          </div>

          {allTasksCompleted && todayProgress.goalAchieved === null && (
            <div className="bg-dark-card border border-neon-pink rounded-lg p-6 shadow-neon-pink">
              <h3 className="text-xl font-bold text-neon-pink mb-4">
                Daily Question
              </h3>
              <p className="text-gray-300 mb-6">
                Did you accomplish your goal today?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleGoalAnswer(true)}
                  className="flex-1 bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green text-neon-green font-bold py-3 px-6 rounded-lg transition-all hover:shadow-neon-green"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleGoalAnswer(false)}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500 text-red-400 font-bold py-3 px-6 rounded-lg transition-all"
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <StatsPanel
            userData={userData}
            onProps={handleProps}
            propsCount={todayProgress.props}
          />
        </div>
      </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BudgetTracker userData={userData} onUpdateBudget={handleUpdateBudget} />
          </div>
          <div className="lg:col-span-1">
            <MoneyTips />
          </div>
        </div>
      )}

      {showReflection && (
        <ReflectionModal
          onSubmit={handleReflectionSubmit}
          onClose={() => setShowReflection(false)}
        />
      )}

      {showSetup && (
        <SetupModal
          onComplete={handleSetupComplete}
          onClose={() => setShowSetup(false)}
        />
      )}
    </div>
  )
}
