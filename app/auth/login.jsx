const {
    View, 
    Text,
    Image, 
    TextInput, 
    TouchableOpacity, 
    ScrollView,
    Alert} = require('react-native');
import styles from './style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { err } from 'react-native-svg';



function LoginPage({navigation}){
    
    

    const [showPassword, setShowPassword] = useState(true);
    const [email, setEmail] = useState('');
    const [emailVerify, setEmailVerify] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState(false);

    const router = useRouter();
   
    



    function handleLogin(){
        console.log(email, password);
        const userData = {
            email: email,
            password,
        }
      if(!emailVerify) return Alert.alert('Please input your email!');
      if(!passwordVerify) return Alert.alert('Please input your password!');
        axios.post("http://192.168.50.139:8082/login-user", userData)
        .then(
        res => {
        if(res.data.status === 200){
            Alert.alert('Login Successful');
            AsyncStorage.setItem('token', res.data.data);
            AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
            AsyncStorage.setItem('email', res.data.email);
            AsyncStorage.setItem('last_name', res.data.last_name);
            setEmail('');
            setPassword(''); 
            router.replace('/(tabs)/dashboard');
          
        }else if(res.data.status === 401) {
            Alert.alert('Login Failed!', res.data.data);
             }
        }).catch(error =>{
           console.log(error);
           Alert.alert(error);
         
        } );
    
    }

    function handleEmail(e){

        const emailVar = e.nativeEvent.text;
        setEmailVerify(false);  
        setEmail(emailVar);
        if (emailVar !== ''){
           setEmailVerify(true);    
        }        
    }

   function handlePassword(e){

        const passwordVar = e.nativeEvent.text;
        setPasswordVerify(false);   
        setPassword(passwordVar);
        if (passwordVar !== ''){
           setPasswordVerify(true);    
        }
    }
    return(
        
    <ScrollView 
     contentContainerStyle = {{flexGrow: 10}} 
     keyboardShouldPersistTaps = {"always"}
     style={{backgroundColor: 'white'}}>
    
        <View>
          
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source = {require('../../assets/bmp.png')}/>
            </View>
            <View style={styles.loginContainer}>
                <Text style={styles.text_header}>Login</Text>
                <View style= {styles.action}>
                    <FontAwesome name="envelope" color="#420475" style={styles.emailIcon}/>
                    <TextInput 
                    placeholder="Email" 
                    style={styles.textInput}
                    value={email}
                    onChange={handleEmail}

                    />
                </View>

                <View style= {styles.action}>
                    <FontAwesome name="lock" color="#420475" style={styles.passwordIcon}/>
                    <TextInput 
                    placeholder="Password" 
                    style={styles.textInput}
                    secureTextEntry={showPassword}
                    value={password}
                    onChange={handlePassword}
              
                    />
                    <TouchableOpacity
                    onPress = {() => setShowPassword(!showPassword)}>
                    {showPassword ? (

                    <Feather
                     name="eye"
                     style={{marginRight:-1}}
                     color={'black'}
                     size={20}
                    />  
                      
                      )  :  (

                    <Feather
                     name="eye-off"
                     style={{marginRight: -1}}
                     color={'black'}
                     size={20}
                    />
                    )}
                    </TouchableOpacity>    
                </View>

                <View
                    style={{
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        marginTop: 8,
                        marginRight: 10,
                    }}>

                    <Text style={{color: '#420475', fontWeight: '700'}}>
                        Forgot Password?
                    </Text>
                </View>
            </View>
                <View style={styles.button}>
                    <TouchableOpacity 
                     style={styles.loginButton}
                     onPress={() => handleLogin()}>
                        <View>
                            <Text style={styles.textSign}>
                                Login
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity style={styles.registerButton}
                        onPress={() => {
                            router.push('auth/register');
                        }}>
                        <View>
                            <Text style={styles.registerTextSign}>
                                Register
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
         </View>
    </ScrollView>
    );
}

export default LoginPage;