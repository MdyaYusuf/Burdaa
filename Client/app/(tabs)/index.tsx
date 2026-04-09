import React from 'react';
import { View, Text } from 'react-native';

export default function Dashboard() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fc' }}>
      <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 24, color: '#04172c' }}>Dashboard</Text>
      <Text style={{ fontFamily: 'Inter-Regular', color: '#44474d' }}>You are logged in.</Text>
    </View>
  );
}