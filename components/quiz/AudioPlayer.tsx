import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Play, Square } from 'lucide-react-native';

interface AudioPlayerProps {
  audioUri: string | { uri: string } | number | any;
  onPlay?: () => void;
  onStop?: () => void;
  label?: string;
  shouldStop?: boolean; // When true, stops the audio and resets to play state
}

export function AudioPlayer({ audioUri, onPlay, onStop, label, shouldStop }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let currentSound: Audio.Sound | null = null;
    let autoPlayTimeout: ReturnType<typeof setTimeout> | null = null;

    const loadSound = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Unload previous sound if exists
        if (sound) {
          await sound.unloadAsync();
          setSound(null);
        }

        // Handle require() assets (numbers in React Native) and URI strings
        // require() returns a number in React Native/Expo
        let source: any;

        if (typeof audioUri === 'number') {
          // This is a require() asset - pass the number directly
          source = audioUri;
        } else if (typeof audioUri === 'object' && audioUri !== null) {
          // Could be { uri: string } or require() result
          source = audioUri;
        } else if (typeof audioUri === 'string') {
          // URI string (http, file, etc)
          source = { uri: audioUri };
        } else {
          throw new Error('Invalid audio source');
        }

        // In React Native, require() returns a number, which is a valid source
        const { sound: newSound } = await Audio.Sound.createAsync(
          source,
          { shouldPlay: false }
        );

        currentSound = newSound;

        // Set up playback status listener to detect when audio finishes
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (!isMounted) return;

          if (status.isLoaded) {
            if (status.didJustFinish) {
              // Audio finished playing, reset to "Tocar" state
              setIsPlaying(false);
              onStop?.();
            } else if (status.isPlaying !== isPlaying) {
              // Sync playing state with actual status
              setIsPlaying(status.isPlaying);
            }
          }
        });

        if (isMounted) {
          setSound(newSound);
          setIsLoading(false);

          // Auto-play after 1 second when audio is loaded (only if not stopped)
          if (!shouldStop) {
            autoPlayTimeout = setTimeout(async () => {
              if (isMounted && newSound && !shouldStop) {
                try {
                  await newSound.replayAsync();
                  if (isMounted) {
                    setIsPlaying(true);
                    onPlay?.();
                  }
                } catch (err) {
                  console.error('Error auto-playing audio:', err);
                }
              }
            }, 1000);
          }
        }
      } catch (err) {
        console.error('Error loading audio:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar áudio');
          setIsLoading(false);
        }
      }
    };

    loadSound();

    return () => {
      isMounted = false;
      if (autoPlayTimeout) {
        clearTimeout(autoPlayTimeout);
      }
      if (currentSound) {
        // Stop and unload sound on cleanup to prevent audio from continuing after unmount
        currentSound.stopAsync().catch(() => {});
        currentSound.unloadAsync().catch(() => {});
      }
    };
  }, [audioUri, onPlay, shouldStop]);

  // Reset playing state when audioUri changes (new question)
  useEffect(() => {
    setIsPlaying(false);
  }, [audioUri]);

  // Effect to stop audio when shouldStop becomes true
  useEffect(() => {
    if (shouldStop && sound) {
      const stopAudio = async () => {
        try {
          // Check if sound is loaded before trying to stop
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            await sound.stopAsync();
            // Unload the sound to completely stop it
            await sound.unloadAsync();
            setSound(null);
          }
        } catch (err) {
          // Silently ignore errors - audio may already be unloaded or stopped
          // This is expected behavior when navigating away or component unmounts
        }
        // Always reset the playing state, regardless of actual audio status
        setIsPlaying(false);
        onStop?.();
      };
      stopAudio();
    }
  }, [shouldStop, sound, onStop]);

  const handlePlay = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.stopAsync();
        setIsPlaying(false);
        onStop?.();
      } else {
        await sound.replayAsync();
        setIsPlaying(true);
        onPlay?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reproduzir áudio');
    }
  };

  if (error) {
    return (
      <View className="items-center p-4">
        <Text className="text-destructive text-sm">{error}</Text>
        <Text className="text-muted-foreground text-xs mt-2">
          Nota: Adicione os arquivos de áudio em assets/audio/
        </Text>
      </View>
    );
  }

  return (
    <View className="items-center gap-4">
      {label && (
        <Text className="text-foreground text-lg font-semibold">{label}</Text>
      )}
      <Button
        onPress={handlePlay}
        disabled={isLoading || !sound}
        className="min-w-[120px]"
        variant={isPlaying ? 'destructive' : 'default'}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : isPlaying ? (
          <View className="flex-row items-center">
            <Square size={20} color="white" />
            <Text className="text-white ml-2">Parar</Text>
          </View>
        ) : (
          <View className="flex-row items-center">
            <Play size={20} color="white" />
            <Text className="text-white ml-2">Tocar</Text>
          </View>
        )}
      </Button>
    </View>
  );
}

