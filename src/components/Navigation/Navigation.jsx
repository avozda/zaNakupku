import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import CustomDrawer from './CustomDrawer';
import React, {useEffect} from 'react';
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
import HomeScreen from '../../screens/HomeScreen';
import ProductDetail from '../../screens/ProductDetail';
import SignUp from '../../screens/Auth/SignUp';
import Listings from '../../screens/Listings';
import SearchResults from '../../screens/SearchResults';
import FavouritesPage from '../../screens/FavouritesPage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SellerProfile from '../../screens/SellerProfile';
import SignIn from '../../screens/Auth/SignIn';
import {useColorModeValue, useColorMode} from 'native-base';
import {connect} from 'react-redux';
import EditAccount from '../../screens/EditAccount';
import PostListing from '../../screens/PostListing';
import MyListingsPage from '../../screens/MyListingsPage';
import MyBidsPage from '../../screens/MyBidsPage';
import WriteReview from '../../screens/WriteReview';
import PaymentPage from '../../screens/PaymentPage';
import ForgotPassword from '../../screens/Auth/ForgotPassword';
import ResetPassword from '../../screens/Auth/ResetPassword';
import EmailVerificationResult from '../../screens/Auth/EmailVerificationResult';
import SendMessage from '../../screens/SendMessage';

const linking = {
  prefixes: ['exp://', 'localhost:3000', 'http://localhost:3000'],
  config: {
    screens: {
      Home: {
        initialRouteName: 'Home',
        screens: {
          Main: '/',
          Product: '/aukce/:id',
          Listings: '/kategorie/:categoryCode',
          SearchResults: '/vysledek-vyhledavani',
          SellerProfile: '/uzivatel/:id',
          SendMessage: '/kontaktovat/:id',
        },
      },
      Favourites: {
        initialRouteName: 'FavouritesPage',
        screens: {
          FavouritesPage: '/oblibene',
        },
      },
      Auth: {
        initialRouteName: 'SignIn',
        screens: {
          SignUp: '/registrace',
          SignIn: '/prihlaseni',
          ForgotPassword: '/zapomenute-heslo',
          ResetPassword: '/reset-hesla',
          EmailVerificationResult: '/overeni-emailu/:result',
        },
      },
      Account: {
        initialRouteName: 'Edit',
        screens: {
          Edit: '/uprava-profilu',
        },
      },
      MyListings: {
        initialRouteName: 'MyListingsPage',
        screens: {
          PostListing: 'pridat-aukci',
          MyListingsPage: 'moje-aukce',
        },
      },
      MyBids: {
        initialRouteName: 'MyBidsPage',
        screens: {
          MyBidsPage: 'prihazuju',
          WriteReview: '/napsat-recenzi/:id',
          PaymentPage: '/checkout/:id',
        },
      },
    },
  },
};

const HomeStack = createNativeStackNavigator();

const Home = () => (
  <HomeStack.Navigator
    initialRouteName="Main"
    screenOptions={{
      headerShown: false,
    }}
  >
    <HomeStack.Screen name="Main" component={HomeScreen} />
    <HomeStack.Screen name="Listings" component={Listings} />
    <HomeStack.Screen name="Product" component={ProductDetail} />
    <HomeStack.Screen name="Signup" component={SignUp} />
    <HomeStack.Screen name="SearchResults" component={SearchResults} />
    <HomeStack.Screen name="SellerProfile" component={SellerProfile} />
    <HomeStack.Screen name="SendMessage" component={SendMessage} />
  </HomeStack.Navigator>
);

const AuthStack = createNativeStackNavigator();

const Auth = () => (
  <AuthStack.Navigator
    initialRouteName="SignIn"
    screenOptions={{
      headerShown: false,
    }}
  >
    <AuthStack.Screen name="SignUp" component={SignUp} />
    <AuthStack.Screen name="SignIn" component={SignIn} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
    <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
    <AuthStack.Screen
      name="EmailVerificationResult"
      component={EmailVerificationResult}
    />
  </AuthStack.Navigator>
);
const AccountStack = createNativeStackNavigator();

