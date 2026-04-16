import { Stack, useLocalSearchParams } from 'expo-router';
import { GroupDetailScreen } from '@/src/features/groups/screens/GroupDetailScreen';

export default function GroupDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <GroupDetailScreen groupId={id || ''} />
    </>
  );
}