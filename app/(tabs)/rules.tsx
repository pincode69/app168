import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { eggs, eggsImg } from '@/constants/data';
import { EggType } from '@/constants/types';
import { useRouter } from 'expo-router';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RulesScreen() {
  const router = useRouter();
  
  return (
    <ImageBackground
      source={require('@/assets/images/content/rules-bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ThemedView style={styles.btnCover}>
              <TouchableOpacity style={styles.btn} onPress={() => {router.back()}}>
                <ThemedText type="title" style={styles.btnText}>{'<'} EXIT</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.body}>
              <ThemedText type="title" style={styles.title}>Game Rules</ThemedText>
              <ThemedText style={styles.desc}>Collect as many eggs a you can. Do not miss bonus eggs to maximize your score.</ThemedText>
              <ThemedView style={styles.eggs}>
                {eggs.map((egg: EggType) => 
                <ThemedView key={egg.id} style={styles.egg}>
                  <Image source={eggsImg[egg.img]}></Image>
                  <ThemedText style={styles.text}>- {egg.desc}</ThemedText>
                </ThemedView>
                )}
              </ThemedView>
            </ThemedView>
          </ScrollView>
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
    paddingHorizontal: 16,
    flex: 1,
  },

  btnCover: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
    alignSelf: 'flex-start',
    marginBottom: 40
  },
  btn: {
    backgroundColor: 'rgba(47, 167, 36, 1)',
    borderColor: 'rgba(81, 81, 81, 1)',
    borderWidth: 2,
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  btnText: {
  },

  body: {
    borderColor: 'rgba(245, 245, 245, 1)',
    borderWidth: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.66)',
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12
  },
  desc: {
    textAlign: 'center',
    marginBottom: 40
  },
  eggs: {
    gap: 16
  },
  egg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24
  },
  text: {
  }
});
