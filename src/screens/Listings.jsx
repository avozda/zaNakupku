import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {getProductsByCategory} from '../actions/product';
import {
  HStack,
  Icon,
  Text,
  useBreakpointValue,
  useColorModeValue,
  FlatList,
  Input,
  Center,
  Spinner,
  Select,
  CheckIcon,
  Box,
  Button,
} from 'native-base';
import {Feather, FontAwesome} from '@expo/vector-icons';

import {useWindowDimensions} from 'react-native';
import ListingCard from '../components/ListingCard';
import {Platform} from 'react-native';
import DashboardLayout from '../components/Layouts/DashboardLayout';
import {useIsFocused} from '@react-navigation/native';

const PageButton = ({page, onClick, selectedPage}) => {
  return (
    <Button
      ml={2}
      disabled={page == selectedPage}
      onPress={() => onClick(page)}
      backgroundColor={
        page == selectedPage
          ? useColorModeValue('white', 'coolGray.800')
          : 'primary.900'
      }
      size="sm"
      variant="solid"
    >
      <Text
        fontWeight={'semibold'}
        color={page == selectedPage ? 'primary.900' : 'white'}
      >
        {page}
      </Text>
    </Button>
  );
};

const Listings = ({navigation, getProductsByCategory, product, route}) => {
  const isFocused = useIsFocused();
  const [currentCategory, setCurrentCategory] = React.useState('');
  const [filterForm, setFilterForm] = React.useState({
    search: route.params.search,
    minPrice: undefined,
    maxPrice: undefined,
    page: route.params.page ?? 1,
    orderBy: route.params.orderBy ?? 'ending',
  });
  const [timer, setTimer] = React.useState(null);

  const search = searchTerm => {
    clearTimeout(timer);
    const newTimer = setTimeout(async () => {
      setFilterForm({...filterForm, search: searchTerm});
      navigation.navigate('Listings', {
        ...filterForm,
        search: searchTerm,
        categoryCode: route.params.categoryCode,
      });
    }, 400);
    setTimer(newTimer);
  };

  const order = value => {
    setFilterForm({...filterForm, orderBy: value});
    navigation.navigate('Listings', {
      ...filterForm,
      orderBy: value,
      categoryCode: route.params.categoryCode,
    });
  };

  const setPage = page => {
    setFilterForm({...filterForm, page});
    navigation.navigate('Listings', {
      ...filterForm,
      page,
      categoryCode: route.params.categoryCode,
    });
  };

  useEffect(() => {
    if (isFocused) {
      getProductsByCategory({
        ...filterForm,
        category: route.params.categoryCode,
      });
    }
  }, [filterForm, getProductsByCategory, route, isFocused]);

  useEffect(() => {
    setCurrentCategory('');
  }, [isFocused]);

  useEffect(() => {
    if (product.products.category) {
      setCurrentCategory(product.products.category.name);
    }
  }, [product.products.category]);

  const noColumn = useBreakpointValue({
    base: 2,
    sm: 3,
    md: 3,
    lg: 5,
    xl: 5,
  });
  const {height} = useWindowDimensions();

  return (
    <DashboardLayout
      title={currentCategory == '' ? '...' : currentCategory}
      navigation={navigation}
    >
      <HStack
        mb={{base: 0, md: 4}}
        flexDirection={{base: 'column', md: 'row'}}
        justifyContent="space-between"
      >
        <Input
          maxW={{
            base: '300',
            md: '30%',
          }}
          m={{
            base: 4,
            md: 0,
          }}
          mb={0}
          mr={0}
          _light={{
            bgColor: 'white',
          }}
          _dark={{
            bgColor: 'coolGray.900',
          }}
          size="md"
          onChangeText={search}
          defaultValue={filterForm.search}
          placeholder={
            'Vyhledávat v ' + (currentCategory == '' ? '...' : currentCategory)
          }
          InputLeftElement={
            <Icon
              px="2"
              pr={4}
              size="4"
              name={'search'}
              as={FontAwesome}
              _light={{
                color: 'coolGray.400',
              }}
              _dark={{
                color: 'coolGray.100',
              }}
            />
          }
        />
        <Box
          maxW="300"
          m={{
            base: 4,
            md: 0,
          }}
        >
          <Select
            _light={{
              bgColor: 'white',
            }}
            _dark={{
              bgColor: 'coolGray.900',
            }}
            selectedValue={filterForm.orderBy ?? 'ending'}
            minWidth="100"
            accessibilityLabel="Seřadit podle"
            placeholder="Seřadit podle"
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size={2} />,
            }}
            onValueChange={itemValue => order(itemValue)}
          >
            <Select.Item label="Nejdříve končící" value="ending" />
            <Select.Item label="Nejpozději končící" value="ending_reverse" />
            <Select.Item label="Cena vzestupně" value="price" />
            <Select.Item label="Cena sestupně" value="price_reverse" />
          </Select>
        </Box>
      </HStack>
      <Box
        px={{base: 2.5, md: '22'}}
        py={{base: '14', md: '22'}}
        rounded={{md: 'sm'}}
        _light={{bg: 'white'}}
        _dark={{bg: 'coolGray.800'}}
        alignItems="center"
      >
        {!product.loading && product.products.listings ? (
          product.products.listings.data.length ? (
            Platform.OS === 'web' ? (
              <>
                <HStack
                  flexWrap="wrap"
                  overflow="scroll"
                  height={{base: '100%', md: '100%'}}
                >
                  {product.products.listings.data.map(item => (
                    <ListingCard
                      key={item.id}
                      listing={item}
                      navigation={navigation}
                    />
                  ))}
                </HStack>
              </>
            ) : (
              <>
                <FlatList
                  numColumns={noColumn}
                  data={product.products.listings.data}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => (
                    <ListingCard listing={item} navigation={navigation} />
                  )}
                  key={noColumn}
                  keyExtractor={(item, index) => 'key' + index}
                />
              </>
            )
          ) : (
            <Text>Nebyly nalezeny žádné produkty</Text>
          )
        ) : product.error ? (
          <Text>Něco se nepovedlo</Text>
        ) : (
          <Center h={'200'}>
            <Spinner />
          </Center>
        )}
      </Box>
      {!product.loading && isFocused && product.products.listings && (
        <HStack mt={2} alignItems={'flex-end'} justifyContent={'flex-end'}>
          <PageButton
            page={1}
            onClick={setPage}
            selectedPage={filterForm.page}
          />
          {product.products.listings.current_page - 2 > 1 && (
            <Text ml={2} mt={1}>
              ...
            </Text>
          )}
          {product.products.listings.current_page > 2 && (
            <PageButton
              page={product.products.listings.current_page - 1}
              onClick={setPage}
              selectedPage={filterForm.page}
            />
          )}
          {product.products.listings.current_page == 1 &&
            product.products.listings.last_page !== 1 && (
              <PageButton
                page={product.products.listings.current_page + 1}
                onClick={setPage}
                selectedPage={filterForm.page}
              />
            )}

          {product.products.listings.current_page !== 1 &&
            product.products.listings.current_page !==
              product.products.listings.last_page && (
              <PageButton
                page={product.products.listings.current_page}
                onClick={setPage}
                selectedPage={filterForm.page}
              />
            )}

          {product.products.listings.current_page !==
            product.products.listings.last_page - 1 &&
            product.products.listings.current_page !==
              product.products.listings.last_page &&
            product.products.listings.current_page !== 1 && (
              <PageButton
                page={product.products.listings.current_page + 1}
                onClick={setPage}
                selectedPage={filterForm.page}
              />
            )}

          {product.products.listings.current_page + 2 <
            product.products.listings.last_page && (
            <Text ml={2} mt={1}>
              ...
            </Text>
          )}
          {product.products.listings.last_page !== 1 &&
            product.products.listings.last_page !== 2 && (
              <PageButton
                page={product.products.listings.last_page}
                onClick={setPage}
                selectedPage={filterForm.page}
              />
            )}
        </HStack>
      )}
    </DashboardLayout>
  );
};

const mapStateToProps = state => ({
  product: state.product,
});

export default connect(mapStateToProps, {getProductsByCategory})(Listings);
