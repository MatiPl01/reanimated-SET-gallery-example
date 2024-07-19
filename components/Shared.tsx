import React from 'react';
import {useWindowDimensions, StyleSheet} from 'react-native';
import {useCallback} from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {BlurView} from 'expo-blur';
import {AnimatedImage} from './AnimatedImage';

const Shared = ({route, navigation}) => {
  const {tag, imageUri} = route.params;

  const {width: windowWidth, height: windowHeight} = useWindowDimensions();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const offset = useSharedValue({x: 0, y: 0});

  const scale = useDerivedValue(() => {
    const y = Math.abs(offset.value.y);
    return Math.max(1 - y / windowHeight, 0.5);
  }, [windowHeight]);

  const translation = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: offset.value.x * 0.3},
        {translateY: offset.value.y * 0.3},
        {scale: scale.value},
      ],
    };
  });

  const pan = Gesture.Pan()
    .onChange(e => {
      offset.value = {
        x: e.changeX + offset.value.x,
        y: e.changeY + offset.value.y,
      };
      if (Math.abs(offset.value.x) > 150 || Math.abs(offset.value.y) > 250) {
        runOnJS(goBack)();
      }
    })
    .onFinalize(() => {
      offset.value = withSpring(
        {x: 0, y: 0},
        {
          mass: 0.5,
        },
      );
    });

  const imageSize = windowWidth * 0.7;

  return (
    <>
      <BlurView
        intensity={25}
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}
      />
      <GestureDetector gesture={pan}>
        <Animated.View style={styles.fillCenter}>
          <Animated.View style={translation}>
            <AnimatedImage
              source={{
                uri: imageUri,
              }}
              priority={'high'}
              recyclingKey={imageUri}
              cachePolicy={'memory-disk'}
              sharedTransitionTag={tag}
              style={{
                height: imageSize,
                width: windowWidth * 0.9,
                borderRadius: 25,
              }}
              contentFit="cover"
            />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

export const styles = StyleSheet.create({
  fillCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Shared;
