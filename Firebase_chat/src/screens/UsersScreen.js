import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
} from 'react-native';

import {
  auth,
  firestore,
} from '../services/firebase';

const UsersScreen = ({navigation}) => {
  const [searchEmail, setSearchEmail] =
    useState('');

  const [recentChats, setRecentChats] =
    useState([]);

  const currentUid =
    auth().currentUser.uid;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .orderBy(
        'lastMessageTime',
        'desc',
      )
      .onSnapshot(async snapshot => {
        try {
          const chats =
            await Promise.all(
              snapshot.docs.map(
                async doc => {
                  const data =
                    doc.data();

                  if (
                    !data?.participants?.includes(
                      currentUid,
                    )
                  ) {
                    return null;
                  }

                  const otherUserId =
                    data.participants.find(
                      id =>
                        id !==
                        currentUid,
                    );

                  if (
                    !otherUserId
                  ) {
                    return null;
                  }

                  const userDoc =
                    await firestore()
                      .collection(
                        'users',
                      )
                      .doc(
                        otherUserId,
                      )
                      .get();

                  if (
                    !userDoc.exists
                  ) {
                    return null;
                  }

                  return {
                    roomId:
                      doc.id,
                    ...data,
                    user: {
                      id:
                        userDoc.id,
                      ...userDoc.data(),
                    },
                  };
                },
              ),
            );

          setRecentChats(
            chats.filter(
              item => item,
            ),
          );
        } catch (error) {
          console.log(error);
        }
      });

    return unsubscribe;
  }, [currentUid]);

  const createRoomId = (
    uid1,
    uid2,
  ) => {
    return [uid1, uid2]
      .sort()
      .join('_');
  };

  const searchUser =
    async () => {
      if (
        !searchEmail.trim()
      ) {
        Alert.alert(
          'Error',
          'Enter email address',
        );
        return;
      }

      try {
        const snapshot =
          await firestore()
            .collection(
              'users',
            )
            .where(
              'email',
              '==',
              searchEmail
                .trim()
                .toLowerCase(),
            )
            .get();

        if (
          snapshot.empty
        ) {
          Alert.alert(
            'User Not Found',
            'No account exists with this email.',
          );
          return;
        }

        const user =
          snapshot.docs[0].data();

        const userId =
          snapshot.docs[0].id;

        if (
          userId ===
          currentUid
        ) {
          Alert.alert(
            'Error',
            'You cannot chat with yourself.',
          );
          return;
        }

        const roomId =
          createRoomId(
            currentUid,
            userId,
          );

        navigation.navigate(
          'PrivateChat',
          {
            roomId,
            user: {
              id:
                userId,
              ...user,
            },
          },
        );

        setSearchEmail('');
      } catch (error) {
        console.log(error);

        Alert.alert(
          'Error',
          'Failed to search user',
        );
      }
    };

  const openProfile =
    () => {
      navigation.navigate(
        'Profile',
      );
    };

  const logout =
    async () => {
      try {
        await firestore()
          .collection('users')
          .doc(currentUid)
          .update({
            online: false,
            lastSeen:
              firestore.FieldValue.serverTimestamp(),
          });

        await auth().signOut();
      } catch (error) {
        console.log(error);
      }
    };

  const openChat =
    chatUser => {
      const roomId =
        createRoomId(
          currentUid,
          chatUser.id,
        );

      navigation.navigate(
        'PrivateChat',
        {
          roomId,
          user: chatUser,
        },
      );
    };

  const renderItem = ({
    item,
  }) => {
    const user =
      item.user;

    const formattedTime =
      item
        ?.lastMessageTime
        ?.seconds
        ? new Date(
            item.lastMessageTime
              .seconds *
              1000,
          ).toLocaleTimeString(
            [],
            {
              hour:
                '2-digit',
              minute:
                '2-digit',
            },
          )
        : '';

    return (
      <TouchableOpacity
        style={
          styles.userCard
        }
        activeOpacity={
          0.8
        }
        onPress={() =>
          openChat(
            user,
          )
        }>
        <View
          style={
            styles.userRow
          }>
          <View
            style={
              styles.avatarWrapper
            }>
            {user?.photoURL ? (
              <Image
                source={{
                  uri: user.photoURL,
                }}
                style={
                  styles.avatar
                }
              />
            ) : (
              <View
                style={
                  styles.avatar
                }>
                <Text
                  style={
                    styles.avatarLetter
                  }>
                  {user?.name
                    ?.charAt(
                      0,
                    )
                    ?.toUpperCase()}
                </Text>
              </View>
            )}

            {user?.online && (
              <View
                style={
                  styles.onlineDot
                }
              />
            )}
          </View>

          <View
            style={
              styles.contentContainer
            }>
            <View
              style={
                styles.topRow
              }>
              <Text
                style={
                  styles.name
                }
                numberOfLines={
                  1
                }>
                {user?.name ||
                  'Unknown'}
              </Text>

              <Text
                style={
                  styles.time
                }>
                {
                  formattedTime
                }
              </Text>
            </View>

            <Text
              style={
                styles.lastMessage
              }
              numberOfLines={
                1
              }>
              {item.lastMessage ||
                'Start chatting...'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={
        styles.container
      }>
      <View
        style={
          styles.topBar
        }>
        <TouchableOpacity
          style={
            styles.profileBtn
          }
          onPress={
            openProfile
          }>
          <Text
            style={
              styles.profileText
            }>
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            styles.logoutBtn
          }
          onPress={
            logout
          }>
          <Text
            style={
              styles.logoutText
            }>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={
          styles.sectionTitle
        }>
        Search User By Email
      </Text>

      <View
        style={
          styles.searchRow
        }>
        <TextInput
          value={
            searchEmail
          }
          onChangeText={
            setSearchEmail
          }
          placeholder="Enter email address"
          placeholderTextColor="#94A3B8"
          autoCapitalize="none"
          keyboardType="email-address"
          style={
            styles.searchInput
          }
        />

        <TouchableOpacity
          style={
            styles.searchBtn
          }
          onPress={
            searchUser
          }>
          <Text
            style={
              styles.searchBtnText
            }>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={
          styles.sectionTitle
        }>
        Recent Chats
      </Text>

      <FlatList
        data={
          recentChats
        }
        keyExtractor={
          item =>
            item.roomId
        }
        renderItem={
          renderItem
        }
        showsVerticalScrollIndicator={
          false
        }
      />
    </View>
  );
};

