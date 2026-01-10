import { Audio } from 'expo-av';
import type { MusicalKey, MusicalDegree } from '@/types';

class AudioService {
  private sound: Audio.Sound | null = null;

  async loadAudio(uri: string): Promise<void> {
    try {
      // Unload previous sound if exists
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false }
      );
      this.sound = sound;
    } catch (error) {
      console.error('Error loading audio:', error);
      throw error;
    }
  }

  async play(): Promise<void> {
    if (!this.sound) {
      throw new Error('No audio loaded');
    }
    try {
      await this.sound.replayAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.sound) {
      return;
    }
    try {
      await this.sound.stopAsync();
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }

  async pause(): Promise<void> {
    if (!this.sound) {
      return;
    }
    try {
      await this.sound.pauseAsync();
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  }

  async unload(): Promise<void> {
    if (!this.sound) {
      return;
    }
    try {
      await this.sound.unloadAsync();
      this.sound = null;
    } catch (error) {
      console.error('Error unloading audio:', error);
    }
  }

  getAudioUri(key: MusicalKey, degree: MusicalDegree): any {
    // Map of audio files using require() for local assets
    const audioMap: Record<string, Record<string, any>> = {
      'C': {
        'I': require('@/assets/audio/C/C-I.mp3'),
        'II': require('@/assets/audio/C/C-II.mp3'),
        'III': require('@/assets/audio/C/C-III.mp3'),
        'IV': require('@/assets/audio/C/C-IV.mp3'),
        'V': require('@/assets/audio/C/C-V.mp3'),
        'VI': require('@/assets/audio/C/C-VI.mp3'),
        'VII': require('@/assets/audio/C/C-VII.mp3'),
      },
      'G': {
        'I': require('@/assets/audio/G/G-I.mp3'),
        'II': require('@/assets/audio/G/G-II.mp3'),
        'III': require('@/assets/audio/G/G-III.mp3'),
        'IV': require('@/assets/audio/G/G-IV.mp3'),
        'V': require('@/assets/audio/G/G-V.mp3'),
        'VI': require('@/assets/audio/G/G-VI.mp3'),
        'VII': require('@/assets/audio/G/G-VII.mp3'),
      }
    };
    return audioMap[key]?.[degree];
  }

  getKeyContextAudioUri(key: MusicalKey): any {
    // Map of context audio files
    const contextMap: Record<string, any> = {
      'C': require('@/assets/audio/C/C-context.mp3'),
      'G': require('@/assets/audio/G/G-context.mp3'),
    };
    return contextMap[key];
  }

  getProgressionAudioUri(progression: string): any {
    const progressionMap: Record<string, any> = {
      'I-II-VI-IV': require('@/assets/audio/progressions/I-II-VI-IV.mp3'),
      'I-II-VI-V': require('@/assets/audio/progressions/I-II-VI-V.mp3'),
      'I-III-II-V': require('@/assets/audio/progressions/I-III-II-V.mp3'),
      'I-III-IV-I': require('@/assets/audio/progressions/I-III-IV-I.mp3'),
      'I-IV-I-IV': require('@/assets/audio/progressions/I-IV-I-IV.mp3'),
      'I-IV-I-V': require('@/assets/audio/progressions/I-IV-I-V.mp3'),
      'I-IV-V-I': require('@/assets/audio/progressions/I-IV-V-I.mp3'),
      'I-IV-V-IV': require('@/assets/audio/progressions/I-IV-V-IV.mp3'),
      'I-IV-VI-V': require('@/assets/audio/progressions/I-IV-VI-V.mp3'),
      'I-IV-VII-I': require('@/assets/audio/progressions/I-IV-VII-I.mp3'),
      'I-V-I-V': require('@/assets/audio/progressions/I-V-I-V.mp3'),
      'I-V-II-IV': require('@/assets/audio/progressions/I-V-II-IV.mp3'),
      'I-V-II-V': require('@/assets/audio/progressions/I-V-II-V.mp3'),
      'I-V-IV-V': require('@/assets/audio/progressions/I-V-IV-V.mp3'),
      'I-V-VI-IV': require('@/assets/audio/progressions/I-V-VI-IV.mp3'),
      'I-VI-III-IV': require('@/assets/audio/progressions/I-VI-III-IV.mp3'),
      'I-VI-IV-V': require('@/assets/audio/progressions/I-VI-IV-V.mp3'),
      'I-VI-V-IV': require('@/assets/audio/progressions/I-VI-V-IV.mp3'),
      'IV-I-V-I': require('@/assets/audio/progressions/IV-I-V-I.mp3'),
      'IV-I-V-IV': require('@/assets/audio/progressions/IV-I-V-IV.mp3'),
      'IV-I-VI-V': require('@/assets/audio/progressions/IV-I-VI-V.mp3'),
      'IV-V-III-VI': require('@/assets/audio/progressions/IV-V-III-VI.mp3'),
      'VI-V-IV-I': require('@/assets/audio/progressions/VI-V-IV-I.mp3'),
      'VI-V-IV-V': require('@/assets/audio/progressions/VI-V-IV-V.mp3'),
    };
    return progressionMap[progression];
  }

  async setAudioModeAsync(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.error('Error setting audio mode:', error);
    }
  }
}

export const audioService = new AudioService();

