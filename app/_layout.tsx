import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import AppNavigator from './app-navigator';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PoppinsBold: require('@/assets/fonts/Poppins-Bold.ttf'),
    // PoppinsRegular: require('@/assets/fonts/Poppins-Regular.ttf'),
    PoppinsMedium: require('@/assets/fonts/Poppins-Medium.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <AppNavigator />;
}
