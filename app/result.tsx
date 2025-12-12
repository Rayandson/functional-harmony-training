import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { KEY_NAMES, QUIZ_LEVELS, DEGREE_NAMES } from '@/constants/music';
import type { MusicalKey, MusicalDegree, QuizLevel } from '@/types';
import { Trophy, RotateCcw, Home } from 'lucide-react-native';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ key: MusicalKey; level: string; correct: string; total: string; customDegrees?: string }>();
  const key = params.key as MusicalKey;
  const level = params.level || '1';
  const customDegrees = params.customDegrees;
  const correct = parseInt(params.correct || '0', 10);
  const total = parseInt(params.total || '0', 10);
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  const getPerformanceMessage = () => {
    if (percentage >= 90) return 'Excelente!';
    if (percentage >= 70) return 'Muito bom!';
    if (percentage >= 50) return 'Bom trabalho!';
    return 'Continue praticando!';
  };

  const getPerformanceColor = () => {
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 70) return 'text-blue-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-orange-500';
  };

  // Get the degrees that were exercised
  const getExercisedDegrees = (): MusicalDegree[] => {
    if (level === 'custom' && customDegrees) {
      return customDegrees.split(',') as MusicalDegree[];
    } else {
      const levelNum = parseInt(level || '1', 10) as QuizLevel;
      return QUIZ_LEVELS[levelNum]?.allowedDegrees || [];
    }
  };

  const exercisedDegrees = getExercisedDegrees();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 p-6 gap-6 items-center">
        <View className="w-full max-w-3xl gap-6">
          <Card className="p-6 gap-6 items-center">
            <View className={getPerformanceColor()}>
              <Trophy size={64} />
            </View>

            <View className="gap-2 items-center">
              <Text className="text-3xl font-bold">{getPerformanceMessage()}</Text>
              <Text className="text-muted-foreground text-lg">
                Tom: {key} ({KEY_NAMES[key]}) - {level === 'custom' ? 'Customizado' : `Nível ${level}`}
              </Text>
            </View>

            <View className="w-full gap-4">
              <View className="items-center gap-2">
                <Text className="text-5xl font-bold">{percentage}%</Text>
                <Text className="text-muted-foreground">
                  {correct} de {total} acertos
                </Text>
              </View>

              <View className="flex-row justify-between p-4 rounded-lg bg-muted">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-green-500">{correct}</Text>
                  <Text className="text-sm text-muted-foreground">Corretas</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-red-500">{total - correct}</Text>
                  <Text className="text-sm text-muted-foreground">Incorretas</Text>
                </View>
              </View>

              {/* Exercised Degrees Section */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-center text-muted-foreground">
                  Graus Exercitados
                </Text>
                <Text className="text-sm text-center text-muted-foreground">
                  {exercisedDegrees.map((degree, index) =>
                    `${degree}${index < exercisedDegrees.length - 1 ? ', ' : ''}`
                  ).join('')}
                </Text>
              </View>
            </View>

            <View className="w-full gap-3">
              <Button
                onPress={() => {
                  const contextParams: Record<string, string> = { key, level };
                  if (customDegrees) {
                    contextParams.customDegrees = customDegrees;
                  }
                  router.push({
                    pathname: '/context',
                    params: contextParams,
                  });
                }}
                className="w-full"
                size="lg"
              >
                <View className="flex-row items-center">
                  <RotateCcw size={20} color="white" />
                  <Text className="text-white ml-2">Tentar Novamente</Text>
                </View>
              </Button>
              <Button
                onPress={() => {
                  // Reset navigation stack to menu to prevent back button
                  router.dismissAll();
                  router.replace('/menu');
                }}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <View className="flex-row items-center">
                  <Home size={20} />
                  <Text className="ml-2">Voltar ao Menu</Text>
                </View>
              </Button>
            </View>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

