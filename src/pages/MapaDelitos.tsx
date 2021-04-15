import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, StatusBar, Image } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import * as Location from 'expo-location';
import * as Permission from 'expo-permissions';

import markerAssalto from '../images/assalto/assalto.png';
import ModalApp from '../components/ModalApp'
import { RectButton } from 'react-native-gesture-handler';

export default function MapaDelitos() {
    const [modal, setModal] = useState(false);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');


    async function getLocationAsync(){
    let  status  = Location.getPermissionsAsync();
    if (((await status).ios?.scope !== 'whenInUse' && (await status).ios?.scope !=='always') || 
    ((await status).android?.scope !== 'fine' && (await status).android?.scope !=='coarse')){
        setErrorMessage('Permissão negada');
    }
    
    let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});
    const { latitude , longitude } = location.coords;
    setLatitude(latitude);
    setLongitude(longitude);
  };

  getLocationAsync()
console.log(longitude);
console.log(latitude);
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

            <RectButton onPress={() => alert('funcionando')}>
                <Image source={
                    require('../images/input/local-usuario.png')
                } />
            </RectButton>
        </View>

        <View style={styles.containerButtons}>
            <RectButton style={styles.btnSearch} onPress={() => alert('funcionando')}>
                <Text style={styles.btnText}>Consultar</Text>
            </RectButton>

            <RectButton style={styles.btnDenounce} onPress={() => alert('funcionando')}>
                <Text style={styles.btnText}>Denunciar</Text>
            </RectButton>
        </View>

        <View style={styles.containerInfo}>
            <RectButton onPress={() => setModal(true)}>
                <Image source={
                    require('../images/header/info.png')
                } />
            </RectButton>
        </View>
        <ModalApp show={modal}
            close={() => setModal(false)}
            title={'Informações'}
            description={'Cada denúncia ficará disponível por 15 dias.'}
            imgSuccess={false}
            imgError={false}
            btnBack={false}
            route={''}
        />
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
        top: 0,
        margin: 10,
        flexDirection: 'row',
        paddingVertical: 10,
        justifyContent: 'space-between',
    },

    containerButtons: {
        position: 'absolute',
        flex: 1,
        top: 70,
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
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
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