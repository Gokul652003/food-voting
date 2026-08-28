import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/constants/theme';

interface VoteToggleProps {
  value: boolean | undefined;
  onChange: (choice: boolean) => void;
  disabled?: boolean;
}

export function VoteToggle({ value, onChange, disabled }: VoteToggleProps) {
  const { colors, spacing, radius, fontSize } = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: colors.surfaceAlt,
          borderRadius: radius.pill,
          padding: spacing.xs / 2,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
      ]}
    >
      <Pressable
        disabled={disabled}
        onPress={() => onChange(true)}
        style={[
          styles.option,
          {
            borderRadius: radius.pill,
            paddingVertical: spacing.xs + 1,
            paddingHorizontal: spacing.md,
            backgroundColor: value === true ? colors.success : 'transparent',
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Text
          style={{
            color: value === true ? '#FFFFFF' : colors.textMuted,
            fontSize: fontSize.sm,
            fontWeight: '700',
          }}
        >
          {value === true ? '✓ Yes' : 'Yes'}
        </Text>
      </Pressable>
      <Pressable
        disabled={disabled}
        onPress={() => onChange(false)}
        style={[
          styles.option,
          {
            borderRadius: radius.pill,
            paddingVertical: spacing.xs + 1,
            paddingHorizontal: spacing.md,
            backgroundColor: value === false ? colors.danger : 'transparent',
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Text
          style={{
            color: value === false ? '#FFFFFF' : colors.textMuted,
            fontSize: fontSize.sm,
            fontWeight: '700',
          }}
        >
          {value === false ? '✕ No' : 'No'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  option: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
