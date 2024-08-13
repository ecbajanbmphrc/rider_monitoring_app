import { color } from '@rneui/base';
import React, { useEffect, useState } from 'react';
const {Text, StyleSheet, View, BackHandler, Alert, Image } = require('react-native');
import { PieChart, BarChart } from "react-native-gifted-charts";
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
  const [isLoading, setIsLoading] = useState(true);

  const [mondayParcel, setMondayParcel] = useState(0);
  const [tuesdayParcel, setTuesdayParcel] = useState(0);
  const [wednesdayParcel, setWednesdayParcel] = useState(0);
  const [thursdayParcel, setThursdayParcel] = useState(0);
  const [fridayParcel, setFridayParcel] = useState(0);
  const [saturdayParcel, setSaturdayParcel] = useState(0);
  const [sundayParcel, setSundayParcel] = useState(0);

  var pieData = [
    {value: totalBulk, color: '#FF204E'},
    {value: totalNonBulk, color: '#E78895'}
  ];

  const llData = [
    {value: mondayParcel, label: 'Mon'},
    {value: tuesdayParcel, label: 'Tue'},
    {value: wednesdayParcel, label: 'Wed'},
    {value: thursdayParcel, label: 'Thu'},
    {value: fridayParcel, label: 'Fri'},
    {value: saturdayParcel, label: 'Sat'},
    {value: sundayParcel,  label: 'Sun'},
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


  async function retrieveDashboardData(){

    const email = await AsyncStorage.getItem('email');
    const dateToday = new Date().toLocaleString('en-us',{month:'numeric', day:'numeric' ,year:'numeric'});
    
    axios.post("http://192.168.50.139:8082/get-user-data-dashboard", {email: email , date : dateToday})
    .then(
      async res => {
    
        const data = await res.data;

        console.log(data.userParcelPerDay, "test")


       
       setMondayParcel(0)

       setTuesdayParcel(0)

       setWednesdayParcel(0)

       setThursdayParcel(0)

       setFridayParcel(0)
       
       setSaturdayParcel(0)

       setSundayParcel(0)

      if(res.data.status === 200){

        if(data.data.length !== 0){
          console.log(res.data.data[0])
          setTotalBulk(res.data.data[0].delivered_parcel_bulk_count)
          setTotalNonBulk(res.data.data[0].delivered_parcel_non_bulk_count)
          setTotalParcel(res.data.data[0].delivered_parcel_total)

    
         data.userParcelPerDay.map((data, key) => {
       
               if(data._id === "Monday"){setMondayParcel(data.parcel[0])}

               if(data._id === "Tuesday"){setTuesdayParcel(data.parcel[0])}

               if(data._id === "Wednesday"){setWednesdayParcel(data.parcel[0])}

               if(data._id === "Thursday"){setThursdayParcel(data.parcel[0])}

               if(data._id === "Friday"){setFridayParcel(data.parcel[0])}

               if(data._id === "Saturday"){setSaturdayParcel(data.parcel[0])}

               if(data._id === "Sunday"){setSundayParcel(data.parcel[0])}

           }
        );

  
          
         
  
        }else{
          setTotalBulk(0)
          setTotalNonBulk(0)
          setTotalParcel(0)
       
        }
      }else{
        setTotalBulk(0)
        setTotalNonBulk(0)
        setTotalParcel(0)
     
      }  
      setIsLoading(false)
      })
    .catch(e => {

      setTotalBulk(0)
      setTotalNonBulk(0)
      setTotalParcel(0)
      setIsLoading(false)
     
      console.log(e);
    })  
  }

  useFocusEffect(
    useCallback(() => {
     retrieveDashboardData();
    }, [])
  );

    return (
    
        <View>
          {isLoading?
            <View style={{alignItems: 'center', marginVertical: '75%'}}>
              <Image style={styles.logo} source = {require('../../assets/dual_ball_loading.gif')}/>
            </View>
            :
            <View>
            <View style={styles.box}>
        
              <View style={styles.item}>
              <PieChart
                  donut
                  // paddingVertical={10}
                  // paddingHorizontal={10}
                  isAnimated
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
                <Icon style={{marginEnd: 10}}name='solid' size={14} color="#FF204E"/>  
                  
                  <Text>Bulk: </Text>
                  <Text>{totalBulk}</Text>
                  
                
                </View>
                <View style={styles.itemRightChildren}>
                  <Icon style={{marginEnd: 10}}name='solid' size={14} color="#E78895"/>  
                  <Text>Non-Bulk: </Text>
                  <Text>{totalNonBulk}</Text>
                
                </View>
              </View>
          
            </View>   
            
            <View style={styles.box}>
        
              <View style={{ alignItems: 'center', flex: 1}}>
              <BarChart
                  // paddingVertical={10}
                  // paddingHorizontal={100}
                  barWidth={22}
                  noOfSections={3}
                  barBorderRadius={4}
                  frontColor="#405D72"
                  data={llData}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  isAnimated
                
                  
              />
              </View>
        
          
            </View>  
          </View>
            }
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
      // marginTop:15,
      // margin: '5%',
      marginTop: '5%',
      marginHorizontal: '5%',
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
      backgroundColor: 'transparent',
    },
    logo: {
      height: 90,
      width: 90,
  
    },
  });