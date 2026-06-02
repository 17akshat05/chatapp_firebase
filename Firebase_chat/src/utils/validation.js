/**
 * Validation utilities for forms and inputs
 */

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { valid: false, message: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true };
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true };
};

// Name validation
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: 'Name is required' };
  }
  if (name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }
  return { valid: true };
};

// Login validation
export const validateLogin = (email, password) => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return emailValidation;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }

  return { valid: true };
};

// Signup validation
export const validateSignup = (name, email, password) => {
  const nameValidation = validateName(name);
  if (!nameValidation.valid) {
    return nameValidation;
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return emailValidation;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }

  return { valid: true };
};

// User-friendly error messages for Firebase errors
export const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/invalid-email': 'The email address is invalid',
    'auth/user-disabled': 'This user account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/operation-not-allowed': 'Operation not allowed. Please contact support',
    'auth/too-many-requests': 'Too many login attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/internal-error': 'An unexpected error occurred. Please try again',
  };

  return errorMessages[errorCode] || errorCode || 'An unexpected error occurred';
};
