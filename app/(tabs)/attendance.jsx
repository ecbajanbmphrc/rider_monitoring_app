const { Alert} = require('react-native');
import React, { useState, useEffect } from 'react';
const {Text, StyleSheet, View, SafeAreaView, Dimensions, TouchableOpacity} = require('react-native');
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
function AttendanceScreen() {

  

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [timeSeconds, setTimeSeconds] = useState('');
  const [timeMonth, setTimeMonth] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [timeIn, setTimeIn] = useState('-----');
  const [timeOut, setTimeOut] = useState('-----');
  const [status, setStatus] = useState('time_in');
  const [test, setTest] = useState('');

  const [refresh, setRefresh]  = useState(false); 

  async function onRefresh(){
  
  const data = await AsyncStorage.getItem('email');

  setUserEmail(data);
  axios.post("http://192.168.50.139:8082/retrieve-user-attendance" , {user: data})
  .then(res => {
 
  setTimeIn(res.data.data.time_in);
  setStatus('time_out')

  if(res.data.data.time_out){
    setTimeOut(res.data.data.time_out);
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
    setStatus('time_in');
    })
  };

  

  useEffect(() => { 
   
   onRefresh();
  }, []);



  useEffect(() => {
  
  const timer = setInterval (() => {{
    setCurrentDateTime(new Date())
    }
    {
    setTimeMonth(new Date().getDay())
    }
   }
    ,1000)

  return()=> clearInterval(timer)

  }, [])

  function handleAttendanceTimeInSubmit(){

    const attendanceData = {
        user: userEmail,
        w_date: currentDateTime.toLocaleString(),
        date: currentDateTime.toLocaleString('en-us',{month:'numeric', day:'numeric' ,year:'numeric'}),
        time_in: currentDateTime.toLocaleString('en-us',{hour:'numeric', minute:'numeric', second:'numeric'}),
        time_out: ''
    };  
    
    
    Alert.alert('Corfirmation:', 'You are about to input your time in!', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'Confirm', onPress: () =>  axios
      .post("http://192.168.50.139:8082/attendance-input-time-in", attendanceData)
      .then(res => {console.log(res.data)

      if(res.data.status == 200){
        Alert.alert("Attendance recorded successfully!");
        onRefresh();
        setStatus('time_out')
       }else{    
        Alert.alert("Attendance creation failed",JSON.stringify(res.data.data), [
          {
              text: 'OK'
          }
        ]);
       }
       

      })
      .catch(e => console.log(e))},
    ]);
    
        
             
  }


  function handleAttendanceTimeOutSubmit(){

    time_out_input = currentDateTime.toLocaleString('en-us',{hour:'numeric', minute:'numeric', second:'numeric'}),

    Alert.alert('Corfirmation:', 'You are about to input your time out!', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'Confirm', onPress: () =>  axios
      .put("http://192.168.50.139:8082/attendance-input-time-out", {user: userEmail, time_out : time_out_input })
      .then(res => {console.log(res.data)

      if(res.data.status == 200){
        Alert.alert("Attendance recorded successfully!");
        onRefresh();
        setStatus('done')
       }else{    
        Alert.alert("Attendance creation failed",JSON.stringify(res.data.data), [
          {
              text: 'OK'
          }
        ]);
       }
       

      })
      .catch(e => console.log(e))},
    ]);
    
        
             
  }

    return (
    <SafeAreaView style={{flex: 1}}>
     <ScrollView refreshControl={<RefreshControl refreshing = {refresh} onRefresh={onRefresh}/>}>
     <View style={{flex:1, marginTop: 35}}>

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

// const cardStyles = StyleSheet.create({
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     paddingHorizontal: 80,
//     paddingVertical: 80
//   },
//   card: {
//     width: 380,
//     height: 120,
//     borderRadius: 15,
//     marginVertical: 5,
//     marginHorizontal: 16
//   },
//   cardElevated: {
//     backgroundColor: '#FFFFFF',
//     color: '#000000'
//   },
//   cardImage:{
//     height: 180
//   },
//   cardBody: {},
//   cardTitle: {},
//   cardLabel: {},
//   cardDescription: {},
//   cardFooter: {}
// });  

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
