import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet } from 'react-native';
import HomeScreen from './Screens/Main/HomeScreen';
import ProfileScreen from './Screens/Main/ProfileScreen';
import UserScreen from './Screens/Main/UserScreen'; // Import UserScreen if it exists
import LoginPage from './Screens/Auth/Login';
import RegisterPage from './Screens/Auth/Register';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const StackNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        statusBarColor: '#0163d2',
        headerStyle: {
          backgroundColor: '#0163d2',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="User"
        component={UserScreen} // Make sure UserScreen is imported and exists
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    // <NavigationContainer>
    //   <Drawer.Navigator>
    //     <Drawer.Screen name="Home" component={StackNav} />
    //   </Drawer.Navigator>
    // </NavigationContainer>

     <NavigationContainer>
    <StatusBar/>
    <Stack.Navigator 
      screenOptions={{
       headerShown:false,   
      }}>
      <Stack.Screen 
      name="Login"  
      component={LoginPage} 
      options={{ 
       contentStyle:{
       
        animation:'slide_from_right'
        }}}/>
      <Stack.Screen 
      name="Register" 
      component={RegisterPage}
      options={{ 
        contentStyle:{
         animationTypeForReplace: 'push',
         animation:'slide_from_left'
        }}}
      />
      <Stack.Screen name="Home" component={StackNav}/>
    </Stack.Navigator> 
   

   
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
