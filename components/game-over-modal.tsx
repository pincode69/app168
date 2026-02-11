import React from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Text as TextSvg } from "react-native-svg";
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface GameOverModalProps {
  visible: boolean;
  score: number;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  score,
  onPlayAgain,
}) => {

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <ImageBackground
          source={require('@/assets/images/game/selebration.png')}
          style={styles.background}
          resizeMode="cover"
        >
          <ThemedText type="title" style={styles.title}>WELL DONE!</ThemedText>

          <ThemedView style={styles.scoreBg}>
            <Image source={require('@/assets/images/game/seleb-chain.png')} style={styles.seleb} />
            <ThemedText style={styles.scoreComment}>YOUR SCORE IS:</ThemedText>
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
                fill="rgba(59, 59, 59, 1)"
                stroke="none"
              >
                {score.toLocaleString('en-US')}
              </TextSvg>
            </Svg>
          </ThemedView>
          
          <ThemedView style={styles.btnWrap}>
            <ThemedView style={styles.btnCover}>
              <TouchableOpacity style={styles.btn} onPress={onPlayAgain}>
                <ThemedText type="title" style={styles.btnText}>OK</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
          
        </ImageBackground>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
  },
  title: {
    textAlign: 'center',
    width: '100%',
    fontSize: 36
  },
  scoreBg: {
    width: '100%',
    position: 'relative',
    alignItems: 'center'
  },
  scoreComment: {
    textAlign: 'center',
    color: 'rgba(59, 59, 59, 1)'
  },
  score: {
    fontSize: 18,
    textAlign: 'center'
  },
  seleb: {
    position: 'absolute',
    bottom: -10
  },

  btnWrap: {
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 80,
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
    borderRadius: 20
  },
  btnText: {
    color: 'white',
    textAlign: 'center'
  }
});
