const {View, Image,  ScrollView, StyleSheet} = require('react-native');
import { useState } from 'react';
import * as React from "react";
import axios from 'axios';
import {  useLocalSearchParams, useFocusEffect} from 'expo-router';
import { useCallback } from 'react';
import { FlatList, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



function  ParcelImageScreenshot({props}){
    const [image, setImage] = useState([]);
    const { width } = useWindowDimensions();
    const smallerSize = width - width *.25;
 
    
    const { screenshot} = useLocalSearchParams();

    const [screenshotData, setScreenshotData ] = useState([]);




    useFocusEffect(
        useCallback(() => {
        //   const test = receipt.replace(/\?/, '%3F');
          console.log(screenshot, "test receipt")
          setScreenshotData(screenshot);
        },[])
    );

  
    return(
      <ScrollView contentContainerStyle={{flexGrow: 1}} 
      showsVerticalScrollIndicator={true}
      style={{backgroundColor: 'white'}}>
        <View>
                
                {/* {viewReceipt.length !== 0 &&(  */}
                <View style={componentStyles.imgPick}>
                   
                        <View style={{marginVertical:5, marginHorizontal: 5, alignItems : 'center', borderWidth: 3, borderColor:'black' }}>
                            <Image
                           
                            style={{width: smallerSize, height: 500, margin: 25}}
                            // defaultSource={require('../../assets/no-network-256.png')}
                            source={{uri: screenshot}}
                          
                            />
                        
                        </View>
                         
                    
                </View>
                    {/* )
                 } */}
  
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
        marginTop: 10,
        marginBottom: 30,
        textAlign: 'center',
        margin: 10,
        borderColor: 'black',
        // borderWidth: 2
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



export default ParcelImageScreenshot;