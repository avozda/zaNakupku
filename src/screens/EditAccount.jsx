import React from 'react';
import {
  HStack,
  VStack,
  Avatar,
  useColorModeValue,
  Button,
  IconButton,
  Center,
  Spinner,
} from 'native-base';
import FloatingLabelInput from '../components/FloatingLabelInput';
import DashboardLayout from '../components/Layouts/DashboardLayout';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {updateUser} from '../actions/auth';

const FormComponent = ({formSubmit, user, navigation, loading}) => {
  const [firstname, setFirstname] = React.useState(user.firstname);
  const [lastname, setLastname] = React.useState(user.lastname);
  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email);
  const [phone_number, setPhone_number] = React.useState(user.phone_number);
  const [location, setLocation] = React.useState(user.location);

  const submit = () => {
    formSubmit(
      user.id,
      {
        firstname,
        lastname,
        name,
        email,
        phone_number,
        location,
      },
      navigation,
    );
  };

  const labelStyle = {
    labelColor: '#9CA3AF',
    labelBGColor: useColorModeValue('#fff', '#1F2937'),
  };
  return (
    <VStack space={{base: 6, md: 8}}>
      <VStack mt={{base: 5, md: 5}} space={6}>
        <HStack
          alignItems="center"
          flexDirection={{base: 'column', md: 'row'}}
          justifyContent="space-between"
        >
          <FloatingLabelInput
            value={firstname}
            onChangeText={setFirstname}
            isRequired
            mb={{base: 6, md: 0}}
            w="100%"
            containerWidth={{base: '100%', md: '48%'}}
            label="Křestní jméno"
            {...labelStyle}
          />
          <FloatingLabelInput
            value={lastname}
            onChangeText={setLastname}
            isRequired
            mb={{base: 6, md: 0}}
            w="100%"
            containerWidth={{base: '100%', md: '48%'}}
            label="Příjmení"
            {...labelStyle}
          />
        </HStack>

        <FloatingLabelInput
          isRequired
          label="Užiatelské jméno"
          {...labelStyle}
          value={name}
          onChangeText={setName}
        />
        <FloatingLabelInput
          isRequired
          label="E-mail"
          {...labelStyle}
          value={email}
          onChangeText={setEmail}
        />
        <FloatingLabelInput
          keyboardType="numeric"
          isRequired
          label="Telefoní číslo"
          {...labelStyle}
          value={phone_number}
          onChangeText={setPhone_number}
        />
        <FloatingLabelInput
          isRequired
          label="Adresa"
          {...labelStyle}
          value={location}
          onChangeText={setLocation}
        />
      </VStack>
      <Button
        onPress={() => submit()}
        size="lg"
        mt={{base: 'auto', md: 'auto'}}
        variant="solid"
      >
        {loading ? (
          <Center>
            <Spinner color={'white'} />
          </Center>
        ) : (
          'Uložit'
        )}
      </Button>
    </VStack>
  );
};
const EditAccount = ({navigation, auth, updateUser}) => {
  return (
    <DashboardLayout navigation={navigation} title="Upravit profil">
      <KeyboardAwareScrollView bounces={false}>
        <VStack
          px={{base: 4, md: 8, lg: 32}}
          py={{base: 5, md: 8}}
          _light={{bg: 'white'}}
          _dark={{bg: 'coolGray.800'}}
          rounded={{md: 'sm'}}
          space={{base: 6, md: 8}}
          flex={1}
        >
          {auth.loading || !auth.user ? (
            <Center h={'200'}>
              <Spinner />
            </Center>
          ) : (
            <>
              <HStack
                mb={{base: 0, md: -3}}
                alignItems="center"
                justifyContent={{md: 'space-between', base: 'space-around'}}
              >
                <Avatar size="xl" bg="emerald.600" source={''}>
                  {auth.user.firstname.slice(0, 1).toUpperCase() +
                    auth.user.lastname.slice(0, 1).toUpperCase()}
                </Avatar>
              </HStack>
              <FormComponent
                user={auth.user}
                formSubmit={updateUser}
                navigation={navigation}
                loading={auth.updatingUser}
              />
            </>
          )}
        </VStack>
      </KeyboardAwareScrollView>
    </DashboardLayout>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {updateUser})(EditAccount);
