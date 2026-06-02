import React, {useState} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {useAuth} from '../hooks/useAuth';
import {validateSignup} from '../utils/validation';
import {InputField} from '../components/InputField';
import {LoadingSpinner} from '../components/LoadingSpinner';
import {ErrorAlert} from '../components/ErrorAlert';
import colors from '../theme/colors';

const SignupScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState({});
  const [alertError, setAlertError] = useState('');

  const {signup, loading} = useAuth();

  const handleSignup = async () => {
    // Validate inputs
    const validation = validateSignup(name, email, password);
    if (!validation.valid) {
      setErrors({[validation.field || 'email']: validation.message});
      return;
    }

    setErrors({});

    // Attempt signup
    const result = await signup(name, email, password);
    if (!result.success) {
      setAlertError(result.error);
    }
  };

  const handleNameChange = (text) => {
    setName(text);
    if (errors.name) {
      setErrors({...errors, name: ''});
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (errors.email) {
      setErrors({...errors, email: ''});
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (errors.password) {
      setErrors({...errors, password: ''});
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join our community</Text>

        <ErrorAlert
          message={alertError}
          onDismiss={() => setAlertError('')}
          autoDismiss={true}
        />

        <InputField
          placeholder="Full Name"
          value={name}
          onChangeText={handleNameChange}
          autoCapitalize="words"
          error={errors.name}
          editable={!loading}
        />

        <InputField
          placeholder="Email Address"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          error={errors.email}
          editable={!loading}
        />

        <InputField
          placeholder="Password (min 6 characters)"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          error={errors.password}
          editable={!loading}
        />

        <View style={styles.bioContainer}>
          <InputField
            placeholder="Bio (optional)"
            value={bio}
            onChangeText={setBio}
            editable={!loading}
          />
          <Text style={styles.bioHint}>
            {bio.length}/150 characters
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          disabled={loading}>
          <Text style={styles.link}>
            Already have an account? <Text style={styles.linkBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <LoadingSpinner visible={loading} />
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: colors.white,
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.gray,
    fontSize: 14,
    marginBottom: 30,
  },
  bioContainer: {
    marginBottom: 10,
  },
  bioHint: {
    color: colors.gray,
    fontSize: 12,
    marginLeft: 5,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.input,
    marginVertical: 25,
  },
  link: {
    color: colors.gray,
    textAlign: 'center',
    fontSize: 14,
  },
  linkBold: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
});