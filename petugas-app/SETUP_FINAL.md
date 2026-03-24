# 🚀 PROVERTI Petugas App - Setup Final

Aplikasi PROVERTI Petugas sudah siap untuk ditest! Tapi perlu setup database dulu.

## 📋 Checklist Setup

- ✅ **Frontend**: Sudah selesai (React + Vite + Tailwind)
- ✅ **Authentication Service**: Sudah selesai (petugasAuthService.js)
- ✅ **Environment Variables**: Sudah selesai (.env.local)
- ✅ **Design/UI**: Sudah selesai (match PROVERTI main app)
- ⏳ **Database Table**: **PERLU SETUP** (table `petugas`)
- ⏳ **Storage Bucket**: **PERLU SETUP** (bucket `petugas-photos`)

## 🔧 Next Steps

### Step 1: Setup Database Table

Buka: **`SUPABASE_SETUP_GUIDE.md`** di folder ini dan ikuti instruksi.

**TL;DR:**
1. Go to Supabase Dashboard
2. SQL Editor → Copy-paste SQL dari guide → Run
3. Storage → Create bucket `petugas-photos` → Setup policies

### Step 2: Test Aplikasi

Setelah database setup:

```bash
# Terminal di folder petugas-app
npm run dev
```

Buka browser: **http://localhost:5174**

**Test Flow:**
1. Splash screen → Welcome → Auth screen
2. Register tab:
   - Nama: "Test Petugas"
   - Email: "test@example.com"
   - Nomor HP: "08123456789"
   - Password: "Test123456"
   - Confirm: "Test123456"
3. Klik "Daftar" → Should redirect to Login
4. Login tab:
   - Email: "test@example.com"
   - Password: "Test123456"
5. Klik "Masuk" → Should go to Beranda (Dashboard)

### Step 3: Test Features

✅ **Beranda (Dashboard)**
- Greeting message "Selamat Datang, Test!"
- Info petugas card
- Fitur-fitur description

✅ **Profil**
- View profil info
- Edit button → Edit name, phone, upload photo
- Logout button

## 📱 Architecture

```
petugas-app/
├── src/
│   ├── App.jsx                 # Main app (splash, welcome, auth, beranda, profile)
│   ├── main.jsx               # React entry point
│   ├── index.css              # Tailwind + animations
│   ├── Tubankab.png           # Logo
│   └── core/
│       └── petugasAuthService.js  # Auth logic (register, login, profile)
├── .env.local                 # Supabase credentials
├── vite.config.js             # Vite config (port 5175)
├── tailwind.config.js         # Tailwind config
└── package.json               # Dependencies
```

## 🔑 Environment Variables

File: `.env.local`

```
VITE_SUPABASE_URL=https://trglvemivnrswzxjphgz.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_KOhGhtJqGrqWxIsMO4wTOA_iTnk_daB
```

✅ Sudah dikonfigurasi!

## 🎨 Design System

- **Font**: Plus Jakarta Sans (dari Google Fonts)
- **Colors**: 
  - Primary: Emerald (#10b981)
  - Neutral: Slate (#0f172a, #f8fafc)
- **Components**:
  - SplashScreen: Black bg + white box
  - WelcomeScreen: Card layout with Tuban logo
  - AuthScreen: Toggle Masuk/Daftar, password eyes, match indicator
  - BerandaView: Dashboard dengan greeting + info cards
  - ProfileView: Display + edit modes
  - BottomNav: 2 tabs (Beranda, Profil)

## 🔐 Security Notes

**⚠️ Password Hashing (Development Mode)**

Saat ini menggunakan browser-compatible SHA-256 hashing (NOT SECURE untuk production).

Untuk production, gunakan proper bcryptjs di Node.js backend atau Supabase functions.

## 🐛 Troubleshooting

### Error: "tabel petugas belum dibuat"
→ Follow SUPABASE_SETUP_GUIDE.md untuk create table

### Error: "401 Unauthorized"
→ Check RLS policies di SQL setup, pastikan "allow_public_insert" active

### Error: "Cannot resolve module 'bcryptjs'"
→ Sudah di-remove, menggunakan crypto.subtle.digest instead

### Error: "Multiple GoTrueClient instances"
→ Normal warning, tidak blocking. Supabase client menggunakan singleton pattern

## 📞 Quick Commands

```bash
# Start dev server
npm run dev

# Build untuk production
npm build

# Preview build
npm preview

# Clear node_modules dan reinstall
rm -rf node_modules package-lock.json && npm install
```

## ✨ Features Ready

✅ Dual login (email / nomor HP)
✅ Register dengan validasi password match
✅ Profile photo upload to Supabase Storage
✅ Edit profil (name, phone, photo)
✅ Logout with confirmation
✅ Persistent session (localStorage)
✅ Responsive mobile design
✅ PROVERTI design consistency

## 🎯 Status

**Status**: 🟢 Ready for Testing (after database setup)

Sudah siap untuk ditest! Hanya perlu setup database table di Supabase.

---

**Last Updated**: March 24, 2026
**App Version**: 0.0.1
**Tech Stack**: React 19.2 + Vite + Supabase + Tailwind CSS
