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
import {forgotPassword} from '../../actions/auth';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

const FormInput = ({children, ...props}) => (
  <VStack mb="6">
    <FloatingLabelInput {...props} />
    {children}
  </VStack>
);

const ForgotPasswordForm = ({forgotPassword, loading}) => {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [errorData, setErrorData] = useState({
    emailError: '',
  });

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
    if (foundError) {
      return;
    }

    forgotPassword(formData.email);
  };

  return (
    <FormControl isRequired isInvalid={errorData.emailError}>
      <FormInput
        id={'Email input'}
        isRequired
        disabled={loading}
        label="Email"
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

      <Button
        onPress={() => onSubmit()}
        variant="solid"
        size="lg"
        mt={{base: 5, md: 3}}
      >
        {loading ? <Spinner color={'primary.50'} /> : 'Odeslat'}
      </Button>
    </FormControl>
  );
};

const ForgotPasswordComponent = ({navigation, forgotPassword, auth}) => {
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
          Zapomenuté heslo
        </Text>
        <ForgotPasswordForm
          loading={auth.loading}
          forgotPassword={forgotPassword}
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
          >
            Vzpomněli jste si na heslo?
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
            Sign In
          </Text>
        </HStack>
        <VStack space={0.5}>
          <Text fontSize="3xl" fontWeight="bold" color="coolGray.50">
            Nepamatujete si heslo?
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
            Pro obnovení hesla zadejte email
          </Text>
        </VStack>
      </VStack>
    </Hidden>
  );
}
const ForgotPassword = ({forgotPassword, auth, navigation}) => {
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

      <ForgotPasswordComponent
        auth={auth}
        navigation={navigation}
        forgotPassword={forgotPassword}
      />
    </GuestLayout>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {forgotPassword})(ForgotPassword);
