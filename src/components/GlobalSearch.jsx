import {
  Text,
  Input,
  Box,
  Icon,
  HStack,
  Spinner,
  VStack,
  Pressable,
  FlatList,
  useColorModeValue,
  Image,
  Center,
  Divider,
} from 'native-base';
import React from 'react';
import {FontAwesome, Feather, MaterialIcons} from '@expo/vector-icons';
import {connect} from 'react-redux';
import {globalSearch, resetSearch} from '../actions/globalSearch';

const GlobalSearch = ({
  globalSearch,
  globalSearchStore,
  resetSearch,
  navigation,
  widthProp,
  sizeProp,
  popupboxSizeProp,
}) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [timer, setTimer] = React.useState(null);

  const search = searchTerm => {
    setSearchValue(searchTerm);

    resetSearch();
    clearTimeout(timer);
    if (searchTerm.length > 2) {
      const newTimer = setTimeout(async () => {
        globalSearch(searchTerm);
      }, 300);
      setTimer(newTimer);
    }
  };
  return (
    <Box w={{base: '100%', md: '80%'}} alignItems={'center'} zIndex={1}>
      {searchValue.length > 2 ? (
        <Box
          width={popupboxSizeProp}
          borderWidth={1}
          borderTopWidth={0}
          borderRadius={'sm'}
          _light={{
            bgColor: 'white',
            borderColor: '#d4d4d4',
          }}
          _dark={{
            bgColor: 'coolGray.900',
            borderColor: 'black',
          }}
          bottomt={0}
          mt={6}
          zIndex={1}
          pt={6}
          position={'absolute'}
        >
          {globalSearchStore.loading ? (
            <HStack space={2} pb={6} pt={4} justifyContent="center">
              <Spinner accessibilityLabel="Loading" />
            </HStack>
          ) : (
            <>
              <VStack px={2} pb={6}>
                {globalSearchStore.categories.length > 0 ? (
                  <>
                    <Text fontWeight={'bold'}>
                      Kategorie ({globalSearchStore.categories.length})
                    </Text>
                    <FlatList
                      mt={2}
                      data={globalSearchStore.categories}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      ItemSeparatorComponent={() => <Box w="4" />}
                      renderItem={({item}) => (
                        <VStack space="2" alignItems="center">
                          <Pressable
                            alignItems={'center'}
                            onPress={() =>
                              navigation.navigate('Listings', {
                                categoryCode: item.code,
                              })
                            }
                          >
                            <Center
                              _light={{bg: 'primary.100'}}
                              _dark={{bg: 'coolGray.700'}}
                              rounded="full"
                              w={{base: 8, md: 10}}
                              h={{base: 8, md: 10}}
                            >
                              <Icon
                                as={MaterialIcons}
                                name={item.icon}
                                _light={{color: 'primary.900'}}
                                _dark={{color: 'coolGray.50'}}
                                size={5}
                              />
                            </Center>

                            <Text
                              mt={1}
                              fontSize={{base: 'xs', md: 'sm'}}
                              _light={{
                                color: {
                                  base: 'coolGray.800',
                                  md: 'coolGray.500',
                                },
                              }}
                              _dark={{
                                color: {
                                  base: 'coolGray.50',
                                  md: 'coolGray.400',
                                },
                              }}
                              textAlign="center"
                            >
                              {item.name}
                            </Text>
                          </Pressable>
                        </VStack>
                      )}
                    />
                  </>
                ) : (
                  <></>
                )}

                {globalSearchStore.listings.length > 0 ? (
                  <>
                    <Text mt={3} fontWeight={'bold'}>
                      Produkty ({globalSearchStore.listings.length})
                    </Text>
                    <VStack>
                      {globalSearchStore.listings.slice(0, 5).map(listing => (
                        <Pressable
                          key={listing.id}
                          onPress={() => {
                            setSearchValue('');
                            navigation.navigate('Home', {
                              screen: 'Product',
                              params: {id: listing.id},
                            });
                          }}
                        >
                          <Box
                            _light={{bg: 'primary.50'}}
                            _dark={{bg: 'coolGray.700'}}
                            width={'full'}
                            p="2"
                            borderRadius="sm"
                            mt={{base: '1.5', md: '2.5'}}
                          >
                            <HStack>
                              <Image
                                h="50"
                                width={'20%'}
                                mr={2}
                                key={useColorModeValue(
                                  'logo_light',
                                  'logo_dark',
                                )}
                                source={
                                  listing.listing_images[0]
                                    ? {uri: listing.listing_images[0].url}
                                    : useColorModeValue(
                                        require('../../assets/logo/logo-no-background.png'),
                                        require('../../assets/logo/logo-white.png'),
                                      )
                                }
                                alt="Alternate Text"
                                resizeMode="contain"
                              />
                              <Text
                                maxW={'250px'}
                                _light={{color: 'coolGray.800'}}
                                _dark={{color: 'coolGray.50'}}
                                key={listing.id}
                              >
                                {listing.name.length > 45
                                  ? listing.name.substring(0, 50) + '...'
                                  : listing.name}
                              </Text>
                            </HStack>
                          </Box>
                        </Pressable>
                      ))}
                    </VStack>
                  </>
                ) : (
                  <></>
                )}
              </VStack>
            </>
          )}
          {globalSearchStore.listings.length > 5 ? (
            <Pressable
              onPress={() => {
                setSearchValue('');
                navigation.navigate('SearchResults', {search: searchValue});
              }}
            >
              <Box
                mt={'auto'}
                textAlign={'center'}
                p={2}
                bgColor={'primary.800'}
                w="full"
              >
                <Text
                  color={'white'}
                  fontWeight={'bold'}
                  textAlign={'center'}
                  w="full"
                >
                  Zobrazit vše
                </Text>
              </Box>
            </Pressable>
          ) : (
            <></>
          )}
          {!globalSearchStore.loading &&
          globalSearchStore.listings &&
          globalSearchStore.listings.length == 0 &&
          globalSearchStore.categories &&
          globalSearchStore.categories.length == 0 ? (
            <Center>
              <Text mb={2} fontWeight={'medium'}>
                Nebyly nazeleny žádné výsledky
              </Text>
            </Center>
          ) : (
            <></>
          )}
        </Box>
      ) : (
        <></>
      )}

      <Input
        zIndex={2}
        w={widthProp}
        autoComplete="off"
        size={sizeProp}
        value={searchValue}
        name="Global search"
        _light={{
          bgColor: 'white',
        }}
        _dark={{
          bgColor: 'coolGray.900',
        }}
        position={'relative'}
        onChangeText={search}
        placeholder="Vyhledávání"
        InputLeftElement={
          <Icon
            px="2"
            pr={4}
            size="4"
            name={'search'}
            as={FontAwesome}
            _light={{
              color: 'coolGray.400',
            }}
            _dark={{
              color: 'coolGray.100',
            }}
          />
        }
        InputRightElement={
          searchValue.length !== 0 ? (
            <Pressable
              onPress={() => {
                search('');
                setSearchValue('');
              }}
            >
              <Icon
                pr={8}
                size="4"
                name={'x'}
                as={Feather}
                _light={{
                  color: 'coolGray.400',
                }}
                _dark={{
                  color: 'coolGray.100',
                }}
              />
            </Pressable>
          ) : (
            <></>
          )
        }
      />
    </Box>
  );
};

const mapStateToProps = state => ({
  globalSearchStore: state.globalSearch,
});

export default connect(mapStateToProps, {globalSearch, resetSearch})(
  GlobalSearch,
);
