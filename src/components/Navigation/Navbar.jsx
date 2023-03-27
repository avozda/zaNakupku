import {
  Box,
  HStack,
  Icon,
  VStack,
  Avatar,
  Image,
  Input,
  Pressable,
  Divider,
  IconButton,
  Hidden,
  Menu,
  Text,
} from 'native-base';

import {Feather, FontAwesome} from '@expo/vector-icons';
import {TouchableOpacity} from 'react-native';
import GlobalSearch from '../GlobalSearch';

const Navbar = props => {
  return (
    <>
      <VStack
        _light={{
          bg: 'white',
        }}
        zIndex={1}
      >
        <Box
          px={{
            base: '4',
            md: '8',
          }}
          pt={{
            base: '6',
            md: '3',
          }}
          pb={{
            base: '1',
            md: '3',
          }}
          borderBottomWidth={{
            base: '1',
            md: '1',
          }}
          _light={{
            bg: {
              base: 'white',
              md: 'white',
            },
            borderColor: 'coolGray.200',
          }}
        >
          {/* Mobile header */}
          <Hidden from="md">
            <Box
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 20,
                alignItems: 'center',
              }}
            >
              <Pressable onPress={() => props.navigation.navigate('Main')}>
                <Image
                  size={'6'}
                  resizeMode="contain"
                  minWidth={'150'}
                  source={require('../../../assets/logo/logo-no-background.png')}
                  alt="zaNakupkucz"
                />
              </Pressable>
              <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                <Avatar
                  w="9"
                  h="9"
                  borderWidth="1"
                  _light={{
                    borderColor: 'primary.900',
                  }}
                  source={{
                    uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                  }}
                />
              </TouchableOpacity>
            </Box>
          </Hidden>
          {/* Desktop header */}
          <Hidden till="md">
            <HStack alignItems="center" justifyContent="space-around">
              <HStack space="8" alignItems="center">
                <Pressable onPress={() => props.navigation.navigate('Main')}>
                  <Image
                    size={'8'}
                    resizeMode="contain"
                    minWidth={'250'}
                    source={require('../../../assets/logo/logo-no-background.png')}
                    alt="zaNakupkucz"
                  />
                </Pressable>
              </HStack>
              <HStack
                space="8"
                alignItems="center"
                justifyContent="space-evenly"
              >
                <GlobalSearch navigation={props.navigation} />
                <HStack space="5" alignItems="center">
                  <IconButton
                    icon={
                      <Icon
                        size="6"
                        _dark={{
                          color: 'coolGray.50',
                        }}
                        _light={{
                          color: 'coolGray.400',
                        }}
                        as={Feather}
                        name={'shopping-cart'}
                      />
                    }
                  />
                  <Pressable onPress={() => props.navigation.openDrawer()}>
                    <Avatar
                      w="8"
                      h="8"
                      borderWidth="1"
                      _light={{
                        borderColor: 'primary.900',
                      }}
                      source={{
                        uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                      }}
                    />
                  </Pressable>
                </HStack>
              </HStack>
            </HStack>
          </Hidden>
        </Box>
      </VStack>
    </>
  );
};

export default Navbar;
