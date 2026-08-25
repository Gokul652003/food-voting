import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/constants/theme';

type Variant = 'neutral' | 'primary' | 'success' | 'danger';

interface BadgeProps {
  label: string;
  variant?: Variant;
}

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const { colors, spacing, radius, fontSize } = useTheme();

  const palette: Record<Variant, { bg: string; fg: string }> = {
    neutral: { bg: colors.surfaceAlt, fg: colors.textMuted },
    primary: { bg: colors.primaryMuted, fg: colors.primary },
    success: { bg: colors.successMuted, fg: colors.success },
    danger: { bg: colors.dangerMuted, fg: colors.danger },
  };
  const p = palette[variant];

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: p.bg,
          borderRadius: radius.pill,
          paddingVertical: spacing.xs / 2,
          paddingHorizontal: spacing.sm,
        },
      ]}
    >
      <Text style={{ color: p.fg, fontSize: fontSize.xs, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
  },
});
