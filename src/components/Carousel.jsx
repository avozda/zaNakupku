import React from 'react';
import {
  HStack,
  Image,
  Center,
  VStack,
  Pressable,
  useColorModeValue,
} from 'native-base';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
} from 'react-native';

export function Carousel({
  images,
  height,
  activeIndicatorBgColor,
  inactiveIndicatorBgColor,
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [containerWidth, setContainerWidth] = React.useState(0);

  const ref = React.useRef(null);

  React.useEffect(() => {
    if (containerWidth)
      ref.current?.scrollTo({x: activeIndex * containerWidth});
  }, [activeIndex, containerWidth]);

  const timeout = React.useRef(null);

  const onScroll = e => {
    if (containerWidth) {
      if (timeout && timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(() => {
        const nextActiveIndex = Math.round(
          e.nativeEvent.contentOffset.x / containerWidth,
        );
        if (nextActiveIndex !== activeIndex) {
          setActiveIndex(nextActiveIndex);
        } else {
          ref.current?.scrollTo({x: activeIndex * containerWidth});
        }
      }, 50);
    }
  };

  const onMomentumScrollEnd = e => {
    const nextActiveIndex = Math.round(
      e.nativeEvent.contentOffset.x / containerWidth,
    );
    if (activeIndex !== nextActiveIndex) {
      setActiveIndex(nextActiveIndex);
      return nextActiveIndex;
    }
  };

  return (
    <VStack
      flex={1}
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{flex: 1}}
        ref={ref}
        onScroll={Platform.OS === 'web' ? onScroll : undefined}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        pagingEnabled={Platform.OS !== 'web'}
      >
        {images.length ? (
          images.map((image, idx) => {
            return (
              <Image
                key={idx}
                alt="advertisement"
                height={height}
                width={containerWidth}
                source={{uri: image.url}}
              />
            );
          })
        ) : (
          <Image
            p={2}
            alt={'Listing photo'}
            key={useColorModeValue('logo_light', 'logo_dark')}
            height={height}
            width={containerWidth}
            source={useColorModeValue(
              require('../../assets/logo/logo-no-background.png'),
              require('../../assets/logo/logo-white.png'),
            )}
            resizeMode={'contain'}
          />
        )}
      </ScrollView>
      <Center mt={4}>
        <HStack space="1">
          {images.map((_image, index) => {
            return (
              <Pressable onPress={() => setActiveIndex(index)} key={index}>
                <Center
                  p="1"
                  rounded="full"
                  _light={{
                    bg:
                      index === activeIndex
                        ? activeIndicatorBgColor
                        : inactiveIndicatorBgColor,
                  }}
                  _dark={{
                    bg:
                      index === activeIndex
                        ? activeIndicatorBgColor
                        : inactiveIndicatorBgColor,
                  }}
                />
              </Pressable>
            );
          })}
        </HStack>
      </Center>
    </VStack>
  );
}
