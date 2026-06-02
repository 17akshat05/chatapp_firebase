/**
 * Reusable Chat Input Component
 */

import React from 'react';
import {View, TextInput, TouchableOpacity, Text, StyleSheet} from 'react-native';
import colors from '../theme/colors';

export const ChatInputField = ({
  value,
  onChangeText,
  onSend,
  disabled,
  placeholder = 'Type message...',
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.gray}
        style={styles.input}
        editable={!disabled}
      />

      <TouchableOpacity
        style={[styles.sendButton, disabled && styles.sendButtonDisabled]}
        onPress={onSend}
        disabled={disabled || !value.trim()}>
        <Text style={styles.sendText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    backgroundColor: colors.input,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: colors.white,
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});
