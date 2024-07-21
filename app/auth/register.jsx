const {View, Text,Image, TouchableOpacity, ScrollView, Alert} = require('react-native');
import styles from './style';
import { TextInput } from 'react-native-paper';
import { useState } from 'react';
import { CheckBox } from '@rneui/themed';
import * as React from "react";
import axios from 'axios';
import { useRouter} from 'expo-router';
import { ProgressDialog } from 'react-native-simple-dialogs';


function RegisterPage({props}){


 
    const [firstName, setFirstName] = useState('');
    const [firstNameVerify, setFirstNameVerify] = useState(false);
    const [middleName, setMiddleName] = useState('');
    const [middleNameVerify, setMiddleNameVerify] = useState(false);
    const [lastName, setLastName] = useState('');
    const [lastNameVerify, setLastNameVerify] = useState(false);
    const [email, setEmail] = useState('');
    const [emailVerify, setEmailVerify] = useState(false);
    const [phone, setPhone] = useState('');
    const [phoneVerify, setPhoneVerify] = useState(false);
    const [address, setAddress] = useState('');
    const [addressVerify, setAddressVerify] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordVerify, setConfirmPasswordVerify] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(false);
    const toggleCheckbox = () => setChecked(!checked);
    const router = useRouter();
    const [progressVisible, setProgressVisible] = useState(false);

  

    function handleSubmit(){

        const userData = {
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            email: email,
            phone: phone,
            address: address,
            password: password,
        };
       
        if(firstNameVerify && lastNameVerify && emailVerify && addressVerify && passwordVerify && phoneVerify && confirmPasswordVerify){
            if(password !== confirmPassword)  return  Alert.alert('Password does not match')
            setProgressVisible(true);
            axios
            .post("https://rider-monitoring-app-backend.onrender.com/send-otp-register", userData)
            .then(res => {

            if(res.data.status == 200){
                console.log(userData, "test data");
                setProgressVisible(false);
           
             router.push({pathname: 'auth/registerOtp', params: {email: res.data.email, otpCode: res.data.code, 
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
                email: email,
                phone: phone,
                address: address,
                password: password,} });
             }else{    
              setProgressVisible(false);
              Alert.alert("Account creation failed",JSON.stringify(res.data.data), [
                {
                    text: 'OK'
                }
              ]);
             }
            })
            .catch(e => {{console.log(e), Alert.alert("Error"), setProgressVisible(false);}}); 
             
            
            
        }
        else{
           
            Alert.alert("Fill required details")
        }   
        
        

        
    }

    function handleFirstName(e){
        
        const firstNameVar = e.nativeEvent.text;
        setFirstName(firstNameVar);
        setFirstNameVerify(false);

        if (firstNameVar.length > 1){
            setFirstNameVerify(true);
        }
    }

    function handleMiddleName(e){
        
        const middleNameVar = e.nativeEvent.text;
        setMiddleName(middleNameVar);
        setMiddleNameVerify(false);

        if (middleNameVar.length > 1){
            setMiddleNameVerify(true);
        }
    }

    function handleLastName(e){
        
        const lastNameVar = e.nativeEvent.text;
        setLastName(lastNameVar);
        setLastNameVerify(false);

        if (lastNameVar.length > 1){
            setLastNameVerify(true);
        }
    }

    function handleEmail(e){
        const emailVar = e.nativeEvent.text;
        setEmail(emailVar)
        setEmailVerify(false);
        if(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{1,}$/.test(emailVar)){
            setEmail(emailVar);
            setEmailVerify(true);
        }
    }

    function handlePhone(e){
        const phoneVar = e.nativeEvent.text;
        setPhone(phoneVar)
        setPhoneVerify(false);
        if(/([0])([9])([0-9]{9})/.test(phoneVar)){
            setPhone(phoneVar);
            setPhoneVerify(true);
        }
    }

    function handleAddress(e){
        const addressVar = e.nativeEvent.text;
        setAddress(addressVar)
        setAddressVerify(false);

        if (addressVar.length > 1){
            setAddressVerify(true);
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

   

  
    return(
      <ScrollView contentContainerStyle={{flexGrow: 1}} 
      showsVerticalScrollIndicator={false}
      style={{backgroundColor: 'white'}}>
        <View>
           
            <View style={styles.loginContainer}>
                <ProgressDialog
                 visible={progressVisible}
                 title="Loading"
                 message="Please, wait..."
                />
                
                <View style = {styles.textInputRegistration}>
                    <TextInput 
                    autoCapitalize={"words"}
                    mode="outlined"
                    label="First Name"
                    placeholder="Enter your first name"
                    placeholderTextColor="#76ABAE" 
                    onChange={e => handleFirstName(e)}
                    theme={{ roundness: 8 }}
                    right= { firstName.length < 1 ? null : firstNameVerify ? (
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
               
                {firstName.length < 1 ? null : firstNameVerify ? null : (
                        <Text
                            style={{
                                marginLeft:20,
                                color:'red',
                        }}>
                                First name should be more than 1 character.
                        </Text>
                )}

                <View style = {styles.textInputRegistration}>
                    <TextInput 
                    mode="outlined"
                    label="Middle Name"
                    placeholder="Enter your middle name"
                    placeholderTextColor="#76ABAE" 
                    onChange={e => handleMiddleName(e)}
                    theme={{ roundness: 8 }}
                    right= { middleName.length < 1 ? null : middleNameVerify ? (
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
               
                {middleName.length < 1 ? null : middleNameVerify ? null : (
                        <Text
                            style={{
                                marginLeft:20,
                                color:'red',
                        }}>
                                Middle name should be more than 1 character.
                        </Text>
                )}

                <View style = {styles.textInputRegistration}>
                    <TextInput 
                    mode="outlined"
                    label="Last Name"
                    placeholder="Enter your last name"
                    placeholderTextColor="#76ABAE" 
                    onChange={e => handleLastName(e)}
                    theme={{ roundness: 8 }}
                    right= { lastName.length < 1 ? null : lastNameVerify ? (
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
               
                {lastName.length < 1 ? null : lastNameVerify ? null : (
                        <Text
                            style={{
                                marginLeft:20,
                                color:'red',
                        }}>
                                Last name should be more than 1 character.
                        </Text>
                )}

                <View style = {styles.textInputRegistration}>
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

                <View style = {styles.textInputRegistration}>
                    <TextInput 
                    mode="outlined"
                    keyboardType='numeric'
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    placeholderTextColor="#76ABAE" 
                    onChange={e => handlePhone(e)}
                    theme={{ roundness: 8 }}
                    maxLength={11}
                    right= { phone.length < 1 ? null : phoneVerify ? (
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
               
                {phone.length < 1 ? null : phoneVerify ? null : (
                        <Text
                            style={{
                                marginLeft:20,
                                color:'red',
                        }}>
                                Please enter valid phone number.
                        </Text>
                )}

                <View style = {styles.textInputRegistration}>
                    <TextInput 
                    multiline
                    numberOfLines={2}
                    mode="outlined"
                    label="Home Address"
                    placeholder="Enter your home address"
                    placeholderTextColor="#76ABAE" 
                    onChange={e => handleAddress(e)}
                    theme={{ roundness: 8 }}
                    right= { address.length < 1 ? null : addressVerify ? (
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
               
                {address.length < 1 ? null : addressVerify ? null : (
                        <Text
                            style={{
                                marginLeft:20,
                                color:'red',
                        }}>
                            Home address should be more than 1 character.
                        </Text>
                )}

                <View style = {styles.textInputRegistration}>
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

                <View style = {styles.textInputRegistration}>
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

            </View>
                <View style={styles.button}>
                    <TouchableOpacity 
                    style={styles.loginButton}
                    onPress={() => {
                        // router.push({pathname: 'auth/registerOtp'});
                        handleSubmit()
                    }}>
                        <View>
                            <Text style={styles.textSign}>
                                Register
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
        </View>
       </ScrollView>
    );
}
export default RegisterPage;