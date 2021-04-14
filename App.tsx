import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar, Image, Modal, Pressable } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import markerAssalto from './src/images/assalto/assalto.png';
import Header from './src/components/Header';
import ModalApp from './src/components/ModalApp'
import { useFonts, Abel_400Regular } from '@expo-google-fonts/abel';

export default function App() {

  const [modal, setModal] = useState(false);

  const [fontsLoaded] = useFonts({
    Abel_400Regular,
  });

  if (!fontsLoaded) {
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

      <Header
        title={'Vigi'}
      />

      <View style={styles.inputLocationView}>
        <GooglePlacesAutocomplete
          placeholder='Digite o local'

          textInputProps={{
            placeholderTextColor: '#B4B3B3',
          }}

          styles={{
            textInput: {
              textAlign: 'left',
              fontSize: 20,
              fontFamily: 'Abel_400Regular',
              color: '#000',
            }
          }}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
          }}
          query={{
            key: 'YOUR API KEY',
            language: 'pt',
          }}
          fetchDetails
          enablePoweredByContainer={false}
        />

        <TouchableOpacity onPress={() => alert('funcionando')}>
          <Image source={
            require('./src/images/input/local-usuario.png')
          } />
        </TouchableOpacity>
      </View>

      <View style={styles.containerButtons}>
        <TouchableOpacity style={styles.btnSearch} onPress={() => alert('funcionando')}>
          <Text style={styles.btnText}>Consultar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnDenounce} onPress={() => alert('funcionando')}>
          <Text style={styles.btnText}>Denunciar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerInfo}>
        <TouchableOpacity onPress={() => setModal(true)}>
          <Image source={
            require('./src/images/header/info.png')
          } />
        </TouchableOpacity>
      </View>
        <ModalApp show={modal} close={() => setModal(false)}/>
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

  inputLocationView: {
    position: 'absolute',
    flex: 1,
    width: '90%',
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 6,
    elevation: 5,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    top: 70,
    margin: 10,
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },

  containerButtons: {
    position: 'absolute',
    flex: 1,
    top: 140,
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  btnSearch: {
    width: '40%',
    height: 44,
    backgroundColor: '#394867',
    borderRadius: 6,
    justifyContent: 'center',
    elevation: 5,
  },

  btnDenounce: {
    width: '40%',
    height: 44,
    backgroundColor: '#000',
    borderRadius: 6,
    justifyContent: 'center',
    elevation: 5,
  },

  btnText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Abel_400Regular',
    color: '#FFF',
  },

  map: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    position: 'relative',
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
  },

  containerInfo: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },

});
