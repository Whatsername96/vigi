import React from 'react';
//import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BorderlessButton } from 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, NativeModules, Platform, TouchableOpacity } from 'react-native';

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
                <TouchableOpacity>
                <Voltar name="chevron-left" size={40} color="#FFF"></Voltar>
                </TouchableOpacity>
            </BorderlessButton>

            <View style={styles.containerLogo}>
                <Image style={styles.logoImg} source={
                    require('../images/header/logo.png')
                } />
                <Text style={styles.title}>{title}</Text>
            </View>
            
            <TouchableOpacity>
                <Image source={
                require('../images/header/emergencia.png')
            } />
            </TouchableOpacity>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        width: '100%',
        top: 0,
        backgroundColor: '#394867',
        borderBottomWidth: 1,
        paddingBottom: 10,
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    title: {
        color: '#FFF',
        fontSize: 25,
        fontFamily:'Abel_400Regular',
    },

    containerLogo: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    logoImg: {
        marginRight: 5,
    }

})