import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const router = useRouter();  

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const wasOnLaunch = await AsyncStorage.getItem('wasOnLaunch');
      if (wasOnLaunch === 'true') {
        router.replace('/(tabs)');
      } else {
        router.replace('/launch');
      }
    };

    checkFirstLaunch();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}