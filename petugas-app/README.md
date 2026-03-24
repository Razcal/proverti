# PROVERTI Petugas

Aplikasi monitoring ternak khusus untuk petugas lapangan PROVERTI.

## Fitur

- ✅ Login/Register dengan email atau nomor HP
- ✅ Beranda dengan informasi petugas
- ✅ Edit profil dan upload foto
- ✅ Interface yang sama dengan aplikasi utama
- ✅ Menu terbatas (hanya Beranda & Profil)

## Instalasi

Dari folder `petugas-app`:

```bash
npm install
```

## Menjalankan Aplikasi

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5175`

## Build untuk Production

```bash
npm run build
npm run preview
```

## Struktur Project

```
petugas-app/
  ├── src/
  │   ├── App.jsx              # Komponen utama aplikasi
  │   ├── main.jsx             # Entry point React
  │   ├── index.css            # Global styles
  │   └── core/
  │       └── petugasAuthService.js
  ├── index.html
  ├── package.json
  ├── vite.config.js
  ├── tailwind.config.js
  └── postcss.config.js
```

## Supabase Setup

Pastikan Anda memiliki tabel `petugas` di Supabase dengan struktur:

```sql
CREATE TABLE petugas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  photo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Dan buat bucket di Supabase Storage:
- Nama: `petugas-photos`
- Akses: Public

## Alur Aplikasi

1. **Splash Screen** → Tampil selama 2 detik
2. **Welcome Screen** → Pengenalan aplikasi
3. **Auth Screen** → Login / Register dengan email atau nomor HP
4. **Main App** → 
   - Beranda: Menampilkan info petugas
   - Profil: Edit nama, nomor HP, upload foto

## Login Credentials

Gunakan email atau nomor HP untuk login setelah registrasi.

---

© 2026 PROVERTI - Versi Petugas Lapangan
