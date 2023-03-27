import React, {useState} from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Image,
  Button,
  TextArea,
  Link,
  Center,
  Pressable,
  Spinner,
  FormControl,
  Input,
  useColorModeValue,
} from 'native-base';
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import DashboardLayout from '../components/Layouts/DashboardLayout';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useIsFocused} from '@react-navigation/native';
import {setAlert} from '../actions/alert';
import {getProduct} from '../actions/product';
import {addReview} from '../actions/profile';

function ReviewTitle({setReviewTitle, reviewTitle}) {
  return (
    <Box
      mt={{base: 4, md: 8}}
      py={{base: 4, md: 0}}
      px={{base: 0, md: 0}}
      _light={{bg: 'white'}}
      _dark={{bg: 'coolGray.800'}}
    >
      <Text
        fontSize="sm"
        fontWeight="medium"
        _light={{color: 'coolGray.800'}}
        _dark={{color: 'coolGray.50'}}
      >
        Nadpis
      </Text>
      <FormControl isRequired mt="3">
        <Input
          placeholder="Zadejte nadpis recenze"
          value={reviewTitle}
          onChangeText={e => {
            e.length < 100 && setReviewTitle(e);
          }}
          _light={{placeholderTextColor: 'coolGray.500'}}
          _dark={{placeholderTextColor: 'coolGray.400'}}
          py={3}
        />
      </FormControl>
    </Box>
  );
}

