import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/constants/theme';

interface TallyDisplayProps {
  yesCount: number;
  noCount: number;
  isCountable: boolean;
}

export function TallyDisplay({ yesCount, noCount, isCountable }: TallyDisplayProps) {
  const { colors, spacing, fontSize } = useTheme();

  return (
    <View style={styles.row}>
      <View>
        <Text
          style={{
            fontSize: isCountable ? fontSize.xxl : fontSize.xl,
            fontWeight: '800',
            color: isCountable ? colors.primary : colors.text,
          }}
        >
          {yesCount}
        </Text>
        <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>
          {isCountable ? 'prepare for this many' : 'interested (always made)'}
        </Text>
      </View>
      <Text style={{ fontSize: fontSize.xs, color: colors.textMuted }}>{noCount} said no</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
});
