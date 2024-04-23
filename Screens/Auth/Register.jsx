const {View, Text,Image, TextInput, TouchableOpacity, ScrollView} = require('react-native');
import styles from './style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation} from '@react-navigation/native';
import { useState } from 'react';
import { CheckBox } from '@rneui/themed';
import { Stack } from '@rneui/layout';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Error from 'react-native-vector-icons/MaterialIcons';
import * as React from "react";


function RegisterPage({props}){

    const [name, setName] = useState('');
    const [nameVerify, setNameVerify] = useState(false);
    const [email, setEmail] = useState('');
    const [emailVerify, setEmailVerify] = useState(false);
    const [phone, setPhone] = useState('');
    const [phoneVerify, setPhoneVerify] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = React.useState(true);
    const toggleCheckbox = () => setChecked(!checked);

    function handleName(e){
        
        const nameVar = e.nativeEvent.text;
        setName(nameVar);
        setNameVerify(false);

        if (nameVar.length > 1){
            setNameVerify(true);
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
        if(/[0]{1}[0-9]{10}/.test(phoneVar)){
            setPhone(phoneVar);
            setPhoneVerify(true);
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

    const navigation = useNavigation();
    return(
      <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <View>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source = {require('../../assets/bmp.png')}/>
            </View>
            <View style={styles.loginContainer}>
                <Text style={styles.text_header}>Register</Text>

                <View style= {styles.action}>
                    <FontAwesome name="user" color="#420475" style={styles.emailIcon}/>
                    <TextInput placeholder="Name" 
                    style={styles.textInput} 
                    onChange={e => handleName(e)}
                    />
                    { name.length < 1 ? null : nameVerify ? (
                        <Feather name="check-circle" color="green" size={20}/>
                    ) : (
                        <Error name ="error" color="red" size={20}/>
                    )}                
                </View>
                {name.length < 1 ? null : nameVerify ? null : (
                        <Text
                            style={{
                                marginLeft:20,
                                color:'red',
                        }}>
                                Name should be more than 1 character.
                        </Text>
                )}
                <View style= {styles.action}>
                    <FontAwesome name="envelope" color="#420475" style={styles.emailIcon}/>
                    <TextInput 
                    placeholder="Email" 
                    style={styles.textInput}
                    onChange={e => handleEmail(e)}
                    />
                    { email.length < 1 ? null : emailVerify ? (
                        <Feather name="check-circle" color="green" size={20}/>
                    ) : (
                        <Error name ="error" color="red" size={20}/>
                    )}   
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

                <View style= {styles.action}>
                    <FontAwesome name="phone" color="#420475" style={styles.emailIcon}/>
                    <TextInput 
                    placeholder="Phone number" 
                    style={styles.textInput}
                    onChange={e => handlePhone(e)}
                    maxLength={11}
                    />
                    { phone.length < 1 ? null : phoneVerify ? (
                        <Feather name="check-circle" color="green" size={20}/>
                    ) : (
                        <Error name ="error" color="red" size={20}/>
                    )}  
                </View>
                {phone.length < 1 ? null : phoneVerify ? null : (
                        <Text
                            style={{
                                marginLeft:20,
                                color:'red',
                        }}>
                                Please enter valid phone number
                        </Text>
                )}

                <View style= {styles.action}>
                    <FontAwesome name="lock" color="#420475" style={styles.passwordIcon}/>
                    <TextInput 
                    placeholder="Password" 
                    style={styles.textInput}
                   
                    onChange={e => handlePassword(e)}
                    />
                      
                     { password.length < 1 ? null : passwordVerify ? (
                        <Feather name="check-circle" color="green" size={20} style={{marginEnd: -1}}/>
                    ) : (
                        <Error name ="error" color="red" size={20} style={{marginEnd: -1}}/>
                    )}  
                </View>
                {password.length < 1 ? null : passwordVerify ? null : (
                        <Text
                            style={{
                                marginLeft:20,
                                color:'red',
                        }}>
                                Password should be mix of lowercase, uppercase and number.
                        </Text>
                )}
                <View 
                    style = {{marginStart:-10, marginTop:-5}}>
                  <CheckBox
                    checked={checked}
                    onPress={toggleCheckbox}
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    checkedColor="red"
                    title={"Show password"}
                  />

                </View>

            </View>
                <View style={styles.button}>
                    <TouchableOpacity style={styles.loginButton}>
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