import React, {useState, useEffect} from 'react';
import {
  Button,
  HStack,
  VStack,
  Text,
  Link,
  Checkbox,
  Divider,
  Image,
  useColorModeValue,
  IconButton,
  Icon,
  Center,
  Hidden,
  Box,
  CheckIcon,
  WarningIcon,
  CloseIcon,
} from 'native-base';

import GuestLayout from '../../components/Layouts/GuestLayout';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

const EmailVerificationResult = ({auth, navigation, route}) => {
  const isFocused = useIsFocused();
  const [result, setResult] = useState('');
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigation.navigate('Home');
    }
    if (!route.params) {
      navigation.navigate('SignIn');
    }
    if (!route.params.result) {
      navigation.navigate('SignIn');
    }
    if (
      route.params.result != 'success' &&
      route.params.result != 'failed' &&
      route.params.result != 'already-verified'
    ) {
      navigation.navigate('SignIn');
    }
    setResult(route.params.result);
  }, [auth, isFocused, route]);
  return (
    <GuestLayout>
      <Box
        py="8"
        flex={1}
        _light={{bg: 'white'}}
        _dark={{bg: 'coolGray.800'}}
        borderRadius={'xl'}
      >
        {result == 'success' ? (
          <Center>
            <VStack>
              <Center mb={6}>
                <CheckIcon
                  size={'8'}
                  _light={{color: 'primary.800'}}
                  _dark={{color: 'primary.600'}}
                />
              </Center>

              <Text
                fontWeight={'semibold'}
                fontSize={'xl'}
                textAlign={'center'}
                _light={{color: 'primary.800'}}
                _dark={{color: 'primary.600'}}
              >
                Váš email byl úspěšně ověřen
              </Text>
            </VStack>
          </Center>
        ) : (
          <></>
        )}

        {result == 'failed' ? (
          <Center>
            <VStack>
              <Center mb={6}>
                <CloseIcon
                  size={'8'}
                  _light={{color: 'error.600'}}
                  _dark={{color: 'error.500'}}
                />
              </Center>

              <Text
                fontWeight={'semibold'}
                fontSize={'xl'}
                textAlign={'center'}
                _light={{color: 'error.600'}}
                _dark={{color: 'error.500'}}
              >
                Váš email se nepodařilo ověřit
              </Text>
            </VStack>
          </Center>
        ) : (
          <></>
        )}
        {result == 'already-verified' ? (
          <Center>
            <VStack>
              <Center mb={6}>
                <WarningIcon
                  size={'8'}
                  _light={{color: 'warning.600'}}
                  _dark={{color: 'warning.400'}}
                />
              </Center>

              <Text
                fontWeight={'semibold'}
                fontSize={'xl'}
                textAlign={'center'}
                _light={{color: 'warning.600'}}
                _dark={{color: 'warning.400'}}
              >
                Váš email již byl ověřen
              </Text>
            </VStack>
          </Center>
        ) : (
          <></>
        )}
        <Center mt={10}>
          <Button
            onPress={() => navigation.navigate('SignIn')}
            _text={{fontWeight: 'bold'}}
          >
            Pokračovat
          </Button>
        </Center>
      </Box>
    </GuestLayout>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(EmailVerificationResult);
