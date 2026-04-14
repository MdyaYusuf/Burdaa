import { Stack } from 'expo-router';
import { Colors } from '../../src/core/constants/Theme';

export default function AuthLayout() {
  const theme = Colors.light;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitle: "",
        headerShadowVisible: false,
        headerTransparent: true,
        headerTintColor: theme.primary,
        headerBackTitle: "",
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}