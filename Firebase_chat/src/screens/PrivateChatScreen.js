import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';

import {auth, firestore} from '../services/firebase';

const PrivateChatScreen = ({route}) => {
  const {roomId, user} = route.params;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(roomId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(async snapshot => {
        const msgList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMessages(msgList);

        msgList.forEach(async msg => {
          if (
            msg.senderId !== auth().currentUser.uid &&
            !msg.seen
          ) {
            try {
              await firestore()
                .collection('chats')
                .doc(roomId)
                .collection('messages')
                .doc(msg.id)
                .update({
                  seen: true,
                  seenAt: new Date(),
                });
            } catch (error) {
              console.log(error);
            }
          }
        });
      });

    return unsubscribe;
  }, [roomId]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(roomId)
      .onSnapshot(doc => {
        if (doc.exists) {
          setTypingUser(doc.data()?.typingBy || '');
        }
      });

    return unsubscribe;
  }, [roomId]);

  const handleTyping = async text => {
    setMessage(text);

    try {
      await firestore()
        .collection('chats')
        .doc(roomId)
        .set(
          {
            typingBy: text.length
              ? auth().currentUser.uid
              : '',
          },
          {merge: true},
        );
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
  if (!message.trim()) {
    return;
  }

  const currentMessage = message.trim();

  try {
    await firestore()
      .collection('chats')
      .doc(roomId)
      .set(
        {
          typingBy: '',
          lastMessage: currentMessage,
          lastMessageTime: new Date(),

          participants: [
            auth().currentUser.uid,
            user.id,
          ],

          participantEmails: [
            auth().currentUser.email,
            user.email,
          ],

        participantNames: [
  auth().currentUser.displayName ||
    auth().currentUser.email,
  user.name,
],
        },
        {merge: true},
      );

    await firestore()
      .collection('chats')
      .doc(roomId)
      .collection('messages')
      .add({
        text: currentMessage,
        senderId: auth().currentUser.uid,
        senderEmail: auth().currentUser.email,
        createdAt: new Date(),

        seen: false,
        seenAt: null,

        deleted: false,
      });

    setMessage('');
  } catch (error) {
    console.log(
      'SEND MESSAGE ERROR:',
      error,
    );
  }
};
  const unsendMessage = async messageId => {
    try {
      await firestore()
        .collection('chats')
        .doc(roomId)
        .collection('messages')
        .doc(messageId)
        .update({
          deleted: true,
          text: '',
        });
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({item}) => {
    const isMine =
      item.senderId === auth().currentUser.uid;

    return (
      <TouchableOpacity
        onLongPress={() => {
          if (!isMine) {
            return;
          }

          Alert.alert(
            'Message Options',
            'Choose Action',
            [
              {
                text: 'Unsend',
                style: 'destructive',
                onPress: () =>
                  unsendMessage(item.id),
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ],
          );
        }}
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
          {item.deleted
            ? '🚫 This message was deleted'
            : item.text}
        </Text>

        <View style={styles.bottomRow}>
          {item.createdAt && (
            <Text style={styles.time}>
              {new Date(
                item.createdAt?.seconds
                  ? item.createdAt.seconds *
                      1000
                  : Date.now(),
              ).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}

          {isMine && (
            <Text style={styles.seen}>
              {item.seen ? '✓✓' : '✓'}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {user.name}
        </Text>

        {typingUser &&
          typingUser !==
            auth().currentUser.uid && (
            <Text style={styles.typingText}>
              Typing...
            </Text>
          )}
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        inverted
        contentContainerStyle={{
          padding: 10,
        }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={handleTyping}
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

  typingText: {
    color: '#D8B4FE',
    marginTop: 4,
    fontSize: 12,
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

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
  },

  time: {
    color: '#CBD5E1',
    fontSize: 10,
  },

  seen: {
    color: '#22C55E',
    marginLeft: 6,
    fontSize: 12,
    fontWeight: 'bold',
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