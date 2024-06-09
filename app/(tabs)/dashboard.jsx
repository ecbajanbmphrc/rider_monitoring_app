import { color } from '@rneui/base';
import React, { useEffect, useState } from 'react';
const {Text, StyleSheet, View, BackHandler, Alert } = require('react-native');
import { PieChart } from "react-native-gifted-charts";
import { Card, Avatar, Button, Drawer } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


function DashboardScreen({navigation}) {
  


  const [totalParcel, setTotalParcel] = useState(0);
  const [totalBulk, setTotalBulk] = useState(0);
  const [totalNonBulk, setTotalNonBulk] = useState(0);

  var pieData = [
    {value: totalBulk, color: '#7743DB'},
    {value: totalNonBulk, color: '#C3ACD0'}
  ];

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  function testTry(){
    console.log("test");
  }

  async function retrieveDashboardData(){

    const email = await AsyncStorage.getItem('email');
    const dateToday = new Date().toLocaleString('en-us',{month:'numeric', day:'numeric' ,year:'numeric'});
    
    axios.post("https://rider-monitoring-app-backend.onrender.com/get-user-data-dashboard", {email: email , date : dateToday})
    .then(
      async res => {
       
        // setRetrieveData( res.data.data[0].parcel);
        console.log("check",res.data.data[0])
        const testNull = await res.data.data;

        if(testNull.length !== 0){
          setTotalBulk(res.data.data[0].count_bulk)
          setTotalNonBulk(res.data.data[0].count_non_bulk)
          setTotalParcel(res.data.data[0].count_bulk + res.data.data[0].count_non_bulk)
         
        
        }else{
          setTotalBulk(0)
          setTotalNonBulk(0)
          setTotalParcel(0)
        }

      })
    .catch(e => {
     
      console.log(e);
    })  
  }

  useFocusEffect(
    useCallback(() => {
     retrieveDashboardData();
    }, [])
  );

    return (
    
      
          <View style={styles.box}>
      
            <View style={styles.item}>
            <PieChart
                donut
                // paddingVertical={10}
                // paddingHorizontal={10}
                isAnimated={true}
                innerRadius={40}
                data={pieData}
                radius={60}
                centerLabelComponent={() => {
                return(
                 <View style={{ alignItems:"center"}}>
                  <Text style={{fontSize: 18}}>{totalParcel}</Text>
                  <Text style={{fontSize: 10}}>total</Text>
                 </View> 
                 );
                }}
            />

            </View>
            <View style={styles.itemRight}>
            
              <View  style={styles.itemRightChildren}>
              <Icon style={{marginEnd: 10}}name='solid' size={14} color="#7743DB"/>  
                
                <Text>Bulk: </Text>
                <Text>{totalBulk}</Text>
                
               
              </View>
              <View style={styles.itemRightChildren}>
                <Icon style={{marginEnd: 10}}name='solid' size={14} color="#C3ACD0"/>  
                <Text>Non-Bulk: </Text>
                <Text>{totalNonBulk}</Text>
               
              </View>
            </View>
        
          </View>               

  
        
    );
}



export default DashboardScreen;

const styles = StyleSheet.create({
    viewStyle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
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
    box:{
      flexDirection: 'row',
      // flex: 1,
      padding: 5,
      backgroundColor: '#FFFFFF',
      marginTop:20,
      margin: '5%',
      elevation: 10,
      borderRadius: 10
    },
    item:{
      // flex: 100,
      // backgroundColor: 'black',
      padding: 10,
    },
    itemRightChildren:{
      // flex: 100,
      // backgroundColor: 'black',
      flexDirection: 'row',
      padding: 10,
      marginHorizontal: '15%'
    },
    itemRight: {
      // flex: 1,
      marginVertical: 25,
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
    }
  });