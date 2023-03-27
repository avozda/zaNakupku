import 'react-native-gesture-handler';
import React, {useCallback, useEffect} from 'react';
import Navigation from './src/components/Navigation/Navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  NativeBaseProvider,
  extendTheme,
  theme as nbTheme,
  useColorModeValue,
  useColorMode,
} from 'native-base';
import 'intl';
import 'intl/locale-data/jsonp/cs-CZ';

import {Provider} from 'react-redux';
import {store} from './store';
import Toaster from './src/components/Toaster';
import {getStringAsync, setStringAsync} from './src/utils/storage';
import {
  Provider as PaperProvider,
  MD3LightTheme as LightTheme,
  MD3DarkTheme as DarkTheme,
} from 'react-native-paper';
import {registerTranslation, enGB} from 'react-native-paper-dates';

registerTranslation('en-GB', enGB);

const theme = extendTheme({
  colors: {
    primary: {
      50: '#f3f9ec',
      100: '#e8f3d9',
      200: '#dceec5',
      300: '#d1e8b2',
      400: '#c5e29f',
      500: '#b9dc8c',
      600: '#aed679',
      700: '#a2d165',
      800: '#97cb52',
      900: '#8bc53f',
    },
  },
});

const colorModeManager = {
  get: async () => {
    try {
      let val = await getStringAsync('color-mode');
      return val === 'dark' ? 'dark' : 'light';
    } catch (err) {
      return 'light';
    }
  },
  set: async value => {
    try {
      let strValue = value ? value.toString() : '';
      await setStringAsync('color-mode', strValue);
    } catch (err) {
      console.log(err);
    }
  },
};

const paperDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#8bc53f',
    primaryContainer: '#4b5563',
    secondaryContainer: '#4b5563',
    onPrimaryContainer: '#8bc53f',
    surfaceVariant: '#4b5563',
  },
};
const paperLightTheme = {
  ...LightTheme,
  colors: {
    ...LightTheme.colors,
    primary: '#8bc53f',
    primaryContainer: '#e8f3d9',
    secondaryContainer: '#e8f3d9',
    onPrimaryContainer: '#8bc53f',
    surfaceVariant: '#f3f9ec',
  },
};

export default function App() {
  const [colorValue, setColorValue] = React.useState('');
  React.useEffect(() => {
    getStringAsync('color-mode').then(color => setColorValue(color));
  }, []);
  return (
    <>
      <Provider store={store}>
        <NativeBaseProvider colorModeManager={colorModeManager} theme={theme}>
          <PaperProvider
            theme={colorValue == 'light' ? paperLightTheme : paperDarkTheme}
          >
            <SafeAreaProvider>
              <Toaster />
              <Navigation />
            </SafeAreaProvider>
          </PaperProvider>
        </NativeBaseProvider>
      </Provider>
    </>
  );
}
