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

    const [userData, setUserData] = useState('');

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
          router.replace('/auth/login');}
        },
        ]);
    }

    async function getData(){
    const token = await AsyncStorage.getItem('token');

    let userEmail
   
   
    console.log(token);
    await axios.post("http://192.168.50.139:8082/user-data" ,{token: token})
    .then(res => {
    AsyncStorage.setItem('email', res.data.data.email);
    setUserData(res.data.data);
    userEmail = res.data.data.email  

    });

   }
    
    useEffect(() => { 
        getData();
    }, []);

    return( 
       <View style={{ flex: 1}}>     
        <DrawerContentScrollView 
        {...props}
         contentContainerStyle={{
            // backgroundColor: '#dde3f3'
            paddingTop: top
        }}
        >
        {/* <View style={{}}>
            <Image
             source={{ uri: 'https://galaxies.dev/img/authors/simong.webp'}}
             style={{ width: 100, height: 100, alignSelf: 'center'}}
             />
        </View> */}
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
                {userData.last_name}
              </Title>
                <Text style={styles.caption} numberOfLines={1}>
                {userData.email}
            
            
                </Text>
              </View>
            </View>
          </View>
         <DrawerItemList {...props}/>
        
        </DrawerContentScrollView>

        {/* <Drawer.Screen
             name="parcel"
             options={{
                drawerLabel: 'Parcel',
                headerTitle: 'Parcel',
                drawerIcon: ({ size = 100, color }) => (
                    <Icon name='home-outline' size={20}/>
                ),
             }}
             />  */}
        
        {/* <View
         style={{
            borderTopColor: '#dde3fe',
            borderTopWidth: 1,
            padding: 20,
            paddingBottom: 20 + bottom,
         }}>
         <TouchableOpacity>
         <Text>Footer</Text>
        </TouchableOpacity>   
            
            
        </View> */}
         <View
         style={{
            borderTopColor: '#CDE8E5',
            borderTopWidth: 1,
            // padding: 10,
            // paddingBottom: 30 + bottom,
         }}>
         <DrawerItem 
         label={"Logout"} onPress={() =>signOut()}
        //     icon={() => <Icon name="ios-home" size={24} 
        //     />}
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
      // color: '#6e6e6e',
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
      // marginRight: 15,
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
