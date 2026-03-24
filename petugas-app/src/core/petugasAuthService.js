import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://trglvemivnrswzxjphgz.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_KOhGhtJqGrqWxIsMO4wTOA_iTnk_daB';

// Create Supabase client as singleton to avoid multiple instances
let supabaseInstance = null;
const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabaseInstance;
};

// Browser-compatible SHA-256 hash function (NOT SECURE, for demo only)
const simpleHash = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + SUPABASE_KEY);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return 'hash_' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Simple comparison function untuk browser
const compareHash = async (password, hash) => {
  const testHash = await simpleHash(password);
  return testHash === hash;
};

export const petugasAuthService = {
  async register(email, phone, password, name) {
    try {
      const supabase = getSupabase();
      
      // Check if petugas with same email or phone exists
      try {
        const { data: existingUser } = await supabase
          .from('petugas')
          .select('id')
          .or(`email.eq.${email},phone.eq.${phone}`)
          .single();

        if (existingUser) {
          return { success: false, error: 'Email atau nomor HP sudah terdaftar' };
        }
      } catch (checkErr) {
        // If table doesn't exist or RLS blocks it, continue anyway
        console.warn('⚠️ Could not check existing user:', checkErr.message);
      }

      // Hash password using browser-compatible method
      const hashedPassword = await simpleHash(password);

      // Create petugas record
      const { data, error } = await supabase
        .from('petugas')
        .insert([{
          email,
          phone,
          name,
          password_hash: hashedPassword,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        // Better error message for common issues
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          return { 
            success: false, 
            error: '❌ Tabel petugas belum dibuat di database. Hubungi admin untuk setup.\n\nPerlu jalankan SQL setup di Supabase Dashboard.' 
          };
        }
        if (error.code === '42501' || error.message.includes('permission denied')) {
          return { 
            success: false, 
            error: '❌ Tidak ada permission untuk registrasi. Hubungi admin.\n\nNeed to enable RLS policies untuk public insert.' 
          };
        }
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async login(emailOrPhone, password) {
    try {
      const supabase = getSupabase();
      
      // Find petugas by email or phone
      const { data: petugas, error } = await supabase
        .from('petugas')
        .select('*')
        .or(`email.eq.${emailOrPhone},phone.eq.${emailOrPhone}`)
        .single();

      if (error || !petugas) {
        return { success: false, error: 'Email/Nomor HP atau password salah' };
      }

      // Verify password using browser-compatible comparison
      const isPasswordValid = await compareHash(password, petugas.password_hash);

      if (!isPasswordValid) {
        return { success: false, error: 'Email/Nomor HP atau password salah' };
      }

      // Return petugas data (without password)
      const { password_hash, ...petugasData } = petugas;
      return { success: true, petugas: petugasData };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async updateProfile(petugasId, name, phone, photo = null) {
    try {
      const supabase = getSupabase();
      const updates = { name, phone };
      if (photo) updates.photo = photo;

      const { data, error } = await supabase
        .from('petugas')
        .update(updates)
        .eq('id', petugasId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async uploadProfilePhoto(petugasId, file) {
    try {
      const supabase = getSupabase();
      const timestamp = Date.now();
      const fileName = `petugas-${petugasId}-${timestamp}.${file.name.split('.').pop()}`;
      
      const { data, error } = await supabase.storage
        .from('petugas-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('petugas-photos')
        .getPublicUrl(fileName);

      // Update petugas record with photo URL
      const updateResult = await this.updateProfile(petugasId, null, null, publicUrl);
      
      if (!updateResult.success) {
        return updateResult;
      }

      return { success: true, photoUrl: publicUrl };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
