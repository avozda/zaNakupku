import React from 'react';
import {
  HStack,
  Text,
  VStack,
  Image,
  Button,
  ScrollView,
  Box,
  Link,
  Hidden,
  Center,
  Spinner,
  useColorModeValue,
} from 'native-base';
import DashboardLayout from '../components/Layouts/DashboardLayout';
import ListingCardVariant from '../components/ListingCardVariant';
import {getMyListings} from '../actions/product';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
function MainContent({navigation, product}) {
  return (
    <>
      <Hidden till="md">
        <HStack
          position={'absolute'}
          zIndex={100}
          mb={4}
          top={{md: -10, base: 5}}
          right={{md: 0, base: 5}}
          justifyContent={'flex-end'}
        >
          <Button
            variant="solid"
            _text={{
              fontWeight: 'bold',
            }}
            onPress={() => navigation.navigate('PostListing')}
            alignSelf={'flex-end'}
          >
            Vytvořit aukci
          </Button>
        </HStack>
      </Hidden>

      <ScrollView>
        {product.loading ? (
          <Center
            px={{base: 4, md: 8, lg: '140'}}
            pt={{base: 5, md: 8}}
            pb={{base: 4, md: 8}}
            rounded={{md: 'sm'}}
            _light={{bg: 'white'}}
            _dark={{
              bg: {md: 'coolGray.800', base: 'coolGray.800'},
            }}
            space="4"
            h={80}
          >
            <Spinner />
          </Center>
        ) : (
          <>
            <Hidden from="md">
              <HStack mt={5} mr={5} mb={7} justifyContent={'flex-end'}>
                <Button
                  onPress={() => navigation.navigate('PostListing')}
                  alignSelf={'flex-end'}
                  _text={{fontWeight: 'bold'}}
                >
                  Přidat aukci
                </Button>
              </HStack>
            </Hidden>
            <VStack
              px={{base: 4, md: 8, lg: '140'}}
              pt={{base: 0, md: 8}}
              pb={{base: 4, md: 8}}
              rounded={{md: 'sm'}}
              _light={{bg: 'white'}}
              _dark={{
                bg: {md: 'coolGray.800', base: 'coolGray.700'},
              }}
              space="4"
            >
              {!product.products.length ? (
                <Center>
                  <Text
                    fontSize="md"
                    color={'coolGray.400'}
                    mt={2}
                    fontWeight="medium"
                  >
                    Zatím nemáte žádné aukce
                  </Text>
                </Center>
              ) : (
                <></>
              )}
              {product.products.length ? (
                product.products.map((item, index) => {
                  return (
                    <ListingCardVariant
                      navigation={navigation}
                      key={index}
                      item={item}
                    />
                  );
                })
              ) : (
                <></>
              )}
            </VStack>
          </>
        )}
      </ScrollView>
    </>
  );
}
const MyListingsPage = ({navigation, product, getMyListings, route}) => {
  const isFocused = useIsFocused();
  React.useEffect(() => {
    if (isFocused) {
      getMyListings();
    }
  }, [getMyListings, isFocused, route]);

  return (
    <>
      <DashboardLayout navigation={navigation} title="Moje aukce">
        <MainContent navigation={navigation} product={product} />
      </DashboardLayout>
    </>
  );
};

const mapStateToProps = state => ({
  product: state.product,
});

export default connect(mapStateToProps, {getMyListings})(MyListingsPage);
