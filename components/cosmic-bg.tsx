import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { HabitIcon } from '@/components/habit-icon';
import type { SymbolName } from '@/db/types';
import { useTheme } from '@/hooks/use-theme';

// ─── Sun shape: circle + 8 radiating rays ────────────────────────────────────
function SunShape({ color, size = 38 }: { color: string; size?: number }) {
  const c = size / 2;
  const innerR = size * 0.26;
  const rayDist = size * 0.40;
  const rayW = Math.max(2, size * 0.08);
  const rayH = size * 0.17;

  return (
    <View style={{ width: size, height: size }}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <View
            key={deg}
            style={{
              position: 'absolute',
              left: c - rayW / 2,
              top: c - rayH / 2,
              width: rayW,
              height: rayH,
              borderRadius: rayW / 2,
              backgroundColor: color,
              transform: [
                { translateX: Math.cos(rad) * rayDist },
                { translateY: Math.sin(rad) * rayDist },
                { rotate: `${deg + 90}deg` },
              ],
            }}
          />
        );
      })}
      <View
        style={{
          position: 'absolute',
          left: c - innerR,
          top: c - innerR,
          width: innerR * 2,
          height: innerR * 2,
          borderRadius: innerR,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

// ─── Pulsing dot ─────────────────────────────────────────────────────────────
function Dot({
  top, left, right, size, color, delay = 0,
}: {
  top: number;
  left?: number;
  right?: number;
  size: number;
  color: string;
  delay?: number;
}) {
  const opacity = useSharedValue(0.22);
  const scale = useSharedValue(0.88);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.62, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.22, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.22, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.88, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top,
          left,
          right,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animStyle,
      ]}
    />
  );
}

// ─── Diagonal line decoration ────────────────────────────────────────────────
function Line({ top, left, right, width, color }: {
  top: number;
  left?: number;
  right?: number;
  width: number;
  color: string;
}) {
  return (
    <View
      style={{
        position: 'absolute',
        top,
        left,
        right,
        width,
        height: 1.5,
        borderRadius: 1,
        backgroundColor: color,
        opacity: 0.28,
        transform: [{ rotate: '-33deg' }],
      }}
    />
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function CosmicBg() {
  const { colors, scheme } = useTheme();
  const isDark = scheme === 'dark';

  // Animation 1 — Sun slowly rotates a full 360° every 22 seconds, forever
  const sunRot = useSharedValue(0);
  useEffect(() => {
    sunRot.value = withRepeat(
      withTiming(360, { duration: 22000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);
  const sunStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sunRot.value}deg` }],
  }));

  // Animation 2 — Moon gently floats ±7 px vertically, 3.4 s each way, forever
  const moonY = useSharedValue(0);
  useEffect(() => {
    moonY.value = withRepeat(
      withSequence(
        withTiming(-7, { duration: 3400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, []);
  const moonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: moonY.value }],
  }));

  const teal  = isDark ? 'rgba(92,216,226,0.30)'  : 'rgba(56,196,208,0.28)';
  const lav   = isDark ? 'rgba(154,172,238,0.22)' : 'rgba(128,144,220,0.22)';
  const amber = isDark ? 'rgba(255,208,80,0.22)'  : 'rgba(245,192,64,0.20)';
  const line  = isDark ? 'rgba(92,216,226,0.18)'  : 'rgba(56,196,208,0.30)';

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* ── Pulsing dots ── */}
      <Dot top={72}  left={18}  size={8}  color={teal}  delay={0}    />
      <Dot top={185} left={28}  size={5}  color={lav}   delay={500}  />
      <Dot top={130} right={22} size={6}  color={amber} delay={300}  />
      <Dot top={310} right={35} size={9}  color={teal}  delay={900}  />
      <Dot top={380} left={44}  size={5}  color={lav}   delay={700}  />
      <Dot top={260} left={12}  size={7}  color={amber} delay={1100} />

      {/* ── Diagonal line accents ── */}
      <Line top={148} left={22}  width={44} color={line} />
      <Line top={335} left={8}   width={32} color={line} />
      <Line top={210} right={28} width={38} color={line} />

      {/* ── Animation 1: Rotating sun (top-right) ── */}
      <Animated.View
        style={[
          { position: 'absolute', top: 52, right: 16, opacity: isDark ? 0.42 : 0.38 },
          sunStyle,
        ]}>
        <SunShape color={colors.sun} size={36} />
      </Animated.View>

      {/* ── Animation 2: Floating moon (left side) ── */}
      <Animated.View
        style={[
          { position: 'absolute', top: 215, left: 8, opacity: isDark ? 0.52 : 0.40 },
          moonStyle,
        ]}>
        <HabitIcon
          name={'moon.fill' as SymbolName}
          size={28}
          tintColor={colors.moon}
        />
      </Animated.View>
    </View>
  );
}
