import React, {useEffect, useState} from 'react';
import {
  HStack,
  Text,
  VStack,
  Avatar,
  Button,
  Link,
  TextArea,
  useColorModeValue,
  Box,
  useTheme,
  Spinner,
  FormControl,
  Center,
} from 'native-base';
import FloatingLabelInput from '../components/FloatingLabelInput';
import DashboardLayout from '../components/Layouts/DashboardLayout';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {getProfile} from '../actions/profile';
import {useIsFocused} from '@react-navigation/native';
import {setAlert} from '../actions/alert';
import {sendMessage} from '../actions/profile';
import {Pressable} from 'react-native';

function MainContent({user, sendMessage, loading, navigation}) {
  const {colors} = useTheme();

  const [emailForm, setEmailForm] = useState({
    body: '',
    subject: '',
  });

  const {body, subject} = emailForm;

  const confirmPassLabelBGColor = useColorModeValue(
    'white',
    colors.coolGray[800],
  );

  const handleFormUpdate = (name, value) =>
    setEmailForm(prev => ({...prev, [name]: value}));

  return (
    <Box
      px={{base: 4, md: 60, lg: 140}}
      py={{base: 4, md: 8}}
      rounded={{md: 'sm'}}
      _light={{bg: 'white'}}
      _dark={{bg: 'coolGray.800'}}
    >
      {user ? (
        <>
          <KeyboardAwareScrollView style={{flex: 1}} bounces={false}>
            <Box>
              <Pressable
                onPress={() => {
                  navigation.navigate('SellerProfile', {id: user.data.id});
                }}
              >
                <HStack space="3" alignItems="center">
                  <Avatar size="sm" bg="emerald.600" source={''}>
                    {user.data.firstname.slice(0, 1).toUpperCase() +
                      user.data.lastname.slice(0, 1).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      _light={{color: 'coolGray.800'}}
                      _dark={{color: 'coolGray.50'}}
                      lineHeight="21"
                    >
                      {user.data.firstname + ' ' + user.data.lastname}
                    </Text>
                    <Text
                      _light={{color: 'coolGray.500'}}
                      _dark={{color: 'coolGray.400'}}
                      fontSize="xs"
                      fontWeight="normal"
                      lineHeight="18"
                    >
                      {user.data.email}
                    </Text>
                  </Box>
                </HStack>
              </Pressable>
              <FormControl>
                <VStack space="3" mt="6">
                  <VStack mt="6" space="3">
                    <Text
                      fontSize="md"
                      fontWeight="medium"
                      _light={{color: 'coolGray.800'}}
                      _dark={{color: 'coolGray.50'}}
                      lineHeight="24"
                    >
                      Předmět
                    </Text>
                    <FloatingLabelInput
                      isRequired
                      type="text"
                      label="Zadejte předmět"
                      labelColor={colors.coolGray[400]}
                      defaultValue={subject}
                      onChangeText={txt => handleFormUpdate('subject', txt)}
                      labelBGColor={confirmPassLabelBGColor}
                    />
                  </VStack>
                  <Text
                    fontSize="md"
                    fontWeight="medium"
                    _light={{color: 'coolGray.800'}}
                    _dark={{color: 'coolGray.50'}}
                    lineHeight="24"
                  >
                    Obsah
                  </Text>
                  <TextArea
                    fontSize="14"
                    lineHeight="21"
                    textAlignVertical="top"
                    placeholderTextColor={useColorModeValue(
                      'coolGray.500',
                      'coolGray.400',
                    )}
                    _light={{color: 'coolGray.800'}}
                    _dark={{color: 'coolGray.50'}}
                    value={body}
                    onChangeText={txt => handleFormUpdate('body', txt)}
                    placeholder="Zadejte obsah zprávy"
                    h="168"
                  />
                </VStack>
              </FormControl>
            </Box>
          </KeyboardAwareScrollView>
          <Button
            onPress={() => {
              sendMessage(emailForm);
            }}
            size="lg"
            fontWeight={'bold'}
            variant="solid"
            mt="36"
          >
            {loading ? <Spinner size={'sm'} color={'white'} /> : 'Odeslat'}
          </Button>
        </>
      ) : (
        <Center h="80">
          <Spinner />
        </Center>
      )}
    </Box>
  );
}
const SendMessage = ({
  navigation,
  profileStore,
  getProfile,
  route,
  setAlert,
  sendMessage,
  auth,
}) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    if (!route.params.id) {
      navigation.navigate('Main');
    }

    if (!profileStore.profile) {
      getProfile(route.params.id);
    }
  }, [getProfile, isFocused]);
  useEffect(() => {
    if (auth.isAuthenticated == false && isFocused) {
      navigation.navigate('Main');
    }
  }, [auth]);

  const SendMessage = emailForm => {
    const data = {...emailForm, email: profileStore.profile.data.email};
    if (data.subject.trim() === '' || data.body.trim() === '') {
      setAlert('Vyplňte všechna pole', 'error');
    }
    sendMessage(data, navigation, profileStore.profile.data.id);
  };

  return (
    <DashboardLayout navigation={navigation} title="Poslat e-mail">
      <MainContent
        user={profileStore.profile}
        sendMessage={SendMessage}
        loading={profileStore.loading}
        navigation={navigation}
      />
    </DashboardLayout>
  );
};
const mapStateToProps = state => ({
  profileStore: state.profile,
  auth: state.auth,
});
export default connect(mapStateToProps, {getProfile, setAlert, sendMessage})(
  SendMessage,
);
