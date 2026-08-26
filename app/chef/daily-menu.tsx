import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTheme } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import type { DailyMenuStatus, MealSlot } from '@/types';
import { computeStatus, formatTime, MEAL_SLOT_LABEL } from '@/utils/menu';
import { useNow } from '@/utils/useNow';

const MEAL_SLOTS: MealSlot[] = ['breakfast', 'lunch', 'snack', 'dinner'];
const DURATIONS = [
  { label: '1 hour', hours: 1 },
  { label: '2 hours', hours: 2 },
  { label: '4 hours', hours: 4 },
];

const STATUS_BADGE: Record<DailyMenuStatus, { label: string; variant: 'success' | 'neutral' | 'danger' }> = {
  open: { label: 'Open', variant: 'success' },
  upcoming: { label: 'Upcoming', variant: 'neutral' },
  closed: { label: 'Closed', variant: 'danger' },
};

export default function DailyMenuBuilder() {
  const { colors, spacing, radius, fontSize } = useTheme();
  const { dailyMenus, menuItems, createDailyMenu, updateDailyMenu } = useData();
  const now = useNow();

  const [slot, setSlot] = useState<MealSlot>('lunch');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [durationHours, setDurationHours] = useState(2);
  const [publishing, setPublishing] = useState(false);

  const itemsForSlot = useMemo(() => menuItems.filter((i) => i.category === slot), [menuItems, slot]);

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const publish = async () => {
    if (selectedIds.size === 0) return;
    setPublishing(true);
    try {
      const opens = new Date();
      const closes = new Date(opens.getTime() + durationHours * 60 * 60 * 1000);
      await createDailyMenu({
        date: opens.toISOString().slice(0, 10),
        mealSlot: slot,
        itemIds: Array.from(selectedIds),
        votingOpensAt: opens.toISOString(),
        votingClosesAt: closes.toISOString(),
        status: 'open',
      });
      setSelectedIds(new Set());
    } finally {
      setPublishing(false);
    }
  };

  const closeEarly = (id: string) => updateDailyMenu(id, { votingClosesAt: new Date().toISOString(), status: 'closed' });

  const sortedMenus = useMemo(
    () => [...dailyMenus].sort((a, b) => new Date(b.votingOpensAt).getTime() - new Date(a.votingOpensAt).getTime()),
    [dailyMenus]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Daily Menu" subtitle="Publish what's on today, and manage voting" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <Card style={{ marginBottom: spacing.xl }}>
          <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.sm }}>
            Publish a new menu
          </Text>

          <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.xs }}>Meal slot</Text>
          <View style={styles.chipRow}>
            {MEAL_SLOTS.map((s) => (
              <Pressable
                key={s}
                onPress={() => {
                  setSlot(s);
                  setSelectedIds(new Set());
                }}
                style={[
                  styles.chip,
                  {
                    borderRadius: radius.pill,
                    borderColor: colors.border,
                    backgroundColor: slot === s ? colors.primary : colors.surfaceAlt,
                  },
                ]}
              >
                <Text style={{ color: slot === s ? colors.primaryText : colors.text, fontSize: fontSize.sm, fontWeight: '600' }}>
                  {MEAL_SLOT_LABEL[s]}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.md, marginBottom: spacing.xs }}>
            Items ({selectedIds.size} selected)
          </Text>
          {itemsForSlot.length === 0 ? (
            <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>
              No catalog items for {MEAL_SLOT_LABEL[slot]} yet — add some from the Admin Catalog tab.
            </Text>
          ) : (
            itemsForSlot.map((item) => {
              const selected = selectedIds.has(item.id);
              return (
                <Pressable
                  key={item.id}
                  onPress={() => toggleItem(item.id)}
                  style={[
                    styles.itemRow,
                    {
                      borderColor: selected ? colors.primary : colors.border,
                      backgroundColor: selected ? colors.primaryMuted : colors.surface,
                      borderRadius: radius.md,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderRadius: radius.sm,
                        borderColor: selected ? colors.primary : colors.border,
                        backgroundColor: selected ? colors.primary : 'transparent',
                      },
                    ]}
                  >
                    {selected ? <Text style={{ color: colors.primaryText, fontSize: fontSize.sm }}>✓</Text> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '600' }}>{item.name}</Text>
                  </View>
                  <Badge label={item.isCountable ? 'Countable' : 'Staple'} variant={item.isCountable ? 'primary' : 'neutral'} />
                </Pressable>
              );
            })
          )}

          <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.md, marginBottom: spacing.xs }}>
            Voting stays open for
          </Text>
          <View style={styles.chipRow}>
            {DURATIONS.map((d) => (
              <Pressable
                key={d.hours}
                onPress={() => setDurationHours(d.hours)}
                style={[
                  styles.chip,
                  {
                    borderRadius: radius.pill,
                    borderColor: colors.border,
                    backgroundColor: durationHours === d.hours ? colors.primary : colors.surfaceAlt,
                  },
                ]}
              >
                <Text
                  style={{
                    color: durationHours === d.hours ? colors.primaryText : colors.text,
                    fontSize: fontSize.sm,
                    fontWeight: '600',
                  }}
                >
                  {d.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={{ marginTop: spacing.lg }}>
            <Button
              label="Publish menu"
              onPress={publish}
              loading={publishing}
              disabled={selectedIds.size === 0}
              fullWidth
            />
          </View>
        </Card>

        <Text
          style={{
            color: colors.textMuted,
            fontSize: fontSize.xs,
            fontWeight: '700',
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            marginBottom: spacing.sm,
            marginLeft: spacing.xs,
          }}
        >
          Published menus
        </Text>
        {sortedMenus.length === 0 ? (
          <EmptyState title="Nothing published yet" />
        ) : (
          sortedMenus.map((menu) => {
            const status = computeStatus(menu, now);
            const statusMeta = STATUS_BADGE[status];
            return (
              <Card key={menu.id} style={{ marginBottom: spacing.sm }}>
                <View style={styles.menuRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '700' }}>
                      {MEAL_SLOT_LABEL[menu.mealSlot]} · {menu.itemIds.length} items
                    </Text>
                    <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginTop: 2 }}>
                      {formatTime(menu.votingOpensAt)} – {formatTime(menu.votingClosesAt)}
                    </Text>
                  </View>
                  <Badge label={statusMeta.label} variant={statusMeta.variant} dot />
                </View>
                {status === 'open' ? (
                  <View style={{ marginTop: spacing.sm }}>
                    <Button label="Close voting now" variant="secondary" onPress={() => closeEarly(menu.id)} />
                  </View>
                ) : null}
              </Card>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
