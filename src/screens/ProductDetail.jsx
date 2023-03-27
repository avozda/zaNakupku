import React, {useEffect, useState} from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Avatar,
  Input,
  ScrollView,
  Pressable,
  Button,
  IconButton,
  Stack,
  useColorModeValue,
  InputGroup,
  InputRightAddon,
  Hidden,
  Center,
  Menu,
  Spinner,
} from 'native-base';
import {MaterialIcons, EvilIcons} from '@expo/vector-icons';
import {
  getProduct,
  startLoading,
  createAuctionConnection,
  addToFavourite,
  addBid,
  removeFromFavourite,
} from '../actions/product';
import {connect} from 'react-redux';
import DashboardLayout from '../components/Layouts/DashboardLayout';
import {Carousel} from '../components/Carousel';
import thousandFormatter from '../utils/thousandFormatter';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment/moment';
import {setAlert} from '../actions/alert';

const calculateRemainingTime = date => {
  const start = moment();
  const end = moment(date);

  const duration = moment.duration(end.diff(start));

  if (duration.days()) {
    return duration.days() + 'd';
  }
  if (duration.hours()) {
    return duration.hours() + 'h';
  }
  if (duration.minutes()) {
    return duration.minutes() + 'm';
  }
  if (duration.seconds()) {
    return duration.seconds() + 's';
  }
  return 'Brzy';
};

