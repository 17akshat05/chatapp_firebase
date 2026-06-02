/**
 * Reusable input field component with error display
 */

import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import colors from '../theme/colors';

export const InputField = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  error,
  keyboardType,
  autoCapitalize,
  editable = true,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.gray}
        style={[
          styles.input,
          error && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'none'}
        editable={editable}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: colors.input,
    borderRadius: 12,
    padding: 15,
    color: colors.white,
    fontSize: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#ff6b6b',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  inputDisabled: {
    opacity: 0.5,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});
