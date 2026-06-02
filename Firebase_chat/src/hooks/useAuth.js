/**
 * Custom hook for authentication logic
 */

import {useState} from 'react';
import {auth, firestore} from '../services/firebase';
import {getErrorMessage} from '../utils/validation';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      return { success: true };
    } catch (err) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      // Create user profile in Firestore
      await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .set({
          uid: userCredential.user.uid,
          name,
          email,
          bio: '',
          photoURL: '',
          online: true,
          lastSeen: null,
          createdAt: new Date(),
        });

      return { success: true };
    } catch (err) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await auth().signOut();
      return { success: true };
    } catch (err) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    signup,
    logout,
    loading,
    error,
    setError,
  };
};
