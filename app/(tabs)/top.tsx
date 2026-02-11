import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScoreType } from '@/constants/types';
import { getLevels } from '@/hooks/storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type LevelScores = {
  level: number;
  scores: ScoreType[];
};

export default function TopScreen() {
  const router = useRouter();
  const [allScores, setAllScores] = useState<LevelScores[]>([]);

  useEffect(() => {
    const loadAllScores = async () => {
      const levels: LevelScores[] = [];

      for (let i = 1; i <= 25; i++) {
        const key = `${i}`; // тепер ключ — просто число в текстовому вигляді
        const scores = await getLevels(key);
        levels.push({ level: i, scores });
      }

      setAllScores(levels);
    };

    loadAllScores();
  }, []);

  return (
    <ImageBackground
      source={require('@/assets/images/content/top-bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ThemedView style={styles.btnCover}>
              <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
                <ThemedText type="title" style={styles.btnText}>{'<'} EXIT</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.body}>
              <ThemedText type="title" style={styles.title}>Top Score</ThemedText>

              {allScores.every(level => level.scores.length === 0) ? (
                <ThemedText>No scores yet</ThemedText>
              ) : (
                <ThemedView style={styles.scores}>
                  {allScores.map(({ level, scores }) => (
                    scores.length > 0 && (
                      <ThemedView key={level} style={styles.level}>
                        <ThemedText>Level {level}:</ThemedText>
                        <ThemedView style={styles.scoreList}>
                          {scores.map((item, index) => (
                            <ThemedView key={index} style={styles.score}>
                              <ThemedText>{index + 1}.</ThemedText>
                              <ThemedText>{item.score.toLocaleString('en-US')}</ThemedText>
                            </ThemedView>
                          ))}
                        </ThemedView>
                      </ThemedView>
                    )
                  ))}
                </ThemedView>
              )}
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
  scores: {
    gap: 24
  },
  level: {
    gap: 12
  },
  scoreList: {
    gap: 8
  },
  score: {
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)'
  }
});
