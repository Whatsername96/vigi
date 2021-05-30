import React from 'react';
//import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BorderlessButton } from 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, NativeModules, Platform, Dimensions } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import Back from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const { StatusBarManager } = NativeModules;
const alturaStatusBar = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

interface HeaderProps {
    title: string;
    logo: boolean;
    showBack: boolean;
    showEmergency: boolean;
}

export default function Header({ title, logo, showBack, showEmergency }: HeaderProps) {
    const navigation = useNavigation();

    function handleNavigateToEmergencia() {
        navigation.navigate('Emergencia');
    }

    return (

        <View style={styles.container}>

            <StatusBar
                style="light"
                hidden={false}
                backgroundColor="#394867"
                translucent={false}
            />

            {showBack &&
                <BorderlessButton onPress={() => { navigation.goBack() }}>
                    <Back name="chevron-left" size={40} color="#FFF" />
                </BorderlessButton>
            }

            {!showBack && <View
                style={{
                    backgroundColor: 'transparent',
                    height: 40,
                    width: 40
                }}
            />
            }

            <View style={styles.containerLogo}>
                {logo && <Image style={styles.logoImg}
                    source={require('../images/header/logo.png')} />
                }

                <Text style={styles.title}>{title}</Text>
            </View>

            {showEmergency &&
                <BorderlessButton onPress={handleNavigateToEmergencia}>
                    <Image source={require('../images/header/emergencia.png')} />
                </BorderlessButton>
            }

            {!showEmergency && <View
                style={{
                    backgroundColor: 'transparent',
                    height: 40,
                    width: 40
                }}
            />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        width: Dimensions.get('window').width,
        top: 0,
        backgroundColor: '#394867',
        borderBottomWidth: 1,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    title: {
        color: '#FFF',
        fontSize: 25,
        fontFamily: 'Abel_400Regular',
    },

    containerLogo: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    logoImg: {
        marginRight: 5,
    }

})