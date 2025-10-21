interface HeaderProps {
  dayNumber: number
  daysUntilRace: number
}

export default function Header({ dayNumber, daysUntilRace }: HeaderProps) {
  return (
    <header className="text-center space-y-4">
      <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink animate-glow">
        PROJECT IRONMIND
      </h1>

      <div className="text-sm md:text-base text-gray-400 uppercase tracking-widest">
        365-Day Transformation Protocol
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
