/**
 * Error alert component
 */

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../theme/colors';

export const ErrorAlert = ({message, onDismiss, autoDismiss = true}) => {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      if (autoDismiss) {
        const timer = setTimeout(() => {
          setVisible(false);
          onDismiss?.();
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [message, autoDismiss, onDismiss]);

  if (!visible || !message) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        setVisible(false);
        onDismiss?.();
      }}>
      <View style={styles.content}>
        <Text style={styles.title}>Error</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 107, 107, 0.95)',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    gap: 5,
  },
  title: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  message: {
    color: colors.white,
    fontSize: 13,
  },
});