export default UsersScreen;

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#0F172A',
      padding: 15,
    },

    topBar: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      marginBottom: 20,
    },

    profileBtn: {
      backgroundColor:
        '#4F46E5',
      padding: 14,
      borderRadius: 12,
      flex: 1,
      marginRight: 10,
      alignItems:
        'center',
    },

    profileText: {
      color:
        'white',
      fontWeight:
        'bold',
    },

    logoutBtn: {
      backgroundColor:
        '#7C3AED',
      padding: 14,
      borderRadius: 12,
      flex: 1,
      alignItems:
        'center',
    },

    logoutText: {
      color:
        'white',
      fontWeight:
        'bold',
    },

    sectionTitle: {
      color:
        'white',
      fontSize: 18,
      fontWeight:
        '700',
      marginBottom: 12,
      marginTop: 10,
    },

    searchRow: {
      flexDirection:
        'row',
      marginBottom: 20,
    },

    searchInput: {
      flex: 1,
      backgroundColor:
        '#1E293B',
      borderRadius: 12,
      paddingHorizontal: 15,
      color: 'white',
      marginRight: 10,
    },

    searchBtn: {
      backgroundColor:
        '#7C3AED',
      borderRadius: 12,
      paddingHorizontal: 20,
      justifyContent:
        'center',
    },

    searchBtnText: {
      color:
        'white',
      fontWeight:
        'bold',
    },

    userCard: {
      backgroundColor:
        '#1E293B',
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 16,
      marginBottom: 10,
    },

    userRow: {
      flexDirection:
        'row',
      alignItems:
        'center',
    },

    avatarWrapper: {
      marginRight: 12,
    },

    avatar: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor:
        '#334155',
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    avatarLetter: {
      color:
        'white',
      fontSize: 24,
      fontWeight:
        'bold',
    },

    onlineDot: {
      position:
        'absolute',
      right: 2,
      bottom: 2,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor:
        '#22C55E',
      borderWidth: 2,
      borderColor:
        '#1E293B',
    },

    contentContainer: {
      flex: 1,
      justifyContent:
        'center',
    },

    topRow: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
    },

    name: {
      color:
        'white',
      fontSize: 18,
      fontWeight:
        '700',
      flex: 1,
      marginRight: 10,
    },

    time: {
      color:
        '#94A3B8',
      fontSize: 12,
    },

    lastMessage: {
      color:
        '#CBD5E1',
      marginTop: 6,
      fontSize: 14,
    },
  });