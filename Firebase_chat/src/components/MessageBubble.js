/**
 * Reusable Message Bubble Component
 */

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {auth} from '../services/firebase';
import colors from '../theme/colors';

export const MessageBubble = ({
  item,
  onDelete,
}) => {
  const isMine = item.senderId === auth().currentUser.uid;

  const handleLongPress = () => {
    if (!isMine) return;

    Alert.alert('Message Options', 'Choose Action', [
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDelete(item.id),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const formatTime = () => {
    if (!item.createdAt) return '';
    const timestamp =
      item.createdAt?.seconds ? item.createdAt.seconds * 1000 : Date.now();
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      style={[
        styles.container,
        isMine ? styles.myMessage : styles.otherMessage,
      ]}
      activeOpacity={0.7}>
      <Text style={styles.email}>{item.senderEmail}</Text>

      <Text style={styles.message}>
        {item.deleted ? '🚫 This message was deleted' : item.text}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.time}>{formatTime()}</Text>

        {isMine && (
          <Text style={styles.seen}>
            {item.seen ? '✓✓' : '✓'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: colors.input,
    alignSelf: 'flex-start',
  },
  email: {
    color: colors.gray,
    fontSize: 11,
    marginBottom: 4,
  },
  message: {
    color: colors.white,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
    gap: 5,
  },
  time: {
    color: colors.gray,
    fontSize: 10,
  },
  seen: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
