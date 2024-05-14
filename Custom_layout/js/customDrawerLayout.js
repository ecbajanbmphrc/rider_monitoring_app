// import * as React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { View, Button, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Avatar, Title} from 'react-native-paper';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import React, { useEffect, useState } from 'react';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';




const DrawerList = [
  {icon: 'chart-box-outline', label: 'Dashboard', navigateTo: 'Dashboard'},
  {icon: 'account-circle-outline', label: 'Profile', navigateTo: 'Profile'},
  {icon: 'account-check-outline', label: 'Attendance', navigateTo: 'Attendance'}, 
  {icon: 'inbox', label: 'Parcel', navigateTo: 'Parcel'},
  {icon: 'home-outline', label: 'Home', navigateTo: 'Home'},
 
  
];

const DrawerLayout = ({icon, label, navigateTo}) => {
  
  
  const navigation = useNavigation();

  // console.log(userData);
  return (
    <DrawerItem
      icon={({color, size}) => <Icon name={icon} color={color} size={size} />}
      label={label}
      onPress={() => {
        navigation.navigate(navigateTo);
      }}
    />
  );
};

const DrawerItems = props => {
  return DrawerList.map((el, i) => {
    return (
      <DrawerLayout
        key={i}
        icon={el.icon}
        label={el.label}
        navigateTo={el.navigateTo}
      />
    );
  });
};

function CustomDrawerLayout(props) {
  const navigation = useNavigation();
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
      navigation.navigate('Login');}
    },
    ]);

    
  }


  const [userData, setUserData] = useState('');

  async function getData(){
    const token = await AsyncStorage.getItem('token');
   
    console.log(token);
    axios.post("http://192.168.1.167:8082/userdata" , {token: token})
    .then(res => {
    AsyncStorage.setItem('email', res.data.data.email);
    console.log(res.data)
    setUserData(res.data.data)});
  }
  useEffect(() => { 
    getData();
  }, []);

  return (
    <View style={{flex: 1}}>
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <TouchableOpacity activeOpacity={0.8}>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <Avatar.Image
                source={
                   require('../../assets/avatar_128.png')
                }
                size={50}
                style={{marginTop: 5, backgroundColor: '#FFF7F1'}}
              />
              <View style={{marginLeft: 10, flexDirection: 'column'}}>
                <Title style={styles.title}> {userData.first_name}</Title>
                <Text style={styles.caption} numberOfLines={1}>
                 {userData.email}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.drawerSection}>
          <DrawerItems />
        </View>
      </View>
    </DrawerContentScrollView>
    <View style={styles.bottomDrawerSection}>
      <DrawerItem
        onPress={() => signOut()}
        icon={({color, size}) => (
          <Icon name="exit-to-app" color={color} size={size} />
        )}
        label="Sign Out"
      />
    </View>
  </View>
  );
}

const Drawer = createDrawerNavigator();



export default CustomDrawerLayout;


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