import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { MUSICAL_KEYS, KEY_NAMES } from '@/constants/music';
import type { MusicalKey } from '@/types';

export default function SelectKeyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ level: string; customDegrees?: string; mode?: string }>();
  const level = params.level;
  const customDegrees = params.customDegrees;
  const mode = params.mode;

  const handleSelectKey = (key: MusicalKey) => {
    if (mode === 'playground') {
      router.push({
        pathname: '/playground',
        params: { key },
      });
      return;
    }

    const contextParams: Record<string, string> = { key, level: level || '' };
    if (customDegrees) {
      contextParams.customDegrees = customDegrees;
    }
    router.push({
      pathname: '/context',
      params: contextParams,
    });
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 p-6 gap-6 items-center">
        <View className="w-full max-w-3xl gap-6">
          <View className="gap-2">
            <Text className="text-3xl font-bold">Selecione o Tom</Text>
            <Text className="text-muted-foreground text-lg">
              {mode === 'playground'
                ? 'Escolha a tonalidade para explorar os graus'
                : `Escolha a tonalidade para o quiz ${level === 'custom' ? '(Customizado)' : `(Nível ${level})`}`}
            </Text>
          </View>

          <View className="gap-4">
            {MUSICAL_KEYS.map((key) => (
              <Card key={key} className="p-4">
                <Button
                  onPress={() => handleSelectKey(key)}
                  variant="outline"
                  className="w-full"
                >
                  <View className="flex-row items-center justify-between w-full">
                    <Text className="text-xl font-semibold">{key}</Text>
                    <Text className="text-muted-foreground">{KEY_NAMES[key]}</Text>
                  </View>
                </Button>
              </Card>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

