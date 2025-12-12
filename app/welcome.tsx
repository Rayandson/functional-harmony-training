import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { useUser } from '@/hooks/useUser';
import { Music } from 'lucide-react-native';

export default function WelcomeScreen() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { createUser } = useUser();
  const router = useRouter();

  const handleSubmit = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Por favor, digite seu nome');
      return;
    }

    if (trimmedName.length < 2) {
      setError('O nome deve ter pelo menos 2 caracteres');
      return;
    }

    try {
      createUser(trimmedName);
      router.replace('/menu');
    } catch (err) {
      setError('Erro ao criar usuário. Tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-blue-50"
    >
      <ScrollView
        contentContainerClassName="flex-1 justify-center items-center p-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-md">
          {/* Header with icon */}
          <View className="items-center mb-8">
            <View className="bg-blue-500 rounded-full p-4 mb-4 shadow-lg">
              <Music size={48} color="white" />
            </View>
            <Text className="text-4xl font-bold text-center text-blue-900 mb-2">
              Harmonia Funcional
            </Text>
            <Text className="text-lg text-center text-blue-700">
              Treine sua percepção harmônica
            </Text>
          </View>

          {/* Card */}
          <Card className="w-full p-8 gap-6 shadow-xl border border-blue-100 bg-white">
            <View className="gap-1 mb-2">
              <Text className="text-base font-semibold text-blue-900">
                Digite seu nome
              </Text>
              <Text className="text-sm text-blue-600">
                Comece sua jornada musical
              </Text>
            </View>

            <View className="gap-4">
              <View className="gap-2">
                <Input
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setError('');
                  }}
                  placeholder="Seu nome"
                  autoFocus
                  onSubmitEditing={handleSubmit}
                  returnKeyType="done"
                  className="border-2 border-blue-200 bg-blue-50"
                />
                {error && (
                  <View className="bg-red-50 border border-red-200 rounded-md p-3">
                    <Text className="text-destructive text-sm">{error}</Text>
                  </View>
                )}
              </View>

              <Button
                onPress={handleSubmit}
                className="w-full bg-blue-500 shadow-lg active:bg-blue-600"
                size="lg"
              >
                <Text className="text-white font-semibold text-lg">Continuar</Text>
              </Button>
            </View>
          </Card>

          {/* Decorative elements */}
          <View className="mt-6 items-center">
            <Text className="text-sm text-blue-600 text-center opacity-70">
              Desenvolva sua habilidade de identificar acordes e graus funcionais
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

