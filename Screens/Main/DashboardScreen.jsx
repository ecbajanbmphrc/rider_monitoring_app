import React from 'react';
const {Text, StyleSheet, View} = require('react-native');

 
function DashboardScreen() {
    return (
      <View style={styles.viewStyle}>
        <Text style={styles.textStyle}>This is Dashboard Screen</Text>
      </View>
        
    );
}

export default DashboardScreen;

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