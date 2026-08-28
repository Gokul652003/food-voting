import React from 'react';
import { ColorValue, StyleSheet, Text, View } from 'react-native';

import { radius } from '@/constants/theme';

export function tabIcon(emoji: string) {
  return ({ focused, color }: { focused: boolean; color: ColorValue }) => (
    <View
      style={[
        styles.wrap,
        // react-navigation always passes tabBarActive/InactiveTintColor through as a
        // hex string, so appending a hex alpha suffix here is safe despite the wider
        // ColorValue type (which also covers platform color objects and numbers).
        { backgroundColor: focused ? `${color as string}1A` : 'transparent', borderRadius: radius.md },
      ]}
    >
      <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.55, transform: [{ scale: focused ? 1.05 : 1 }] }}>
        {emoji}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 34,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
