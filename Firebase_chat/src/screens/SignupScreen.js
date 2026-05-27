import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import {auth, firestore} from '../services/firebase';
import colors from '../theme/colors';

const SignupScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const user = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      await firestore()
        .collection('users')
        .doc(user.user.uid)
        .set({
          name,
          email,
          createdAt: new Date(),
        });

    } catch (error) {
      Alert.alert('Signup Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor={colors.gray}
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor={colors.gray}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={colors.gray}
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have account?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: colors.white,
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    backgroundColor: colors.input,
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    color: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: colors.secondary,
    marginTop: 20,
    textAlign: 'center',
  },
});