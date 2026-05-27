import React, {useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import auth from '@react-native-firebase/auth';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import SplashScreen from '../screens/SplashScreen';

import UsersScreen from '../screens/UsersScreen';
import PrivateChatScreen from '../screens/PrivateChatScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });

    return subscriber;
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {user ? (
          <>
            <Stack.Screen name="Users" component={UsersScreen} />
            <Stack.Screen
              name="PrivateChat"
              component={PrivateChatScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;