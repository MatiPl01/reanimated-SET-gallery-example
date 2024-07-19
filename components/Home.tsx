import React from 'react';
import {FlatList, StyleSheet, View, useWindowDimensions} from 'react-native';
import PressableOpacity from './PressableOpacity';
import Pages from './PAGES';
import {AnimatedImage} from './AnimatedImage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image} from 'expo-image';

const DATA = Array.from({length: 20}).map((_, index) => ({
  id: index.toString(),
  url: `https://picsum.photos/600/400?random=${index}`,
}));

const HomeScreen = ({navigation}) => {
  const {width: windowWidth} = useWindowDimensions();

  const fullGap = 20;
  const singleGap = fullGap / 3;

  const itemSize = (windowWidth - fullGap) / 3;

  return (
    <SafeAreaView style={[styles.fillCenter]}>
      <FlatList
        data={DATA}
        numColumns={3}
        contentContainerStyle={{
          marginLeft: singleGap,
          gap: singleGap,
          paddingVertical: 12 + singleGap,
        }}
        renderItem={({item, index}) => {
          return (
            <PressableOpacity
              minOpacity={0.5}
              style={{
                width: windowWidth / 3,
              }}
              onPress={() => {
                navigation.navigate(Pages.EXPANDED_IMAGE, {
                  tag: index.toString(),
                  imageUri: item.url,
                });
              }}>
              <AnimatedImage
                source={{
                  uri: item.url,
                }}
                priority={'high'}
                recyclingKey={item.url}
                contentFit={'cover'}
                cachePolicy={'memory-disk'}
                sharedTransitionTag={index.toString()}
                style={{
                  height: itemSize,
                  width: itemSize,
                }}
              />
              {/* <Image
                source={{
                  uri: item.url,
                }}
                recyclingKey={item.url}
                contentFit={'cover'}
                cachePolicy={'memory-disk'}
                style={[
                  styles.imageBehind,
                  {
                    height: itemSize,
                    width: itemSize,
                  },
                ]}
              /> */}
            </PressableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fillCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBehind: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default HomeScreen;
