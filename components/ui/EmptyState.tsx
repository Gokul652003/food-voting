import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/constants/theme';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

export function EmptyState({ title, subtitle, icon = '✨' }: EmptyStateProps) {
  const { colors, spacing, radius, fontSize } = useTheme();
  return (
    <View
      style={[
        styles.base,
        {
          paddingVertical: spacing.xxl,
          paddingHorizontal: spacing.xl,
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.border,
          borderRadius: radius.lg,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.pill },
        ]}
      >
        <Text style={{ fontSize: fontSize.xl }}>{icon}</Text>
      </View>
      <Text style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: '700', textAlign: 'center', marginTop: spacing.md }}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={{
            color: colors.textMuted,
            fontSize: fontSize.sm,
            textAlign: 'center',
            marginTop: spacing.xs,
            lineHeight: fontSize.sm * 1.4,
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
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
  },
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
