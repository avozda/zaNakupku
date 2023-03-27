import React from 'react';
import {View, ImageBackground, TouchableOpacity} from 'react-native';
import {
  Text,
  Spinner,
  Box,
  HStack,
  VStack,
  Image,
  IconButton,
  Divider,
  Button,
  Icon,
  Pressable,
  Hidden,
  useColorMode,
  MoonIcon,
  SunIcon,
  useColorModeValue,
  Avatar,
} from 'native-base';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {setStringAsync} from '../../utils/storage';

import {MaterialIcons} from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {logout} from '../../actions/auth';
import {connect} from 'react-redux';
const CustomDrawer = ({auth, logout, ...props}) => {
  const {colorMode, toggleColorMode} = useColorMode();
  return (
    <Box
      style={{flex: 1}}
      borderRightWidth="1"
      _light={{bg: 'white', borderRightColor: 'coolGray.200'}}
      _dark={{bg: 'coolGray.900', borderRightColor: 'coolGray.800'}}
    >
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: 'transparent'}}
      >
        <Hidden till="md">
          {' '}
          <Pressable
            position={'absolute'}
            top={'5'}
            left={'5'}
            onPress={() => {
              toggleColorMode();
            }}
          >
            {useColorModeValue(<MoonIcon size="6" />, <SunIcon size="6" />)}
          </Pressable>{' '}
        </Hidden>
        <Hidden from="md">
          <IconButton
            position={'absolute'}
            top={'10'}
            left={'3'}
            variant={colorMode === 'light' ? 'unstyled' : ''}
            onPress={() => {
              toggleColorMode();
            }}
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          />
        </Hidden>
        {auth.user ? (
          <VStack
            pb="4"
            mt="10"
            alignItems="center"
            borderBottomWidth="1"
            _light={{
              borderBottomColor: 'coolGray.200',
            }}
            _dark={{
              borderBottomColor: 'coolGray.800',
            }}
          >
            <Avatar size="xl" bg="emerald.600" source={''}>
              {auth.user.firstname.slice(0, 1).toUpperCase() +
                auth.user.lastname.slice(0, 1).toUpperCase()}
            </Avatar>

            <Pressable
              onPress={() =>
                props.navigation.navigate('Account', {screen: 'EditAccount'})
              }
            >
              <HStack
                alignItems="center"
                justifyContent="center"
                space="2"
                pt={3}
              >
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  _light={{color: 'coolGray.800'}}
                >
                  {auth.user.firstname + ' ' + auth.user.lastname}
                </Text>

                <Icon
                  as={MaterialIcons}
                  name="mode-edit"
                  size={4}
                  _light={{color: 'coolGray.800'}}
                  _dark={{color: 'white'}}
                />
              </HStack>
            </Pressable>
            <Text
              fontSize="sm"
              fontWeight="medium"
              textAlign="center"
              pt={1}
              _light={{color: 'coolGray.500'}}
              _dark={{color: 'coolGray.400'}}
            >
              {auth.user.email}
            </Text>
          </VStack>
        ) : (
          <Spinner />
        )}

        <View style={{flex: 1, backgroundColor: 'transparent', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <Divider _dark={{bgColor: 'coolGray.800'}} />
      <Box px="6" py="4">
        <HStack>
          <Button
            w={'90%'}
            variant="ghost"
            justifyContent="flex-start"
            p="3"
            leftIcon={
              <Icon size="5" mr="2" as={MaterialIcons} name="exit-to-app" />
            }
            _light={{
              _text: {color: 'coolGray.800'},
              _icon: {color: 'coolGray.800'},
            }}
            _dark={{
              _text: {color: 'coolGray.50'},
              _icon: {color: 'coolGray.50'},
            }}
            _text={{
              fontSize: 'md',
              fontWeight: 'medium',
            }}
            _hover={{
              _text: {
                _light: {
                  color: 'primary.900',
                },
                _dark: {
                  color: 'primary.500',
                },
              },

              _icon: {
                _light: {
                  color: 'primary.900',
                },
                _dark: {
                  color: 'primary.500',
                },
              },
              _light: {
                bg: 'primary.100',
              },
              _dark: {
                bg: 'coolGray.800',
              },
            }}
            onPress={() => {
              logout(props.navigation);
            }}
          >
            Odhlásit se
          </Button>
          {auth.loading ? <Spinner ml={'auto'} /> : <></>}
        </HStack>
      </Box>
    </Box>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {logout})(CustomDrawer);
