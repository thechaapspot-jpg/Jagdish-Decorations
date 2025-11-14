import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name
export const GALLERY_BUCKET = 'gallery';

// Database types
export interface GalleryPhoto {
  id: string;
  image_url: string;
  category: string;
  created_at: string;
  file_name?: string;
}
