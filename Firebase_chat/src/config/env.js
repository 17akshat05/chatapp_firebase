/**
 * Environment Configuration
 * Loads environment variables from .env file
 * Usage: import Config from './src/config/env';
 */

import {Platform} from 'react-native';

// Use react-native-config when installed, fallback to process.env
let Config = {};

try {
  Config = require('react-native-config').default;
} catch (e) {
  // Fallback: environment variables from process.env
  Config = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  };
}

// Validate critical configs
if (!Config.SUPABASE_URL) {
  console.warn('⚠️  Warning: SUPABASE_URL not configured in .env');
}
if (!Config.SUPABASE_ANON_KEY) {
  console.warn('⚠️  Warning: SUPABASE_ANON_KEY not configured in .env');
}

export default Config;
