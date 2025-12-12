import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { MUSICAL_DEGREES, DEGREE_NAMES } from '@/constants/music';
import type { MusicalDegree } from '@/types';

export default function SelectCustomDegreesScreen() {
  const router = useRouter();
  const [selectedDegrees, setSelectedDegrees] = useState<MusicalDegree[]>([]);

  const toggleDegree = (degree: MusicalDegree) => {
    setSelectedDegrees((prev) => {
      if (prev.includes(degree)) {
        return prev.filter((d) => d !== degree);
      } else {
        return [...prev, degree];
      }
    });
  };

  const handleContinue = () => {
    if (selectedDegrees.length < 3) {
      return; // Button will be disabled, but safety check
    }

    // Encode degrees as comma-separated string
    const degreesParam = selectedDegrees.join(',');
    router.push({
      pathname: '/select-key',
      params: { level: 'custom', customDegrees: degreesParam },
    });
  };

  const canContinue = selectedDegrees.length >= 3;

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 p-6 gap-6 items-center">
        <View className="w-full max-w-3xl gap-6">
          <View className="gap-2">
            <Text className="text-3xl font-bold">Exercício Customizado</Text>
            <Text className="text-muted-foreground text-lg">
              Selecione os graus que deseja praticar
            </Text>
          </View>

          <Card className="p-6 gap-4">
            <View className="gap-3">
              {MUSICAL_DEGREES.map((degree) => {
                const isSelected = selectedDegrees.includes(degree);
                return (
                  <TouchableOpacity
                    key={degree}
                    onPress={() => toggleDegree(degree)}
                    className="flex-row items-center gap-3 p-3 rounded-lg border border-border active:bg-muted"
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleDegree(degree)}
                    />
                    <View className="flex-1 flex-row items-center gap-2">
                      <Text className="text-lg font-semibold">{degree}</Text>
                      <Text className="text-sm text-muted-foreground">
                        {DEGREE_NAMES[degree]}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="mt-4 gap-2">
              <Text className="text-sm text-muted-foreground text-center">
                {selectedDegrees.length === 0
                  ? 'Selecione pelo menos 3 graus'
                  : selectedDegrees.length < 3
                  ? `Selecione mais ${3 - selectedDegrees.length} grau(s)`
                  : ''}
              </Text>
              <Button
                onPress={handleContinue}
                disabled={!canContinue}
                className="w-full"
                size="lg"
              >
                <Text>Continuar</Text>
              </Button>
            </View>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

