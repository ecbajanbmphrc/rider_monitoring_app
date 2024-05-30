import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { View, Text, Image, StyleSheet, Alert} from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {Avatar, Icon, Title} from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function CustomDrawerContent(props){
        
    const router = useRouter();
    
    const { top, bottom } = useSafeAreaInsets();


    const [userEmailData, setUserEmailData] = useState('');
    const [userLastNameData, setUserLastNameData] = useState('');

    function signOut(){

        Alert.alert('Hold on!', 'Are you sure you want to sign out?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'YES', onPress: () => {
          AsyncStorage.setItem('isLoggedIn','');
          AsyncStorage.setItem('token','');
          AsyncStorage.setItem('email','');
          AsyncStorage.setItem('first_name','');
          AsyncStorage.setItem('middle_name','');
          AsyncStorage.setItem('last_name','');
          AsyncStorage.setItem('phone_number','');
          router.replace('/auth/login');}
        },
        ]);
    }

    async function getData(){
    const token = await AsyncStorage.getItem('token');

    const email = await AsyncStorage.getItem('email');
    const lastName = await AsyncStorage.getItem('last_name');

    setUserEmailData(email);
    setUserLastNameData(lastName);


   }
    
    useEffect(() => { 
        getData();
    }, []);

    return( 
       <View style={{ flex: 1}}>     
        <DrawerContentScrollView 
        {...props}
         contentContainerStyle={{
      
            paddingTop: top
        }}
        >
   
        <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15, marginBottom: 10}}>
              <Avatar.Image
                source={
                    require('../assets/avatar_128.png')
                }
                size={50}
                style={{marginTop: 5, backgroundColor: '#FFF7F1'}}
              />
              <View style={{marginLeft: 10, flexDirection: 'column'}}>
              <Title style={styles.title}> 
                {userLastNameData}
              </Title>
                <Text style={styles.caption} numberOfLines={1}>
                {userEmailData}
            
            
                </Text>
              </View>
            </View>
          </View>
         <DrawerItemList {...props}/>
        
        </DrawerContentScrollView>

      
         <View
         style={{
            borderTopColor: '#CDE8E5',
            borderTopWidth: 1,
         }}>
         <DrawerItem 
         label={"Logout"} onPress={() =>signOut()}

        icon={() => <Icon color={'black'} size={20} source="logout" />}
       

         />
         </View>
       </View>
        );
}


const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 13,
      lineHeight: 14,

      width: '100%',
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',

    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
      borderBottomWidth: 0,
      borderBottomColor: '#dedede',
      borderBottomWidth: 1,
    },
    bottomDrawerSection: {
      marginBottom: 0,
      borderTopColor: '#dedede',
      borderTopWidth: 1,
      borderBottomColor: '#dedede',
      borderBottomWidth: 1,
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });
