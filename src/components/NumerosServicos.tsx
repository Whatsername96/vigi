import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions, Linking } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

interface NumerosServicosProps {
    servico: string,
    numero: string,
}

export default function NumerosServicos({servico, numero} : NumerosServicosProps) {
    return (
        <View style={styles.container}>
            <RectButton style={styles.btnEmergency} onPress={() => { Linking.openURL('tel://'+numero) }}>
                <View style={styles.viewServices}>
                    <Text style={styles.TextServices}>{servico}</Text>
                    <Text style={styles.TextServicesContacts}>{numero}</Text>
                    <Image source={
                        require('../images/emergencia/ligar.png')
                    } />
                </View>
            </RectButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#FFF',
        flex: 1,
        flexDirection: 'column',
    },

    btnEmergency:{
        width: '100%',
        height: '100%',
    },

    viewServices: {
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#D1D1D1',
        paddingHorizontal: 20,
    },
    
    TextServices: {
        fontSize: 24,
        fontFamily: 'Abel_400Regular',
        color: '#000',
        width: '60%',
    },

    TextServicesContacts: {
        fontSize: 24,
        fontFamily: 'Abel_400Regular',
        color: '#FF0000',
    },
});
