# 🔧 Setup Tabel Petugas di Supabase

Anda perlu membuat tabel `petugas` di database Supabase untuk bisa register dan login.

## ✅ Step-by-Step Setup

### 1️⃣ Buka Supabase Dashboard

- Go to: https://app.supabase.com
- Login dengan akun Anda
- Pilih project: **PROVERTI** (atau nama project Anda)

### 2️⃣ Buka SQL Editor

- Di sidebar kiri, klik **"SQL Editor"**
- Klik **"New Query"** atau gunakan yang sudah ada

### 3️⃣ Copy-Paste SQL Setup

Salin **SELURUH** code di bawah ini dan paste ke SQL editor:

```sql
-- ============================================
-- SETUP TABEL PETUGAS
-- ============================================

-- Create table
CREATE TABLE IF NOT EXISTS petugas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE petugas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (jika ada)
DROP POLICY IF EXISTS "allow_public_select" ON petugas;
DROP POLICY IF EXISTS "allow_public_insert" ON petugas;
DROP POLICY IF EXISTS "allow_own_update" ON petugas;

-- Create RLS policies
CREATE POLICY "allow_public_select" ON petugas
  FOR SELECT
  USING (true);

CREATE POLICY "allow_public_insert" ON petugas
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "allow_own_update" ON petugas
  FOR UPDATE
  USING (id::text = auth.uid()::text)
  WITH CHECK (id::text = auth.uid()::text);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_petugas_email ON petugas(email);
CREATE INDEX IF NOT EXISTS idx_petugas_phone ON petugas(phone);
CREATE INDEX IF NOT EXISTS idx_petugas_created_at ON petugas(created_at);
```

### 4️⃣ Run Query

- Klik tombol **"Run"** atau tekan **Ctrl+Enter**
- Tunggu sampai selesai (success message akan muncul)

### 5️⃣ Setup Storage Bucket

Untuk foto profil petugas:

1. Di sidebar, klik **"Storage"**
2. Klik **"Create Bucket"** atau **"New Bucket"**
3. Nama bucket: **`petugas-photos`**
4. Klik **"Create Bucket"**
5. Buka bucket → **"Policies"** tab
6. Klik **"New Policy"** → **"For INSERT"** → Template: **"Allow authenticated users to upload files"**
7. Klik **"Create Policy"** untuk confirm

---

## ✅ Selesai!

Setelah setup selesai:
- Tutup SQL editor
- Refresh browser (Ctrl+R)
- Coba register di aplikasi petugas

---

## 🆘 Jika Ada Error

### Error: "relation 'petugas' does not exist"
**Penyebab**: Tabel belum dibuat
**Solusi**: Jalankan SQL setup di atas

### Error: "401 Unauthorized"
**Penyebab**: RLS policies blum diset
**Solusi**: Check step 3, pastikan semua policies sudah di-create

### Error: "Email sudah terdaftar"
**Penyebab**: Data sudah ada di database
**Solusi**: Gunakan email/phone yang berbeda

---

## 📋 Query untuk Testing (opsional)

Untuk melihat data petugas yang sudah register:

```sql
-- Lihat semua petugas
SELECT id, name, email, phone, created_at FROM petugas ORDER BY created_at DESC;

-- Hapus user tertentu (jika perlu)
DELETE FROM petugas WHERE email = 'test@example.com';

-- Update user tertentu
UPDATE petugas SET name = 'New Name' WHERE email = 'test@example.com';
```

---

## 📞 Support

Jika masih ada masalah:
1. Check browser console (F12 → Console tab) untuk error detail
2. Baca error message dengan teliti
3. Pastikan environment variables `.env.local` sudah benar
