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
import {login} from '../../actions/auth';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

const FormInput = ({children, ...props}) => (
  <VStack mb="6">
    <FloatingLabelInput {...props} />
    {children}
  </VStack>
);

const SignInForm = ({login, loading, navigation}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorData, setErrorData] = useState({
    emailError: '',
    passwordError: '',
  });
  const [showPass, setShowPass] = React.useState(false);

  const onSubmit = () => {
    let foundError = false;
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(formData.email)) {
      setErrorData(prev => ({
        ...prev,
        emailError: 'Prosím, zadejte platný email',
      }));
      foundError = true;
    }

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
    if (foundError) {
      return;
    }

    login(formData.email, formData.password);
  };

  return (
    <FormControl
      isRequired
      isInvalid={errorData.emailError || errorData.passwordError}
    >
      <FormInput
        id={'Email input'}
        isRequired
        disabled={loading}
        label="E-mail"
        name="Email"
        labelColor="#9CA3AF"
        labelBGColor={useColorModeValue('#fff', '#1F2937')}
        defaultValue={formData.email}
        onChangeText={email => {
          setFormData(prev => ({...prev, email: email}));
          setErrorData(prev => ({...prev, emailError: ''}));
        }}
      >
        <FormControl.ErrorMessage>
          {errorData.emailError}
        </FormControl.ErrorMessage>
      </FormInput>
      <FormInput
        id={'Password input'}
        isRequired
        secureTextEntry={!showPass}
        label="Heslo"
        name="Heslo"
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
      <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
        <Text
          ml="auto"
          fontSize={{base: 'sm', md: 'xs'}}
          fontWeight="bold"
          textDecoration={'none'}
          _light={{
            color: 'primary.900',
          }}
          _dark={{
            color: 'primary.500',
          }}
        >
          Zapomněli jste heslo?
        </Text>
      </Pressable>
      <Checkbox
        value="demo"
        defaultIsChecked
        accessibilityLabel="Remember me"
        my="5"
        _text={{
          fontSize: 'sm',
          fontWeight: 'normal',
          pl: '1',
        }}
        _dark={{
          value: 'checkbox',
          _checked: {
            value: 'checkbox',
            bg: 'primary.700',
            borderColor: 'primary.700',
            _icon: {color: 'white'},
          },
          _text: {
            color: 'coolGray.400',
          },
        }}
        _light={{
          value: 'checkbox',
          _checked: {
            value: 'checkbox',
            bg: 'primary.900',
            borderColor: 'primary.900',
          },
          _text: {
            color: 'coolGray.800',
          },
        }}
      >
        Pamatovat si mě
      </Checkbox>
      <Button
        onPress={() => onSubmit()}
        variant="solid"
        size="lg"
        mt={{base: 5, md: 3}}
      >
        {loading ? <Spinner color={'primary.50'} /> : 'Přihlásit se'}
      </Button>
    </FormControl>
  );
};

const SignInComponent = ({navigation, login, auth}) => {
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
          Pro pokračování se přihlašte
        </Text>
        <SignInForm
          navigation={navigation}
          loading={auth.loading}
          login={login}
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
            fontWeight="normal"
            _light={{color: 'coolGray.500'}}
            _dark={{color: 'coolGray.400'}}
          >
            Nemáte ještě účet?
          </Text>

          <Pressable onPress={() => navigation.navigate('SignUp')}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              _light={{
                color: 'primary.900',
              }}
              _dark={{
                color: 'primary.500',
              }}
            >
              Zaregistrujte se
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
            Přihlášení
          </Text>
        </HStack>
        <VStack space={0.5}>
          <Text fontSize="3xl" fontWeight="bold" color="coolGray.50">
            Vítejte zpět
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
            Pro pokračování se přihlašte
          </Text>
        </VStack>
      </VStack>
    </Hidden>
  );
}
const SignIn = ({login, auth, navigation}) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigation.navigate('Home');
    }
  }, [auth, isFocused]);
  return (
    <GuestLayout>
      <Hidden till="md">
        <SideContainerWeb navigation={navigation} />
      </Hidden>

      <SignInComponent auth={auth} navigation={navigation} login={login} />
    </GuestLayout>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {login})(SignIn);
