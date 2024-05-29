import {React,  useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from 'expo-router';
const { Alert, Text, View,  StyleSheet, Pressable, Keyboard, BackHandler, ScrollView, TouchableOpacity} = require('react-native');
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { TextInput } from 'react-native-paper';




function ForgotPasswordOtp({navigation}){
    
  const { email, otpCode} = useLocalSearchParams();

  const router = useRouter();  
  const [code, setCode] = useState("");
 


  function handleSubmit(){
    const checkCode = otpCode;

    if(checkCode === code){
      console.log("Success");
      router.replace({pathname: 'auth/resetPassword', params : {email: email}});
      
    }else{
      console.log(checkCode, code);
      Alert.alert('Unable to proceed', 'Invalid OTP input!');
    }
   
  }

    return(
          <View style={style.container}>
           
            
              <Text style={{fontSize: 36, marginVertical: 40, color: "#111"}}>
                OTP
              </Text>
              <Text style={{fontSize: 25, color: "#111"}}>Verify your email </Text>
              <Text style={{fontSize: 15, color: "#111", marginTop: 10}}>Enter 4 digits code received on your gmail: </Text>
              <Text style={{fontSize: 16, color: "#111", marginVertical: 14}}> {email}</Text>  


              <TextInput 
                    mode="outlined"
                    placeholderTextColor="#76ABAE" 
                    theme={{ roundness: 8 }}
                    style={{textAlign:"center", width: "76%"}}
                    onChangeText={inputText => setCode(inputText)}
                    defaultValue={code}
                    keyboardType="number-pad"
                    maxLength={4}     />  
              
              <View style={styles.button}>
                <TouchableOpacity style={styles.submitButton}  onPress={() => handleSubmit()}>
                      <Text style={styles.textSign}>Verify OTP</Text>
                </TouchableOpacity>
              </View>

          </View> 
            
    
    );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",

    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  }
});

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    alignItems: 'center',
    textAlign: 'center',
    margin: 20,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#420475',
    alignItems: 'center',
    paddingHorizontal: 110,
    paddingVertical: 15,
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
})



export default ForgotPasswordOtp;

