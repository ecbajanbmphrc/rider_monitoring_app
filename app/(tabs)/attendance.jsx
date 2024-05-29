import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
const { Alert} = require('react-native');
import React, { useState, useEffect } from 'react';
const {Text, StyleSheet, View, SafeAreaView, Dimensions, TouchableOpacity} = require('react-native');
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import * as Location from 'expo-location';
// import {ENV} from '../../env';
import { ProgressDialog } from 'react-native-simple-dialogs';



function AttendanceScreen() {

  

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [userEmail, setUserEmail] = useState('');
  const [timeIn, setTimeIn] = useState('-----');
  const [timeOut, setTimeOut] = useState('-----');
  const [status, setStatus] = useState('time_in');

  const [test, setTest] = useState('');
  const [longitude , setLongitude] = useState('');
  const [latitude , setLatitude] = useState('');
  const [timeInAddress, setTimeInAddress] = useState('');
  const [timeOutAddress, setTimeOutAddress] = useState('');
  const [progressVisible, setProgressVisible] = useState(false);

  const [refresh, setRefresh]  = useState(false); 

  async function onRefresh(){
  
  const data = await AsyncStorage.getItem('email');


  setUserEmail(data);
  
  axios.get( "https://rider-monitoring-app-backend.onrender.com/retrieve-user-attendance" ,  {params: {user: data}})
  .then(

  async res => {
  const timeInAddress = await Location.reverseGeocodeAsync({"latitude" : parseFloat(res.data.data.time_in_coordinates.latitude) , "longitude" : parseFloat(res.data.data.time_in_coordinates.longitude)});
   
  const time_in_city_and_street = timeInAddress[0].city + ", " +  timeInAddress[0].street;

  setTimeIn(res.data.data.time_in);
  setTimeInAddress(time_in_city_and_street);
  setStatus('time_out')
  

  if(res.data.data.time_out){
    setTimeOut(res.data.data.time_out);
    const timeOutAddress = await Location.reverseGeocodeAsync({"latitude" : parseFloat(res.data.data.time_out_coordinates.latitude) , "longitude" : parseFloat(res.data.data.time_out_coordinates.longitude)});
    
    const time_out_city_and_street = timeOutAddress[0].city + ", " +  timeOutAddress[0].street;
    
    setTimeOutAddress(time_out_city_and_street);

    setStatus('done')
    
    console.log("is not null");
  }else{
    console.log("is null");
   
  }
 
  console.log(res.data.data,'testining');
  

  })
  .catch(e => {
    console.log(e)
    
    setTimeIn('-----');
    setTimeOut('-----');
    setTimeInAddress('');
    setTimeOutAddress('');
    setStatus('time_in');
   
    })
  };



  useFocusEffect(
    useCallback(() => {
     onRefresh();
    }, [])
  );



  useEffect(() => {
  
  const timer = setInterval (() => {{
    setCurrentDateTime(new Date())
    }
    
   }
    ,1000)

  
  return()=> clearInterval(timer)
 

  }, [])

  async function handleAttendanceTimeInSubmit(){
    const data = await AsyncStorage.getItem('email');

   
    try{
    let { status } = await Location.requestForegroundPermissionsAsync();
    setProgressVisible(true) 
      if(status !== 'granted'){
          console.log("Please grant location permissions");
          setProgressVisible(false) 
          return;
      }

      var currentLocation = await Location.getCurrentPositionAsync({});
    }catch{
      setProgressVisible(false) 
    }
      
    setProgressVisible(false) 
    const attendanceData = {
        user: userEmail,
        w_date: currentDateTime.toLocaleString(),
        date: currentDateTime.toLocaleString('en-us',{month:'numeric', day:'numeric' ,year:'numeric'}),
        time_in: currentDateTime.toLocaleString('en-us',{hour:'numeric', minute:'numeric', second:'numeric'}),
        time_in_coordinates: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude
        },
        time_out: '',
        time_out_coordinates: {
          latitude: '',
          longitude: ''
        }
       
    };  
  
    console.log(currentLocation.coords.latitude);
    
    Alert.alert('Confirmation:', 'You are about to input your time in!', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'Confirm', onPress: () =>
        {
        setProgressVisible(true)  ,  
      axios
      .put("https://rider-monitoring-app-backend.onrender.com/attendance-input-time-in", attendanceData)
      .then(res => {console.log(res.data)
        console.log('your longitude is',longitude);

      if(res.data.status == 200){
        setProgressVisible(false) 
        Alert.alert("Attendance recorded successfully!");
        onRefresh();
        setStatus('time_out')
       }else{    
        setProgressVisible(false) 
        Alert.alert("Attendance creation failed",JSON.stringify(res.data.data), [
          {
              text: 'OK'
          }
        ]);
       }
       

      })
      .catch(e => {console.log(e), setProgressVisible(false) })
     }
    },
    ]);
    
        
             
  }


  async function handleAttendanceTimeOutSubmit(){

   
    try{
      setProgressVisible(true)
    let { status } = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
       setProgressVisible(false)
        console.log("Please grant location permissions");
        return;
    }

    var currentLocation = await Location.getCurrentPositionAsync({});
   }catch{
      setProgressVisible(false)
   }
      setProgressVisible(false)

    let timeoutLatitude = currentLocation.coords.latitude;
    let timeoutLongitude = currentLocation.coords.longitude;

    time_out_input = currentDateTime.toLocaleString('en-us',{hour:'numeric', minute:'numeric', second:'numeric'})

    const attendanceData = {
      user: userEmail, 
      time_out : time_out_input, 
      time_out_coordinates : {
        latitude: timeoutLatitude,
        longitude : timeoutLongitude
      }

    }

    Alert.alert('Confirmation:', 'You are about to input your time out!', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'Confirm', onPress: () => 
       {
        setProgressVisible(true) 
       axios
      .put("https://rider-monitoring-app-backend.onrender.com/attendance-input-time-out", attendanceData)
      .then(res => {console.log(res.data)

      if(res.data.status == 200){
        setProgressVisible(false) 
        Alert.alert("Attendance recorded successfully!");
        onRefresh();
        setStatus('done')
       }else{   
        setProgressVisible(false)  
        Alert.alert("Attendance creation failed",JSON.stringify(res.data.data), [
          {
              text: 'OK'
          }
        ]);
       }
       

      })
      .catch(e => {console.log(e), setProgressVisible(false) })
      }
     },
    ]);
    
        
             
  }

    return (
    <SafeAreaView style={{flex: 1}}>
     <ScrollView refreshControl={<RefreshControl refreshing = {refresh} onRefresh={onRefresh}/>}>
     <View style={{flex:1, marginTop: 35}}>

     <ProgressDialog
                 visible={progressVisible}
                 title="Loading"
                 message="Please, wait..."
      />


      <View style={cardStyles.cardView}>
      <Text style={{marginTop: 10,alignSelf: 'center', fontSize: 40, fontWeight: '800',  color:'#FFFFFF'}}>

        {currentDateTime.toLocaleString('en-us',{hour:'numeric', minute:'numeric', second:'numeric'})}

      </Text>
      <View style={{marginTop: 10}}>
       <Text style={{alignSelf: 'center', fontSize:20, fontWeight: '500',  color:'#FFFFFF'}}>
       
       {currentDateTime.toLocaleString('en-us',{month:'short', day:'numeric' ,year:'numeric', getDay:'number', weekday:'short' })}

       </Text>
       </View> 
      </View>  

      <View style={cardStyles.timeCardView}>
        <Text style={{marginTop: 5,alignSelf: 'center', fontSize: 35, fontWeight: '500',  color:'#000000'}}>
          Time In:
        </Text>
      <Text style={{marginTop: 10,alignSelf: 'center', fontSize: 25, fontWeight: '500',  color:'#000000'}}>


        {timeIn}
        

      </Text>

      <Text style={{marginTop: 5, alignSelf: 'center', fontSize: 20, fontWeight: '500',  color:'#000000'}}>


        {timeInAddress}
        

      </Text>

       <View style={{marginTop:20,flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
       <View>

      </View >
        <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
      </View>
      
       <Text style={{marginTop: 20,alignSelf: 'center', fontSize: 35, fontWeight: '500',  color:'#000000'}}>
          Time Out:
        </Text>

       <Text style={{marginTop: 10,alignSelf: 'center', fontSize: 25, fontWeight: '600',  color:'#000000'}}>

       {timeOut}

      </Text>
     
      <Text style={{marginTop: 5, alignSelf: 'center', fontSize: 20, fontWeight: '500',  color:'#000000'}}>


        {timeOutAddress}
        

      </Text>


      </View>  

     
     </View>

     </ScrollView>

  {status === "time_in" &&(
      <View style={styles.button}>
      <TouchableOpacity 
       style={styles.loginButton}
       onPress={() => handleAttendanceTimeInSubmit() }
      >
          <View>
              <Text style={styles.textSign}>
                  Time In
              </Text>
          </View>
      </TouchableOpacity>
      </View>
  )
  }

  {status === "time_out" &&(

   <View style={styles.button}>
    <TouchableOpacity   
      style={styles.loginButton}
      onPress={() => handleAttendanceTimeOutSubmit() }
    >
     <View>
        <Text style={styles.textSign}>
            Time Out
        </Text>
     </View>
    </TouchableOpacity>
  </View>


  )
  }

       
    </SafeAreaView>
    );

}

export default AttendanceScreen;

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
    button: {
      alignItems: 'center',
      // marginTop: 0,
      alignItems: 'center',
      textAlign: 'center',
      margin: 20,
    },
    loginButton: {
      width: '100%',
      backgroundColor: '#420475',
      alignItems: 'center',
      marginTop: -320,
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 10,
    },
    textSign: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
    },

});


const cardStyles = StyleSheet.create({
  text:{
    color:'#000'
  },
  cardView:{
    height: 120,
    width: '93%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#420475',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset:{width: 0, height:0},
    shadowOpacity: 1,
    shadowRadius: 8,
    borderRadius: 36,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    margin: 6
  },
  timeCardView:{
    height: 300,
    width: '93%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset:{width: 0, height:0},
    shadowOpacity: 1,
    shadowRadius: 8,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    margin: 6
  }
})
