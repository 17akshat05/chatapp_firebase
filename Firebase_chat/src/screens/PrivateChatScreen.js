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
import {usePaginatedMessages} from '../hooks/usePaginatedMessages';
import {PaginationLoader} from '../components/PaginationLoader';
import colors from '../theme/colors';

const PrivateChatScreen = ({route}) => {
  const {roomId, user} = route.params;

  const [message, setMessage] = useState('');
  const [typingUser, setTypingUser] = useState('');

  // Use pagination hook instead of direct firestore query
  const {
    messages,
    loading: paginationLoading,
    hasMore,
    loadMoreMessages,
  } = usePaginatedMessages(roomId);

  // Listen for typing status
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
    console.log('SEND MESSAGE ERROR:', error);
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

  // Handle reaching the beginning (scroll up to load more)
  const handleEndReached = () => {
    if (!paginationLoading && hasMore) {
      loadMoreMessages();
    }
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
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <PaginationLoader visible={paginationLoading} />
        }
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
      </View>
    </View>
  );
};

export default PrivateChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    backgroundColor: colors.primary,
    padding: 18,
  },

  headerText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },

  typingText: {
    color: colors.secondary,
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

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
  },

  time: {
    color: colors.gray,
    fontSize: 10,
  },

  seen: {
    color: colors.secondary,
    marginLeft: 5,
    fontSize: 10,
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
    backgroundColor: colors.card,
  },

  input: {
    flex: 1,
    backgroundColor: colors.input,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: colors.white,
  },

  sendBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sendText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});