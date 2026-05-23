import { NotificationFeedbackType } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HabitIcon } from '@/components/habit-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  DEFAULT_COLOR,
  DEFAULT_ICON,
  HABIT_COLORS,
  HABIT_ICONS,
} from '@/constants/habits';
import { createHabit, useDb, useHabitStore } from '@/db';
import type { SymbolName } from '@/db/types';
import { useHaptic } from '@/hooks/use-haptic';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

export default function NewHabitScreen() {
  const router = useRouter();
  const db = useDb();
  const { bump } = useHabitStore();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { notification, selection } = useHaptic();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState<SymbolName>(DEFAULT_ICON);
  const [color, setColor] = useState<string>(DEFAULT_COLOR);
  const [saving, setSaving] = useState(false);

  const trimmed = name.trim();
  const canSave = trimmed.length > 0 && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    notification(NotificationFeedbackType.Success);
    await createHabit(db, { name: trimmed, icon, color });
    bump();
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const tapHaptic = () => {
    selection();
  };

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView edges={['bottom']} style={styles.flex}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}>
          <View
            style={[styles.topBar, { borderBottomColor: colors.separator }]}>
            <Pressable onPress={handleCancel} hitSlop={12}>
              <ThemedText style={[styles.cancel, { color: colors.iconMuted }]}>
                {t('common.cancel')}
              </ThemedText>
            </Pressable>
            <ThemedText type="defaultSemiBold" style={styles.title}>
              {t('newHabit.title')}
            </ThemedText>
            <Pressable onPress={handleSave} disabled={!canSave} hitSlop={12}>
              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.save,
                  { color: colors.accent },
                  !canSave && styles.saveDisabled,
                ]}>
                {t('common.save')}
              </ThemedText>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <ThemedText
                style={[styles.sectionLabel, { color: colors.secondaryText }]}>
                {t('newHabit.section.name')}
              </ThemedText>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t('newHabit.namePlaceholder')}
                placeholderTextColor={colors.placeholder}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.surfaceMuted,
                  },
                ]}
                returnKeyType="done"
                onSubmitEditing={handleSave}
                maxLength={40}
              />
            </View>

            <View style={styles.section}>
              <ThemedText
                style={[styles.sectionLabel, { color: colors.secondaryText }]}>
                {t('newHabit.section.icon')}
              </ThemedText>
              <View style={styles.iconGrid}>
                {HABIT_ICONS.map((symbol) => {
                  const selected = symbol === icon;
                  return (
                    <Pressable
                      key={symbol}
                      onPress={() => {
                        tapHaptic();
                        setIcon(symbol);
                      }}
                      style={[
                        styles.iconCell,
                        {
                          backgroundColor: selected
                            ? color + '33'
                            : colors.surfaceMuted,
                          borderColor: selected ? color : 'transparent',
                        },
                      ]}>
                      <HabitIcon
                        name={symbol}
                        size={20}
                        tintColor={selected ? color : colors.iconMuted}
                      />
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText
                style={[styles.sectionLabel, { color: colors.secondaryText }]}>
                {t('newHabit.section.color')}
              </ThemedText>
              <View style={styles.colorRow}>
                {HABIT_COLORS.map((c) => {
                  const selected = c === color;
                  return (
                    <Pressable
                      key={c}
                      onPress={() => {
                        tapHaptic();
                        setColor(c);
                      }}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: c },
                        selected && styles.colorSwatchSelected,
                      ]}>
                      {selected ? (
                        <HabitIcon
                          name={'checkmark' as SymbolName}
                          size={16}
                          tintColor="#fff"
                        />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText
                style={[styles.sectionLabel, { color: colors.secondaryText }]}>
                {t('newHabit.section.preview')}
              </ThemedText>
              <View
                style={[
                  styles.previewWrap,
                  { backgroundColor: colors.surfaceMuted },
                ]}>
                <View
                  style={[styles.previewIcon, { backgroundColor: color + '22' }]}>
                  <HabitIcon name={icon} size={28} tintColor={color} />
                </View>
                <View style={styles.previewBody}>
                  <ThemedText type="defaultSemiBold" numberOfLines={1}>
                    {trimmed.length > 0 ? trimmed : t('newHabit.previewPlaceholder')}
                  </ThemedText>
                </View>
                <View style={[styles.previewCheck, { borderColor: color }]} />
              </View>
            </View>

            <Pressable
              onPress={handleSave}
              disabled={!canSave}
              style={({ pressed }) => [
                styles.saveButton,
                {
                  backgroundColor: canSave
                    ? colors.accent
                    : colors.surfaceMutedStrong,
                },
                pressed && canSave && { opacity: 0.85 },
              ]}>
              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.saveButtonText,
                  { color: canSave ? '#fff' : colors.secondaryText },
                ]}>
                {t('newHabit.saveButton')}
              </ThemedText>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 17,
  },
  cancel: {
    fontSize: 16,
  },
  save: {
    fontSize: 16,
  },
  saveDisabled: {
    opacity: 0.35,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 24,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    fontSize: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  iconCell: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchSelected: {
    transform: [{ scale: 1.1 }],
  },
  previewWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBody: {
    flex: 1,
    minWidth: 0,
  },
  previewCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  saveButton: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 17,
  },
});
