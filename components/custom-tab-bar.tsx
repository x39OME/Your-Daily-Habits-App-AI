/**
 * CustomTabBar — 5-slot floating pill bar with elevated FAB
 *
 * Layout: [Home] [Streaks] ──[+ FAB]── [Clock] [Settings]
 *
 * Each tab shows an icon + label. Active tab: spring-scale icon,
 * tinted capsule, bold label in brand colour. Inactive: muted.
 *
 * FAB is a separate absolutely-positioned view (not clipped by
 * overflow:hidden). X-position derived from spacer measurement.
 */

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HabitIcon } from '@/components/habit-icon';
import type { SymbolName } from '@/db/types';
import { useHaptic } from '@/hooks/use-haptic';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

// ─── Layout constants ─────────────────────────────────────────────────────────
const BAR_H      = 72;   // taller to accommodate icon + label
const FAB_SIZE   = 38;
const FAB_LIFT   = 22;
const BAR_MARGIN = 20;
const CAPSULE_W  = 50;
const CAPSULE_H  = 30;
const SPACER_W   = FAB_SIZE + 20;

// ─── Route → icon + label mapping ────────────────────────────────────────────
const ROUTE_ICONS: Record<string, { active: SymbolName; idle: SymbolName }> = {
  index:         { active: 'checklist'      as SymbolName, idle: 'checklist'       as SymbolName },
  streaks:       { active: 'flame.fill'     as SymbolName, idle: 'flame'           as SymbolName },
  'coming-soon': { active: 'clock.fill'     as SymbolName, idle: 'clock'           as SymbolName },
  settings:      { active: 'gearshape.fill' as SymbolName, idle: 'gearshape'       as SymbolName },
};

const ROUTE_LABEL_KEYS: Record<string, string> = {
  index:         'tab.today',
  streaks:       'tab.streaks',
  'coming-soon': 'tab.soon',
  settings:      'tab.settings',
};

// Visual slot → route array index
// Slots: [0=Home][1=Streaks][spacer][3=Clock][4=Settings]
const V2R: Record<number, number> = { 0: 0, 1: 1, 3: 2, 4: 3 };

