'use client';

import { useState, useEffect } from 'react';

export function useOfflineDetector() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsOnline(navigator.onLine);

    function handleOnline() {
      setIsOnline(true);
      setWasOffline(true);
      // Auto-hide the "back online" message after 3 seconds
      setTimeout(() => setWasOffline(false), 3000);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
}

// Offline Banner Component
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineBanner() {
  const { isOnline, wasOffline } = useOfflineDetector();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-yellow-500/90 backdrop-blur-xl border-b border-yellow-400 py-3 px-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <WifiOff className="w-5 h-5 text-yellow-900" />
            <span className="text-yellow-900 font-semibold">
              You're offline. Some features may be unavailable.
            </span>
          </div>
        </motion.div>
      )}
      {wasOffline && isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-green-500/90 backdrop-blur-xl border-b border-green-400 py-3 px-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Wifi className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">
              You're back online!
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
