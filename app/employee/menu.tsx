import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { MenuItemCard } from '@/components/MenuItemCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { VoteToggle } from '@/components/VoteToggle';
import { useTheme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import type { DailyMenuStatus } from '@/types';
import { computeStatus, formatCountdown, formatTime, MEAL_SLOT_LABEL } from '@/utils/menu';
import { useNow } from '@/utils/useNow';

const STATUS_BADGE: Record<DailyMenuStatus, { label: string; variant: 'success' | 'neutral' | 'danger' }> = {
  open: { label: 'Voting open', variant: 'success' },
  upcoming: { label: 'Opens soon', variant: 'neutral' },
  closed: { label: 'Voting closed', variant: 'danger' },
};

const SLOT_ICON: Record<string, string> = { breakfast: '🌅', lunch: '🍲', snack: '🥨', dinner: '🌙' };

export default function EmployeeMenu() {
  const { colors, spacing, fontSize } = useTheme();
  const { user } = useAuth();
  const { loading, dailyMenus, menuItems, votes, castVote, refetch } = useData();
  const now = useNow();

  const itemsById = useMemo(() => new Map(menuItems.map((i) => [i.id, i])), [menuItems]);

  const sortedMenus = useMemo(
    () => [...dailyMenus].sort((a, b) => new Date(a.votingOpensAt).getTime() - new Date(b.votingOpensAt).getTime()),
    [dailyMenus]
  );

  const myVoteFor = (dailyMenuId: string, menuItemId: string) =>
    votes.find((v) => v.userId === user?.id && v.dailyMenuId === dailyMenuId && v.menuItemId === menuItemId)?.choice;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Today's Menu" subtitle={`Hi ${user?.name?.split(' ')[0]}, cast your votes below`} />
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
      >
        {sortedMenus.length === 0 ? (
          <EmptyState title="No menu published yet" subtitle="Check back once the kitchen posts today's menu." />
        ) : (
          sortedMenus.map((menu) => {
            const status = computeStatus(menu, now);
            const statusMeta = STATUS_BADGE[status];
            const items = menu.itemIds.map((id) => itemsById.get(id)).filter((i): i is NonNullable<typeof i> => !!i);

            return (
              <View key={menu.id} style={{ marginBottom: spacing.xl }}>
                <View style={styles.sectionHeader}>
                  <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: '800' }}>
                    {SLOT_ICON[menu.mealSlot]} {MEAL_SLOT_LABEL[menu.mealSlot]}
                  </Text>
                  <Badge label={statusMeta.label} variant={statusMeta.variant} dot />
                </View>
                <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.md, fontWeight: '500' }}>
                  {status === 'open'
                    ? formatCountdown(menu.votingClosesAt, now)
                    : status === 'upcoming'
                      ? `Opens at ${formatTime(menu.votingOpensAt)}`
                      : `Closed at ${formatTime(menu.votingClosesAt)}`}
                </Text>

                {items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    action={
                      <VoteToggle
                        value={myVoteFor(menu.id, item.id)}
                        disabled={status !== 'open'}
                        onChange={(choice) =>
                          user && castVote({ userId: user.id, dailyMenuId: menu.id, menuItemId: item.id, choice })
                        }
                      />
                    }
                  />
                ))}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
});
