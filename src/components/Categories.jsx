import React from 'react';
import {
  Box,
  Icon,
  Text,
  VStack,
  FlatList,
  Center,
  IconButton,
  Pressable,
} from 'native-base';
import {MaterialIcons} from '@expo/vector-icons';

const Categories = ({icons, navigation}) => {
  return (
    <VStack px={{base: 4, md: 8}}>
      <Text
        _dark={{color: 'coolGray.50'}}
        _light={{color: 'coolGray.800'}}
        fontSize="md"
        fontWeight="bold"
      >
        Kategorie
      </Text>
      <FlatList
        mt={4}
        data={icons}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <Box w="8" />}
        renderItem={({item}) => (
          <VStack space="2" alignItems="center">
            <Pressable
              alignItems={'center'}
              onPress={() =>
                navigation.navigate('Listings', {categoryCode: item.code})
              }
            >
              <Center
                _light={{bg: 'primary.100'}}
                _dark={{bg: 'coolGray.700'}}
                rounded="full"
                mb={2}
                w={{base: 10, md: 12}}
                h={{base: 10, md: 12}}
              >
                <Icon
                  as={MaterialIcons}
                  name={item.icon}
                  _light={{color: 'primary.900'}}
                  _dark={{color: 'coolGray.50'}}
                  size={6}
                />
              </Center>

              <Text
                fontSize={{base: 'xs', md: 'sm'}}
                _light={{color: {base: 'coolGray.800', md: 'coolGray.500'}}}
                _dark={{color: {base: 'coolGray.50', md: 'coolGray.400'}}}
                textAlign="center"
              >
                {item.name}
              </Text>
            </Pressable>
          </VStack>
        )}
      />
    </VStack>
  );
};

export default Categories;
