/**
 * Custom hook for paginated messages
 * Loads messages in batches to improve performance
 */

import {useState, useEffect, useCallback} from 'react';
import {firestore, auth} from '../services/firebase';

const MESSAGES_PER_PAGE = 20;

export const usePaginatedMessages = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [error, setError] = useState(null);

  // Initial load - get first 20 messages
  useEffect(() => {
    if (!roomId) return;

    setLoading(true);
    setError(null);

    const loadInitialMessages = async () => {
      try {
        const query = firestore()
          .collection('chats')
          .doc(roomId)
          .collection('messages')
          .orderBy('createdAt', 'desc')
          .limit(MESSAGES_PER_PAGE);

        const snapshot = await query.get();

        if (snapshot.docs.length === 0) {
          setMessages([]);
          setHasMore(false);
          setLoading(false);
          return;
        }

        const msgList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMessages(msgList);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === MESSAGES_PER_PAGE);

        // Mark unseen messages as seen
        markMessagesAsSeen(msgList);

        // Listen for new messages (real-time updates)
        const unsubscribe = firestore()
          .collection('chats')
          .doc(roomId)
          .collection('messages')
          .orderBy('createdAt', 'desc')
          .limit(MESSAGES_PER_PAGE)
          .onSnapshot((snapshot) => {
            const msgList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setMessages(msgList);
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

            // Mark new unseen messages as seen
            markMessagesAsSeen(msgList);
          });

        setLoading(false);

        return () => unsubscribe();
      } catch (err) {
        console.log('Error loading messages:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadInitialMessages();
  }, [roomId]);

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!lastVisible || !hasMore || loading) return;

    setLoading(true);
    setError(null);

    try {
      const query = firestore()
        .collection('chats')
        .doc(roomId)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .startAfter(lastVisible)
        .limit(MESSAGES_PER_PAGE);

      const snapshot = await query.get();

      if (snapshot.docs.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages((prev) => [...newMessages, ...prev]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === MESSAGES_PER_PAGE);

      setLoading(false);
    } catch (err) {
      console.log('Error loading more messages:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [roomId, lastVisible, hasMore, loading]);

  // Helper function to mark messages as seen
  const markMessagesAsSeen = (msgList) => {
    msgList.forEach(async (msg) => {
      if (msg.senderId !== auth().currentUser.uid && !msg.seen) {
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
          console.log('Error marking message as seen:', error);
        }
      }
    });
  };

  return {
    messages,
    loading,
    hasMore,
    error,
    loadMoreMessages,
  };
};
