import { supabase } from './supabaseClient';

export const cattleService = {
  // Get all cattle for a farm
  getCattleByFarm: async (farmId) => {
    try {
      const { data, error } = await supabase
        .from('cattle')
        .select('*')
        .eq('farm_id', farmId)
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      
      return { success: true, cattle: data || [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get cattle by ID
  getCattleById: async (cattleId) => {
    try {
      const { data, error } = await supabase
        .from('cattle')
        .select('*')
        .eq('id', cattleId)
        .single();

      if (error) throw error;
      return { success: true, cattle: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create new cattle
  createCattle: async (farmId, userId, cattleData) => {
    try {
      const { data, error } = await supabase
        .from('cattle')
        .insert([{
          farm_id: farmId,
          user_id: userId,
          code: cattleData.code.trim().toUpperCase(),
          jenis_kelamin: cattleData.jenis_kelamin,
          jenis_ras: cattleData.jenis_ras,
          asal_usul_sapi: cattleData.asal_usul_sapi,
          tanggal_lahir: cattleData.tanggal_lahir || null,
          status_reproduksi: cattleData.status_reproduksi || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, cattle: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update cattle
  updateCattle: async (cattleId, cattleData) => {
    try {
      const { data, error } = await supabase
        .from('cattle')
        .update({
          code: cattleData.code.trim().toUpperCase(),
          jenis_kelamin: cattleData.jenis_kelamin,
          jenis_ras: cattleData.jenis_ras,
          asal_usul_sapi: cattleData.asal_usul_sapi,
          tanggal_lahir: cattleData.tanggal_lahir || null,
          status_reproduksi: cattleData.status_reproduksi || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', cattleId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, cattle: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete cattle
  deleteCattle: async (cattleId) => {
    try {
      const { error } = await supabase
        .from('cattle')
        .delete()
        .eq('id', cattleId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
