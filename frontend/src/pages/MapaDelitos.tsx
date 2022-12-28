import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    ToastAndroid,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { RectButton } from 'react-native-gesture-handler';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { GOOGLE_API } from '@env';

import * as Location from 'expo-location';

const markerImages = [
    require('../images/assalto/assalto.png'),
    require('../images/ato-obsceno/ato-obsceno.png'),
    require('../images/disparos/disparos.png'),
    require('../images/furto/furto.png'),
    require('../images/homicidio/homicidio.png'),
    require('../images/invasao-domicilio/invasao-domicilio.png'),
    require('../images/lesao-corporal/lesao-corporal.png'),
    require('../images/maus-tratos-animais/maus-tratos-animais.png'),
    require('../images/outros/outros.png'),
    require('../images/roubo/roubo.png'),
    require('../images/sequestro/sequestro.png'),
    require('../images/trafico/trafico.png'),
    require('../images/usuarios-drogas/usuarios-drogas.png'),
    require('../images/vandalismo/vandalismo.png'),
];

import ModalApp from '../components/ModalApp';
import api from '../services/api';

interface Delito {
    id: number;
    tipo_delito: string;
    latitude: number;
    longitude: number;
    data: string;
    hora: string;
    descricao: string;
    index: number;
}

export default function MapaDelitos() {
    const [modal, setModal] = useState(false);
    const [latitude, setLatitude] = useState(-30.0339606);
    const [longitude, setLongitude] = useState(-51.228157);
    const [endereco, setEndereco] = useState<string>('');
    const [coordsLat, setCoordsLat] = useState(0);
    const [coordsLng, setCoordsLng] = useState(0);
    const [delitos, setDelitos] = useState<Delito[]>([]);
    const navigation = useNavigation<NavigationProp<any>>();
    const [status, setStatus] = useState(false);

    useEffect(() => {
        // async function carregarLista() {
        //     await api.delete('delitos');
        //     await api.get('delitos').then(response => {
        //         setDelitos(response.data);
        //     });
        // }
        navigation.addListener('focus', () => {
            // carregarLista();
            getLocationAsync();
        });
    }, []);

    async function getLocationAsync() {
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
            setStatus(false);
            requestLocationAsync();
        } else {
            console.log('aaa')
            setStatus(true);
            getCurrentPostition();
        }
    }

    async function requestLocationAsync() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setStatus(false);
            return ToastAndroid.show('Permissão negada, não é possível mostrar a sua localização', ToastAndroid.SHORT);
        } else {
            setStatus(true);
            getCurrentPostition();
        }
    }

    async function checkStatusGetCurrentPosition() {
        if(status) {
            getCurrentPostition();
        } else {
            return ToastAndroid.show('Permissão negada, não é possível mostrar a sua localização', ToastAndroid.SHORT);
        }
    }

    async function getCurrentPostition() {
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
        const { latitude, longitude } = location.coords;

        let street = ((await Location.reverseGeocodeAsync({ latitude, longitude }))[0]?.street ?? '');
        let name = ((await Location.reverseGeocodeAsync({ latitude, longitude }))[0]?.name ?? '');
        let district = ((await Location.reverseGeocodeAsync({ latitude, longitude }))[0]?.district ?? '');
        let subregion = ((await Location.reverseGeocodeAsync({ latitude, longitude }))[0]?.subregion ?? '');
        let region = ((await Location.reverseGeocodeAsync({ latitude, longitude }))[0]?.region ?? '');
        let country = ((await Location.reverseGeocodeAsync({ latitude, longitude }))[0]?.country ?? '');

        setEndereco(
            (street.length ? street + ', ' : '') +
            (name.length ? name + ' - ' : '') +
            (district.length ? district + ', ' : '') +
            (subregion.length ? subregion + ', ' : '') +
            (region.length ? region + ' - ' : '') +
            (country.length ? country : '')
        );
        setCoordsLat(latitude);
        setCoordsLng(longitude);
        setLatitude(latitude);
        setLongitude(longitude);
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

                    {delitos.map(delito => {
                        return (
                            <Marker
                                key={delito.id}
                                icon={markerImages[delito.index]}
                                coordinate={{
                                    latitude: delito.latitude,
                                    longitude: delito.longitude,
                                }}
                            >
                                <Callout tooltip={true}>
                                    <View style={styles.calloutContainer}>
                                        {delito.tipo_delito === 'Outros'
                                            ? <Text style={styles.calloutTitle}>{delito.descricao}</Text>
                                            : <Text style={styles.calloutTitle}>{delito.tipo_delito}</Text>
                                        }
                                        <Text style={styles.calloutText}>{delito.data} - {delito.hora}</Text>
                                    </View>
                                </Callout>
                            </Marker>
                        )
                    })}
                </MapView>

            </TouchableWithoutFeedback>

            <GooglePlacesAutocomplete
                placeholder='Digite o local'
                textInputProps={{
                    placeholderTextColor: '#B4B3B3',
                    autoCapitalize: 'none',
                    autoCorrect: false,
                    clearTextOnFocus: true,
                    onChangeText: (text) => { setEndereco(text) },
                    value: endereco,
                }}
                styles={{
                    container: {
                        position: 'absolute',
                        width: '100%',
                        top: 0,
                        marginTop: 10
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
                    key: GOOGLE_API,
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
                <RectButton onPress={() => checkStatusGetCurrentPosition()}>
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

            <RectButton style={styles.containerInfo} onPress={() => setModal(true)}>
                <Image
                    style={{ width: 40, height: 40 }}
                    source={require('../images/header/info.png')}
                />
            </RectButton>

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
        bottom: 15,
        left: 15,
        zIndex: 2,
        width: 40,
        height: 40,
    },
});