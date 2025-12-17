'use client';

import { motion } from 'framer-motion';
import { Calendar, Trophy } from 'lucide-react';

interface PhaseIndicatorProps {
  phaseKey: string;
  phaseName: string;
  phaseColor: string;
  weekNumber: number;
  dayName: string;
  daysToRace: number;
  isRecoveryWeek: boolean;
}

export default function PhaseIndicator({
  phaseKey,
  phaseName,
  phaseColor,
  weekNumber,
  dayName,
  daysToRace,
  isRecoveryWeek
}: PhaseIndicatorProps) {
  // Convert hex color to rgba for gradient
  const hexToRgba = (hex: string, alpha: number = 1) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return `rgba(99, 102, 241, ${alpha})`; // fallback to indigo
    return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
  };

  const getPhaseEmoji = (key: string) => {
    switch (key) {
      case 'TRANSITION': return '🌱';
      case 'FOUNDATION': return '🏗️';
      case 'BASE_1': return '📈';
      case 'BASE_2': return '💪';
      case 'BUILD_1': return '🔥';
      case 'BUILD_2': return '⚡';
      case 'PEAK': return '🎯';
      case 'TAPER': return '🎈';
      case 'RACE_WEEK': return '🏁';
      default: return '📅';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: `linear-gradient(135deg, ${hexToRgba(phaseColor, 0.15)} 0%, ${hexToRgba(phaseColor, 0.05)} 100%)`,
        borderColor: hexToRgba(phaseColor, 0.3),
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
      {/* Animated background pulse */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ backgroundColor: phaseColor }}
      />

      <div className="relative p-6 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          {/* Phase Info */}
          <div className="flex items-center gap-3">
            <div className="text-4xl">{getPhaseEmoji(phaseKey)}</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className="text-2xl font-bold"
                  style={{ color: phaseColor }}
                >
                  {phaseName.toUpperCase()}
                </h3>
                {isRecoveryWeek && (
                  <span
                    className="px-3 py-1 text-xs font-bold rounded-full backdrop-blur-xl"
                    style={{
                      backgroundColor: hexToRgba(phaseColor, 0.2),
                      color: phaseColor,
                      border: `1px solid ${hexToRgba(phaseColor, 0.4)}`
                    }}
                  >
                    RECOVERY WEEK
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-white/70">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Week {weekNumber}, {dayName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm">{daysToRace} days to race</span>
                </div>
              </div>
            </div>
          </div>

          {/* Phase Badge */}
          <div
            className="px-4 py-2 rounded-xl font-bold text-sm backdrop-blur-xl"
            style={{
              backgroundColor: hexToRgba(phaseColor, 0.2),
              color: phaseColor,
              border: `1px solid ${hexToRgba(phaseColor, 0.4)}`
            }}
          >
            {phaseKey.replace(/_/g, ' ')}
          </div>
        </div>

        {/* Recovery Week Message */}
        {isRecoveryWeek && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 pt-4 border-t"
            style={{ borderColor: hexToRgba(phaseColor, 0.2) }}
          >
            <p className="text-white/80 text-sm">
              💆‍♂️ This is a recovery week. Volume is reduced by 25%. Listen to your body and prioritize rest.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
