import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jekqhvopmyflluxqqxll.supabase.co'
const supabaseAnonKey = 'sb_publishable_7avciADseVrF9txAcyxZYg_7l99MmVT'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
})