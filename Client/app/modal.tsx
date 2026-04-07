import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';

// Import your Executive colors
import { Colors } from '../src/constants/Colors';
import { useColorScheme } from 'react-native';

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.primary, fontFamily: 'Manrope-Bold' }]}>
        Info Modal
      </Text>
      
      <View style={[styles.separator, { backgroundColor: theme.tonalLayerLow }]} />

      <Text style={{ color: theme.subText, textAlign: 'center', paddingHorizontal: 40 }}>
        This is a placeholder for your Burdaa info or settings. 
        It is now clean and boilerplate-free.
      </Text>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
});