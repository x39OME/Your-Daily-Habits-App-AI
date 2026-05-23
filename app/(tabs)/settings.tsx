import { NotificationFeedbackType } from 'expo-haptics';
import {
  Alert,
  BackHandler,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CosmicBg } from '@/components/cosmic-bg';
import { HabitIcon } from '@/components/habit-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Language, TranslationKey } from '@/constants/translations';
import type { SymbolName } from '@/db/types';
import { useHapticPreference } from '@/hooks/haptic-preference';
import { useLanguagePreference } from '@/hooks/language-preference';
import { useHaptic } from '@/hooks/use-haptic';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { type ThemeMode, useThemePreference } from '@/hooks/theme-preference';


type ThemeOption = {
  value: ThemeMode;
  labelKey: TranslationKey;
  descKey: TranslationKey;
  icon: SymbolName;
};

type LanguageOption = {
  value: Language;
  labelKey: TranslationKey;
  descKey: TranslationKey;
  badge: string;
};

type LegalItem = {
  id: string;
  labelKey: TranslationKey;
  descKey: TranslationKey;
  icon: SymbolName;
};

const THEME_OPTIONS: ThemeOption[] = [
  {
    value: 'system',
    labelKey: 'settings.appearance.system',
    descKey: 'settings.appearance.system.desc',
    icon: 'iphone.gen3' as SymbolName,
  },
  {
    value: 'light',
    labelKey: 'settings.appearance.light',
    descKey: 'settings.appearance.light.desc',
    icon: 'sun.max' as SymbolName,
  },
  {
    value: 'dark',
    labelKey: 'settings.appearance.dark',
    descKey: 'settings.appearance.dark.desc',
    icon: 'moon.fill' as SymbolName,
  },
];

const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    value: 'en',
    labelKey: 'settings.language.en',
    descKey: 'settings.language.en.desc',
    badge: 'EN',
  },
  {
    value: 'ar',
    labelKey: 'settings.language.ar',
    descKey: 'settings.language.ar.desc',
    badge: 'AR',
  },
];

