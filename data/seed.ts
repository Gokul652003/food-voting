import type { DailyMenu, MenuItem, User, Vote } from '@/types';

// yyyy-mm-dd for a given Date, in local time.
function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function hoursFromNow(h: number): string {
  return new Date(Date.now() + h * 60 * 60 * 1000).toISOString();
}

export const SEED_USERS: User[] = [
  { id: 'u-admin', name: 'Priya Sharma', email: 'admin@company.com', role: 'admin' },
  { id: 'u-chef', name: 'Ramesh Iyer', email: 'chef@company.com', role: 'chef' },
  { id: 'u-emp', name: 'Arjun Nair', email: 'employee@company.com', role: 'employee' },
];

// Extra employees that only exist to give vote tallies something realistic to show —
// not selectable on the login screen.
export const SEED_GHOST_EMPLOYEE_IDS = [
  'u-emp-101',
  'u-emp-102',
  'u-emp-103',
  'u-emp-104',
  'u-emp-105',
  'u-emp-106',
  'u-emp-107',
  'u-emp-108',
  'u-emp-109',
  'u-emp-110',
];

export const SEED_MENU_ITEMS: MenuItem[] = [
  { id: 'mi-idli', name: 'Idli', description: 'Steamed rice cakes, served with chutney', category: 'breakfast', isCountable: false },
  { id: 'mi-dosa', name: 'Dosa', description: 'Crisp fermented rice & lentil crepe', category: 'breakfast', isCountable: false },
  { id: 'mi-omelette', name: 'Masala Omelette', description: 'Spiced egg omelette, made to order', category: 'breakfast', isCountable: true },
  { id: 'mi-poha', name: 'Poha', description: "Today's special flattened-rice breakfast", category: 'breakfast', isCountable: true },
  { id: 'mi-rice-sambar', name: 'Rice & Sambar', description: 'Steamed rice with lentil sambar', category: 'lunch', isCountable: false },
  { id: 'mi-veg-thali', name: 'Veg Thali', description: 'Everyday vegetarian thali', category: 'lunch', isCountable: false },
  { id: 'mi-biryani', name: 'Chicken Biryani', description: "Chef's special — limited quantity", category: 'lunch', isCountable: true },
  { id: 'mi-paneer', name: 'Paneer Butter Masala', description: 'Today\'s special paneer curry', category: 'lunch', isCountable: true },
  { id: 'mi-samosa', name: 'Samosa', description: 'Fried pastry with spiced potato filling', category: 'snack', isCountable: true },
  { id: 'mi-tea-coffee', name: 'Tea & Coffee', description: 'Always available', category: 'snack', isCountable: false },
  { id: 'mi-chapati', name: 'Chapati & Curry', description: 'Everyday chapati with mixed veg curry', category: 'dinner', isCountable: false },
  { id: 'mi-fried-rice', name: 'Veg Fried Rice', description: "Tonight's special", category: 'dinner', isCountable: true },
];

export function buildSeedDailyMenus(): DailyMenu[] {
  const today = isoDate(new Date());
  return [
    {
      id: 'dm-breakfast-today',
      date: today,
      mealSlot: 'breakfast',
      itemIds: ['mi-idli', 'mi-dosa', 'mi-omelette', 'mi-poha'],
      votingOpensAt: hoursFromNow(-10),
      votingClosesAt: hoursFromNow(-4),
      status: 'closed',
    },
    {
      id: 'dm-lunch-today',
      date: today,
      mealSlot: 'lunch',
      itemIds: ['mi-rice-sambar', 'mi-veg-thali', 'mi-biryani', 'mi-paneer'],
      votingOpensAt: hoursFromNow(-2),
      votingClosesAt: hoursFromNow(2),
      status: 'open',
    },
    {
      id: 'dm-dinner-today',
      date: today,
      mealSlot: 'dinner',
      itemIds: ['mi-chapati', 'mi-fried-rice'],
      votingOpensAt: hoursFromNow(4),
      votingClosesAt: hoursFromNow(9),
      status: 'upcoming',
    },
  ];
}

export function buildSeedVotes(): Vote[] {
  const votes: Vote[] = [];
  let n = 0;
  const cast = (userId: string, dailyMenuId: string, menuItemId: string, choice: boolean) => {
    n += 1;
    votes.push({
      id: `v-seed-${n}`,
      userId,
      dailyMenuId,
      menuItemId,
      choice,
      createdAt: new Date().toISOString(),
    });
  };

  // Breakfast (closed) — full history so the employee has something in "My Votes".
  const breakfastYes: Record<string, number> = { 'mi-idli': 7, 'mi-dosa': 6, 'mi-omelette': 3, 'mi-poha': 4 };
  SEED_GHOST_EMPLOYEE_IDS.forEach((id, i) => {
    Object.entries(breakfastYes).forEach(([itemId, threshold]) => {
      cast(id, 'dm-breakfast-today', itemId, i < threshold);
    });
  });
  cast('u-emp', 'dm-breakfast-today', 'mi-dosa', true);
  cast('u-emp', 'dm-breakfast-today', 'mi-omelette', false);

  // Lunch (open) — seed votes from ghost employees only, leave the demo
  // employee's votes empty so they can vote live during a walkthrough.
  const lunchYes: Record<string, number> = { 'mi-rice-sambar': 9, 'mi-veg-thali': 8, 'mi-biryani': 6, 'mi-paneer': 4 };
  SEED_GHOST_EMPLOYEE_IDS.forEach((id, i) => {
    Object.entries(lunchYes).forEach(([itemId, threshold]) => {
      cast(id, 'dm-lunch-today', itemId, i < threshold);
    });
  });

  return votes;
}
