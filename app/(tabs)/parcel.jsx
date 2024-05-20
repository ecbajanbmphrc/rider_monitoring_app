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


function ParcelScreen() {

  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["40%"];
  const [isOpen, setIsOpen] = useState(false);
  const [countItem, setCountItem] = useState(1);

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [retrieveData, setRetrieveData] = useState('');

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Non-bulk', value: 'Non-bulk'},
    {label: 'Bulk', value: 'Bulk'}
  ]);
  const [selectType , setSelectType] = useState('');

  useFocusEffect(
    useCallback(() => {
     retrieveParcelData();
    }, [])
  );


  const Item = ({item}) => {
    
    console.log(item.parcel_count);
    setCountItem(item.parcel_count + 1);
    return(
       
      <Card style = {{ padding: 16, margin: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>


        {item.parcel_type === 'Bulk' && (
            <Icon name='package-variant-closed' size={30} color="#000000"/>  
        )}

        {item.parcel_type === 'Non-bulk' && (
            <Icon name='archive-outline' size={30} color="#000000"/>  
        )}
        

          <View style={{marginLeft:10}}>
            <Text style={styles.title}>Parcel # {item.parcel_count}</Text> 
            <Text style={styles.title}>{item.parcel_type}</Text>
          </View>
          
        </View>
        
      </Card>
        
     
    );
  }
 


  async function handleParcelSubmit(){
    const data = await AsyncStorage.getItem('email');

    if(!selectType) return Alert.alert("Please select parcel type!")
  

    const parcelData = {
        user: data,
        date: currentDateTime.toLocaleString('en-us',{month:'numeric', day:'numeric' ,year:'numeric'}),    
        parcel_count: countItem,
        parcel_type: selectType
    };  
  
 
    
    Alert.alert('Corfirmation:', 'You are about to input your parcel!', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'Confirm', onPress: () =>
        
          
      axios
      .put("https://rider-monitoring-app-backend.onrender.com/parcel-input", parcelData)
      .then(res => {console.log(res.data)
       

      if(res.data.status == 200){
        Alert.alert("Parcel recorded successfully!");
        retrieveParcelData()
        bottomSheetModalRef.current?.close()
      
       }else{    
        Alert.alert("Parcel creation failed",JSON.stringify(res.data.data), [
          {
              text: 'OK'
          }
        ]);
       }
       

      })
      .catch(e => console.log(e))
  
    },
    ]);
    
        
             
  }

  async function retrieveParcelData(){

    const email = await AsyncStorage.getItem('email');

    axios.post("https://rider-monitoring-app-backend.onrender.com/retrieve-parcel-input", {user: email})
    .then(
      async res => {
        setRetrieveData( res.data.data[0].parcel);

      })
    .catch(e => {
      console.log(e);
    })  
  }


  function handlePopUpModal(){
    setIsOpen(true);
    bottomSheetModalRef.current?.present();
  }
    return (
     <BottomSheetModalProvider>

      <View style={{
        flex: 1,
        backgroundColor: isOpen ? "gray" : "#f2f2f2"
       }}>

      <View style={styles.container}>
        <FlatList
          data={retrieveData}
          renderItem={Item}
          keyExtractor={item => item.id}
        />
      </View>
      
   
       
     

       <TouchableOpacity
        style={styles.circle}
        onPress={() => {
          handlePopUpModal()
          }}
        >
         <Icon name='package-variant-closed' size={30} color="#FFFFFF"/> 
            
       </TouchableOpacity>
        <BottomSheetModal
         ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{
            borderRadius: 25
          }}
          onDismiss={() => setIsOpen(false)}
          >
          <View style={styles.modalStyle}>
            <Text>
              Parcel number 1
            </Text>

            <View style={{marginTop:10}}/>

            <DropDownPicker
             open={open}
             value={value}
             items={items}
             setOpen={setOpen}
             setValue={setValue}
             onSelectItem={(item) => {
              console.log(item.value);
              setSelectType(item.value);
            }}
            />

            <View style={{marginTop:10}}/>

            <TouchableOpacity 
             style={styles.submitButton}
             onPress={() => handleParcelSubmit() }
            >
             <View>
              <Text style={styles.textSign}>
                  Submit
              </Text>
             </View>
           </TouchableOpacity>
           
          

          </View>
        </BottomSheetModal>
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
    backgroundColor: "blue",
    color: "white",
    padding: 2,
    margin: 2,
  },

  container : {
    flex: 1,
    justifyContent: 'center'
  }
 
    
  });