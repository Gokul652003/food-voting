import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/constants/theme';

export function Splash() {
  const { colors, spacing, fontSize, radius, letterSpacing } = useTheme();
  return (
    <View style={[styles.base, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.mark,
          { backgroundColor: colors.primaryMuted, borderRadius: radius.xl, marginBottom: spacing.lg },
        ]}
      >
        <Text style={{ fontSize: 28 }}>🍛</Text>
      </View>
      <Text
        style={{
          color: colors.text,
          fontSize: fontSize.lg,
          fontWeight: '800',
          letterSpacing: letterSpacing.tight,
          marginBottom: spacing.lg,
        }}
      >
        Food Voting
      </Text>
      <ActivityIndicator size="small" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
