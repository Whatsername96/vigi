import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ToastAndroid, Dimensions, ScrollView } from 'react-native';
import { TextInputMask } from 'react-native-masked-text'
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import * as Location from 'expo-location';
import * as Permission from 'expo-permissions';

import config from '../../config/index.json';
import ModalApp from '../components/ModalApp';

export default function Denunciar() {

    const [modal, setModal] = useState(false);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [date, setDate] = useState(getDate());
    const [time, setTime] = useState(getTime());
    const [selectedValue, setSelectedValue] = useState('Selecione o tipo de crime');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigation = useNavigation();

    console.log(navigation.dangerouslyGetState()); //Vem o endereco e coordenadas

    async function getLocationAsync() {
        let status = Permission.askAsync(Permission.LOCATION);
        if ((await status).status !== 'granted') {
            setErrorMessage('Permissão negada, não é possível mostrar a localização');
            return ToastAndroid.show(errorMessage, ToastAndroid.SHORT);

        } else {
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
            const { latitude, longitude } = location.coords
            setLongitude(longitude);
            setLatitude(latitude);
        }
    }

    function getDate() {
        var today = new Date();
        if(today.getMonth().toString().length == 1) {
            return (today.getDate() + "/" + 0 + ((today.getMonth() + 1 ).toString())  + "/" + today.getFullYear());
        } else { 
            return (today.getDate() + "/" + ((today.getMonth() + 1 ).toString())  + "/" + today.getFullYear());
        }
    }

    function getTime() {
        var now = new Date();
        let hour;
        let minutes;
        
        if(now.getHours().toString().length === 1) {
            hour = (0 + (now.getHours().toString()) + ":");
        } else {
            hour = ((now.getHours().toString()) + ":");
        }
        if (now.getMinutes().toString().length === 1) {
            minutes = (0 + now.getMinutes().toString());
        } else {
            minutes = (now.getMinutes().toString());
        }
        return ( hour + minutes );
    }

    return (
        <ScrollView>
        <View style={styles.container}>

            <View style={styles.viewTitle}>
                <Text style={styles.textTitle}>Faça sua denúncia</Text>
            </View>

            <GooglePlacesAutocomplete
                placeholder='Digite o local'
                textInputProps={{
                    placeholderTextColor: '#B4B3B3',
                    autoCapitalize: 'none',
                    autoCorrect: false,
                }}
                styles={{
                    container: {
                        position: 'absolute',
                        width: '100%',
                        top: 150,
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
                    console.log(details)

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
                onFail={error => console.error(error)}
            />

            <View style={styles.viewLocationUser}>
                <RectButton onPress={() => getLocationAsync()}>
                    <Image source={
                        require('../images/input/local-usuario.png')
                    } />
                </RectButton>
            </View>

            <View style={styles.viewDateTime}>
                <Text style={styles.textDateTime}>Data:</Text>
                <TextInputMask
                    placeholder={'__/__/___'}
                    type={'datetime'}
                    options={{
                        format: 'DD/MM/YYYY'
                    }}
                    style={styles.inputDate}
                    keyboardType={'number-pad'}
                    maxLength={10}
                    value={date}
                    onChangeText={text => { setDate(text) }}
                />
                <Text style={styles.textDateTime}>Hora:</Text>
                <TextInputMask
                    placeholder={'--:--'}
                    type={'datetime'}
                    options={{
                        format: 'HH:MM'
                    }}
                    style={styles.inputTime}
                    keyboardType={'number-pad'}
                    maxLength={6}
                    value={time}
                    onChangeText={text => { setTime(text) }}
                />
            </View>

            <View style={styles.viewPicker}>
                <DropDownPicker
                    placeholder={'Selecione um tipo de delito...'}
                    placeholderStyle={styles.pickerPlaceholder}
                    items={[
                        { label: 'Assalto', value: 'assalto', icon: () => <Image source={require('../images/icons-picker/assalto.png')} /> },
                        { label: 'Ato Obsceno', value: 'ato-obsceno', icon: () => <Image source={require('../images/icons-picker/ato-obsceno.png')} /> },
                        { label: 'Disparos', value: 'disparos', icon: () => <Image source={require('../images/icons-picker/disparos.png')} /> },
                        { label: 'Furto', value: 'furto', icon: () => <Image source={require('../images/icons-picker/furto.png')} /> },
                        { label: 'Homicídio', value: 'homicidio', icon: () => <Image source={require('../images/icons-picker/homicidio.png')} /> },
                        { label: 'Lesão Corporal', value: 'lesao-corporal', icon: () => <Image source={require('../images/icons-picker/lesao-corporal.png')} /> },
                        { label: 'Maus Tratos', value: 'maus-tratos', icon: () => <Image source={require('../images/icons-picker/maus-tratos.png')} /> },
                        { label: 'Roubo', value: 'roubo', icon: () => <Image source={require('../images/icons-picker/roubo.png')} /> },
                        { label: 'Sequestro', value: 'sequestro', icon: () => <Image source={require('../images/icons-picker/sequestro.png')} /> },
                        { label: 'Tráfico', value: 'trafico', icon: () => <Image source={require('../images/icons-picker/trafico.png')} /> },
                        { label: 'Usuários de Drogas', value: 'usuarios-drogas', icon: () => <Image source={require('../images/icons-picker/usuarios-drogas.png')} /> },
                        { label: 'Vandalismo', value: 'vandalismo', icon: () => <Image source={require('../images/icons-picker/vandalismo.png')} /> },
                        { label: 'Violação de Domicílio', value: 'violacao-domicilio', icon: () => <Image source={require('../images/icons-picker/violacao-domicilio.png')} /> },
                        { label: 'Outros', value: 'outros', icon: () => <Image source={require('../images/icons-picker/outros.png')} /> },
                    ]}
                    defaultValue={''}
                    containerStyle={styles.containerPicker}
                    style={styles.dropdownPicker}
                    itemStyle={styles.itemsPicker}
                    labelStyle={styles.labelPicker}
                    dropDownStyle={{ backgroundColor: '#FFF' }}
                    onChangeItem={item => setSelectedValue(item)}
                />
            </View>
            <View style={styles.containerButtons}>
                <RectButton style={styles.btnDenounce} onPress={() => { setModal(true) }} >
                    <Text style={styles.btnText}>Salvar</Text>
                </RectButton>
            </View>
            <ModalApp
                show={modal}
                close={() => setModal(false)}
                title={undefined}
                description={'Denúncia feita com sucesso.'}
                imgSuccess={true}
                imgError={false}
                btnBack={false}
                route={''}
            />
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EFEEEE',
        width: Dimensions.get('window').width,
        height: '100%',
    },

    viewTitle: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 130,
    },

    textTitle: {
        color: '#000',
        fontFamily: 'Abel_400Regular',
        fontSize: 24,
    },

    viewLocationUser: {
        position: 'absolute',
        top: 140,
        marginTop: 25,
        marginRight: 35,
        right: 0,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        zIndex: 1,
        backgroundColor: '#FFF',
    },

    viewDateTime: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        paddingHorizontal: 20,
        width: '100%',
        justifyContent: 'space-between',
    },

    textDateTime: {
        color: '#000',
        fontFamily: 'Abel_400Regular',
        fontSize: 20,
        paddingRight: 0,
    },

    inputDate: {
        height: 60,
        textAlign: 'center',
        backgroundColor: '#FFF',
        marginLeft: 10,
        width: '35%',
        paddingVertical: 10,
        marginRight: 20,
        borderRadius: 6,
        elevation: 5,
        fontFamily: 'Abel_400Regular',
    },

    inputTime: {
        height: 60,
        textAlign: 'center',
        backgroundColor: '#FFF',
        marginLeft: 10,
        width: '25%',
        paddingVertical: 10,
        borderRadius: 6,
        elevation: 5,
        fontFamily: 'Abel_400Regular',
    },

    viewPicker: {
        paddingHorizontal: 20,
        marginTop: 40,
    },

    containerPicker: {
        height: 60,
    },

    dropdownPicker: {
        backgroundColor: '#FFF',
        borderRadius: 6,
        elevation: 5,
        height: 70,
        width: '100%',
    },

    pickerPlaceholder: {
        fontFamily: 'Abel_400Regular',
        fontSize: 20,
        color: '#B4B3B3',
    },

    itemsPicker: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D1D1D1',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },

    labelPicker: {
        justifyContent: 'center',
        fontFamily: 'Abel_400Regular',
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 10,
        textAlign: 'left',
    },

    containerButtons: {
        flex: 1,
        width: '100%',
        marginTop: 40,
        paddingRight: 20,
        paddingLeft: 20,
        zIndex: 2,
    },

    btnDenounce: {
        width: '100%',
        height: 60,
        backgroundColor: '#000',
        borderRadius: 6,
        justifyContent: 'center',
        elevation: 5,
    },

    btnText: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Abel_400Regular',
        color: '#FFF',
    },
})