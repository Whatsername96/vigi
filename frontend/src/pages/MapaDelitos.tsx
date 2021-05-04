import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, ToastAndroid } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import * as Location from 'expo-location';
import * as Permission from 'expo-permissions';

import config from '../../config/index.json';
import markerAssalto from '../images/assalto/assalto.png';
import ModalApp from '../components/ModalApp';

export default function MapaDelitos() {                   
    const [modal, setModal] = useState(false);
    const [latitude, setLatitude] = useState(-30.0339606);
    const [longitude, setLongitude] = useState(-51.228157);
    const [errorMessage, setErrorMessage] = useState('');
    const [endereco, setEndereco] = useState<string>('');
    const [coordsLat, setCoordsLat] = useState(0);
    const [coordsLng, setCoordsLng] = useState(0);
    const navigation = useNavigation();
  
    //Pega url e busca no mapa os locais
    //fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&radius=' + 1000 + '&type=police' + '&key=' + config.googleApi).then((response) =>{    
    //    return response.json();
    //}).then(response => console.log(response));

    async function getLocationAsync() {
        let status = Permission.askAsync(Permission.LOCATION);
        if ((await status).status !== 'granted') {

            return ToastAndroid.show('Permissão negada, não é possível mostrar a localização', ToastAndroid.SHORT);

        } else {
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
            const { latitude, longitude } = location.coords;
            setEndereco(
                ((await Location.reverseGeocodeAsync({ latitude, longitude }))[0]?.street + ', ' ?? '') +
                ((await Location.reverseGeocodeAsync({ latitude, longitude }))[0]?.name + ' - ' ?? '') +
                ((await Location.reverseGeocodeAsync({ latitude, longitude }))[0]?.district + ', ' ?? '') +
                ((await Location.reverseGeocodeAsync({ latitude, longitude }))[0]?.subregion + ' - ' ?? '') +
                ((await Location.reverseGeocodeAsync({ latitude, longitude }))[0]?.region + ', ' ?? '') +
                ((await Location.reverseGeocodeAsync({ latitude, longitude }))[0]?.country ?? '')
                );
            setCoordsLat(latitude);
            setCoordsLng(longitude);
            setLatitude(latitude);
            setLongitude(longitude);
        }
    }

    function consultarLocalizacao(coordsLat: number, coordsLng: number) {
        if (coordsLat !== 0 && coordsLng !== 0) {
            setLatitude(coordsLat);
            setLongitude(coordsLng);
        }
    }

        function handleNavigateToDenunciar(coordsLat: number, coordsLng: number, endereco: string) {
            if (coordsLat == 0 || coordsLng == 0 || endereco?.trim() == '') {
                return ToastAndroid.show('Digite o local da denúncia na caixa de texto', ToastAndroid.SHORT);
            } else {
                navigation.navigate('Denunciar', {
                        screen: 'Denunciar',
                        end: endereco,
                        lat: coordsLat,
                        lng: coordsLng,
                })
            }
        }

    return (
        <View style={styles.container}>

            <MapView
                showsUserLocation={true}
                followsUserLocation={true}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.002,
                    longitudeDelta: 0.002,
                }}
            >
                <Marker
                    icon={markerAssalto}
                    coordinate={{
                        latitude: latitude,
                        longitude: longitude,
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

            <GooglePlacesAutocomplete
                placeholder='Digite o local'
                textInputProps={{
                    placeholderTextColor: '#B4B3B3',
                    autoCapitalize: 'none',
                    autoCorrect: false,
                    clearTextOnFocus: true,
                    onChangeText: (text) => { setEndereco(text)},
                    value: endereco,
                }}
                styles={{
                    container: {
                        position: 'absolute',
                        width: '100%',
                        top: 10,
                    },
                    textInputContainer: {
                        flex: 1,
                        backgroundColor: 'transparent',
                        marginHorizontal: 20,
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                    },
                    textInput: {
                        height: 60,
                        textAlign: 'left',
                        fontSize: 18,
                        fontFamily: 'Abel_400Regular',
                        color: '#000',
                        margin: 0,
                        borderRadius: 6,
                        paddingTop: 0,
                        paddingBottom: 0,
                        paddingLeft: 20,
                        paddingRight: 52,
                        padding: 0,
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowOffset: { x: 0, y: 0 },
                        shadowRadius: 15,
                    },

                    listView: {
                        borderWidth: 1,
                        borderRadius: 6,
                        borderColor: '#B4B3B3',
                        backgroundColor: '#FFF',
                        marginHorizontal: 20,
                        marginVertical: 0,
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowOffset: { x: 0, y: 0 },
                        shadowRadius: 15,
                        zIndex: 1,
                    },

                    description: {
                        fontSize: 16,
                    },

                    row: {
                        height: 58,
                        padding: 20,
                        alignItems: 'center',
                        borderWidth: 0.5,
                        borderColor: '#B4B3B3'
                    }
                }}
              
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    setEndereco(data.description);
                    setCoordsLat(details?.geometry.location.lat ?? 0);
                    setCoordsLng(details?.geometry.location.lng ?? 0);
                    
                }}
                query={{
                    key: config.googleApi,
                    language: 'pt-BR',
                    components: 'country:br',
                }}
                nearbyPlacesAPI='GooglePlacesSearch'
                fetchDetails
                isRowScrollable
                enableHighAccuracyLocation
                enablePoweredByContainer={false}
                GooglePlacesSearchQuery={{
                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                    rankby: 'distance',
                    types: 'police'
                  }}
                onFail={error => console.error(error)}
            />
            <View style={styles.viewLocationUser}>
                <RectButton onPress={() => getLocationAsync()}>
                    <Image source={
                        require('../images/input/local-usuario.png')
                    } />
                </RectButton>
            </View>

            <View style={styles.containerButtons}>
                <RectButton style={styles.btnSearch} onPress={() => { consultarLocalizacao(coordsLat, coordsLng) }}>
                    <Text style={styles.btnText}>Consultar</Text>
                </RectButton>

                <RectButton style={styles.btnDenounce} onPress={() => { handleNavigateToDenunciar(coordsLat, coordsLng, endereco) }} >
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
            <ModalApp 
                show={modal}
                close={() => setModal(false)}
                title={'Informações'}
                description={'Cada denúncia ficará disponível por 15 dias.'}
                imgSuccess={false}
                imgError={false}
                btnBack={false}
                route={'MapaDelitos'}
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

    viewLocationUser: {
        position: 'absolute',
        top: 0,
        marginTop: 25,
        marginRight: 35,
        right: 0,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        zIndex: 1,
        backgroundColor: '#FFF',
    },

    containerButtons: {
        position: 'absolute',
        flex: 1,
        top: 70,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingRight: 20,
        paddingLeft: 20,
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
        left: 10
    },

});