const LEGAL_ITEMS: LegalItem[] = [
  {
    id: 'terms',
    labelKey: 'settings.legal.terms',
    descKey: 'settings.legal.terms.desc',
    icon: 'character.book.closed' as SymbolName,
  },
  {
    id: 'privacy',
    labelKey: 'settings.legal.privacy',
    descKey: 'settings.legal.privacy.desc',
    icon: 'hand.raised.fill' as SymbolName,
  },
  {
    id: 'security',
    labelKey: 'settings.legal.security',
    descKey: 'settings.legal.security.desc',
    icon: 'checkmark.shield.fill' as SymbolName,
  },
];

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { mode, setMode } = useThemePreference();
  const { language, setLanguage } = useLanguagePreference();
  const { hapticsEnabled, setHapticsEnabled } = useHapticPreference();
  const { selection, notification } = useHaptic();

  const handleSelectTheme = (next: ThemeMode) => {
    selection();
    setMode(next);
  };

  const handleSelectLanguage = (next: Language) => {
    selection();
    setLanguage(next);
  };

  const handleVibrationToggle = (value: boolean) => {
    setHapticsEnabled(value);
  };

  const handleLegalItem = () => {
    selection();
    Alert.alert(t('settings.legal.comingSoon'), t('settings.legal.comingSoonBody'), [
      { text: 'OK' },
    ]);
  };

  const handleExit = () => {
    notification(NotificationFeedbackType.Warning);
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    } else {
      Alert.alert(t('settings.exitIosTitle'), t('settings.exitIosBody'), [
        { text: t('common.cancel'), style: 'cancel' },
      ]);
    }
  };

  return (
    <ThemedView style={styles.flex}>
      <CosmicBg />
      <SafeAreaView edges={['top']} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}>

          {/* ── Section title ── */}
          <View style={styles.headerText}>
            <ThemedText style={[styles.subtle, { color: colors.secondaryText }]}>
              {t('settings.subtitle')}
            </ThemedText>
            <ThemedText type="title">{t('settings.title')}</ThemedText>
          </View>

          {/* ── Appearance ── */}
          <ThemedText style={[styles.sectionHeader, { color: colors.secondaryText }]}>
            {t('settings.appearance')}
          </ThemedText>
          <View style={[styles.group, { backgroundColor: colors.surface }]}>
            {THEME_OPTIONS.map((option, idx) => {
              const selected = mode === option.value;
              const isLast = idx === THEME_OPTIONS.length - 1;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleSelectTheme(option.value)}
                  style={({ pressed }) => [
                    styles.row,
                    !isLast && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: colors.separator,
                    },
                    pressed && { opacity: 0.6 },
                  ]}>
                  <View style={[styles.rowIcon, { backgroundColor: colors.brandSoft }]}>
                    <HabitIcon name={option.icon} size={20} tintColor={colors.brand} />
                  </View>
                  <View style={styles.rowBody}>
                    <ThemedText type="defaultSemiBold" style={styles.rowLabel}>
                      {t(option.labelKey)}
                    </ThemedText>
                    <ThemedText style={[styles.rowDescription, { color: colors.secondaryText }]}>
                      {t(option.descKey)}
                    </ThemedText>
                  </View>
                  {selected ? (
                    <HabitIcon
                      name={'checkmark' as SymbolName}
                      size={18}
                      tintColor={colors.brand}
                    />
                  ) : (
                    <View style={styles.checkmarkPlaceholder} />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* ── Language ── */}
          <ThemedText style={[styles.sectionHeader, { color: colors.secondaryText }]}>
            {t('settings.language')}
          </ThemedText>
          <View style={[styles.group, { backgroundColor: colors.surface }]}>
            {LANGUAGE_OPTIONS.map((option, idx) => {
              const selected = language === option.value;
              const isLast = idx === LANGUAGE_OPTIONS.length - 1;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleSelectLanguage(option.value)}
                  style={({ pressed }) => [
                    styles.row,
                    !isLast && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: colors.separator,
                    },
                    pressed && { opacity: 0.6 },
                  ]}>
                  <View style={[styles.rowIcon, { backgroundColor: colors.brandSoft }]}>
                    <ThemedText
                      type="defaultSemiBold"
                      style={[styles.flagText, { color: colors.brand }]}>
                      {option.badge}
                    </ThemedText>
                  </View>
                  <View style={styles.rowBody}>
                    <ThemedText type="defaultSemiBold" style={styles.rowLabel}>
                      {t(option.labelKey)}
                    </ThemedText>
                    <ThemedText style={[styles.rowDescription, { color: colors.secondaryText }]}>
                      {t(option.descKey)}
                    </ThemedText>
                  </View>
                  {selected ? (
                    <HabitIcon
                      name={'checkmark' as SymbolName}
                      size={18}
                      tintColor={colors.brand}
                    />
                  ) : (
                    <View style={styles.checkmarkPlaceholder} />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* ── Preferences ── */}
          <ThemedText style={[styles.sectionHeader, { color: colors.secondaryText }]}>
            {t('settings.preferences')}
          </ThemedText>
          <View style={[styles.group, { backgroundColor: colors.surface }]}>
            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: colors.brandSoft }]}>
                <HabitIcon
                  name={'waveform' as SymbolName}
                  size={20}
                  tintColor={colors.brand}
                />
              </View>
              <View style={styles.rowBody}>
                <ThemedText type="defaultSemiBold" style={styles.rowLabel}>
                  {t('settings.vibration')}
                </ThemedText>
                <ThemedText style={[styles.rowDescription, { color: colors.secondaryText }]}>
                  {t('settings.vibration.desc')}
                </ThemedText>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={handleVibrationToggle}
                trackColor={{ false: colors.separator, true: colors.brand }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* ── Legal ── */}
          <ThemedText style={[styles.sectionHeader, { color: colors.secondaryText }]}>
            {t('settings.legal')}
          </ThemedText>
          <View style={[styles.group, { backgroundColor: colors.surface }]}>
            {LEGAL_ITEMS.map((item, idx) => {
              const isLast = idx === LEGAL_ITEMS.length - 1;
              return (
                <Pressable
                  key={item.id}
                  onPress={handleLegalItem}
                  style={({ pressed }) => [
                    styles.row,
                    !isLast && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: colors.separator,
                    },
                    pressed && { opacity: 0.6 },
                  ]}>
                  <View style={[styles.rowIcon, { backgroundColor: colors.surfaceMuted }]}>
                    <HabitIcon name={item.icon} size={20} tintColor={colors.moon} />
                  </View>
                  <View style={styles.rowBody}>
                    <ThemedText type="defaultSemiBold" style={styles.rowLabel}>
                      {t(item.labelKey)}
                    </ThemedText>
                    <ThemedText style={[styles.rowDescription, { color: colors.secondaryText }]}>
                      {t(item.descKey)}
                    </ThemedText>
                  </View>
                  <HabitIcon
                    name={'chevron.right' as SymbolName}
                    size={14}
                    tintColor={colors.iconMuted}
                  />
                </Pressable>
              );
            })}
          </View>

          {/* ── Brand name (below Legal) ── */}
          <View style={styles.brandHeader}>
            <ThemedText style={[styles.brandName, { color: colors.brand }]}>
              Your Daily Habits
            </ThemedText>
            <ThemedText style={[styles.brandTagline, { color: colors.secondaryText }]}>
              {t('brand.tagline')}
            </ThemedText>
          </View>

          <ThemedText style={[styles.footnote, { color: colors.secondaryText }]}>
            {t('settings.footnote')}
          </ThemedText>

          {/* ── Exit ── */}
          <Pressable
            onPress={handleExit}
            style={({ pressed }) => [
              styles.exitButton,
              {
                backgroundColor: 'rgba(240,112,96,0.10)',
                borderColor: 'rgba(240,112,96,0.28)',
              },
              pressed && { opacity: 0.6 },
            ]}>
            <HabitIcon
              name={'rectangle.portrait.and.arrow.right' as SymbolName}
              size={18}
              tintColor={colors.danger}
            />
            <ThemedText
              type="defaultSemiBold"
              style={[styles.exitButtonText, { color: colors.danger }]}>
              {t('settings.exitButton')}
            </ThemedText>
          </Pressable>

          <ThemedText style={[styles.versionText, { color: colors.secondaryText }]}>
            {t('settings.versionLabel', { version: APP_VERSION })}
          </ThemedText>
          <ThemedText style={[styles.companyText, { color: colors.secondaryText }]}>
            {t('settings.company')}
          </ThemedText>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingBottom: 140 },
  brandHeader: {
    alignItems: 'center',
    marginTop: 28,
    paddingBottom: 8,
    gap: 8,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  headerText: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 16,
    gap: 4,
  },
  subtle: { fontSize: 14 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  group: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 14,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1, gap: 2 },
  rowLabel: { fontSize: 16 },
  rowDescription: { fontSize: 13 },
  flagText: { fontSize: 13, letterSpacing: 0.5 },
  checkmarkPlaceholder: { width: 18, height: 18 },
  footnote: {
    marginHorizontal: 20,
    marginTop: 16,
    fontSize: 12,
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  exitButtonText: { fontSize: 15 },
  versionText: {
    marginTop: 12,
    fontSize: 12,
    textAlign: 'center',
  },
  companyText: {
    marginTop: 4,
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.3,
    opacity: 0.85,
  },
});