const Account = () => (
  <AccountStack.Navigator
    initialRouteName="Edit"
    screenOptions={{
      headerShown: false,
    }}
  >
    <AccountStack.Screen name="Edit" component={EditAccount} />
  </AccountStack.Navigator>
);

const FavouritesStack = createNativeStackNavigator();

const Favourites = () => (
  <FavouritesStack.Navigator
    initialRouteName="FavouritesPage"
    screenOptions={{
      headerShown: false,
    }}
  >
    <FavouritesStack.Screen name="FavouritesPage" component={FavouritesPage} />
  </FavouritesStack.Navigator>
);
const MyListingsStack = createNativeStackNavigator();

const MyListings = () => (
  <MyListingsStack.Navigator
    initialRouteName="MyListingsPage"
    screenOptions={{
      headerShown: false,
    }}
  >
    <MyListingsStack.Screen name="PostListing" component={PostListing} />
    <MyListingsStack.Screen name="MyListingsPage" component={MyListingsPage} />
  </MyListingsStack.Navigator>
);

const MyBidsStack = createNativeStackNavigator();
const MyBids = () => (
  <MyBidsStack.Navigator
    initialRouteName="MyBidsPage"
    screenOptions={{
      headerShown: false,
    }}
  >
    <MyBidsStack.Screen name="MyBidsPage" component={MyBidsPage} />
    <MyBidsStack.Screen name="WriteReview" component={WriteReview} />
    <MyBidsStack.Screen name="PaymentPage" component={PaymentPage} />
  </MyBidsStack.Navigator>
);

const Drawer = createDrawerNavigator();
const NavigationContents = ({isAuthenticated}) => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      defaultStatus="closed"
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        drawerHideStatusBarOnOpen: false,
        drawerActiveBackgroundColor: useColorModeValue('#8BC53F', '#1f2937'),
        drawerActiveTintColor: useColorModeValue('white', '#f9fafb'),
        drawerInactiveTintColor: useColorModeValue('#333', '#d1d5db'),
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 15,
        },
      }}
      drawerContent={props => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Home"
        options={{
          title: 'Domů',
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
        component={Home}
      />
      {isAuthenticated && (
        <Drawer.Screen
          name="Favourites"
          options={{
            title: 'Oblíbené',
            drawerIcon: ({color}) => (
              <MaterialIcons name="favorite-border" size={22} color={color} />
            ),
          }}
          component={Favourites}
        ></Drawer.Screen>
      )}
      {isAuthenticated && (
        <Drawer.Screen
          name="MyListings"
          options={{
            title: 'Moje aukce',
            drawerIcon: ({color}) => (
              <MaterialIcons name="gavel" size={22} color={color} />
            ),
          }}
          component={MyListings}
        ></Drawer.Screen>
      )}
      {isAuthenticated && (
        <Drawer.Screen
          name="MyBids"
          options={{
            title: 'Přihazuji',
            drawerIcon: ({color}) => (
              <MaterialIcons name="attach-money" size={22} color={color} />
            ),
          }}
          component={MyBids}
        ></Drawer.Screen>
      )}

      <Drawer.Screen
        name="Auth"
        options={{
          drawerItemStyle: {height: 0},
        }}
        component={Auth}
      ></Drawer.Screen>
      {isAuthenticated && (
        <Drawer.Screen
          name="Account"
          options={{
            drawerItemStyle: {height: 0},
          }}
          component={Account}
        ></Drawer.Screen>
      )}
    </Drawer.Navigator>
  );
};

const Navigation = ({auth}) => {
  const [authed, setAuthed] = React.useState(true);
  React.useEffect(() => {
    if (auth.isAuthenticated !== null) {
      setAuthed(auth.isAuthenticated);
    }
  }, [auth]);
  return (
    <NavigationContainer
      documentTitle={{
        formatter: (options, route) => `zaNákupku.cz`,
      }}
      linking={linking}
    >
      <NavigationContents isAuthenticated={authed} token={auth.token} />
    </NavigationContainer>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Navigation);
