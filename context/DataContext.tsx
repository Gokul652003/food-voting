import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { dailyMenusApi, menuItemsApi, usersApi, votesApi } from '@/services/api';
import type { DailyMenu, MenuItem, Role, User, Vote } from '@/types';

interface DataContextValue {
  loading: boolean;
  users: User[];
  menuItems: MenuItem[];
  dailyMenus: DailyMenu[];
  votes: Vote[];
  refetch: () => Promise<void>;

  createUser: (input: { name: string; email: string; role: Role }) => Promise<User>;
  updateUser: (id: string, patch: Partial<Omit<User, 'id'>>) => Promise<User>;
  removeUser: (id: string) => Promise<void>;

  createMenuItem: (input: Omit<MenuItem, 'id'>) => Promise<MenuItem>;
  updateMenuItem: (id: string, patch: Partial<Omit<MenuItem, 'id'>>) => Promise<MenuItem>;
  removeMenuItem: (id: string) => Promise<void>;

  createDailyMenu: (input: Omit<DailyMenu, 'id'>) => Promise<DailyMenu>;
  updateDailyMenu: (id: string, patch: Partial<Omit<DailyMenu, 'id'>>) => Promise<DailyMenu>;

  castVote: (input: { userId: string; dailyMenuId: string; menuItemId: string; choice: boolean }) => Promise<Vote>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);

  const refetch = useCallback(async () => {
    const [u, mi, dm, v] = await Promise.all([
      usersApi.list(),
      menuItemsApi.list(),
      dailyMenusApi.list(),
      votesApi.list(),
    ]);
    setUsers(u);
    setMenuItems(mi);
    setDailyMenus(dm);
    setVotes(v);
  }, []);

  useEffect(() => {
    refetch().finally(() => setLoading(false));
  }, [refetch]);

  const createUser: DataContextValue['createUser'] = useCallback(async (input) => {
    const user = await usersApi.create(input);
    setUsers((prev) => [...prev, user]);
    return user;
  }, []);

  const updateUser: DataContextValue['updateUser'] = useCallback(async (id, patch) => {
    const user = await usersApi.update(id, patch);
    setUsers((prev) => prev.map((u) => (u.id === id ? user : u)));
    return user;
  }, []);

  const removeUser: DataContextValue['removeUser'] = useCallback(async (id) => {
    await usersApi.remove(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const createMenuItem: DataContextValue['createMenuItem'] = useCallback(async (input) => {
    const item = await menuItemsApi.create(input);
    setMenuItems((prev) => [...prev, item]);
    return item;
  }, []);

  const updateMenuItem: DataContextValue['updateMenuItem'] = useCallback(async (id, patch) => {
    const item = await menuItemsApi.update(id, patch);
    setMenuItems((prev) => prev.map((it) => (it.id === id ? item : it)));
    return item;
  }, []);

  const removeMenuItem: DataContextValue['removeMenuItem'] = useCallback(async (id) => {
    await menuItemsApi.remove(id);
    setMenuItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const createDailyMenu: DataContextValue['createDailyMenu'] = useCallback(async (input) => {
    const menu = await dailyMenusApi.create(input);
    setDailyMenus((prev) => [...prev, menu]);
    return menu;
  }, []);

  const updateDailyMenu: DataContextValue['updateDailyMenu'] = useCallback(async (id, patch) => {
    const menu = await dailyMenusApi.update(id, patch);
    setDailyMenus((prev) => prev.map((m) => (m.id === id ? menu : m)));
    return menu;
  }, []);

  const castVote: DataContextValue['castVote'] = useCallback(async (input) => {
    const vote = await votesApi.castVote(input);
    // votesApi.castVote itself may have updated an existing vote or inserted a
    // new one; the local cache has to mirror whichever it did.
    setVotes((prev) => {
      const exists = prev.some((v) => v.id === vote.id);
      return exists ? prev.map((v) => (v.id === vote.id ? vote : v)) : [...prev, vote];
    });
    return vote;
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({
      loading,
      users,
      menuItems,
      dailyMenus,
      votes,
      refetch,
      createUser,
      updateUser,
      removeUser,
      createMenuItem,
      updateMenuItem,
      removeMenuItem,
      createDailyMenu,
      updateDailyMenu,
      castVote,
    }),
    [loading, users, menuItems, dailyMenus, votes, refetch, createUser, updateUser, removeUser, createMenuItem, updateMenuItem, removeMenuItem, createDailyMenu, updateDailyMenu, castVote]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
