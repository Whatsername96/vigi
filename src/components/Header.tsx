import React from 'react';
//import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BorderlessButton } from 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, NativeModules, Platform } from 'react-native';

import Voltar from 'react-native-vector-icons/Feather';

const { StatusBarManager } = NativeModules;
const alturaStatusBar = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

interface HeaderProps {
    title: string;
}

export default function Header({ title }: HeaderProps) {
    return (
        <View style={styles.container}>
            <BorderlessButton onPress={() => { }}>
                <Voltar name="chevron-left" size={40} color="#FFF"></Voltar>
            </BorderlessButton>

            <View style={styles.logo}>
                <Image style={styles.logoImg} source={
                    require('../images/header/logo.png')
                } />
                <Text style={styles.title}>{title}</Text>
            </View>
            <Image source={
                require('../images/header/emergencia.png')
            } />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        width: '100%',
        backgroundColor: '#394867',
        borderBottomWidth: 1,
        paddingTop: alturaStatusBar,
        paddingBottom: 10,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    title: {
        color: '#FFF',
        fontSize: 25,
        fontFamily:'Abel_400Regular',
    },

    logo: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    logoImg: {
        marginRight: 5,
    }

})