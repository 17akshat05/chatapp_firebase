import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {auth, firestore} from '../services/firebase';

const UsersScreen = ({navigation}) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .onSnapshot(snapshot => {
        const userList = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(user => user.id !== auth().currentUser.uid);

        setUsers(userList);
      });

    return unsubscribe;
  }, []);

  const createRoomId = (uid1, uid2) => {
    return [uid1, uid2].sort().join('_');
  };

  const openChat = user => {
    const roomId = createRoomId(
      auth().currentUser.uid,
      user.id,
    );

    navigation.navigate('PrivateChat', {
      user,
      roomId,
    });
  };

  const logout = async () => {
    await auth().signOut();
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => openChat(item)}>
        <Text style={styles.name}>{item.name}</Text>

        <Text style={styles.email}>{item.email}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default UsersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 15,
  },

  logoutBtn: {
    backgroundColor: '#7C3AED',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },

  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },

  userCard: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  email: {
    color: '#CBD5E1',
    marginTop: 5,
  },
});