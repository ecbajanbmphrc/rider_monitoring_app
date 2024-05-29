import React, { useEffect, useState } from 'react';
const {Text, StyleSheet, View, TouchableOpacity, Alert, ScrollView } = require('react-native');
import { TextInput } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckBox } from '@rneui/themed';
import axios from 'axios';
import { ProgressDialog } from 'react-native-simple-dialogs';



function ResetPasswordScreen({navigation}) {
    
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordVerify, setConfirmPasswordVerify] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(false);
    const toggleCheckbox = () => setChecked(!checked);
    const router = useRouter();
    const [progressVisible, setProgressVisible] = useState(false);

    const { email} = useLocalSearchParams();

    function handleSubmit(){
      console.log(email)

      const userData = {
          password: password,
          email: email
      };
     
      if(passwordVerify && confirmPasswordVerify){
          if(password !== confirmPassword)  return  Alert.alert('Password does not match')
          setProgressVisible(true);
          axios
          .put("https://rider-monitoring-app-backend.onrender.com/forgot-password-reset", userData)
          .then(res => {

          if(res.data.status == 200){
            setProgressVisible(false);
            Alert.alert("Password is successfully reset!");
            router.replace('auth/login');
         
           }else{   
            setProgressVisible(false); 
            Alert.alert("Attempt to reset password failed!",JSON.stringify(res.data.data), [
              {
                  text: 'OK'
              }
            ]);
           }
          })
          .catch(e => {{console.log(e), setProgressVisible(false);}}); 

          console.log("password confrimed");
           
          
         
          
      }
      else{
         
          Alert.alert("Fill required details")
      }   
      
      

      
  }

    function handlePassword(e){
        const passwordVar = e.nativeEvent.text;
        setPassword(passwordVar)
        setPasswordVerify(false);
        if(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar)){
            setPassword(passwordVar);
            setPasswordVerify(true);
        }
    }

    function handleConfirmPassword(e){
         const confirmPasswordVar = e.nativeEvent.text;
        setConfirmPassword(confirmPasswordVar)
        setConfirmPasswordVerify(false);
        // if(confirmPasswordVar !== passwordVar){
            setConfirmPassword(confirmPasswordVar);
            setConfirmPasswordVerify(true);
        // }
    }

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} 
         showsVerticalScrollIndicator={false}
         style={{backgroundColor: 'white'}}>    
         <View style={styles.forgotPasswordContainer}>

         <ProgressDialog
                 visible={progressVisible}
                 title="Loading"
                 message="Please, wait..."
                />

         <View style = {styles.textInputResetPassword}>
                    <TextInput 
                    mode="outlined"
                    label="Password"
                    placeholder="Enter your password"
                    placeholderTextColor="#76ABAE" 
                    onChange={e => handlePassword(e)}
                    secureTextEntry={!showPassword}
                    theme={{ roundness: 8 }}
                    right= { password.length < 1 ? null : passwordVerify ? (
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
               
                {password.length < 1 ? null : passwordVerify ? null : (
                        <Text
                            style={{
                                marginLeft:20,
                                color:'red',
                        }}>
                            Password should be mix of a lowercase, uppercase and number.
                        </Text>
                )}

                <View style = {styles.textInputResetPassword}>
                    <TextInput 
                    mode="outlined"
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    placeholderTextColor="#76ABAE" 
                    onChange={e => handleConfirmPassword(e)}
                    secureTextEntry={!showPassword}
                    theme={{ roundness: 8 }}
                       
                    />                         
                </View>

                <View 
                    style = {{marginStart:-10, marginTop:-5}}>
                  <CheckBox
                    checked={checked}
                    onPress={ () => {toggleCheckbox(); setShowPassword(!showPassword);}}
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    checkedColor="red"
                    title={"Show password"}
                  />

                </View>

                <View style={styles.button}>
                    <TouchableOpacity style={styles.submitButton}
                        onPress={() => {
                          handleSubmit() 
                        }}>
                        <View>
                            <Text style={styles.submitTextSign}>
                               Confirm
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
          </View>
       </ScrollView>
    );
}



export default ResetPasswordScreen;

const styles = StyleSheet.create({
    viewStyle: {
      display: 'flex',
    //   justifyContent: 'center',
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
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
    button: {
      alignItems: 'center',
      marginTop: 10,
      alignItems: 'center',
      textAlign: 'center',
      margin: 20,
      },
    // submitButton: {
    //     width: '75%',
    //     backgroundColor: '#420475',
    //     alignItems: 'center',
    //     paddingHorizontal: 15,
    //     paddingVertical: 15,
    //     borderRadius: 10,
    //   },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
      },  
    textInputResetPassword: {
        paddingTop: 10,
        paddingBottom: 1,
    
    },  
    forgotPasswordContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
      },
    action: {
        flexDirection: 'row',
        paddingTop: 14,
        paddingBottom: 3,
        marginTop: 15,
    
        paddingHorizontal: 15,
    
        borderWidth: 1,
        borderColor: '#420475',
        borderRadius: 10,
      },

    submitButton: {
        marginTop: 10,
        width: '110%',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 10,
        borderColor: '#420475',
        borderWidth: 1,
        backgroundColor: '#420475'
      },
    
    submitTextSign: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FFF',
      },  

  });