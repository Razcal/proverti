# Setup Guide - PROVERTI Petugas

Panduan lengkap setup aplikasi Petugas Lapangan PROVERTI.

## Prasyarat

- Node.js v18+ (gunakan `node --version` untuk cek)
- npm atau yarn
- Akun Supabase (gratis di https://supabase.com)

## Step 1: Setup Supabase

### 1.1 Buat Project Supabase (Jika belum ada)

1. Buka https://supabase.com
2. Klik "New Project"
3. Isi informasi:
   - Project Name: `proverti-petugas`
   - Database Password: Isi password yang kuat
   - Region: Pilih region terdekat dengan Indonesia (Singapore/Tokyo)
4. Tunggu project selesai dibuat

### 1.2 Buat Tabel `petugas`

1. Buka Supabase Dashboard untuk project Anda
2. Pergi ke **SQL Editor**
3. Klik **New Query**
4. Copy-paste isi file `SUPABASE_SETUP.sql`
5. Klik **Run** untuk execute

Tabel `petugas` sekarang sudah siap dengan struktur:
```
- id: UUID (primary key)
- email: VARCHAR UNIQUE
- phone: VARCHAR UNIQUE
- name: VARCHAR
- password_hash: VARCHAR
- photo: TEXT (untuk URL foto)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 1.3 Setup Storage Bucket

1. Di Supabase Dashboard, pergi ke **Storage**
2. Klik **Create Bucket**
3. Nama: `petugas-photos`
4. Set **Public bucket**: ON
5. Klik **Create**

### 1.4 Dapatkan API Keys

1. Di Supabase Dashboard, pergi ke **Settings → API**
2. Copy:
   - **Project URL** → Gunakan untuk `SUPABASE_URL`
   - **anon public** → Gunakan untuk `SUPABASE_KEY`

**PENTING:** Public key sudah ada di `src/core/petugasAuthService.js`. Jika ingin ganti:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key-here';
```

## Step 2: Setup Lokal

### 2.1 Instal Dependencies

```bash
cd petugas-app
npm install
```

### 2.2 Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5175`

## Step 3: Test Aplikasi

### 3.1 Registrasi Petugas Baru

1. Buka `http://localhost:5175`
2. Klik "Belum punya akun? Daftar di sini"
3. Isi form registrasi:
   - **Nama Lengkap**: Cth: "Ahmad Petugas"
   - **Email**: Cth: "petugas@example.com"
   - **Nomor HP**: Cth: "081234567890"
   - **Password**: Minimal 6 karakter
   - **Konfirmasi Password**: Harus sama dengan password

4. Klik **Daftar**

### 3.2 Login

1. Gunakan email atau nomor HP yang terdaftar
2. Masukkan password
3. Klik **Masuk**

### 3.3 Test Beranda

1. Anda akan masuk ke halaman Beranda
2. Lihat greeting "Halo, [Nama]!"
3. Lihat informasi petugas di kartu Status Petugas

### 3.4 Test Profil

1. Klik menu **Profil** (tab bawah)
2. Lihat informasi lengkap:
   - Foto profil (jika ada)
   - Nama
   - Email
   - Nomor HP
   - Tanggal bergabung

3. Klik **Edit Profil**:
   - Ubah Nama
   - Ubah Nomor HP
   - Upload foto (opsional)
   - Klik **Simpan**

### 3.5 Test Logout

1. Di halaman Profil, klik **Keluar**
2. Konfirmasi logout
3. Anda akan kembali ke Welcome Screen

## Troubleshooting

### Error: "Email atau nomor HP sudah terdaftar"

**Solusi:** Email atau phone yang Anda gunakan sudah terdaftar di database. Gunakan email/phone yang berbeda.

### Error: "Email/Nomor HP atau password salah"

**Solusi:** Pastikan email/nomor HP dan password yang dimasukkan benar. Perhatikan huruf besar-kecil.

### Foto tidak bisa diupload

**Solusi:**
1. Pastikan bucket `petugas-photos` sudah dibuat di Storage
2. Pastikan bucket set sebagai **Public bucket**
3. Format file harus JPG, PNG, GIF, atau WebP
4. Ukuran file maksimal 5MB (atau sesuai konfigurasi Supabase)

### Port 5175 sudah dipakai

**Solusi:** Edit `vite.config.js` dan ubah port:

```javascript
server: {
  port: 5176,  // atau nomor port lainnya
  host: '0.0.0.0'
}
```

### Dependencies tidak terinstall

**Solusi:**

```bash
# Hapus node_modules dan lock file
rm -rf node_modules package-lock.json

# Install ulang
npm install
```

## Development

### Struktur File

```
src/
├── App.jsx                    # Komponen utama
├── main.jsx                   # Entry point
├── index.css                  # Styling global
└── core/
    └── petugasAuthService.js  # Service autentikasi

public/                        # Static files
petugas-app/
├── index.html                # HTML template
├── vite.config.js            # Vite config
├── tailwind.config.js        # Tailwind CSS config
└── postcss.config.js         # PostCSS config
```

### Build untuk Production

```bash
npm run build
```

Output akan di folder `dist/`. Deploy ke hosting favorit Anda (Vercel, Netlify, etc).

## Fitur Lengkap

✅ Splash Screen (2 detik)
✅ Welcome Screen
✅ Registrasi dengan email + nomor HP
✅ Login dengan email atau nomor HP
✅ Beranda dengan info petugas
✅ Edit profil
✅ Upload foto profil ke Supabase Storage
✅ Logout
✅ Responsive design (mobile-first)
✅ Bottom navigation (Beranda & Profil)

## Support

Jika ada masalah atau pertanyaan, hubungi tim development PROVERTI.

---

**Last Updated:** March 2026
**Version:** 1.0.0
