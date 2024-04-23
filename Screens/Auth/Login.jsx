const {View, Text,Image, TextInput, TouchableOpacity} = require('react-native');
import styles from './style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation} from '@react-navigation/native';
import { useState } from 'react';
function LoginPage({props}){
    const [showPassword, setShowPassword] = useState(true);
    const [password, setPassword] = useState('');
    
    const navigation = useNavigation();
    return(
        <View>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source = {require('../../assets/bmp.png')}/>
            </View>
            <View style={styles.loginContainer}>
                <Text style={styles.text_header}>Login</Text>

                <View style= {styles.action}>
                    <FontAwesome name="envelope" color="#420475" style={styles.emailIcon}/>
                    <TextInput placeholder="Email" style={styles.textInput}/>
                </View>

                <View style= {styles.action}>
                    <FontAwesome name="lock" color="#420475" style={styles.passwordIcon}/>
                    <TextInput 
                    placeholder="Password" 
                    style={styles.textInput}
                    secureTextEntry={showPassword}
                    />
                    <TouchableOpacity
                    onPress = {() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                    <Feather
                     name="eye-off"
                     style={{marginRight: -1}}
                     color={'black'}
                     size={20}
                    />
                      )  :  ( 
                    <Feather
                     name="eye"
                     style={{marginRight:-1}}
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
                    <TouchableOpacity style={styles.loginButton}>
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
    );
}

export default LoginPage;