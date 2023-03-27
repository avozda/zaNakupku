import {
  HStack,
  Icon,
  Text,
  Image,
  IconButton,
  Link,
  Box,
  Pressable,
  useColorModeValue,
  Skeleton,
} from 'native-base';
import {useWindowDimensions} from 'react-native';
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
import React, {useEffect} from 'react';
import moment from 'moment';
import thousandFormatter from '../utils/thousandFormatter';
import {addToFavourite, removeFromFavourite} from '../actions/product';
import {connect} from 'react-redux';
import {Platform} from 'react-native';
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

const ListingCard = ({
  listing,
  navigation,
  user,
  addToFavourite,
  removeFromFavourite,
  product,
  auth,
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const {width: windowWidth} = useWindowDimensions();
  const [favorite, setFavorite] = React.useState(listing.isFavourite);

  const toggleFavourite = () => {
    favorite ? removeFromFavourite(listing.id) : addToFavourite(listing.id);
    setFavorite(prev => !prev);
  };

  return (
    <Box
      _light={{bg: 'primary.50'}}
      _dark={{bg: 'coolGray.700'}}
      width={{
        base: windowWidth / 2 - 22,
        sm: windowWidth / 3 - 22,
        md: windowWidth / 3 - 56,
        lg: windowWidth / 5 - 56,
        xl: '173',
      }}
      p="2"
      borderRadius="sm"
      m={{base: '1.5', md: '2.5'}}
    >
      <Pressable
        position={'relative'}
        onPress={() =>
          navigation.navigate('Home', {
            screen: 'Product',
            params: {id: listing.id},
          })
        }
        borderRadius="sm"
        overflow="hidden"
      >
        {!imageLoaded ? (
          <Skeleton w="100%" h="170" rounded="sm" position={'absolute'} />
        ) : (
          <></>
        )}
        <Image
          onLoad={() => setImageLoaded(true)}
          w="100%"
          h="170"
          key={useColorModeValue('logo_light', 'logo_dark')}
          source={
            listing.listing_images[0]
              ? {uri: listing.listing_images[0].url}
              : useColorModeValue(
                  require('../../assets/logo/logo-no-background.png'),
                  require('../../assets/logo/logo-white.png'),
                )
          }
          alt="Advertisement"
          resizeMode="contain"
          opacity={imageLoaded ? '100%' : '0%'}
        />
      </Pressable>
      <HStack
        mt={'auto'}
        alignItems="center"
        justifyContent={'space-between'}
        space="0.5"
      >
        <Pressable
          onPress={() =>
            navigation.navigate('SellerProfile', {
              id: user ? user.id : listing.user.id,
            })
          }
        >
          <Text color={'primary.900'} fontSize={'xs'}>
            {user ? user.name : listing.user.name}
          </Text>
        </Pressable>

        <HStack>
          <Icon size="3" color="amber.400" as={Ionicons} name={'ios-star'} />
          <Text
            fontSize="2xs"
            _light={{color: 'coolGray.800'}}
            _dark={{color: 'coolGray.50'}}
          >
            {Number(
              user
                ? user.reviews_recipient_of_avg_rating
                : listing.user.reviews_recipient_of_avg_rating,
            ).toFixed()}
          </Text>
          <Text
            fontSize="2xs"
            _light={{color: 'coolGray.500'}}
            _dark={{color: 'coolGray.400'}}
          >
            (
            {user
              ? user.reviews_recipient_of_count
              : listing.user.reviews_recipient_of_count}
            )
          </Text>
        </HStack>
      </HStack>
      <Pressable
        onPress={() => navigation.navigate('Product', {id: listing.id})}
      >
        <Text
          mt="1"
          fontSize="sm"
          _light={{color: 'coolGray.800'}}
          _dark={{color: 'coolGray.50'}}
        >
          {listing.name.length > 20
            ? `${listing.name.substring(0, 20)}...`
            : listing.name}
        </Text>
      </Pressable>
      <HStack alignItems={'center'} justifyContent={'space-between'}>
        <Text
          mt="0.5"
          fontSize="2xs"
          _light={{color: 'coolGray.500'}}
          _dark={{color: 'coolGray.400'}}
        >
          Aukce
        </Text>
        <Text
          mt="0.5"
          fontSize="2xs"
          _light={{color: 'coolGray.500'}}
          _dark={{color: 'coolGray.400'}}
        >
          {listing.status == 0 || new Date(listing.ending) < new Date() ? (
            <>Aukce je ukonce</>
          ) : (
            <>Končí za {calculateRemainingTime(listing.ending)}</>
          )}
        </Text>
      </HStack>

      <HStack mt="1" w="100%" justifyContent="space-between">
        <Text
          fontSize="sm"
          fontWeight="bold"
          _light={{color: 'coolGray.800'}}
          _dark={{color: 'coolGray.50'}}
        >
          {thousandFormatter(listing.price.toString())}
          {' Kč'}
        </Text>
        <Pressable
          onPress={() => {
            if (!auth.isAuthenticated) {
              navigation.navigate('Auth', {screen: 'SignIn'});
              return;
            }
            toggleFavourite();
          }}
          variant={'subtle'}
          _light={{
            bg: 'primary.50',
          }}
          _dark={{
            bg: 'coolGray.700',
          }}
          borderRadius={'sm'}
        >
          <Icon
            size="5"
            name={favorite ? 'favorite' : 'favorite-border'}
            as={MaterialIcons}
            _dark={{color: 'primary.500'}}
            _light={{color: 'primary.900'}}
          />
        </Pressable>
      </HStack>
    </Box>
  );
};

const mapStateToProps = state => ({
  product: state.product,
  auth: state.auth,
});

export default connect(mapStateToProps, {addToFavourite, removeFromFavourite})(
  ListingCard,
);
