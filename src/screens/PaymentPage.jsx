import React, {useState} from 'react';
import {
  Box,
  HStack,
  Text,
  VStack,
  Button,
  Image,
  Radio,
  Divider,
  Hidden,
  Input,
  Heading,
  Center,
  Stack,
  Spinner,
} from 'native-base';
import DashboardLayout from '../components/Layouts/DashboardLayout';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getCheckout, completeCheckout} from '../actions/checkout';
import {connect} from 'react-redux';
import {setAlert} from '../actions/alert';
import {useIsFocused} from '@react-navigation/native';
import thousandFormatter from '../utils/thousandFormatter';

const paymentTypeList = ['Add Debit/Credit/ATM Card'];

function OrderDetailsItem({orderKey, orderValue, props}) {
  return (
    <HStack py="2" justifyContent="space-between" {...props}>
      <Text
        fontSize="xs"
        _light={{color: 'coolGray.800'}}
        _dark={{color: 'coolGray.50'}}
      >
        {orderKey}
      </Text>
      <Text
        fontSize="xs"
        _light={{color: 'coolGray.800'}}
        _dark={{color: 'coolGray.50'}}
        {...props?._text}
      >
        {orderValue}
      </Text>
    </HStack>
  );
}

function OrderDetailsCard({product}) {
  return (
    <Box
      px="4"
      py="3"
      borderRadius="sm"
      _light={{bg: 'coolGray.100'}}
      _dark={{bg: 'coolGray.700'}}
    >
      <Heading py="2" size="xs" _light={{color: 'coolGray.800'}}>
        Detail objednávky
      </Heading>

      <OrderDetailsItem
        orderKey={product.data.name}
        orderValue={product.data.price + ' Kč'}
        //props={description.props}
      />

      <Divider bg="coolGray.200" />
      <HStack pt="3" pb="2" justifyContent="space-between">
        <Text
          fontSize="sm"
          fontWeight="medium"
          _light={{color: 'coolGray.800'}}
          _dark={{color: 'coolGray.50'}}
        >
          Celková cena
        </Text>
        <Text
          fontSize="sm"
          _light={{color: 'coolGray.800'}}
          _dark={{color: 'coolGray.50'}}
        >
          {thousandFormatter(product.data.price.toString()) + '.00 Kč'}
        </Text>
      </HStack>
    </Box>
  );
}

function FormInput({value, changeValue, label, placeholder, name, ..._input}) {
  return (
    <VStack space="3" w="full" flex={1}>
      <Text
        _light={{color: 'coolGray.500'}}
        _dark={{color: 'coolGray.400'}}
        fontSize="sm"
        fontWeight="medium"
      >
        {label}
      </Text>
      <Input
        flex={1}
        placeholder={placeholder}
        value={value}
        onChange={e => e.stopPropagation()}
        onChangeText={changeValue(name)}
        {..._input}
      />
    </VStack>
  );
}

function PaymentForm({paymentData, setPaymentData}) {
  const handleInputChange = key => value =>
    setPaymentData(prev => ({...prev, [key]: value}));

  const {cardNumber, cardHolderName, expirationDate, cvv} = paymentData;

  return (
    <Box py="3" pl="44" pr={{base: '4', md: '0'}} w="full">
      <Stack direction={{base: 'column', md: 'row'}} space="6">
        <FormInput
          name="cardNumber"
          placeholder="Enter card number"
          changeValue={handleInputChange}
          value={cardNumber}
          label="CARD NUMBER"
          _input={{
            keyboardType: 'numeric',
            maxLength: 16,
          }}
        />
        <FormInput
          name="cardHolderName"
          placeholder="Enter cardholder name"
          changeValue={handleInputChange}
          value={cardHolderName}
          label="CARDHOLDER NAME"
        />
      </Stack>
      <HStack space="6" mt="6">
        <FormInput
          name="expirationDate"
          placeholder="Enter card expiration date"
          changeValue={handleInputChange}
          value={expirationDate}
          label="EXPIRATION DATE"
          _input={{
            maxLength: 5,
          }}
        />
        <FormInput
          name="cvv"
          placeholder="Enter CVV"
          changeValue={handleInputChange}
          value={cvv}
          label="CVV"
          _input={{
            keyboardType: 'numeric',
            maxLength: 3,
          }}
        />
      </HStack>
    </Box>
  );
}

function PaymentMethodSelector({
  value,
  label,
  paymentInputComponent,
  showInput,
}) {
  return (
    <>
      <Box py="3" px={{base: '4', md: '0'}}>
        <Radio
          value={value}
          alignItems="center"
          size="sm"
          _text={{
            fontSize: 'sm',
            _dark: {color: 'coolGray.400'},
            _light: {color: 'coolGray.500'},
            lineHeight: '21',
          }}
        >
          {label}
        </Radio>
      </Box>
      {showInput ? paymentInputComponent : null}
    </>
  );
}

