import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { useUser } from '@/hooks/useUser';
import { Music, Play } from 'lucide-react-native';

export default function MenuScreen() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 p-6 gap-6 items-center">
        <View className="w-full max-w-3xl gap-6">
          <View className="gap-2">
            <Text className="text-2xl sm:text-3xl font-bold">Olá, {user?.name}!</Text>
            <Text className="text-muted-foreground text-lg">
              Escolha uma modalidade para treinar
            </Text>
          </View>

          <Card className="p-6 gap-4">
            <View className="flex-row items-start gap-3">
              <Music size={24} color="currentColor" className="mt-1 flex-shrink-0" />
              <View className="flex-1">
                <Text className="text-xl font-semibold">Treinar Graus</Text>
                <Text className="text-muted-foreground text-sm">
                  Pratique identificando os graus funcionais do campo harmônico
                </Text>
              </View>
            </View>
            <Button
              onPress={() => router.push('/select-level')}
              className="w-full sm:w-1/2 mx-auto mt-2"
            >
              <Text>Iniciar</Text>
            </Button>
          </Card>

          <Card className="p-6 gap-4">
            <View className="flex-row items-start gap-3">
              <Music size={24} color="currentColor" className="mt-1 flex-shrink-0" />
              <View className="flex-1">
                <Text className="text-xl font-semibold">Treinar Progressões</Text>
                <Text className="text-muted-foreground text-sm">
                  Identifique as progressões harmônicas (Tom C)
                </Text>
              </View>
            </View>
            <Button
              onPress={() => router.push({ pathname: '/context', params: { key: 'C', level: 'progressions' } })}
              className="w-full sm:w-1/2 mx-auto mt-2"
              variant="default"
            >
              <Text>Iniciar</Text>
            </Button>
          </Card>

          <Card className="p-6 gap-4">
            <View className="flex-row items-start gap-3">
              <Play size={24} color="currentColor" className="mt-1 flex-shrink-0" />
              <View className="flex-1">
                <Text className="text-xl font-semibold">Playground</Text>
                <Text className="text-muted-foreground text-sm">
                  Ouça e se familiarize com os graus de forma livre, e se prepare para o quiz
                </Text>
              </View>
            </View>
            <Button
              onPress={() => router.push({ pathname: '/select-key', params: { mode: 'playground' } })}
              variant="outline"
              className="w-full sm:w-1/2 mx-auto mt-2"
            >
              <Text>Explorar</Text>
            </Button>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

