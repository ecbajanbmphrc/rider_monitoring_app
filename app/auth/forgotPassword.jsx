import React, { useEffect, useState } from 'react';
const {Text, StyleSheet, View, TouchableOpacity, Alert, ScrollView } = require('react-native');
import { TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { ProgressDialog } from 'react-native-simple-dialogs';



function ForgotPasswordScreen({navigation}) {
    
    const [number, onChangeNumber] = React.useState('');
    const [email, setEmail] = useState('');
    const [emailVerify, setEmailVerify] = useState(false);
    const router = useRouter();
    const [progressVisible, setProgressVisible] = useState(false);

    function handleEmail(e){
      const emailVar = e.nativeEvent.text;
      setEmail(emailVar)
      setEmailVerify(false);
      if(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{1,}$/.test(emailVar)){
          setEmail(emailVar);
          setEmailVerify(true);
      }
    }

    function handleSubmit(){

      const userData =  {email: email}

      if(!emailVerify) return Alert.alert('Unable to proceed', 'Please enter your email first!');

           setProgressVisible(true);
           axios
            .post("https://rider-monitoring-app-backend.onrender.com/send-otp-forgot-password", userData)
            .then(res => {

            if(res.data.status == 200){
                console.log(res.data);
                setProgressVisible(false);
                router.push({pathname: 'auth/forgotPasswordOtp', params : {email: email, otpCode: res.data.code}});
             }else{
              setProgressVisible(false);    
              Alert.alert("Unable to proceed",JSON.stringify(res.data.data), [
                {
                    text: 'OK'
                }
              ]);
             }
            })
            .catch(e => {{console.log(e), setProgressVisible(true),Alert.alert('Error', e)}}); 
      
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
          <View style = {styles.textInputEmail}>
                    <TextInput 
                    mode="outlined"
                    label="Email"
                    placeholder="Enter your email"
                    placeholderTextColor="#76ABAE" 
                    onChange={e => handleEmail(e)}
                    theme={{ roundness: 8 }}
                    right= { email.length < 1 ? null : emailVerify ? (
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
               
                {email.length < 1 ? null : emailVerify ? null : (
                        <Text
                            style={{
                                marginLeft:20,
                                color:'red',
                        }}>
                                Enter proper email address
                        </Text>
                )}

                <View style={styles.button}>
                    <TouchableOpacity style={styles.submitButton}
                        onPress={() => {
                            handleSubmit()
                        }}>
                        <View>
                            <Text style={styles.submitTextSign}>
                               Send OTP Code
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
          </View>
       </ScrollView>
    );
}



export default ForgotPasswordScreen;

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
    textInputEmail: {
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