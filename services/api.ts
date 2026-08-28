import { buildSeedDailyMenus, buildSeedVotes, SEED_MENU_ITEMS, SEED_USERS } from '@/data/seed';
import { readCollection, writeCollection } from '@/services/storage';
import type { DailyMenu, MenuItem, User, Vote } from '@/types';

/**
 * Mock service layer. Every function is async and shaped like it already
 * calls a REST endpoint (e.g. `menuItems.list()` ~= `GET /menu-items`), so
 * swapping the body for a `fetch()` call to the future NestJS API later
 * doesn't require touching any screen code.
 */

const LATENCY_MS = 250;
const delay = () => new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

let nextId = 0;
function makeId(prefix: string): string {
  nextId += 1;
  return `${prefix}-${Date.now()}-${nextId}`;
}

export const usersApi = {
  async list(): Promise<User[]> {
    await delay();
    return readCollection<User[]>('users', SEED_USERS);
  },
  async create(input: Omit<User, 'id'>): Promise<User> {
    await delay();
    const users = await readCollection<User[]>('users', SEED_USERS);
    const user: User = { id: makeId('u'), ...input };
    const next = [...users, user];
    await writeCollection('users', next);
    return user;
  },
  async update(id: string, patch: Partial<Omit<User, 'id'>>): Promise<User> {
    await delay();
    const users = await readCollection<User[]>('users', SEED_USERS);
    let updated: User | undefined;
    const next = users.map((u) => {
      if (u.id !== id) return u;
      updated = { ...u, ...patch };
      return updated;
    });
    if (!updated) throw new Error('User not found');
    await writeCollection('users', next);
    return updated;
  },
  async remove(id: string): Promise<void> {
    await delay();
    const users = await readCollection<User[]>('users', SEED_USERS);
    await writeCollection('users', users.filter((u) => u.id !== id));
  },
};

export const menuItemsApi = {
  async list(): Promise<MenuItem[]> {
    await delay();
    return readCollection<MenuItem[]>('menu-items', SEED_MENU_ITEMS);
  },
  async create(input: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    await delay();
    const items = await readCollection<MenuItem[]>('menu-items', SEED_MENU_ITEMS);
    const item: MenuItem = { id: makeId('mi'), ...input };
    await writeCollection('menu-items', [...items, item]);
    return item;
  },
  async update(id: string, patch: Partial<Omit<MenuItem, 'id'>>): Promise<MenuItem> {
    await delay();
    const items = await readCollection<MenuItem[]>('menu-items', SEED_MENU_ITEMS);
    let updated: MenuItem | undefined;
    const next = items.map((it) => {
      if (it.id !== id) return it;
      updated = { ...it, ...patch };
      return updated;
    });
    if (!updated) throw new Error('Menu item not found');
    await writeCollection('menu-items', next);
    return updated;
  },
  async remove(id: string): Promise<void> {
    await delay();
    const items = await readCollection<MenuItem[]>('menu-items', SEED_MENU_ITEMS);
    await writeCollection('menu-items', items.filter((it) => it.id !== id));
  },
};

export const dailyMenusApi = {
  async list(): Promise<DailyMenu[]> {
    await delay();
    return readCollection<DailyMenu[]>('daily-menus', buildSeedDailyMenus());
  },
  async create(input: Omit<DailyMenu, 'id'>): Promise<DailyMenu> {
    await delay();
    const menus = await readCollection<DailyMenu[]>('daily-menus', buildSeedDailyMenus());
    const menu: DailyMenu = { id: makeId('dm'), ...input };
    await writeCollection('daily-menus', [...menus, menu]);
    return menu;
  },
  async update(id: string, patch: Partial<Omit<DailyMenu, 'id'>>): Promise<DailyMenu> {
    await delay();
    const menus = await readCollection<DailyMenu[]>('daily-menus', buildSeedDailyMenus());
    let updated: DailyMenu | undefined;
    const next = menus.map((m) => {
      if (m.id !== id) return m;
      updated = { ...m, ...patch };
      return updated;
    });
    if (!updated) throw new Error('Daily menu not found');
    await writeCollection('daily-menus', next);
    return updated;
  },
};

export const votesApi = {
  async list(): Promise<Vote[]> {
    await delay();
    return readCollection<Vote[]>('votes', buildSeedVotes());
  },
  /** Upsert: one vote per (userId, dailyMenuId, menuItemId). */
  async castVote(input: Omit<Vote, 'id' | 'createdAt'>): Promise<Vote> {
    await delay();
    const votes = await readCollection<Vote[]>('votes', buildSeedVotes());
    const existingIndex = votes.findIndex(
      (v) => v.userId === input.userId && v.dailyMenuId === input.dailyMenuId && v.menuItemId === input.menuItemId
    );
    let result: Vote;
    let next: Vote[];
    if (existingIndex >= 0) {
      result = { ...votes[existingIndex], choice: input.choice, createdAt: new Date().toISOString() };
      next = votes.map((v, i) => (i === existingIndex ? result : v));
    } else {
      result = { id: makeId('v'), createdAt: new Date().toISOString(), ...input };
      next = [...votes, result];
    }
    await writeCollection('votes', next);
    return result;
  },
};
