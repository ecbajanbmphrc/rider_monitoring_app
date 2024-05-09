const {Text, StyleSheet, View} = require('react-native');
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as React from 'react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';



 
function ProfileScreen() {

  const [location, setLocation] = useState();

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if(status !== 'granted'){
          console.log("Please grant location permissions");
          return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords.longitude);
      console.log("Location");
      console.log(currentLocation.coords.latitude);
    }
    getPermissions();
  }, []);

  // const [user, setUser] = React.useState(null);

  useFocusEffect(
    useCallback(() => {
      console.log('Hello')
    }, [])
  );


    return (
      <View style={styles.viewStyle}>
        <Text style={styles.textStyle}>This is Profile Screen
        {location}
        </Text>
      </View>
    );
}

export default ProfileScreen;

const styles = StyleSheet.create({
    viewStyle: {
      display: 'flex',
      justifyContent: 'center',
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
  });