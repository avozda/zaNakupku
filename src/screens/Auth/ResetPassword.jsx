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
  FormControl,
  Pressable,
  Spinner,
} from 'native-base';
import {MaterialIcons, AntDesign} from '@expo/vector-icons';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import GuestLayout from '../../components/Layouts/GuestLayout';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {resetPassword} from '../../actions/auth';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

const FormInput = ({children, ...props}) => (
  <VStack mb="6">
    <FloatingLabelInput {...props} />
    {children}
  </VStack>
);

const ResetPasswordForm = ({
  resetPassword,
  loading,
  navigation,
  token,
  email,
}) => {
  const [formData, setFormData] = useState({
    password: '',
    password2: '',
  });
  const [errorData, setErrorData] = useState({
    passwordError: '',
    password2Error: '',
  });

  const [showPass, setShowPass] = React.useState(false);
  const [showPassConf, setShowPassConf] = React.useState(false);

  const onSubmit = () => {
    let foundError = false;
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (formData.password.length < 6) {
      setErrorData(prev => ({
        ...prev,
        passwordError: 'Heslo musí být alespoň 6 znaků dlouhé',
      }));
      foundError = true;
    }

    if (formData.password.includes(' ')) {
      setErrorData(prev => ({
        ...prev,
        passwordError: 'Prosím, zadejte platné heslo',
      }));
      foundError = true;
    }

    if (formData.password !== formData.password2) {
      setErrorData(prev => ({
        ...prev,
        password2Error: 'Hesla se neshodují',
      }));
      foundError = true;
    }
    if (foundError) {
      return;
    }

    resetPassword(
      {
        password: formData.password,
        password_confirmation: formData.password2,
        email: email,
        token,
      },
      navigation,
    );
  };

  return (
    <FormControl
      isRequired
      isInvalid={errorData.password2Error || errorData.passwordError}
    >
      <FormInput
        id={'Password input'}
        isRequired
        secureTextEntry={!showPass}
        label="Nové heslo"
        name="Password"
        labelColor="#9CA3AF"
        labelBGColor={useColorModeValue('#fff', '#1F2937')}
        defaultValue={formData.password}
        onChangeText={newPassword => {
          setFormData(prev => ({...prev, password: newPassword}));
          setErrorData(prev => ({...prev, passwordError: ''}));
        }}
        InputRightElement={
          <IconButton
            mr="1"
            variant="unstyled"
            icon={
              <Icon
                size="5"
                color="coolGray.400"
                as={MaterialIcons}
                name={showPass ? 'visibility' : 'visibility-off'}
              />
            }
            onPress={() => {
              setShowPass(!showPass);
            }}
          />
        }
      >
        <FormControl.ErrorMessage>
          {errorData.passwordError}
        </FormControl.ErrorMessage>
      </FormInput>
      <FormInput
        id={'Password confirmation input'}
        isRequired
        secureTextEntry={!showPassConf}
        label="Potvrzení hesla"
        name="Password confirmation"
        labelColor="#9CA3AF"
        labelBGColor={useColorModeValue('#fff', '#1F2937')}
        defaultValue={formData.password2}
        onChangeText={newPassword => {
          setFormData(prev => ({...prev, password2: newPassword}));
          setErrorData(prev => ({...prev, password2Error: ''}));
        }}
        InputRightElement={
          <IconButton
            mr="1"
            variant="unstyled"
            icon={
              <Icon
                size="5"
                color="coolGray.400"
                as={MaterialIcons}
                name={showPassConf ? 'visibility' : 'visibility-off'}
              />
            }
            onPress={() => {
              setShowPassConf(!showPassConf);
            }}
          />
        }
      >
        <FormControl.ErrorMessage>
          {errorData.password2Error}
        </FormControl.ErrorMessage>
      </FormInput>
      <Button
        onPress={() => onSubmit()}
        variant="solid"
        size="lg"
        mt={{base: 5, md: 3}}
      >
        {loading ? <Spinner color={'primary.50'} /> : 'Zmenit heslo'}
      </Button>
    </FormControl>
  );
};

