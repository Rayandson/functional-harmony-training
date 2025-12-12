import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { QUIZ_LEVELS } from '@/constants/music';
import type { QuizLevel } from '@/types';
import { TrendingUp } from 'lucide-react-native';

export default function SelectLevelScreen() {
  const router = useRouter();

  const handleSelectLevel = (level: QuizLevel) => {
    router.push({
      pathname: '/select-key',
      params: { level: level.toString() },
    });
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 p-6 gap-6 items-center">
        <View className="w-full max-w-3xl gap-6">
          <View className="gap-2">
            <Text className="text-3xl font-bold">Selecione o Nível</Text>
            <Text className="text-muted-foreground text-lg">
              Escolha o nível de dificuldade do quiz
            </Text>
          </View>

          <View className="gap-4">
            {([1, 2, 3, 4, 5] as QuizLevel[]).map((level) => {
              const levelConfig = QUIZ_LEVELS[level];
              return (
                <Card key={level} className="p-3">
                  <Button
                    onPress={() => handleSelectLevel(level)}
                    variant="outline"
                    className="w-full py-7"
                  >
                    <View className="flex-row items-center justify-between w-full">
                      <View className="flex-row items-center gap-3">
                        <TrendingUp size={24} color="currentColor" />
                        <View className="items-start">
                          <Text className="text-lg font-semibold">{levelConfig.name}</Text>
                          <Text className="text-sm text-muted-foreground">{levelConfig.description}</Text>
                        </View>
                      </View>
                    </View>
                  </Button>
                </Card>
              );
            })}

            {/* Custom option */}
            <Card className="p-3">
              <Button
                onPress={() => router.push('/select-custom-degrees')}
                variant="outline"
                className="w-full py-7"
              >
                <View className="flex-row items-center justify-between w-full">
                  <View className="flex-row items-center gap-3">
                    <TrendingUp size={24} color="currentColor" />
                    <View className="items-start">
                      <Text className="text-lg font-semibold">Customizado</Text>
                      <Text className="text-sm text-muted-foreground">
                        Escolha quais graus praticar
                      </Text>
                    </View>
                  </View>
                </View>
              </Button>
            </Card>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

