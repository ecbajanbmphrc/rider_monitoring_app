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
import { useNavigation} from '@react-navigation/native';
import { useState } from 'react';
import axios from 'axios';

function LoginPage({props}){

    const [showPassword, setShowPassword] = useState(true);
    const [email, setEmail] = useState('');
    const [emailVerify, setEmailVerify] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState(false);
    const navigation = useNavigation();

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
        res => {console.log(res.data)
        if(res.data.status === 200){
            Alert.alert('Login Successful');
            navigation.navigate('DrawerMain');
        }else if(res.data.status === 401) {
            Alert.alert('Login Failed!', 'Invalid email or password');
             }
        });
    
    }

    function handleEmail(e){
        const emailVar = e.nativeEvent.text;
       setEmail(emailVar)
       setEmailVerify(false);
       // if(confirmPasswordVar !== passwordVar){
           setEmail(emailVar);
           setEmailVerify(true);
       // }
    }

   function handlePassword(e){
         const passwordVar = e.nativeEvent.text;
        setPassword(passwordVar)
        setPasswordVerify(false);
        // if(confirmPasswordVar !== passwordVar){
            setPassword(passwordVar);
            setPasswordVerify(true);
        // }
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
                    onChange={e => {setEmail(e.nativeEvent.text); handleEmail(e);}}/>
                </View>

                <View style= {styles.action}>
                    <FontAwesome name="lock" color="#420475" style={styles.passwordIcon}/>
                    <TextInput 
                    placeholder="Password" 
                    style={styles.textInput}
                    secureTextEntry={showPassword}
                    onChange={e => {setPassword(e.nativeEvent.text); handlePassword(e);}}
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
                            navigation.navigate('Register');
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