import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { ROLE_LABEL } from '@/utils/roles';

export function ProfileScreen() {
  const { colors, spacing, fontSize, radius, shadow, letterSpacing } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Profile" />
      <View style={{ padding: spacing.lg }}>
        <Card style={styles.card}>
          <View
            style={[
              styles.avatar,
              shadow.md,
              { backgroundColor: colors.primary, borderRadius: radius.pill, width: 72, height: 72 },
            ]}
          >
            <Text style={{ color: colors.primaryText, fontSize: fontSize.xl, fontWeight: '800' }}>{initials}</Text>
          </View>
          <Text
            style={{
              color: colors.text,
              fontSize: fontSize.xl,
              fontWeight: '800',
              letterSpacing: letterSpacing.tight,
              marginTop: spacing.md,
            }}
          >
            {user.name}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginTop: 2 }}>{user.email}</Text>
          <View style={{ marginTop: spacing.sm }}>
            <Badge label={ROLE_LABEL[user.role]} variant="primary" dot />
          </View>
        </Card>

        <Text
          style={{
            color: colors.textMuted,
            fontSize: fontSize.xs,
            fontWeight: '700',
            letterSpacing: letterSpacing.wider,
            textTransform: 'uppercase',
            marginTop: spacing.xl,
            marginBottom: spacing.sm,
            marginLeft: spacing.xs,
          }}
        >
          Account
        </Text>
        <Card style={{ padding: 0 }} elevated={false}>
          <View style={[styles.infoRow, { padding: spacing.lg }]}>
            <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>Role</Text>
            <Text style={{ color: colors.text, fontSize: fontSize.sm, fontWeight: '600' }}>{ROLE_LABEL[user.role]}</Text>
          </View>
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
          <View style={[styles.infoRow, { padding: spacing.lg }]}>
            <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>Email</Text>
            <Text style={{ color: colors.text, fontSize: fontSize.sm, fontWeight: '600' }}>{user.email}</Text>
          </View>
        </Card>

        <View style={{ marginTop: spacing.xl }}>
          <Button
            label="Log out"
            variant="secondary"
            fullWidth
            onPress={async () => {
              await logout();
              router.replace('/login');
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
