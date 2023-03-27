import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {getProductsByCategory} from '../actions/product';
import {
  HStack,
  Icon,
  Text,
  useBreakpointValue,
  useColorModeValue,
  FlatList,
  Input,
  Center,
  Spinner,
  Select,
  CheckIcon,
  Box,
  Button,
} from 'native-base';
import {Feather, FontAwesome} from '@expo/vector-icons';

import {useWindowDimensions} from 'react-native';
import ListingCard from '../components/ListingCard';
import {Platform} from 'react-native';
import DashboardLayout from '../components/Layouts/DashboardLayout';
import {useIsFocused} from '@react-navigation/native';
import {loadUserFavourites} from '../actions/product';

const FavouritesPage = ({navigation, product, route, loadUserFavourites}) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadUserFavourites();
    }
  }, [isFocused, route, loadUserFavourites]);

  const noColumn = useBreakpointValue({
    base: 2,
    sm: 3,
    md: 3,
    lg: 5,
    xl: 5,
  });
  const {height} = useWindowDimensions();

  return (
    <DashboardLayout title={'Oblíbené'} navigation={navigation}>
      <Box
        px={{base: 2.5, md: '22'}}
        py={{base: '14', md: '22'}}
        rounded={{md: 'sm'}}
        _light={{bg: 'white'}}
        _dark={{bg: 'coolGray.800'}}
        alignItems="center"
      >
        {!product.loading && product.favourites ? (
          product.favourites.length ? (
            Platform.OS === 'web' ? (
              <>
                <HStack
                  flexWrap="wrap"
                  overflow="scroll"
                  height={{base: '100%', md: '100%'}}
                >
                  {product.favourites.map(item => (
                    <ListingCard
                      key={item.id}
                      listing={item}
                      navigation={navigation}
                    />
                  ))}
                </HStack>
              </>
            ) : (
              <>
                <FlatList
                  numColumns={noColumn}
                  data={product.favourites}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => (
                    <ListingCard listing={item} navigation={navigation} />
                  )}
                  key={noColumn}
                  keyExtractor={(item, index) => 'key' + index}
                />
              </>
            )
          ) : (
            <Text>Nebyly nalezeny žádné oblíbené produkty</Text>
          )
        ) : (
          <Center h={'200'}>
            <Spinner />
          </Center>
        )}
      </Box>
    </DashboardLayout>
  );
};

const mapStateToProps = state => ({
  product: state.product,
});

export default connect(mapStateToProps, {loadUserFavourites})(FavouritesPage);
