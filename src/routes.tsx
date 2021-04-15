 import React from 'react';

 import { NavigationContainer } from '@react-navigation/native';
 import { createStackNavigator } from '@react-navigation/stack';
 import Header from './components/Header';

 const { Navigator, Screen } = createStackNavigator();

import MapaDelitos from './pages/MapaDelitos';
import Emergencia from './pages/Emergencia';

 export default function Routes() {
     return(
         <NavigationContainer>
             <Navigator screenOptions={{ headerShown: true }}>
                 <Screen 
                 name={"MapaDelitos"} 
                 component={MapaDelitos}
                 options={{ 
                     header: () => <Header title={'Vigi'} logo={true} showBack={false} showEmergency={true}/>
                    }}
                 />
                 <Screen 
                 name={"Emergencia"} 
                 component={Emergencia}
                 options={{ 
                    header: () => <Header title={'Emergência'} logo={false} showBack={true} showEmergency={false}/>
                   }}
                 />
             </Navigator>
         </NavigationContainer>
     )
 }