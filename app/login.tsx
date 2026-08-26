import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { useTheme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { roleHomePath } from '@/utils/roles';

const DEMO_ACCOUNTS = [
  { email: 'admin@company.com', label: 'Admin', description: 'Manage catalog & staff', icon: '🛠️' },
  { email: 'chef@company.com', label: 'Chef', description: 'Run the kitchen & tallies', icon: '👨‍🍳' },
  { email: 'employee@company.com', label: 'Employee', description: 'Vote on the menu', icon: '🙋' },
];

export default function Login() {
  const { colors, spacing, radius, fontSize, shadow, letterSpacing } = useTheme();
  const { user, login } = useAuth();
  const { loading: dataLoading } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Redirect href={roleHomePath(user.role)} />;

  const submit = async (targetEmail: string) => {
    setError(null);
    setSubmitting(true);
    try {
      await login(targetEmail);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not log in.');
    } finally {
      setSubmitting(false);
    }
  };

  const busy = submitting || dataLoading;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingTop: spacing.xxl * 2, flexGrow: 1 }}>
        <View
          style={[
            styles.mark,
            shadow.md,
            { backgroundColor: colors.primary, borderRadius: radius.lg, marginBottom: spacing.lg },
          ]}
        >
          <Text style={{ fontSize: 26 }}>🍛</Text>
        </View>
        <Text style={{ fontSize: fontSize.xxxl, fontWeight: '800', color: colors.text, letterSpacing: letterSpacing.tight }}>
          Food Voting
        </Text>
        <Text style={{ fontSize: fontSize.md, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.xl }}>
          Vote on today's kitchen menu, or manage it if you run the show.
        </Text>

        <Card>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: fontSize.xs,
              fontWeight: '700',
              letterSpacing: letterSpacing.wider,
              textTransform: 'uppercase',
              marginBottom: spacing.md,
            }}
          >
            Sign in
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginBottom: 4 }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@company.com"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[
              styles.input,
              {
                borderColor: colors.border,
                backgroundColor: colors.surfaceAlt,
                color: colors.text,
                borderRadius: radius.sm,
                marginBottom: spacing.sm,
              },
            ]}
          />
          <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginBottom: 4 }}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Any value works in this demo"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={[
              styles.input,
              { borderColor: colors.border, backgroundColor: colors.surfaceAlt, color: colors.text, borderRadius: radius.sm },
            ]}
          />
          {error ? (
            <Text style={{ color: colors.danger, fontSize: fontSize.sm, marginTop: spacing.sm }}>{error}</Text>
          ) : null}
          <View style={{ marginTop: spacing.md }}>
            <Button label="Log in" onPress={() => submit(email)} loading={busy} disabled={!email} fullWidth />
          </View>
        </Card>

        <View style={styles.dividerRow}>
          <Divider style={{ flex: 1 }} />
          <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginHorizontal: spacing.sm }}>
            OR JUMP IN AS A DEMO ACCOUNT
          </Text>
          <Divider style={{ flex: 1 }} />
        </View>

        {DEMO_ACCOUNTS.map((acc) => (
          <Card key={acc.email} style={{ marginBottom: spacing.sm, opacity: busy ? 0.6 : 1 }}>
            <View style={styles.demoRow}>
              <View
                style={[
                  styles.demoIcon,
                  { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, marginRight: spacing.md },
                ]}
              >
                <Text style={{ fontSize: 20 }}>{acc.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '700' }}>{acc.label}</Text>
                <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>{acc.description}</Text>
              </View>
              <Button label="Use" variant="secondary" size="sm" onPress={() => submit(acc.email)} disabled={busy} />
            </View>
          </Card>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mark: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 12,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  demoIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