function PaymentMethod({paymentData, setPaymentData}) {
  const [value, setValue] = useState('1');

  const getCurrentMethodInputForm = () => {
    switch (value) {
      case '1':
        return (
          <PaymentForm
            paymentData={paymentData}
            setPaymentData={setPaymentData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <VStack pt={{md: '2'}} mb="4">
      <Radio.Group
        name="More ways to pay"
        _light={{bg: 'white'}}
        _dark={{bg: 'coolGray.800'}}
        mt={{base: 4, md: 0}}
        py={{base: 2, md: 0}}
        value={value}
        onChange={nextValue => {
          setValue(nextValue);
        }}
      >
        <Text
          px={{base: '4', md: '0'}}
          pt="2"
          pb="3"
          fontSize="sm"
          fontWeight="medium"
          lineHeight="21"
          _light={{color: 'coolGray.800'}}
          _dark={{color: 'coolGray.50'}}
        >
          More Ways to pay
        </Text>
        {paymentTypeList.map((method, index) => (
          <PaymentMethodSelector
            key={index}
            value={`${index + 1}`}
            label={method}
            paymentInputComponent={getCurrentMethodInputForm()}
            showInput={value === (index + 1).toString()}
          />
        ))}
      </Radio.Group>
    </VStack>
  );
}

function MainContent({checkout, paymentData, setPaymentData}) {
  return (
    <>
      <Hidden till="md">
        <OrderDetailsCard product={checkout.product} />
      </Hidden>
      <PaymentMethod
        paymentData={paymentData}
        setPaymentData={setPaymentData}
      />
    </>
  );
}

const PaymentPage = ({
  navigation,
  getCheckout,
  checkout,
  route,
  auth,
  completeCheckout,
  setAlert,
}) => {
  const isFocused = useIsFocused();
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    cvv: '',
  });

  const startCheckout = () => {
    if (
      paymentData.cardNumber.replace(' ', '') == '' ||
      paymentData.cardHolderName.replace(' ', '') == '' ||
      paymentData.expirationDate.replace(' ', '') == '' ||
      paymentData.cvv.replace(' ', '') == ''
    ) {
      setAlert('Prosím vyplňte všechna pole', 'error');
      return;
    }
    if (!paymentData.expirationDate.includes('/')) {
      setAlert('Prosím zadejte všechny údaje ve správném formátu', 'error');
      return;
    }

    completeCheckout(
      {
        cvc: paymentData.cvv,
        card_number: paymentData.cardNumber,
        exp_month: paymentData.expirationDate.split('/')[0],
        exp_year: paymentData.expirationDate.split('/')[1],
        listing_id: checkout.product.data.id,
      },
      navigation,
    );
  };

  React.useEffect(() => {
    if (!route.params.id || isNaN(route.params.id)) {
      navigation.navigate('Main');
      return;
    }
    getCheckout(route.params.id);
  }, [route, getCheckout, isFocused]);

  React.useEffect(() => {
    if (checkout.product.sold) {
      navigation.navigate('Main');
      return;
    }

    if (
      checkout.product.winningUserId &&
      auth.user &&
      auth.user.id &&
      checkout.product.winningUserId !== auth.user.id
    ) {
      navigation.navigate('Main');
      return;
    }
  }, [checkout, auth]);

  return (
    <>
      <DashboardLayout
        navigation={navigation}
        title="Payments"
        rightPanelMobileHeader={false}
      >
        <KeyboardAwareScrollView
          bounces={false}
          enableOnAndroid={true}
          contentContainerStyle={{flexGrow: 1}}
          style={{height: '100%', width: '100%'}}
        >
          {checkout.loading ? (
            <Center
              px={{base: 0, md: 8, lg: 24, xl: 140}}
              rounded={{md: 'sm'}}
              pt={{base: 0, md: 8}}
              pb={{base: 4, md: 8}}
              h={'200'}
              _light={{bg: {md: 'white'}}}
              _dark={{
                bg: {base: 'coolGray.700', md: 'coolGray.800'},
              }}
            >
              <Spinner />
            </Center>
          ) : (
            <Box
              flex={1}
              px={{md: 8, lg: 16, xl: 35}}
              py={{md: 8}}
              rounded={{md: 'sm'}}
              _light={{bg: {md: 'white'}}}
              _dark={{
                bg: {md: 'coolGray.800', base: 'coolGray.700'},
              }}
            >
              <MainContent
                paymentData={paymentData}
                setPaymentData={setPaymentData}
                checkout={checkout}
              />
              <Button
                onPress={() => startCheckout()}
                variant="solid"
                size="lg"
                mt="auto"
                mb="1"
                mx={{base: '4', md: '0'}}
              >
                {checkout.checkoutLoading ? (
                  <Spinner color={'white'} />
                ) : (
                  'Zaplatit'
                )}
              </Button>
            </Box>
          )}
        </KeyboardAwareScrollView>
      </DashboardLayout>
    </>
  );
};

const mapStateToProps = state => ({
  checkout: state.checkout,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getCheckout,
  completeCheckout,
  setAlert,
})(PaymentPage);
