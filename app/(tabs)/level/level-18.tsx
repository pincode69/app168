import { GameOverModal } from '@/components/game-over-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { eggs as eggsData, eggsImg } from '@/constants/data';
import { saveLevel } from '@/hooks/storage';
import { useIsFocused } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Svg, { Text as TextSvg } from "react-native-svg";

const LEVEL_KEY = '18';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Egg {
  id: number;
  type: number;
  conveyor: number;
  x: number;
  y: number;
  speed: number;
  collected: boolean;
  animation: Animated.Value;
  liftAnimation: Animated.Value;
}

interface Pipe {
  id: number;
  color: 'blue' | 'red';
  x: number;
  y: number;
  active: boolean;
  animation: Animated.Value;
}

const CONVEYOR_HEIGHT = 140;
const PIPE_WIDTH = 80;
const EGG_SIZE = 40;
const GAME_DURATION = 30000;
const EGG_SPAWN_INTERVAL = 500;

export default function LevelScreen() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION / 1000);
  const [speed, setSpeed] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [eggs, setEggs] = useState<Egg[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const eggSpawnRef = useRef<NodeJS.Timeout | null>(null);
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      let isCancelled = false;

      const loadAndPlaySound = async () => {
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/bg.wav'),
          { isLooping: true }
        );
        if (isCancelled) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
        await sound.playAsync();
      };

      loadAndPlaySound();

      return () => {
        isCancelled = true;
        if (soundRef.current) {
          soundRef.current.stopAsync();
          soundRef.current.unloadAsync();
          soundRef.current = null;
        }
      };
    }, [])
  );

  useEffect(() => {
    startGame();
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (eggSpawnRef.current) clearInterval(eggSpawnRef.current);
      if (timeRef.current) clearInterval(timeRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameActive) {
      eggSpawnRef.current = setInterval(() => {
        spawnEgg();
      }, EGG_SPAWN_INTERVAL) as unknown as NodeJS.Timeout;
    } else {
      if (eggSpawnRef.current) {
        clearInterval(eggSpawnRef.current);
        eggSpawnRef.current = null;
      }
    }

    return () => {
      if (eggSpawnRef.current) {
        clearInterval(eggSpawnRef.current);
        eggSpawnRef.current = null;
      }
    };
  }, [gameActive]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(GAME_DURATION / 1000);
    setEggs([]);
    
    timeRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000) as unknown as NodeJS.Timeout;

    gameLoopRef.current = setInterval(() => {
      updateEggs();
    }, 16) as unknown as NodeJS.Timeout;
  };

  const endGame = async () => {
    const finalScore = scoreRef.current;
    await saveLevel(LEVEL_KEY, finalScore);

    setShowModal(true);
    setGameActive(false);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (eggSpawnRef.current) clearInterval(eggSpawnRef.current);
    if (timeRef.current) clearInterval(timeRef.current);
  };

  const handlePlayAgain = () => {
    scoreRef.current = 0;

    startGame();
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (eggSpawnRef.current) clearInterval(eggSpawnRef.current);
      if (timeRef.current) clearInterval(timeRef.current);
    };
  }

  const spawnEgg = () => {
    if (!gameActive) return;
    
    const eggType = Math.random() < 0.6 ? 1 : Math.floor(Math.random() * 6) + 2;
    const conveyor = Math.floor(Math.random() * 3); // 0-2
    
    const speed = 2 + Math.random() * 2; // 2-4
    
    const newEgg: Egg = {
      id: Date.now() + Math.random(),
      type: eggType,
      conveyor,
      x: -EGG_SIZE,
      y: conveyor * CONVEYOR_HEIGHT + 30 + (conveyor * 20),
      speed,
      collected: false,
      animation: new Animated.Value(0),
      liftAnimation: new Animated.Value(0)
    }; 
    
    Animated.timing(newEgg.animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
    
    setEggs(prev => {
      const newEggs = [...prev, newEgg];
      return newEggs;
    });
  };

  const updateEggs = () => {
    setEggs(prev => {
      const updatedEggs = prev.map(egg => {
        if (egg.collected) return egg;
        
        const newX = egg.x + egg.speed;
        
        if (newX > screenWidth + 50) {
          return { ...egg, collected: true };
        }
        
        return { ...egg, x: newX };
      }).filter(egg => !egg.collected || egg.x < screenWidth + 100);
      
      return updatedEggs;
    });
  };

  const handleButtonPress = (color: 'blue' | 'red') => {
    if (!gameActive) return;
    
    setEggs(prev => prev.map(egg => {
      if (egg.collected) return egg;
      
      const conveyorIndex = egg.conveyor;
      let shouldCollect = false;
      
      if (color === 'red' && conveyorIndex === 0) {
        shouldCollect = egg.x >= 100 && egg.x <= 180;
      } else if (color === 'blue' && conveyorIndex === 1) {
        shouldCollect = egg.x >= 100 && egg.x <= 180;
      } else if (color === 'blue' && conveyorIndex === 2) {
        shouldCollect = egg.x >= 40 && egg.x <= 120;
      }
      
      if (shouldCollect) {
        const eggData = eggsData.find(e => e.id === egg.type);
        if (eggData) {
          handleEggCollection(egg, eggData);
          
          Animated.timing(egg.liftAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true
          })
          .start(() => {
            setEggs(prev => prev.map(e => e.id === egg.id ? { ...e, collected: true } : e));
          });
        }
      }
      
      return egg;
    }));
  };

  const handleEggCollection = (egg: Egg, eggData: any) => {
    if (!eggData) return;
    
    let points = eggData.points;
    let message = '';
    
    switch (eggData.effect) {
      case 'speed_up':
        setSpeed(prev => prev + 1);
        message = 'Прискорення! +50 очок';
        break;
      case 'slow_down':
        setSpeed(prev => Math.max(1, prev - 1));
        message = 'Уповільнення! +50 очок';
        break;
      case 'double_points':
        message = '2x очки! +200 очок';
        break;
      case 'add_time':
        setTimeLeft(prev => Math.min(prev + 5, GAME_DURATION / 1000));
        message = '+5 секунд! +100 очок';
        break;
      case 'penalty':
        message = 'Штраф! -1000 очок';
        break;
      case 'game_over':
        message = 'Game Over яєчко!';
        endGame();
        return;
      default:
        message = `+${points} очок`;
    }

    setScore(prev => {
      const newScore = Math.max(0, prev + points);
      scoreRef.current = newScore;
      return newScore;
    });
    
  };

  const renderEgg = (egg: Egg) => {
    if (egg.collected) return null;
  
    return (
      <Animated.View
        key={egg.id}
        style={[
          styles.egg,
          {
            left: egg.x,
            top: egg.y,
            transform: [
              { scale: egg.animation },
              { translateY: egg.liftAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -50]
              })}
            ]
          }
        ]}
      >
        <Image 
          source={eggsImg[egg.type]} 
          style={styles.eggImage}
          resizeMode="contain"
        />
      </Animated.View>
    );
  };

  const renderRedPipe = () => {
    const pipeImage = require('@/assets/images/game/pipe-red-mirror.png')
    
    return (
      <Animated.View style={styles.pipeRed}>
        <Image 
          source={pipeImage}
          style={styles.pipeRedImage}
        />
      </Animated.View>
    );
  };

  const renderBluePipe = () => {
    const pipeImage = require('@/assets/images/game/pipe-blue.png')
    
    return (
      <Animated.View style={styles.pipe}>
        <Image 
          source={pipeImage} 
          style={[styles.pipeImage]}
        />
      </Animated.View>
    );
  };

  return (
    <ImageBackground
      source={require('@/assets/images/content/level-first-bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ThemedView style={styles.timerSection}>
        <Image source={require('@/assets/images/game/timer-section.png')} style={styles.timerImg} />
        <ThemedText type="title" style={styles.timeText}>00:{timeLeft}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.btnCover}>
        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <ThemedText type="title" style={styles.btnText}>{'<'} EXIT</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      <SafeAreaProvider style={styles.container}>
        <ThemedView style={styles.gameFieldCover}>

          {renderRedPipe()}

            <ThemedView style={styles.gameField}>
              <Image source={require('@/assets/images/game/line.png')} style={[styles.line, styles.line1]} />
              <Image source={require('@/assets/images/game/line.png')} style={[styles.line, styles.line2]} />
              <Image source={require('@/assets/images/game/line.png')} style={[styles.line, styles.line3]} />

              {/* <ThemedView style={[styles.collectZone, styles.zone1]} />
              <ThemedView style={[styles.collectZone, styles.zone2]} />
              <ThemedView style={[styles.collectZone, styles.zone3]} /> */}

              <ThemedView style={styles.speedContainer}>
                <Image source={require('@/assets/images/game/score-bg.png')} style={styles.scoreBg} />
                <Svg height={40} width={160} viewBox={`0 0 ${160} ${40}`}>
                  <TextSvg
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={20}
                    fontFamily={"PoppinsMedium"}
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                  >
                    {"SPEED: " + speed}
                  </TextSvg>

                  <TextSvg
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={20}
                    fontFamily={"PoppinsBold"}
                    fill="rgba(59, 59, 59, 1)"
                    stroke="none"
                  >
                    {"SPEED: " + speed}
                  </TextSvg>
                </Svg>
              </ThemedView>

              <ThemedView style={styles.scoreContainer}>
                <Image source={require('@/assets/images/game/score-bg.png')} style={styles.scoreBg} />
                <Svg height={40} width={160} viewBox={`0 0 ${160} ${40}`}>
                  <TextSvg
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={20}
                    fontFamily={"PoppinsMedium"}
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                  >
                    {score.toLocaleString('en-US')}
                  </TextSvg>

                  <TextSvg
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={20}
                    fontFamily={"PoppinsBold"}
                    fill="rgba(36, 67, 167, 1)"
                    stroke="none"
                  >
                    {score.toLocaleString('en-US')}
                  </TextSvg>
                </Svg>
              </ThemedView>

              {eggs.map((egg) => { return renderEgg(egg); })}
            </ThemedView>

          {renderBluePipe()}          
        </ThemedView>

        <ThemedView style={styles.btns}>
          <TouchableOpacity onPress={() => handleButtonPress('blue')}>
            <Image source={require('@/assets/images/game/btn-blue.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonPress('red')}>
            <Image source={require('@/assets/images/game/btn-red.png')} />
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaProvider>

      <GameOverModal
        visible={!gameActive && showModal} 
        score={score}
        onPlayAgain={handlePlayAgain}
      />
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
  btnCover: {
    marginTop: 60,
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
    alignSelf: 'flex-start',
    zIndex: 4,
    position: 'absolute',
    top: 0
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
    color: 'white',
    fontWeight: 'bold',
  },
  speedContainer: {
    position: 'absolute',
    top: 100,
    right: 16,
    zIndex: 5,
    width: 160,
    height: 40,
    alignItems: 'center'
  },
  scoreBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },

  scoreContainer: {
    position: 'absolute',
    top: 270,
    right: 16,
    zIndex: 5,
    width: 160,
    height: 40,
    alignItems: 'center'
  },

  gameFieldCover: {
    justifyContent: 'center',
    flex: 1,
    position: 'relative'
  },  
  gameField: {
    width: '100%',
    height: 420,
    position: 'relative',
    justifyContent: 'space-between',
  },
  
  line: {
    width: '100%',
    height: CONVEYOR_HEIGHT - 40,
  },

  line1: {
    zIndex:5,
  },
  line2: {
    zIndex: 3,
  },
   line3: {
     zIndex: 3,
   },

  //  if you want to see the tube zones
   collectZone: {
     position: 'absolute',
     height: CONVEYOR_HEIGHT - 40,
     backgroundColor: 'rgba(255, 255, 0, 0.2)',
     borderWidth: 2,
     borderColor: 'rgba(255, 255, 0, 0.5)',
     zIndex: 5,
   },
   zone1: {
     top: 0,
     left: 100,
     width: 80,
   },
   zone2: {
     top: CONVEYOR_HEIGHT,
     left: 100,
     width: 80,
   },
   zone3: {
     top: CONVEYOR_HEIGHT * 2,
     left: 40,
     width: 80,
   },

  pipe: {
    position: 'absolute',
    width: '100%',
    height: 520,
    zIndex: 3,
  },
  pipeImage: {
    width: '100%',
    height: 520,
    top: -140,
    resizeMode: 'stretch',
  },

  pipeRed: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 5,
  },
  pipeRedImage: {
    width: '100%',
    resizeMode: 'stretch',
  },

  egg: {
    position: 'absolute',
    width: EGG_SIZE,
    height: EGG_SIZE,
    zIndex: 5,
  },
  eggImage: {
    width: '100%',
    height: '100%',
  },
  btns: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  timerSection: {
    position: 'absolute',
    resizeMode: 'contain',
    width: '100%',
    zIndex: 2,
    top:-30,
    alignItems: 'center'
  },
  timerImg: {
    resizeMode: 'contain',
  },
  timeText: {
    textAlign: 'center',
    position: 'absolute',
    zIndex: 3,
    bottom: 36,
    lineHeight: 46,
    fontSize: 40,
    color: 'rgba(59, 59, 59, 1)'
  }
});
