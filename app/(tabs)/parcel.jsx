import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import React, { useState } from 'react';
const { Image, Text, StyleSheet, View, TouchableOpacity, Alert, FlatList} = require('react-native');
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  BottomSheetModal,
  BottomSheetModalProvider
} from "@gorhom/bottom-sheet";
import { useRef } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Card } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { useRouter } from "expo-router";



function ParcelScreen() {

  const router = useRouter();

  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["35%"];
  const [isOpen, setIsOpen] = useState(false);
  const [countItem, setCountItem] = useState(1);
  const [refresh, setRefresh]  = useState(false); 

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [retrieveData, setRetrieveData] = useState('');

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const [selectType , setSelectType] = useState('');
  const [progressVisible, setProgressVisible] = useState(false);
  const [inputNow , setInputNow] = useState(true);

 
 


  const Item = ({item}) => {


    return(
       
      <Card style = {{ padding: 15, margin: 15}}   >
        
        

        <View style={{flexDirection: 'row', alignItems: 'center'}}>

        <ProgressDialog
                 visible={progressVisible}
                 title="Loading"
                 message="Please, wait..."
        />

        

      <View style={{marginLeft:10}}>

            <Text style={styles.title}>{item.weekday}</Text> 
            <Text style={styles.item}>Non-Bulk : {item.parcel_non_bulk_count}   Bulk : {item.parcel_bulk_count}    Total : {item.total_parcel}</Text>
            <Text style={styles.item}>Assigned : {item.assigned_parcel_count}   Remaining : {item.remaining_parcel}</Text>
            <View style={{width: '40%',  alignItems: 'center', flexDirection: 'row', marginTop: 10}} paddingHorizontal={true}> 
              <TouchableOpacity style={styles.itemButtonR} onPress={() => {   handleViewReceipt(item.receipt) }}>
       
               <Text style={{color:'white', fontSize: 13}}>View Receipt</Text>
          
              </TouchableOpacity>
              <TouchableOpacity style={styles.itemButtonS} onPress={() => { handleViewScreenshot(item.screenshot) }}>

               <Text style={{color:'white', fontSize: 13}}>View Screenshot</Text>

              </TouchableOpacity>
            </View>
          </View>
          
        </View>
        
      </Card>
        
     
    );
  }

  useFocusEffect(
    useCallback(() => {

      retrieveParcelData();
    },[])
  );


  async function retrieveParcelData(){

    const email = await AsyncStorage.getItem('email');
    
    axios.post("https://rider-monitoring-app-backend.onrender.com/retrieve-parcel-input", {user: email})
    .then(
      async res => {
       
        if(res.data.data[0].parcel.length > 0){
        setRetrieveData( res.data.data[0].parcel);

        const dataLength = res.data.data[0].parcel.length
        

        if(res.data.data[0].parcel[dataLength-1].weekday !== res.data.weekday){
          setInputNow(false)
         
        }
        else{
          setInputNow(true)
        }
      }else{
        setInputNow(false)
      }
      })
    .catch(e => {
      console.log(e);
    })  
  }

  



  function handlePopUpModal(){
    router.push('/pages/parcelInput');
  }
  function handleViewReceipt(selectReceipt){
    router.push({pathname:'/pages/parcelImageReceipt', params:{receipt: JSON.stringify(selectReceipt)}});
  }
  function handleViewScreenshot(selectScreenshot){
    router.push({pathname:'/pages/parcelImageScreenshot', params:{screenshot: selectScreenshot}});
  }
    return (
     <BottomSheetModalProvider>

      <View style={{
        flex: 1,
        backgroundColor: isOpen ? "gray" : "#f2f2f2"
       }}
       >
      {retrieveData.length !== 0 &&(
      <View style={styles.container}>
        <FlatList
          data={retrieveData}
          renderItem={Item}
          keyExtractor={item => item.w_date}
        
        />
      </View>
       )
      }  
       {retrieveData.length === 0 &&(
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <Text>No Data Available</Text>
            </View>

       )
      }

   
       {inputNow?
       <></>
       :
       <TouchableOpacity
       style={styles.circle}
       onPress={() => {
         handlePopUpModal()
         }}
       >
        <Icon name='package-variant-closed' size={30} color="#FFFFFF"/> 
           
      </TouchableOpacity>
     
        }
      </View>
     </BottomSheetModalProvider>
        
    );
}

export default ParcelScreen;

const styles = StyleSheet.create({
  circle: {
      backgroundColor: '#420475',
      width: 60,
      height: 60,
      position: 'absolute',
      bottom: 40,
      right: 40,
      borderRadius:50,
      justifyContent: 'center',
      alignItems: 'center'
   },

   itemButtonR: {
    backgroundColor: '#420475',
    width: '100%',
    borderRadius:20,
    padding: 5,
    alignItems: 'center'
 },

 itemButtonS: {
  backgroundColor: '#420475',
  width: '100%',
  borderRadius:20,
  marginLeft: 10,
  padding: 5,
  alignItems: 'center'
},

  modalStyle: {
      marginLeft:50,
      marginRight:50
  },

  submitButton: {
    width: '100%',
    backgroundColor: '#420475',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
  },

  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  item: {
    padding: 2,
    margin: 2,
  },

  title: {
    
    color: "black",
    fontWeight: 'bold',
    fontSize: 15,
    padding: 2,
    margin: 2,
  },

  container : {
    flex: 1,
    justifyContent: 'center',

  }
 
    
  });