import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

import {auth, firestore} from '../services/firebase';

const PrivateChatScreen = ({route}) => {
  const {roomId, user} = route.params;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(roomId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const msgList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMessages(msgList);
      });

    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    if (message.trim() === '') {
      return;
    }

    await firestore()
      .collection('chats')
      .doc(roomId)
      .collection('messages')
      .add({
        text: message,
        createdAt: new Date(),
        senderId: auth().currentUser.uid,
        senderEmail: auth().currentUser.email,
      });

    setMessage('');
  };

  const renderItem = ({item}) => {
    const isMine =
      item.senderId === auth().currentUser.uid;

    return (
      <View
        style={[
          styles.messageBox,
          isMine
            ? styles.myMessage
            : styles.otherMessage,
        ]}>
        <Text style={styles.email}>
          {item.senderEmail}
        </Text>

        <Text style={styles.message}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {user.name}
        </Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        inverted
        contentContainerStyle={{padding: 10}}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type message..."
          placeholderTextColor="#999"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.sendBtn}
          onPress={sendMessage}>
          <Text style={styles.sendText}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PrivateChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  header: {
    backgroundColor: '#7C3AED',
    padding: 18,
  },

  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  messageBox: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    maxWidth: '80%',
  },

  myMessage: {
    backgroundColor: '#7C3AED',
    alignSelf: 'flex-end',
  },

  otherMessage: {
    backgroundColor: '#1E293B',
    alignSelf: 'flex-start',
  },

  email: {
    color: '#CBD5E1',
    fontSize: 11,
    marginBottom: 4,
  },

  message: {
    color: 'white',
    fontSize: 16,
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#1E293B',
  },

  input: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: 'white',
  },

  sendBtn: {
    marginLeft: 10,
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  sendText: {
    color: 'white',
    fontWeight: 'bold',
  },
});