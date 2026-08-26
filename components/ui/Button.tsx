import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({ label, onPress, variant = 'primary', size = 'md', disabled, loading, fullWidth }: ButtonProps) {
  const { colors, spacing, radius, fontSize, shadow } = useTheme();

  const palette: Record<Variant, { bg: string; fg: string; border?: string; elevated?: boolean }> = {
    primary: { bg: colors.primary, fg: colors.primaryText, elevated: true },
    secondary: { bg: colors.surface, fg: colors.text, border: colors.border },
    ghost: { bg: 'transparent', fg: colors.primary },
    danger: { bg: colors.dangerMuted, fg: colors.danger },
  };
  const p = palette[variant];
  const isDisabled = disabled || loading;
  const compact = size === 'sm';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        p.elevated && !isDisabled ? shadow.sm : null,
        {
          backgroundColor: p.bg,
          borderColor: p.border ?? 'transparent',
          borderWidth: p.border ? StyleSheet.hairlineWidth : 0,
          paddingVertical: compact ? spacing.xs + 2 : spacing.sm + 3,
          paddingHorizontal: compact ? spacing.md : spacing.lg,
          borderRadius: radius.md,
          opacity: isDisabled ? 0.45 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed && !isDisabled ? 0.98 : 1 }],
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
      ]}
    >
      <View style={styles.content}>
        {loading ? <ActivityIndicator size="small" color={p.fg} style={{ marginRight: spacing.sm }} /> : null}
        <Text
          style={{
            color: p.fg,
            fontSize: compact ? fontSize.sm : fontSize.md,
            fontWeight: '700',
            letterSpacing: 0.1,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
