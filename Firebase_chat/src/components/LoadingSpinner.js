/**
 * Loading spinner component
 */

import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import colors from '../theme/colors';

export const LoadingSpinner = ({visible = false, size = 'large'}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 999,
  },
});
