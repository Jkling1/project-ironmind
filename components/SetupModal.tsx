'use client'

import { useState } from 'react'
import { format, addDays } from 'date-fns'
import { BaselineAssessment } from '@/types'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface SetupModalProps {
  onComplete: (startDate: string, raceDate: string, baseline: BaselineAssessment) => void
  onClose: () => void
}

export default function SetupModal({ onComplete, onClose }: SetupModalProps) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const defaultRaceDate = '2026-11-07' // Ironman Florida 2026

  const [step, setStep] = useState(1)
  const [startDate, setStartDate] = useState(today)
  const [raceDate, setRaceDate] = useState(defaultRaceDate)

  const [baseline, setBaseline] = useState<Partial<BaselineAssessment>>({
    weight_lbs: undefined,
    longest_run_miles: undefined,
    longest_bike_miles: undefined,
    swim_comfort: '',
    training_days_per_week: undefined,
    known_injuries: '',
    typical_sleep_hours: undefined,
    alcohol_drinks_per_week: undefined,
    meals_out_per_week: undefined,
    race_goal: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      const completeBaseline: BaselineAssessment = {
        weight_lbs: baseline.weight_lbs || 0,
        longest_run_miles: baseline.longest_run_miles || 0,
        longest_bike_miles: baseline.longest_bike_miles || 0,
        swim_comfort: baseline.swim_comfort || 'beginner',
        training_days_per_week: baseline.training_days_per_week || 0,
        known_injuries: baseline.known_injuries || 'none',
        typical_sleep_hours: baseline.typical_sleep_hours || 7,
        alcohol_drinks_per_week: baseline.alcohol_drinks_per_week || 0,
        meals_out_per_week: baseline.meals_out_per_week || 0,
        race_goal: baseline.race_goal || 'finish',
        assessment_date: today,
      }
      onComplete(startDate, raceDate, completeBaseline)
    }
  }

  const updateBaseline = (field: keyof BaselineAssessment, value: any) => {
    setBaseline({ ...baseline, [field]: value })
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-dark-card border border-neon-blue rounded-lg p-8 max-w-2xl w-full shadow-neon-blue my-8">
        <h2 className="text-3xl font-bold text-neon-blue text-glow-blue mb-2">
          {step === 1 && 'Welcome to PROJECT IRONMIND'}
          {step === 2 && 'Baseline Assessment'}
          {step === 3 && 'Lifestyle & Goals'}
        </h2>
        <p className="text-gray-400 mb-6">
          {step === 1 && 'One year. One goal. Become an Ironman.'}
          {step === 2 && 'Help me understand your current fitness level'}
          {step === 3 && 'Final questions about habits and goals'}
        </p>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                s <= step ? 'bg-neon-blue' : 'bg-dark-border'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Dates */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Training Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Ironman Florida Race Date
                </label>
                <input
                  type="date"
                  value={raceDate}
                  onChange={(e) => setRaceDate(e.target.value)}
                  min={startDate}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Default: Nov 7, 2026</p>
              </div>
            </>
          )}

          {/* Step 2: Fitness Baseline */}
          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Current weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={baseline.weight_lbs || ''}
                    onChange={(e) => updateBaseline('weight_lbs', Number(e.target.value))}
                    placeholder="175"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Typical sleep (hours/night)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={baseline.typical_sleep_hours || ''}
                    onChange={(e) => updateBaseline('typical_sleep_hours', Number(e.target.value))}
                    placeholder="7"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Longest comfortable run (miles)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={baseline.longest_run_miles || ''}
                    onChange={(e) => updateBaseline('longest_run_miles', Number(e.target.value))}
                    placeholder="3"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Longest comfortable bike (miles)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={baseline.longest_bike_miles || ''}
                    onChange={(e) => updateBaseline('longest_bike_miles', Number(e.target.value))}
                    placeholder="10"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Swim comfort level
                </label>
                <select
                  value={baseline.swim_comfort || ''}
                  onChange={(e) => updateBaseline('swim_comfort', e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Can't swim yet">Can't swim yet</option>
                  <option value="Beginner - learning basics">Beginner - learning basics</option>
                  <option value="Comfortable - 500m+">Comfortable - 500m+</option>
                  <option value="Strong - 1000m+">Strong - 1000m+</option>
                  <option value="Experienced - 2000m+">Experienced - 2000m+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Training days per week (realistically)
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={baseline.training_days_per_week || ''}
                  onChange={(e) => updateBaseline('training_days_per_week', Number(e.target.value))}
                  placeholder="4"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Known injuries or limiters
                </label>
                <input
                  type="text"
                  value={baseline.known_injuries || ''}
                  onChange={(e) => updateBaseline('known_injuries', e.target.value)}
                  placeholder="e.g., bad knee, tight hamstrings, or 'none'"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue"
                />
              </div>
            </>
          )}

          {/* Step 3: Lifestyle & Goals */}
          {step === 3 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Alcohol (drinks/week)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={baseline.alcohol_drinks_per_week || ''}
                    onChange={(e) => updateBaseline('alcohol_drinks_per_week', Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Be honest, no judgment</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Meals out/week
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={baseline.meals_out_per_week || ''}
                    onChange={(e) => updateBaseline('meals_out_per_week', Number(e.target.value))}
                    placeholder="3"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Restaurants/takeout</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Race Goal
                </label>
                <select
                  value={baseline.race_goal || ''}
                  onChange={(e) => updateBaseline('race_goal', e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:outline-none focus:border-neon-blue"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Just finish - complete the distance">Just finish - complete the distance</option>
                  <option value="Finish strong - under 14 hours">Finish strong - under 14 hours</option>
                  <option value="Competitive - under 12 hours">Competitive - under 12 hours</option>
                  <option value="Age group podium - under 11 hours">Age group podium - under 11 hours</option>
                </select>
              </div>

              <div className="bg-neon-blue/10 border border-neon-blue rounded-lg p-4">
                <h3 className="text-sm font-bold text-neon-blue mb-2">Your Baseline Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                  <div>Weight: {baseline.weight_lbs || 0} lbs</div>
                  <div>Sleep: {baseline.typical_sleep_hours || 0} hrs/night</div>
                  <div>Run: {baseline.longest_run_miles || 0} mi</div>
                  <div>Bike: {baseline.longest_bike_miles || 0} mi</div>
                  <div>Swim: {baseline.swim_comfort || 'N/A'}</div>
                  <div>Training: {baseline.training_days_per_week || 0} days/week</div>
                  <div>Alcohol: {baseline.alcohol_drinks_per_week || 0}/week</div>
                  <div>Meals out: {baseline.meals_out_per_week || 0}/week</div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 bg-dark-bg hover:bg-dark-border border border-dark-border text-gray-400 font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue text-neon-blue font-bold py-3 px-6 rounded-lg transition-all hover:shadow-neon-blue flex items-center justify-center gap-2"
            >
              {step < 3 ? (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                'Begin Transformation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
