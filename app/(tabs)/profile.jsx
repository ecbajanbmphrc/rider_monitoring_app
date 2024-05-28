import {React,  useState } from "react";
import { TextInput, SafeAreaView, TouchableHighlight, Text, StyleSheet } from "react-native";


const apiKey = 'c582beac259045698b7c77f3bc81d380';
const apiURL = 'https://emailvalidation.abstractapi.com/v1/' + apiKey

 
 
const ProfileScreen = () => {


  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
   <SafeAreaView>
         <TextInput
             style={styles.emailInput}
         onChange={(e) => setEmail(e.nativeEvent.text)}
         value={email}
     />
     <TouchableHighlight onPress={handleSubmit} style={styles.button}>
        <Text>Submit</Text>
     </TouchableHighlight>
      <Text>{errorMessage}</Text>
  </SafeAreaView>
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
});