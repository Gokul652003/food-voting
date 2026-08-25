import { useEffect, useState } from 'react';

/** Re-renders the caller every `intervalMs`, so time-derived UI (countdowns,
 *  voting-window status) stays fresh without a manual refresh. */
export function useNow(intervalMs = 30000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
