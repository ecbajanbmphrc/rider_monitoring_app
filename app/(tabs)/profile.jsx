import {React,  useState } from "react";
import { View, SafeAreaView, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import { TextInput } from 'react-native-paper';


const apiKey = 'c582beac259045698b7c77f3bc81d380';
const apiURL = 'https://emailvalidation.abstractapi.com/v1/' + apiKey

 
 
const ProfileScreen = () => {


  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [otp, setOtp] = useState(['-', '-', '-', '-', '-', '-']);
  const [otpVal, setOtpVal] = useState('');

  const sendEmailValidationRequest = async (email) => {
      // try {
          const response = await fetch(apiURL + '&email=' + email);
          const data = response.json();
          return console.log(data.is_valid_format.value);
      // } catch (error) {
      //     throw error;
      // }
  }
  const handleSubmit = async (email) => {
      // try {
          const isValid = await sendEmailValidationRequest('ecbajan.bmphrc@gmail.com');
          if (isValid) {
              setErrorMessage("");
              console.log("SUBMITTED! ", email);
          }
      //  else {
      //         setErrorMessage("INVALID EMAIL.PLEASE CHECK YOUR INPUT AND TRY AGAIN.");
      //         console.log("EMAIL WAS INVALID.", email);
      //     }
      //     return isValid;
      // } catch (error) {
      //     setErrorMessage("SOMETHING WENT WRONG.PLEASE TRY AGAIN LATER.");
      // }
  }
 return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} 
    showsVerticalScrollIndicator={false}
    style={{backgroundColor: 'white'}}>    
    <View style={styles.forgotPasswordContainer}>
     <View style = {styles.textInputEmail}>
               <TextInput 
               style={{textAlign:"center"}}
               mode="outlined"
               keyboardType="number"
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
 )
}

export default ProfileScreen;

const styles = StyleSheet.create({
  emailInput: {
      width: 250,
      height: 25,
    borderWidth: 1,
    borderColor: 'black',
  },
  button: {
      borderWidth: 1,
      borderColor: 'green',
      borderRadius: 15,
      marginTop: 25,
      padding: 10,
      alignItems: 'center'
  },
  otpBoxesContainer: {
    flexDirection: 'row'
},
otpBox: {
    padding: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#f0e2d1",
    height: 55,
    width: 55,
    textAlign: 'center',
    borderRadius: 8,
    backgroundColor: "white"
},

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