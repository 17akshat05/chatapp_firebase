import {createClient} from '@supabase/supabase-js';
import Config from '../config/env';

export const supabase = createClient(
  Config.SUPABASE_URL,
  Config.SUPABASE_ANON_KEY,
);