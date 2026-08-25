import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/constants/theme';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  const { colors, spacing, fontSize } = useTheme();
  return (
    <View style={[styles.base, { paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg }]}>
      <Text style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: '700', textAlign: 'center' }}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={{
            color: colors.textMuted,
            fontSize: fontSize.md,
            textAlign: 'center',
            marginTop: spacing.xs,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
