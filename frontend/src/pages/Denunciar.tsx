import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    ScrollView,
    TextInput,
    ToastAndroid,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text'
import { useRoute, RouteProp } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';

import ModalApp from '../components/ModalApp';
import api from '../services/api';

import { db } from '../services/firebaseConnection';

import {
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    doc,
    deleteDoc
} from 'firebase/firestore';


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
    const [disable, setDisable] = useState(false);
    const [date, setDate] = useState(getDate());
    const [time, setTime] = useState(getTime());
    const { end, lat, lng } = route.params;
    const [selectedValue, setSelectedValue] = useState('Selecione o tipo de crime');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [inputVisible, setInputVisible] = useState(false);
    const [valueOutros, setValueOutros] = useState('');
    const [status, setStatus] = useState('');

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
        let now = new Date();
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

    function validarData(data: string) {
        let partesData = data.split('/');
        let erro = false;
        let dia = new Date();
        if (partesData.length < 3) {
            erro = true;
        }
        if (parseInt(partesData[0]) <= 0 || parseInt(partesData[0]) > 31) {
            erro = true;
        }
        if (parseInt(partesData[1]) - 1 <= 0 || parseInt(partesData[1]) > 12) {
            erro = true;
        }
        if (parseInt(partesData[2]) <= 0 || parseInt(partesData[2]) > dia.getFullYear()) {
            erro = true;
        }
        if (parseInt(partesData[1]) - 1 == 2) {
            if (parseInt(partesData[0]) > 29) {
                erro = true;
            } else {
                if (dia.getFullYear() % 4 != 0 && dia.getFullYear() % 100 != 0) {
                    if (parseInt(partesData[0]) == 29) {
                        erro = true;
                    }
                }
            }
        }

        if (parseInt(partesData[0]) > dia.getDate() && (parseInt(partesData[1])) > dia.getMonth() && parseInt(partesData[2]) > dia.getFullYear()) {
            erro = true;
        }

        if (parseInt(partesData[1]) != 1 &&
            parseInt(partesData[1]) != 3 &&
            parseInt(partesData[1]) != 5 &&
            parseInt(partesData[1]) != 7 &&
            parseInt(partesData[1]) != 8 &&
            parseInt(partesData[1]) != 10 &&
            parseInt(partesData[1]) != 12) {
            if (parseInt(partesData[0]) == 31) {
                erro = true;
            }
        }
        let hoje = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate());
        let dataDelito = new Date(parseInt(partesData[2]), parseInt(partesData[1]) - 1, parseInt(partesData[0]));
        let milissegundos_por_dia = 1000 * 60 * 60 * 24;
        let expirado = new Date((hoje.getTime() - 15 * milissegundos_por_dia));
        if (dataDelito <= expirado) {
            erro = true;
        }

        if (erro) {
            ToastAndroid.show('Data inválida', ToastAndroid.SHORT);
            return erro;
        }
    }

    function validarHora(data: string, hora: string) {
        let partesData = data.split('/');
        let partesHora = hora.split(':');
        let now = new Date();
        let erro = false;

        if (partesHora.length == 0) {
            erro = true;
        }

        if (parseInt(partesHora[0]) < 0 || parseInt(partesHora[0]) > 23) {
            erro = true;
        }

        if (parseInt(partesHora[1]) < 0 || parseInt(partesHora[1]) > 59) {
            erro = true;
        }

        if (parseInt(partesData[2]) == now.getUTCFullYear() &&
            parseInt(partesData[1]) - 1 == now.getMonth() &&
            parseInt(partesData[0]) == now.getDate()) {
            if (parseInt(partesHora[0]) >= now.getHours() &&
                parseInt(partesHora[1]) > now.getMinutes()) {
                erro = true;
            }
        }

        if (erro) {
            ToastAndroid.show('Hora inválida', ToastAndroid.SHORT);
            return erro;
        }

    }

    function hideShowInputOutros(value: string) {
        if (value === 'Outros') {
            setInputVisible(true);
        } else {
            setInputVisible(false);
            setValueOutros('');
        }
    }

    async function cadastrarDelito() {

        let validadorData = validarData(date);
        let validadorHora = validarHora(date, time);

        if (validadorHora || validadorData) {
            setDisable(false);
            return ToastAndroid.show('Há dados inválidos no formulário, verifique', ToastAndroid.SHORT);

        } else {
            // const data = new FormData();

            if (selectedValue == 'Selecione o tipo de crime' || date == '' || time == '') {
                setDisable(false);
                return ToastAndroid.show('Preencha todos os campos para salvar', ToastAndroid.SHORT);

            } else {
                try {
                    await addDoc(collection(db, "crimes"), {
                        crime_type: selectedValue,
                        date: date,
                        hour: time,
                        lat: lat,
                        lng: lng,
                        index: selectedIndex,
                        created_at: new Date()
                    });
                    setModal(true);
                } catch (e) {
                    console.log(e);
                    return ToastAndroid.show('Ocorreu um erro ao cadastrar o delito.', ToastAndroid.SHORT);
                }
                // data.append('tipo_delito', selectedValue);
                // data.append('data', date);
                // data.append('hora', time);
                // data.append('latitude', String(lat));
                // data.append('longitude', String(lng));
                // data.append('descricao', valueOutros);
                // data.append('index', String(selectedIndex));
                // data.append('created_at', new Date());



                // await api.post('delitos', data).then((response) => {
                //     setStatus(response.status.toString()); // Retorna o status 201 se deu certo
                // });
            }
        }
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={'height'}
                >
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
                                onChangeText={(text) => { setDate(text); setDisable(false) }}
                                onBlur={() => validarData(date)}
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
                                onChangeText={(text) => { setTime(text); setDisable(false) }}
                                onBlur={() => validarHora(date, time)}
                            />

                        </View>

                        <View style={styles.viewPicker}>

                            <DropDownPicker
                                placeholder={'Selecione um tipo de delito...'}
                                placeholderStyle={styles.pickerPlaceholder}
                                items={[
                                    { label: 'Assalto', value: 0, icon: () => <Image source={require('../images/icons-picker/assalto.png')} /> },
                                    { label: 'Ato Obsceno', value: 1, icon: () => <Image source={require('../images/icons-picker/ato-obsceno.png')} /> },
                                    { label: 'Disparos', value: 2, icon: () => <Image source={require('../images/icons-picker/disparos.png')} /> },
                                    { label: 'Furto', value: 3, icon: () => <Image source={require('../images/icons-picker/furto.png')} /> },
                                    { label: 'Homicídio', value: 4, icon: () => <Image source={require('../images/icons-picker/homicidio.png')} /> },
                                    { label: 'Invasão de Domicílio', value: 5, icon: () => <Image source={require('../images/icons-picker/violacao-domicilio.png')} /> },
                                    { label: 'Lesão Corporal', value: 6, icon: () => <Image source={require('../images/icons-picker/lesao-corporal.png')} /> },
                                    { label: 'Maus Tratos', value: 7, icon: () => <Image source={require('../images/icons-picker/maus-tratos.png')} /> },
                                    { label: 'Outros', value: 8, icon: () => <Image source={require('../images/icons-picker/outros.png')} /> },
                                    { label: 'Roubo', value: 9, icon: () => <Image source={require('../images/icons-picker/roubo.png')} /> },
                                    { label: 'Sequestro', value: 10, icon: () => <Image source={require('../images/icons-picker/sequestro.png')} /> },
                                    { label: 'Tráfico', value: 11, icon: () => <Image source={require('../images/icons-picker/trafico.png')} /> },
                                    { label: 'Usuários de Drogas', value: 12, icon: () => <Image source={require('../images/icons-picker/usuarios-drogas.png')} /> },
                                    { label: 'Vandalismo', value: 13, icon: () => <Image source={require('../images/icons-picker/vandalismo.png')} /> },
                                ]}
                                defaultValue={''}
                                containerStyle={styles.containerPicker}
                                style={styles.picker}
                                itemStyle={styles.itemsPicker}
                                labelStyle={styles.labelPicker}
                                dropDownStyle={styles.dropDownPicker}
                                onChangeItem={(item, index) => { setSelectedValue(item.label); setSelectedIndex(item.value); setDisable(false); hideShowInputOutros(item.label) }}
                            />

                        </View>
                        {inputVisible && selectedValue === 'Outros' &&

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

                            <RectButton style={disable == false ? styles.btnSaveAble : styles.btnSaveDisable}
                                onPress={() => { disable == false ? cadastrarDelito() : setDisable(true) }}
                            >
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
                    
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EFEEEE',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },

    viewTitle: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
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
        width: '100%',
        marginTop: 40,
        paddingHorizontal: 20,
        marginBottom: 40,
        zIndex: 2,
    },

    btnSaveAble: {
        width: '100%',
        height: 60,
        backgroundColor: '#000',
        borderRadius: 6,
        justifyContent: 'center',
        elevation: 5,
    },

    btnSaveDisable: {
        width: '100%',
        height: 60,
        backgroundColor: '#000',
        opacity: 0.5,
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