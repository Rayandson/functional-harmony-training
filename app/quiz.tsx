import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { AudioPlayer } from '@/components/quiz/AudioPlayer';
import { DegreeButton } from '@/components/quiz/DegreeButton';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { useQuiz } from '@/hooks/useQuiz';
import { MUSICAL_DEGREES } from '@/constants/music';
import type { MusicalKey, MusicalDegree, QuizLevel, QuizAnswer } from '@/types';
import { audioService } from '@/services/AudioService';

export default function QuizScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ key: MusicalKey; level: string; customDegrees?: string }>();
  const key = params.key as MusicalKey;
  const level = params.level;
  const customDegrees = params.customDegrees;
  const { startQuiz, currentQuestion, progress, totalQuestions, submitAnswer, isComplete, session } = useQuiz();
  const [selectedDegree, setSelectedDegree] = useState<MusicalDegree | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answerResult, setAnswerResult] = useState<{ isCorrect: boolean; correctDegree: MusicalDegree } | null>(null);
  const autoNextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastQuestion, setLastQuestion] = useState<typeof currentQuestion>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (key && level) {
      if (level === 'custom' && customDegrees) {
        // Parse custom degrees
        const degrees = customDegrees.split(',') as MusicalDegree[];
        startQuiz(key, level, degrees);
      } else {
        const levelNum = parseInt(level || '1', 10) as QuizLevel;
        startQuiz(key, levelNum);
      }
    }
    audioService.setAudioModeAsync();
  }, [key, level, customDegrees]);

  useEffect(() => {
    if (currentQuestion) {
      // Only update lastQuestion when we haven't answered yet (to preserve options order during feedback)
      // When hasAnswered is true, we want to keep the lastQuestion with its original options order
      if (!hasAnswered) {
        // Store the current question
        setLastQuestion(currentQuestion);
        // Reset state when starting a new question
        setSelectedDegree(null);
        setHasAnswered(false);
        setAnswerResult(null);
        setCountdown(null);
        // Clear any pending timeout when starting a new question
        if (autoNextTimeoutRef.current) {
          clearTimeout(autoNextTimeoutRef.current);
          autoNextTimeoutRef.current = null;
        }
        // Clear countdown interval
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
      }
    } else if (!currentQuestion && !hasAnswered && isComplete) {
      // If we've completed the quiz and there's no current question, ensure we navigate
      // This prevents the last question from showing again after completion
      if (session) {
        const resultParams: Record<string, string> = {
          key,
          level,
          correct: session.answers.filter((a: QuizAnswer) => a.isCorrect).length.toString(),
          total: totalQuestions.toString(),
        };
        if (customDegrees) {
          resultParams.customDegrees = customDegrees;
        }
        router.replace({
          pathname: '/result',
          params: resultParams,
        });
      }
    }
  }, [currentQuestion?.id, hasAnswered, isComplete, session, key, level, totalQuestions, router]);

  // Countdown effect
  useEffect(() => {
    if (hasAnswered && countdown !== null && countdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [hasAnswered, countdown]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  if (!key || !session) {
    return null;
  }

  // Use lastQuestion when we've answered (to show feedback with correct options order)
  // Otherwise use currentQuestion (when viewing a new question)
  // Always show lastQuestion when hasAnswered is true, even if complete (to show feedback)
  const displayQuestion = hasAnswered
    ? lastQuestion
    : (currentQuestion || lastQuestion);

  // Calculate the current question number based on which question is being displayed
  // When we haven't answered yet, we're on the next question (progress + 1)
  // When we've answered, we're still on the same question we just answered (progress)
  const getCurrentQuestionNumber = () => {
    if (!session) return 1;

    // If we've answered, we're still showing the same question we just answered
    // progress is the number of answers, which equals the question we just answered
    if (hasAnswered) {
      return Math.min(progress, totalQuestions);
    }

    // If we haven't answered yet, we're on the next question
    return Math.min(progress + 1, totalQuestions);
  };

  // Don't navigate immediately if we just answered - let the feedback show first
  // Only navigate if we're complete AND there's no question to display AND we haven't just answered
  if (isComplete && !displayQuestion && !hasAnswered) {
    const resultParams: Record<string, string> = {
      key,
      level,
      correct: session.answers.filter((a: QuizAnswer) => a.isCorrect).length.toString(),
      total: totalQuestions.toString(),
    };
    if (customDegrees) {
      resultParams.customDegrees = customDegrees;
    }
    router.replace({
      pathname: '/result',
      params: resultParams,
    });
    return null;
  }

  // If we don't have a question to display and haven't answered, we can't show anything
  if (!displayQuestion && !hasAnswered) {
    return null;
  }

  // If we don't have a question to display at all, we can't render
  if (!displayQuestion) {
    return null;
  }

  const handleDegreeSelect = (degree: MusicalDegree) => {
    if (hasAnswered) return;

    // Ensure we have a valid question before submitting
    if (!displayQuestion) {
      return;
    }

    // Prevent submitting if quiz is already complete
    if (isComplete) {
      return;
    }

    // Ensure we have a valid session and question index
    if (!session || session.currentQuestionIndex >= session.questions.length) {
      return;
    }

    // Submit answer immediately when user clicks an option
    const answer = submitAnswer(degree);

    // Check if this will be the last question after submitting (before state updates)
    const willBeComplete = session && (session.answers.length + 1) >= session.questions.length;

    setSelectedDegree(degree);
    setHasAnswered(true);
    setAnswerResult({
      isCorrect: answer.isCorrect,
      correctDegree: answer.correctDegree,
    });

    if (willBeComplete) {
      // For the last question, show feedback for 3 seconds before navigating to result
      setCountdown(3); // Show countdown for 3 seconds
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
      autoNextTimeoutRef.current = setTimeout(() => {
        handleNext();
        autoNextTimeoutRef.current = null;
      }, 3000); // 3 seconds for last question - same as other questions
    } else {
      // For other questions, wait 3 seconds
      setCountdown(3); // Start countdown from 3 seconds
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
      autoNextTimeoutRef.current = setTimeout(() => {
        handleNext();
        autoNextTimeoutRef.current = null;
      }, 3000);
    }
  };

  const handleNext = () => {
    // Clear timeout if exists
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }
    // Clear countdown
    setCountdown(null);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    if (isComplete) {
      // Stop audio before navigating
      // Navigate to result immediately using replace to avoid blank screen
      const resultParams: Record<string, string> = {
        key,
        level,
        correct: session.answers.filter((a: QuizAnswer) => a.isCorrect).length.toString(),
        total: totalQuestions.toString(),
      };
      if (customDegrees) {
        resultParams.customDegrees = customDegrees;
      }
      router.replace({
        pathname: '/result',
        params: resultParams,
      });
      return; // Early return to prevent state reset
    } else {
      // Reset for next question - this will trigger useEffect to reset state
      // But we need to wait for the question to actually change
      setSelectedDegree(null);
      setHasAnswered(false);
      setAnswerResult(null);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 p-6 gap-6 items-center">
        <View className="w-full max-w-3xl gap-6">
          <ProgressBar
            current={getCurrentQuestionNumber()}
            total={totalQuestions}
          />

          <Card className="p-6 gap-6">
            <View className="gap-4">
              <Text className="text-2xl font-bold text-center">
                Qual grau foi tocado?
              </Text>

              {!isComplete && (
                <AudioPlayer
                  audioUri={displayQuestion.audioUri}
                  label="Ouça o acorde"
                  shouldStop={hasAnswered || isComplete}
                />
              )}

              <View className="gap-3">
                {displayQuestion.options.map((degree: MusicalDegree) => {
                  // Show correct answer in green (always when answered)
                  const isCorrectAnswer = hasAnswered && degree === answerResult?.correctDegree;
                  // Show wrong selected answer in red (only if user selected wrong answer)
                  const isWrongAnswer = hasAnswered && !answerResult?.isCorrect && selectedDegree === degree;

                  return (
                    <DegreeButton
                      key={degree}
                      degree={degree}
                      onPress={handleDegreeSelect}
                      isSelected={selectedDegree === degree && !hasAnswered}
                      isCorrect={isCorrectAnswer}
                      isWrong={isWrongAnswer}
                      disabled={hasAnswered}
                    />
                  );
                })}
              </View>

              {hasAnswered && (
                <View className="gap-3">
                  <View className={`p-4 rounded-lg ${answerResult?.isCorrect
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-red-100 border-2 border-red-500'
                    }`}>
                    <Text className={`text-center font-semibold text-lg ${answerResult?.isCorrect ? 'text-green-700' : 'text-red-700'
                      }`}>
                      {answerResult?.isCorrect ? '✓ Correto!' : '✗ Incorreto'}
                    </Text>
                    {!answerResult?.isCorrect && (
                      <Text className="text-center text-red-600 mt-2">
                        A resposta correta era: {answerResult?.correctDegree}
                      </Text>
                    )}
                  </View>
                  <Button
                    onPress={handleNext}
                    className="w-full"
                    size="lg"
                    variant="outline"
                  >
                    <Text>
                      {isComplete ? 'Ver Resultado' : 'Próxima Pergunta'}
                      {countdown !== null && countdown > 0 && ` (${countdown})`}
                    </Text>
                  </Button>
                </View>
              )}
            </View>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

