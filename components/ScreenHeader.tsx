import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, right }: ScreenHeaderProps) {
  const { colors, spacing, fontSize, letterSpacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.row,
        {
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.lg,
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.text,
            fontSize: fontSize.xxl,
            fontWeight: '800',
            letterSpacing: letterSpacing.tight,
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginTop: 3 }}>{subtitle}</Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
