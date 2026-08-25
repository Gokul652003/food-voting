import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/constants/theme';
import type { MenuItem } from '@/types';

interface MenuItemCardProps {
  item: MenuItem;
  action?: React.ReactNode;
}

export function MenuItemCard({ item, action }: MenuItemCardProps) {
  const { colors, spacing, fontSize } = useTheme();

  return (
    <Card style={{ marginBottom: spacing.md }}>
      <View style={styles.headerRow}>
        <View style={styles.titleColumn}>
          <View style={styles.nameRow}>
            <Text style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>{item.name}</Text>
            <Badge label={item.isCountable ? 'Countable' : 'Staple'} variant={item.isCountable ? 'primary' : 'neutral'} />
          </View>
          <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.xs / 2 }}>
            {item.description}
          </Text>
        </View>
      </View>
      {action ? <View style={{ marginTop: spacing.md }}>{action}</View> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleColumn: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
});
