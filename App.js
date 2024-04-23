import { StatusBar } from 'expo-status-bar';
import { NavigationContainer} from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './Screens/Auth/Login';
import RegisterPage from './Screens/Auth/Register';


export default function App() {
  
  const Stack=createNativeStackNavigator();
  
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
         headerShown:false,   
        }}>
        <Stack.Screen 
        name="Login"  
        component={LoginPage} 
        options={{ contentStyle:{backgroundColor: "white"}}}/>
        <Stack.Screen 
        name="Register" 
        component={RegisterPage}
        options={{ contentStyle:{backgroundColor: "white"}}}
        />
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
