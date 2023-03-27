import DashboardLayout from '../components/Layouts/DashboardLayout';
import {
  VStack,
  Box,
  ScrollView,
  Text,
  useBreakpointValue,
  Spinner,
  HStack,
  Center,
  FlatList,
  Icon,
} from 'native-base';
import {Platform} from 'react-native-web';
import React from 'react';
import {getProductsByCategory} from '../actions/product';
import {connect} from 'react-redux';
import {useWindowDimensions} from 'react-native';
import ListingCard from '../components/ListingCard';
import {useIsFocused} from '@react-navigation/native';
const SearchResults = ({
  navigation,
  getProductsByCategory,
  productStore,
  route,
}) => {
  const [categories, setCategories] = React.useState([]);
  const isFocused = useIsFocused();
  const noColumn = useBreakpointValue({
    base: 2,
    sm: 3,
    md: 3,
    lg: 5,
    xl: 5,
  });
  const {height} = useWindowDimensions();
  React.useEffect(() => {
    if (!route.params.search) {
      navigation.navigate('Home');
    }
    getProductsByCategory({search: route.params.search});
  }, [getProductsByCategory, route, isFocused]);
  return (
    <DashboardLayout
      title={'Výsledek vyhledávání ' + '"' + route.params.search + '"'}
      navigation={navigation}
    >
      <Box
        px={{base: 2.5, md: '22'}}
        py={{base: '14', md: '22'}}
        rounded={{md: 'sm'}}
        _light={{bg: 'white'}}
        _dark={{bg: 'coolGray.800'}}
        alignItems="center"
      >
        {!productStore.loading ? (
          productStore.products.listings.data.length ? (
            <>
              <FlatList
                numColumns={noColumn}
                data={productStore.products.listings.data}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <ListingCard listing={item} navigation={navigation} />
                )}
                key={noColumn}
                keyExtractor={(item, index) => 'key' + index}
              />
            </>
          ) : (
            <Text>Nebyly nalezeny žádné produkty</Text>
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
  productStore: state.product,
});
export default connect(mapStateToProps, {getProductsByCategory})(SearchResults);
