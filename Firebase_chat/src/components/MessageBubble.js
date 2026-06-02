/**
 * Reusable Message Bubble Component
 * Shows proper message status indicators:
 * - Grey tick (✓) = Pending/Offline
 * - Blue tick (✓) = Sent
 * - Blue double tick (✓✓) = Seen
 */

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {auth} from '../services/firebase';
import colors from '../theme/colors';

export const MessageBubble = ({
  item,
  onDelete,
  onEdit,
  isOnline = true,
  isPending = false,
}) => {
  const isMine = item.senderId === auth().currentUser.uid;

  const getTickStatus = () => {
    // Pending message (offline or not yet sent)
    if (isPending || !isOnline) {
      return {
        text: '✓',
        color: colors.gray,
        label: 'pending',
      };
    }

    // Message seen by recipient
    if (item.seen) {
      return {
        text: '✓✓',
        color: colors.secondary,
        label: 'seen',
      };
    }

    // Message sent (in Firestore)
    return {
      text: '✓',
      color: colors.secondary,
      label: 'sent',
    };
  };

  const handleLongPress = () => {
    if (!isMine) return;

    Alert.alert('Message Options', 'Choose Action', [
      {
        text: 'Edit',
        onPress: () => onEdit(item),
      },
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

  const tickStatus = getTickStatus();

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
        <View style={styles.timeAndEdited}>
          <Text style={styles.time}>{formatTime()}</Text>
          {item.edited && !item.deleted && (
            <Text style={styles.editedTag}>edited</Text>
          )}
        </View>

        {isMine && (
          <Text style={[styles.tick, {color: tickStatus.color}]}>
            {tickStatus.text}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    gap: 5,
  },
  timeAndEdited: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  time: {
    color: colors.gray,
    fontSize: 10,
  },
  editedTag: {
    color: colors.secondary,
    fontSize: 9,
    fontStyle: 'italic',
  },
  tick: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
