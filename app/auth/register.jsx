const {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} = require("react-native");
import styles from "./style";
import { TextInput, Provider as PaperProvider } from "react-native-paper";
import { useState } from "react";
import { CheckBox } from "@rneui/themed";
import axios from "axios";
import { useRouter } from "expo-router";
import { ProgressDialog } from "react-native-simple-dialogs";
import DropDownPicker from "react-native-dropdown-picker";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from 'expo-router';
import {DotIndicator} from 'react-native-indicators';
import { useCallback } from 'react';


function RegisterPage({ props }) {
  const [riderId, setRiderId] = useState("");
  const [riderIdVerify, setRiderIdVerify] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [firstNameVerify, setFirstNameVerify] = useState(false);
  const [middleName, setMiddleName] = useState("");
  const [middleNameVerify, setMiddleNameVerify] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameVerify, setLastNameVerify] = useState(false);
  const [email, setEmail] = useState("");
  const [emailVerify, setEmailVerify] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneVerify, setPhoneVerify] = useState(false);
  const [address, setAddress] = useState("");
  const [addressVerify, setAddressVerify] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordVerify, setConfirmPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const toggleCheckbox = () => setChecked(!checked);
  const router = useRouter();
  const [progressVisible, setProgressVisible] = useState(false);
  const [loadHubList, setLoadHubList] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const apiHost = process.env.EXPO_PUBLIC_API_URL;


  const [openType, setOpenType] = useState(false);
  const [riderType, setRiderType] = useState(null);
  const [typeItems, setTypeItems] = useState([
    { label: "2 Wheels", value: "2WH" },
    { label: "3 Wheels", value: "3WH" },
    { label: "4 Wheels", value: "4WH" },
    { label: "WALKER", value: "WALKER" },
    { label: "FLEXI", value: "FLEXI" },
    { label: "MOBILE HUB", value: "MOBILE HUB" },

  ]);

  const [openHubList, setOpenHubList] = useState(false);
  const [hub, setHub] = useState(null);
  const [hubItems, setHubItems] = useState([]);
  const [testNet, setTestNet] = useState();

   useFocusEffect(
      useCallback(() => {
       getHubList();
      }, [])
    );

  async function getHubList(){


    var net;

    await NetInfo.fetch().then(async state => {

    state.isInternetReachable? net = true : net = false;

    console.log("test" , apiHost);
   
    })

    console.log("test", net)
    
    if(!net){ 
       setPageLoading(false)
       setLoadHubList(false)
       return
    }

  axios.get( `${apiHost}/get-hub-list` , )
  .then(

   
  async res => {
    setHubItems(res.data.data);
    setLoadHubList(true);
    setPageLoading(false);
  })
  .catch(e => {
    setPageLoading(false)
    setLoadHubList(false)
    console.log(e)
   
    })


  }  

  function handleSubmit() {

  


  

    if (!riderType) return Alert.alert("Unable to Proceed" , "Please select type!");
    
    if (!hub) return Alert.alert("Unable to Proceed" , "Please hub!");

   

    if (
      firstNameVerify &&
      lastNameVerify &&
      emailVerify &&
      addressVerify &&
      passwordVerify &&
      phoneVerify &&
      confirmPasswordVerify
    ) {
      if (password !== confirmPassword)
        return Alert.alert("Password does not match");
      setProgressVisible(true);
      axios
        .post(`${apiHost}/send-otp-register`, { email: email })
        .then((res) => {
          if (res.data.status == 200) {
           
            setProgressVisible(false);

        

            router.push({
              pathname: "auth/registerOtp",
              params: {
                email: res.data.email,
                otpCode: res.data.code,
                rider_id: riderId,
                rider_type: riderType,
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
                email: email,
                phone: phone,
                address: address,
                hub_id: hub,
                password: password,
              },
            });

            
          } else {
            setProgressVisible(false);
            Alert.alert(
              "Account creation failed",
              JSON.stringify(res.data.data),
              [
                {
                  text: "OK",
                },
              ]
            );
          }
        })
        .catch((e) => {
          {
            console.log(e), Alert.alert("Error"), setProgressVisible(false);
          }
        });
    } else {
     return  Alert.alert("Unable to Proceed" , "Fill required details");
    }
  }

  function handleRiderId(e) {
    const riderIdVar = e.nativeEvent.text;
    setRiderId(riderIdVar);
    setRiderIdVerify(false);

    if (riderIdVar.length > 1) {
      setRiderIdVerify(true);
    }
  }

 

  function handleFirstName(e) {
    const firstNameVar = e.nativeEvent.text;
    setFirstName(firstNameVar);
    setFirstNameVerify(false);

    if (firstNameVar.length > 1) {
      setFirstNameVerify(true);
    }
  }

  function handleMiddleName(e) {
    const middleNameVar = e.nativeEvent.text;
    setMiddleName(middleNameVar);
    setMiddleNameVerify(false);

    if (middleNameVar.length > 1) {
      setMiddleNameVerify(true);
    }
  }

  function handleLastName(e) {
    const lastNameVar = e.nativeEvent.text;
    setLastName(lastNameVar);
    setLastNameVerify(false);

    if (lastNameVar.length > 1) {
      setLastNameVerify(true);
    }
  }

  function handleEmail(e) {
    const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerify(false);
    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{1,}$/.test(emailVar)) {
      setEmail(emailVar);
      setEmailVerify(true);
    }
  }

  function handlePhone(e) {
    const phoneVar = e.nativeEvent.text;
    setPhone(phoneVar);
    setPhoneVerify(false);
    if (/([0])([9])([0-9]{9})/.test(phoneVar)) {
      setPhone(phoneVar);
      setPhoneVerify(true);
    }
  }

  function handleAddress(e) {
    const addressVar = e.nativeEvent.text;
    setAddress(addressVar);
    setAddressVerify(false);

    if (addressVar.length > 1) {
      setAddressVerify(true);
    }
  }

  function handlePassword(e) {
    const passwordVar = e.nativeEvent.text;
    setPassword(passwordVar);
    setPasswordVerify(false);
    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar)) {
      setPassword(passwordVar);
      setPasswordVerify(true);
    }
  }

  function handleConfirmPassword(e) {
    const confirmPasswordVar = e.nativeEvent.text;
    setConfirmPassword(confirmPasswordVar);
    setConfirmPasswordVerify(false);
    // if(confirmPasswordVar !== passwordVar){
    setConfirmPassword(confirmPasswordVar);
    setConfirmPasswordVerify(true);
    // }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
      style={{ backgroundColor: "white" }}
    > 
      {pageLoading? 

      <DotIndicator
        color= 'rgb(61, 61, 61)'
        size =  {12}
        count = {5}
         />
     
      :
    loadHubList? 
       
         <View>

        <View style={styles.loginContainer}>
          <ProgressDialog
            visible={progressVisible}
            title="Loading"
            message="Please, wait..."
          />
          <View style={styles.textInputRegistration}>
            <TextInput
              autoCapitalize={"words"}
              mode="outlined"
              label="Rider ID"
              placeholder="Enter your rider ID"
              placeholderTextColor="#76ABAE"
              onChange={(e) => handleRiderId(e)}
              theme={{ roundness: 8 }}
              right={
                riderId.length < 1 ? null : riderIdVerify ? (
                  <TextInput.Icon color="green" icon="check" />
                ) : (
                  <TextInput.Icon color="red" icon="exclamation" />
                )
              }
            />
          </View>

          <View
            style={{
              paddingTop: 15,
              paddingBottom: 1,
              width: "100%",
            }}
           >
            <DropDownPicker
              open={openType}
              value={riderType}
              items={typeItems}
              setOpen={setOpenType}
              setValue={setRiderType}
              setItems={setTypeItems}
              nestedScrollEnabled={true}
              listMode="SCROLLVIEW"
              zIndex={200}
              placeholderStyle={{
                color: "#47454a",
              }}
              style={{
                borderColor: "#787679",
                backgroundColor: "#fffbff",
              }}
              textStyle={{
                fontSize: 15,
              }}
              dropDownContainerStyle={{
                borderColor: "#787679",
              }}
              translation={{
                PLACEHOLDER: "Select type"
              }}
            />
          </View>

          <View
            style={{
              paddingTop: 15,
              paddingBottom: 1,
              width: "100%",
            }}
           >
            <DropDownPicker
              open={openHubList}
              value={hub}
              items={hubItems}
              setOpen={setOpenHubList}
              setValue={setHub}
              setItems={setHubItems}
              nestedScrollEnabled={true}
              stickyHeader={true}
              listMode="SCROLLVIEW"
              searchable={true}
              zIndex={100}
              placeholderStyle={{
                color: "#47454a",
              }}
              style={{
                borderColor: "#787679",
                backgroundColor: "#fffbff",
              }}
              textStyle={{
                fontSize: 15,
              }}
              dropDownContainerStyle={{
                borderColor: "#787679",
              }}
              translation={{
                PLACEHOLDER: "Select Hub"
              }}
            />
          </View>

          <View style={styles.textInputRegistration}>
            <TextInput
              autoCapitalize={"words"}
              mode="outlined"
              label="First Name"
              placeholder="Enter your first name"
              placeholderTextColor="#484349"
              onChange={(e) => handleFirstName(e)}
              theme={{ roundness: 8 }}
              right={
                firstName.length < 1 ? null : firstNameVerify ? (
                  <TextInput.Icon color="green" icon="check" />
                ) : (
                  <TextInput.Icon color="red" icon="exclamation" />
                )
              }
            />
          </View>

          {firstName.length < 1 ? null : firstNameVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: "red",
              }}
            >
              First name should be more than 1 character.
            </Text>
          )}

          <View style={styles.textInputRegistration}>
            <TextInput
              mode="outlined"
              label="Middle Name"
              placeholder="Enter your middle name"
              placeholderTextColor="#76ABAE"
              onChange={(e) => handleMiddleName(e)}
              theme={{ roundness: 8 }}
              right={
                middleName.length < 1 ? null : middleNameVerify ? (
                  <TextInput.Icon color="green" icon="check" />
                ) : (
                  <TextInput.Icon color="red" icon="exclamation" />
                )
              }
            />
          </View>

          {middleName.length < 1 ? null : middleNameVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: "red",
              }}
            >
              Middle name should be more than 1 character.
            </Text>
          )}

          <View style={styles.textInputRegistration}>
            <TextInput
              mode="outlined"
              label="Last Name"
              placeholder="Enter your last name"
              placeholderTextColor="#76ABAE"
              onChange={(e) => handleLastName(e)}
              theme={{ roundness: 8 }}
              right={
                lastName.length < 1 ? null : lastNameVerify ? (
                  <TextInput.Icon color="green" icon="check" />
                ) : (
                  <TextInput.Icon color="red" icon="exclamation" />
                )
              }
            />
          </View>

          {lastName.length < 1 ? null : lastNameVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: "red",
              }}
            >
              Last name should be more than 1 character.
            </Text>
          )}

          <View style={styles.textInputRegistration}>
            <TextInput
              mode="outlined"
              label="Email"
              placeholder="Enter your email"
              placeholderTextColor="#76ABAE"
              onChange={(e) => handleEmail(e)}
              theme={{ roundness: 8 }}
              right={
                email.length < 1 ? null : emailVerify ? (
                  <TextInput.Icon color="green" icon="check" />
                ) : (
                  <TextInput.Icon color="red" icon="exclamation" />
                )
              }
            />
          </View>

          {email.length < 1 ? null : emailVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: "red",
              }}
            >
              Enter proper email address
            </Text>
          )}

          <View style={styles.textInputRegistration}>
            <TextInput
              mode="outlined"
              keyboardType="numeric"
              label="Phone Number"
              placeholder="Enter your phone number"
              placeholderTextColor="#76ABAE"
              onChange={(e) => handlePhone(e)}
              theme={{ roundness: 8 }}
              maxLength={11}
              right={
                phone.length < 1 ? null : phoneVerify ? (
                  <TextInput.Icon color="green" icon="check" />
                ) : (
                  <TextInput.Icon color="red" icon="exclamation" />
                )
              }
            />
          </View>

          {phone.length < 1 ? null : phoneVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: "red",
              }}
            >
              Please enter valid phone number.
            </Text>
          )}

          <View style={styles.textInputRegistration}>
            <TextInput
              multiline
              numberOfLines={2}
              mode="outlined"
              label="Home Address"
              placeholder="Enter your home address"
              placeholderTextColor="#76ABAE"
              onChange={(e) => handleAddress(e)}
              theme={{ roundness: 8 }}
              right={
                address.length < 1 ? null : addressVerify ? (
                  <TextInput.Icon color="green" icon="check" />
                ) : (
                  <TextInput.Icon color="red" icon="exclamation" />
                )
              }
            />
          </View>

          {address.length < 1 ? null : addressVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: "red",
              }}
            >
              Home address should be more than 1 character.
            </Text>
          )}

          <View style={styles.textInputRegistration}>
            <TextInput
              mode="outlined"
              label="Password"
              placeholder="Enter your password"
              placeholderTextColor="#76ABAE"
              onChange={(e) => handlePassword(e)}
              secureTextEntry={!showPassword}
              theme={{ roundness: 8 }}
              right={
                password.length < 1 ? null : passwordVerify ? (
                  <TextInput.Icon color="green" icon="check" />
                ) : (
                  <TextInput.Icon color="red" icon="exclamation" />
                )
              }
            />
          </View>

          {password.length < 1 ? null : passwordVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: "red",
              }}
            >
              Password should be mix of a lowercase, uppercase and number.
            </Text>
          )}

          <View style={styles.textInputRegistration}>
            <TextInput
              mode="outlined"
              label="Confirm Password"
              placeholder="Re-enter your password"
              placeholderTextColor="#76ABAE"
              onChange={(e) => handleConfirmPassword(e)}
              secureTextEntry={!showPassword}
              theme={{ roundness: 8 }}
            />
          </View>

          <View style={{ marginStart: -10, marginTop: -5 }}>
            <CheckBox
              checked={checked}
              onPress={() => {
                toggleCheckbox();
                setShowPassword(!showPassword);
              }}
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
              handleSubmit();
            }}
          >
            <View>
              <Text style={styles.textSign}>Register</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
        : 
        
         <View style={{alignItems:"center"}}>
                <Image
                        source={
                            require('../../assets/no-network-256.png')
                        }        
                        style={{marginTop: '50%', height:150, width:150}}
                      />
                <Text style={styles.textNoConnection}>No Internet Connection</Text>
        </View> 
      
          }
         
    </ScrollView>
  );
}
export default RegisterPage;
