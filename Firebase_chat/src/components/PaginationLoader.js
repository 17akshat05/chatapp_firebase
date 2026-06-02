/**
 * Loading indicator for message pagination
 */

import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import colors from '../theme/colors';

export const PaginationLoader = ({visible = false}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
