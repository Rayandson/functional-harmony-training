import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { useUser } from '@/hooks/useUser';
import WelcomeScreen from '@/app/welcome';

export default function Index() {
  const { hasUser, isLoading } = useUser();

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  }

  if (!hasUser) {
    return <WelcomeScreen />;
  }

  return <Redirect href="/menu" />;
}


