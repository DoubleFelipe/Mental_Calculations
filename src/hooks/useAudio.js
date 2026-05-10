/**
 * Mental Calculations — useAudio Hook
 * Interface para o serviço de áudio
 */
import { useCallback, useEffect } from 'react';
import audioService from '../services/audioService';

export default function useAudio(settings) {
  useEffect(() => {
    if (settings) {
      audioService.setMusicVolume(settings.musicVolume);
      audioService.setSfxVolume(settings.sfxVolume);
    }
  }, [settings]);

  const initAudio = useCallback(() => { audioService.init(); }, []);
  const playCorrect = useCallback(() => { audioService.playCorrect(); }, []);
  const playWrong = useCallback(() => { audioService.playWrong(); }, []);
  const playCoin = useCallback(() => { audioService.playCoin(); }, []);
  const playJump = useCallback(() => { audioService.playJump(); }, []);
  const playClick = useCallback(() => { audioService.playClick(); }, []);
  const playVictory = useCallback(() => { audioService.playVictory(); }, []);
  const playDefeat = useCallback(() => { audioService.playDefeat(); }, []);
  const startMusic = useCallback(() => { audioService.startMusic(); }, []);
  const stopMusic = useCallback(() => { audioService.stopMusic(); }, []);

  return { initAudio, playCorrect, playWrong, playCoin, playJump, playClick, playVictory, playDefeat, startMusic, stopMusic };
}
