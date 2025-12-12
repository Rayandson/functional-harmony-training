import { Redirect } from 'expo-router';
import { useUser } from '@/hooks/useUser';
import { WelcomeScreen } from '@/app/welcome';

export default function Index() {
  const { hasUser, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  if (!hasUser) {
    return <WelcomeScreen />;
  }

  return <Redirect href="/menu" />;
}


