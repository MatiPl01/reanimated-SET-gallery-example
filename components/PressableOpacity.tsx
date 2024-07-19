import type {PropsWithChildren} from 'react';
import React from 'react';
import {StyleProp, ViewProps, ViewStyle} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type PressableOpacityProps = PropsWithChildren<{
  onPress?: () => void;
  onLongPress?: () => void;
  minOpacity?: number;
  style?: StyleProp<ViewStyle>;
}> &
  ViewProps;

const PressableOpacity: React.FC<PressableOpacityProps> = ({
  children,
  onPress,
  onLongPress,
  minOpacity = 0.92,
  style,
  ...rest
}) => {
  const active = useSharedValue(false);

  const gesture = Gesture.Tap()
    .maxDuration(4000)
    .onTouchesDown(() => {
      active.value = true;
    })
    .onTouchesUp(() => {
      if (onPress != null) {
        runOnJS(onPress)();
      }
    })
    .onFinalize(() => {
      active.value = false;
    });

  const longPressGesture = Gesture.LongPress().onStart(() => {
    if (onLongPress != null) {
      runOnJS(onLongPress)();
    }
  });

  const opacity = useDerivedValue(() => {
    if (active.value) {
      return minOpacity;
    }
    return withTiming(1);
  }, [minOpacity]);
  const scale = useDerivedValue(() => {
    if (active.value) {
      return 0.95;
    }
    return withTiming(1);
  }, [minOpacity]);

  const rAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active.value ? opacity.value : 1),
      transform: [{scale: withTiming(active.value ? scale.value : 1)}],
    };
  }, [minOpacity]);

  const gestures = Gesture.Exclusive(longPressGesture, gesture);

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View style={[style, rAnimatedStyle]} {...rest}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default PressableOpacity;
