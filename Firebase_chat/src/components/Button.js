/**
 * Reusable Button Component
 */

import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import colors from '../theme/colors';

export const Button = ({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  size = 'large',
  style,
  textStyle,
}) => {
  const variantStyles = {
    primary: styles.primaryButton,
    secondary: styles.secondaryButton,
    danger: styles.dangerButton,
  };

  const sizeStyles = {
    small: styles.smallButton,
    medium: styles.mediumButton,
    large: styles.largeButton,
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles[variant],
        sizeStyles[size],
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  dangerButton: {
    backgroundColor: '#ff6b6b',
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
