import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

const UserProfileScreen = ({route}) => {
  const {user} = route.params;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}>
      <View style={styles.header}>
        {user?.photoURL ? (
          <Image
            source={{
              uri: user.photoURL,
            }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || '?'}
            </Text>
          </View>
        )}

        <Text style={styles.name}>
          {user?.name || 'Unknown User'}
        </Text>

        <Text style={styles.email}>
          {user?.email || ''}
        </Text>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                user?.online
                  ? '#22C55E'
                  : '#64748B',
            },
          ]}>
          <Text style={styles.statusText}>
            {user?.online
              ? 'Online'
              : 'Offline'}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Bio
        </Text>

        <Text style={styles.bio}>
          {user?.bio?.trim()
            ? user.bio
            : 'No bio added yet.'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Email Address
        </Text>

        <Text style={styles.value}>
          {user?.email || 'N/A'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          User ID
        </Text>

        <Text style={styles.value}>
          {user?.uid ||
            user?.id ||
            'N/A'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Account Status
        </Text>

        <Text style={styles.value}>
          {user?.online
            ? 'Currently Online'
            : 'Offline'}
        </Text>
      </View>
    </ScrollView>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarLetter: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },

  name: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
  },

  email: {
    color: '#CBD5E1',
    marginTop: 6,
    fontSize: 15,
  },

  statusBadge: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: 'white',
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    padding: 16,
  },

  label: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 8,
    textTransform: 'uppercase',
  },

  bio: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
  },

  value: {
    color: 'white',
    fontSize: 16,
  },
});