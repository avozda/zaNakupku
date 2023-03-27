import React, {useEffect} from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Avatar,
  Image,
  Center,
  FlatList,
  useBreakpointValue,
  Pressable,
  useColorModeValue,
  ScrollView,
  Spinner,
} from 'native-base';
import {MaterialIcons, EvilIcons} from '@expo/vector-icons';
import DashboardLayout from '../components/Layouts/DashboardLayout';
import {connect} from 'react-redux';
import {getProfile} from '../actions/profile';
import ListingCard from '../components/ListingCard';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment/moment';
const tabs = [
  {
    id: 1,
    title: 'Aukce',
  },
  {
    id: 2,
    title: 'Recenze',
  },
];

function TabItem({tabName, currentTab, handleTabChange}) {
  return (
    <Pressable onPress={() => handleTabChange(tabName)} px="4" pt="2">
      <VStack>
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
      </VStack>
    </Pressable>
  );
}

const UserProfile = ({user}) => {
  return (
    <>
      <Avatar size="lg" bg="emerald.600" source={''}>
        {user.firstname.slice(0, 1).toUpperCase() +
          user.lastname.slice(0, 1).toUpperCase()}
      </Avatar>
      <Text
        mt="2"
        fontSize="md"
        fontWeight="bold"
        _light={{color: 'coolGray.800'}}
        _dark={{color: 'coolGray.50'}}
      >
        {user.firstname} {user.lastname}
      </Text>
      <Text
        fontSize="sm"
        fontWeight="medium"
        _light={{color: 'coolGray.800'}}
        _dark={{color: 'coolGray.400'}}
      >
        {user.location}
      </Text>
      <VStack>
        <Text
          mt={3}
          fontSize="sm"
          textAlign="center"
          // px={{ base: 6, md: 6, lg: 48 }}
          px={{base: 6, md: 0}}
          _light={{color: 'coolGray.800'}}
          _dark={{color: 'coolGray.50'}}
          maxWidth="400"
        >
          {user.name}
        </Text>
        <Text
          mt={1}
          fontSize="sm"
          textAlign="center"
          // px={{ base: 6, md: 6, lg: 48 }}
          px={{base: 6, md: 0}}
          _light={{color: 'coolGray.800'}}
          _dark={{color: 'coolGray.50'}}
          maxWidth="400"
        >
          {user.email}
        </Text>
        <Text
          mt={1}
          fontSize="sm"
          textAlign="center"
          // px={{ base: 6, md: 6, lg: 48 }}
          px={{base: 6, md: 0}}
          _light={{color: 'coolGray.800'}}
          _dark={{color: 'coolGray.50'}}
          maxWidth="400"
        >
          {user.phone_number}
        </Text>
      </VStack>
    </>
  );
};

const StatsComponent = props => {
  return (
    <HStack
      width={{base: '60%', md: '70%'}}
      mt={{base: 6, md: 10}}
      mb={6}
      px={1.5}
      justifyContent="space-between"
      alignItems={'center'}
    >
      {props.stats.map((item, index) => {
        return (
          <VStack alignItems="center" key={index}>
            <Text
              fontSize="lg"
              fontWeight="medium"
              _light={{color: 'coolGray.800'}}
              _dark={{color: 'coolGray.50'}}
            >
              {item.talkNumber}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="medium"
              _light={{color: 'coolGray.500'}}
              _dark={{color: 'coolGray.300'}}
            >
              {item.text}
            </Text>
          </VStack>
        );
      })}
    </HStack>
  );
};

