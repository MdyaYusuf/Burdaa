import { Stack } from 'expo-router';

export default function RollcallLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="live" />
      <Stack.Screen name="summary" />
    </Stack>
  );
}