import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ToastAndroid, Dimensions, ScrollView } from 'react-native';
import { TextInputMask } from 'react-native-masked-text'
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import { Picker } from '@react-native-community/picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/Feather';

import * as Location from 'expo-location';
import * as Permission from 'expo-permissions';

import config from '../../config/index.json';
import ModalApp from '../components/ModalApp';

export default function Denunciar() {

    const [modal, setModal] = useState(false);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
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

    return (
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
                        top: 80,
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

            <DropDownPicker
                items={[
                    { label: 'USA', value: 'usa', icon: () => <Icon name="flag" size={18} color="#900" />, hidden: true },
                    { label: 'UK', value: 'uk', icon: () => <Icon name="flag" size={18} color="#900" /> },
                    { label: 'France', value: 'france', icon: () => <Icon name="flag" size={18} color="#900" /> },
                ]}
                defaultValue={''}
                containerStyle={{ height: 40 }}
                style={{ backgroundColor: '#fafafa' }}
                itemStyle={{
                    justifyContent: 'flex-start'
                }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
                onChangeItem={item => setSelectedValue(item)}
            />

            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EFEEEE',
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
    },

    viewTitle: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 80,
    },

    textTitle: {
        color: '#000',
        fontFamily: 'Abel_400Regular',
        fontSize: 24,
    },

    viewLocationUser: {
        position: 'absolute',
        top: 70,
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
    },

    picker: {
        borderWidth: 1,
        backgroundColor: '#FFF',
        elevation: 5,
        marginTop: 30,
        width: '100%',
    }

})