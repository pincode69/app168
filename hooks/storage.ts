import { ScoreType } from '@/constants/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getLevels = async (key: string): Promise<ScoreType[]> => {
  try {
    const list = await AsyncStorage.getItem(key);
    const parsed = list ? JSON.parse(list) : [];

    return Array.isArray(parsed) ? parsed as ScoreType[] : [];
  } catch (error) {
    console.error('Error loading levels:', error);
    return [];
  }
};

export const saveLevel = async (levelKey: string, score: number): Promise<void> => {
  try {
    const list = await getLevels(levelKey);

    if (list.length === 0 || list.every((element: ScoreType) => score > element.score)) {
      list.push({ score });
    
      const sortedList = list.sort((a,b) => b.score - a.score).slice(0, 5);

      await AsyncStorage.setItem(levelKey, JSON.stringify(sortedList));
    }
  } catch (error) {
    console.error('Error saving level:', error);
  }
};
