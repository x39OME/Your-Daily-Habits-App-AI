import { Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolView } from 'expo-symbols';

import type { SymbolName } from '@/db/types';

type Props = {
  name: SymbolName;
  size: number;
  tintColor: string;
};

// SF Symbol → MaterialCommunityIcons name. Used on Android/web where SF Symbols
// don't exist. Keep in sync with HABIT_ICONS plus any one-off symbols used in UI.
const MCI_MAP: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  'figure.run': 'run-fast',
  'figure.walk': 'walk',
  'figure.strengthtraining.traditional': 'weight-lifter',
  'figure.yoga': 'yoga',
  'dumbbell.fill': 'dumbbell',
  bicycle: 'bike',
  'drop.fill': 'water',
  'cup.and.saucer.fill': 'coffee',
  'fork.knife': 'silverware-fork-knife',
  'leaf.fill': 'leaf',
  'bed.double.fill': 'bed',
  'moon.stars.fill': 'weather-night',
  'sun.max.fill': 'white-balance-sunny',
  'book.fill': 'book',
  pencil: 'pencil',
  'graduationcap.fill': 'school',
  'guitars.fill': 'guitar-acoustic',
  'music.note': 'music-note',
  'paintpalette.fill': 'palette',
  'camera.fill': 'camera',
  'gamecontroller.fill': 'gamepad-variant',
  'brain.head.profile': 'brain',
  'heart.fill': 'heart',
  'pills.fill': 'pill',
  'cross.case.fill': 'medical-bag',
  sparkles: 'auto-fix',
  'star.fill': 'star',
  flame: 'fire',
  'flame.fill': 'fire',
  'bolt.fill': 'lightning-bolt',
  'trophy.fill': 'trophy',
  'flag.fill': 'flag',
  'checkmark.circle.fill': 'check-circle',
  'hands.sparkles.fill': 'hand-heart',
  'bubble.left.fill': 'message',
  'phone.fill': 'phone',
  'envelope.fill': 'email',
  'dollarsign.circle.fill': 'currency-usd',
  'cart.fill': 'cart',
  'house.fill': 'home',
  'pawprint.fill': 'paw',
  plus: 'plus',
  checkmark: 'check',
  trash: 'trash-can-outline',
  'trash.fill': 'trash-can',
  'gearshape.fill': 'cog',
  gearshape: 'cog-outline',
  'sun.max': 'white-balance-sunny',
  'moon.fill': 'moon-waning-crescent',
  'iphone.gen3': 'cellphone',
  'rectangle.portrait.and.arrow.right': 'logout',
  'character.book.closed': 'translate',
  infinity: 'infinity',
  checklist: 'format-list-checks',
  'clock': 'clock-outline',
  'clock.fill': 'clock',
  'chevron.right': 'chevron-right',
  'lock.fill': 'lock',
  'hand.raised.fill': 'hand-back-right',
  'checkmark.shield.fill': 'shield-check',
};

export function HabitIcon({ name, size, tintColor }: Props) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView name={name} size={size} tintColor={tintColor} fallback={null} />
    );
  }
  const mci = MCI_MAP[name as string] ?? 'help-circle';
  return <MaterialCommunityIcons name={mci} size={size} color={tintColor} />;
}
