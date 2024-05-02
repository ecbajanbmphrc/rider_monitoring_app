// import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {  createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
// import React from 'react';
import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

const StackNav = () => {
  const navigation = useNavigation();
  return(
    <Stack.Navigator
    screenOptions={{
      statusBarColor: '#0163d2',
      headerShown: false,
      headerStyle: {
        backgroundColor: '#0163d2',
      },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
    }}>
    <Stack.Screen name="LoginForm" component={LoginNav}/>     
    </Stack.Navigator>
  );
};
const CustomDrawerNav = () => {
  return(
    <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerLayout {...props} />}>
    <Drawer.Screen name="Dashboard" component={DashboardScreen} />
    <Drawer.Screen name="Attendance" component={AttendanceScreen} />
    <Drawer.Screen name="Parcel" component={ParcelScreen} />
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen 
        name="Login"  
        component={LoginPage} 
        options={{ 
         contentStyle:{
         
          animation:'slide_from_right'
          }}}/>
   
   
  </Drawer.Navigator>

  );
}

const LoginNav = () => {
  return(
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
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  async function getData(){
    const data = await AsyncStorage.getItem('isLoggedIn');
    setIsLoggedIn(data);

  }

  useEffect(() => {
    getData();
  }, []);

  return (
    
    <NavigationContainer>
      {isLoggedIn ? <CustomDrawerNav/> : <LoginNav name="Login"/>}
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
