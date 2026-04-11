import * as SecureStore from 'expo-secure-store';
import { useAppDispatch } from '../src/core/hooks/useRedux';
import { setCredentials, logoutUser } from '../src/features/auth/store/authSlice';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import Toast from 'react-native-toast-message';
import { Colors } from '../src/core/constants/Theme';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index', 
};

// Prevent the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Manrope-ExtraBold': require('../assets/fonts/Manrope-ExtraBold.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {

    if (error) {
      throw error;
    }
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);
  
  // Define active theme from Design Palette
  const theme = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    async function initializeApp() {
      try {
        // Session Rehydration: Sync device storage to Redux state
        const token = await SecureStore.getItemAsync('accessToken');
        const savedUser = await SecureStore.getItemAsync('user');

        if (token && savedUser) {
          dispatch(setCredentials(JSON.parse(savedUser)));
        } else {
          dispatch(logoutUser());
        }
      } catch (e) {
        console.warn("Session rehydration failed", e);
      } finally {
        // Only hide splash screen once Auth and Fonts are ready
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    initializeApp();
  }, [dispatch]);

  if (!isReady) {
    return null; 
  }

  // Executive Navigation Theme
  const BurdaaTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.primary,      // Sets the color for active tabs and back buttons
      background: theme.background, // Sets the #f8f9fc base
      card: theme.background,       // Matches header background to surface base
      text: theme.text,             // Sets header title color
      border: 'transparent',        // Enforces the "No Line" Rule
    },
  };

  return (
    <ThemeProvider value={BurdaaTheme}>
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
    <Toast />
  </ThemeProvider>
  );
}