function ProductInfo({
  productInfo,
  navigation,
  price,
  setPrice,
  currentUser,
  remainingTime,
  setRemainingTime,
}) {
  const textColorA = useColorModeValue('coolGray.800', 'coolGray.50');
  const textColorB = useColorModeValue('coolGray.500', 'coolGray.400');

  useEffect(() => {
    if (productInfo.data.status !== 0) {
      const intervalId = setInterval(() => {
        setRemainingTime(calculateRemainingTime(productInfo.data.ending));
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, []);

  useEffect(() => {
    setPrice(productInfo.data.price);
  }, [productInfo]);

  return (
    <Box>
      <Text fontSize="xl" mt={2} color={textColorA} fontWeight="medium">
        {productInfo.data.name}
      </Text>

      <HStack mb={4}>
        <Text mr={2} fontSize="md" color={textColorB}>
          {moment(productInfo.data.created_at).format('MMM Do YY')}
        </Text>
        <Pressable
          onPress={() => {
            navigation.navigate('SellerProfile', {
              id: productInfo.data.user_id,
            });
          }}
        >
          <Text fontSize="md" fontWeight="normal" color={'primary.900'}>
            {productInfo.data.user.name}
          </Text>
        </Pressable>
      </HStack>

      <HStack justifyContent={'space-between'}>
        <Text
          fontSize="xl"
          fontWeight="medium"
          color={textColorA}
          lineHeight="30"
          mt={2}
        >
          {thousandFormatter(productInfo.data.price.toString()) + ' '}
          Kč
        </Text>
        {productInfo.data.winningUserId == currentUser &&
          (productInfo.data.status == 0 ? (
            <Text
              fontSize="xl"
              fontWeight="medium"
              color={'primary.800'}
              lineHeight="30"
              mt={2}
            >
              Tuto aukci jste vyhráli
            </Text>
          ) : (
            <Text
              fontSize="xl"
              fontWeight="medium"
              color={'primary.800'}
              lineHeight="30"
              mt={2}
            >
              Vyhráváte
            </Text>
          ))}
      </HStack>

      <HStack justifyContent={'space-between'}>
        <Text fontSize="sm" fontWeight="normal" color={textColorB}>
          {productInfo.data.status == 0 ||
          new Date(productInfo.data.ending) < new Date() ? (
            <>Konečná cena</>
          ) : (
            <>Aktuální cena</>
          )}
        </Text>
        <Text fontSize="sm" fontWeight="normal" color={textColorB}>
          {productInfo.data.status == 0 ||
          new Date(productInfo.data.ending) < new Date() ? (
            <>Aukce je ukonce</>
          ) : (
            <>
              {' '}
              Končí za
              {' ' + remainingTime}
            </>
          )}
        </Text>
      </HStack>
      {productInfo.data.status !== 0 ||
      new Date(productInfo.data.ending) > new Date() ? (
        <Stack mt={3}>
          <InputGroup
            w={{
              base: '100%',
              md: '100%',
            }}
          >
            <Input
              keyboardType="numeric"
              placeholder="Zadejte částku k přihození"
              onChangeText={e => setPrice(e)}
              value={price}
              maxLength={10}
              w={'92%'}
            />
            <InputRightAddon children={'Kč'} />
          </InputGroup>
        </Stack>
      ) : (
        <></>
      )}
    </Box>
  );
}
function Description({productDescription, contact, location}) {
  return (
    <ScrollView w={'full'} h="80">
      <Text
        mt="4"
        fontSize="sm"
        fontWeight="normal"
        lineHeight="21"
        _light={{color: 'coolGray.800'}}
        _dark={{color: 'coolGray.50'}}
      >
        {'Lokace: ' + location}
      </Text>
      <Text
        fontSize="sm"
        fontWeight="normal"
        lineHeight="21"
        _light={{color: 'coolGray.800'}}
        _dark={{color: 'coolGray.50'}}
      >
        {'Kontakt: ' + contact}
      </Text>
      <Text
        mt="4"
        fontSize="sm"
        fontWeight="normal"
        lineHeight="21"
        _light={{color: 'coolGray.800'}}
        _dark={{color: 'coolGray.50'}}
      >
        {productDescription}
      </Text>
    </ScrollView>
  );
}
function Review(props) {
  return (
    <ScrollView w={'full'} h="80">
      <VStack mt="5" space="8">
        {props.reviews.map((item, idx) => {
          return (
            <VStack key={idx} space="3">
              <HStack space="2">
                <Avatar
                  bg="emerald.600"
                  height="10"
                  width="10"
                  source={item.imageUrl}
                >
                  {item.author.firstname.substring(0, 1) +
                    item.author.lastname.substring(0, 1)}
                </Avatar>
                <VStack space="1">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    _dark={{color: 'coolGray.50'}}
                    _light={{color: 'coolGray.800'}}
                    lineHeight="21"
                  >
                    {item.author.firstname + ' ' + item.author.lastname}
                  </Text>
                  <HStack>
                    {Array.from({length: item.rating}, (_, index) => (
                      <Icon
                        key={index}
                        as={MaterialIcons}
                        name="star"
                        size="4"
                        color="amber.400"
                      />
                    ))}
                  </HStack>
                </VStack>
                <Text fontSize="sm" ml="auto" lineHeight="21">
                  {moment(item.created_at).format('MMM Do YY')}
                </Text>
              </HStack>
              <Text
                alignItems="center"
                _light={{color: 'coolGray.800'}}
                _dark={{color: 'coolGray.50'}}
                fontSize="sm"
                lineHeight="21"
              >
                {item.body}
              </Text>
            </VStack>
          );
        })}
      </VStack>
    </ScrollView>
  );
}

function Tabs(props) {
  const [tabName, setTabName] = React.useState('Popis');
  const [tabChildren, setTabChildren] = useState(
    <Description
      productDescription={props.product.data.info}
      location={props.product.data.location}
      contact={props.product.data.phone_number}
    />,
  );

  return (
    <>
      <HStack space="5" borderRadius="sm">
        {props.tabs.map(({id, title, component}) => (
          <TabItem
            key={id}
            tabName={title}
            currentTab={tabName}
            handleTabChange={tab => {
              setTabName(tab);
              setTabChildren(component);
            }}
          />
        ))}
      </HStack>
      {tabChildren}
    </>
  );
}
function TabItem({tabName, currentTab, handleTabChange}) {
  return (
    <Pressable onPress={() => handleTabChange(tabName)}>
      <Text
        fontSize="sm"
        fontWeight="medium"
        letterSpacing="0.4"
        _light={{
          color: tabName === currentTab ? 'primary.900' : 'coolGray.500',
        }}
        _dark={{
          color: tabName === currentTab ? 'primary.500' : 'coolGray.400',
        }}
        px={4}
        py={2}
      >
        {tabName}
      </Text>
      {tabName === currentTab && (
        <Box
          borderTopLeftRadius="sm"
          borderTopRightRadius="sm"
          _light={{
            bg: 'primary.900',
          }}
          _dark={{
            bg: 'primary.500',
          }}
          h="1"
        />
      )}
    </Pressable>
  );
}
const AddToCartButton = props => {
  const [favorite, setFavorite] = useState(props.isFavourite);

  React.useEffect(() => {
    if (props.error) {
      setFavorite(prev => !prev);
    }
  }, [props.error]);

  return (
    <HStack space="4" alignItems="center">
      <Pressable
        onPress={() => {
          setFavorite(prev => !prev);
          props.addListingToFavourite();
        }}
        variant={'subtle'}
        _light={{
          bg: 'primary.50',
        }}
        _dark={{
          bg: 'coolGray.700',
        }}
        p={2.5}
        borderRadius={'sm'}
      >
        <Icon
          size="6"
          name={favorite ? 'favorite' : 'favorite-border'}
          as={MaterialIcons}
          _dark={{color: 'primary.500'}}
          _light={{color: 'primary.900'}}
        />
      </Pressable>
      <Button
        flex={1}
        size="lg"
        variant="solid"
        onPress={() => {
          props.bidAction(props.price);
        }}
      >
        <Text fontWeight={'semibold'} color="white">
          Přihodit
        </Text>
      </Button>
    </HStack>
  );
};
const ProductDetail = ({
  getProduct,
  addToFavourite,
  auth,
  setAlert,
  removeFromFavourite,
  createAuctionConnection,
  addBid,
  navigation,
  product,
  route,
}) => {
  const [price, setPrice] = React.useState(0);
  const [remainingTime, setRemainingTime] = React.useState('...');

  const changePrice = newPrice => {
    if (newPrice != '') {
      setPrice(thousandFormatter(newPrice.toString().replace(/[^0-9]/g, '')));
      return;
    }
    setPrice('');
  };
  const isFocused = useIsFocused();
  const tabs = [
    {
      id: 1,
      title: 'Popis',
      component: !product.loading && product.product.data && (
        <Description productDescription={product.product.data.info} />
      ),
    },
    {
      id: 2,
      title: 'Recenze',
      component: !product.loading && product.product.data && (
        <Review reviews={product.product.data.user.reviews_recipient_of} />
      ),
    },
  ];

  React.useEffect(() => {
    if (!route.params.id || isNaN(route.params.id)) {
      navigation.navigate('Main');
      return;
    }
    getProduct(route.params.id);
    createAuctionConnection(route.params.id);
  }, [route, getProduct, isFocused]);
  React.useEffect(() => {
    console.log(product);
  }, [product]);

  const goToCategory = () => {
    navigation.navigate('Listings', {
      categoryCode: product.product.data.category.code,
    });
  };

  const addListingToFavourite = () => {
    if (!auth.isAuthenticated) {
      navigation.navigate('Auth', {screen: 'SignIn'});
      return;
    }
    product.product.data.isFavourite
      ? removeFromFavourite(route.params.id)
      : addToFavourite(route.params.id);
  };

  const bid = amount => {
    amount = amount.replace(' ', '');
    if (!auth.isAuthenticated) {
      navigation.navigate('Auth', {screen: 'SignIn'});
      return;
    }

    if (parseInt(amount) <= product.product.data.price) {
      setAlert('Částka musí být vyšší než momentální nejvyšší příhoz', 'error');
      return;
    }
    addBid({
      amount: parseInt(amount),
      user_id: auth.user.id,
      listing_id: product.product.data.id,
    });
  };

  return (
    <DashboardLayout
      title={
        !product.loading &&
        product.product.data &&
        product.product.data.category.name +
          ' - ' +
          product.product.data.name.substring(0, 10)
      }
      titleLink={!product.loading && product.product.data && goToCategory}
      displaySidebar={false}
      navigation={navigation}
    >
      <ScrollView>
        <Stack
          px={{base: '4', md: '8'}}
          py={{base: '5', md: '8'}}
          flex={1}
          rounded={{md: 'sm'}}
          _light={{bg: 'white'}}
          _dark={{bg: 'coolGray.800'}}
          direction={{base: 'column', md: 'row'}}
        >
          {product.loading || !product.product.data ? (
            <Center
              borderRadius="md"
              w={'full'}
              h={{base: '262', md: '652'}}
              mr={{base: 0, md: 4}}
              mt={{base: 4, md: 4}}
              bg={{base: 'transparent', md: 'transparent'}}
            >
              {product.error ? (
                <Text>Něco se nepovedlo</Text>
              ) : (
                <Spinner size={'lg'} />
              )}
            </Center>
          ) : (
            <>
              <Box
                p={2}
                _light={{bg: 'primary.50'}}
                _dark={{bg: 'coolGray.700'}}
                borderRadius="md"
                w={{base: '100%', md: '55%'}}
                h={{base: '262', md: '652'}}
                mr={{base: 0, md: 4}}
                mt={{base: 4, md: 4}}
                bg={{base: 'transparent', md: 'transparent'}}
              >
                <Carousel
                  activeIndicatorBgColor="primary.700"
                  inactiveIndicatorBgColor="coolGray.300"
                  images={product.product.data.listing_images}
                />
              </Box>
              <Hidden from="md">
                <VStack space="5">
                  <ProductInfo
                    productInfo={product.product}
                    navigation={navigation}
                    price={price}
                    setPrice={changePrice}
                    currentUser={auth.user && auth.user.id}
                    remainingTime={remainingTime}
                    setRemainingTime={setRemainingTime}
                  />
                  <Tabs tabs={[...tabs]} product={product.product} />
                  {product.product.data.status !== 0 ||
                  new Date(product.product.data.ending) > new Date() ? (
                    <AddToCartButton
                      bidAction={bid}
                      error={product.favouriteError}
                      isFavourite={product.product.data.isFavourite}
                      addListingToFavourite={addListingToFavourite}
                      price={price}
                    />
                  ) : (
                    <></>
                  )}
                </VStack>
              </Hidden>
              <Hidden till="md">
                <VStack space="5" flex={1}>
                  <ProductInfo
                    navigation={navigation}
                    productInfo={product.product}
                    price={price}
                    setPrice={changePrice}
                    currentUser={auth.user && auth.user.id}
                    remainingTime={remainingTime}
                    setRemainingTime={setRemainingTime}
                  />
                  {product.product.data.status !== 0 ||
                  new Date(product.product.data.ending) > new Date() ? (
                    <AddToCartButton
                      bidAction={bid}
                      error={product.favouriteError}
                      isFavourite={product.product.data.isFavourite}
                      addListingToFavourite={addListingToFavourite}
                      price={price}
                    />
                  ) : (
                    <></>
                  )}
                  <Tabs product={product.product} tabs={tabs} />
                </VStack>
              </Hidden>
            </>
          )}
        </Stack>
      </ScrollView>
    </DashboardLayout>
  );
};
const mapStateToProps = state => ({
  product: state.product,
  auth: state.auth,
});
export default connect(mapStateToProps, {
  getProduct,
  startLoading,
  addToFavourite,
  removeFromFavourite,
  addBid,
  createAuctionConnection,
  setAlert,
})(ProductDetail);
