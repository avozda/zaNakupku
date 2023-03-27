import React from 'react';
import {
  Box,
  VStack,
  ScrollView,
  StatusBar,
  HStack,
  Pressable,
  Icon,
  Image,
  Text,
  Hidden,
  useColorMode,
  IconButton,
  Divider,
  Menu,
  Input,
  MoonIcon,
  useColorModeValue,
  SunIcon,
  Button,
  Spinner,
  Avatar,
} from 'native-base';

import {AntDesign, FontAwesome} from '@expo/vector-icons';
import GlobalSearch from '../GlobalSearch';
import {connect} from 'react-redux';

export function Header({auth, ...props}) {
  const {toggleColorMode} = useColorMode();
  return (
    <Box
      zIndex={1}
      px="6"
      pt="3"
      pb="5"
      borderBottomWidth="1"
      _dark={{bg: 'coolGray.900', borderColor: 'coolGray.800'}}
      _light={{
        bg: {base: 'primary.900', md: 'white'},
        borderColor: 'coolGray.200',
      }}
    >
      <VStack alignSelf="center" width="100%">
        <HStack alignItems="center" justifyContent="space-between">
          <HStack space="3" alignItems="center">
            <Pressable
              onPress={() =>
                props.navigation.navigate('Home', {screen: 'Main'})
              }
            >
              <Image
                key={useColorModeValue('logo_light', 'logo_dark')}
                h="10"
                w={40}
                alt="zaNakupku"
                resizeMode="contain"
                source={useColorModeValue(
                  require('../../../assets/logo/logo-no-background.png'),
                  require('../../../assets/logo/logo-white.png'),
                )}
              />
            </Pressable>
          </HStack>
          {props.searchbar ? (
            <GlobalSearch
              popupboxSizeProp={'30%'}
              widthProp={'30%'}
              sizeProp={'sm'}
              navigation={props.navigation}
            />
          ) : (
            <></>
          )}

          <HStack space="3" alignItems="center">
            {auth.loading ? (
              <Spinner mx={2} />
            ) : auth.isAuthenticated ? (
              <Pressable onPress={() => props.navigation.openDrawer()}>
                <Avatar size="sm" bg="emerald.600" source={''}>
                  {auth.user.firstname.slice(0, 1).toUpperCase() +
                    auth.user.lastname.slice(0, 1).toUpperCase()}
                </Avatar>
              </Pressable>
            ) : (
              <Menu
                closeOnSelect={true}
                w="200"
                placement="bottom right"
                trigger={triggerProps => {
                  return (
                    <Button variant="unstyled" p="0" {...triggerProps}>
                      <Image
                        w="8"
                        h="8"
                        source={require('../../../assets/user.png')}
                        alt="Alternate Text"
                        size="xs"
                      />
                    </Button>
                  );
                }}
                _dark={{bg: 'coolGray.800', borderColor: 'coolGray.700'}}
              >
                <Menu.Group title="Uživatel">
                  <Menu.Item
                    onPress={() =>
                      props.navigation.navigate('Auth', {screen: 'SignIn'})
                    }
                  >
                    Přihlášení
                  </Menu.Item>
                  <Menu.Item
                    onPress={() =>
                      props.navigation.navigate('Auth', {screen: 'SignUp'})
                    }
                  >
                    Registrace
                  </Menu.Item>
                </Menu.Group>
              </Menu>
            )}
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
}

function MainContent(props) {
  return (
    <VStack maxW={props.maxWidth} flex={1} width="100%">
      {props.displayScreenTitle ? (
        <Hidden till="md">
          <HStack mb="4" space={4}>
            <Pressable
              onPress={() => {
                props.navigation.canGoBack()
                  ? props.navigation.goBack()
                  : props.navigation.navigate('Main');
              }}
            >
              <Icon
                size="6"
                pt="0.5"
                as={AntDesign}
                name={'arrowleft'}
                _light={{color: 'coolGray.800'}}
                _dark={{color: 'coolGray.50'}}
              />
            </Pressable>
            <VStack alignItems={'center'}>
              {props.titleLink ? (
                <HStack>
                  <Pressable onPress={() => props.titleLink()}>
                    <Text fontSize="md" fontWeight="medium" color="primary.600">
                      {props.title.split(' -')[0]}
                    </Text>
                  </Pressable>
                  <Text
                    fontSize="md"
                    fontWeight="medium"
                    _dark={{color: 'coolGray.50'}}
                    _light={{color: 'coolGray.600'}}
                  >
                    {' -'}
                  </Text>
                  <Text
                    fontSize="md"
                    fontWeight="medium"
                    _dark={{color: 'coolGray.50'}}
                    _light={{color: 'coolGray.600'}}
                  >
                    {props.title.split(' -')[1]}
                  </Text>
                </HStack>
              ) : (
                <Text
                  fontSize="md"
                  fontWeight="medium"
                  _dark={{color: 'coolGray.50'}}
                  _light={{color: 'coolGray.600'}}
                >
                  {props.title}
                </Text>
              )}

              <Text
                _dark={{color: 'coolGray.50'}}
                _light={{color: 'coolGray.400'}}
                fontSize="sm"
                fontWeight="normal"
              >
                {props.subTitle}
              </Text>
            </VStack>
          </HStack>
        </Hidden>
      ) : (
        <></>
      )}
      {props.children}
    </VStack>
  );
}

export function MobileHeader({auth, ...props}) {
  const {colorMode, toggleColorMode} = useColorMode();

  return (
    <Box
      px="1"
      pt="2"
      pb="2"
      _dark={{bg: 'coolGray.900', borderColor: 'coolGray.800'}}
      _light={{
        bg: {base: 'primary.900', md: 'white'},
        borderColor: 'coolGray.200',
      }}
      bg="amber.300"
    >
      <HStack space="2" justifyContent="space-between">
        <HStack
          flex="1"
          space="2"
          justifyContent="space-between"
          alignItems="center"
        >
          <>
            <HStack alignItems="center" space="1">
              {props.backButton ? (
                <IconButton
                  onPress={() =>
                    props.navigation.canGoBack()
                      ? props.navigation.goBack()
                      : props.navigation.navigate('Main')
                  }
                  variant="ghost"
                  colorScheme="light"
                  _icon={{color: 'coolGray.50'}}
                  icon={<Icon size="6" as={AntDesign} name="arrowleft" />}
                />
              ) : (
                <></>
              )}
              <VStack>
                {props.title ? (
                  <Text
                    pl={!props.backButton ? 4 : 0}
                    color="coolGray.50"
                    fontWeight="medium"
                    fontSize="lg"
                  >
                    {props.title}
                  </Text>
                ) : (
                  <Image
                    key={useColorModeValue('logo_light', 'logo_dark')}
                    h="10"
                    w={40}
                    alt="zaNakupku"
                    resizeMode="contain"
                    source={useColorModeValue(
                      require('../../../assets/logo/mobile-header.png'),
                      require('../../../assets/logo/logo-white.png'),
                    )}
                  />
                )}

                {props.subTitle ? (
                  <Text color="coolGray.50" fontSize="sm" fontWeight="medium">
                    {props.subTitle}
                  </Text>
                ) : undefined}
              </VStack>
            </HStack>
            {/* right panel */}

            <HStack space="1">
              {auth.loading ? (
                <Spinner color={'white'} m={3} />
              ) : auth.isAuthenticated ? (
                <Pressable onPress={() => props.navigation.openDrawer()}>
                  <Avatar
                    style={{textTransform: 'uppercase'}}
                    m={2}
                    size="sm"
                    bg="emerald.600"
                    source={''}
                  >
                    {auth.user.firstname.slice(0, 1).toUpperCase() +
                      auth.user.lastname.slice(0, 1).toUpperCase()}
                  </Avatar>
                </Pressable>
              ) : (
                <Menu
                  closeOnSelect={true}
                  w="200"
                  placement="bottom right"
                  trigger={triggerProps => {
                    return (
                      <Button variant="unstyled" p="0" {...triggerProps}>
                        <Image
                          w="8"
                          h="8"
                          source={require('../../../assets/user.png')}
                          alt="Not logged in icon"
                          size="xs"
                        />
                      </Button>
                    );
                  }}
                  _dark={{bg: 'coolGray.800', borderColor: 'coolGray.700'}}
                >
                  <Menu.Group title="Uživatel">
                    <Menu.Item
                      onPress={() =>
                        props.navigation.navigate('Auth', {screen: 'SignIn'})
                      }
                    >
                      Přihlášení
                    </Menu.Item>
                    <Menu.Item
                      onPress={() =>
                        props.navigation.navigate('Auth', {screen: 'SignUp'})
                      }
                    >
                      Registrace
                    </Menu.Item>
                  </Menu.Group>
                </Menu>
              )}
            </HStack>
          </>
        </HStack>
      </HStack>
    </Box>
  );
}
const DashboardLayout = ({
  displayScreenTitle = true,
  auth,
  header = {
    searchbar: true,
  },
  maxWidth = 1016,
  mobileHeader = {
    backButton: true,
  },
  ...props
}) => {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Box
        safeAreaTop
        _light={{bg: 'primary.900'}}
        _dark={{bg: 'coolGray.900'}}
      />
      <VStack
        flex={1}
        _light={{bg: 'primary.50'}}
        _dark={{bg: 'customGray'}}
        zIndex={1}
      >
        <Hidden from="md">
          <MobileHeader
            auth={auth}
            title={props.title}
            subTitle={props.subTitle}
            backButton={mobileHeader.backButton}
            rightPanel={props.rightPanelMobileHeader}
            navigation={props.navigation}
          />
        </Hidden>
        <Hidden till="md">
          <Header
            auth={auth}
            title={props.title}
            subTitle={props.subTitle}
            searchbar={header.searchbar}
            navigation={props.navigation}
          />
        </Hidden>

        <Box
          flex={1}
          safeAreaBottom
          flexDirection={{base: 'column', md: 'row'}}
          _light={{
            borderTopColor: 'coolGray.200',
          }}
          _dark={{
            bg: 'coolGray.700',
            borderTopColor: 'coolGray.700',
          }}
        >
          <Hidden till="md">
            <ScrollView
              flex={1}
              p={{md: 8}}
              contentContainerStyle={{alignItems: 'center', flexGrow: 1}}
              showsVerticalScrollIndicator={false}
            >
              <MainContent
                {...props}
                displayScreenTitle={displayScreenTitle}
                maxWidth={maxWidth}
              />
            </ScrollView>
          </Hidden>

          <Hidden from="md">
            <MainContent {...props} displayScreenTitle={displayScreenTitle} />
          </Hidden>
        </Box>
      </VStack>
    </>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(DashboardLayout);
