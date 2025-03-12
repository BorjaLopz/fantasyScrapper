import { Image, Platform, StyleSheet, Text } from 'react-native';
import { Redirect } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuthSession } from '@/providers/AuthProvider';

export default function HomeScreen() {
  const { token, isLoading } = useAuthSession()
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (token?.current === '') {
    return <Redirect href="/login" />;
  }

  return (
    <div className='flex flex-col items-center bg-base-300 w-full h-full'>
      <div>Partidos</div>
    </div>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