function Review({item, navigation}) {
  return (
    <Box
      _light={{
        bgColor: 'primary.100',
      }}
      _dark={{
        bgColor: 'coolGray.700',
      }}
      w={{
        base: '50%',
        lg: '33%',
        xl: '33%',
      }}
      m={4}
      ml={1}
      py={2}
      px={4}
      borderRadius="sm"
    >
      <VStack mt="5" space="8">
        <VStack space="3">
          <HStack space="2">
            <Avatar
              size="lg"
              height="10"
              width="10"
              bg="emerald.600"
              source={''}
            >
              {item.author.firstname.slice(0, 1).toUpperCase() +
                item.author.lastname.slice(0, 1).toUpperCase()}
            </Avatar>

            <VStack space="1">
              <Pressable
                onPress={() =>
                  navigation.navigate('SellerProfile', {id: item.author.id})
                }
              >
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  _dark={{color: 'coolGray.50'}}
                  _light={{color: 'coolGray.800'}}
                  lineHeight="21"
                >
                  {item.author.firstname + ' ' + item.author.lastname}
                </Text>
              </Pressable>

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
          </HStack>
          <Text
            fontSize="sm"
            _light={{color: 'coolGray.500'}}
            _dark={{color: 'coolGray.400'}}
            lineHeight="21"
          >
            {moment(item.created_at).format('MMM Do YY')}
          </Text>
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
      </VStack>
    </Box>
  );
}

const SellerProfile = ({navigation, profileStore, getProfile, route}) => {
  const isFocused = useIsFocused();
  const [tabName, setTabName] = React.useState('Aukce');

  useEffect(() => {
    getProfile(route.params.id);
  }, [getProfile, isFocused]);

  const noColumn = useBreakpointValue({
    base: 2,
    lg: 3,
    xl: 3,
  });
  const noColumnStyle = useBreakpointValue({
    base: 'space-evenly',
    md: 'space-evenly',
    lg: 'space-evenly',
  });
  return (
    <DashboardLayout
      title={
        profileStore.profile && !profileStore.loading
          ? profileStore.profile.data.name
          : '...'
      }
      navigation={navigation}
    >
      {!profileStore.loading && profileStore.profile ? (
        <FlatList
          key={tabName}
          numColumns={noColumn}
          ListHeaderComponent={
            <VStack
              pt={{base: 4, md: 10}}
              rounded={{md: 'sm'}}
              _light={{bg: 'white'}}
              _dark={{bg: 'coolGray.800'}}
              alignItems="center"
              safeAreaBottom
            >
              <UserProfile user={profileStore.profile.data} />
              <StatsComponent
                stats={[
                  {
                    text: 'Aukce',
                    talkNumber: profileStore.profile.data.listings.length,
                  },
                  {
                    text: 'Recenze',
                    talkNumber:
                      profileStore.profile.data.reviews_recipient_of.length,
                  },
                ]}
              />
              <VStack w="100%" mx={4}>
                <HStack
                  _light={{
                    bg: 'coolGray.100',
                  }}
                  _dark={{
                    bg: 'coolGray.700',
                  }}
                  w="100%"
                  justifyContent="space-around"
                  borderRadius="sm"
                >
                  {tabs.map(({id, title}) => (
                    <TabItem
                      key={id}
                      tabName={title}
                      currentTab={tabName}
                      handleTabChange={tab => setTabName(tab)}
                    />
                  ))}
                </HStack>
              </VStack>
            </VStack>
          }
          columnWrapperStyle={{justifyContent: noColumnStyle}}
          data={
            tabName == 'Aukce'
              ? profileStore.profile.data.listings
              : profileStore.profile.data.reviews_recipient_of
          }
          renderItem={({item}) =>
            tabName == 'Aukce' ? (
              <ListingCard
                user={profileStore.profile.data}
                navigation={navigation}
                listing={item}
              />
            ) : (
              <Review navigation={navigation} item={item} />
            )
          }
          keyExtractor={(item, index) => 'key' + index}
          _contentContainerStyle={{
            width: '100%',
            alignSelf: 'center',
            bg: useColorModeValue('white', 'coolGray.800'),
            px: {base: 0, md: 6, lg: 140},
            pb: 7,
          }}
          bounces={false}
        />
      ) : (
        <Center
          _dark={{bgColor: 'coolGray.800'}}
          _light={{bgColor: 'white'}}
          h={'100%'}
        >
          <Spinner size="lg" />
        </Center>
      )}
    </DashboardLayout>
  );
};

const mapStateToProps = state => ({
  profileStore: state.profile,
});
export default connect(mapStateToProps, {getProfile})(SellerProfile);
