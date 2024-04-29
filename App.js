// import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {  createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
// import React from 'react';
import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import HomeScreen from './Screens/Main/HomeScreen';
import ProfileScreen from './Screens/Main/ProfileScreen';
// import UserScreen from './Screens/Main/UserScreen'; 
import LoginPage from './Screens/Auth/Login';
import RegisterPage from './Screens/Auth/Register';
// import { Icon } from 'react-native-paper';
// import DrawerContent from './DrawerContent';
import CustomDrawerLayout from './Custom_layout/js/customDrawerLayout';
import DashboardScreen from './Screens/Main/DashboardScreen';
import AttendanceScreen from './Screens/Main/AttendanceScreen';
import ParcelScreen from './Screens/Main/ParcelScreen';
const Stack = createNativeStackNavigator();


const Drawer = createDrawerNavigator();

const CustomDrawerNav = () => {
  return(
    <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerLayout {...props} />}>
    {/* <View>
      <Text>
        Test123
      </Text>
    </View> */}
    <Drawer.Screen name="Dashboard" component={DashboardScreen} />
    <Drawer.Screen name="Attendance" component={AttendanceScreen} />
    <Drawer.Screen name="Parcel" component={ParcelScreen} />
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
  </Drawer.Navigator>

  );
}

export default function App() {
    
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
         headerShown:false,   
        }}>
        <Stack.Screen 
        name="Login"  
        component={LoginPage} 
        options={{ 
         contentStyle:{
         
          animation:'slide_from_right'
          }}}/>
        <Stack.Screen 
        name="Register" 
        component={RegisterPage}
        options={{ 
          contentStyle:{
           animationTypeForReplace: 'push',
           animation:'slide_from_left'
          }}}
        />
        <Stack.Screen name="DrawerMain" component={CustomDrawerNav}/>     
      </Stack.Navigator>
    </NavigationContainer>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
