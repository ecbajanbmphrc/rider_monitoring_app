const {View, Text,Image, TouchableOpacity, ScrollView, Alert, StyleSheet} = require('react-native');
import styles from '../auth/style';
import { Card, TextInput } from 'react-native-paper';
import { useState } from 'react';
import { CheckBox } from '@rneui/themed';
import * as React from "react";
import axios from 'axios';
import { useRouter} from 'expo-router';
import { ProgressDialog } from 'react-native-simple-dialogs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { launchImageLibrary } from 'react-native-image-picker';
// import * as ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { FlatList, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



function  ParcelInput({props}){
    const [image, setImage] = useState([]);
    const { width } = useWindowDimensions();
    const smallerSize = width - width *.20;
    const [parcelNonBulk, setParcelNonBulk] = useState('');
    const [parcelNonBulkVerify, setParcelNonBulkVerify] = useState(false);
    const [parcelBulk, setParcelBulk] = useState('');
    const [parcelBulkVerify, setParcelBulkVerify] = useState(false);
    const [assignedParcelVerify, setAssignedParcelVerify] = useState(false);
    const [receipt, setReceipt] = useState([]);
    const [viewReceipt, setViewReceipt] = useState([]);
    const [screenshot, setScreenshot] = useState('');
    const [viewScreenshot, setViewScreenshot] = useState(null);
    const [remainingParcel, setRemainingParcel] = useState('0');
    const [totalParcel, setTotalParcel] = useState('0');

    const [assignedParcelNonBulk, setAssignedParcelNonBulk] = useState('');
    const [assignedParcelNonBulkVerify, setAssignedParcelNonBulkVerify] = useState(false);
    const [assignedParcelBulk, setAssignedParcelBulk] = useState('');
    const [assignedParcelBulkVerify, setAssignedParcelBulkVerify] = useState(false);
    const [assignedParcelTotal, setAssignedParcelTotal] = useState('0');

    const [deliveredParcelNonBulk, setDeliveredParcelNonBulk] = useState('');
    const [deliveredParcelNonBulkVerify, setDeliveredParcelNonBulkVerify] = useState(false);
    const [deliveredParcelBulk, setDeliveredParcelBulk] = useState('');
    const [deliveredParcelBulkVerify, setDeliveredParcelBulkVerify] = useState(false);
    const [deliveredParcelTotal, setDeliveredParcelTotal] = useState('0');

    const pickImageReceipt = async () => {
        let imageList = [];
        let viewImageList = [];
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          base64: true,
        //   aspect: [4, 3],
          quality: 0.5,
          selectionLimit: 5
        });

     
        if(result.assets !== null){
            result.assets.forEach(function (item, index){
                if(item[index] != null){
                // imageList.push(item.uri);
                // imageList.push(item.base64);
            //     setFilePathArray(filePathArray => [...filePathArray, imageList]);    
                }
            //  let test =  Buffer.from(item.base64, 'base64');
                imageList.push(item.base64);
                viewImageList.push(item.uri);
            //  setImage(item.uri);
            });
        }    
        if (!result.canceled) {
            setViewReceipt(viewImageList);
            setReceipt(imageList);
        }

        console.log(width)
    };


    const pickImageScreenshot = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          base64: true,
          quality: 0.1,
          selectionLimit: 5
        });
        if (!result.canceled) {
            setViewScreenshot(result.assets[0].uri)
            setScreenshot(result.assets[0].base64);
        }


      
    };



   
 
    const router = useRouter();
    const [progressVisible, setProgressVisible] = useState(false);

  

    async function handleSubmit(){

        if(parseInt(assignedParcelTotal) < 1){
            Alert.alert("Unable to proceed","Please input your assigned parcel!", [
                {
                    text: 'OK'
                }
              ]);
            return
        }
        else if(parseInt(deliveredParcelTotal) < 1){
            Alert.alert("Unable to proceed","Please input your delivered parcel!", [
                {
                    text: 'OK'
                }
              ]);
            return
        }
        else if(parseInt(deliveredParcelNonBulk) > parseInt(assignedParcelNonBulk)){
            Alert.alert("Unable to proceed","Delivered Non-Bulky must not be greater than assigned Non-Bulky!", [
                {
                    text: 'OK'
                }
              ]);
            return
        }
        else if(parseInt(deliveredParcelBulk) > parseInt(assignedParcelBulk)){
            Alert.alert("Unable to proceed","Delivered Bulky must not be greater than assigned Bulky!", [
                {
                    text: 'OK'
                }
              ]);
            return
        }
        else if(parseInt(remainingParcel) < 0){
            Alert.alert("Unable to proceed","Remaining parcel must be non-negative!", [
                {
                    text: 'OK'
                }
              ]);
            return 
        }
        else if(viewReceipt.length === 0){
            Alert.alert("Unable to proceed","Please input your photo of remittance's receipt!", [
                {
                    text: 'OK'
                }
              ]);
            return  
        }
        else if(viewScreenshot === null){
            Alert.alert("Unable to proceed","Please input your screenshot in SPX app!", [
                {
                    text: 'OK'
                }
              ]);
            return  
        }


        if((parseInt(deliveredParcelNonBulk? deliveredParcelNonBulk: 0) > 0) && (parseInt(assignedParcelNonBulk? assignedParcelNonBulk : 0) === 0) ){
            Alert.alert("Unable to proceed","You don't have assigned non-bulky parcel!", [
                {
                    text: 'OK'
                }
              ]);
            return    
        }
        else if((parseInt(deliveredParcelBulk? deliveredParcelBulk: 0) > 0) && (parseInt(assignedParcelBulk? assignedParcelBulk : 0) === 0 )){
            Alert.alert("Unable to proceed","You don't have assigned bulky parcel!", [
                {
                    text: 'OK'
                }
              ]);
            return    
        }
    


        const data = await AsyncStorage.getItem('id');
        const email = await AsyncStorage.getItem('email');    
        
 
        
        const fd = new FormData()

        fd.append('user' , data)
        fd.append('email' , email)
        fd.append('assigned_parcel_non_bulk_count', assignedParcelNonBulk? assignedParcelNonBulk : 0)
        fd.append('assigned_parcel_bulk_count', assignedParcelBulk? assignedParcelBulk : 0)
        fd.append('assigned_parcel_total', assignedParcelTotal)
        fd.append('delivered_parcel_non_bulk_count', deliveredParcelNonBulk?  deliveredParcelNonBulk : 0)
        fd.append('delivered_parcel_bulk_count', deliveredParcelBulk? deliveredParcelBulk : 0)
        fd.append('delivered_parcel_total', deliveredParcelTotal)
        fd.append('remaining_parcel', remainingParcel)
        fd.append('screenshot', screenshot)
        receipt.forEach(receipt => {
            fd.append(
                "receipt",receipt
            ); });

           


            
        Alert.alert('Confirmation:', 'You are about to input your parcel!', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {text: 'Confirm', onPress: () =>
            {
            setProgressVisible(true)    
            axios
            .post("https://rider-monitoring-app-backend.onrender.com/parcel-input", fd)
            .then(res => {
             
       
            if(res.data.status == 200){
                setProgressVisible(false)    
                Alert.alert("Success!","Parcel recorded successfully.");
                // router.replace('/(tabs)/dashboard');
                router.back();
            
             }else{    
              setProgressVisible(false)  
              Alert.alert("Parcel creation failed",JSON.stringify(res.data.data), [
                {
                    text: 'OK'
                }
              ]);
             }
             
      
            })
            .catch(e => {console.log(e), setProgressVisible(false),  Alert.alert("Error!" , "Parcel creation failed") })
           }
          },
          ]);
        
    }

    function handleAssignedParcelNonBulk(e){
        const textVar = e.nativeEvent.text;
        setAssignedParcelNonBulk(textVar)
        setAssignedParcelNonBulkVerify(false);
        setAssignedParcelTotal(handleAssignedParcelTotal( textVar? textVar: 0, assignedParcelBulk? assignedParcelBulk: 0 ).toString());
        if(deliveredParcelTotal > 1){
            setRemainingParcel(handleRemainingParcel(deliveredParcelNonBulk? deliveredParcelNonBulk : 0, deliveredParcelBulk? deliveredParcelBulk : 0,  textVar? textVar : 0, assignedParcelBulk? assignedParcelBulk : 0).toString())
            }else{setRemainingParcel('0')}
        if(/\d+$/.test(textVar)){
            setAssignedParcelNonBulkVerify(true);
        }
       
        
    }


    function handleAssignedParcelBulk(e){
        const textVar = e.nativeEvent.text;
        setAssignedParcelBulk(textVar);
        setAssignedParcelBulkVerify(false);
        setAssignedParcelTotal((handleAssignedParcelTotal( assignedParcelNonBulk? assignedParcelNonBulk: 0, textVar? textVar: 0  )).toString());
        if(deliveredParcelTotal > 1){
            setRemainingParcel((handleRemainingParcel(deliveredParcelNonBulk? deliveredParcelNonBulk : 0, deliveredParcelBulk? deliveredParcelBulk : 0, assignedParcelNonBulk? assignedParcelNonBulk : 0, textVar? textVar : 0)).toString());
            }else{setRemainingParcel('0')}

        if(/([0-9])/.test(textVar)){
            setAssignedParcelBulkVerify(true);
        }

        
    }


    function handleDeliveredParcelNonBulk(e){
        const textVar = e.nativeEvent.text;
        setDeliveredParcelNonBulk(textVar);
        setDeliveredParcelNonBulkVerify(false);
        setDeliveredParcelTotal((handleDeliveredParcelTotal( textVar? textVar: 0, deliveredParcelBulk? deliveredParcelBulk: 0)).toString());
        if(assignedParcelTotal > 1){ 
            setRemainingParcel((handleRemainingParcel(textVar? textVar : 0, deliveredParcelBulk? deliveredParcelBulk : 0, assignedParcelNonBulk? assignedParcelNonBulk : 0, assignedParcelBulk? assignedParcelBulk : 0)).toString());
        }else{setRemainingParcel('0')}

        if(/([0-9])/.test(textVar)){
            setDeliveredParcelNonBulkVerify(true);
        }

        
    }


    function handleDeliveredParcelBulk(e){
        const textVar = e.nativeEvent.text;
        setDeliveredParcelBulk(textVar);
        setDeliveredParcelBulkVerify(false);
        setDeliveredParcelTotal((handleDeliveredParcelTotal( deliveredParcelNonBulk? deliveredParcelNonBulk: 0 , textVar? textVar: 0, )).toString());
        if(assignedParcelTotal > 1){
            setRemainingParcel((handleRemainingParcel(deliveredParcelNonBulk? deliveredParcelNonBulk : 0, textVar? textVar : 0, assignedParcelNonBulk? assignedParcelNonBulk : 0, assignedParcelBulk? assignedParcelBulk : 0)).toString());
        }else{setRemainingParcel('0')}    

            if(/([0-9])/.test(textVar)){
            setDeliveredParcelBulkVerify(true);
        }

        
    }




    function handleRemainingParcel(deliveredParcelNonBulk, deliveredParcelBulk, assignedParcelNonBulk, assignedParcelBulk){
            const value = (parseInt(assignedParcelNonBulk) + parseInt(assignedParcelBulk)) - (parseInt(deliveredParcelNonBulk) + parseInt(deliveredParcelBulk))
           
            if(value.toString() === "NaN") return 0
            
            return value
        
    }

    function handleAssignedParcelTotal(assignedParcelNonBulk, assignedParcelBulk){
           
            const value = parseInt(assignedParcelNonBulk) + parseInt(assignedParcelBulk) 
            
            if(value.toString() === "NaN") return 0

            return value
        
    }

    function handleDeliveredParcelTotal(deliveredParcelNonBulk, deliveredParcelBulk){

        const value = parseInt(deliveredParcelNonBulk) + parseInt(deliveredParcelBulk)

        if(value.toString() === "NaN") return 0

        return value
        
    }
  
    return(
      <ScrollView contentContainerStyle={{flexGrow: 2}} 
      showsVerticalScrollIndicator={true}
      style={{backgroundColor: 'white'}}>
        <View>
           
            <View style={styles.loginContainer}>
                <ProgressDialog
                 visible={progressVisible}
                 title="Loading"
                 message="Please, wait..."
                />

                <View style = {componentStyles.contentPadding}>
                    <View style={{margin: 10}}>
                    <Text style={{marginBottom: 10, fontWeight:'500'}}>Assigned Parcel :</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  
                    <TextInput 
                    mode="outlined"
                    keyboardType='numeric'
                    label="Non-Bulky"
                    placeholderTextColor="#76ABAE" 
                    onChange={e => handleAssignedParcelNonBulk(e)}
                    theme={{ roundness: 8 }}
                    maxLength={11}
                    right= { assignedParcelNonBulk.length < 1 ? null : assignedParcelNonBulkVerify ? (
                        <TextInput.Icon 
                        color="green"
                        icon="check" />
                    ) : (
                        <TextInput.Icon 
                        color="red"
                        icon="exclamation" />
                    )} 
                    style={{width: '49%'}}
                       
                    />  
                     <TextInput 
                    mode="outlined"
                    keyboardType='numeric'
                    placeholderTextColor="#76ABAE" 
                    label="Bulky"
                    onChange={e => handleAssignedParcelBulk(e)}
                    theme={{ roundness: 8 }}
                    maxLength={11}
                    right= { assignedParcelBulk.length < 1 ? null : assignedParcelBulkVerify ? (
                        <TextInput.Icon 
                        color="green"
                        icon="check" />
                    ) : (
                        <TextInput.Icon 
                        color="red"
                        icon="exclamation" />
                    )} 
                    style={{width: '49%' }}
                    /> 
                    </View>    

                    <View style={{  marginVertical: 10, marginLeft : '1%', alignContent : 'center'}}>
                        <View style={{flexDirection:'row'}}>
                            <Text>Total : </Text>
                            <TextInput 
                                mode="outlined"
                                keyboardType='numeric'
                                placeholderTextColor="#76ABAE" 
                                value={assignedParcelTotal}
                                maxLength={11}
                                outlineColor='#FFFFFF'
                                outlineStyle="none"
                                style={{ backgroundColor: '#FFFFFF', outlineStyle: 'none', height:20}}
                            readOnly            
                            /> 
                        </View>
                       
                    </View>   
                    </View>              
                   
                </View>


                <View style = {componentStyles.contentPadding}>
                    <View style={{margin: 10}}>
                    <Text style={{marginBottom: 10, fontWeight:'500'}}>Delivered Parcel :</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  
                    <TextInput 
                    mode="outlined"
                    keyboardType='numeric'
                    label="Non-Bulky"
                    placeholderTextColor="#76ABAE" 
                    onChange={e => handleDeliveredParcelNonBulk(e)}
                    theme={{ roundness: 8 }}
                    maxLength={11}
                    right= { deliveredParcelNonBulk.length < 1 ? null : deliveredParcelNonBulkVerify ? (
                        <TextInput.Icon 
                        color="green"
                        icon="check" />
                    ) : (
                        <TextInput.Icon 
                        color="red"
                        icon="exclamation" />
                    )} 
                    style={{width: '49%'}}
                       
                    />  
                     <TextInput 
                    mode="outlined"
                    keyboardType='numeric'
                    placeholderTextColor="#76ABAE" 
                    label="Bulky"
                    onChange={e => handleDeliveredParcelBulk(e)}
                    theme={{ roundness: 8 }}
                    maxLength={11}
                    right= { deliveredParcelBulk.length < 1 ? null : deliveredParcelBulkVerify ? (
                        <TextInput.Icon 
                        color="green"
                        icon="check" />
                    ) : (
                        <TextInput.Icon 
                        color="red"
                        icon="exclamation" />
                    )} 
                    style={{width: '49%' }}
                    /> 
                    </View>    

                    <View style={{  marginVertical: 10, marginLeft : '1%', alignContent : 'center'}}>
                        <View style={{flexDirection:'row'}}>
                            <Text>Total : </Text>
                            <TextInput 
                                mode="outlined"
                                keyboardType='numeric'
                                placeholderTextColor="#76ABAE" 
                                value={deliveredParcelTotal}
                                maxLength={11}
                                outlineColor='#FFFFFF'
                                outlineStyle="none"
                                style={{ backgroundColor: '#FFFFFF', outlineStyle: 'none', height:20}}
                            readOnly            
                            /> 

                            <Text>On Hold : </Text>
                            <TextInput 
                                mode="outlined"
                                keyboardType='numeric'
                                placeholderTextColor="#76ABAE" 
                                value={remainingParcel}
                                maxLength={11}
                                outlineColor='#FFFFFF'
                                outlineStyle="none"
                                style={{ backgroundColor: '#FFFFFF', outlineStyle: 'none', height:20}}
                            readOnly            
                            /> 
                        </View>
                       
                    </View>   
                    </View>              
                   
                </View>

                <View style = {componentStyles.contentPadding}>
                <View style={{margin: 10}}>
                <View style={componentStyles.button}>
                    <Text style={{marginBottom: 10, fontWeight:'500'}}>Photo of Remittance's Receipt :</Text>
                    <TouchableOpacity 
                    style={componentStyles.loginButton}
                    onPress={pickImageReceipt}
                    >
                        <View>
                        <Icon
                          name="image-plus"
                          size={35}
                          color="black"
                        />
                           
                        </View>
                    </TouchableOpacity>
                </View>
                {viewReceipt.length !== 0 &&(
                <View style={componentStyles.imgPick}>
                    <FlatList
                    data={viewReceipt}
                    scrollEnabled={false}
                    renderItem={({ item }) =>(
                        <View style={{marginVertical:5, alignItems : 'center' , alignContent : 'center' }}>
                            <Image
                         
                            source={{uri: item}}
                            style={{width: smallerSize, height: 500, borderWidth : 2,   borderColor: '#405D72',}}/>
                        

                        </View>
                         
                     )}
                    keyExtractor={(item) => item}
                    contentContainerStyle={{ marginVertical: 20, paddingBottom: 10, width:'50%',alignItems : 'center', marginHorizontal: 10}}
                    />
                </View>
                    )
                }
                </View>

            </View>    


            <View style = {componentStyles.contentPadding}>
                <View style={{margin: 10}}>
                <View style={componentStyles.button}>
                    <Text style={{marginBottom: 10, fontWeight:'500'}}>SPX screenshot :</Text>
                    <TouchableOpacity 
                    style={componentStyles.loginButton}
                    onPress={pickImageScreenshot}
                    >
                        <View>
                        <Icon
                          name="image-plus"
                          size={35}
                          color="black"
                        />
                           
                        </View>
                    </TouchableOpacity>
                </View>
                {viewScreenshot !== null &&(
                <View style={componentStyles.imgPick}>
                
                        <View style={{marginTop : 20, marginVertical:5, alignItems : 'center' , alignContent : 'center' }}>
                            <Image
                         
                            source={{uri: viewScreenshot}}
                            style={{width: smallerSize, height: 500, borderWidth : 2,   borderColor: '#405D72',}}/>
                        

                        </View>
                         
                  
                </View>
                    )
                }
                </View>

            </View>  

            </View>
            

                <View style={styles.button}>
                    <TouchableOpacity 
                    style={styles.loginButton}
                    onPress={() => {
                       
                        handleSubmit()
                    }}>
                        <View>
                            <Text style={styles.textSign}>
                                Submit
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
        </View>
       </ScrollView>
    );
}

const componentStyles = StyleSheet.create({
   
    button: {
        alignItems: 'center',
     
     
        textAlign: 'center',
    
        borderColor: '#FF4E88',
    },

    imgPick: {
        alignItems: 'center',
        alignContent: 'center',
        marginTop: 1,
        marginBottom: 1,
           // margin: 20,
    },

    loginButton: {
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

    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },

    contentPadding: {
        paddingTop: 10,
        paddingBottom: 1,
        borderColor: '#FF4E88',
        borderWidth : 3,
        marginVertical: 10
        
    }



})



export default ParcelInput;