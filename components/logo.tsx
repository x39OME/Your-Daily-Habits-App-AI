import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export const BRAND_NAME = 'Your daily habits';
export const BRAND_TAGLINE = 'Build better days, one habit at a time.';

const LOGO_LIGHT = require('@/assets/images/logo-light.png');
const LOGO_DARK = require('@/assets/images/logo-dark.png');
const LOGO_ASPECT = 480 / 262;

type LogoProps = {
  width?: number;
};

export function Logo({ width = 200 }: LogoProps) {
  const { scheme } = useTheme();
  return (
    <Image
      source={scheme === 'dark' ? LOGO_DARK : LOGO_LIGHT}
      style={[styles.logo, { width, aspectRatio: LOGO_ASPECT }]}
      contentFit="contain"
    />
  );
}

type BrandProps = {
  width?: number;
  showTagline?: boolean;
};

export function Brand({ width = 200, showTagline = false }: BrandProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.column}>
      <Logo width={width} />
      <ThemedText style={[styles.wordmark, { color: colors.text }]}>
        {BRAND_NAME}
      </ThemedText>
      {showTagline && (
        <ThemedText
          style={[styles.tagline, { color: colors.secondaryText }]}>
          {BRAND_TAGLINE}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
  },
  column: {
    alignItems: 'center',
    gap: 8,
  },
  wordmark: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  tagline: {
    fontSize: 12,
    textAlign: 'center',
  },
});
