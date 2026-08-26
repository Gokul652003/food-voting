import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import type { Role, User } from '@/types';
import { ROLE_LABEL } from '@/utils/roles';

const ROLES: Role[] = ['employee', 'chef', 'admin'];

interface Draft {
  id?: string;
  name: string;
  email: string;
  role: Role;
}

const BLANK_DRAFT: Draft = { name: '', email: '', role: 'employee' };

export default function Users() {
  const { colors, spacing, radius, fontSize } = useTheme();
  const { user: me } = useAuth();
  const { users, createUser, updateUser, removeUser } = useData();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const sortedUsers = useMemo(() => [...users].sort((a, b) => a.name.localeCompare(b.name)), [users]);

  const startAdd = () => setDraft({ ...BLANK_DRAFT });
  const startEdit = (u: User) => setDraft({ id: u.id, name: u.name, email: u.email, role: u.role });
  const cancel = () => setDraft(null);

  const save = async () => {
    if (!draft || !draft.name.trim() || !draft.email.trim()) return;
    setSaving(true);
    try {
      const payload = { name: draft.name.trim(), email: draft.email.trim(), role: draft.role };
      if (draft.id) {
        await updateUser(draft.id, payload);
      } else {
        await createUser(payload);
      }
      setDraft(null);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (u: User) => {
    Alert.alert('Remove staff member', `Remove ${u.name} (${ROLE_LABEL[u.role]})?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeUser(u.id) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title="Staff" subtitle="Employees, chefs & admins" right={!draft ? <Button label="+ Add" onPress={startAdd} /> : undefined} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        {draft ? (
          <Card style={{ marginBottom: spacing.xl }}>
            <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.sm }}>
              {draft.id ? 'Edit staff member' : 'New staff member'}
            </Text>
            <TextInput
              value={draft.name}
              onChangeText={(name) => setDraft((d) => (d ? { ...d, name } : d))}
              placeholder="Full name"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { borderColor: colors.border, color: colors.text, borderRadius: radius.sm }]}
            />
            <TextInput
              value={draft.email}
              onChangeText={(email) => setDraft((d) => (d ? { ...d, email } : d))}
              placeholder="email@company.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input, { borderColor: colors.border, color: colors.text, borderRadius: radius.sm, marginTop: spacing.sm }]}
            />

            <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.md, marginBottom: spacing.xs }}>Role</Text>
            <View style={styles.chipRow}>
              {ROLES.map((r) => (
                <Pressable
                  key={r}
                  onPress={() => setDraft((d) => (d ? { ...d, role: r } : d))}
                  style={[
                    styles.chip,
                    {
                      borderRadius: radius.pill,
                      borderColor: colors.border,
                      backgroundColor: draft.role === r ? colors.primary : colors.surfaceAlt,
                    },
                  ]}
                >
                  <Text style={{ color: draft.role === r ? colors.primaryText : colors.text, fontSize: fontSize.sm, fontWeight: '600' }}>
                    {ROLE_LABEL[r]}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.formActions}>
              <Button label="Cancel" variant="secondary" onPress={cancel} />
              <Button label="Save" onPress={save} loading={saving} disabled={!draft.name.trim() || !draft.email.trim()} />
            </View>
          </Card>
        ) : null}

        {sortedUsers.map((u) => (
          <Card key={u.id} style={{ marginBottom: spacing.sm }}>
            <View style={styles.row}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: colors.primaryMuted, borderRadius: radius.pill, marginRight: spacing.md },
                ]}
              >
                <Text style={{ color: colors.primary, fontSize: fontSize.sm, fontWeight: '800' }}>
                  {u.name
                    .split(' ')
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '700' }}>{u.name}</Text>
                  <Badge label={ROLE_LABEL[u.role]} variant="primary" />
                </View>
                <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginTop: 2 }}>{u.email}</Text>
              </View>
            </View>
            <View style={styles.itemActions}>
              <Button label="Edit" variant="secondary" onPress={() => startEdit(u)} />
              {u.id !== me?.id ? <Button label="Remove" variant="danger" onPress={() => confirmDelete(u)} /> : null}
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
});
