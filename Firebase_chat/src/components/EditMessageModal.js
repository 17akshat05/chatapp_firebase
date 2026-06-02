/**
 * Edit Message Modal Component
 * Allows users to edit their own messages
 */

import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import colors from '../theme/colors';

export const EditMessageModal = ({
  visible,
  message,
  onSave,
  onCancel,
}) => {
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    if (visible && message) {
      setEditedText(message.text || '');
    }
  }, [visible, message]);

  const handleSave = () => {
    if (!editedText.trim()) {
      return;
    }

    if (editedText.trim() === message?.text) {
      // No changes made
      onCancel();
      return;
    }

    onSave(editedText.trim());
    setEditedText('');
  };

  const handleCancel = () => {
    setEditedText('');
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity
          style={styles.overlayTouch}
          onPress={handleCancel}
          activeOpacity={1}
        />

        <View style={styles.container}>
          <Text style={styles.title}>Edit Message</Text>

          <TextInput
            style={styles.input}
            value={editedText}
            onChangeText={setEditedText}
            placeholder="Enter new message..."
            placeholderTextColor={colors.gray}
            multiline
            maxLength={500}
            autoFocus
          />

          <Text style={styles.charCount}>
            {editedText.length}/500
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                !editedText.trim() && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!editedText.trim()}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    backgroundColor: colors.input,
    borderRadius: 16,
    padding: 20,
    width: '85%',
    zIndex: 10,
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.white,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    minHeight: 80,
    maxHeight: 150,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  charCount: {
    color: colors.gray,
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  cancelButtonText: {
    color: colors.gray,
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
