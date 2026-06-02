/**
 * Reusable User Card Component for chat lists
 */

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import colors from '../theme/colors';

export const UserCard = ({
  user,
  lastMessage,
  lastMessageTime,
  unreadCount,
  onPress,
}) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date =
      timestamp?.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }

    return date.toLocaleDateString([], {month: 'short', day: 'numeric'});
  };

  const truncateMessage = (msg, length = 50) => {
    return msg.length > length ? msg.substring(0, length) + '...' : msg;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.userName}>{user.name || user.email}</Text>
          <Text style={styles.time}>{formatTime(lastMessageTime)}</Text>
        </View>

        <Text style={styles.message} numberOfLines={1}>
          {truncateMessage(lastMessage || 'No messages yet')}
        </Text>
      </View>

      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.input,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    color: colors.gray,
    fontSize: 12,
  },
  message: {
    color: colors.gray,
    fontSize: 13,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
