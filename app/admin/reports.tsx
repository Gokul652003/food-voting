import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTheme } from '@/constants/theme';
import { useData } from '@/context/DataContext';

export default function Reports() {
  const { colors, spacing, radius, fontSize } = useTheme();
  const { users, menuItems, dailyMenus, votes } = useData();

  const stats = useMemo(() => {
    const staffCount = users.length;
    const catalogCount = menuItems.length;
    const countableCount = menuItems.filter((i) => i.isCountable).length;
    const votesCast = votes.length;
    return { staffCount, catalogCount, countableCount, votesCast };
  }, [users, menuItems, votes]);

  const popularity = useMemo(() => {
    const yesCountByItem = new Map<string, number>();
    votes.forEach((v) => {
      if (!v.choice) return;
      yesCountByItem.set(v.menuItemId, (yesCountByItem.get(v.menuItemId) ?? 0) + 1);
    });
    const rows = menuItems
      .map((item) => ({ item, count: yesCountByItem.get(item.id) ?? 0 }))
      .filter((r) => r.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
    const max = rows.length > 0 ? rows[0].count : 1;
    return { rows, max };
  }, [votes, menuItems]);

  const participation = useMemo(
    () =>
      [...dailyMenus]
        .sort((a, b) => new Date(b.votingOpensAt).getTime() - new Date(a.votingOpensAt).getTime())
        .slice(0, 6)
        .map((menu) => ({
          menu,
          total: votes.filter((v) => v.dailyMenuId === menu.id).length,
        })),
    [dailyMenus, votes]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Reports" subtitle="How the company is voting" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <View style={styles.statGrid}>
          {[
            { label: 'Staff', value: stats.staffCount, icon: '🧑‍🤝‍🧑' },
            { label: 'Catalog items', value: stats.catalogCount, icon: '📖' },
            { label: 'Countable items', value: stats.countableCount, icon: '🎯' },
            { label: 'Votes cast', value: stats.votesCast, icon: '🗳️' },
          ].map((s) => (
            <Card key={s.label} style={styles.statCard}>
              <View style={styles.statTop}>
                <Text style={{ color: colors.primary, fontSize: fontSize.xxl, fontWeight: '800' }}>{s.value}</Text>
                <Text style={{ fontSize: fontSize.lg }}>{s.icon}</Text>
              </View>
              <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginTop: 2 }}>{s.label}</Text>
            </Card>
          ))}
        </View>

        <Text
          style={{
            color: colors.textMuted,
            fontSize: fontSize.xs,
            fontWeight: '700',
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            marginTop: spacing.xl,
            marginBottom: spacing.sm,
            marginLeft: spacing.xs,
          }}
        >
          Most popular items
        </Text>
        {popularity.rows.length === 0 ? (
          <EmptyState title="No votes yet" subtitle="Popularity ranks will appear once employees start voting." />
        ) : (
          <Card>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendSwatch, { backgroundColor: colors.primary, borderRadius: radius.pill }]} />
                <Text style={{ color: colors.textMuted, fontSize: fontSize.xs }}>Countable</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendSwatch, { backgroundColor: colors.success, borderRadius: radius.pill }]} />
                <Text style={{ color: colors.textMuted, fontSize: fontSize.xs }}>Staple</Text>
              </View>
            </View>
            {popularity.rows.map(({ item, count }) => (
              <View key={item.id} style={{ marginBottom: spacing.md }}>
                <View style={styles.barLabelRow}>
                  <Text style={{ color: colors.text, fontSize: fontSize.sm, fontWeight: '600' }}>{item.name}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>{count}</Text>
                </View>
                <View style={[styles.barTrack, { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${Math.max(6, (count / popularity.max) * 100)}%`,
                        backgroundColor: item.isCountable ? colors.primary : colors.success,
                        borderRadius: radius.pill,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </Card>
        )}

        <Text
          style={{
            color: colors.textMuted,
            fontSize: fontSize.xs,
            fontWeight: '700',
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            marginTop: spacing.xl,
            marginBottom: spacing.sm,
            marginLeft: spacing.xs,
          }}
        >
          Recent participation
        </Text>
        {participation.length === 0 ? (
          <EmptyState title="No daily menus yet" />
        ) : (
          participation.map(({ menu, total }) => (
            <Card key={menu.id} style={{ marginBottom: spacing.sm }}>
              <View style={styles.participationRow}>
                <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '700', textTransform: 'capitalize' }}>
                  {menu.mealSlot} · {menu.date}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>{total} votes</Text>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSwatch: {
    width: 8,
    height: 8,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  barTrack: {
    height: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
  },
  participationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
