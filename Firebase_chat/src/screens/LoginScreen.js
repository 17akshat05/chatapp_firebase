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
import {validateLogin} from '../utils/validation';
import {InputField} from '../components/InputField';
import {LoadingSpinner} from '../components/LoadingSpinner';
import {ErrorAlert} from '../components/ErrorAlert';
import colors from '../theme/colors';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [alertError, setAlertError] = useState('');

  const {login, loading} = useAuth();

  const handleLogin = async () => {
    // Validate inputs
    const validation = validateLogin(email, password);
    if (!validation.valid) {
      setErrors({[validation.field || 'email']: validation.message});
      return;
    }

    setErrors({});

    // Attempt login
    const result = await login(email, password);
    if (!result.success) {
      setAlertError(result.error);
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
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <ErrorAlert
          message={alertError}
          onDismiss={() => setAlertError('')}
          autoDismiss={true}
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
          placeholder="Password"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          error={errors.password}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          disabled={loading}>
          <Text style={styles.link}>
            Don't have an account? <Text style={styles.linkBold}>Create One</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <LoadingSpinner visible={loading} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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