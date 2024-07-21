const {View, Text,Image, TouchableOpacity, ScrollView, Alert, StyleSheet} = require('react-native');
import styles from '../auth/style';
import { TextInput } from 'react-native-paper';
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
    const [assignedParcel, setAssignedParcel] = useState('');
    const [assignedParcelVerify, setAssignedParcelVerify] = useState(false);
    const [receipt, setReceipt] = useState([]);
    const [viewReceipt, setViewReceipt] = useState([]);
    const [screenshot, setScreenshot] = useState('');
    const [viewScreenshot, setViewScreenshot] = useState(null);
    const [remainingParcel, setRemainingParcel] = useState('0');
    const [totalParcel, setTotalParcel] = useState('0');

    const pickImageReceipt = async () => {
        let imageList = [];
        let viewImageList = [];
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          base64: true,
        //   aspect: [4, 3],
          quality: 0.1,
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

        if(parseInt(totalParcel) < 1){
            Alert.alert("Unable to proceed","Please input your parcel!", [
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
            Alert.alert("Unable to proceed","Please input your photo of remittance receipt!", [
                {
                    text: 'OK'
                }
              ]);
            return  
        }
        else if (viewScreenshot === null){
            Alert.alert("Unable to proceed","Please input your screnshot of daily delivered parcel!", [
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
        fd.append('parcel_non_bulk_count', parcelNonBulk)
        fd.append('parcel_bulk_count', parcelBulk)
        fd.append('assigned_parcel_count', assignedParcel)
        fd.append('screenshot', screenshot)
        fd.append('total_parcel', totalParcel)
        fd.append('remaining_parcel', remainingParcel)
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


    function handleBulkParcel(e){
        const textVar = e.nativeEvent.text;
        setParcelBulk(textVar);
        setParcelBulkVerify(false);
        if(remainingParcel !== '') setRemainingParcel((handleRemainingParcel(assignedParcel? assignedParcel: 0, parcelNonBulk? parcelNonBulk : 0, textVar? textVar : 0)).toString());
        setTotalParcel((handleTotalParcel(  parcelNonBulk?  parcelNonBulk: 0, textVar? textVar: 0)).toString());
        if(/([0-9])/.test(textVar)){
            setParcelBulk(textVar)
            setParcelBulkVerify(true);
        }

        
    }

    function handleNonBulkParcel(e){
        const textVar = e.nativeEvent.text;
        setParcelNonBulk(textVar);
        setParcelNonBulkVerify(false);
        if(remainingParcel !== '') setRemainingParcel((handleRemainingParcel(assignedParcel? assignedParcel: 0, textVar? textVar : 0, parcelBulk? parcelBulk : 0)).toString());
        setTotalParcel((handleTotalParcel( textVar? textVar: 0, parcelBulk? parcelBulk : 0)).toString());
        if(/([0-9])/.test(textVar)){
            setParcelNonBulk(textVar)
            setParcelNonBulkVerify(true);
        }
    }

    function handleAssignedParcel(e){
        const textVar = e.nativeEvent.text;
        setAssignedParcel(textVar)
        setAssignedParcelVerify(false)

        if(totalParcel >= 1) setRemainingParcel((handleRemainingParcel(textVar? textVar: 0, parcelNonBulk? parcelNonBulk : 0, parcelBulk? parcelBulk : 0)).toString());
     
        if(/([1-9])/.test(textVar)){
            
            setAssignedParcel(textVar)
            setAssignedParcelVerify(true);
       
        }
    }


    function handleRemainingParcel(assignedParcel, parcelNonBulk, parcelBulk){

            return parseInt(assignedParcel) - (parseInt(parcelNonBulk) + parseInt(parcelBulk))
        
    }

    function handleTotalParcel(parcelNonBulk, parcelBulk){

        return(parseInt(parcelBulk) + parseInt(parcelNonBulk))
        
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
                

                <View style = {styles.textInputRegistration}>
                    <Text style={{marginBottom: 10, fontWeight:'500'}}>Total Delivered Non-Bulk Parcel :</Text>
                    <TextInput 
                    mode="outlined"
                    keyboardType='numeric'
                    placeholder="Enter your total Non-Bulk parcel"
                    placeholderTextColor="#76ABAE" 
                    onChange={e => handleNonBulkParcel(e)}
                    theme={{ roundness: 8 }}
                    maxLength={5}
                    right= { parcelNonBulk.length < 1 ? null : parcelNonBulkVerify ? (
                        <TextInput.Icon 
                        color="green"
                        icon="check" />
                    ) : (
                        <TextInput.Icon 
                        color="red"
                        icon="exclamation" />
                    )} 
                       
                    />                         
                </View>


                <View style = {styles.textInputRegistration}>
                    <Text style={{marginBottom: 10, fontWeight:'500'}}>Total Delivered Bulk Parcel :</Text>
                    <TextInput 
                    mode="outlined"
                    keyboardType='numeric'
                    placeholder="Enter your total Bulk parcel"
                    placeholderTextColor="#76ABAE" 
                    onChange={e => handleBulkParcel(e)}
                    theme={{ roundness: 8 }}
                    maxLength={11}
                    right= { parcelBulk.length < 1 ? null : parcelBulkVerify ? (
                        <TextInput.Icon 
                        color="green"
                        icon="check" />
                    ) : (
                        <TextInput.Icon 
                        color="red"
                        icon="exclamation" />
                    )} 
                       
                    />                         
                </View>

                <View style = {styles.textInputRegistration}>
                    <Text style={{marginBottom: 10, fontWeight:'500'}}>Total Assigned Parcel :</Text>
                    <TextInput 
                    mode="outlined"
                    keyboardType='numeric'
                    placeholder="Enter your total assigned parcel"
                    placeholderTextColor="#76ABAE" 
                    onChange={e => handleAssignedParcel(e)}
                    theme={{ roundness: 8 }}
                    maxLength={11}
                    right= { assignedParcel.length < 1 ? null : assignedParcelVerify ? (
                        <TextInput.Icon 
                        color="green"
                        icon="check" />
                    ) : (
                        <TextInput.Icon 
                        color="red"
                        icon="exclamation" />
                    )} 
                       
                    />                         
                </View>


                <View style = {styles.textInputRegistration}>
                    <Text style={{marginBottom: 10, fontWeight:'500'}}>Total Delivered Parcel :</Text>
                    <TextInput 
                    mode="outlined"
                    keyboardType='numeric'
                    placeholderTextColor="#76ABAE" 
                    value={totalParcel}
                    theme={{ roundness: 8 }}
                    maxLength={11}
                    style={{ backgroundColor: '#F3D0D7'}}
                    readOnly
                                           
                    />                         
                </View>


                

                <View style = {styles.textInputRegistration}>
                    <Text style={{marginBottom: 10, fontWeight:'500'}}>Remaining Parcel :</Text>
                    <TextInput 
                    mode="outlined"
                    keyboardType='numeric'
                    placeholderTextColor="#76ABAE" 
                    value={remainingParcel}
                    theme={{ roundness: 8 }}
                    maxLength={11}
                    style={{ backgroundColor: '#F3D0D7'}}
                    readOnly
                    />                         
                </View>

            </View>
            
                <View style={componentStyles.button}>
                    <Text style={{marginBottom: 10, fontWeight:'500'}}>Image of Remittance Receipt :</Text>
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
                        <View style={{marginVertical:20, marginHorizontal: 10, alignItems : 'center'}}>
                            <Image
                         
                            source={{uri: item}}
                            style={{width: smallerSize, height: 500}}/>
                        

                        </View>
                         
                     )}
                    keyExtractor={(item) => item}
                    contentContainerStyle={{ marginVertical: 20, paddingBottom: 10, width:'50%',alignItems : 'center', marginHorizontal: 10}}
                    />
                </View>
                    )
                }

                <View style={componentStyles.button}>
                <Text style={{marginBottom: 10, fontWeight:'500'}}>Screenshot of Daily Delivered :</Text>
                    <TouchableOpacity 
                    style={componentStyles.loginButton}
                    onPress={pickImageScreenshot}>
                        <View>
                        <Icon
                          name="image-plus"
                          size={35}
                          color="black"
                        />
                           
                        </View>
                    </TouchableOpacity>
                    {/* <Image 
                    style={{height: 100, width: '100%'}}
                    source={{uri: image}}
                    /> */}
                </View>

                {viewScreenshot !== null &&(
                  <View style={componentStyles.imgPick}>  
                    <View style={{marginVertical:20, marginHorizontal: 10, alignItems : 'center'}}>
                            <Image
                           
                            source={{uri: viewScreenshot}}
                            style={{width: smallerSize, height: 500}}/>
                        

                    </View>
                   </View> 
           
                 )
                }

                <View style={styles.button}>
                    <TouchableOpacity 
                    style={styles.loginButton}
                    onPress={() => {
                       
                        // router.push({pathname: 'auth/registerOtp'});
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
        marginTop: -20,
        marginBottom: 30,
        textAlign: 'center',
        margin: 20,
    },

    imgPick: {
        alignItems: 'center',
        marginTop: -20,
        marginBottom: 30,
        textAlign: 'center',
        margin: 20,
        borderColor: 'black',
        borderWidth: 2
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



})



export default ParcelInput;