import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { roleHomePath } from '@/utils/roles';

const DEMO_ACCOUNTS = [
  { email: 'admin@company.com', label: 'Admin', description: 'Manage catalog & staff' },
  { email: 'chef@company.com', label: 'Chef', description: 'Run the kitchen & tallies' },
  { email: 'employee@company.com', label: 'Employee', description: 'Vote on the menu' },
];

export default function Login() {
  const { colors, spacing, radius, fontSize } = useTheme();
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingTop: spacing.xxl * 2, flexGrow: 1 }}>
        <Text style={{ fontSize: fontSize.xxl, fontWeight: '800', color: colors.text }}>🍛 Food Voting</Text>
        <Text style={{ fontSize: fontSize.md, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.xl }}>
          Vote on today's kitchen menu, or manage it if you run the show.
        </Text>

        <Card>
          <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.sm }}>
            Sign in
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@company.com"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text, borderRadius: radius.sm, marginBottom: spacing.sm },
            ]}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password (any value works in this demo)"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={[styles.input, { borderColor: colors.border, color: colors.text, borderRadius: radius.sm }]}
          />
          {error ? (
            <Text style={{ color: colors.danger, fontSize: fontSize.sm, marginTop: spacing.sm }}>{error}</Text>
          ) : null}
          <View style={{ marginTop: spacing.md }}>
            <Button
              label="Log in"
              onPress={() => submit(email)}
              loading={submitting || dataLoading}
              disabled={!email}
              fullWidth
            />
          </View>
        </Card>

        <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.xl, marginBottom: spacing.sm }}>
          Or jump in as a demo account
        </Text>
        {DEMO_ACCOUNTS.map((acc) => (
          <Card key={acc.email} style={{ marginBottom: spacing.sm, opacity: submitting || dataLoading ? 0.6 : 1 }}>
            <View style={styles.demoRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '700' }}>{acc.label}</Text>
                <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>{acc.description}</Text>
              </View>
              <Button
                label="Use"
                variant="secondary"
                onPress={() => submit(acc.email)}
                disabled={submitting || dataLoading}
              />
            </View>
          </Card>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
