import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';

const COMPLETE_SOUND = require('@/assets/sounds/complete.wav');

export function useCompletionSound() {
  const player = useAudioPlayer(COMPLETE_SOUND);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentModeIOS: true }).catch(() => {});
  }, []);

  return () => {
    try {
      player.seekTo(0);
      player.play();
    } catch {
      // ignore if sound isn't ready yet
    }
  };
}
