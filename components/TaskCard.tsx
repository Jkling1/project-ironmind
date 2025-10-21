import { DailyTask } from '@/types'
import { CheckCircle2, Circle, Flame, Brain, TrendingUp } from 'lucide-react'

interface TaskCardProps {
  task: DailyTask
  onToggle: () => void
  color: 'blue' | 'purple' | 'green'
}

const colorStyles = {
  blue: {
    border: 'border-neon-blue',
    text: 'text-neon-blue',
    glow: 'text-glow-blue',
    bg: 'bg-neon-blue/20',
    hover: 'hover:bg-neon-blue/30',
    shadow: 'shadow-neon-blue',
  },
  purple: {
    border: 'border-neon-purple',
    text: 'text-neon-purple',
    glow: 'text-glow-purple',
    bg: 'bg-neon-purple/20',
    hover: 'hover:bg-neon-purple/30',
    shadow: 'shadow-neon-purple',
  },
  green: {
    border: 'border-neon-green',
    text: 'text-neon-green',
    glow: 'text-glow-green',
    bg: 'bg-neon-green/20',
    hover: 'hover:bg-neon-green/30',
    shadow: 'shadow-neon-green',
  },
}

const icons = {
  fitness: Flame,
  mindset: Brain,
  growth: TrendingUp,
}

export default function TaskCard({ task, onToggle, color }: TaskCardProps) {
  const styles = colorStyles[color]
  const Icon = icons[task.type]

  return (
    <div
      className={`bg-dark-card border ${styles.border} rounded-lg p-6 transition-all cursor-pointer ${
        task.completed ? styles.shadow : ''
      } ${styles.hover}`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-4">
        <div className={`${styles.text} mt-1`}>
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-lg font-bold ${styles.text} uppercase tracking-wide`}>
              {task.title}
            </h3>
            <div className={styles.text}>
              {task.completed ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </div>
          </div>

          <p className={`text-gray-300 ${task.completed ? 'line-through opacity-60' : ''}`}>
            {task.description}
          </p>
        </div>
      </div>
    </div>
  )
}
