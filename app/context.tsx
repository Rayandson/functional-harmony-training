import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { AudioPlayer } from '@/components/quiz/AudioPlayer';
import { KEY_NAMES } from '@/constants/music';
import type { MusicalKey } from '@/types';
import { audioService } from '@/services/AudioService';

export default function ContextScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ key: MusicalKey; level: string; customDegrees?: string }>();
  const key = params.key as MusicalKey;
  const level = params.level;
  const customDegrees = params.customDegrees;
  const [shouldStopAudio, setShouldStopAudio] = useState(false);

  useEffect(() => {
    // Set audio mode when component mounts
    audioService.setAudioModeAsync();
  }, []);

  if (!key) {
    router.back();
    return null;
  }

  const handleStart = () => {
    // Stop audio before navigating
    setShouldStopAudio(true);
    // Navigate immediately - AudioPlayer will handle stopping
    const quizParams: Record<string, string> = { key, level };
    if (customDegrees) {
      quizParams.customDegrees = customDegrees;
    }
    router.push({
      pathname: '/quiz',
      params: quizParams,
    });
  };

  const contextAudioUri = audioService.getKeyContextAudioUri(key);

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 p-6 gap-6 items-center">
        <View className="w-full max-w-3xl gap-6">
          <View className="gap-2">
            <Text className="text-3xl font-bold">Contexto do Tom</Text>
            <Text className="text-muted-foreground text-lg">
              {level === 'progressions'
                ? 'Ouça o contexto do tom antes de identificar as progressões'
                : `Ouça o contexto do tom ${key} (${KEY_NAMES[key]}) antes de começar`}
            </Text>
          </View>

          <Card className="p-6 gap-6">
            <AudioPlayer
              audioUri={contextAudioUri}
              label="Áudio de Contexto"
              shouldStop={shouldStopAudio}
            />

            <View className="gap-2">
              <Text className="text-center text-muted-foreground">
                Após ouvir o contexto, clique em "Iniciar Quiz" para começar
              </Text>
              <Button onPress={handleStart} className="w-full sm:w-[250px] mx-auto" size="lg">
                <Text>Iniciar Quiz</Text>
              </Button>
            </View>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

