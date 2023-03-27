import React, {useState} from 'react';
import {
  Button,
  Checkbox,
  Image,
  HStack,
  VStack,
  Text,
  Link,
  Icon,
  Hidden,
  Center,
  FormControl,
  Box,
  useTheme,
  useColorMode,
  useColorModeValue,
  Pressable,
  Spinner,
} from 'native-base';
import {MaterialIcons, AntDesign} from '@expo/vector-icons';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import GuestLayout from '../../components/Layouts/GuestLayout';
import {register} from '../../actions/auth';
import {connect} from 'react-redux';

function MobileHeader({navigation}) {
  return (
    <Hidden from="md">
      <VStack px="4" mt="4" mb="5" space="9">
        <HStack space="2" alignItems="center">
          <Pressable
            onPress={() => {
              navigation.canGoBack()
                ? navigation.goBack()
                : navigation.navigate('Home');
            }}
          >
            <Icon
              alignItems="center"
              justifyContent="center"
              size="6"
              as={MaterialIcons}
              name="keyboard-backspace"
              color="coolGray.50"
            />
          </Pressable>

          <Text color="coolGray.50" fontSize="lg">
            Registrace
          </Text>
        </HStack>
        <VStack space={0.5}>
          <Text fontSize="3xl" fontWeight="bold" color="coolGray.50">
            Vítejte
          </Text>
          <Text
            fontSize="md"
            fontWeight="normal"
            _dark={{
              color: 'coolGray.50',
            }}
            _light={{
              color: 'primary.300',
            }}
          >
            Pro pokračování se zaregistrujte
          </Text>
        </VStack>
      </VStack>
    </Hidden>
  );
}

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
const FormInput = ({widthProp, children, ...props}) => (
  <VStack w={widthProp ? widthProp : '100%'} mb="6">
    <FloatingLabelInput {...props} />
    {children}
  </VStack>
);
const SignUpForm = ({register, navigation, loading}) => {
  const {colors} = useTheme();
  const {colorMode} = useColorMode();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errorData, setErrorData] = useState({
    firstnameError: '',
    lastnameError: '',
    nameError: '',
    emailError: '',
    passwordError: '',
    password_confirmationError: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

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

    if (formData.firstname == '' || formData.firstname.includes(' ')) {
      setErrorData(prev => ({
        ...prev,
        firstnameError: 'Prosím, zadejte platné křestní jméno',
      }));
      foundError = true;
    }
    if (formData.lastname == '' || formData.lastname.includes(' ')) {
      setErrorData(prev => ({
        ...prev,
        lastnameError: 'Prosím, zadejte platné příjmení',
      }));
      foundError = true;
    }
    if (formData.name == '' || formData.name.includes(' ')) {
      setErrorData(prev => ({
        ...prev,
        nameError: 'Prosím, zadejte platné uživatelské jméno',
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
    if (formData.password !== formData.password_confirmation) {
      setErrorData(prev => ({
        ...prev,
        password_confirmationError: 'Hesla se musí shodovat',
      }));
      foundError = true;
    }

    if (foundError) {
      return;
    }

    register(formData, navigation);
  };

  return (
    <FormControl
      isRequired
      isInvalid={
        errorData.emailError ||
        errorData.passwordError ||
        errorData.firstnameError ||
        errorData.lastnameError ||
        errorData.nameError ||
        errorData.password_confirmationError
      }
    >
      <HStack w="full">
        <FormInput
          widthProp={'50%'}
          mr={4}
          isRequired
          label="Křestní"
          labelColor={colors.coolGray[400]}
          labelBGColor={colorMode === 'light' ? 'white' : colors.coolGray[800]}
          defaultValue={formData.firstname}
          onChangeText={firstname => {
            setFormData(prev => ({...prev, firstname: firstname}));
            setErrorData(prev => ({...prev, firstnameError: ''}));
          }}
        >
          <FormControl.ErrorMessage>
            {errorData.firstnameError}
          </FormControl.ErrorMessage>
        </FormInput>
        <FormInput
          widthProp={'50%'}
          isRequired
          label="Příjmení"
          labelColor={colors.coolGray[400]}
          labelBGColor={colorMode === 'light' ? 'white' : colors.coolGray[800]}
          defaultValue={formData.lastname}
          onChangeText={lastname => {
            setFormData(prev => ({...prev, lastname: lastname}));
            setErrorData(prev => ({...prev, lastnameError: ''}));
          }}
        >
          <FormControl.ErrorMessage>
            {errorData.lastnameError}
          </FormControl.ErrorMessage>
        </FormInput>
      </HStack>
      <FormInput
        isRequired
        label="Uživatelské jméno"
        labelColor={colors.coolGray[400]}
        labelBGColor={colorMode === 'light' ? 'white' : colors.coolGray[800]}
        defaultValue={formData.name}
        onChangeText={name => {
          setErrorData(prev => ({...prev, nameError: ''}));
          setFormData(prev => ({...prev, name: name}));
        }}
      >
        <FormControl.ErrorMessage>
          {errorData.nameError}
        </FormControl.ErrorMessage>
      </FormInput>
      <FormInput
        isRequired
        label="Email"
        labelColor={colors.coolGray[400]}
        labelBGColor={colorMode === 'light' ? 'white' : colors.coolGray[800]}
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
        isRequired
        secureTextEntry={showPass ? false : true}
        label="Heslo"
        labelColor={colors.coolGray[400]}
        labelBGColor={colorMode === 'light' ? 'white' : colors.coolGray[800]}
        defaultValue={formData.password}
        onChangeText={newPassword => {
          setFormData(prev => ({...prev, password: newPassword}));
          setErrorData(prev => ({...prev, passwordError: ''}));
        }}
        InputRightElement={
          <Pressable
            mr="2"
            onPress={() => {
              setShowPass(!showPass);
            }}
          >
            <Icon
              size="5"
              color="coolGray.400"
              as={MaterialIcons}
              name={showPass ? 'visibility' : 'visibility-off'}
            />
          </Pressable>
        }
      >
        <FormControl.ErrorMessage>
          {errorData.passwordError}
        </FormControl.ErrorMessage>
      </FormInput>
      <FormInput
        isRequired
        secureTextEntry={showConfirmPass ? false : true}
        label="Potvrďte heslo"
        labelColor={colors.coolGray[400]}
        labelBGColor={colorMode === 'light' ? 'white' : colors.coolGray[800]}
        defaultValue={formData.password_confirmation}
        onChangeText={newPassword =>
          setFormData(prev => {
            setFormData(prev => ({
              ...prev,
              password_confirmation: newPassword,
            }));
            setErrorData(prev => ({...prev, password_confirmationError: ''}));
          })
        }
        InputRightElement={
          <Pressable
            mr="2"
            onPress={() => {
              setShowConfirmPass(!showConfirmPass);
            }}
          >
            <Icon
              size="5"
              color="coolGray.400"
              as={MaterialIcons}
              name={showConfirmPass ? 'visibility' : 'visibility-off'}
            />
          </Pressable>
        }
      >
        <FormControl.ErrorMessage>
          {errorData.password_confirmationError}
        </FormControl.ErrorMessage>
      </FormInput>
      <Checkbox
        _dark={{
          value: 'demo',
          _checked: {
            value: 'demo',
            bg: 'primary.700',
            borderColor: 'primary.700',
            _icon: {color: 'white'},
          },
        }}
        _light={{
          value: 'demo',
          _checked: {
            value: 'demo',
            bg: 'primary.900',
            borderColor: 'primary.900',
          },
        }}
        defaultIsChecked
        value="demo"
        accessibilityLabel="Remember me"
      >
        <HStack alignItems="center">
          <Text
            fontSize="sm"
            fontWeight="normal"
            _light={{color: 'coolGray.800'}}
            _dark={{color: 'coolGray.400'}}
            pl="2"
          >
            Přijímám{' '}
          </Text>
          <Link
            _text={{
              fontSize: 'sm',
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
            _light={{
              _text: {
                color: 'primary.900',
              },
            }}
            _dark={{
              _text: {
                color: 'primary.500',
                fontSize: 'sm',
                fontWeight: 'medium',
              },
            }}
          >
            Podmínky použití{' '}
          </Link>
          <Text
            fontSize="sm"
            _light={{color: 'coolGray.800'}}
            _dark={{color: 'coolGray.300'}}
          >
            &{' '}
          </Text>
          <Link
            _text={{
              fontSize: 'sm',
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
            _light={{
              _text: {
                color: 'primary.900',
              },
            }}
            _dark={{
              _text: {
                color: 'primary.500',
              },
            }}
          >
            Zásady ochrany osobních údajů
          </Link>
        </HStack>
      </Checkbox>
      <Button
        mt={{base: 8, md: 6}}
        onPress={() => onSubmit()}
        variant="solid"
        size="lg"
      >
        {loading ? <Spinner color={'primary.50'} /> : 'Zaregistrovat se'}
      </Button>
    </FormControl>
  );
};

function SignUpFormComponent({navigation, loading, register}) {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={{width: '100%', height: '100%'}}
      bounces={false}
    >
      <MobileHeader navigation={navigation} />
      <Box
        flex="1"
        px={{base: 4, md: 8}}
        py="8"
        _light={{bg: 'white'}}
        _dark={{bg: 'coolGray.800'}}
        justifyContent="space-between"
        borderTopRightRadius={{base: '2xl', md: 'md'}}
        borderBottomRightRadius={{base: '0', md: 'md'}}
        borderTopLeftRadius={{base: '2xl', md: '0'}}
      >
        <Hidden till="md">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            _light={{color: 'coolGray.800'}}
            _dark={{color: 'coolGray.50'}}
            mb={'8'}
          >
            Pro pokračování se zaregistrujte
          </Text>
        </Hidden>

        <SignUpForm
          loading={loading}
          navigation={navigation}
          register={register}
        />
        <HStack
          mt={{base: 'auto', md: '8'}}
          space="1"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontSize="sm"
            color="coolGray.500"
            fontWeight="normal"
            _dark={{color: 'coolGray.400'}}
          >
            Už u nás účet máte?
          </Text>
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
              Přihlašte se
            </Text>
          </Pressable>
        </HStack>
      </Box>
    </KeyboardAwareScrollView>
  );
}

const SignUp = ({navigation, register, auth}) => {
  return (
    <GuestLayout>
      <Hidden till="md">
        <SideContainerWeb navigation={navigation} />
      </Hidden>
      <Box flex="1">
        <SignUpFormComponent
          loading={auth.loading}
          register={register}
          navigation={navigation}
        />
      </Box>
    </GuestLayout>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {register})(SignUp);
