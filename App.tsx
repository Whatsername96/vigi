import React from 'react';
import { useFonts, Abel_400Regular } from '@expo-google-fonts/abel';
import Routes from './src/routes'

export default function App() {

  const [fontsLoaded] = useFonts({
    Abel_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Routes />
  );
}
