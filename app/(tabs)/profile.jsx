import { useFocusEffect } from "expo-router";
import {React,  useState } from "react";
import { View, SafeAreaView, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import {Avatar, Icon, TextInput, Title} from 'react-native-paper';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


 
 
const ProfileScreen = () => {


 const[firstName, setFirstName] = useState("first name");
 const[middleName, setMiddleName] = useState("middle name");
 const[lastName, setLastName] = useState("last name");
 const[phoneNumber, setPhoneNumber] = useState("phone number");
 const[email, setEmail] = useState("email");

 async function getData(){
 
  const a_email = await AsyncStorage.getItem('email');
  const a_firstName = await AsyncStorage.getItem('first_name');
  const a_middleName = await AsyncStorage.getItem('middle_name');
  const a_lastName = await AsyncStorage.getItem('last_name');
  const a_phoneNumber = await AsyncStorage.getItem('phone_number');

  setEmail(a_email);
  setFirstName(a_firstName);
  setMiddleName(a_middleName);
  setLastName(a_lastName);
  setPhoneNumber(a_phoneNumber);


 }

  useFocusEffect(
   useCallback(() => { 
    getData()
   }, [])
  );

 return (

    <View style={styles.viewStyle}>
     <View  style={{alignItems:"center"}}>
      <Avatar.Image
                source={
                    require('../../assets/avatar_128.png')
                }
                size={100}
                style={{marginTop: 5, backgroundColor: '#FFF7F1'}}
              />
      </View>        
      {/* <Text style={styles.textStyle}>This is Dashboard Screen</Text>   */}
      <View style={{padding:15}}>
       <Text style={styles.textStyle}>First Name:</Text> 
       <TextInput
        mode="outlined"
        value = {firstName}
        editable = {false}      
       />
       <Text style={styles.textStyle}>Middle Name:</Text> 
       <TextInput
        mode="outlined"
        value = {middleName}
        editable = {false}      
       />
       <Text style={styles.textStyle}>Last Name:</Text> 
       <TextInput
        mode="outlined"
        value = {lastName}
        editable = {false}      
       />
       <Text style={styles.textStyle}>Phone Number:</Text> 
       <TextInput
        mode="outlined"
        value = {phoneNumber}
        editable = {false}      
       />
       <Text style={styles.textStyle}>Email:</Text> 
       <TextInput
        mode="outlined"
        value = {email}
        editable = {false}      
       />
      </View>   
    </View>   
  );

}

export default ProfileScreen;

const styles = StyleSheet.create({
  viewStyle: {
    display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    flex: 1,
    backgroundColor: "#FFF"
  },
  textStyle: {
    fontSize: 16,
    color: 'black',
    marginVertical: 10
  },
  headingStyle: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
  },
});