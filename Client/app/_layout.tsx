import * as SecureStore from 'expo-secure-store';
import { useAppDispatch, useAppSelector } from '../src/core/hooks/useRedux';
import { setCredentials, logout } from '../src/features/auth/store/authSlice';
import { clearOrganization } from '../src/features/organizations/store/organizationSlice';
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
  initialRouteName: '(auth)/index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Manrope-ExtraBold': require('../assets/fonts/Manrope-ExtraBold.ttf'),
    'Manrope-Bold': require('../assets/fonts/Manrope-ExtraBold.ttf'),
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
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { selectedOrganization } = useAppSelector((state) => state.organizations);
  const segments = useSegments() as any;
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const theme = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    async function initializeApp() {
      try {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        const savedUser = await SecureStore.getItemAsync('user');

        if (accessToken && savedUser) {
          dispatch(setCredentials(JSON.parse(savedUser)));
        } else {
          dispatch(logout());
          dispatch(clearOrganization());
        }
      } catch (e) {
        console.warn("Session rehydration failed", e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    initializeApp();
  }, []);

  useEffect(() => {

    if (!isReady) {
      return;
    }

    const segmentPath = segments.join('/');
    const inAuthGroup = segments[0] === '(auth)';
    const inOrgSelection = segmentPath.includes('organizations');
    const isCreatingOrg = segmentPath.includes('create-organization');
    const isCreatingGroup = segmentPath.includes('create-group');
    const atLanding = inAuthGroup && segments.length === 1;

    // Auth Guard
    if (!isAuthenticated) {

      if (!inAuthGroup) {
        router.replace('/(auth)' as any);
      }
      return;
    }

    // Organization Guard
    if (!selectedOrganization && !inOrgSelection && !isCreatingOrg && !isCreatingGroup) {
      router.replace('/organizations' as any);

      return;
    }

    // Success Redirect
    if (selectedOrganization && (inAuthGroup || atLanding)) {
      router.replace('/(tabs)' as any);
    }
  }, [isAuthenticated, selectedOrganization, isReady, segments]);

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
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Organization Creation Modal */}
        <Stack.Screen
          name="create-organization"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom'
          }}
        />

        {/* Group Creation Modal */}
        <Stack.Screen
          name="create-group"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom'
          }}
        />

        {/* Member Creation Modal */}
        <Stack.Screen
          name="create-member"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom'
          }}
        />

        <Stack.Screen name="rollcalls" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </ThemeProvider>
  );
}