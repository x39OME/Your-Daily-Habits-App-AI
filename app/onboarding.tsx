import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LOGO = require('@/assets/images/logo-onboarding.png');

const NAVY     = '#162238';
const AMBER    = '#F5A623';
const LAVENDER = '#A090CC';

// ─── Dot grid ─────────────────────────────────────────────────────────────────
function DotGrid({
  rows, cols, color, opacity, gap = 7,
}: { rows: number; cols: number; color: string; opacity: number; gap?: number }) {
  return (
    <View style={{ opacity }}>
      {Array.from({ length: rows }).map((_, r) => (
        <View key={r} style={{ flexDirection: 'row', marginBottom: gap }}>
          {Array.from({ length: cols }).map((_, c) => (
            <View
              key={c}
              style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color, marginRight: gap }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

// ─── Sun — filled solid circle + 8 filled rays ────────────────────────────────
function Sun({ size }: { size: number }) {
  const core   = size * 0.36;
  const rayLen = size * 0.155;
  const rayW   = size * 0.078;
  const center = size / 2;
  const dist   = core + size * 0.06;
  return (
    <View style={{ width: size, height: size }}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x = center + dist * Math.sin(angle) - rayW / 2;
        const y = center - dist * Math.cos(angle) - rayLen / 2;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: rayW, height: rayLen,
              borderRadius: rayW / 2,
              backgroundColor: AMBER,
              left: x, top: y,
              transform: [{ rotate: `${i * 45}deg` }],
            }}
          />
        );
      })}
      {/* Filled centre circle with subtle glow */}
      <View style={{
        position: 'absolute',
        width: core * 2, height: core * 2,
        borderRadius: core,
        backgroundColor: AMBER,
        left: center - core, top: center - core,
        shadowColor: AMBER,
        shadowOpacity: 0.55,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
      }} />
    </View>
  );
}

// ─── Moon crescent ────────────────────────────────────────────────────────────
function Moon({ size }: { size: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
      <View style={{ width: size, height: size, backgroundColor: '#8AABBE' }} />
      <View style={{
        position: 'absolute',
        width: size * 0.78, height: size * 0.78,
        borderRadius: size * 0.39,
        backgroundColor: '#C8E8F2',
        top: -size * 0.14, right: -size * 0.08,
      }} />
    </View>
  );
}

// ─── Diagonal strokes ─────────────────────────────────────────────────────────
function DiagLines({ color, opacity }: { color: string; opacity: number }) {
  return (
    <View style={{ opacity, gap: 9, transform: [{ rotate: '-38deg' }] }}>
      {[52, 36, 20].map((w, i) => (
        <View key={i} style={{ width: w, height: 5, borderRadius: 3, backgroundColor: color }} />
      ))}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const floatY   = useSharedValue(0);
  const btnScale = useSharedValue(1);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0,   { duration: 2800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, false,
    );
  }, [floatY]);

  const logoAnim = useAnimatedStyle(() => ({ transform: [{ translateY: floatY.value }] }));
  const btnAnim  = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── Smooth gradient background — 3 overlapping directional gradients ── */}
      <LinearGradient
        colors={['rgba(108,218,202,0.60)', 'rgba(108,218,202,0)']}
        start={{ x: 0, y: 0 }} end={{ x: 0.8, y: 0.8 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(172,148,228,0.55)', 'rgba(172,148,228,0)']}
        start={{ x: 1, y: 1 }} end={{ x: 0.2, y: 0.2 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(228,148,198,0.42)', 'rgba(228,148,198,0)']}
        start={{ x: 0, y: 1 }} end={{ x: 0.7, y: 0.3 }}
        style={StyleSheet.absoluteFill}
      />

      {/* ── Dot group 1 — top-left ── */}
      <Animated.View entering={FadeIn.delay(200).duration(700)} style={styles.dotsTopLeft}>
        <DotGrid rows={4} cols={4} color="#5AAEBB" opacity={0.50} />
      </Animated.View>

      {/* ── Moon ── */}
      <Animated.View entering={FadeIn.delay(250).duration(700)} style={styles.moonPos}>
        <Moon size={36} />
      </Animated.View>

      {/* ── Sun ── */}
      <Animated.View entering={FadeIn.delay(300).duration(700)} style={styles.sunPos}>
        <Sun size={72} />
      </Animated.View>

      {/* ── Diagonal lines right ── */}
      <Animated.View entering={FadeIn.delay(340).duration(700)} style={styles.diagRight}>
        <DiagLines color={LAVENDER} opacity={0.48} />
      </Animated.View>

      {/* ── Dot group 2 — bottom-left ── */}
      <Animated.View entering={FadeIn.delay(380).duration(700)} style={styles.dotsBottomLeft}>
        <DotGrid rows={3} cols={3} color={LAVENDER} opacity={0.42} />
      </Animated.View>

      {/* ── Diagonal lines left ── */}
      <Animated.View entering={FadeIn.delay(360).duration(700)} style={styles.diagLeft}>
        <DiagLines color={LAVENDER} opacity={0.42} />
      </Animated.View>

      {/* ── Dot group 3 — bottom-right ── */}
      <Animated.View entering={FadeIn.delay(420).duration(700)} style={styles.dotsBottomRight}>
        <DotGrid rows={3} cols={3} color={LAVENDER} opacity={0.40} />
      </Animated.View>

      {/* ── Logo (floating) ── */}
      <Animated.View
        entering={FadeInDown.delay(80).duration(700).springify().damping(14)}
        style={[logoAnim, styles.logoWrap]}>
        <Image
          source={LOGO}
          style={styles.logoImage}
          contentFit="contain"
          transition={0}
        />
      </Animated.View>

      {/* ── App name — close to logo, no tagline ── */}
      <Animated.View entering={FadeInUp.delay(260).duration(600)} style={styles.nameBlock}>
        <Text style={styles.nameTop}>YOUR DAILY</Text>
        <Text style={styles.nameBottom}>HABITS</Text>
      </Animated.View>

      {/* ── CTA button ── */}
      <Animated.View
        entering={FadeInUp.delay(500).duration(500)}
        style={[styles.btnContainer, { paddingBottom: Math.max(insets.bottom, 20) + 16 }]}>
        <Pressable
          onPressIn={() => { btnScale.value = withSpring(0.94, { damping: 12, stiffness: 320 }); }}
          onPressOut={() => { btnScale.value = withSpring(1,    { damping: 12, stiffness: 320 }); }}
          onPress={() => router.replace('/(tabs)')}>
          <Animated.View style={[styles.btn, btnAnim]}>
            <Text style={styles.btnText}>Get Started</Text>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsTopLeft:     { position: 'absolute', top: 70,  left: 18 },
  moonPos:         { position: 'absolute', top: 150, left: 32 },
  sunPos:          { position: 'absolute', top: 46,  right: 14 },
  diagRight:       { position: 'absolute', right: 15, top: 195 },
  dotsBottomLeft:  { position: 'absolute', left: 18, bottom: 155 },
  diagLeft:        { position: 'absolute', left: 13,  bottom: 228 },
  dotsBottomRight: { position: 'absolute', bottom: 155, right: 20 },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 280,
    height: 280,
  },
  nameBlock: {
    alignItems: 'center',
    marginTop: 4,
  },
  nameTop: {
    fontSize: 36,
    fontWeight: '700',
    color: NAVY,
    letterSpacing: 2.5,
    lineHeight: 42,
  },
  nameBottom: {
    fontSize: 48,
    fontWeight: '900',
    color: NAVY,
    letterSpacing: 3.5,
    lineHeight: 54,
  },
  btnContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    alignItems: 'center',
  },
  btn: {
    backgroundColor: NAVY,
    paddingVertical: 17,
    paddingHorizontal: 76,
    borderRadius: 40,
    shadowColor: NAVY,
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 12,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
