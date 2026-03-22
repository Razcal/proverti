import React, { useState, useEffect } from "react";
import { dialog } from "./core/helpers";
import { TUBAN_DATA } from "./core/constants";
import { FF } from "./core/components/SharedUI";
import logoTuban from "./Tubankab.png";

export function AuthScreen({ setProfile }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [accounts, setAccounts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("srtt_db_accounts")) || []; }
    catch (e) { return []; }
  });
  useEffect(() => { localStorage.setItem("srtt_db_accounts", JSON.stringify(accounts)); }, [accounts]);
  
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [profileData, setProfileData] = useState({ name: "", kecamatan: "Tuban", desa: "Baturetno", rt: "", rw: "", dusun: "", photo: null });

  const handleKecamatanChange = (kec) => {
    const newDesa = TUBAN_DATA[kec]?.[0] || "";
    setProfileData({ ...profileData, kecamatan: kec, desa: newDesa });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!phone || !password) return dialog.alert("Harap isi No. HP dan Password!", "Perhatian");
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user = accounts.find(acc => acc.phone === phone && acc.password === password);
      if (user) { dialog.alert(`Selamat datang kembali, ${user.name}!`, "Sukses"); setProfile(user); } 
      else { dialog.alert("Nomor HP atau Password salah! Atau akun belum terdaftar.", "Login Gagal"); }
    }, 1500);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!phone || !password || !profileData.name || !profileData.rt || !profileData.rw) return dialog.alert("Harap lengkapi semua kolom yang wajib!", "Perhatian");
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const isExist = accounts.some(acc => acc.phone === phone);
      if (isExist) return dialog.alert("Nomor HP ini sudah terdaftar! Silakan gunakan nomor lain atau Masuk.", "Pendaftaran Gagal");
      
      const newAccount = { ...profileData, phone, password };
      setAccounts(prev => [...prev, newAccount]);
      dialog.alert("Pendaftaran Akun Berhasil!", "Sukses");
      setProfile(newAccount);
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dialog.alert(`Otorisasi ${provider} berhasil ditautkan!\n\nSesuai prosedur pendataan wilayah, silakan lengkapi sisa data profil peternakan Anda di bawah ini untuk melanjutkan.`, "Tautkan Akun");
      setIsLogin(false);
      setProfileData(prev => ({ ...prev, name: prev.name || `Pengguna ${provider}` }));
    }, 1200);
  };

  const inp = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 bg-slate-50 focus:bg-white transition-all";

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col overflow-hidden slide-up">
      <div className="pb-6 px-6 bg-white rounded-b-[32px] shadow-sm z-10 relative" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 3rem)' }}>
        <div className="flex justify-center mb-4"><div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center p-3"><img src={logoTuban} alt="Logo Tuban" className="w-full h-full object-contain" /></div></div>
        <h1 className="text-2xl font-black text-center text-slate-900 tracking-tight">PROVERTI</h1>
        <p className="text-[10px] font-bold text-center text-slate-500 uppercase tracking-widest mt-1">Kabupaten Tuban</p>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mt-6">
          <button type="button" onClick={() => setIsLogin(true)} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${isLogin ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"}`}>Masuk</button>
          <button type="button" onClick={() => setIsLogin(false)} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${!isLogin ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"}`}>Daftar Baru</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-12">
        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4 fade-in">
            <FF label="No. Handphone (Aktif WA)"><input type="tel" className={inp} placeholder="Cth: 0812xxxx" value={phone} onChange={e => setPhone(e.target.value)} /></FF>
            <div>
              <FF label="Kata Sandi (Password)">
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} className={inp.replace("px-4", "pl-4 pr-12")} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors">{showPassword ? '🙈' : '👁️'}</button>
                </div>
              </FF>
              <div className="flex justify-between items-center -mt-2">
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" className="w-3.5 h-3.5 accent-emerald-600 rounded border-slate-300" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /><span className="text-[11px] font-bold text-slate-500">Ingat Saya</span></label>
                <button type="button" onClick={() => dialog.alert("Silakan hubungi petugas/admin dinas.", "Bantuan")} className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Lupa Password?</button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-4 rounded-xl mt-4 text-sm shadow-lg shadow-emerald-500/30 transition-all">{isLoading ? "Memproses..." : "Masuk ke Aplikasi"}</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 fade-in pb-10">
            <FF label="No. Handphone (Aktif WA)"><input type="tel" className={inp} value={phone} onChange={e => setPhone(e.target.value)} /></FF>
            <FF label="Buat Kata Sandi"><input type="password" className={inp} value={password} onChange={e => setPassword(e.target.value)} /></FF>
            <div className="h-px bg-slate-200 my-6"></div>
            <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-4">Profil Identitas Peternak</p>
            <FF label="Nama Lengkap Pemilik"><input className={inp} value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} /></FF>
            <FF label="Kecamatan"><select className={inp} value={profileData.kecamatan} onChange={e => handleKecamatanChange(e.target.value)}>{Object.keys(TUBAN_DATA).map(k => <option key={k} value={k}>{k}</option>)}</select></FF>
            <FF label="Desa / Kelurahan"><select className={inp} value={profileData.desa} onChange={e => setProfileData({...profileData, desa: e.target.value})}>{(TUBAN_DATA[profileData.kecamatan] || []).map(d => <option key={d} value={d}>{d}</option>)}</select></FF>
            <FF label="Dusun (Opsional)"><input type="text" className={inp} value={profileData.dusun} onChange={e => setProfileData({...profileData, dusun: e.target.value})} /></FF>
            <div className="flex gap-4"><div className="flex-1"><FF label="RT"><input type="number" className={inp} value={profileData.rt} onChange={e => setProfileData({...profileData, rt: e.target.value})} /></FF></div><div className="flex-1"><FF label="RW"><input type="number" className={inp} value={profileData.rw} onChange={e => setProfileData({...profileData, rw: e.target.value})} /></FF></div></div>
            <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl mt-6 text-sm">{isLoading ? "Memproses..." : "Daftar Akun Baru"}</button>
          </form>
        )}
      </div>
    </div>
  );
}