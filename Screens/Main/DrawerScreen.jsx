import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer} from '@react-navigation/native';
import { Drawer } from 'react-native-paper';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import UserScreen from './UserScreen';
const {Text} = require('react-native');
const StackNav = () => {
    const Stack = createNativeStackNavigator();
    return(
        <Stack.Navigator   
            screenOption={{
                statusbarColor: '#0163d2',
                headerStyle :{
                 backgroundColor: '#0163d2',
                },
                headerTintColor: '#fff',
                headerTitleAlign: 'center',
          }}>
          <Stack.Screen name="Home" component = {HomeScreen}/>
          <Stack.Screen name="Profile" component = {ProfileScreen}/>
          <Stack.Screen
            name="User"
            component={UserScreen}
            options={{
                headerShown: true,
            }}/>
        </Stack.Navigator>
        )
    }

function DrawerScreen() {
    return (
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name="Home" component={StackNav}/>
            </Drawer.Navigator>
        </NavigationContainer>
       
    );
}



export default DrawerScreen;
 