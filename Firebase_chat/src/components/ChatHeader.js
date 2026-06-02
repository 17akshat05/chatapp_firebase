/**
 * Reusable Chat Header Component
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../theme/colors';

export const ChatHeader = ({userName, isTyping}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{userName}</Text>

      {isTyping && <Text style={styles.typing}>Typing...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    padding: 18,
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  typing: {
    color: colors.secondary,
    marginTop: 4,
    fontSize: 12,
  },
});
