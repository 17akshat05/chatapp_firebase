import React, {
  useEffect,
  useState,
  useRef,
} from 'react';

import {AppState} from 'react-native';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import SplashScreen from '../screens/SplashScreen';

import UsersScreen from '../screens/UsersScreen';
import PrivateChatScreen from '../screens/PrivateChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

const Stack =
  createNativeStackNavigator();

const AppNavigator = () => {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const appState = useRef(
    AppState.currentState,
  );

  useEffect(() => {
    const authSubscriber =
      auth().onAuthStateChanged(
        async currentUser => {
          setUser(currentUser);
          setLoading(false);

          if (currentUser) {
            try {
              await firestore()
                .collection('users')
                .doc(currentUser.uid)
                .update({
                  online: true,
                });
            } catch (error) {
              console.log(error);
            }
          }
        },
      );

    const stateSubscription =
      AppState.addEventListener(
        'change',
        async nextAppState => {
          const currentUser =
            auth().currentUser;

          if (!currentUser) {
            return;
          }

          try {
            if (
              appState.current.match(
                /inactive|background/,
              ) &&
              nextAppState === 'active'
            ) {
              await firestore()
                .collection('users')
                .doc(currentUser.uid)
                .update({
                  online: true,
                });
            }

            if (
              nextAppState ===
                'background' ||
              nextAppState ===
                'inactive'
            ) {
              await firestore()
                .collection('users')
                .doc(currentUser.uid)
                .update({
                  online: false,
                  lastSeen:
                    firestore.FieldValue.serverTimestamp(),
                });
            }
          } catch (error) {
            console.log(error);
          }

          appState.current =
            nextAppState;
        },
      );

    return () => {
      authSubscriber();
      stateSubscription.remove();
    };
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
            <Stack.Screen
              name="Users"
              component={UsersScreen}
            />

            <Stack.Screen
              name="PrivateChat"
              component={
                PrivateChatScreen
              }
            />

            <Stack.Screen
              name="Profile"
              component={
                ProfileScreen
              }
            />

            <Stack.Screen
              name="UserProfile"
              component={
                UserProfileScreen
              }
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />

            <Stack.Screen
              name="Signup"
              component={
                SignupScreen
              }
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;