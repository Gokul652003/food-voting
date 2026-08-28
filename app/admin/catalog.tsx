import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTheme } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import type { MealSlot, MenuItem } from '@/types';
import { MEAL_SLOT_ICON, MEAL_SLOT_LABEL } from '@/utils/menu';

const MEAL_SLOTS: MealSlot[] = ['breakfast', 'lunch', 'snack', 'dinner'];

interface Draft {
  id?: string;
  name: string;
  description: string;
  category: MealSlot;
  isCountable: boolean;
}

const BLANK_DRAFT: Draft = { name: '', description: '', category: 'lunch', isCountable: false };

export default function Catalog() {
  const { colors, spacing, radius, fontSize } = useTheme();
  const { menuItems, createMenuItem, updateMenuItem, removeMenuItem } = useData();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<MealSlot, MenuItem[]>();
    MEAL_SLOTS.forEach((s) => map.set(s, []));
    menuItems.forEach((item) => map.get(item.category)?.push(item));
    return map;
  }, [menuItems]);

  const startAdd = () => setDraft({ ...BLANK_DRAFT });
  const startEdit = (item: MenuItem) => setDraft({ ...item });
  const cancel = () => setDraft(null);

  const save = async () => {
    if (!draft || !draft.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: draft.name.trim(),
        description: draft.description.trim(),
        category: draft.category,
        isCountable: draft.isCountable,
      };
      if (draft.id) {
        await updateMenuItem(draft.id, payload);
      } else {
        await createMenuItem(payload);
      }
      setDraft(null);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (item: MenuItem) => {
    Alert.alert('Delete item', `Remove "${item.name}" from the catalog?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeMenuItem(item.id) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader
        title="Menu Catalog"
        subtitle="The master list chefs pick from"
        right={!draft ? <Button label="+ Add item" size="sm" onPress={startAdd} /> : undefined}
      />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        {draft ? (
          <Card style={{ marginBottom: spacing.xl }}>
            <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.md }}>
              {draft.id ? 'Edit item' : 'New item'}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginBottom: 4 }}>Name</Text>
            <TextInput
              value={draft.name}
              onChangeText={(name) => setDraft((d) => (d ? { ...d, name } : d))}
              placeholder="Item name"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                { borderColor: colors.border, backgroundColor: colors.surfaceAlt, color: colors.text, borderRadius: radius.sm },
              ]}
            />
            <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.sm, marginBottom: 4 }}>
              Description
            </Text>
            <TextInput
              value={draft.description}
              onChangeText={(description) => setDraft((d) => (d ? { ...d, description } : d))}
              placeholder="Short description"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                { borderColor: colors.border, backgroundColor: colors.surfaceAlt, color: colors.text, borderRadius: radius.sm },
              ]}
            />

            <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.md, marginBottom: spacing.xs }}>
              Meal slot
            </Text>
            <View style={styles.chipRow}>
              {MEAL_SLOTS.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setDraft((d) => (d ? { ...d, category: s } : d))}
                  style={[
                    styles.chip,
                    {
                      borderRadius: radius.pill,
                      borderColor: colors.border,
                      backgroundColor: draft.category === s ? colors.primary : colors.surfaceAlt,
                    },
                  ]}
                >
                  <Text style={{ color: draft.category === s ? colors.primaryText : colors.text, fontSize: fontSize.sm, fontWeight: '600' }}>
                    {MEAL_SLOT_LABEL[s]}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.md, marginBottom: spacing.xs }}>
              Does the chef need an exact headcount for this item?
            </Text>
            <View style={styles.chipRow}>
              <Pressable
                onPress={() => setDraft((d) => (d ? { ...d, isCountable: true } : d))}
                style={[
                  styles.chip,
                  {
                    borderRadius: radius.pill,
                    borderColor: colors.border,
                    backgroundColor: draft.isCountable ? colors.primary : colors.surfaceAlt,
                  },
                ]}
              >
                <Text style={{ color: draft.isCountable ? colors.primaryText : colors.text, fontSize: fontSize.sm, fontWeight: '600' }}>
                  Countable (limited dish)
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setDraft((d) => (d ? { ...d, isCountable: false } : d))}
                style={[
                  styles.chip,
                  {
                    borderRadius: radius.pill,
                    borderColor: colors.border,
                    backgroundColor: !draft.isCountable ? colors.primary : colors.surfaceAlt,
                  },
                ]}
              >
                <Text style={{ color: !draft.isCountable ? colors.primaryText : colors.text, fontSize: fontSize.sm, fontWeight: '600' }}>
                  Staple (always made)
                </Text>
              </Pressable>
            </View>

            <View style={styles.formActions}>
              <Button label="Cancel" variant="secondary" onPress={cancel} />
              <Button label="Save" onPress={save} loading={saving} disabled={!draft.name.trim()} />
            </View>
          </Card>
        ) : null}

        {menuItems.length === 0 && !draft ? (
          <EmptyState title="Catalog is empty" subtitle="Add your first menu item to get started." />
        ) : (
          MEAL_SLOTS.map((slot) => {
            const items = grouped.get(slot) ?? [];
            if (items.length === 0) return null;
            return (
              <View key={slot} style={{ marginBottom: spacing.lg }}>
                <View style={styles.slotHeaderRow}>
                  <Text style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: '800' }}>
                    {MEAL_SLOT_LABEL[slot]}
                  </Text>
                  <Badge label={String(items.length)} />
                </View>
                {items.map((item) => (
                  <Card key={item.id} style={{ marginBottom: spacing.sm }}>
                    <View style={styles.itemHeader}>
                      <View
                        style={[
                          styles.itemIcon,
                          { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, marginRight: spacing.md },
                        ]}
                      >
                        <Text style={{ fontSize: 18 }}>{MEAL_SLOT_ICON[item.category]}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.nameRow}>
                          <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '700' }}>{item.name}</Text>
                          <Badge label={item.isCountable ? 'Countable' : 'Staple'} variant={item.isCountable ? 'primary' : 'neutral'} />
                        </View>
                        {item.description ? (
                          <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginTop: 2 }}>{item.description}</Text>
                        ) : null}
                      </View>
                    </View>
                    <View style={styles.itemActions}>
                      <Button label="Edit" variant="secondary" onPress={() => startEdit(item)} />
                      <Button label="Delete" variant="danger" onPress={() => confirmDelete(item)} />
                    </View>
                  </Card>
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
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
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
  formActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  slotHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
  },
  itemIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
});
