import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  // current is 1-based (Pergunta 1, 2, 3...), so we subtract 1 for percentage calculation
  const percentage = total > 0 ? ((current - 1) / total) * 100 : 0;

  return (
    <View className="w-full gap-2">
      <View className="flex-row justify-between items-center">
        <Text className="text-sm text-muted-foreground">
          Pergunta {current} de {total}
        </Text>
        <Text className="text-sm font-semibold">{Math.round(percentage)}%</Text>
      </View>
      <Progress value={percentage} />
    </View>
  );
}


