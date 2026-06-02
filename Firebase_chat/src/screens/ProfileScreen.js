import {Buffer} from 'buffer';
import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';

import {auth, firestore} from '../services/firebase';
import {supabase} from '../services/supabase';

import colors from '../theme/colors';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const uid = auth().currentUser.uid;

      const doc = await firestore()
        .collection('users')
        .doc(uid)
        .get();

      if (doc.exists) {
        const data = doc.data();

        setName(data?.name || '');
        setBio(data?.bio || '');
        setPhotoURL(data?.photoURL || '');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });

      if (result.didCancel) {
        return;
      }

      const asset = result.assets?.[0];

      if (!asset?.uri) {
        return;
      }

      setLoading(true);

      const uid = auth().currentUser.uid;

      const fileName =
        `${uid}_${Date.now()}.jpg`;

      const filePath =
        asset.uri.replace(
          'file://',
          '',
        );

      const fileBase64 =
        await RNFS.readFile(
          filePath,
          'base64',
        );

      const fileBuffer =
        Buffer.from(
          fileBase64,
          'base64',
        );

      const {error} =
        await supabase.storage
          .from('profile-images')
          .upload(
            fileName,
            fileBuffer,
            {
              contentType:
                'image/jpeg',
              upsert: true,
            },
          );

      if (error) {
        throw error;
      }

      const {data} =
        supabase.storage
          .from('profile-images')
          .getPublicUrl(
            fileName,
          );

      const imageUrl =
        data.publicUrl;

      setPhotoURL(imageUrl);

      await firestore()
        .collection('users')
        .doc(uid)
        .update({
          photoURL:
            imageUrl,
        });

      Alert.alert(
        'Success',
        'Profile photo updated successfully',
      );
    } catch (error) {
      console.log(
        'UPLOAD ERROR:',
        error,
      );

      Alert.alert(
        'Upload Error',
        JSON.stringify(error),
      );
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const uid =
        auth().currentUser.uid;

      setLoading(true);

      await firestore()
        .collection('users')
        .doc(uid)
        .update({
          name,
          bio,
          photoURL,
        });

      Alert.alert(
        'Success',
        'Profile updated successfully',
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 50,
      }}>
      <Text style={styles.title}>
        My Profile
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={pickImage}
        style={
          styles.avatarContainer
        }>
        {photoURL ? (
          <Image
            source={{
              uri: photoURL,
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
                styles.avatarText
              }>
              +
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={pickImage}>
        <Text
          style={
            styles.photoText
          }>
          {loading
            ? 'Uploading...'
            : 'Change Profile Photo'}
        </Text>
      </TouchableOpacity>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter Name"
        placeholderTextColor={
          colors.gray
        }
        style={styles.input}
      />

      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="Enter Bio"
        placeholderTextColor={
          colors.gray
        }
        multiline
        style={[
          styles.input,
          styles.bioInput,
        ]}
      />

      <TouchableOpacity
        onPress={saveProfile}
        style={styles.button}>
        {loading ? (
          <ActivityIndicator
            color="white"
          />
        ) : (
          <Text
            style={
              styles.buttonText
            }>
            Save Profile
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        colors.background,
      padding: 20,
    },

    title: {
      color:
        colors.white,
      fontSize: 32,
      fontWeight:
        'bold',
      marginBottom: 30,
    },

    avatarContainer: {
      alignItems:
        'center',
      marginBottom: 10,
    },

    avatar: {
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor:
        colors.input,
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    avatarText: {
      color:
        colors.white,
      fontSize: 40,
      fontWeight:
        'bold',
    },

    photoText: {
      color:
        colors.secondary,
      textAlign:
        'center',
      marginBottom: 30,
    },

    input: {
      backgroundColor:
        colors.input,
      borderRadius: 12,
      padding: 15,
      color:
        colors.white,
      marginBottom: 15,
    },

    bioInput: {
      height: 120,
      textAlignVertical:
        'top',
    },

    button: {
      backgroundColor:
        colors.primary,
      padding: 16,
      borderRadius: 12,
      alignItems:
        'center',
      marginTop: 10,
    },

    buttonText: {
      color:
        colors.white,
      fontWeight:
        'bold',
      fontSize: 16,
    },
  });