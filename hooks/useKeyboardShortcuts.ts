'use client';

import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = !shortcut.ctrl || event.ctrlKey || event.metaKey;
        const shiftMatches = !shortcut.shift || event.shiftKey;
        const altMatches = !shortcut.alt || event.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          // Don't override shortcuts with required modifiers that aren't pressed
          if (shortcut.ctrl && !event.ctrlKey && !event.metaKey) continue;
          if (shortcut.shift && !event.shiftKey) continue;
          if (shortcut.alt && !event.altKey) continue;

          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Common shortcuts for Project IronMind
export const COMMON_SHORTCUTS: Record<string, Omit<KeyboardShortcut, 'callback'>> = {
  OPEN_TODAY: {
    key: 't',
    ctrl: true,
    description: 'Open Today Dashboard',
  },
  OPEN_PROGRESS: {
    key: 'p',
    ctrl: true,
    description: 'Open Progress & Analytics',
  },
  OPEN_CHECKIN: {
    key: 'c',
    ctrl: true,
    description: 'Open Daily Check-In',
  },
  LOG_SESSION: {
    key: 'l',
    ctrl: true,
    description: 'Log Session',
  },
  HELP: {
    key: '?',
    shift: true,
    description: 'Show Keyboard Shortcuts',
  },
  ESCAPE: {
    key: 'Escape',
    description: 'Close Modal',
  },
};

// Keyboard shortcut helper display
export function KeyboardShortcutHelp({
  shortcuts,
  onClose,
}: {
  shortcuts: KeyboardShortcut[];
  onClose: () => void;
}) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  function formatShortcut(shortcut: KeyboardShortcut) {
    const parts: string[] = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.alt) parts.push('Alt');
    parts.push(shortcut.key.toUpperCase());
    return parts.join(' + ');
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6">Keyboard Shortcuts</h2>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
            >
              <span className="text-white/70 text-sm">{shortcut.description}</span>
              <kbd className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-xs font-mono">
                {formatShortcut(shortcut)}
              </kbd>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-colors"
        >
          Close (Esc)
        </button>
      </div>
    </div>
  );
}
