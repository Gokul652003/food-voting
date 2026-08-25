import type { DailyMenu, DailyMenuStatus } from '@/types';

/** Live status derived from the voting window, so it's always correct even
 *  though the stored `status` field only reflects the value at creation time. */
export function computeStatus(menu: DailyMenu, now: Date = new Date()): DailyMenuStatus {
  const opens = new Date(menu.votingOpensAt).getTime();
  const closes = new Date(menu.votingClosesAt).getTime();
  const t = now.getTime();
  if (t < opens) return 'upcoming';
  if (t <= closes) return 'open';
  return 'closed';
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatCountdown(closesAtIso: string, now: Date = new Date()): string {
  const ms = new Date(closesAtIso).getTime() - now.getTime();
  if (ms <= 0) return 'Voting closed';
  const totalMinutes = Math.ceil(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `Closes in ${hours}h ${minutes}m`;
  return `Closes in ${minutes}m`;
}

export const MEAL_SLOT_LABEL: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Snack',
  dinner: 'Dinner',
};
