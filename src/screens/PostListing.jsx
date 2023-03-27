import React, {useState} from 'react';
import {
  Box,
  HStack,
  Icon,
  Text,
  Spinner,
  VStack,
  Image,
  Select,
  Pressable,
  FormControl,
  TextArea,
  Input,
  Hidden,
  Divider,
  Button,
  Link,
  InputGroup,
  InputRightAddon,
  Center,
  CheckIcon,
  AlertDialog,
} from 'native-base';
import {MaterialIcons} from '@expo/vector-icons';
import DashboardLayout from '../components/Layouts/DashboardLayout';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import {TimePickerModal, DatePickerModal} from 'react-native-paper-dates';
import Moment from 'moment';
import {getCategories} from '../actions/category';
import {connect} from 'react-redux';
import {addListing} from '../actions/product';
import {setAlert} from '../actions/alert';
import {Platform} from 'react-native';

const fetchImageFromUri = async uri => {
  const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

  const response = await fetch(uploadUri);
  const blob = await response.blob();

  return blob;
};

function AddPhoto({images, setImage}) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      setImage(result.assets);
    }
  };

  return (
    <Box
      mt={{base: 4, md: 6}}
      px={{base: 4, md: 0}}
      py={{base: 4, md: 0}}
      _light={{bg: 'white'}}
      _dark={{bg: 'coolGray.800'}}
    >
      <Text
        fontSize="sm"
        fontWeight="medium"
        _light={{color: 'coolGray.800'}}
        _dark={{color: 'coolGray.50'}}
      >
        Přidejte fotky
      </Text>

      <Center
        width="100%"
        height="116"
        _light={{borderColor: 'coolGray.300'}}
        _dark={{borderColor: 'coolGray.700'}}
        borderWidth="1"
        borderStyle="dashed"
        mt={{base: 3}}
      >
        <Pressable alignItems="center" onPress={pickImage}>
          {images.length == 0 ? (
            <>
              <Icon
                as={MaterialIcons}
                name={'cloud-upload'}
                color="coolGray.400"
                size="6"
              />
              <Text
                fontSize="sm"
                mt="0.5"
                _light={{color: 'coolGray.500'}}
                _dark={{color: 'coolGray.400'}}
              >
                Upload
              </Text>
            </>
          ) : (
            <HStack>
              {images.map(image => (
                <Image
                  ml={1}
                  source={{uri: image.uri}}
                  alt={image.uri}
                  key={image.uri}
                  width="100"
                  height="100"
                />
              ))}
            </HStack>
          )}
        </Pressable>
      </Center>
    </Box>
  );
}
function Description({desc, setDesc}) {
  return (
    <Box
      mt={{base: 4, md: 8}}
      py={{base: 4, md: 0}}
      px={{base: 4, md: 0}}
      _light={{bg: 'white'}}
      _dark={{bg: 'coolGray.800'}}
    >
      <Text
        fontSize="sm"
        fontWeight="medium"
        _light={{color: 'coolGray.800'}}
        _dark={{color: 'coolGray.50'}}
      >
        Popis
      </Text>
      <TextArea
        value={desc}
        onChangeText={e => e.length < 500 && setDesc(e)}
        h="119"
        mt={3}
        placeholder="Detailní popis vaší položky"
        _light={{placeholderTextColor: 'coolGray.500'}}
        _dark={{placeholderTextColor: 'coolGray.400'}}
      />
    </Box>
  );
}
function StartingPrice({startingPrice, setStartingPrice}) {
  return (
    <Box
      mt={{base: 4, md: 8}}
      py={{base: 4, md: 0}}
      px={{base: 4, md: 0}}
      _light={{bg: 'white'}}
      _dark={{bg: 'coolGray.800'}}
    >
      <Text
        fontSize="sm"
        fontWeight="medium"
        _light={{color: 'coolGray.800'}}
        _dark={{color: 'coolGray.50'}}
      >
        Počáteční cena
      </Text>
      <FormControl isRequired mt={{base: 3}}>
        <InputGroup
          w={{
            base: '100%',
            md: '100%',
          }}
        >
          <Input
            keyboardType="numeric"
            value={startingPrice}
            onChangeText={val => {
              if (val.length > 7) {
                return;
              }
              setStartingPrice(val.replace(/[^0-9]/g, ''));

              if (val == '' || val == 0 || val == undefined) {
                setStartingPrice(1);
              }
            }}
            placeholder="Zadejte cenu, na které aukce začne"
            _light={{placeholderTextColor: 'coolGray.500'}}
            _dark={{placeholderTextColor: 'coolGray.400'}}
            py={3}
            w={{md: '96%', base: '90%'}}
          />
          <InputRightAddon children={'Kč'} />
        </InputGroup>
      </FormControl>
    </Box>
  );
}
function ListingName({setListingName, listingName}) {
  return (
    <Box
      mt={{base: 4, md: 8}}
      py={{base: 4, md: 0}}
      px={{base: 4, md: 0}}
      _light={{bg: 'white'}}
      _dark={{bg: 'coolGray.800'}}
    >
      <Text
        fontSize="sm"
        fontWeight="medium"
        _light={{color: 'coolGray.800'}}
        _dark={{color: 'coolGray.50'}}
      >
        Název položky
      </Text>
      <FormControl isRequired mt="3">
        <Input
          placeholder="Zadejte nadpis vaší položky"
          value={listingName}
          onChangeText={e => {
            e.length < 100 && setListingName(e);
          }}
          _light={{placeholderTextColor: 'coolGray.500'}}
          _dark={{placeholderTextColor: 'coolGray.400'}}
          py={3}
        />
      </FormControl>
    </Box>
  );
}
function SubmitButton({onSubmit, loading, posted}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef(null);
  return (
    <>
      <Button
        disabled={loading && posted}
        onPress={() => {
          setIsOpen(!isOpen);
        }}
        variant="solid"
        _text={{fontWeight: 'medium'}}
        mx={{base: 4, md: 0}}
        mt={{base: 4, md: 8}}
      >
        {loading && posted ? <Spinner color={'white'} /> : 'Vytvořit'}
      </Button>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Jste si jisti?</AlertDialog.Header>
          <AlertDialog.Body>
            Jakmile aukce začne, nebudete mít možnost ji zrušit ani upravit.
            Opravdu chcete aukci začít?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
              >
                Zrušit
              </Button>
              <Button
                colorScheme="success"
                onPress={() => {
                  onClose();
                  onSubmit();
                }}
              >
                Pokračovat
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  );
}
function MainContent({
  categoryList,
  addListing,
  userId,
  contactProp,
  adressProp,
  setAlert,
  navigation,
  loading,
}) {
  const [date, setDate] = React.useState('');
  const [posted, setPosted] = React.useState(false);
  const [desc, setDesc] = React.useState('');
  const [adress, setAdress] = React.useState(adressProp);
  const [contact, setContact] = React.useState(contactProp);
  const [images, setImage] = useState([]);

  const [category, setCategory] = React.useState('');
  const [startingPrice, setStartingPrice] = useState('1');
  const [listingName, setListingName] = useState('');
  const [open, setOpen] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const today = new Date();

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    params => {
      setOpen(false);
      setVisible(true);
      setDate(params.date);
    },
    [setOpen, setDate],
  );

  const onDismiss = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = React.useCallback(
    ({hours, minutes}) => {
      setVisible(false);

      setDate(date => {
        date.setHours(hours, minutes, 0);
        return date;
      });
    },
    [setVisible, date],
  );

  const onSubmit = async () => {
    if (
      listingName.replace(' ', '') == '' ||
      contact.replace(' ', '') == '' ||
      adress.replace(' ', '') == '' ||
      date == '' ||
      category == '' ||
      desc.replace(' ', '') == ''
    ) {
      setAlert('Prosím vyplňte všechna pole', 'error');
      return;
    }
    setPosted(true);

    const formData = new FormData();
    for (const image of images) {
      if (Platform.OS == 'web') {
        const img = await fetchImageFromUri(image.uri);
        formData.append('images[]', img, 'reklamafoto.jpg');
      } else {
        console.log(image);
        formData.append('images[]', {
          uri: image.uri,
          type: `image/${image.type.split('image/').pop()}`,
          name: image.fileName,
        });
      }
    }

    formData.append('user_id', userId);
    formData.append('category_id', category);
    formData.append('name', listingName);
    formData.append('info', desc);
    formData.append('price', startingPrice);
    formData.append('ending', Moment(date).format('Y-MM-DD HH:mm:00'));
    formData.append('phone_number', contact);
    formData.append('location', adress);

    addListing(formData, navigation);
  };
  return (
    <Box
      _light={{bg: {md: 'white'}}}
      _dark={{
        bg: {base: 'coolGray.700', md: 'coolGray.800'},
      }}
      px={{base: 0, md: 8, lg: 24, xl: 140}}
      rounded={{md: 'sm'}}
      pt={{base: 0, md: 8}}
      pb={{base: 4, md: 8}}
    >
      <ListingName setListingName={setListingName} listingName={listingName} />
      <Box
        mt={{base: 4, md: 8}}
        py={{base: 4, md: 0}}
        px={{base: 4, md: 0}}
        _light={{bg: 'white'}}
        _dark={{bg: 'coolGray.800'}}
      >
        <Text
          fontSize="sm"
          fontWeight="medium"
          mb={2}
          _light={{color: 'coolGray.800'}}
          _dark={{color: 'coolGray.50'}}
        >
          Kategorie
        </Text>
        <Select
          selectedValue={category}
          minWidth="300"
          accessibilityLabel="Vyberte kategorii"
          placeholder="Vyberte kategorii"
          _selectedItem={{
            bg: 'teal.600',
            endIcon: <CheckIcon size="5" />,
          }}
          mt={1}
          onValueChange={itemValue => {
            setCategory(itemValue);
          }}
        >
          {categoryList.map(category => (
            <Select.Item
              label={category.name}
              key={category.id}
              value={category.id.toString()}
            />
          ))}
        </Select>
      </Box>
      <Hidden from="base" till="md">
        <Divider
          mt={5}
          _light={{bg: 'coolGray.200'}}
          _dark={{bg: 'coolGray.700'}}
        />
      </Hidden>
      <AddPhoto images={images} setImage={setImage} />
      <Description desc={desc} setDesc={setDesc} />
      <StartingPrice
        startingPrice={startingPrice}
        setStartingPrice={setStartingPrice}
      />
      <Box
        mt={{base: 4, md: 8}}
        py={{base: 4, md: 0}}
        px={{base: 4, md: 0}}
        _light={{bg: 'white'}}
        _dark={{bg: 'coolGray.800'}}
      >
        <Text
          fontSize="sm"
          fontWeight="medium"
          _light={{color: 'coolGray.800'}}
          _dark={{color: 'coolGray.50'}}
        >
          Číslo účtu (nepovinné)
        </Text>

        <FormControl isRequired mt="3">
          <Input
            placeholder="Číslo účtu, na který výherce bude mít možnost zaplatit aukci."
            _light={{placeholderTextColor: 'coolGray.500'}}
            _dark={{placeholderTextColor: 'coolGray.400'}}
            py={3}
          />
        </FormControl>
      </Box>
      <Box
        mt={{base: 4, md: 8}}
        py={{base: 4, md: 0}}
        px={{base: 4, md: 0}}
        _light={{bg: 'white'}}
        _dark={{bg: 'coolGray.800'}}
      >
        <Text
          fontSize="sm"
          fontWeight="medium"
          _light={{color: 'coolGray.800'}}
          _dark={{color: 'coolGray.50'}}
        >
          Adresa
        </Text>

        <FormControl isRequired mt="3">
          <Input
            placeholder="Zadejte lokaci předmětu"
            value={adress}
            _light={{placeholderTextColor: 'coolGray.500'}}
            _dark={{placeholderTextColor: 'coolGray.400'}}
            onChangeText={e => e.length < 100 && setAdress(e)}
            py={3}
          />
        </FormControl>
      </Box>
      <Box
        mt={{base: 4, md: 8}}
        py={{base: 4, md: 0}}
        px={{base: 4, md: 0}}
        _light={{bg: 'white'}}
        _dark={{bg: 'coolGray.800'}}
      >
        <Text
          fontSize="sm"
          fontWeight="medium"
          _light={{color: 'coolGray.800'}}
          _dark={{color: 'coolGray.50'}}
        >
          Kontakt
        </Text>

        <FormControl isRequired mt="3">
          <Input
            placeholder="Zadejte kontakt"
            value={contact}
            _light={{placeholderTextColor: 'coolGray.500'}}
            _dark={{placeholderTextColor: 'coolGray.400'}}
            onChangeText={e => e.length < 100 && setContact(e)}
            py={3}
          />
        </FormControl>
      </Box>

      <Pressable
        onPress={() => {
          setOpen(true);
        }}
        onTouchEnd={() => {
          setOpen(true);
        }}
      >
        <Box
          mt={{base: 4, md: 8}}
          py={{base: 4, md: 0}}
          px={{base: 4, md: 0}}
          _light={{bg: 'white'}}
          _dark={{bg: 'coolGray.800'}}
        >
          <Text
            fontSize="sm"
            fontWeight="medium"
            _light={{color: 'coolGray.800'}}
            _dark={{color: 'coolGray.50'}}
          >
            Čas, kdy aukce skončí
          </Text>

          <FormControl isRequired mt="3">
            <Input
              disabled
              editable={false}
              placeholder="Vyberte den, kdy má aukce skončit"
              value={date !== '' ? Moment(date).format('DD/MM/YYYY HH:mm') : ''}
              _light={{placeholderTextColor: 'coolGray.500'}}
              _dark={{placeholderTextColor: 'coolGray.400'}}
              py={3}
            />
          </FormControl>
        </Box>
      </Pressable>
      <DatePickerModal
        saveLabel="Uložit"
        mode="single"
        locale={'en-GB'}
        label={'Vyberte datum'}
        startYear={today.getFullYear()}
        endYear={new Date(today.getTime() + 864000000).getFullYear()}
        validRange={{
          startDate: new Date(today.getTime() + 86400000),
          endDate: new Date(today.getTime() + 904000000),
        }}
        visible={open}
        onDismiss={onDismissSingle}
        date={date}
        onConfirm={onConfirmSingle}
      />

      <TimePickerModal
        cancelLabel="Zrušit"
        label="Vyberte čas"
        locale={'en-GB'}
        visible={visible}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        hours={12}
        minutes={14}
      />
      <SubmitButton loading={loading} posted={posted} onSubmit={onSubmit} />
    </Box>
  );
}

const PostListing = ({
  navigation,
  category,
  product,
  auth,
  addListing,
  getCategories,
  setAlert,
}) => {
  React.useEffect(() => {
    getCategories();
  }, []);
  return (
    <DashboardLayout navigation={navigation} title="Vytvořit aukci">
      <KeyboardAwareScrollView>
        {category.loading ? (
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
          <MainContent
            navigation={navigation}
            loading={product.loading}
            setAlert={setAlert}
            addListing={addListing}
            categoryList={category.categories.data}
            userId={auth.user.id}
            adressProp={auth.user.location}
            contactProp={auth.user.phone_number}
          />
        )}
      </KeyboardAwareScrollView>
    </DashboardLayout>
  );
};
const mapStateToProps = state => ({
  product: state.product,
  auth: state.auth,
  category: state.category,
});
export default connect(mapStateToProps, {getCategories, addListing, setAlert})(
  PostListing,
);
