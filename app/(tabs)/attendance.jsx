import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
const { Alert, Image} = require('react-native');
import React, { useState, useEffect } from 'react';
const {Text, StyleSheet, View, SafeAreaView, Dimensions, TouchableOpacity} = require('react-native');
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import * as Location from 'expo-location';
import { ProgressDialog, ConfirmDialog } from 'react-native-simple-dialogs';
import { TextInput } from 'react-native-paper';



function AttendanceScreen() {

  

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [userEmail, setUserEmail] = useState('');
  const [timeIn, setTimeIn] = useState('-----');
  const [timeOut, setTimeOut] = useState('-----');
  const [status, setStatus] = useState('');
  const [connection, setConnection] = useState(true);

  const [test, setTest] = useState('');
  const [longitude , setLongitude] = useState('');
  const [latitude , setLatitude] = useState('');
  const [timeInAddress, setTimeInAddress] = useState('');
  const [timeOutAddress, setTimeOutAddress] = useState('');
  const [progressVisible, setProgressVisible] = useState(false);
  const [timeOutConfirmation, setTimeOutConfirmation] = useState(false);
  const [assignedParcel, setAssignedParcel] = useState('');

  const [refresh, setRefresh]  = useState(false); 

  async function onRefresh(){
  
  const data = await AsyncStorage.getItem('email');


  setUserEmail(data);
  
  axios.get( "http://192.168.50.139:8082/retrieve-user-attendance" ,  {params: {user: data}})
  .then(

  async res => {

    


  if(res.data.status === 400){
    setConnection(true);
    setStatus("time_in");
    setTimeIn('-----');
    setTimeOut('-----');
    setTimeInAddress('');
    setTimeOutAddress('');
  }
  else if (res.data.status === 200){
    if(!res.data.data.time_out){
      setConnection(true)
      try{
        const timeInAddress = await Location.reverseGeocodeAsync({"latitude" : parseFloat(res.data.data.time_in_coordinates.latitude) , "longitude" : parseFloat(res.data.data.time_in_coordinates.longitude)});
        const time_in_city_and_street = timeInAddress[0].city + ", " +  timeInAddress[0].street;  
        setTimeInAddress(time_in_city_and_street);
      }catch{
        setTimeInAddress("-----")
      }
      setTimeIn(res.data.data.time_in);
      setStatus('time_out')
    }else{
      setConnection(true)   

      try{
        
        const timeInAddress = await Location.reverseGeocodeAsync({"latitude" : parseFloat(res.data.data.time_in_coordinates.latitude) , "longitude" : parseFloat(res.data.data.time_in_coordinates.longitude)});
        const time_in_city_and_street = timeInAddress[0].city + ", " +  timeInAddress[0].street;
        setTimeInAddress(time_in_city_and_street);

        const timeOutAddress = await Location.reverseGeocodeAsync({"latitude" : parseFloat(res.data.data.time_out_coordinates.latitude) , "longitude" : parseFloat(res.data.data.time_out_coordinates.longitude)});
        const time_out_city_and_street = timeOutAddress[0].city + ", " +  timeOutAddress[0].street;
        setTimeOutAddress(time_out_city_and_street);

      }catch{
        setTimeInAddress("-----")
        setTimeOutAddress("-----");
      }
      setTimeIn(res.data.data.time_in);
      setTimeOut(res.data.data.time_out);
     
      setStatus('done') 

    }
    
  }


  })
  .catch(e => {
    console.log(e)
    
    setTimeIn('-----');
    setTimeOut('-----');
    setTimeInAddress('');
    setTimeOutAddress('');
    setStatus('no_internet');
    setConnection(false);
   
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
      .put("http://192.168.50.139:8082/attendance-input-time-in", attendanceData)
      .then(res => {console.log(res.data)
        console.log('your longitude is',longitude);

      if(res.data.status == 200){
        setProgressVisible(false) 
        Alert.alert("Success","Attendance recorded successfully!");
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
    const email = await AsyncStorage.getItem('email');


    setProgressVisible(true)

    await axios.post("http://192.168.50.139:8082/retrieve-parcel-input", {user: email})
    .then(
      async res => {
       
        if(res.data.data[0].parcel.length > 0){
       

        const dataLength = res.data.data[0].parcel.length
        

        if(res.data.data[0].parcel[dataLength-1].weekday !== res.data.weekday){
          Alert.alert("Attendance creation failed", "Please input your total parcels!")
          setProgressVisible(false) 
          return
        }
       
      }
      setProgressVisible(false) 
      })
    .catch(e => {
      setProgressVisible(false) 
      console.log(e);
    })  
  
   
    try{
    
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
      time_out_coordinates : {
        latitude: timeoutLatitude,
        longitude : timeoutLongitude
      },
      assignedParcel: assignedParcel

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
      .put("http://192.168.50.139:8082/attendance-input-time-out", attendanceData)
      .then(res => {console.log(res.data)

      if(res.data.status == 200){
        setProgressVisible(false) 
        Alert.alert("Success","Attendance recorded successfully!");
        onRefresh();
        setAssignedParcel('')
        // setTimeOutConfirmation(false)
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
    <SafeAreaView style={{flex: 1 }}>
     <ScrollView refreshControl={<RefreshControl refreshing = {refresh} onRefresh={onRefresh}/>}>
     <View style={{flex:1, marginTop: 35}}>

     <ProgressDialog
                 visible={progressVisible}
                 title="Loading"
                 message="Please, wait..."
      />

    <ConfirmDialog
      title="Time out"
      visible={timeOutConfirmation}
      positiveButton={{
        titleStyle: {color: "#41749b"},
        title: "Confirm",
        onPress: () => handleAttendanceTimeOutSubmit()
      }} 

      negativeButton={{
        titleStyle: {color: "#41749b"},
        title: "Cancel",
        onPress: () => setTimeOutConfirmation(false)
      }}
      >
  
      <View>
        <Text style={{marginBottom: 20,alignSelf: 'flex-start', fontSize: 15,  color:'#000000'}}>
         Please input your Assigned Parcels
        </Text>
        <TextInput 
            mode="outlined"
            placeholderTextColor="#76ABAE" 
            theme={{
              colors: {
                    text: 'white',
                 }
           }}
            style={{textAlign:"left", width: "100%"}}
            onChangeText={inputText => setAssignedParcel(inputText)}
            defaultValue={assignedParcel}
            keyboardType="number-pad"
            maxLength={4}     />   
      </View>
    </ConfirmDialog>


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
       {connection? 
       <View>
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
       :
       <View style={{alignItems:"center"}}>
        <Image
                source={
                    require('../../assets/no-network-256.png')
                }
                
                style={{marginTop: 5, height:150, width:150}}
              />
        <Text style={styles.textNoConnection}>No Internet Connection</Text>
       </View>
       
       }
      </View>  

     
     </View>

    {status === "time_in" &&(
      <View style={styles.button}>
      <TouchableOpacity 
       style={styles.timeButton}
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
      style={styles.timeButton}
      onPress={() => handleAttendanceTimeOutSubmit()}
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

  {status === "no_internet" &&(

  <View>
 
    </View>
    )
  }

     </ScrollView>

  

 

     </SafeAreaView>

    );

}

export default AttendanceScreen;

const styles = StyleSheet.create({
    title:{
      color:'#000'
    },
    viewStyle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    textNoConnection: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10
      
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
      marginTop: 5,
      alignItems: 'center',
      textAlign: 'center',
      marginHorizontal: "3.5%",
    },
    timeButton: {
      width: '100%',
      backgroundColor: '#420475',
      alignItems: 'center',
      // marginTop: -320,
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
  title:{
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
