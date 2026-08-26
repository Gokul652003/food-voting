import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/constants/theme';

interface TallyDisplayProps {
  yesCount: number;
  noCount: number;
  isCountable: boolean;
}

export function TallyDisplay({ yesCount, noCount, isCountable }: TallyDisplayProps) {
  const { colors, spacing, radius, fontSize } = useTheme();
  const total = yesCount + noCount;
  const yesShare = total > 0 ? yesCount / total : 0;

  return (
    <View>
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
      {total > 0 ? (
        <View
          style={[
            styles.track,
            { backgroundColor: colors.dangerMuted, borderRadius: radius.pill, marginTop: spacing.sm },
          ]}
        >
          <View
            style={[
              styles.fill,
              {
                width: `${Math.round(yesShare * 100)}%`,
                backgroundColor: colors.success,
                borderRadius: radius.pill,
              },
            ]}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  track: {
    height: 6,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
  },
});
