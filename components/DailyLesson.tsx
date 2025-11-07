import { DailyLesson } from '@/types'
import { Lightbulb, Dumbbell, Apple, Brain, Target } from 'lucide-react'

interface DailyLessonProps {
  lesson: DailyLesson
}

const categoryIcons = {
  training: Dumbbell,
  nutrition: Apple,
  psychology: Brain,
  systems: Target,
}

const categoryColors = {
  training: 'text-neon-blue border-neon-blue bg-neon-blue/10',
  nutrition: 'text-neon-green border-neon-green bg-neon-green/10',
  psychology: 'text-neon-purple border-neon-purple bg-neon-purple/10',
  systems: 'text-neon-pink border-neon-pink bg-neon-pink/10',
}

export default function DailyLesson({ lesson }: DailyLessonProps) {
  const Icon = categoryIcons[lesson.category]
  const colorClass = categoryColors[lesson.category]

  return (
    <div className={`border ${colorClass} rounded-lg p-6`}>
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider opacity-75">
              IronMind Principle
            </span>
          </div>
          <h3 className="text-lg font-bold mb-3">{lesson.title}</h3>
          <p className="text-gray-300 leading-relaxed">{lesson.content}</p>
        </div>
      </div>
    </div>
  )
}
