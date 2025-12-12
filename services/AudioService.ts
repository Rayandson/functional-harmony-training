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
      }
    };
    return audioMap[key]?.[degree];
  }

  getKeyContextAudioUri(key: MusicalKey): any {
    // Map of context audio files
    const contextMap: Record<string, any> = {
      'C': require('@/assets/audio/C/C-context.mp3'),
    };
    return contextMap[key];
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

