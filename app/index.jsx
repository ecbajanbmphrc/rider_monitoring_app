import { Link, useRouter, Redirect } from 'expo-router';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Page = () => {
    const router = useRouter();
  

    const getData = async () => {
        try {
            const emaildata = await AsyncStorage.getItem('email');
            if (emaildata !== null) {  
                router.replace('/(tabs)/dashboard');
            }else{
                router.replace('/auth/login',);
            }
        } catch (error) {
            console.error("Error retrieving isLoggedIn value from AsyncStorage:", error);
        }
    }
    
    useEffect(() => {
        getData();
    }, []); 

 
    return (
    <View style={styles.viewStyle}>
        {/* <Text style={styles.textStyle}>Loading.....</Text> */}
      </View>
    );
}

export default Page;

const styles = StyleSheet.create({
    viewStyle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: '#FFF'
    },
    textStyle: {
      fontSize: 28,
      color: 'black',
    },
    headingStyle: {
      fontSize: 30,
      color: 'black',
      textAlign: 'center',
    },
  });