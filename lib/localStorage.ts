// Local storage utilities for offline support and data persistence

const STORAGE_PREFIX = 'ironmind_';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export interface CachedData<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Generic local storage helpers
export function setItem<T>(key: string, value: T, ttl?: number): void {
  try {
    const item: CachedData<T> = {
      data: value,
      timestamp: Date.now(),
      expiresAt: ttl ? Date.now() + ttl : Date.now() + CACHE_DURATION,
    };
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(item));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}

export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (!item) return null;

    const cached: CachedData<T> = JSON.parse(item);

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return null;
    }

    return cached.data;
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
    return null;
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
}

export function clearAll(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
}

// Specific storage helpers for Project IronMind

// Cache daily protocol
export function cacheDailyProtocol(date: string, protocol: any): void {
  setItem(`protocol_${date}`, protocol);
}

export function getCachedDailyProtocol(date: string): any | null {
  return getItem(`protocol_${date}`);
}

// Save draft session data (for recovery if browser closes)
export function saveDraftSession(sessionId: number, draft: any): void {
  setItem(`draft_session_${sessionId}`, draft, 1000 * 60 * 60 * 24); // 24 hour TTL
}

export function getDraftSession(sessionId: number): any | null {
  return getItem(`draft_session_${sessionId}`);
}

export function clearDraftSession(sessionId: number): void {
  removeItem(`draft_session_${sessionId}`);
}

// Save draft check-in data
export function saveDraftCheckIn(date: string, draft: any): void {
  setItem(`draft_checkin_${date}`, draft, 1000 * 60 * 60 * 24); // 24 hour TTL
}

export function getDraftCheckIn(date: string): any | null {
  return getItem(`draft_checkin_${date}`);
}

export function clearDraftCheckIn(date: string): void {
  removeItem(`draft_checkin_${date}`);
}

// Offline queue for mutations
interface QueuedMutation {
  id: string;
  type: 'session_complete' | 'checkin' | 'progress_snapshot';
  url: string;
  method: string;
  body: any;
  timestamp: number;
}

export function queueOfflineMutation(mutation: Omit<QueuedMutation, 'id' | 'timestamp'>): void {
  const queue = getItem<QueuedMutation[]>('offline_queue') || [];
  const newMutation: QueuedMutation = {
    ...mutation,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  queue.push(newMutation);
  setItem('offline_queue', queue, 1000 * 60 * 60 * 24 * 7); // 7 day TTL
}

export function getOfflineQueue(): QueuedMutation[] {
  return getItem<QueuedMutation[]>('offline_queue') || [];
}

export function removeFromOfflineQueue(id: string): void {
  const queue = getOfflineQueue();
  const updated = queue.filter((m) => m.id !== id);
  setItem('offline_queue', updated);
}

export function clearOfflineQueue(): void {
  removeItem('offline_queue');
}

// Process offline queue when back online
export async function processOfflineQueue(): Promise<{ success: number; failed: number }> {
  const queue = getOfflineQueue();
  let success = 0;
  let failed = 0;

  for (const mutation of queue) {
    try {
      const response = await fetch(mutation.url, {
        method: mutation.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mutation.body),
      });

      if (response.ok) {
        removeFromOfflineQueue(mutation.id);
        success++;
      } else {
        failed++;
      }
    } catch (error) {
      failed++;
      console.error('Failed to process queued mutation:', error);
    }
  }

  return { success, failed };
}

// User preferences
export interface UserPreferences {
  theme?: 'dark' | 'light';
  soundEnabled?: boolean;
  notificationsEnabled?: boolean;
  defaultView?: 'today' | 'progress' | 'mission-control';
  weekStartsOn?: 'sunday' | 'monday';
}

export function saveUserPreferences(prefs: UserPreferences): void {
  const existing = getUserPreferences();
  setItem('user_preferences', { ...existing, ...prefs }, Infinity);
}

export function getUserPreferences(): UserPreferences {
  return getItem<UserPreferences>('user_preferences') || {};
}

// Last sync timestamp
export function setLastSync(timestamp: number = Date.now()): void {
  setItem('last_sync', timestamp, Infinity);
}

export function getLastSync(): number | null {
  return getItem<number>('last_sync');
}

// Export/import data
export function exportUserData(): string {
  const data: Record<string, any> = {};
  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    if (key.startsWith(STORAGE_PREFIX)) {
      data[key] = localStorage.getItem(key);
    }
  });

  return JSON.stringify(data, null, 2);
}

export function importUserData(jsonData: string): void {
  try {
    const data = JSON.parse(jsonData);
    Object.keys(data).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.setItem(key, data[key]);
      }
    });
  } catch (error) {
    console.error('Failed to import user data:', error);
    throw new Error('Invalid data format');
  }
}
