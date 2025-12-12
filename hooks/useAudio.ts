import { useState, useEffect, useCallback } from 'react';
import { audioService } from '@/services/AudioService';

interface UseAudioReturn {
  isLoading: boolean;
  isPlaying: boolean;
  error: Error | null;
  loadAudio: (uri: string) => Promise<void>;
  play: () => Promise<void>;
  stop: () => Promise<void>;
  pause: () => Promise<void>;
  unload: () => Promise<void>;
}

export function useAudio(): UseAudioReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    audioService.setAudioModeAsync();

    return () => {
      audioService.unload();
    };
  }, []);

  const loadAudio = useCallback(async (uri: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await audioService.loadAudio(uri);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load audio');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const play = useCallback(async () => {
    setError(null);
    try {
      await audioService.play();
      setIsPlaying(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to play audio');
      setError(error);
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(async () => {
    setError(null);
    try {
      await audioService.stop();
      setIsPlaying(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to stop audio');
      setError(error);
    }
  }, []);

  const pause = useCallback(async () => {
    setError(null);
    try {
      await audioService.pause();
      setIsPlaying(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to pause audio');
      setError(error);
    }
  }, []);

  const unload = useCallback(async () => {
    setError(null);
    try {
      await audioService.unload();
      setIsPlaying(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to unload audio');
      setError(error);
    }
  }, []);

  return {
    isLoading,
    isPlaying,
    error,
    loadAudio,
    play,
    stop,
    pause,
    unload,
  };
}


