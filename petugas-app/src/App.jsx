import React, { useState, useEffect } from 'react';
import { petugasAuthService } from './core/petugasAuthService';
import logoTuban from './Tubankab.png';

// ========================================
// GLOBAL STYLE & ANIMATIONS
// ========================================
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    
    * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
    body { background-color: #f8fafc; color: #0f172a; -webkit-tap-highlight-color: transparent; }
    ::-webkit-scrollbar { width: 0px; } 
    
    .fade-in { animation: fadeIn 0.4s ease-out; }
    .slide-up { animation: slideUp 0.4s cubic-bezier(.17,.67,.21,1); }
    .pop-in { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes popIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    
    .splash-container { position: fixed; inset: 0; background: #000; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.8s ease; overflow: hidden; }
    
    .nav-bar { display: flex; width: 100%; max-width: 1200px; margin: 0 auto; background: white; }
    
    .nav-item { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center;
      padding: 16px 0;
      font-size: 10px; 
      color: #94a3b8;
      font-weight: 800;
      gap: 6px;
      transition: all 0.3s ease;
      flex: 1;
      border: none;
      background: none;
      cursor: pointer;
    }
    
    .nav-item.active { 
      color: #10b981;
    }
    
    .nav-item.active .nav-icon { 
      transform: translateY(-3px) scale(1.1);
      filter: drop-shadow(0 4px 6px rgba(16, 185, 129, 0.3));
    }
    
    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
  `}</style>
);

// ========================================
// SPLASH SCREEN (PROVERTI EDITION)
// ========================================
function SplashScreen() {
  return (
    <div className="splash-container">
      <div className="fade-in bg-white px-8 py-4 rounded-2xl shadow-2xl shadow-white/10 text-center">
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter">PROVERTI</h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">BIDANG KESEHATAN HEWAN</p>
      </div>
    </div>
  );
}

// ========================================
// WELCOME SCREEN (PROVERTI EDITION)
// ========================================
function WelcomeScreen({ onStart }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 px-4 slide-up">
      <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl border border-slate-100 text-center">
        <div className="flex justify-center mb-5">
          <img src={logoTuban} alt="Logo Tuban" className="w-20 h-auto object-contain drop-shadow-sm" />
        </div>
        <p className="text-[8.5px] font-black text-emerald-600 uppercase tracking-widest mb-6 leading-snug">
          Dinas Ketahanan Pangan, Pertanian, dan Perikanan<br/>
          Kabupaten Tuban
        </p>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">PROVERTI</h1>
        <p className="text-[10px] font-bold text-slate-500 mb-8 leading-relaxed">
          (Portofolio Recording Observasi Veteriner, Reproduksi, dan Ternak Integrasi)
        </p>
        <button 
          onClick={onStart}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl text-sm shadow-lg shadow-emerald-500/30 transition-all"
        >
          Mulai Sistem Pendataan
        </button>
      </div>
    </div>
  );
}

// ========================================
// FORM FIELD COMPONENT
// ========================================
function FF({ label, children }) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block mb-2">{label}</label>
      {children}
    </div>
  );
}

// ========================================
// AUTH SCREEN (PROVERTI EDITION)
// ========================================
function AuthScreen({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(null);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register state
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [regName, setRegName] = useState('');

  // Monitor password confirmation
  useEffect(() => {
    if (confirmPassword === '') {
      setPasswordMatch(null);
    } else if (regPassword === confirmPassword) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  }, [regPassword, confirmPassword]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      return alert('Harap isi Email/No. HP dan Password!');
    }
    
    setIsLoading(true);
    const result = await petugasAuthService.login(loginEmail, loginPassword);
    setIsLoading(false);

    if (result.success) {
      localStorage.setItem('srtt_petugas_profile', JSON.stringify(result.petugas));
      onSuccess(result.petugas);
    } else {
      alert(result.error || 'Login gagal!');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!regName || !regEmail || !regPhone || !regPassword || !confirmPassword) {
      return alert('Harap lengkapi semua kolom yang wajib!');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      return alert('Format email tidak valid!');
    }

    if (regPassword !== confirmPassword) {
      return alert('Kata sandi dan konfirmasi kata sandi tidak sama!');
    }

    if (regPassword.length < 6) {
      return alert('Kata sandi minimal 6 karakter!');
    }

    setIsLoading(true);
    const result = await petugasAuthService.register(regEmail, regPhone, regPassword, regName);
    setIsLoading(false);

    if (result.success) {
      alert('Pendaftaran Akun Berhasil! Silakan login dengan akun Anda.');
      setLoginEmail(regEmail);
      setLoginPassword('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setConfirmPassword('');
      setPasswordMatch(null);
      setRegName('');
      setIsLogin(true);
    } else {
      alert(result.error || 'Pendaftaran gagal!');
    }
  };

  const inp = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 bg-slate-50 focus:bg-white transition-all";

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col overflow-hidden slide-up" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="pb-6 px-6 bg-white rounded-b-[32px] shadow-sm z-10 relative" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center p-3">
            <img src={logoTuban} alt="Logo Tuban" className="w-full h-full object-contain" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-center text-slate-900 tracking-tight">PROVERTI</h1>
        <p className="text-[10px] font-bold text-center text-slate-500 uppercase tracking-widest mt-1">Petugas Lapangan</p>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mt-6">
          <button 
            type="button" 
            onClick={() => setIsLogin(true)} 
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${isLogin ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"}`}
          >
            Masuk
          </button>
          <button 
            type="button" 
            onClick={() => setIsLogin(false)} 
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${!isLogin ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"}`}
          >
            Daftar Baru
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-12">
        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4 fade-in">
            <FF label="Email atau No. Handphone">
              <input 
                type="text" 
                className={inp} 
                placeholder="Email atau 0812xxxx" 
                value={loginEmail} 
                onChange={e => setLoginEmail(e.target.value)} 
              />
            </FF>
            <div>
              <FF label="Kata Sandi (Password)">
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className={inp.replace("px-4", "pl-4 pr-12")} 
                    placeholder="••••••••" 
                    value={loginPassword} 
                    onChange={e => setLoginPassword(e.target.value)} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </FF>
            </div>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-4 rounded-xl mt-4 text-sm shadow-lg shadow-emerald-500/30 transition-all"
            >
              {isLoading ? "Memproses..." : "Masuk ke Aplikasi"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 fade-in pb-10">
            <FF label="Nama Lengkap Petugas">
              <input 
                className={inp}
                value={regName}
                onChange={e => setRegName(e.target.value)}
                placeholder="Nama lengkap"
              />
            </FF>
            <FF label="Email Address">
              <input 
                type="email" 
                className={inp} 
                value={regEmail} 
                onChange={e => setRegEmail(e.target.value)} 
                placeholder="your@email.com" 
              />
            </FF>
            <FF label="No. Handphone (Aktif WA)">
              <input 
                type="tel" 
                className={inp} 
                value={regPhone} 
                onChange={e => setRegPhone(e.target.value)} 
                placeholder="Cth: 0812xxxx" 
              />
            </FF>
            <FF label="Buat Kata Sandi">
              <input 
                type="password" 
                className={inp} 
                value={regPassword} 
                onChange={e => setRegPassword(e.target.value)} 
                placeholder="Minimal 6 karakter" 
              />
            </FF>
            
            <div>
              <FF label="Konfirmasi Kata Sandi">
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    className={`${inp.replace("px-4", "pl-4 pr-12")} ${
                      confirmPassword === "" ? "border-slate-200" : 
                      passwordMatch ? "border-emerald-500 bg-emerald-50" : 
                      "border-rose-500 bg-rose-50"
                    }`}
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    placeholder="Ulangi kata sandi" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </FF>
              {confirmPassword !== "" && (
                <p className={`text-[11px] font-bold mt-1 ml-1 ${
                  passwordMatch ? "text-emerald-600" : "text-rose-600"
                }`}>
                  {passwordMatch ? "✅ Kata sandi cocok" : "❌ Kata sandi tidak cocok"}
                </p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isLoading || passwordMatch === false} 
              className={`w-full text-white font-bold py-4 rounded-xl mt-6 text-sm transition-all ${isLoading || passwordMatch === false ? "bg-slate-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30"}`}
            >
              {isLoading ? "Memproses..." : "Daftar Akun Baru"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ========================================
// BERANDA VIEW (Dashboard / Home)
// ========================================
function BerandaView({ petugas }) {
  return (
    <div className="fade-in pb-28 pt-2">
      <div className="px-5 space-y-5">
        {/* Header Card */}
        <div className="bg-slate-900 rounded-[32px] p-7 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <h2 className="text-2xl font-black tracking-tighter">Selamat Datang! 👋</h2>
          <p className="text-emerald-100 text-xs font-semibold mt-1">Petugas Lapangan PROVERTI</p>
          <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <p className="text-sm font-bold text-white">{petugas.name}</p>
            <p className="text-xs text-emerald-200 mt-0.5">{petugas.email}</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-md border border-slate-100">
          <div className="flex items-start gap-4">
            <div className="text-4xl">📋</div>
            <div className="flex-1">
              <h3 className="font-black text-slate-900 text-lg mb-1">Aplikasi PROVERTI</h3>
              <p className="text-slate-600 text-sm font-medium">Platform monitoring dan pendataan ternak berbasis teknologi untuk membantu petugas lapangan dalam melakukan pengawasan kesehatan dan reproduksi sapi secara real-time.</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="font-black text-slate-800 text-base mb-4 ml-1">Fitur Utama Petugas</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-[16px] p-4 shadow-sm border border-slate-100 flex items-start gap-3 hover:shadow-md transition-shadow">
              <div className="text-2xl">🔍</div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Monitor Ternak</h4>
                <p className="text-slate-600 text-xs mt-0.5">Pantau data lengkap sapi di populasi kandang</p>
              </div>
            </div>

            <div className="bg-white rounded-[16px] p-4 shadow-sm border border-slate-100 flex items-start gap-3 hover:shadow-md transition-shadow">
              <div className="text-2xl">📊</div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Data Real-time</h4>
                <p className="text-slate-600 text-xs mt-0.5">Akses informasi terkini dari sistem terintegrasi</p>
              </div>
            </div>

            <div className="bg-white rounded-[16px] p-4 shadow-sm border border-slate-100 flex items-start gap-3 hover:shadow-md transition-shadow">
              <div className="text-2xl">👤</div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Manajemen Profil</h4>
                <p className="text-slate-600 text-xs mt-0.5">Kelola informasi dan identitas petugas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-slate-900 rounded-[24px] p-6 text-white shadow-lg">
          <h3 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-4">Informasi Petugas</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <span className="font-semibold text-slate-300">Nama:</span>
              <span className="font-black text-emerald-400 text-sm">{petugas.name}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <span className="font-semibold text-slate-300">Email:</span>
              <span className="font-medium text-slate-400 truncate text-xs ml-2">{petugas.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-300">Nomor HP:</span>
              <span className="font-black text-blue-400 text-sm">{petugas.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// PROFILE VIEW (Profile & Edit) - PROVERTI DESIGN
// ========================================
function ProfileView({ petugas, onLogout, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(petugas.name);
  const [phone, setPhone] = useState(petugas.phone);
  const [photo, setPhoto] = useState(petugas.photo || '');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = React.useRef(null);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return alert('File harus berupa gambar!');
    }
    setIsLoading(true);
    const result = await petugasAuthService.uploadProfilePhoto(petugas.id, file);
    setIsLoading(false);
    if (result.success) {
      setPhoto(result.photoUrl);
      alert('✅ Foto berhasil diupload!');
    } else {
      alert('❌ ' + result.error);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      return alert('Nama wajib diisi!');
    }
    setIsLoading(true);
    const result = await petugasAuthService.updateProfile(petugas.id, name, phone, photo);
    setIsLoading(false);
    if (result.success) {
      localStorage.setItem('srtt_petugas_profile', JSON.stringify(result.data));
      onUpdate(result.data);
      setIsEditing(false);
      alert('✅ Profil berhasil diupdate!');
    } else {
      alert('❌ ' + result.error);
    }
  };

  const inp = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 bg-slate-50 focus:bg-white transition-all disabled:opacity-50";

  return (
    <div className="pb-32 fade-in bg-slate-50 min-h-screen">
      {/* Header Profil - Match Main App Design */}
      <div className="bg-white px-5 pt-8 pb-8 border-b border-slate-200 shadow-sm flex flex-col items-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-3xl font-black text-slate-400 mb-3 shadow-inner overflow-hidden border-4 border-white">
          {photo ? (
            <img src={photo} alt="Profil" className="w-full h-full object-cover" />
          ) : (
            <span>{petugas.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{petugas.name}</h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Petugas Lapangan</p>
        <button 
          onClick={() => setIsEditing(true)} 
          className="mt-4 px-6 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-full hover:bg-slate-200 transition-colors"
        >
          Edit Profil
        </button>
      </div>

      {!isEditing ? (
        <div className="px-5 mt-6 space-y-6">
          {/* Info Cards - Match Main App */}
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Pengaturan Akun</h3>
            <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                <p className="text-sm font-semibold text-slate-700">{petugas.email}</p>
              </div>
              <div className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nomor HP</p>
                <p className="text-sm font-semibold text-slate-700">{petugas.phone}</p>
              </div>
              <div className="p-4 hover:bg-slate-50 transition-colors">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bergabung Sejak</p>
                <p className="text-sm font-semibold text-slate-700">
                  {petugas.created_at ? new Date(petugas.created_at).toLocaleDateString('id-ID', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'Tidak diketahui'}
                </p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={onLogout}
            className="w-full bg-rose-50 text-rose-600 font-bold py-4 rounded-[20px] text-sm hover:bg-rose-100 transition-colors"
          >
            Keluar Akun (Logout)
          </button>
        </div>
      ) : (
        <div className="px-5 mt-6">
          {/* Edit Form Modal */}
          <div className="bg-white rounded-[24px] p-6 shadow-md border border-slate-100">
            <h3 className="font-black text-lg text-slate-900 mb-5 tracking-tight">Edit Profil</h3>

            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-4xl font-black text-slate-400 mb-3 shadow-inner overflow-hidden border-4 border-white">
                {name && photo ? (
                  <img src={photo} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <span>{name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                className="hidden"
                accept="image/*"
                disabled={isLoading}
              />
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="px-4 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Uploading...' : 'Ganti Foto'}
              </button>
            </div>

            <div className="space-y-4">
              <FF label="Nama Lengkap">
                <input 
                  className={inp}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={isLoading}
                />
              </FF>

              <FF label="Nomor HP (Aktif WA)">
                <input 
                  className={inp}
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  disabled={isLoading}
                />
              </FF>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setName(petugas.name);
                  setPhone(petugas.phone);
                  setPhoto(petugas.photo || '');
                }}
                disabled={isLoading}
                className="flex-1 py-3.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================
// BOTTOM NAVIGATION (PROVERTI EDITION)
// ========================================
function BottomNav({ currentView, onNavigate }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 shadow-lg">
      <div className="nav-bar">
        {/* Tab 1: Beranda */}
        <button
          onClick={() => onNavigate('beranda')}
          className={`nav-item ${currentView === 'beranda' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3z"/>
            </svg>
          </span>
          <span>Beranda</span>
        </button>

        {/* Tab 2: Profil */}
        <button
          onClick={() => onNavigate('profile')}
          className={`nav-item ${currentView === 'profile' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </span>
          <span>Profil</span>
        </button>
      </div>
    </div>
  );
}

// ========================================
// MAIN APP
// ========================================
export default function App() {
  const [appState, setAppState] = useState('splash'); // splash | welcome | auth | main
  const [currentView, setCurrentView] = useState('beranda'); // beranda | profile
  const [petugas, setPetugas] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedPetugas = localStorage.getItem('srtt_petugas_profile');
      if (savedPetugas) {
        setPetugas(JSON.parse(savedPetugas));
        setAppState('main');
      } else {
        setAppState('welcome');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAuthSuccess = (petugasData) => {
    setPetugas(petugasData);
    setAppState('main');
    setCurrentView('beranda');
  };

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.removeItem('srtt_petugas_profile');
      setPetugas(null);
      setAppState('welcome');
      setCurrentView('beranda');
    }
  };

  const handlePetugasUpdate = (updatedData) => {
    setPetugas(updatedData);
  };

  if (appState === 'splash') return <><GlobalStyle /><SplashScreen /></>;
  if (appState === 'welcome') return <><GlobalStyle /><WelcomeScreen onStart={() => setAppState('auth')} /></>;
  if (appState === 'auth') return <><GlobalStyle /><AuthScreen onSuccess={handleAuthSuccess} /></>;

  return (
    <><GlobalStyle />
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 relative flex flex-col">
      {/* HEADER PEMERINTAHAN GLOBAL */}
      <div className="bg-white px-2 sm:px-5 pt-3 pb-3 sm:pt-4 sm:pb-4 border-b border-slate-200 shadow-sm mb-3 z-40 relative">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-start gap-2 sm:gap-3">
            <img src={logoTuban} alt="Logo Tuban" className="w-7 sm:w-9 h-auto object-contain drop-shadow-sm shrink-0" />
            <p className="text-[7px] sm:text-[8.5px] font-black text-slate-900 uppercase tracking-widest leading-tight">DINAS KETAHANAN PANGAN,<br/>PERTANIAN DAN PERIKANAN<br/>KABUPATEN TUBAN</p>
          </div>
          <div className="flex items-center">
            <div className="bg-slate-900 px-3 py-1.5 shadow-sm">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">PROVERTI</h1>
            </div>
          </div>
        </div>
      </div>

      {/* AREA KONTEN */}
      <div className="flex-1">
        {currentView === 'beranda' && <BerandaView petugas={petugas} />}
        {currentView === 'profile' && (
          <ProfileView 
            petugas={petugas} 
            onLogout={handleLogout}
            onUpdate={handlePetugasUpdate}
          />
        )}
      </div>

      {/* BOTTOM NAVIGATION */}
      <BottomNav currentView={currentView} onNavigate={setCurrentView} />
    </div>
    </>
  );
}
