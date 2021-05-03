import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Header from './components/Header';

import MapaDelitos from './pages/MapaDelitos';
import Emergencia from './pages/Emergencia';
import Denunciar from './pages/Denunciar';

const { Navigator, Screen } = createStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer>
            <Navigator screenOptions={{headerShown: true}}>
                <Screen
                    name={"MapaDelitos"}
                    component={MapaDelitos}
                    options={{
                        header: () => <Header title={'Vigi'} logo={true} showBack={false} showEmergency={true} />
                    }}
                />
                <Screen
                    name={"Emergencia"}
                    component={Emergencia}
                    options={{
                        header: () => <Header title={'Emergência'} logo={false} showBack={true} showEmergency={false} />
                    }}
                />
                <Screen
                    name={"Denunciar"}
                    component={Denunciar}
                    options={{
                        header: () => <Header title={'Denunciar'} logo={false} showBack={true} showEmergency={true} />
                    }}
                />
            </Navigator>
        </NavigationContainer>
    )
}