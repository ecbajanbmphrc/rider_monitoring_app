import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { Stack, Tabs } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { color } from '@rneui/base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDrawerContent from '../../components/CustomDrawerContent';


const DrawerLayout = () => {
    return(
       <GestureHandlerRootView style={{ flex: 1}}>
         <Drawer drawerContent={CustomDrawerContent}
         screenOptions={{
            // drawerHideStatusBarOnOpen: true,
            // drawerActiveBackgroundColor: '#5363df',
            // drawerActiveTintColor: '#fff',
            drawerLabelStyle: { marginLeft: -20},
         }}
         >
            <Drawer.Screen
             name="dashboard"
             options={{
                drawerLabel: 'Dashboard',
                headerTitle: 'Dashboard',
                drawerIcon: ({ size = 100, color }) => (
                    <Icon name='chart-box-outline' size={20}/>
                ),
             }}
             />

            <Drawer.Screen
             name="profile"
             options={{
                drawerLabel: 'Profile',
                headerTitle: 'Profile',
                drawerIcon: ({ size = 100, color }) => (
                    <Icon name='account-circle-outline' size={20}/>
                ),
             }}
             />

            <Drawer.Screen
             name="attendance"
             options={{
                drawerLabel: 'Attendance',
                headerTitle: 'Attendance',
                drawerIcon: ({ size = 100, color }) => (
                    <Icon name='account-check-outline' size={20}/>
                ),
             }}
             /> 

            <Drawer.Screen
             name="parcel"
             options={{
                drawerLabel: 'Parcel',
                headerTitle: 'Parcel',
                drawerIcon: ({ size = 100, color }) => (
                    <Icon name='inbox' size={20}/>
                ),
             }}
             /> 
         </Drawer>
       </GestureHandlerRootView>
       
        
    );

}

export default DrawerLayout;