import {React,  useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from 'expo-router';
const { Alert, Text, View,  StyleSheet, Pressable, Keyboard, BackHandler, ScrollView, TouchableOpacity} = require('react-native');
import { SafeAreaView } from 'react-native-safe-area-context';
import OTPInputField from "../../components/OTPInputField";
import axios from 'axios';





function ForgotPasswordOtp({navigation}){
    
  const { email, otpCode} = useLocalSearchParams();

  const router = useRouter();  
  const [code, setCode] = useState("");
  const [pinReady, setPinReady] = useState(false);
  const max_code_length = 4;


  function handleSubmit(){
    const checkCode = otpCode;
   
    if(checkCode === code){
      console.log("Success");
      router.push({pathname: 'auth/resetPassword', params : {email: email}});
      
    }else{
      Alert.alert('Unable to proceed', 'Invalid OTP input!');
    }
   
  }

    return(
          <View>
            <View>
             <Pressable style={style.container} onPress={Keyboard.dismiss}>
            
              <Text style={{fontSize: 36, marginVertical: 60, color: "#111"}}>
                OTP
              </Text>
              <Text style={{fontSize: 25, color: "#111"}}>Verify your email </Text>
              <Text style={{fontSize: 15, color: "#111"}}>Enter 4 digits code received on your gmail: </Text>
              <Text style={{fontSize: 16, color: "#111", marginTop: 14}}> {email}</Text>  
                <OTPInputField
                  setPinReady={setPinReady}
                  code={code}
                  setCode={setCode}
                  maxLength={max_code_length}
                  />                         
               </Pressable>
              </View>

              <View style={styles.button}>
                <TouchableOpacity style={styles.submitButton}  onPress={() => handleSubmit()}>
                      <Text style={styles.textSign}>Submit</Text>
                </TouchableOpacity>
              </View>

          </View> 
            
    
    );
}

const style = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    // justifyContent: "center"
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
    width: '75%',
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
})



export default ForgotPasswordOtp;

