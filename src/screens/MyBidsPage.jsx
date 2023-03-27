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
  Center,
  Spinner,
  useColorModeValue,
} from 'native-base';
import DashboardLayout from '../components/Layouts/DashboardLayout';
import ListingCardVariant from '../components/ListingCardVariant';
import {getMyBids} from '../actions/product';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

function MainContent({navigation, product, isFocused}) {
  return (
    <ScrollView>
      {product.loading ||
      !product.products.active ||
      !product.products.ended ? (
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
          {isFocused &&
          !product.products.active.length &&
          !product.products.ended.length ? (
            <Center
              px={{base: 4, md: 8, lg: '140'}}
              pt={{base: 5, md: 8}}
              pb={{base: 4, md: 8}}
              rounded={{md: 'sm'}}
              _light={{bg: 'white'}}
              _dark={{
                bg: {md: 'coolGray.800', base: 'coolGray.700'},
              }}
              space="4"
              h={80}
            >
              <Text
                fontSize="md"
                mt={2}
                color={useColorModeValue('coolGray.800', 'coolGray.50')}
                fontWeight="medium"
              >
                Zatím nepřihazujete na žádné položky
              </Text>
            </Center>
          ) : (
            <></>
          )}
          {isFocused && product.products.active.length ? (
            <VStack
              px={{base: 4, md: 8, lg: '140'}}
              pt={{base: 5, md: 8}}
              mb={{base: 5, md: 8}}
              pb={{base: 4, md: 8}}
              rounded={{md: 'sm'}}
              _light={{bg: 'white'}}
              _dark={{
                bg: {md: 'coolGray.800', base: 'coolGray.700'},
              }}
              space="4"
            >
              <Text
                fontSize="xl"
                mt={2}
                color={useColorModeValue('coolGray.800', 'coolGray.50')}
                fontWeight="medium"
              >
                Probíhající aukce
              </Text>
              {product.products.active.map((item, index) => {
                return (
                  <ListingCardVariant
                    navigation={navigation}
                    key={index}
                    item={item}
                  />
                );
              })}
            </VStack>
          ) : (
            <></>
          )}

          {isFocused && product.products.ended.length ? (
            <VStack
              px={{base: 4, md: 8, lg: '140'}}
              pt={{base: 5, md: 8}}
              pb={{base: 4, md: 8}}
              rounded={{md: 'sm'}}
              _light={{bg: 'white'}}
              _dark={{
                bg: {md: 'coolGray.800', base: 'coolGray.700'},
              }}
              space="4"
            >
              <Text
                fontSize="xl"
                mt={2}
                color={useColorModeValue('coolGray.800', 'coolGray.50')}
                fontWeight="medium"
              >
                Ukončené aukce
              </Text>
              {product.products.ended.map((item, index) => {
                return (
                  <ListingCardVariant
                    reviewButton={true}
                    key={index}
                    item={item}
                    navigation={navigation}
                    displaySold={true}
                  />
                );
              })}
            </VStack>
          ) : (
            <></>
          )}
        </>
      )}
    </ScrollView>
  );
}
const MyBidsPage = ({navigation, product, getMyBids, route}) => {
  const isFocused = useIsFocused();
  React.useEffect(() => {
    if (isFocused) {
      getMyBids();
    }
  }, [getMyBids, isFocused, route]);

  return (
    <>
      <DashboardLayout navigation={navigation} title="Moje příhozy">
        <MainContent
          navigation={navigation}
          isFocused={isFocused}
          product={product}
        />
      </DashboardLayout>
    </>
  );
};

const mapStateToProps = state => ({
  product: state.product,
});

export default connect(mapStateToProps, {getMyBids})(MyBidsPage);
