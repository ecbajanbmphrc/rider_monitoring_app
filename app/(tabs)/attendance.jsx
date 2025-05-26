import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
const { Alert, Image} = require('react-native');
import React, { useState, useEffect } from 'react';
const {Text, StyleSheet, View, SafeAreaView, Dimensions, TouchableOpacity} = require('react-native');
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import * as Location from 'expo-location';
import { ProgressDialog, ConfirmDialog, Dialog } from 'react-native-simple-dialogs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { useWindowDimensions } from 'react-native';
import { useRouter } from "expo-router";
import {DotIndicator} from 'react-native-indicators';
import NetInfo from "@react-native-community/netinfo";
import moment from 'moment';




function AttendanceScreen() {

  
  const router = useRouter();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [userEmail, setUserEmail] = useState('');
  const [timeIn, setTimeIn] = useState('-----');
  const [timeOut, setTimeOut] = useState('-----');
  const [status, setStatus] = useState('');
  const [connection, setConnection] = useState(true);
  const { width } = useWindowDimensions();
  const smallerSize = width - width *.20;

  const [timeInAddress, setTimeInAddress] = useState('');
  const [timeOutAddress, setTimeOutAddress] = useState('');
  const [progressVisible, setProgressVisible] = useState(false);
  const [inputTimeInModal, setInputTimeInModal] = useState(false);
  const [screenshot, setScreenshot] = useState('');
  const [viewScreenshot, setViewScreenshot] = useState(null);
  const [loadAttendance, setLoadAttendance] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [checkValid, setCheckValid] = useState(false);

  const apiHost = process.env.EXPO_PUBLIC_API_URL;

  const [refresh, setRefresh]  = useState(false); 

  async function onRefresh(){

     setPageLoading(true)  
  
  const data = await AsyncStorage.getItem('email');
 

   var net;

    await NetInfo.fetch().then(async state => {

    state.isInternetReachable? net = true : net = false;
   
    })

    
    if(!net){ 
       setStatus(null)
       setPageLoading(false)
       setLoadAttendance(false)
       return
    }


  setUserEmail(data);
  
  axios.get( `${apiHost}/retrieve-user-attendance` ,  {params: {user: data}})
  .then(

  async res => {
  



  if(res.data.status === 400){
    setLoadAttendance(true);
    setStatus("time_in");
    setTimeIn('-----');
    setTimeOut('-----');
    setTimeInAddress('');
    setTimeOutAddress('');
  }
  else if (res.data.status === 200){
    
    if(!res.data.data.time_out){
     
      setLoadAttendance(true);
      try{
        const timeInAddress = await Location.reverseGeocodeAsync({"latitude" : parseFloat(res.data.data.time_in_coordinates.latitude) , "longitude" : parseFloat(res.data.data.time_in_coordinates.longitude)});
        const time_in_street = timeInAddress[0].street ? timeInAddress[0].street : timeInAddress[0].subregion;
        const time_in_city_and_street = timeInAddress[0].city + ", " +   time_in_street;
        setTimeInAddress(time_in_city_and_street);
      }catch{
    
        setTimeInAddress("-----")
      }
      setTimeIn(res.data.data.time_in);
      setTimeOut('-----');
      setTimeOutAddress('');
      setStatus('time_out')
    }else{
      setLoadAttendance(true);
      try{
        
        const timeInAddress = await Location.reverseGeocodeAsync({"latitude" : parseFloat(res.data.data.time_in_coordinates.latitude) , "longitude" : parseFloat(res.data.data.time_in_coordinates.longitude)});
        const time_in_street = timeInAddress[0].street ? timeInAddress[0].street : timeInAddress[0].subregion;
        const time_in_city_and_street = timeInAddress[0].city + ", " +   time_in_street;

        console.log(time_in_city_and_street)

        setTimeInAddress(time_in_city_and_street);

        const timeOutAddress = await Location.reverseGeocodeAsync({"latitude" : parseFloat(res.data.data.time_out_coordinates.latitude) , "longitude" : parseFloat(res.data.data.time_out_coordinates.longitude)});
        const time_out_street =timeOutAddress[0].street ? timeOutAddress[0].street : timeOutAddress[0].subregion;
        const time_out_city_and_street = timeOutAddress[0].city + ", " +  time_out_street;
        setTimeOutAddress(time_out_city_and_street);
    

      }catch{
        setTimeInAddress("-----")
        setTimeOutAddress("-----");
      }
      setTimeIn(res.data.data.time_in);
  
      setTimeOut(res.data.data.time_out);

       
    const dataDate =  res.data.data.date;
    const dataTimeIn = res.data.data.time_in;
    const dataTimeOut = res.data.data.time_out;

    const testDate = (moment(`${dataDate} ${dataTimeOut}` , "MM-DD-YYYY hh:mm:ss A").valueOf()) - (moment(`${dataDate} ${dataTimeIn}` , "MM-DD-YYYY hh:mm:ss A").valueOf()) ;
 
    

    if(testDate >= 14400000)
    {
     setCheckValid(false);
     setStatus('done')
    }else{
     setCheckValid(true);
     setStatus('invalid')
    }
      
    }
    
  }
  
  setPageLoading(false)

  })
  .catch(e => {
    console.log(e)
    
    setTimeIn('-----');
    setTimeOut('-----');
    setTimeInAddress('');
    setTimeOutAddress('');
    setStatus('no_internet');
    setLoadAttendance(true);
    setPageLoading(false)
   
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


  const pickImageScreenshot = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.1,
      selectionLimit: 5
    });
    if (!result.canceled) {
        setViewScreenshot(result.assets[0].uri)
        setScreenshot(result.assets[0].base64)
    }


  
  };

  function handleInputTimeOut(){
    router.push('/pages/parcelInput');
  }

  function handleTimInClose(){
    setInputTimeInModal(false)
    setViewScreenshot(null)
    setScreenshot([])
  }

  async function handleAttendanceTimeInSubmit(){
    const user_id = await AsyncStorage.getItem('id');
    const email  = await AsyncStorage.getItem('email');
    var currentLocation;
   
    try{
    let { status } = await Location.requestForegroundPermissionsAsync();
      setProgressVisible(true) 
      if(status !== 'granted'){
          console.log("Please grant location permissions");
          setProgressVisible(false) 
          return
      }else{
        currentLocation = await Location.getCurrentPositionAsync({});
      }

 

    }catch{
      currentLocation = null;
    }

  //  const handleLocationUpdate = (locationResult) => { console.log(locationResult); this.setState({ locationCallbackResult: locationResult }); }

  //  console.log(handleLocationUpdate);

  // requestLocationCallbackWithListener = () => {
  //   HMSLocation.FusedLocation.Native.requestLocationUpdatesWithCallbackEx(locationRequest)
  //   .then((res) => this.setState({ reqCode: res.requestCode }))
  //   .catch((err) => alert(err.message));
  //   HMSLocation.FusedLocation.Events.addFusedLocationEventListener(this.handleLocationUpdate);
  //   this.setState({ autoUpdateEnabled: true });
  // };

    
      
  
    const fd = new FormData()
    const time_in_coordinates = {
      latitude: currentLocation ? currentLocation.coords.latitude : null,
      longitude: currentLocation ? currentLocation.coords.longitude : null
    }

    const time_out_coordinates = {
      latitude: '',
      longitude: ''
    }

    fd.append('user', email)
    fd.append('id', user_id)
    fd.append('time_in_coordinates', JSON.stringify(time_in_coordinates))
    fd.append('time_out_coordinates', JSON.stringify(time_out_coordinates))
    fd.append('assigned_parcel_screenshot', screenshot)

     
      axios
      .put(`${apiHost}/attendance-input-time-in`, fd)
      .then(res => {

       
  
       if(res.data.status == 200){
        setProgressVisible(false) 
        Alert.alert("Success","Attendance recorded successfully!");
        onRefresh();
        setViewScreenshot(null)
        setScreenshot([])
        setStatus('time_out')
       }
       else if(res.data.status == 412){
        setProgressVisible(false) 
        Alert.alert("Unable to proceed!", res.data.data);
        onRefresh();
        
        setViewScreenshot(null)
        setScreenshot([])
        setStatus('time_out')
       }
       else{    
        setProgressVisible(false) 
        Alert.alert("Attendance creation failed",JSON.stringify(res.data.data), [
          {
              text: 'OK'
          }
        ]);
       }
       

      })
      .catch(e => {console.log(e), setProgressVisible(false) })

      setInputTimeInModal(false)

    }
    
    return (
    <SafeAreaView style={{flex: 1 }}>
     <ScrollView refreshControl={<RefreshControl refreshing = {refresh} onRefresh={onRefresh}/>}>
     <View>
      
     <ProgressDialog
                 visible={progressVisible}
                 title="Loading"
                 message="Please, wait..."
      />
      {pageLoading?
               <View style={{alignItems: 'center', marginVertical: '75%'}}>
                 <DotIndicator
                   color= 'rgb(61, 61, 61)'
                   size =  {12}
                   count = {5}
                 />
                 </View>
                 :
     <View style={{flex:1, marginTop: 35}}>

     <Dialog
      visible={inputTimeInModal}
      title="Enter your assigned parcel:" 
      animationType='fade'>
    <View style={viewScreenshot? {height: 400} : {height : 120}}>
      <View>

      
      <TouchableOpacity 
                    style={cardStyles.inputImageButton}
                    onPress={pickImageScreenshot}
                    >
                        <View>
                        <Icon
                          name="image-plus"
                          size={25}
                          color="black"
                        />
                           
                        </View>
      </TouchableOpacity>

      {viewScreenshot !== null &&(
                <View style={cardStyles.imgPick}>
                
                        <View style={{marginTop : 20, marginVertical:5, alignItems : 'center' , alignContent : 'center' }}>
                            <Image
                         
                            source={{uri: viewScreenshot}}
                            style={{width: smallerSize, height: 250, borderWidth : 2,   borderColor: '#405D72',}}/>
                        

                        </View>
                         
                  
                </View>
                    )
                }

      </View>
      <View style={{flex:1, alignItems: 'flex-end' }}>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: '5%'}}>

      <TouchableOpacity 
       style={styles.confirmTimeInParcel}
       onPress={() => handleTimInClose() }
      >
          <View>
              <Text style={{ fontSize:15}}>
                  Cancel
              </Text>
          </View>
      </TouchableOpacity>

      <TouchableOpacity 
       style={styles.confirmTimeInParcel}
       onPress={() => handleAttendanceTimeInSubmit() }
      >
          <View>
          <Text style={{ fontSize:15}}>
                  Confirm
              </Text>
          </View>
      </TouchableOpacity>

      </View>
      </View>
    </View>
    </Dialog>


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

      <View style={[cardStyles.timeCardView,  {height: checkValid? 400 : 300}]}>

           {loadAttendance? 
       <View>
        <Text style={{marginTop: 1,alignSelf: 'center', fontSize: 35, fontWeight: '500',  color:'#000000'}}>
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
      {status === "invalid" &&(

     <View style={styles.warningCard}>
    
      <View>
        <Text style={styles.textWarning}>
            Note: Please validate your attendance to your supervisor.
        </Text>
      </View>
 
    </View>
   )
  }
      </View>
       :
       <View style={{alignItems:"center"}}>
        <Image
                source={
                    require('../../assets/no-network-256.png')
                }
                alt='this is image'
                
                style={{marginTop:'50%', height:150, width:150}}
              />
        <Text style={styles.textNoConnection}>No Internet Connection</Text>
       </View>
       
       }
    
      </View>

      {status === "time_in" &&(
      <View style={styles.button}>
      <TouchableOpacity 
       style={styles.timeButton}
       onPress={() => setInputTimeInModal(true) }
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
      onPress = {() => handleInputTimeOut()}
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

  
     {/* {status === "invalid" &&(

     <View>
    
    <View>
     <Text style={styles.textWarning}>
         Time Out
     </Text>
    </View>
 
  </View>
   )
  } */}

 <View style={{marginTop: 100}}>
   
  </View>

     
     </View>



   
  
    
}
  </View>

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
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 10,
      shadowColor: 'black',
      margin: 10,
      borderColor : 'black',
      elevation: 5
    },
    textSign: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
    },
     textWarning: {
      fontSize: 15,
      fontWeight: 'bold',
      color: 'red',
    },
     warningCard: {
      height: 120,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
      },
    confirmTimeInParcel: {
   
      marginHorizontal: 5
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
    borderTopEndRadius:10,
    borderTopStartRadius: 10,
    paddingHorizontal: 16,
    marginHorizontal: 16,
  },
  timeCardView:{
    width: '93%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset:{width: 0, height:0},
    shadowOpacity: 1,
    shadowRadius: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    borderColor: '#420475',
    borderBlockColor: '#420475',
  },
  inputImageButton: {
    width: '100%',
    backgroundColor: '#F5F7F8',
    height:'300px',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 25,
    borderRadius: 10,
    borderColor: '#405D72',
    borderWidth: 1,
},
imgPick: {
  alignItems: 'center',
  alignContent: 'center',
  marginTop: 1,
  marginBottom: 1,
},
})