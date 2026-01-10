import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { MUSICAL_DEGREES, DEGREE_NAMES, KEY_NAMES, KEY_CHORDS } from '@/constants/music';
import { audioService } from '@/services/AudioService';
import { Audio } from 'expo-av';
import { ChevronLeft } from 'lucide-react-native';
import type { MusicalDegree, MusicalKey } from '@/types';

export default function PlaygroundScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ key: string }>();
  const selectedKey = (params.key as MusicalKey) || 'G';
  const [loadingDegree, setLoadingDegree] = React.useState<MusicalDegree | null>(null);

  const playDegree = async (degree: MusicalDegree) => {
    try {
      setLoadingDegree(degree);
      const source = audioService.getAudioUri(selectedKey, degree);

      const { sound } = await Audio.Sound.createAsync(
        source,
        { shouldPlay: true }
      );

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing playground audio:', error);
    } finally {
      setLoadingDegree(null);
    }
  };

  const getChord = (degree: MusicalDegree) => {
    return KEY_CHORDS[selectedKey]?.[degree] || '';
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 p-6 gap-6 items-center">
        <View className="w-full max-w-3xl gap-6">
          <View className="flex-row items-center gap-4">
            <Button variant="ghost" size="icon" onPress={() => router.back()}>
              <ChevronLeft size={24} color="currentColor" />
            </Button>
            <View className="gap-1">
              <Text className="text-3xl font-bold">Playground</Text>
              <Text className="text-muted-foreground">Tom: {selectedKey} ({KEY_NAMES[selectedKey]})</Text>
            </View>
          </View>

          <Card className="p-6">
            <Text className="text-center mb-10 text-muted-foreground text-lg">
              Ouça e se familiarize com os graus de forma livre, e se prepare para o quiz
            </Text>

            <View className="flex-row flex-wrap justify-center gap-6">
              {MUSICAL_DEGREES.map((degree) => (
                <View key={degree} className="w-[45%] sm:w-[30%]">
                  <Button
                    onPress={() => playDegree(degree)}
                    variant="outline"
                    className="h-32 flex-col gap-2 border-2 active:bg-accent relative"
                    disabled={loadingDegree === degree}
                  >
                    <View className="absolute top-2 left-2">
                      <Text className="text-primary font-bold text-sm">
                        {getChord(degree)}
                      </Text>
                    </View>
                    <Text className="text-3xl font-bold">{degree}</Text>
                    <Text className="text-sm text-muted-foreground font-normal text-center">
                      {DEGREE_NAMES[degree]}
                    </Text>
                  </Button>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
