import React from 'react';
import { Stack } from 'expo-router';

const Layout = () => {

    return(
    <Stack screenOptions={{
         headerShown:false, 
       }} 
       >
     <Stack.Screen name="auth/login" options={{
        title: 'Login',
        
     }}
    />
    <Stack.Screen name="auth/register" options={{
        title: 'Register Account',
        headerShown: true,
        headerTitleAlign: 'center'
        
     }}
    />

    </Stack>
    );
};

export default Layout;

