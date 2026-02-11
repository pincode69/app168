import { ListIcon } from '@/components/icons/list';
import { StarIcon } from '@/components/icons/star';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  
  return (
    <ImageBackground
      source={require('@/assets/images/content/bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      
      <SafeAreaProvider style={styles.container}>
        <Image source={require('@/assets/images/content/title-chains.png')} style={styles.logo} />
        <ScrollView
          contentContainerStyle={{gap: 16, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 80}}
        >
          {[...Array(25)].map((_, index) => (
            <ThemedView style={styles.btnCover} key={index}>
              <TouchableOpacity style={styles.btn} onPress={() => { router.push(`/(tabs)/level/level-${index+1}`) }}>
                <ThemedText type="title" style={styles.btnText}>Play ‘Level {index+1}’</ThemedText>
                <ThemedView style={styles.icon}>
                  <Image source={require('@/assets/images/content/button-bg.png')} style={styles.btnBg} />
                  <ThemedText style={styles.text}>{index+1}</ThemedText>
                </ThemedView>
              </TouchableOpacity>
            </ThemedView>
          ))}

          <ThemedView style={styles.btnCover}>
            <TouchableOpacity style={styles.btn} onPress={() => { router.push('/(tabs)/rules') }}>
              <ThemedText type="title" style={styles.btnText}>Game Rules</ThemedText>
              <ThemedView style={styles.icon}>
                <Image source={require('@/assets/images/content/button-bg.png')} style={styles.btnBg} />
                <ListIcon />
              </ThemedView>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.btnCover}>
            <TouchableOpacity style={styles.btn} onPress={() => { router.push('/(tabs)/top') }}>
              <ThemedText type="title" style={styles.btnText}>Top Score</ThemedText>
              <ThemedView style={styles.icon}>
                <Image source={require('@/assets/images/content/button-bg.png')} style={styles.btnBg} />
                <StarIcon />
              </ThemedView>
            </TouchableOpacity>
          </ThemedView>
        </ScrollView>
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
    justifyContent: 'center',
    paddingHorizontal: 16
  },

  logo: {
    resizeMode: 'contain',
    width: '100%',
  },
  btnCover: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
  },
  btn: {
    backgroundColor: 'rgba(47, 167, 36, 1)',
    borderColor: 'rgba(81, 81, 81, 1)',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  btnText: {
  },
  icon: {
    position: 'relative',
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnBg: {
    position: 'absolute',
  },
  text: {
    color: '#3C3C3C',
    fontSize: 30,
    fontFamily: 'PoppinsBold',
    lineHeight: 64,
  }
});