function ItemCard({productInfo}) {
  return (
    <HStack
      space={3}
      p={3}
      borderRadius="sm"
      _light={{bg: 'coolGray.100'}}
      _dark={{bg: 'coolGray.700'}}
      w="full"
    >
      <Image
        key={useColorModeValue('logo_light', 'logo_dark')}
        source={
          productInfo.listing_images[0]
            ? {uri: productInfo.listing_images[0].url}
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
      />
      <Box>
        <Text
          fontSize="md"
          fontWeight="bold"
          _light={{color: 'coolGray.800'}}
          _dark={{color: 'coolGray.50'}}
        >
          {productInfo.name.substring(0, 25)}
          {productInfo.name.length > 25 && '...'}
        </Text>
        <Text
          fontSize="sm"
          _dark={{color: 'coolGray.400'}}
          _light={{color: 'coolGray.500'}}
        >
          {productInfo.category.name}
        </Text>
        <Text
          fontWeight="medium"
          fontSize="sm"
          _dark={{color: 'coolGray.50'}}
          _light={{color: 'coolGray.800'}}
          mt="auto"
        >
          {productInfo.price + ' Kč'}
        </Text>
      </Box>
    </HStack>
  );
}
function RateStar(props) {
  return (
    <Pressable
      onPress={() => {
        props.setSelected(props.index);
      }}
    >
      <Icon
        size={6}
        p={0}
        as={MaterialIcons}
        name="star-outline"
        _dark={{
          color: props.selected < props.index ? 'coolGray.400' : 'amber.400',
        }}
        _light={{
          color: props.selected < props.index ? 'coolGray.500' : 'amber.400',
        }}
      />
    </Pressable>
  );
}

function Description({desc, setDesc}) {
  return (
    <Box
      p={{base: 4, md: 0}}
      _light={{bg: 'white'}}
      _dark={{bg: 'coolGray.800'}}
    >
      <Text
        fontSize="sm"
        fontWeight="medium"
        _light={{color: 'coolGray.800'}}
        _dark={{color: 'coolGray.50'}}
      >
        Share your experience
      </Text>
      <TextArea
        value={desc}
        onChangeText={setDesc}
        h={119}
        mt={3}
        placeholder="Would you like to write about the product?"
        _light={{borderColor: 'coolGray.300'}}
        _dark={{borderColor: 'coolGray.700'}}
        placeholderTextColor="coolGray.400"
      />
    </Box>
  );
}
function SubmitButton({onSubmit, loading, posted}) {
  return (
    <Button
      onPress={() => onSubmit()}
      mt="auto"
      size="lg"
      variant="solid"
      mx={{base: 4, md: 0}}
    >
      {loading && posted ? <Spinner color={'white'} /> : 'Napsat recenzi'}
    </Button>
  );
}
function MainContent({
  product,
  addReview,
  navigation,
  user_id,
  loading,
  setAlert,
}) {
  const [selected, setSelected] = useState(-1);
  const [reviewTitle, setReviewTitle] = useState('');
  const [desc, setDesc] = React.useState('');
  const [posted, setPosted] = React.useState(false);

  const sendReview = () => {
    if (
      selected == -1 ||
      reviewTitle.replace(' ', '') == '' ||
      desc.replace(' ', '') == ''
    ) {
      setAlert('Prosím vyplňte všechna pole', 'error');
      return;
    }
    setPosted(true);
    addReview(
      {
        body: desc,
        rating: selected,
        created_by_id: user_id,
        header: reviewTitle,
        user_id: product.product.data.user.id,
      },
      navigation,
    );
  };

  return product.loading || !product.product.data ? (
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
    <KeyboardAwareScrollView
      contentContainerStyle={{flexGrow: 1}}
      bounces={false}
      enableOnAndroid={true}
      extraScrollHeight={150}
    >
      <VStack
        flex={1}
        space={{base: 4, md: 8}}
        _light={{bg: {md: 'white'}}}
        _dark={{bg: {base: 'coolGray.700', md: 'coolGray.800'}}}
        px={{base: 0, md: 8, lg: 35}}
        pt={{base: 0, md: 8}}
        pb={{base: 4, md: 8}}
        rounded={{md: 'sm'}}
      >
        <Box
          p={{base: 4, md: 0}}
          _light={{bg: 'white'}}
          _dark={{bg: 'coolGray.800'}}
        >
          <ItemCard productInfo={product.product.data} />
          <ReviewTitle
            setReviewTitle={setReviewTitle}
            reviewTitle={reviewTitle}
          />
          <VStack space="3" mt={{base: 6, md: 8}}>
            <Text
              _light={{color: 'coolGray.800'}}
              _dark={{color: 'coolGray.50'}}
              fontWeight="medium"
              fontSize="sm"
            >
              Rate your experience
            </Text>
            <HStack alignItems="center" space="4">
              {Array.from({length: 5}, (_, index) => (
                <RateStar
                  key={index}
                  index={index}
                  selected={selected}
                  setSelected={setSelected}
                />
              ))}
            </HStack>
            <Text fontSize="sm" color="coolGray.400">
              Tap the stars
            </Text>
          </VStack>
        </Box>
        <Description desc={desc} setDesc={setDesc} />
        <SubmitButton posted={posted} loading={loading} onSubmit={sendReview} />
      </VStack>
    </KeyboardAwareScrollView>
  );
}
const WriteReview = ({
  navigation,
  route,
  auth,
  product,
  getProduct,
  profile,
  setAlert,
  addReview,
}) => {
  const isFocused = useIsFocused();
  React.useEffect(() => {
    if (!route.params.id || isNaN(route.params.id)) {
      navigation.navigate('Main');
      return;
    }
    getProduct(route.params.id);
  }, [route, getProduct, isFocused]);

  React.useEffect(() => {
    if (isFocused && product.product.data) {
      if (new Date(product.product.data.ending) > new Date()) {
        navigation.navigate('MyBids', {screen: 'MyBidsPage'});
      }
    }
  }, [product]);

  const goToUser = () => {
    navigation.navigate('Home', {
      screen: 'SellerProfile',
      params: {
        categoryCode: product.product.data.category.code,
      },
    });
  };

  return (
    <DashboardLayout
      navigation={navigation}
      title={
        !product.loading &&
        product.product.data &&
        product.product.data.user.name + ' - ' + 'Napsat recenzi'
      }
      titleLink={!product.loading && product.product.data && goToUser}
    >
      <MainContent
        addReview={addReview}
        navigation={navigation}
        product={product}
        user_id={auth.user && auth.user.id}
        loading={profile.loading}
        setAlert={setAlert}
      />
    </DashboardLayout>
  );
};

const mapStateToProps = state => ({
  product: state.product,
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getProduct,
  addReview,
  setAlert,
})(WriteReview);
