import * as SecureStore from 'expo-secure-store';
import { useAppDispatch, useAppSelector } from '../src/core/hooks/useRedux';
import { setCredentials, logoutUser } from '../src/features/auth/store/authSlice';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
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

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Manrope-ExtraBold': require('../assets/fonts/Manrope-ExtraBold.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {

    if (error){
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
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const theme = Colors[colorScheme ?? 'light'];

  // Session Rehydration
  useEffect(() => {
    async function initializeApp() {
      try {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        const savedUser = await SecureStore.getItemAsync('user');

        if (accessToken && savedUser) {
          dispatch(setCredentials(JSON.parse(savedUser)));
        } else {
          // If no token ensure state is cleared
          dispatch(logoutUser());
        }
      } catch (e) {
        console.warn("Session rehydration failed", e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    initializeApp();
  }, [dispatch]);

  // Authentication Guard The Watcher
  useEffect(() => {

    if (!isReady){
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    // Logic: Redirect based on your Redux isAuthenticated state
    if (!isAuthenticated && !inAuthGroup && segments[0] !== undefined) {
      // Not logged in => Go to Landing
      router.replace('/');
    } 
    else if (isAuthenticated && (inAuthGroup || segments[0] === undefined)) {
      // Logged in => Go to Tabs
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isReady, segments]);

  if (!isReady) {
    return null;
  }

  const BurdaaTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.primary,
      background: theme.background,
      card: theme.background,
      text: theme.text,
      border: 'transparent',
    },
  };

  return (
    <ThemeProvider value={BurdaaTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </ThemeProvider>
  );
}