import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Platform, NativeModules, StatusBar } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import markerAssalto from './src/images/assalto/assalto.png';

import  Header  from './src/components/Header';
import { useFonts, Abel_400Regular } from '@expo-google-fonts/abel';
/*
const { StatusBarManager } = NativeModules;
const alturaStatusBar = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
*/
export default function App() {

const [fontsLoaded] = useFonts({
  Abel_400Regular,
});

if(!fontsLoaded) {
  return null;
}

  return (
    <View style={styles.container}>

      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#394867"
        translucent={false}
      />

      <Header
        title={'Vigi'}
      />

      <TouchableOpacity style={styles.pesquisar} onPress={() => { }}>
        <Text>Pesquisar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.denunciar} onPress={() => { }}>
        <Text>Denunciar</Text>
      </TouchableOpacity>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -30.0332291,
          longitude: -51.2301877,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        }}
      >
        <Marker
          icon={markerAssalto}
          coordinate={{
            latitude: -30.0332291,
            longitude: -51.2301877,
          }}
        >
          <Callout tooltip={true}>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutTitle}>Assalto</Text>
              <Text style={styles.calloutText}>07/04/2021 - 18h</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  localizacao: {

  },

  pesquisar: {
    width: 50,
    height: 20,
    flex: 1,
    backgroundColor: '#394867'
  },

  denunciar: {
    width: 50,
    height: 10,
    flex: 1,
    left: 10,
    right: 10,
  },

  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    bottom: 0,
    position: 'relative'
  },

  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
  },

  calloutTitle: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  calloutText: {
    color: '#000',
    fontSize: 12,
    textAlign: 'center',
  }

});
