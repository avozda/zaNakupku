import {
  Box,
  HStack,
  Text,
  Pressable,
  Image,
  Button,
  VStack,
  CheckIcon,
  useColorModeValue,
  Skeleton,
} from 'native-base';
import React, {useEffect} from 'react';

const ListingCardVariant = ({
  displaySold = false,
  navigation,
  reviewButton = false,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  return (
    <Box
      _light={{bg: 'coolGray.100'}}
      _dark={{bg: {base: 'coolGray.800', md: 'coolGray.700'}}}
      p={{base: 3, md: 4}}
      borderRadius="sm"
    >
      <HStack alignItems="center" justifyContent="space-between">
        <Text fontSize="xs" _dark={{color: 'coolGray.50'}} fontWeight="normal">
          id: {props.item.id}
        </Text>

        {!reviewButton &&
          props.item.winningUserUsername &&
          props.item.status == 0 && (
            <HStack pt={2}>
              <Text mr={2}>Výherce:</Text>
              <Pressable
                onPress={() => {
                  navigation.navigate('Home', {
                    screen: 'SellerProfile',
                    params: {
                      id: props.item.winningUserId,
                    },
                  });
                }}
              >
                <Text fontWeight={'medium'} color="primary.600">
                  {props.item.winningUserUsername}
                </Text>
              </Pressable>
            </HStack>
          )}
      </HStack>
      <HStack alignItems="center" mt="3" space="3">
        {!imageLoaded ? (
          <Skeleton h={20} width="74" rounded="sm" position={'absolute'} />
        ) : (
          <></>
        )}
        <Image
          onLoad={() => setImageLoaded(true)}
          key={useColorModeValue('logo_light', 'logo_dark')}
          source={
            props.item.listing_images[0]
              ? {uri: props.item.listing_images[0].url}
              : useColorModeValue(
                  require('../../assets/logo/logo-no-background.png'),
                  require('../../assets/logo/logo-white.png'),
                )
          }
          alt="Advertisement"
          rounded="sm"
          resizeMode="contain"
          height="90"
          width="74"
          opacity={imageLoaded ? '100%' : '0%'}
        />

        <Box>
          <Text
            fontSize="md"
            fontWeight="bold"
            _light={{color: 'coolGray.800'}}
            _dark={{color: 'coolGray.50'}}
          >
            {props.item.name.length > 25
              ? `${props.item.name.substring(0, 25)}...`
              : props.item.name}
          </Text>

          <Text
            fontSize="sm"
            _light={{color: 'coolGray.500'}}
            _dark={{color: 'coolGray.400'}}
          >
            {props.item.status == 0 || new Date(props.item.ending) < new Date()
              ? 'Aukce je ukonce'
              : 'Aukce'}
          </Text>
          <Text
            fontSize="sm"
            _light={{color: 'coolGray.500'}}
            _dark={{color: 'coolGray.400'}}
          >
            {props.item.status == 0 || new Date(props.item.ending) < new Date()
              ? props.item.winningUserId
                ? 'Konečná cena'
                : 'Nikdo na aukci nepřihodil'
              : 'Momentální cena'}
          </Text>
          <Text
            mt={0.5}
            fontSize="sm"
            fontWeight="medium"
            _light={{color: 'coolGray.800'}}
            _dark={{color: 'coolGray.50'}}
          >
            {props.item.price + ' Kč'}
          </Text>
        </Box>
      </HStack>
      <HStack justifyContent={'space-between'} alignItems={'flex-end'}>
        <HStack mt="5" flexDirection={{base: 'column', md: 'row'}} space="3">
          <Button
            variant="solid"
            size="sm"
            _text={{fontWeight: 'semibold'}}
            onPress={() =>
              navigation.navigate('Home', {
                screen: 'Product',
                params: {id: props.item.id},
              })
            }
            mb={{base: reviewButton ? 5 : 0, md: 0}}
          >
            Zobrazit detail
          </Button>

          {reviewButton ? (
            <Button
              variant="outline"
              _light={{borderColor: 'coolGray.400'}}
              _dark={{borderColor: 'coolGray.400'}}
              size="sm"
              _text={{fontWeight: 'semibold', color: 'secondary.400'}}
              onPress={() =>
                navigation.navigate('WriteReview', {id: props.item.id})
              }
            >
              Napsat recenzi
            </Button>
          ) : (
            <></>
          )}
        </HStack>
        {displaySold ? (
          props.item.sold ? (
            <HStack alignItems={'center'}>
              <Text
                mr={1}
                fontWeight={'semibold'}
                _light={{color: 'primary.800'}}
                _dark={{color: 'primary.600'}}
              >
                Zaplaceno
              </Text>
              <CheckIcon
                size={'4'}
                _light={{color: 'primary.800'}}
                _dark={{color: 'primary.600'}}
              />
            </HStack>
          ) : (
            <Button
              variant="outline"
              _light={{borderColor: 'primary.800'}}
              _dark={{borderColor: 'primary.500'}}
              size="xs"
              _text={{fontWeight: 'semibold', color: 'primary.800'}}
              onPress={() =>
                navigation.navigate('PaymentPage', {id: props.item.id})
              }
            >
              <Text fontWeight={'semibold'} color={'primary.800'}>
                Zaplatit
              </Text>
            </Button>
          )
        ) : (
          <></>
        )}
      </HStack>
    </Box>
  );
};

export default ListingCardVariant;
