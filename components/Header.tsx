import { TrainingPhase } from '@/types'

interface HeaderProps {
  dayNumber: number
  daysUntilRace: number
  phase: TrainingPhase
}

export default function Header({ dayNumber, daysUntilRace, phase }: HeaderProps) {
  const phaseColors: Record<TrainingPhase, string> = {
    'FOUNDATION': 'text-blue-400',
    'BUILD': 'text-cyan-400',
    'PEAK BUILD': 'text-green-400',
    'RACE-SHARPEN': 'text-yellow-400',
    'TAPER': 'text-orange-400',
    'RACE WEEK': 'text-red-400',
    'RACE DAY': 'text-neon-pink',
    'POST-RACE': 'text-purple-400',
  }

  return (
    <header className="text-center space-y-4">
      <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink animate-glow">
        PROJECT IRONMIND
      </h1>

      <div className="text-sm md:text-base text-gray-400 uppercase tracking-widest">
        365-Day Transformation Protocol
      </div>

      <div className={`text-xs md:text-sm font-bold uppercase tracking-wider ${phaseColors[phase]}`}>
        Phase: {phase}
      </div>

      <div className="flex justify-center items-center gap-8 mt-6">
        <div className="text-center">
          <div className="text-sm text-gray-500 uppercase tracking-wide">
            Day
          </div>
          <div className="text-4xl md:text-5xl font-bold text-neon-blue text-glow-blue">
            {dayNumber}
            <span className="text-xl text-gray-500"> / 365</span>
          </div>
        </div>

        <div className="h-16 w-px bg-gradient-to-b from-transparent via-neon-purple to-transparent"></div>

        <div className="text-center">
          <div className="text-sm text-gray-500 uppercase tracking-wide">
            Race Day
          </div>
          <div className="text-4xl md:text-5xl font-bold text-neon-purple text-glow-purple">
            {daysUntilRace}
            <span className="text-xl text-gray-500"> days</span>
          </div>
        </div>
      </div>
    </header>
  )
}
