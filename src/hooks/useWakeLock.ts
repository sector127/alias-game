import { useEffect, useRef } from 'react';

/**
 * Custom React hook to manage the Screen Wake Lock API.
 * Keeps mobile and desktop displays awake during active gameplay rounds.
 * Automatically releases on unmount, state changes, or document visibility change.
 */
export function useWakeLock(enabled: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !('wakeLock' in navigator)) {
      return;
    }

    let isMounted = true;

    const requestWakeLock = async () => {
      try {
        if (document.visibilityState === 'visible' && !wakeLockRef.current) {
          const sentinel = await navigator.wakeLock.request('screen');
          if (isMounted) {
            wakeLockRef.current = sentinel;
            sentinel.addEventListener('release', () => {
              wakeLockRef.current = null;
            });
          } else {
            await sentinel.release();
          }
        }
      } catch {
        // Ignored if unsupported, battery saver mode active, or permission denied
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
        } catch {
          // Ignore
        }
        wakeLockRef.current = null;
      }
    };

    // Acquire lock initially
    requestWakeLock();

    // Re-acquire on visibility change if page becomes active again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) {
        requestWakeLock();
      } else {
        releaseWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, [enabled]);
}
