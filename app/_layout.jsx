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
    <Stack.Screen name="auth/registerOtp" options={{
        title: 'OTP',
        headerShown: false,
        headerTitleAlign: 'center'
        
     }}
    />

    <Stack.Screen name="auth/forgotPassword" options={{
        title: 'Forgot Password',
        headerShown: true,
        headerTitleAlign: 'center'
        
     }}
    />

    <Stack.Screen name="auth/resetPassword" options={{
        title: 'Reset Password',
        headerShown: true,
        headerTitleAlign: 'center'
        
     }}
    />

    <Stack.Screen name="auth/forgotPasswordOtp" options={{
        title: 'OTP',
        headerShown: false,
        headerTitleAlign: 'center'
        
     }}
    />

    

    </Stack>
    );
};

export default Layout;

