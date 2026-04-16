import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/src/core/constants/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector } from '@/src/core/hooks/useRedux';
import Toast from 'react-native-toast-message';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { selectedOrganization } = useAppSelector((state) => state.organizations);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 0,
          elevation: 0,
        },
        headerTitleStyle: {
          fontFamily: 'Manrope-Bold',
          color: theme.primary,
        }
      }}>

      {/* Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="home"
              color={selectedOrganization ? color : `${theme.subText}40`}
            />
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {

            if (isAuthenticated && !selectedOrganization) {
              e.preventDefault();

              Toast.show({
                type: 'info',
                text1: 'Organizasyon seçiniz.',
                text2: 'Lütfen devam etmek için bir organizasyon seçiniz.',
                position: 'bottom',
                bottomOffset: 100,
              });
            }
          },
        })}
      />

      {/* Organizations Ledger */}
      <Tabs.Screen
        name="organizations"
        options={{
          title: 'Organizations',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="office-building" size={26} color={color} />
          ),
        }}
      />

      {/* Groups Ledger */}
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-group"
              size={26}
              color={selectedOrganization ? color : `${theme.subText}40`}
            />
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {

            if (isAuthenticated && !selectedOrganization) {
              e.preventDefault();

              Toast.show({
                type: 'info',
                text1: 'Organizasyon seçiniz.',
                text2: 'Önce bir organizasyon seçmeniz gerekiyor.',
                position: 'bottom',
                bottomOffset: 100,
              });
            }
          },
        })}
      />
    </Tabs>
  );
}