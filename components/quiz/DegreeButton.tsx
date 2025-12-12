import React from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { MusicalDegree } from '@/types';
import { DEGREE_NAMES } from '@/constants/music';

interface DegreeButtonProps {
  degree: MusicalDegree;
  onPress: (degree: MusicalDegree) => void;
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  disabled?: boolean;
}

export function DegreeButton({
  degree,
  onPress,
  isSelected,
  isCorrect,
  isWrong,
  disabled,
}: DegreeButtonProps) {
  const getVariant = () => {
    // Don't use variant for correct/wrong, we'll use custom styles
    if (isCorrect || isWrong) return 'default';
    if (isSelected) return 'secondary';
    return 'outline';
  };

  const hasAnswered = isCorrect || isWrong;

  const getButtonStyle = () => {
    let baseStyle = 'min-w-[100px] w-full';
    // Priority: wrong answer (red) should override correct answer if both are true (shouldn't happen, but safety)
    if (isWrong) {
      return `${baseStyle} bg-red-500 active:bg-red-600`;
    }
    if (isCorrect) {
      return `${baseStyle} bg-green-500 active:bg-green-600`;
    }
    if (isSelected && !hasAnswered) {
      return `${baseStyle} bg-blue-200 border-2 border-blue-400`;
    }
    return baseStyle;
  };

  const getTextColor = () => {
    if (isCorrect || isWrong) {
      return 'text-white';
    }
    return '';
  };

  return (
    <Button
      onPress={() => onPress(degree)}
      variant={getVariant()}
      disabled={disabled}
      className={getButtonStyle()}
    >
      <View className="flex-row items-center gap-2">
        {hasAnswered && (
          <Text className={`text-xl ${getTextColor()}`}>
            {isWrong ? '✗' : isCorrect ? '✓' : ''}
          </Text>
        )}
        <Text className={`text-lg font-bold ${getTextColor()}`}>{degree}</Text>
        <Text className={`text-sm ${isCorrect || isWrong ? 'text-white opacity-90' : 'opacity-80'}`}>
          {DEGREE_NAMES[degree]}
        </Text>
      </View>
    </Button>
  );
}

