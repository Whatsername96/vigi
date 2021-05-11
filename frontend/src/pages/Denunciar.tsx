import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, ScrollView, TextInput, NativeModules, Platform } from 'react-native';
import { TextInputMask } from 'react-native-masked-text'
import { useRoute, RouteProp } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';

import ModalApp from '../components/ModalApp';

const { StatusBarManager } = NativeModules;
const alturaStatusBar = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

type ParamList = {
    Denunciar: {
        end: string;
        lat: number;
        lng: number;
    };
};

export default function Denunciar() {

    const route = useRoute<RouteProp<ParamList, 'Denunciar'>>();
    const [modal, setModal] = useState(false);
    const [date, setDate] = useState(getDate());
    const [time, setTime] = useState(getTime());
    const { end, lat, lng } = route.params;
    const [selectedValue, setSelectedValue] = useState('Selecione o tipo de crime');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [inputVisible, setInputVisible] = useState(false);
    const [valueOutros, setValueOutros] = useState('');

    function getDate() {
        var today = new Date();
        let dia;
        if (today.getDate().toString().length === 1) {
            dia = ('0' + today.getDate() + "/");
        } else {
            dia = (today.getDate() + "/");
        }

        if (today.getMonth().toString().length === 1) {
            dia += (+ '0' + ((today.getMonth() + 1).toString()) + "/");
        } else {
            dia += (+ ((today.getMonth() + 1).toString()) + "/");
        }

        dia += today.getFullYear();

        return dia;
    }

    function getTime() {
        var now = new Date();
        let hour;
        let minutes;

        if (now.getHours().toString().length === 1) {
            hour = (0 + (now.getHours().toString()) + ":");
        } else {
            hour = ((now.getHours().toString()) + ":");
        }
        if (now.getMinutes().toString().length === 1) {
            minutes = (0 + now.getMinutes().toString());
        } else {
            minutes = (now.getMinutes().toString());
        }
        return (hour + minutes);
    }

    function hideShowInputOutros(item: any) {
        if (item.value === 'outros') {
            setInputVisible(true);
        } else {
            setInputVisible(false);
            setValueOutros('');
        }
    }

    return (
        <ScrollView>

            <View style={styles.container}>

                <View style={styles.viewTitle}>
                    <Text style={styles.textTitle}>Faça sua denúncia</Text>
                </View>

                <View style={styles.viewInfoLocal}>
                    <Text style={styles.textInfoLocal}>Local selecionado do mapa: </Text>
                </View>

                <View style={styles.viewInputLocal}>
                    <TextInput
                        style={styles.textInputLocal}
                        editable={false}
                        value={end}
                        multiline
                    />
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
                        style={styles.picker}
                        itemStyle={styles.itemsPicker}
                        labelStyle={styles.labelPicker}
                        dropDownStyle={styles.dropDownPicker}
                        onChangeItem={(item, index) => { setSelectedValue(item.value); setSelectedIndex(index); hideShowInputOutros(item) }}
                    />

                </View>
                {inputVisible && selectedValue === 'outros' &&

                    <View style={styles.viewOutros}>
                        <TextInput
                            style={styles.textInputOutros}
                            placeholder={'Qual o crime?'}
                            value={valueOutros}
                            onChangeText={text => { setValueOutros(text) }}
                        />
                    </View>

                }

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
                    route={'MapaDelitos'}
                />

            </View>
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EFEEEE',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - alturaStatusBar,
    },

    viewTitle: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 60,
    },

    textTitle: {
        color: '#000',
        fontFamily: 'Abel_400Regular',
        fontSize: 24,
    },

    viewInfoLocal: {
        alignItems: 'flex-start',
        marginBottom: 10,
        paddingHorizontal: 20,
    },

    textInfoLocal: {
        color: '#000',
        fontFamily: 'Abel_400Regular',
        fontSize: 20,
    },

    viewInputLocal: {
        top: 0,
        paddingHorizontal: 20,
        height: 60,
    },

    textInputLocal: {
        backgroundColor: '#FFFFFF',
        height: '100%',
        borderRadius: 6,
        elevation: 5,
        paddingHorizontal: 10,
        fontFamily: 'Abel_400Regular',
        fontSize: 16,
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
        marginTop: 30,
    },

    containerPicker: {
        height: 60,
    },

    picker: {
        backgroundColor: '#FFF',
        borderRadius: 6,
        elevation: 5,
        width: '100%',
    },

    dropDownPicker: {
        backgroundColor: '#FFF',
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

    viewOutros: {
        top: 0,
        paddingHorizontal: 20,
        height: 60,
        marginTop: 30,
        zIndex: 2,
    },

    textInputOutros: {
        backgroundColor: '#FFFFFF',
        height: '100%',
        borderRadius: 6,
        elevation: 5,
        paddingHorizontal: 10,
        fontFamily: 'Abel_400Regular',
        fontSize: 20,
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