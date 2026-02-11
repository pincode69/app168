import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function LaunchScreen() {
  const router = useRouter();

  const handleApp = async () => {
    await AsyncStorage.setItem('wasOnLaunch', 'true');
    // await initializeDefaultLevels();

    router.replace('/(tabs)');
  };  

  return (
    <ImageBackground
      source={require('@/assets/images/content/start-bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          <Image source={require('@/assets/images/content/start.png')} style={styles.logo} />
          <ThemedView style={styles.btnCover}>
            <TouchableOpacity style={styles.btn} onPress={handleApp}>
              <ThemedText type="title" style={styles.btnText}>Start Game</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  safeContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  logo: {
    marginBottom: 50
  },

  btnCover: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    width: '100%',
    position: 'absolute',
    bottom: 80,
  },
  btn: {
    backgroundColor: 'rgba(47, 167, 36, 1)',
    borderColor: 'rgba(81, 81, 81, 1)',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20
  },
  btnText: {
    color: 'white'
  }
});
