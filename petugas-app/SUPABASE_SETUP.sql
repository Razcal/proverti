-- ========================================
-- SETUP TABEL PETUGAS DI SUPABASE
-- ========================================
-- 
-- Jalankan script SQL ini di Supabase Editor (SQL)
-- untuk membuat tabel petugas yang diperlukan
-- oleh aplikasi Petugas Lapangan
--

-- Buat tabel petugas
CREATE TABLE petugas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  photo TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Set RLS (Row Level Security) - Public untuk testing
-- Ubah sesuai kebutuhan produksi
ALTER TABLE petugas ENABLE ROW LEVEL SECURITY;

-- Policy untuk SELECT (siapa saja bisa baca)
CREATE POLICY "Allow public select" ON petugas
  FOR SELECT
  USING (true);

-- Policy untuk INSERT (siapa saja bisa daftar)
CREATE POLICY "Allow public insert" ON petugas
  FOR INSERT
  WITH CHECK (true);

-- Policy untuk UPDATE (hanya yang memiliki record yang bisa update)
CREATE POLICY "Allow update own record" ON petugas
  FOR UPDATE
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Create indexes untuk performa
CREATE INDEX idx_petugas_email ON petugas(email);
CREATE INDEX idx_petugas_phone ON petugas(phone);

-- ========================================
-- SETUP STORAGE DI SUPABASE
-- ========================================
--
-- 1. Buka Supabase Dashboard → Storage
-- 2. Buat bucket baru dengan nama: "petugas-photos"
-- 3. Set policies untuk akses public
-- 4. Storage path untuk file: petugas-{id}-{timestamp}.jpg
--
