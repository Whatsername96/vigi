
import { View, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';

import { useFonts } from 'expo-font';
import { Abel_400Regular } from '@expo-google-fonts/abel';

import { Loading } from './src/components/Loading';
import Routes from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({ Abel_400Regular });
  return (
    <View style={styles.container}>
      {
        fontsLoaded ? <Routes /> : <Loading />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})