export type Role = 'admin' | 'chef' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type MealSlot = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: MealSlot;
  /** true = chef needs an exact headcount to prepare (limited/special dish)
   *  false = always-made staple (e.g. rice, dosa) — vote is just a popularity signal */
  isCountable: boolean;
}

export type DailyMenuStatus = 'upcoming' | 'open' | 'closed';

export interface DailyMenu {
  id: string;
  date: string; // ISO date, yyyy-mm-dd
  mealSlot: MealSlot;
  itemIds: string[];
  votingOpensAt: string; // ISO datetime
  votingClosesAt: string; // ISO datetime
  status: DailyMenuStatus;
}

export interface Vote {
  id: string;
  userId: string;
  dailyMenuId: string;
  menuItemId: string;
  choice: boolean;
  createdAt: string; // ISO datetime
}