const ResetPasswordComponent = ({
  navigation,
  resetPassword,
  auth,
  token,
  email,
}) => {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={{flex: 1}}
      bounces={false}
    >
      <MobileHeader navigation={navigation} />
      <Box
        px={{base: 4, md: 8}}
        py="8"
        flex={1}
        _light={{bg: 'white'}}
        _dark={{bg: 'coolGray.800'}}
        borderTopLeftRadius={{base: '2xl', md: 0}}
        borderTopRightRadius={{base: '2xl', md: 'md'}}
        borderBottomRightRadius={{base: 'none', md: 'md'}}
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          _light={{color: 'coolGray.800'}}
          _dark={{color: 'coolGray.50'}}
          mb={8}
        >
          Obnovení hesla
        </Text>
        <ResetPasswordForm
          navigation={navigation}
          loading={auth.loading}
          resetPassword={resetPassword}
          token={token}
          email={email}
        />
        <HStack
          space="1"
          safeAreaBottom
          alignItems="center"
          justifyContent="center"
          mt={{base: 'auto', md: '8'}}
        >
          <Text
            fontSize="sm"
            color="coolGray.500"
            fontWeight="normal"
            _dark={{color: 'coolGray.400'}}
          ></Text>
          <Pressable onPress={() => navigation.navigate('SignIn')}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              _light={{
                color: 'primary.900',
              }}
              _dark={{
                color: 'primary.500',
                fontSize: 'sm',
                fontWeight: 'bold',
              }}
            >
              Přihlásit se
            </Text>
          </Pressable>
        </HStack>
      </Box>
    </KeyboardAwareScrollView>
  );
};

function SideContainerWeb({navigation}) {
  return (
    <Center
      flex="1"
      _light={{bg: 'primary.900'}}
      _dark={{bg: 'coolGray.800'}}
      borderTopLeftRadius={{md: 'md'}}
      borderBottomLeftRadius={{md: 'md'}}
    >
      <Pressable
        position={'absolute'}
        top={5}
        left={5}
        onPress={() => {
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate('Home');
        }}
      >
        <Icon
          size="6"
          pt="0.5"
          as={AntDesign}
          name={'arrowleft'}
          color="coolGray.50"
        />
      </Pressable>
      <Image
        h="24"
        size="80"
        alt="zaNakupku.cz"
        key={useColorModeValue('logo_light', 'logo_dark')}
        resizeMode={'contain'}
        source={useColorModeValue(
          require('../../../assets/logo/mobile-header.png'),
          require('../../../assets/logo/logo-white.png'),
        )}
      />
    </Center>
  );
}

function MobileHeader({navigation}) {
  return (
    <Hidden from="md">
      <VStack px="4" mt="4" mb="5" space="9">
        <HStack space="2" alignItems="center">
          <IconButton
            onPress={() =>
              navigation.canGoBack()
                ? navigation.goBack()
                : navigation.navigate('Home')
            }
            p={0}
            icon={
              <Icon
                size="6"
                as={MaterialIcons}
                name="keyboard-backspace"
                color="coolGray.50"
              />
            }
          />
          <Text color="coolGray.50" fontSize="lg">
            Obnovení hesla
          </Text>
        </HStack>
        <VStack space={0.5}>
          <Text fontSize="3xl" fontWeight="bold" color="coolGray.50">
            Zde si můžete nastavit nové heslo
          </Text>
          <Text
            fontSize="md"
            fontWeight="normal"
            _dark={{
              color: 'coolGray.400',
            }}
            _light={{
              color: 'primary.300',
            }}
          >
            Pro změnu hesla vyplňtě formulář
          </Text>
        </VStack>
      </VStack>
    </Hidden>
  );
}
const ResetPassword = ({resetPassword, auth, navigation, route}) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigation.navigate('Home');
      return;
    }

    if (!route.params) {
      navigation.navigate('SignIn');
      return;
    }
    if (!route.params.token) {
      navigation.navigate('SignIn');
      return;
    }
    if (!route.params.email) {
      navigation.navigate('SignIn');
      return;
    }
  }, [auth, isFocused]);
  return (
    <GuestLayout>
      <Hidden till="md">
        <SideContainerWeb navigation={navigation} />
      </Hidden>

      <ResetPasswordComponent
        auth={auth}
        navigation={navigation}
        resetPassword={resetPassword}
        token={route.params && route.params.token ? route.params.token : null}
        email={route.params && route.params.email ? route.params.email : null}
      />
    </GuestLayout>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {resetPassword})(ResetPassword);
