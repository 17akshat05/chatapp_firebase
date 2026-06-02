import React, {useEffect, useState} from 'react';
import React, {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import NetInfo from '@react-native-community/netinfo';

import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';

import {auth, firestore} from '../services/firebase';
import {usePaginatedMessages} from '../hooks/usePaginatedMessages';
import {PaginationLoader} from '../components/PaginationLoader';
import {MessageBubble} from '../components/MessageBubble';
import {ChatHeader} from '../components/ChatHeader';
import {ChatInputField} from '../components/ChatInputField';
import {EditMessageModal} from '../components/EditMessageModal';
import colors from '../theme/colors';

const PrivateChatScreen = ({route}) => {
  const {roomId, user} = route.params;

  const [message, setMessage] = useState('');
  const [typingUser, setTypingUser] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [pendingMessages, setPendingMessages] = useState({});
  const [isOnline, setIsOnline] = useState(true);
  const [pendingMessages, setPendingMessages] = useState({});

  // Use pagination hook instead of direct firestore query
  const {
    messages,
    loading: paginationLoading,
    hasMore,
    loadMoreMessages,
  } = usePaginatedMessages(roomId);

  // Monitor internet connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? true);
    });

    return unsubscribe;
  }, []);

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
          edited: false,
        });

      setMessage('');
    } catch (error) {
      console.log('SEND MESSAGE ERROR:', error);
    }
  };

  const handleDeleteMessage = async messageId => {
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

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setShowEditModal(true);
  };

  const handleSaveEditedMessage = async (newText) => {
    if (!editingMessage || !newText.trim()) {
      return;
    }

    try {
      await firestore()
        .collection('chats')
        .doc(roomId)
        .collection('messages')
        .doc(editingMessage.id)
        .update({
          text: newText.trim(),
          edited: true,
          editedAt: new Date(),
        });

      setShowEditModal(false);
      setEditingMessage(null);
    } catch (error) {
      console.log('EDIT MESSAGE ERROR:', error);
    }
  };

  const renderItem = ({item}) => (
    <MessageBubble
      item={item}
      onDelete={handleDeleteMessage}
      onEdit={handleEditMessage}
      isOnline={isOnline}
      isPending={!!pendingMessages[item.id]}
    />
  );

  // Handle reaching the beginning (scroll up to load more)
  const handleEndReached = () => {
    if (!paginationLoading && hasMore) {
      loadMoreMessages();
    }
  };

  const isTyping = typingUser && typingUser !== auth().currentUser.uid;

  return (
    <View style={styles.container}>
      <ChatHeader
        userName={user.name}
        isTyping={isTyping}
      />

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

      <ChatInputField
        value={message}
        onChangeText={handleTyping}
        onSend={sendMessage}
        disabled={paginationLoading}
      />

      <EditMessageModal
        visible={showEditModal}
        message={editingMessage}
        onSave={handleSaveEditedMessage}
        onCancel={() => {
          setShowEditModal(false);
          setEditingMessage(null);
        }}
      />
    </View>
  );
};

export default PrivateChatScreen;
@@// Monitor internet connectivity
@@useEffect(() => {
@@  const unsubscribe = NetInfo.addEventListener(state => {
@@    setIsOnline(state.isConnected ?? true);
@@  });
@@
@@  return unsubscribe;
@@}, []);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
