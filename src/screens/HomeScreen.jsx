import React, {useEffect} from 'react';
import {
  HStack,
  Icon,
  Text,
  VStack,
  Center,
  ScrollView,
  Hidden,
  Divider,
  Input,
  Image,
  Box,
  Pressable,
  Spinner,
  FlatList,
} from 'native-base';
import {getCategories} from '../actions/category';
import {getFeatured} from '../actions/featured';
import {connect} from 'react-redux';
import {AntDesign, MaterialIcons} from '@expo/vector-icons';
import DashboardLayout from '../components/Layouts/DashboardLayout';
import Categories from '../components/Categories';
import {Platform} from 'react-native-web';
import ListingCard from '../components/ListingCard';
import GlobalSearch from '../components/GlobalSearch';
import thousandFormatter from '../utils/thousandFormatter';

const randomMaxPrices = [300, 500, 100, 50, 600, 800, 1000];

function Banner(props) {
  return (
    <VStack
      _light={{bg: 'primary.900'}}
      _dark={{bg: {base: 'coolGray.900', md: 'coolGray.800'}}}
      zIndex={2}
      borderRadius={{md: 4}}
      px={{base: 4, md: 8}}
      pt={{base: 4, md: 8}}
      pb={{base: 4, md: 0}}
      mb={{md: 4}}
    >
      <Hidden till="md">
        {props.navigation.canGoBack() && (
          <Pressable
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <Icon
              size="6"
              pt="0.5"
              as={AntDesign}
              name="arrowleft"
              color="coolGray.50"
            />
          </Pressable>
        )}
      </Hidden>

      <HStack alignItems="center" justifyContent="space-between">
        <VStack space="2" w={{base: '55%', md: '70%'}}>
          <Text
            mt={{base: 4, md: 10}}
            fontSize={{base: 'lg', md: '3xl'}}
            color="coolGray.50"
            fontWeight="bold"
          >
            Vítejte na zaNákupku.cz
          </Text>
          <Text
            w={{md: '300'}}
            mb={{base: 3, md: 8}}
            fontSize={{base: 'xs', md: 'md'}}
            _light={{
              color: 'primary.200',
            }}
            _dark={{
              color: 'coolGray.300',
            }}
          >
            Vyhledejte a vyhrajte aukce za vysněné ceny, a nebo vydělejte na
            nepotřebných předmětech.
          </Text>
        </VStack>

        <Image
          mb={{base: '-21', md: '0'}}
          w={{base: '154', md: '265'}}
          h={{base: '180', md: '224'}}
          resizeMode="contain"
          alt="nointernet"
          source={require('./shoppingPhoto.png')}
        />
      </HStack>
      <Hidden from="md">
        {/* <Input
          mb={-10}
          px={0}
          py={3}
          placeholder="Search"
          _light={{
            bgColor: 'white',
            borderColor: 'coolGray.300',
          }}
          _dark={{
            bgColor: 'coolGray.700',
            borderColor: 'coolGray.500',
          }}
          InputLeftElement={
            <Icon
              as={MaterialIcons}
              name="search"
              _light={{color: 'coolGray.400'}}
              _dark={{color: 'coolGray.400'}}
              size="6"
              ml={3}
              mr={2}
            />
          }
        /> */}
        <Box mb={-10} px={0} py={3}>
          <GlobalSearch
            popupboxSizeProp={'100%'}
            widthProp={'100%'}
            sizeProp={'md'}
            navigation={props.navigation}
          />
        </Box>
      </Hidden>
    </VStack>
  );
}

const HomeScreen = ({
  navigation,
  category,
  featured,
  route,
  getCategories,
  getFeatured,
}) => {
  const [getMaxPrice, setMaxPrice] = React.useState(
    randomMaxPrices[Math.floor(Math.random() * randomMaxPrices.length)],
  );
  React.useEffect(() => {
    getCategories();

    getFeatured(getMaxPrice);
  }, []);

  return (
    <DashboardLayout
      mobileHeader={{
        backButton: false,
      }}
      navigation={navigation}
      displayMenuButton
      displayScreenTitle={false}
      displayAlternateMobileHeader
    >
      <ScrollView>
        <Banner navigation={navigation} />
        <VStack
          pt={{base: 39, md: 8}}
          pb={{base: 10, md: 8}}
          _light={{bg: 'white'}}
          _dark={{bg: 'coolGray.800'}}
          rounded={{md: 'sm'}}
          divider={<Divider />}
          space="5"
        >
          {!category.loading ? (
            <Categories
              navigation={navigation}
              icons={category.categories.data}
            />
          ) : (
            <Center>
              <Spinner />
            </Center>
          )}
          {!featured.loading ? (
            <>
              {featured.randomCategory.listings &&
                featured.randomCategory.listings.length != 0 && (
                  <VStack pb={{base: 8}} px={{base: 4, md: 8}}>
                    <Text
                      _dark={{color: 'coolGray.50'}}
                      _light={{color: 'coolGray.800'}}
                      fontSize="md"
                      fontWeight="bold"
                    >
                      {featured.randomCategory.name}
                    </Text>
                    <FlatList
                      mt={4}
                      data={featured.randomCategory.listings}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      renderItem={({item}) => {
                        return (
                          <Pressable>
                            <ListingCard
                              navigation={navigation}
                              listing={item}
                            />
                          </Pressable>
                        );
                      }}
                      ItemSeparatorComponent={() => <Box w="4" />}
                    />
                  </VStack>
                )}

              {featured.upToMaxPrice.length != 0 && (
                <VStack pb={{base: 8}} px={{base: 4, md: 8}}>
                  <Text
                    _dark={{color: 'coolGray.50'}}
                    _light={{color: 'coolGray.800'}}
                    fontSize="md"
                    fontWeight="bold"
                  >
                    Do {thousandFormatter(getMaxPrice.toString())} Kč
                  </Text>

                  <FlatList
                    mt={4}
                    data={featured.upToMaxPrice}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => {
                      return (
                        <Pressable>
                          <ListingCard navigation={navigation} listing={item} />
                        </Pressable>
                      );
                    }}
                    ItemSeparatorComponent={() => <Box w="4" />}
                  />
                </VStack>
              )}

              {featured.soonEnding.length != 0 && (
                <VStack pb={{base: 8}} px={{base: 4, md: 8}}>
                  <Text
                    _dark={{color: 'coolGray.50'}}
                    _light={{color: 'coolGray.800'}}
                    fontSize="md"
                    fontWeight="bold"
                  >
                    Brzo končí 🌶️
                  </Text>

                  <FlatList
                    mt={4}
                    data={featured.soonEnding}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => {
                      return (
                        <Pressable>
                          <ListingCard navigation={navigation} listing={item} />
                        </Pressable>
                      );
                    }}
                    ItemSeparatorComponent={() => <Box w="4" />}
                  />
                </VStack>
              )}
            </>
          ) : (
            <Center>
              <Spinner p={8} />
            </Center>
          )}
        </VStack>
      </ScrollView>
    </DashboardLayout>
  );
};

const mapStateToProps = state => ({
  category: state.category,
  featured: state.featured,
});

export default connect(mapStateToProps, {getCategories, getFeatured})(
  HomeScreen,
);
