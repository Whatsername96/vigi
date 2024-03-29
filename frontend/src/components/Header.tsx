import React from 'react';
//import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BorderlessButton } from 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, NativeModules, Platform, Dimensions } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import { ChevronLeft } from "react-native-feather";
import { NavigationProp, useNavigation } from '@react-navigation/native';

const { StatusBarManager } = NativeModules;
const alturaStatusBar = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

interface HeaderProps {
    title: string;
    showBack: boolean;
    showEmergency: boolean;
}

export default function Header({ title, showBack, showEmergency }: HeaderProps) {
    const navigation = useNavigation<NavigationProp<any>>();

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
                    <ChevronLeft width={40} height={40} color="#FFF" />
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