// ─── Animated tab button ──────────────────────────────────────────────────────
function TabButton({
  focused,
  activeIcon,
  idleIcon,
  label,
  onPress,
  onLongPress,
}: {
  focused: boolean;
  activeIcon: SymbolName;
  idleIcon: SymbolName;
  label: string;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const { colors } = useTheme();

  const iconScale      = useSharedValue(focused ? 1.10 : 0.92);
  const capsuleOpacity = useSharedValue(focused ? 1 : 0);
  const capsuleScale   = useSharedValue(focused ? 1 : 0.5);
  const labelOpacity   = useSharedValue(focused ? 1 : 0.55);

  useEffect(() => {
    iconScale.value = withSpring(focused ? 1.10 : 0.92, {
      damping: 15, stiffness: 220,
    });
    capsuleOpacity.value = withTiming(focused ? 1 : 0, {
      duration: 200, easing: Easing.out(Easing.cubic),
    });
    capsuleScale.value = withSpring(focused ? 1 : 0.5, {
      damping: 14, stiffness: 200,
    });
    labelOpacity.value = withTiming(focused ? 1 : 0.55, {
      duration: 180, easing: Easing.out(Easing.cubic),
    });
  }, [focused, iconScale, capsuleOpacity, capsuleScale, labelOpacity]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const capsuleStyle = useAnimatedStyle(() => ({
    opacity: capsuleOpacity.value,
    transform: [{ scaleX: capsuleScale.value }, { scaleY: capsuleScale.value }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
  }));

  const labelColor = focused ? colors.brand : colors.iconMuted;

  return (
    <Pressable
      style={styles.tabButton}
      onPress={onPress}
      onLongPress={onLongPress}
      android_ripple={{ borderless: true, radius: 26 }}>
      {/* Tinted active capsule sits behind icon */}
      <Animated.View
        style={[styles.capsule, { backgroundColor: colors.brandSoft }, capsuleStyle]}
      />
      {/* Icon */}
      <Animated.View style={iconStyle}>
        <HabitIcon
          name={focused ? activeIcon : idleIcon}
          size={20}
          tintColor={focused ? colors.brand : colors.iconMuted}
        />
      </Animated.View>
      {/* Label */}
      <Animated.View style={labelStyle}>
        <Text
          style={[styles.label, { color: labelColor }]}
          numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ─── FAB button ───────────────────────────────────────────────────────────────
function FabButton({ onPress }: { onPress: () => void }) {
  const { colors, scheme } = useTheme();
  const scale  = useSharedValue(1);
  const rotate = useSharedValue(0);

  const fabAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  const onPressIn = () => {
    scale.value  = withSpring(0.84, { damping: 12, stiffness: 280 });
    rotate.value = withTiming(45,  { duration: 180, easing: Easing.out(Easing.cubic) });
  };

  const onPressOut = () => {
    scale.value  = withSpring(1,  { damping: 11, stiffness: 220 });
    rotate.value = withTiming(0,  { duration: 200, easing: Easing.out(Easing.cubic) });
  };

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} hitSlop={10}>
      <Animated.View
        style={[
          styles.fab,
          {
            backgroundColor: colors.brand,
            ...Platform.select({
              ios: {
                shadowColor: colors.brand,
                shadowOpacity: scheme === 'dark' ? 0.65 : 0.50,
                shadowOffset: { width: 0, height: 5 },
                shadowRadius: 14,
              },
              android: { elevation: 10 },
              default: {},
            }),
          },
          fabAnim,
        ]}>
        <HabitIcon name={'plus' as SymbolName} size={20} tintColor="#fff" />
      </Animated.View>
    </Pressable>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors, scheme } = useTheme();
  const { t } = useTranslation();
  const { impact } = useHaptic();
  const router = useRouter();

  const spacerRef = useRef<View>(null);
  const [fabLeft, setFabLeft] = useState<number | null>(null);

  const safeBottom = Math.max(insets.bottom, 12) + 8;
  const fabBottom  = safeBottom + BAR_H + FAB_LIFT - FAB_SIZE / 2;

  const measureSpacer = () => {
    spacerRef.current?.measure((_x, _y, width, _h, pageX) => {
      setFabLeft(pageX + width / 2 - FAB_SIZE / 2);
    });
  };

  const handleTabPress = (visualPos: number) => {
    const routeIdx = V2R[visualPos];
    if (routeIdx === undefined) return;
    const route = state.routes[routeIdx];
    if (!route) return;
    const focused = state.index === routeIdx;
    if (!focused && Platform.OS !== 'web') {
      impact(ImpactFeedbackStyle.Light);
    }
    const ev = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!focused && !ev.defaultPrevented) {
      navigation.navigate(route.name as never);
    }
  };

  const handleLongPress = (visualPos: number) => {
    const routeIdx = V2R[visualPos];
    if (routeIdx === undefined) return;
    const route = state.routes[routeIdx];
    if (!route) return;
    navigation.emit({ type: 'tabLongPress', target: route.key });
  };

  const isFocused = (visualPos: number) => {
    const routeIdx = V2R[visualPos];
    return routeIdx !== undefined && state.index === routeIdx;
  };

  const icons    = (name: string) => ROUTE_ICONS[name] ?? { active: 'circle.fill' as SymbolName, idle: 'circle' as SymbolName };
  const tabLabel = (name: string) => {
    const key = ROUTE_LABEL_KEYS[name];
    return key ? t(key as Parameters<typeof t>[0]) : name;
  };

  const r0 = state.routes[0];
  const r1 = state.routes[1];
  const r2 = state.routes[2];
  const r3 = state.routes[3];

  return (
    <>
      {/* ── Floating pill bar ── */}
      <View
        style={[
          styles.bar,
          {
            bottom: safeBottom,
            backgroundColor: colors.surface,
            borderColor: scheme === 'dark'
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(26,42,66,0.07)',
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOpacity: scheme === 'dark' ? 0.55 : 0.11,
                shadowOffset: { width: 0, height: 10 },
                shadowRadius: 30,
              },
              android: { elevation: 18 },
              default: {},
            }),
          },
        ]}>

        {r0 && (
          <TabButton
            focused={isFocused(0)}
            activeIcon={icons(r0.name).active}
            idleIcon={icons(r0.name).idle}
            label={tabLabel(r0.name)}
            onPress={() => handleTabPress(0)}
            onLongPress={() => handleLongPress(0)}
          />
        )}

        {r1 && (
          <TabButton
            focused={isFocused(1)}
            activeIcon={icons(r1.name).active}
            idleIcon={icons(r1.name).idle}
            label={tabLabel(r1.name)}
            onPress={() => handleTabPress(1)}
            onLongPress={() => handleLongPress(1)}
          />
        )}

        <View ref={spacerRef} style={styles.fabSpacer} onLayout={measureSpacer}>
          <View style={styles.fabSlot}>
            <HabitIcon name={'cloud' as SymbolName} size={20} tintColor={colors.iconMuted} />
            <Text style={[styles.fabSlotLabel, { color: colors.iconMuted }]}>{t('tab.soon')}</Text>
          </View>
        </View>

        {r2 && (
          <TabButton
            focused={isFocused(3)}
            activeIcon={icons(r2.name).active}
            idleIcon={icons(r2.name).idle}
            label={tabLabel(r2.name)}
            onPress={() => handleTabPress(3)}
            onLongPress={() => handleLongPress(3)}
          />
        )}

        {r3 && (
          <TabButton
            focused={isFocused(4)}
            activeIcon={icons(r3.name).active}
            idleIcon={icons(r3.name).idle}
            label={tabLabel(r3.name)}
            onPress={() => handleTabPress(4)}
            onLongPress={() => handleLongPress(4)}
          />
        )}
      </View>

      {/* ── FAB — separate, never clipped by bar ── */}
      {fabLeft !== null && (
        <View
          style={[styles.fabOuter, { bottom: fabBottom, left: fabLeft }]}
          pointerEvents="box-none">
          <FabButton onPress={() => router.push('/new-habit')} />
        </View>
      )}
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: BAR_MARGIN,
    right: BAR_MARGIN,
    height: BAR_H,
    borderRadius: BAR_H / 2,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    height: BAR_H,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  capsule: {
    position: 'absolute',
    width: CAPSULE_W,
    height: CAPSULE_H,
    borderRadius: CAPSULE_H / 2,
    top: (BAR_H - CAPSULE_H) / 2 - 11, // sit around icon only; -11 keeps bottom edge above label
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  fabSpacer: {
    width: SPACER_W,
    height: BAR_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  fabSlotLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  fabOuter: {
    position: 'absolute',
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
