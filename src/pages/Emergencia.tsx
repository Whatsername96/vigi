import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions, ScrollView } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import NumerosServicos from '../components/NumerosServicos';

export default function Emergencia() {
    return (
        <ScrollView>
            <View style={styles.container}>

                <RectButton style={styles.botaoEmergencia} onPress={() => { }}>
                    <View style={styles.viewAgenda}>
                        <Image source={
                            require('../images/emergencia/agenda.png')
                        } />
                        <Text style={styles.TextAgenda}>Abrir Minha Agenda</Text>
                    </View>
                </RectButton>
                
                <NumerosServicos servico={'Polícia Militar'} numero={'190'} />
                <NumerosServicos servico={'Polícia Civil'} numero={'197'} />
                <NumerosServicos servico={'Bombeiros'} numero={'193'} />
                <NumerosServicos servico={'Samu'} numero={'192'} />
                <NumerosServicos servico={'Guarda Municipal'} numero={'153'} />
                <NumerosServicos servico={'Delegacia da Mulher'} numero={'180'} />
                <NumerosServicos servico={'Disque Denúncia'} numero={'118'} />
                <NumerosServicos servico={'Defesa Civil'} numero={'199'} />
            
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#EFEEEE',
    },

    botaoEmergencia: {
        width: '100%',
        height: '10%',
    },

    viewAgenda: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#D1D1D1',
    },

    TextAgenda: {
        fontSize: 24,
        marginLeft: 20,
        fontFamily: 'Abel_400Regular',
        color: '#000',
    },
});
