import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTheme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { formatDate, formatTime, MEAL_SLOT_LABEL } from '@/utils/menu';

export default function MyVotes() {
  const { colors, spacing, fontSize, radius } = useTheme();
  const { user } = useAuth();
  const { loading, dailyMenus, menuItems, votes, refetch } = useData();

  const menusById = useMemo(() => new Map(dailyMenus.map((m) => [m.id, m])), [dailyMenus]);
  const itemsById = useMemo(() => new Map(menuItems.map((i) => [i.id, i])), [menuItems]);

  const myVotes = useMemo(
    () =>
      votes
        .filter((v) => v.userId === user?.id)
        .map((v) => ({ vote: v, menu: menusById.get(v.dailyMenuId), item: itemsById.get(v.menuItemId) }))
        .filter((row): row is { vote: typeof row.vote; menu: NonNullable<typeof row.menu>; item: NonNullable<typeof row.item> } => !!row.menu && !!row.item)
        .sort((a, b) => new Date(b.vote.createdAt).getTime() - new Date(a.vote.createdAt).getTime()),
    [votes, user, menusById, itemsById]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="My Votes" subtitle="Everything you've voted on" />
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
      >
        {myVotes.length === 0 ? (
          <EmptyState title="No votes yet" subtitle="Head to the Menu tab and vote on today's items." />
        ) : (
          myVotes.map(({ vote, menu, item }) => (
            <Card key={vote.id} style={{ marginBottom: spacing.sm }}>
              <View style={styles.row}>
                <View
                  style={[
                    styles.marker,
                    {
                      backgroundColor: vote.choice ? colors.successMuted : colors.dangerMuted,
                      borderRadius: radius.pill,
                      marginRight: spacing.md,
                    },
                  ]}
                >
                  <Text style={{ fontSize: fontSize.md }}>{vote.choice ? '✓' : '✕'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '700' }}>{item.name}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginTop: 2 }}>
                    {MEAL_SLOT_LABEL[menu.mealSlot]} · {formatDate(menu.date)} · voted {formatTime(vote.createdAt)}
                  </Text>
                </View>
                <Badge label={vote.choice ? "Yes, I'll eat" : 'No'} variant={vote.choice ? 'success' : 'danger'} />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marker: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
