import React, { useState, useEffect } from "react";
import logoTuban from "./Tubankab.png";

/*
  ========================================
  1. GLOBAL STYLE & THEME - PROVERTI EDITION
  ========================================
*/
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
    
    /* MODERNISED NAV-BAR */
    .nav-bar { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(16px); border-top: 1px solid #e2e8f0; display: flex; justify-content: space-around; padding: 12px 0 max(12px, env(safe-area-inset-bottom)); z-index: 50; box-shadow: 0 -8px 32px rgba(0,0,0,0.06); }
    .nav-item { display: flex; flex-direction: column; align-items: center; font-size: 10px; color: #94a3b8; font-weight: 800; gap: 6px; transition: all 0.3s ease; width: 25%; }
    .nav-item.active { color: #10b981; }
    
    .nav-icon { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
    .nav-item.active .nav-icon { transform: translateY(-3px) scale(1.1); filter: drop-shadow(0 4px 6px rgba(16,185,129,0.3)); }

    .timeline-line { width: 2px; background: #f1f5f9; position: absolute; top: 14px; bottom: 10px; left: 3px; }
    .timeline-item:last-child .timeline-line { display: none; }
    
    .timeline-main-line { position: absolute; left: 24px; top: 0; bottom: 0; width: 2px; background: #f1f5f9; z-index: 0; }
    .timeline-main-item { position: relative; padding-left: 56px; padding-bottom: 24px; z-index: 10; }
    .timeline-main-icon { position: absolute; left: 10px; top: 0; width: 30px; height: 30px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; z-index: 20; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    
    select, input, textarea { appearance: none; -webkit-appearance: none; transition: all 0.2s; }
    select:focus, input:focus, textarea:focus { border-color: #10b981 !important; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }

    .splash-container { position: fixed; inset: 0; background: #000; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.8s ease; overflow: hidden; }

    .highlight-blink {
      animation: highlight-blink-anim 1.5s ease-out 3;
      border-color: #10b981 !important;
    }

    @keyframes highlight-blink-anim {
      0%, 100% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0); }
      50% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0.4); }
    }
  `}</style>
);

/*
  ========================================
  2. CONSTANTS & HELPERS
  ========================================
*/
const todayStr = () => new Date().toISOString().split("T")[0];
const daysDiff = (a, b = new Date()) => Math.floor((new Date(b) - new Date(a)) / 86400000);
const fmtDate = (d) => {
  try { return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "2-digit" }); } 
  catch(e) { return "-"; }
};

const getAge = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const m = Math.floor(daysDiff(dateStr) / 30);
    if (isNaN(m)) return "-";
    const y = Math.floor(m / 12);
    const remM = m % 12;
    if (y > 0) return `${y} Thn ${remM} Bln`;
    return `${m} Bln`;
  } catch(e) { return "-"; }
};

const COLOR = {
  emerald: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200" },
  amber: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200" },
  orange: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
  blue: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
  violet: { bg: "bg-violet-100", text: "text-violet-800", border: "border-violet-200" },
  rose: { bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-200" },
  slate: { bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-200" }
};

/*
  ========================================
  3. LOGIC ENGINE KESEHATAN & REPRODUKSI
  ========================================
*/
function analyzeCattle(item) {
  if (!item) return { color: "slate", statusLabel: "ERROR", advice: "Data tidak valid", isUrgent: false, adviceColor: "text-slate-600 bg-slate-50" };

  try {
    const today = new Date();
    let res = { color: "slate", statusLabel: "", advice: "", isUrgent: false, adviceColor: "text-slate-600 bg-slate-50" };

    const umurHari = item.birthDate ? daysDiff(item.birthDate) : 0;
    const isJantan = item.gender === "JANTAN";

    const activeIllness = (item.healthLog || []).find(h => h.status === "SAKIT");
    if (activeIllness) {
       res.isUrgent = true;
       const isBelumDiperiksa = activeIllness.treatment?.includes("Menunggu pemeriksaan");
       res.statusLabel = isBelumDiperiksa ? "BUTUH PEMERIKSAAN MEDIS" : "DALAM PERAWATAN MEDIS";
       res.color = isBelumDiperiksa ? "orange" : "rose";
       
       let cleanKondisi = (activeIllness.kondisi || "").replace(/\[.*?\]\s*/, '').trim(); 
       res.advice = isBelumDiperiksa 
          ? `KELUHAN: ${cleanKondisi}` 
          : `DIAGNOSA: ${cleanKondisi}. (Tindakan: ${activeIllness.treatment})`;
          
       res.adviceColor = isBelumDiperiksa
          ? "text-orange-900 bg-orange-50 border border-orange-200 font-semibold shadow-sm"
          : "text-rose-900 bg-rose-50 border border-rose-200 font-semibold shadow-sm";
       return res; 
    }

    if (isJantan) {
        if (umurHari < 180) {
            res.statusLabel = "PEDET JANTAN"; res.color = "violet"; res.advice = "Fokus susu & pakan pemula. Jaga kebersihan kandang dari diare/scours.";
        } else if (umurHari < 730) {
            res.statusLabel = "JANTAN BAKALAN"; res.color = "blue"; res.advice = "Fase penggemukan (Feedlot). Tingkatkan pakan konsentrat energi tinggi.";
        } else {
            res.statusLabel = "PEJANTAN DEWASA"; res.color = "emerald"; res.advice = "Bobot panen optimal. Siap untuk dipasarkan atau dijadikan pejantan pemacek.";
        }
        return res;
    }

    const daysOpen = item.calvingDate ? daysDiff(item.calvingDate) : 0;
    const logIB = [...(item.ibLog || [])].sort((a,b) => new Date(a) - new Date(b));
    const lastIB = logIB.length > 0 ? logIB[logIB.length - 1] : null;
    const prevIB = logIB.length > 1 ? logIB[logIB.length - 2] : null;
    const daysSinceLastIB = lastIB ? daysDiff(lastIB) : 0;

    let cycles = 1; let diffPrevLast = 0;
    if (prevIB && lastIB) diffPrevLast = Math.floor((new Date(lastIB) - new Date(prevIB))/86400000);
    
    if (logIB.length > 1) {
      let tempLast = new Date(logIB[0]);
      for (let i = 1; i < logIB.length; i++) {
         let diff = Math.floor((new Date(logIB[i]) - tempLast) / 86400000);
         if (diff >= 15) cycles++; 
         tempLast = new Date(logIB[i]);
      }
    }

    let hasIbAfterCalving = lastIB && (!item.calvingDate || new Date(lastIB) > new Date(item.calvingDate));

    if (item.phase === "CALF") {
      if (!item.calvingDate && umurHari > 1095) { 
        res.statusLabel = "AWAS: KEMAJIRAN ABSOLUT"; res.color = "rose"; res.isUrgent = true; res.advice = `Sapi Dara > 3 tahun belum birahi. Suspect Hipoplasia Ovarium akut.`; res.adviceColor = "text-rose-900 bg-rose-50 border border-rose-200 font-bold shadow-sm";
      } else if (umurHari > 730) { 
        res.statusLabel = "AWAS: DARA TERLAMBAT KAWIN"; res.color = "orange"; res.isUrgent = true; res.advice = `Umur > 2 tahun belum di-IB. Panggil dokter.`; res.adviceColor = "text-orange-900 bg-orange-50 border border-orange-200 font-bold shadow-sm";
      } else if (umurHari >= 540) {
        res.statusLabel = "DARA SIAP KAWIN"; res.color = "emerald"; res.advice = "Usia ideal IB (18-24 bulan). Pantau birahi.";
      } else {
        res.statusLabel = "DARA PERTUMBUHAN"; res.color = "blue"; res.advice = "Masa Pra-pubertas. Kejar bobot harian ideal.";
      }
    } 
    else if (item.phase === "OPEN") {
      if (item.calvingDate && daysOpen > 150 && !hasIbAfterCalving) {
        res.statusLabel = "AWAS: SUSPECT PYOMETRA"; res.color = "rose"; res.isUrgent = true; res.advice = `Kosong > 5 bulan. Waspada penumpukan nanah rahim.`; res.adviceColor = "text-rose-800 bg-rose-50 border border-rose-200 font-bold shadow-sm";
      } else if (item.calvingDate && daysOpen > 120) {
        res.statusLabel = "AWAS: KOSONG > 120 HARI"; res.color = "rose"; res.isUrgent = true; res.advice = `Kosong ${daysOpen} hari pasca melahirkan.`; res.adviceColor = "text-rose-800 bg-rose-50 border border-rose-200 font-bold shadow-sm";
      } else {
        res.statusLabel = "SIAP IB"; res.color = "amber"; res.advice = "Fase Kosong. Pantau tanda 3A (Abang, Abuh, Anget).";
      }
    } 
    else if (item.phase === "BRED") {
      if (cycles >= 3) {
        res.color = "rose"; res.statusLabel = "REPEAT BREEDER"; res.isUrgent = true; res.advice = `Gagal pada ${cycles} siklus. Butuh terapi.`; res.adviceColor = "text-rose-800 bg-rose-50 border border-rose-200 font-bold shadow-sm";
      } else if (diffPrevLast >= 5 && diffPrevLast <= 7) {
        res.color = "rose"; res.statusLabel = "SUSPECT SISTA OVARIUM"; res.isUrgent = true; res.advice = `Birahi terlalu cepat (${diffPrevLast} hari). Suspect Sista.`; res.adviceColor = "text-rose-800 bg-rose-50 border border-rose-200 font-bold shadow-sm";
      } else if (daysSinceLastIB < 60) {
        res.color = "slate"; res.statusLabel = "SUSPECT BUNTING"; res.advice = `H+${daysSinceLastIB} pasca IB. Jangan dirogoh manual!`;
      } else {
        res.color = "orange"; res.statusLabel = "WAKTUNYA PKB"; res.isUrgent = true; res.advice = `JADWAL PKB! Lapor hasil via menu Reproduksi.`; res.adviceColor = "text-orange-900 bg-orange-50 border border-orange-200 font-bold shadow-sm";
      }
    } 
    else if (item.phase === "PREGNANT") {
      if (!item.conceptionDate) {
         res.color = "orange"; res.statusLabel = "BUNTING (BELUM PKB)"; res.isUrgent = true; res.advice = `Sapi bunting pasar. Wajib lapor hasil PKB Dokter.`; res.adviceColor = "text-orange-900 bg-orange-50 border border-orange-200 font-semibold shadow-sm";
      } else {
         const hpl = new Date(item.conceptionDate); 
         if (isNaN(hpl.getTime())) throw new Error("Invalid date"); 
         hpl.setMonth(hpl.getMonth() + 9); hpl.setDate(hpl.getDate() + 10);
         const l = Math.ceil((hpl - today) / 86400000); const pregDays = daysDiff(item.conceptionDate);
         let txtHPL = `HPL: ${fmtDate(hpl.toISOString().split("T")[0])} (±${l} hr).`;

         if (pregDays >= 285) {
            res.color = "rose"; res.statusLabel = "ANCAMAN DISTOKIA"; res.isUrgent = true; res.advice = `KANDUNGAN TUA! Siagakan tenaga medis.`; res.adviceColor = "text-rose-900 bg-rose-50 border border-rose-200 font-bold shadow-sm";
         } else if (l <= 60 && l > 21) {
            res.color = "amber"; res.statusLabel = "KERING KANDANG"; res.isUrgent = true; res.advice = `${txtHPL} Segera hentikan perah susu!`; res.adviceColor = "text-amber-900 bg-amber-50 border border-amber-200 font-semibold shadow-sm";
         } else {
            res.color = "emerald"; res.statusLabel = "BUNTING AKTIF"; res.advice = `${txtHPL} Jaga komposisi pakan.`;
         }
      }
    } 
    else if (item.phase === "POSTPARTUM") {
      const d = daysDiff(item.calvingDate);
      if (d <= 14) {
        res.statusLabel = "PUERPERIUM (NIFAS)"; res.color = "rose"; res.isUrgent = true; res.advice = `Waspada Lokia bau busuk / Retensio Secundinarum.`; res.adviceColor = "text-rose-900 bg-rose-50 border border-rose-200 font-semibold shadow-sm";
      } else if (d <= 45) {
        res.statusLabel = "INVOLUSI UTERUS"; res.color = "blue"; res.advice = `Rahim sedang pemulihan. DILARANG suntik IB.`;
      } else {
        res.statusLabel = "BREEDING WINDOW"; res.color = "emerald"; res.advice = `Sapi siap di-IB kembali.`;
      }
    }
    return res;
  } catch (error) {
    return { color: "rose", statusLabel: "DATA ERROR", advice: "Format tanggal atau riwayat sapi ini tidak valid.", isUrgent: true, adviceColor: "text-rose-900 bg-rose-50" };
  }
}

/*
  ========================================
  4. UI COMPONENTS (CORE)
  ========================================
*/
const FF = ({ label, children }) => (<div className="mb-4"><p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{label}</p>{children}</div>);

function TimelineItem({ log, isLast }) {
  return (
    <div className="timeline-item flex gap-4 relative pb-5">
      {!isLast && <div className="timeline-line"></div>}
      <div className="relative z-10 mt-1"><div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${log.colorDot || "bg-slate-300"}`}></div></div>
      <div className="flex-1">
        <div className="flex justify-between items-start"><p className="text-xs font-bold text-slate-800">{log.label}</p><p className="text-[10px] font-medium text-slate-400">{fmtDate(log.date)}</p></div>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{log.desc}</p>
      </div>
    </div>
  );
}

function buildHistory(item) { 
  let history = []; 
  try {
    (item.ibLog || []).forEach((d, i) => history.push({ type: 'ibLog', originalIndex: i, date: d, label: `IB ke-${i + 1}`, desc: "Inseminasi Buatan", colorDot: "bg-blue-500", rawDate: new Date(d) })); 
    (item.pkbLog || []).forEach((log, i) => history.push({ type: 'pkbLog', originalIndex: i, date: log.date, label: `PKB: ${log.result === "POSITIVE" ? "Positif (+)" : "Negatif (-)"}`, desc: log.result === "POSITIVE" ? "Disahkan Bunting" : "Tidak Bunting", colorDot: log.result === "POSITIVE" ? "bg-emerald-500" : "bg-rose-500", rawDate: new Date(log.date) })); 
    (item.calvingLog || []).forEach((d, i) => history.push({ type: 'calvingLog', originalIndex: i, date: d, label: "Partus", desc: "Kelahiran Pedet", colorDot: "bg-violet-500", rawDate: new Date(d) }));
    (item.healthLog || []).forEach((l, i) => {
      const isSembuh = l.status === "SEMBUH"; let labelTxt = l.treatment?.includes("Menunggu pemeriksaan") ? `Gejala: ${l.kondisi}` : l.kondisi;
      history.push({ type: 'healthLog', originalIndex: i, date: l.date, label: isSembuh ? `✅ Sembuh: ${labelTxt}` : labelTxt, desc: l.treatment, colorDot: isSembuh ? "bg-emerald-500" : "bg-rose-500", rawDate: new Date(l.date), status: l.status || "SAKIT" });
    });
    if (item.birthDate) history.push({ type: 'birthDate', originalIndex: 0, date: item.birthDate, label: "Lahir / Masuk", desc: item.origin === "KANDANG" ? "Lahir di kandang" : "Beli", colorDot: "bg-slate-300", rawDate: new Date(item.birthDate) }); 
    return history.sort((a, b) => (b.rawDate || 0) - (a.rawDate || 0)); 
  } catch(e) { return []; }
}

function AdviceCard({ item, analysis, onClick }) {
  if (!item || !analysis || !analysis.advice) return null;

  const c = COLOR[analysis.color] || COLOR.slate;
  const icon = analysis.isUrgent ? '⚠️' : '💡';

  return (
    <div onClick={() => onClick(item)} className="bg-white p-4 rounded-2xl shadow-sm flex items-start gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors border border-slate-100 hover:border-slate-200">
      <div className={`w-9 h-9 rounded-xl ${c.bg} flex-shrink-0 flex items-center justify-center mt-0.5`}>
        <span className="text-lg">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sapi {item.id}</p>
        <p className="text-sm font-semibold text-slate-800 leading-snug mt-1">
          {analysis.advice.replace(/⚠️|🚨|💡|✅/g, '').trim()}
        </p>
      </div>
    </div>
  );
}

function DetailModal({ item, onClose, onDeleteLog }) {
  const [confirmDelete, setConfirmDelete] = useState(null);
  if (!item) return null;
  const history = buildHistory(item);

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full rounded-t-[32px] slide-up h-[92vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-center pt-3 pb-1"><div className="w-12 h-1.5 bg-slate-200 rounded-full"></div></div>
        <div className="flex justify-between items-center p-6 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-black text-3xl text-slate-900 tracking-tight">{item.id}</h3>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">{item.gender === 'JANTAN' ? 'Jantan' : 'Betina'} • {item.ras} • {item.phase}</p>
          </div>
          <button onClick={onClose} className="bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center font-bold text-slate-500 hover:bg-slate-200 transition-colors">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 relative">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 ml-2">Recording Kronologis Lengkap</h4>
          <div className="relative">
            <div className="timeline-main-line"></div>
            {history.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-10 font-medium">Belum ada catatan.</p>
            ) : (
              history.map((log, index) => (
                <div key={index} className="timeline-main-item">
                  <div className={`timeline-main-icon ${log.colorDot}`} style={{left: "10px", width: "30px", height: "30px", color: "white", fontSize: "14px"}}></div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-1.5">
                      <p className="font-extrabold text-sm text-slate-800">{log.label}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold text-slate-400">{fmtDate(log.date)}</p>
                        {log.type !== 'birthDate' && onDeleteLog && (
                          confirmDelete === index ? (
                            <div className="flex items-center gap-1 pop-in">
                              <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(null); }} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-bold hover:bg-slate-200">Batal</button>
                              <button onClick={(e) => { e.stopPropagation(); onDeleteLog(item.id, log.type, log.originalIndex); setConfirmDelete(null); }} className="text-[10px] bg-rose-500 text-white px-2 py-1 rounded-lg font-bold hover:bg-rose-600 shadow-sm">Yakin?</button>
                            </div>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(index); }} className="text-slate-300 hover:text-rose-500 transition-colors p-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                          )
                        )}
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">{log.desc}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AssetRecordCard({ item, onEdit, onOpenAction, onOpenDetail, onDelete, highlightedId, setHighlightedId }) {
  if (!item) return null;
  const analysis = analyzeCattle(item);
  const c = COLOR[analysis.color] || COLOR.slate;
  const history = buildHistory(item);
  const recentHistory = history.slice(0, 2);
  const cardRef = React.useRef(null);
  const isHighlighted = highlightedId === item.id;

  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const timer = setTimeout(() => {
        if (setHighlightedId) setHighlightedId(null);
      }, 4500); // Animation is 1.5s * 3
      return () => clearTimeout(timer);
    }
  }, [isHighlighted, setHighlightedId]);

  return (
    <div ref={cardRef} className={`bg-white rounded-3xl border shadow-sm overflow-hidden mb-4 hover:shadow-md transition-shadow cursor-pointer ${isHighlighted ? 'highlight-blink' : 'border-slate-100'}`} onClick={() => onOpenDetail && onOpenDetail(item)}>
      <div className="p-5 border-b border-slate-50 bg-white">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{item.id || "?"}</h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-bold uppercase tracking-widest">
              {item.gender === "JANTAN" ? "♂️ JANTAN" : "♀️ BETINA"} • {item.ras || "Sapi"}
            </span>
          </div>
          <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-xl ${c.bg} ${c.text} uppercase tracking-widest text-center leading-tight`}>{analysis.statusLabel}</span>
        </div>
        <p className="text-xs text-slate-500 font-medium">Usia: <span className="font-bold text-slate-800">{getAge(item.birthDate)}</span></p>
      </div>
      <div className={`px-5 py-3.5 text-[11px] leading-relaxed border-b border-slate-50 ${analysis.adviceColor}`}>
        <div className="flex gap-2.5 items-start">
           <span className="text-base mt-0.5">{analysis.isUrgent ? '⚠️' : '💡'}</span>
           <span className="font-medium">{analysis.advice}</span>
        </div>
      </div>
      <div className="p-5 pb-3">
        <div className="pl-1">
          {recentHistory.length === 0 ? <p className="text-xs text-slate-400 italic">Belum ada rekam medis/aksi.</p> : recentHistory.map((log, i) => <TimelineItem key={i} log={log} isLast={i === recentHistory.length - 1} />)}
        </div>
      </div>
      <div className="bg-slate-50/50 px-5 py-4 flex gap-3 border-t border-slate-100">
        <button onClick={(e) => { e.stopPropagation(); if(onOpenAction) onOpenAction(item); }} className="flex-1 bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-800 shadow-sm transition-colors">Lapor Aksi Terpadu</button>
        {onEdit && <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} className="bg-white border border-slate-200 text-slate-600 px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-sm transition-colors">Edit</button>}
        {onDelete && <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="bg-rose-50 border border-rose-200 text-rose-600 px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-100 shadow-sm transition-colors">Hapus</button>}
      </div>
    </div>
  );
}

/*
  ========================================
  5. SINGLE WINDOW REPORTING MODAL (Lapor Aksi)
  ========================================
*/
function ActionModal({ open, item, onClose, onSaveRepro, onSaveHealth }) {
  const [tab, setTab] = useState("KESEHATAN");
  const [resRepro, setResRepro] = useState("NONE"); 
  const [dRepro, setDRepro] = useState(todayStr()); 
  const [isUSG, setIsUSG] = useState(false);
  const [pregMonth, setPregMonth] = useState("");
  const [dHealth, setDHealth] = useState(todayStr());
  const [kondisi, setKondisi] = useState("");
  const [diagnosa, setDiagnosa] = useState("");
  const [tindakan, setTindakan] = useState("");
  const [statusHealth, setStatusHealth] = useState("SAKIT");

  useEffect(() => {
    if(open) { 
      setTab(item?.gender === "JANTAN" ? "KESEHATAN" : "REPRO");
      setResRepro("NONE"); setDRepro(todayStr()); setIsUSG(false); setPregMonth("");
      setDHealth(todayStr()); setKondisi(""); setDiagnosa(""); setTindakan(""); setStatusHealth("SAKIT");
    }
  }, [open, item]);

  if (!open || !item) return null;

  const handleSaveRepro = () => {
    if (item.gender === "JANTAN") return alert("Sapi jantan tidak memiliki siklus reproduksi!");
    if (resRepro === "CALVED" && !dRepro) return alert("Isi tanggal beranak!");
    if (resRepro === "IB" && !dRepro) return alert("Isi tanggal IB!");
    if (resRepro === "IB" && item.phase === "PREGNANT") return alert("Sapi ini sudah BUNTING. Jangan di-IB lagi!");
    if (resRepro === "NONE") return alert("Pilih opsi reproduksi!");

    const sortedIB = [...(item.ibLog || [])].sort((a, b) => new Date(a) - new Date(b));
    const lastIB = sortedIB.length > 0 ? sortedIB[sortedIB.length - 1] : todayStr();
    const dPreg = Math.floor((new Date(dRepro) - new Date(lastIB)) / 86400000); 
    const isPasarNoHPL = item.phase === "PREGNANT" && item.origin === "PASAR" && !item.conceptionDate;

    if ((resRepro === "POSITIVE" || resRepro === "NEGATIVE") && item.phase !== "OPEN" && !isPasarNoHPL) {
      if (!isUSG && dPreg < 60) return alert(`GAGAL: Pemeriksaan manual di bawah 60 hari berisiko EED. Gunakan USG! Usia IB baru ${dPreg} hari.`);
      if (isUSG && dPreg < 25) return alert(`GAGAL: Terlalu dini! USG baru efektif >25 hari pasca IB.`);
    }
    if (onSaveRepro) onSaveRepro(resRepro, pregMonth, dRepro, isUSG);
    if (onClose) onClose();
  };

  const handleSaveHealth = () => {
    if (!kondisi) return alert("Sebutkan keluhan visual!");
    if (onSaveHealth) onSaveHealth(dHealth, kondisi, diagnosa, tindakan, statusHealth);
    if (onClose) onClose();
  };

  const inp = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 bg-slate-50 focus:bg-white transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 slide-up shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <div><p className="font-black text-xl text-slate-900 tracking-tight">Lapor Aksi Terpadu</p><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">ID: {item.id} • {item.gender}</p></div>
          <button onClick={onClose} className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-slate-500 hover:bg-slate-200">✕</button>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
          <button onClick={() => setTab("KESEHATAN")} className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${tab === "KESEHATAN" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}>🩺 Medis & Kesehatan</button>
          <button onClick={() => { if(item.gender === "JANTAN") alert("Menu Reproduksi khusus betina indukan."); else setTab("REPRO"); }} className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${tab === "REPRO" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"} ${item.gender === "JANTAN" ? "opacity-50 cursor-not-allowed" : ""}`}>🧬 Reproduksi</button>
        </div>
        {tab === "KESEHATAN" && (
          <div className="space-y-4 fade-in">
            <FF label="Tanggal Periksa / Lapor"><input type="date" className={inp} value={dHealth} onChange={e => setDHealth(e.target.value)} /></FF>
            <FF label="Gejala Keluhan / Observasi (Wajib)"><textarea className={inp + " h-20 resize-none"} value={kondisi} onChange={e => setKondisi(e.target.value)} placeholder="Contoh: Kaki pincang, nafsu makan turun..." /></FF>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
               <p className="text-[10px] font-extrabold text-blue-600 mb-3 uppercase tracking-widest">Aksi Dokter / Petugas Medis</p>
               <FF label="Diagnosa Penyakit (Opsional)"><input className={inp} value={diagnosa} onChange={e => setDiagnosa(e.target.value)} placeholder="Contoh: PMK / BEF / Scours" /></FF>
               <FF label="Tindakan & Obat (Opsional)"><input className={inp} value={tindakan} onChange={e => setTindakan(e.target.value)} placeholder="Contoh: Injeksi Vitamin & Antibiotik" /></FF>
               <FF label="Status Akhir Pasien"><select className={inp} value={statusHealth} onChange={e => setStatusHealth(e.target.value)}><option value="SAKIT">Masih Sakit (Butuh Pantauan)</option><option value="SEMBUH">Sembuh Total</option></select></FF>
            </div>
            <button onClick={handleSaveHealth} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl mt-4 text-sm shadow-lg shadow-blue-500/30">Simpan Rekam Medis</button>
          </div>
        )}
        {tab === "REPRO" && item.gender === "BETINA" && (
          <div className="space-y-4 fade-in">
            <FF label="Tanggal Kejadian Aksi"><input type="date" className={inp} value={dRepro} onChange={e => setDRepro(e.target.value)} /></FF>
            <FF label="Jenis Laporan Reproduksi">
              <select className={inp} value={resRepro} onChange={e => setResRepro(e.target.value)}>
                <option value="NONE">-- Pilih Aksi --</option><option value="IB">Lapor Inseminasi Buatan (IB)</option><option value="NEGATIVE">PKB: Negatif / Tidak Bunting</option><option value="POSITIVE">PKB: Positif Bunting (+)</option><option value="CALVED">Lapor Kelahiran (Partus)</option>
              </select>
            </FF>
            {(resRepro === "POSITIVE" || resRepro === "NEGATIVE") && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 pop-in mb-4">
                <input type="checkbox" id="usg_check" className="w-5 h-5 accent-emerald-600 rounded cursor-pointer" checked={isUSG} onChange={(e) => setIsUSG(e.target.checked)} />
                <label htmlFor="usg_check" className="text-xs font-black text-emerald-800 cursor-pointer uppercase tracking-tight flex-1">Pemeriksaan Menggunakan Alat USG</label>
              </div>
            )}
            {resRepro === "POSITIVE" && item.phase === "PREGNANT" && item.origin === "PASAR" && !item.conceptionDate && (
              <FF label="Estimasi Usia Bunting Dokter (Bulan)"><input type="number" className={inp} value={pregMonth} onChange={e => setPregMonth(e.target.value)} placeholder="Contoh: 4" /></FF>
            )}
            <button onClick={handleSaveRepro} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl mt-4 text-sm shadow-lg shadow-emerald-500/30">Simpan Aksi Repro</button>
          </div>
        )}
      </div>
    </div>
  );
}

function AcademyView() {
  const [openTermId, setOpenTermId] = useState(null);

  const dayOrder = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const todayName = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
  const todayIndex = dayOrder.indexOf(todayName);

  const weeklySchedule = [
    { day: "Selasa", time: "19:30 WIB", title: "Optimalisasi Siklus Birahi & IB", level: "Manajemen Reproduksi", instructor: "Drh. Budi Santoso", levelColor: "bg-blue-100 text-blue-800", zoomLink: "https://zoom.us/j/1234567890" },
    { day: "Rabu", time: "19:30 WIB", title: "Formulasi Pakan Efisien", level: "Manajemen Pakan", instructor: "Dr. A. Nurrakhman", levelColor: "bg-amber-100 text-amber-800", zoomLink: "https://zoom.us/j/1234567890" },
    { day: "Kamis", time: "19:30 WIB", title: "Pencegahan Penyakit Metabolik", level: "Manajemen Kesehatan", instructor: "Prof. Dr. drh. Candra", levelColor: "bg-emerald-100 text-emerald-800", zoomLink: "https://zoom.us/j/1234567890" },
  ];

  const sortedSchedule = [...weeklySchedule].sort((a, b) => {
    const dayIndexA = dayOrder.indexOf(a.day);
    const dayIndexB = dayOrder.indexOf(b.day);
    const isPastA = dayIndexA < todayIndex;
    const isPastB = dayIndexB < todayIndex;
    const isTodayA = dayIndexA === todayIndex;
    const isTodayB = dayIndexB === todayIndex;

    if (isTodayA && !isTodayB) return -1;
    if (!isTodayA && isTodayB) return 1;
    if (isPastA && !isPastB) return 1;
    if (!isPastA && isPastB) return -1;
    return dayIndexA - dayIndexB;
  });

  const medicalTerms = [
      { id: 1, name: "Retensio Secundinarum", alias: "KEGAGALAN PELEPASAN PLASENTA (ARI-ARI)", gejala: "Plasenta (selaput pembungkus janin) masih tertahan di dalam rahim atau menggantung di vulva lebih dari 12 jam pasca persalinan.", bahaya: "Memicu infeksi rahim parah (Endometritis), penyebaran bakteri ke dalam sirkulasi darah (Septikemia), penurunan fertilitas, hingga risiko kematian jika ditarik paksa.", solusi: "Sangat dilarang ditarik secara paksa. Segera hubungi Dokter Hewan untuk prosedur pelepasan manual yang aman dan pemberian terapi antibiotik." },
      { id: 2, name: "Endometritis & Pyometra", alias: "RADANG DAN AKUMULASI NANAH PADA UTERUS", gejala: "Terdapat leleran abnormal (keruh, purulen/bernanah, berdarah, atau berbau busuk) dari vulva. Pada kasus Pyometra, serviks tertutup sehingga nanah terakumulasi di dalam rahim.", bahaya: "Menciptakan lingkungan toksik bagi spermatozoa dan embrio. Menyebabkan kegagalan kebuntingan secara berulang dan kerusakan jaringan dinding rahim.", solusi: "Memerlukan penanganan medis spesifik berupa irigasi uterus (Uterine Spooling) dengan antiseptik ringan dan pemberian antibiotik intra-uterin oleh tenaga medis." },
      { id: 3, name: "Hipofungsi Ovarium", alias: "PENURUNAN AKTIVITAS INDUNG TELUR (ANESTRUS)", gejala: "Sapi betina dewasa atau induk pascapartus tidak menunjukkan tanda-tanda siklus estrus (birahi) dalam jangka waktu yang melebihi batas normal.", bahaya: "Mengakibatkan kerugian ekonomi yang signifikan akibat perpanjangan masa kosong (Days Open). Sapi mengonsumsi pakan tanpa memberikan hasil produksi reproduksi.", solusi: "Evaluasi dan perbaiki manajemen nutrisi (program Flushing). Konsultasikan dengan tenaga medis veteriner untuk stimulasi ovarium atau penyuntikan terapi hormonal." },
      { id: 4, name: "Corpus Luteum Persisten (CLP)", alias: "BERTAHANNYA KORPUS LUTEUM PADA FASE KOSONG", gejala: "Sapi mengalami anestrus (tidak birahi) berkepanjangan. Pada pemeriksaan palpasi rektal, uterus tidak berisi janin, namun terdapat struktur Korpus Luteum pada ovarium.", bahaya: "Korpus Luteum terus memproduksi hormon progesteron, mengondisikan sistem endokrin sapi seolah-olah sedang bunting (kebuntingan semu), padahal uterus dalam keadaan kosong.", solusi: "Pemeriksaan medis wajib dilakukan untuk memastikan diagnosis, dilanjutkan dengan injeksi hormon Prostaglandin (PGF2α) oleh Dokter Hewan untuk melisiskan struktur tersebut." },
      { id: 5, name: "Sista Ovarium (Cystic Ovary)", alias: "KISTA FOLIKEL ATAU LUTEAL PADA OVARIUM", gejala: "Sapi dapat mengalami birahi terus-menerus dan agresif (Nymphomania) pada kasus kista folikuler, atau sebaliknya, mengalami anestrus total pada kasus kista luteal.", bahaya: "Terjadi kegagalan pelepasan sel telur (ovulasi) akibat terbentuknya struktur patologis berisi cairan di ovarium. Menghentikan siklus reproduksi normal ternak.", solusi: "Diagnosis definitif melalui palpasi rektal atau ultrasonografi (USG) oleh Dokter Hewan, diikuti dengan terapi hormon pelepas gonadotropin (GnRH / hCG)." },
      { id: 6, name: "Repeat Breeder", alias: "KEGAGALAN KEBUNTINGAN BERTURUT-TURUT", gejala: "Sapi betina memiliki siklus estrus yang normal (18-21 hari) dan telah diinseminasi lebih dari tiga siklus berturut-turut, namun senantiasa gagal mencapai kebuntingan.", bahaya: "Memperpanjang interval kelahiran (Calving Interval), meningkatkan biaya operasional IB, serta menurunkan efisiensi reproduksi peternakan secara drastis.", solusi: "Hentikan Inseminasi Buatan sementara. Minta evaluasi komprehensif dari Dokter Hewan untuk mendeteksi kemungkinan infeksi sub-klinis atau abnormalitas saluran reproduksi." },
      { id: 7, name: "Distokia", alias: "KESULITAN DALAM PROSES PERSALINAN (PARTUS)", gejala: "Induk sapi mengalami kontraksi yang intens, kantung ketuban telah pecah, namun fetus (janin) tertahan di jalan lahir dalam waktu yang lama dan tidak dapat keluar secara alami.", bahaya: "Berisiko fatal menyebabkan hipoksia (kekurangan oksigen) pada janin, robeknya saluran reproduksi induk, hingga kematian akibat trauma anatomis dan kelelahan akut.", solusi: "Kondisi gawat darurat. Segera hubungi tenaga medis veteriner untuk tindakan reposisi janin, traksi terkontrol, atau pembedahan sesar (Sectio Caesarea)." },
      { id: 8, name: "Prolapsus Uteri / Vagina", alias: "PEMBALIKAN DAN KELUARNYA MASA UTERUS", gejala: "Jaringan organ reproduksi bagian dalam (rahim atau vagina) mengalami eversi (terbalik) dan terburai keluar melalui vulva, umumnya terjadi sesaat setelah proses melahirkan.", bahaya: "Sangat mengancam jiwa. Jaringan mukosa yang terekspos lingkungan luar akan cepat mengalami nekrosis (kematian sel), memicu syok septik dan pendarahan masif yang mematikan.", solusi: "Lindungi jaringan yang keluar dengan kain bersih yang dibasahi air dingin/es untuk meminimalkan edema. Segera panggil Dokter Hewan untuk tindakan reposisi bedah." },
      { id: 9, name: "Early Embryonic Death (EED)", alias: "KEMATIAN EMBRIO PADA FASE AWAL KEBUNTINGAN", gejala: "Sapi diasumsikan bunting pasca IB, namun tiba-tiba kembali menunjukkan tanda estrus pada interval waktu yang tidak beraturan (misalnya pada hari ke-35 atau 45).", bahaya: "Fertilisasi sel telur sebenarnya terjadi, namun embrio gagal bertahan dan terabsorpsi oleh rahim. Sering disebabkan oleh stres panas lingkungan, mikotoksin, atau genetik resesif.", solusi: "Evaluasi kualitas pakan dan manajemen termal kandang. Pastikan asupan mineral mikro tercukupi dan konsultasikan dengan petugas medis untuk evaluasi kualitas semen." },
      { id: 10, name: "Abortus", alias: "PENGELUARAN JANIN SEBELUM WAKTUNYA (PREMATUR)", gejala: "Terkeluarnya janin dalam kondisi mati sebelum mencapai usia kebuntingan normal (umumnya terjadi pada trimester kedua hingga awal trimester ketiga).", bahaya: "Abortus dapat menjadi indikator utama penyakit infeksius seperti Brucellosis, yang bersifat zoonosis (dapat menular ke peternak) dan menyebar dengan cepat di dalam kawanan.", solusi: "Segera isolasi induk sapi. Kubur janin dan plasenta yang gugur sesuai prosedur biosekuriti. Lapor kepada instansi kesehatan hewan terkait untuk pengujian serologis (RBT)." },
      { id: 11, name: "Hipokalsemia (Paresis Puerperalis)", alias: "DEFISIENSI KALSIUM DARAH PASCAPARTUS", gejala: "Induk sapi pasca melahirkan mengalami kelemahan ekstremitas, tremor otot, leher menekuk ke belakang (S-shape), dan berakhir pada kelumpuhan flaksid (tidak mampu berdiri).", bahaya: "Terjadi penurunan drastis kadar kalsium darah akibat tingginya sintesis kolostrum. Apabila tidak mendapat intervensi cepat, sapi akan mengalami koma dan kematian kardiovaskular.", solusi: "Tindakan darurat medis mutlak diperlukan berupa pemberian sediaan Kalsium boroglukonat secara intravena (infus pembuluh darah) perlahan oleh Dokter Hewan." },
      { id: 12, name: "Freemartin", alias: "KEMANDULAN PADA BETINA KEMBAR BEDA KELAMIN", gejala: "Anak sapi (pedet) betina terlahir kembar dengan pedet jantan. Saat mencapai usia dewasa, betina tersebut memiliki vulva hipoplastik (kecil) dan tidak menunjukkan siklus reproduksi.", bahaya: "Lebih dari 90% pedet betina pada kondisi ini dipastikan steril (mandul) akibat paparan hormon androgen (testosteron) dari kembar jantannya selama fase organogenesis embrional.", solusi: "Kondisi anomali anatomi ini tidak dapat diterapi. Betina tersebut sebaiknya tidak dipelihara sebagai calon indukan (replacement heifer), melainkan dialokasikan untuk sapi pedaging." }
  ];

  return (
    <div className="p-5 pb-28 fade-in bg-slate-50 min-h-screen">
      <div className="mb-6 mt-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Akademi</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">Kurikulum cerdas peternak mandiri.</p>
      </div>

      {/* JADWAL WEBINAR MINGGUAN */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4 ml-1">
          <span className="text-2xl">🗓️</span>
          <div>
            <h2 className="font-black text-slate-900 text-lg tracking-tight">Jadwal Webinar Mingguan</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Live via Zoom Meeting</p>
          </div>
        </div>
        <div className="space-y-3">
          {sortedSchedule.map((session, index) => {
            const dayIndex = dayOrder.indexOf(session.day);
            const isToday = dayIndex === todayIndex;
            const isPast = dayIndex < todayIndex;

            return (
              <div key={index} className={`border rounded-[20px] p-4 shadow-sm flex items-center gap-4 transition-all ${isToday ? 'bg-white border-emerald-400 ring-4 ring-emerald-100' : isPast ? 'bg-slate-100 border-slate-200 opacity-70' : 'bg-white border-slate-100'}`}>
                <div className="text-center w-16 flex-shrink-0">
                  <p className={`font-black text-lg leading-none ${isToday ? 'text-emerald-600' : isPast ? 'text-slate-500' : 'text-slate-800'}`}>{session.day}</p>
                  <p className={`text-xs font-bold mt-1 ${isToday || !isPast ? 'text-emerald-600' : 'text-slate-400'}`}>{session.time}</p>
                </div>
                <div className="w-px bg-slate-200 self-stretch mx-2"></div>
                <div className="flex-1">
                  {isToday && <span className="bg-emerald-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-widest inline-block mb-2 animate-pulse">LIVE HARI INI</span>}
                  <span className={`${isPast ? 'bg-slate-200 text-slate-600' : session.levelColor} text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-widest inline-block mb-1.5`}>{session.level}</span>
                  <h4 className={`font-extrabold text-sm leading-snug ${isPast ? 'text-slate-500' : 'text-slate-800'}`}>{session.title}</h4>
                  <p className={`text-[11px] font-semibold mt-1 ${isPast ? 'text-slate-400' : 'text-slate-500'}`}>oleh {session.instructor}</p>
                </div>
                {isPast ? (
                  <button disabled className="font-bold text-xs px-4 py-3 rounded-xl bg-slate-200 text-slate-500 cursor-not-allowed">
                    Selesai
                  </button>
                ) : (
                  <a href={session.zoomLink} target="_blank" rel="noopener noreferrer" className={`font-bold text-xs px-4 py-3 rounded-xl transition-colors shadow-md ${isToday ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30' : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20'}`}>
                    Join Zoom
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* KAMUS MEDIS */}
      <div className="mt-10 mb-4">
        <div className="flex items-center gap-2.5 mb-5 ml-1">
          <span className="text-2xl">📖</span>
          <div>
            <h2 className="font-black text-slate-900 text-lg tracking-tight">Kamus Medis Repro</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Kenali Gejala & Bahayanya</p>
          </div>
        </div>
        <div className="space-y-3">
          {medicalTerms.map(term => (
            <div key={term.id} className="bg-white border border-slate-200 rounded-[20px] overflow-hidden shadow-sm transition-all">
              <button onClick={() => setOpenTermId(openTermId === term.id ? null : term.id)} className="w-full p-4 flex justify-between items-center text-left hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-black text-slate-800 text-sm">{term.name}</h4>
                  <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-0.5">{term.alias}</p>
                </div>
                <div className={`transform transition-transform ${openTermId === term.id ? 'rotate-180' : ''}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-300"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </button>
              {openTermId === term.id && (
                <div className="px-5 pb-5 pt-2 bg-slate-50 border-t border-slate-100 fade-in text-xs leading-relaxed">
                  <div className="mt-3">
                    <span className="font-black text-slate-800">👀 Gejala Visual:</span>
                    <p className="text-slate-600 mt-1 font-medium">{term.gejala}</p>
                  </div>
                  <div className="mt-4">
                    <span className="font-black text-rose-700">⚠️ Dampak Fatal:</span>
                    <p className="text-slate-600 mt-1 font-medium">{term.bahaya}</p>
                  </div>
                  <div className="mt-5 p-3.5 bg-emerald-100/50 border border-emerald-200 rounded-xl">
                    <span className="font-black text-emerald-800 text-[11px] uppercase tracking-widest">💡 Tindakan Wajib:</span>
                    <p className="text-emerald-900 font-bold mt-1.5">{term.solusi}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/*
  ========================================
  6. VIEWS & MAIN APP
  ========================================
*/
function DashboardView({ dbCattle, onAdviceClick }) {
  const safeDb = Array.isArray(dbCattle) ? dbCattle : [];
  const total = safeDb.length;
  const jantan = safeDb.filter(i => i && i.gender === "JANTAN").length;
  const betina = safeDb.filter(i => i && i.gender === "BETINA").length;
  const pregnant = safeDb.filter(i => i && i.phase === "PREGNANT").length;
  const itemsWithAdvice = safeDb.map(item => {
    if (!item) return null;
    try {
      const analysis = analyzeCattle(item);
      // Tampilkan semua sapi yang memiliki advice, bukan hanya yang urgent
      return analysis.advice ? { item, analysis } : null;
    } catch (e) {
      return { item, analysis: { color: "rose", statusLabel: "DATA ERROR", advice: "Format data tidak valid.", isUrgent: true } };
    }
  }).filter(Boolean).sort((a, b) => {
    if (a.analysis.isUrgent && !b.analysis.isUrgent) return -1;
    if (!a.analysis.isUrgent && b.analysis.isUrgent) return 1;
    return 0;
  });

  return (
    <div className="fade-in pb-28 pt-2">
      <div className="px-5 space-y-5">
        <div className="bg-slate-900 rounded-[32px] p-7 text-white shadow-xl relative overflow-hidden border border-slate-800">
           <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
           <h2 className="text-5xl font-black tracking-tighter mt-1.5">{total} <span className="text-xl font-bold text-slate-500 tracking-normal">Ekor</span></h2>
           <div className="mt-8 flex gap-6 border-t border-white/10 pt-5">
              <div className="flex-1">
                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Indukan Produktif</p>
                 <p className="font-black text-emerald-400 text-lg">{betina} <span className="text-xs font-medium text-slate-500">({pregnant} Bunting)</span></p>
              </div>
              <div className="w-px bg-white/10"></div>
              <div className="flex-1">
                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Pejantan / Bakalan</p>
                 <p className="font-black text-blue-400 text-lg">{jantan} <span className="text-xs font-medium text-slate-500">Ekor</span></p>
              </div>
           </div>
        </div>

        <div>
          <div className="flex items-center mb-4 ml-1">
             <h3 className="font-black text-slate-800 text-base tracking-tight">Saran & Peringatan</h3>
             {itemsWithAdvice.length > 0 && <span className="ml-2 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md text-[10px] font-bold">{itemsWithAdvice.length}</span>}
          </div>
          <div className="space-y-3">
            {itemsWithAdvice.length === 0 ? 
              <div className="p-6 bg-emerald-50 rounded-[24px] border border-emerald-200 text-center"><p className="text-xs text-emerald-800 font-bold">✨ Semua populasi kandang dalam kondisi prima.</p></div> : 
              itemsWithAdvice.map(({ item, analysis }) => (<AdviceCard key={item.id} item={item} analysis={analysis} onClick={onAdviceClick} />))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function AddModal({ open, onClose, onSave, editItem }) {
  const [id, setId] = useState(""); 
  const [ras, setRas] = useState("Simental"); 
  const [gender, setGender] = useState("BETINA"); 
  const [phase, setPhase] = useState("CALF"); 
  const [birthDate, setBirthDate] = useState(""); 
  const [origin, setOrigin] = useState("KANDANG");
  const [ageInMonths, setAgeInMonths] = useState("");

  useEffect(() => { 
    if (open && editItem) { setId(editItem.id); setRas(editItem.ras || "Simental"); setGender(editItem.gender || "BETINA"); setPhase(editItem.phase || "CALF"); setBirthDate(editItem.birthDate || ""); setOrigin(editItem.origin || "KANDANG"); setAgeInMonths(""); } 
    else if (open && !editItem) { setId(""); setBirthDate(""); setPhase("CALF"); setOrigin("KANDANG"); setGender("BETINA"); setAgeInMonths(""); } 
  }, [open, editItem]);
  
  // Automatically set phase to CALF if age is too young for market cattle
  useEffect(() => {
    if (origin === 'PASAR' && gender === 'BETINA' && Number(ageInMonths) > 0 && Number(ageInMonths) < 18) {
      if (phase !== 'CALF') {
        setPhase('CALF');
      }
    }
  }, [ageInMonths, origin, gender, phase]);

  const save = () => { 
    if (!id.trim()) return alert("Isi Kode/Tag Sapi!"); 

    let calculatedBirthDate;
    if (origin === 'PASAR') {
      if (!ageInMonths) return alert("Perkiraan Umur wajib diisi untuk sapi dari pasar!");
      const birth = new Date();
      birth.setMonth(birth.getMonth() - Number(ageInMonths));
      calculatedBirthDate = birth.toISOString().split("T")[0];
    } else {
      if (!birthDate) return alert("Tanggal Lahir wajib diisi untuk sapi dari kandang!");
      calculatedBirthDate = birthDate;
    }

    let base = { ibLog: editItem?.ibLog || [], healthLog: editItem?.healthLog || [], calvingLog: editItem?.calvingLog || [], pkbLog: editItem?.pkbLog || [], conceptionDate: editItem?.conceptionDate || "", calvingDate: editItem?.calvingDate || "" }; 
    let data = { ...base, id, origin, ras, gender, phase: gender === "JANTAN" ? "N/A" : phase, birthDate: calculatedBirthDate }; 
    if (onSave) onSave(data); if (onClose) onClose(); 
  };
  
  if (!open) return null; const inp = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 bg-slate-50 focus:bg-white transition-all";
  
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 sm:items-center">
      <div className="bg-white w-full max-w-md mx-auto rounded-t-[32px] sm:rounded-[32px] p-6 slide-up shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6"><p className="font-black text-2xl text-slate-900 tracking-tight">{editItem ? "Edit Aset" : "Input Sapi Baru"}</p><button onClick={onClose} className="bg-slate-100 w-9 h-9 rounded-full flex items-center justify-center font-bold text-slate-500 hover:bg-slate-200">✕</button></div>
        <div className="space-y-2">
          <FF label="Kode Sapi / Tag"><input className={inp} value={id} onChange={e => setId(e.target.value)} placeholder="Cth: L-01" /></FF>
          <div className="flex gap-4 mb-4"><div className="flex-1"><FF label="Jenis Kelamin"><select className={inp} value={gender} onChange={e => setGender(e.target.value)}><option value="BETINA">Betina</option><option value="JANTAN">Jantan</option></select></FF></div><div className="flex-1"><FF label="Jenis Ras"><select className={inp} value={ras} onChange={e => setRas(e.target.value)}><option>Simental</option><option>Limosin</option><option>PO</option><option>Brahman</option></select></FF></div></div>
          <FF label="Asal Usul Sapi"><select className={inp} value={origin} onChange={e => setOrigin(e.target.value)}><option value="KANDANG">Lahir di Kandang (Breeding)</option><option value="PASAR">Beli dari Luar (Pasar)</option></select></FF>
          
          {origin === 'KANDANG' ? (
            <div className="pop-in"><FF label="Tanggal Lahir (Wajib)"><input type="date" className={inp} value={birthDate} onChange={e => setBirthDate(e.target.value)} /></FF></div>
          ) : (
            <div className="pop-in"><FF label="Perkiraan Umur Saat Ini (Bulan)"><input type="number" className={inp} value={ageInMonths} onChange={e => setAgeInMonths(e.target.value)} placeholder="Contoh: 18" /></FF><p className="text-[11px] text-slate-500 -mt-2 px-2">Tanggal lahir akan diestimasi otomatis dari umur.</p></div>
          )}

          {gender === "BETINA" && (
            <FF label="Status Reproduksi Awal">
              <select className={inp} value={phase} onChange={e => setPhase(e.target.value)} disabled={origin === 'PASAR' && Number(ageInMonths) > 0 && Number(ageInMonths) < 18}>
                <option value="CALF">Pedet / Dara Belum Kawin</option>
                {(origin === 'KANDANG' || !ageInMonths || Number(ageInMonths) >= 18) && (
                  <>
                    <option value="OPEN">Kosong (Siap Kawin)</option>
                    <option value="PREGNANT">Bunting (Dari Pasar)</option>
                  </>
                )}
              </select>
              {(phase === 'OPEN' || phase === 'PREGNANT') && (
                <p className="text-[11px] text-emerald-800 bg-emerald-50 p-3 rounded-lg mt-2.5 border border-emerald-200 font-semibold pop-in">
                  <strong>💡 Rekomendasi:</strong> Sangat disarankan untuk dilakukan pemeriksaan oleh petugas/dokter hewan untuk memastikan status reproduksi dan kesehatan rahim secara akurat.
                </p>
              )}
            </FF>
          )}
        </div>
        <button onClick={save} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl mt-6 text-sm shadow-lg hover:bg-emerald-700 transition-colors">Simpan Data Ternak</button>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ open, onClose, onConfirm, cattleId }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-sm rounded-[24px] p-8 pop-in shadow-2xl text-center">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="font-black text-xl text-slate-900 mb-2 tracking-tight">Konfirmasi Penghapusan</h3>
        <p className="text-sm text-slate-600 font-medium mb-8">
          Apakah Anda yakin ingin menghapus sapi dengan kode <strong className="text-slate-900">"{cattleId}"</strong>? Aksi ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl text-sm hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={() => {
              onConfirm(cattleId);
              onClose();
            }} 
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-rose-500/30 transition-all"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function EditProfileModal({ open, onClose, onSave, currentProfile }) {
  const [profileData, setProfileData] = useState(currentProfile);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (open) {
      setProfileData(currentProfile);
    }
  }, [open, currentProfile]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setProfileData({ ...profileData, photo: loadEvent.target.result });
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Harap pilih file gambar (JPG, PNG, dll).");
    }
  };

  const handleSave = () => {
    if (!profileData.name || !profileData.farm) {
      alert("Nama Pemilik dan Nama Peternakan wajib diisi!");
      return;
    }
    onSave(profileData);
    onClose();
  };

  if (!open) return null;

  const inp = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 bg-slate-50 focus:bg-white transition-all";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-sm rounded-[24px] p-6 pop-in shadow-2xl">
        <h3 className="font-black text-xl text-slate-900 mb-5 tracking-tight">Edit Profil</h3>
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-4xl font-black text-slate-400 mb-3 shadow-inner overflow-hidden border-4 border-white">
            {profileData.photo ? (
              <img src={profileData.photo} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <span>{profileData.name ? profileData.name.charAt(0).toUpperCase() : "U"}</span>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            className="hidden"
            accept="image/*"
          />
          <button onClick={() => fileInputRef.current.click()} className="px-4 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-full hover:bg-slate-200 transition-colors">
            Ganti Foto
          </button>
        </div>
        <div className="space-y-4">
          <FF label="Nama Pemilik (Owner)"><input className={inp} value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} /></FF>
          <FF label="Nama Peternakan"><input className={inp} value={profileData.farm} onChange={e => setProfileData({...profileData, farm: e.target.value})} /></FF>
          <FF label="Lokasi / Alamat"><input className={inp} value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} /></FF>
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
          <button onClick={handleSave} className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition-all">Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [dbCattle, setDbCattle] = useState(() => {
    try { const data = JSON.parse(localStorage.getItem("srtt_db_cattle")); return Array.isArray(data) ? data : []; } 
    catch (e) { return []; }
  });

  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem("srtt_user_profile")) || null; } 
    catch (e) { return null; }
  });
  
  const [nav, setNav] = useState("dashboard"); 
  const [addOpen, setAddOpen] = useState(false); 
  const [editItem, setEditItem] = useState(null); 
  const [actionItem, setActionItem] = useState(null); 
  const [hideSplashDOM, setHideSplashDOM] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [highlightedId, setHighlightedId] = useState(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  useEffect(() => { setTimeout(() => setHideSplashDOM(true), 2500); }, []);
  useEffect(() => { try { localStorage.setItem("srtt_db_cattle", JSON.stringify(dbCattle)); } catch(e) {} }, [dbCattle]); 
  useEffect(() => { try { if (profile) localStorage.setItem("srtt_user_profile", JSON.stringify(profile)); } catch(e) {} }, [profile]);
  
  const handleSaveAdd = (data) => {
    const exists = dbCattle.some(c => c.id === data.id);
    if (editItem || exists) {
      setDbCattle(p => p.map(x => x.id === (editItem?.id || data.id) ? { ...x, ...data } : x));
    } else {
      setDbCattle(p => [...p, data]);
    }
  };

  const handleDeleteLog = (itemId, logType, index) => {
    const updateItemWithDeletedLog = (item) => {
      if (item.id !== itemId) return item;
      const newItem = { ...item };
      const logArray = [...(newItem[logType] || [])];
      if (logArray.length > index) {
        logArray.splice(index, 1);
        newItem[logType] = logArray;
      }
      return newItem;
    };
    setDbCattle(prev => prev.map(updateItemWithDeletedLog));
    setDetailItem(prev => (prev ? updateItemWithDeletedLog(prev) : null));
  };

  const handleDeleteRequest = (id) => {
    setConfirmDeleteId(id);
  };

  const executeDelete = (id) => {
    setDbCattle(p => p.filter(x => x.id !== id));
  };

  const handleAdviceClick = (item) => {
    setNav("assets");
    setHighlightedId(item.id);
  };

  const handleSaveRepro = (res, pregMonth, d, isUSG) => {
    const idx = dbCattle.findIndex(b => b.id === actionItem.id); 
    if (idx === -1) return;
    let current = { ...dbCattle[idx] }; 

    if (res === "NEGATIVE") { current.phase = "OPEN"; current.pkbLog = [...(current.pkbLog || []), { date: d, result: "NEGATIVE" }]; } 
    else if (res === "IB") { current.phase = "BRED"; current.ibLog = [...(current.ibLog || []), d]; } 
    else if (res === "POSITIVE") { 
      let calculatedConception = todayStr();
      if (pregMonth) { const dt = new Date(d); dt.setMonth(dt.getMonth() - Number(pregMonth)); calculatedConception = dt.toISOString().split("T")[0]; } 
      else { const sortedIB = [...(current.ibLog || [])].sort((a, b) => new Date(a) - new Date(b)); calculatedConception = sortedIB.length > 0 ? sortedIB[sortedIB.length - 1] : todayStr(); }
      current.phase = "PREGNANT"; current.conceptionDate = calculatedConception; current.pkbLog = [...(current.pkbLog || []), { date: d, result: "POSITIVE" }]; 
    } 
    else if (res === "CALVED") { current.phase = "POSTPARTUM"; current.calvingDate = d; current.calvingLog = [...(current.calvingLog || []), d]; } 
    const up = [...dbCattle]; up[idx] = current; setDbCattle(up); 
  };

  const handleSaveHealth = (d, kondisi, diagnosa, tindakan, status) => {
    const idx = dbCattle.findIndex(b => b.id === actionItem.id); 
    if (idx === -1) return;
    let current = { ...dbCattle[idx] }; 
    let treatmentText = diagnosa ? `(Diagnosa: ${diagnosa}) - ${tindakan || 'Perlu pantauan'}` : (tindakan || "Menunggu pemeriksaan & tindakan medis");
    current.healthLog = [...(current.healthLog || []), { date: d, kondisi: kondisi, treatment: treatmentText, status: status }];
    const up = [...dbCattle]; up[idx] = current; setDbCattle(up);
  };

  const safeDb = Array.isArray(dbCattle) ? dbCattle : [];
  const filteredCattle = safeDb.filter(item => {
    if (!item || !item.id) return false;
    const searchMatch = item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const genderMatch = genderFilter === "ALL" || item.gender === genderFilter;
    return searchMatch && genderMatch;
  }).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 relative flex flex-col">
      <GlobalStyle />
      
      {!hideSplashDOM && (
        <div className="splash-container">
          <div className="fade-in bg-white px-8 py-4 rounded-2xl shadow-2xl shadow-white/10 text-center">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter">PROVERTI</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">BIDANG KESEHATAN HEWAN</p>
          </div>
        </div>
      )}

      {hideSplashDOM && !profile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 px-4 slide-up">
           <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl border border-slate-100 text-center">
             <div className="flex justify-center mb-5"><img src={logoTuban} alt="Logo Tuban" className="w-20 h-auto object-contain drop-shadow-sm" /></div>
             <p className="text-[8.5px] font-black text-emerald-600 uppercase tracking-widest mb-6 leading-snug">Dinas Ketahanan Pangan, Pertanian, dan Perikanan<br/>Kabupaten Tuban</p>
             <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">PROVERTI</h1>
             <p className="text-[10px] font-bold text-slate-500 mb-8 leading-relaxed whitespace-nowrap overflow-x-auto">(Portofolio Recording Observasi Veteriner, Reproduksi, dan Ternak Integrasi)</p>
             <button onClick={() => setProfile({ name: "Petugas / Medik Vet", farm: "Tuban" })} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl text-sm shadow-lg shadow-emerald-500/30 transition-all">Mulai Sistem Pendataan</button>
           </div>
        </div>
      )}

      {hideSplashDOM && profile && (
        <>
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

          {/* AREA KONTEN TAB */}
          <div className="flex-1">
            
            {/* 1. TAB BERANDA */}
            {nav === "dashboard" && <DashboardView dbCattle={safeDb} onAdviceClick={handleAdviceClick} />}
            
            {/* 2. TAB POPULASI */}
            {nav === "assets" && (
              <div className="pb-28 fade-in bg-slate-50">
                <div className="sticky top-0 z-30 bg-slate-50/90 backdrop-blur-md px-5 py-4 border-b border-slate-200">
                   <div className="flex justify-between items-center">
                    <div><h2 className="font-black text-xl text-slate-900">Database Aset</h2><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{filteredCattle.length} dari {safeDb.length} Ekor</p></div>
                   <button onClick={() => { setEditItem(null); setAddOpen(true); }} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold">+ Ternak Baru</button>
                   </div>
                   <div className="mt-4 relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                     </span>
                     <input
                       type="text"
                       placeholder="Cari Kode Sapi..."
                       className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 bg-white transition-all"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                     />
                   </div>
                   <div className="mt-3 p-1 bg-slate-200 rounded-xl flex gap-1">
                      <button onClick={() => setGenderFilter("ALL")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${genderFilter === 'ALL' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Semua</button>
                      <button onClick={() => setGenderFilter("BETINA")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${genderFilter === 'BETINA' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Betina</button>
                      <button onClick={() => setGenderFilter("JANTAN")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${genderFilter === 'JANTAN' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Jantan</button>
                   </div>
                </div>
                <div className="p-5 space-y-4 mt-2">
                  {filteredCattle.map((item) => item ? <AssetRecordCard key={item.id || Math.random()} item={item} onEdit={(i) => {setEditItem(i); setAddOpen(true);}} onOpenAction={setActionItem} onDelete={handleDeleteRequest} onOpenDetail={setDetailItem} highlightedId={highlightedId} setHighlightedId={setHighlightedId} /> : null)}
                  {searchQuery && filteredCattle.length === 0 && <p className="text-center text-slate-500 font-medium pt-10">Sapi dengan kode "{searchQuery}" tidak ditemukan.</p>}
                </div>
              </div>
            )}

            {/* 3. TAB ACADEMY */}
            {nav === "academy" && <AcademyView />}

            {/* 4. TAB PROFIL & SETTING */}
            {nav === "profile" && (
              <div className="pb-32 fade-in bg-slate-50 min-h-screen">
                {/* Header Profil */}
                <div className="bg-white px-5 pt-8 pb-8 border-b border-slate-200 shadow-sm flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-3xl font-black text-slate-400 mb-3 shadow-inner overflow-hidden border-4 border-white">
                    {profile.photo ? (
                      <img src={profile.photo} alt="Profil" className="w-full h-full object-cover" />
                    ) : (
                      <span>{profile.name ? profile.name.charAt(0).toUpperCase() : "U"}</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{profile.name}</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{profile.farm} Area</p>
                  <button onClick={() => setEditProfileOpen(true)} className="mt-4 px-6 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-full hover:bg-slate-200 transition-colors">Edit Profil</button>
                </div>

                <div className="px-5 mt-6 space-y-6">
                  {/* Grup 1: Akun */}
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Pengaturan Akun</h3>
                    <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
                           <span className="font-bold text-sm text-slate-700">Keamanan & Password</span>
                         </div>
                         <span className="text-slate-300 font-bold">❯</span>
                      </div>
                    </div>
                  </div>

                  {/* Grup 2: Preferensi */}
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Preferensi Aplikasi</h3>
                    <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between p-4 border-b border-slate-50">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></div>
                           <span className="font-bold text-sm text-slate-700">Notifikasi</span>
                         </div>
                         <div className="w-10 h-6 bg-emerald-500 rounded-full flex items-center p-1 justify-end cursor-pointer"><div className="w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                      </div>
                      <div className="flex items-center justify-between p-4">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg></div>
                           <span className="font-bold text-sm text-slate-700">Mode Gelap (Dark Mode)</span>
                         </div>
                         <div className="w-10 h-6 bg-slate-200 rounded-full flex items-center p-1 justify-start cursor-pointer"><div className="w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                      </div>
                    </div>
                  </div>

                  {/* Grup 3: Tentang Aplikasi */}
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Tentang Aplikasi</h3>
                    <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between p-4">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>
                           <div>
                            <span className="font-bold text-sm text-slate-700">PROVERTI v1.0</span>
                            <p className="text-xs text-slate-400 font-medium">© 2024 DKP3 Tuban</p>
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Logout */}
                  <button onClick={() => { if(window.confirm("Yakin ingin keluar aplikasi?")) { setProfile(null); } }} className="w-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 font-bold py-4 rounded-[20px] text-sm transition-colors shadow-sm mt-4">
                    Keluar Akun (Logout)
                  </button>
                </div>
              </div>
            )}

          </div>
          
          {/* BOTTOM NAVIGATION BAR 4 TAB */}
          <div className="nav-bar">
            {/* Tab 1: Beranda */}
            <button onClick={() => setNav("dashboard")} className={`nav-item ${nav === "dashboard" ? "active" : ""}`}>
              <span className="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3z"/></svg>
              </span>
              <span>Beranda</span>
            </button>
            
            {/* Tab 2: Populasi */}
            <button onClick={() => setNav("assets")} className={`nav-item ${nav === "assets" ? "active" : ""}`}>
              <span className="nav-icon">
                <svg viewBox="0 0 100 100" className="w-6 h-6 fill-current"><path d="M85.9,46.1c-1.9-2.2-4.1-4-6.5-5.3c0,0-11-6-11.4-6.3c-0.1,0-0.1-0.1-0.2-0.1c-1.3-1-3.1-1.3-4.7-0.7 c-0.7,0.3-1.4,0.7-1.9,1.3c-2.3,2.4-5.3,4.6-8.3,4.6c-2.6,0-5.1-1.6-7-4.1c-1.7-2.3-3.6-3.8-5.6-4.6c-0.1,0-0.2-0.1-0.3-0.1 C38,30.3,36.1,30.7,34.8,32c-0.1,0.1-0.1,0.1-0.2,0.1C33,33.5,22,41.4,22,41.4c-2.2,1.6-3.7,3.9-4,6.4c-0.3,2.5,0.7,5,2.6,6.6 c0.1,0.1,0.1,0.1,0.2,0.1c0.1,0,0.1,0,0.2,0.1c2.1,1.5,4.7,2.1,7.2,1.7c1.3-0.2,2.5-0.7,3.6-1.5c0.1-0.1,0.2-0.1,0.3-0.2 c2-1.9,4.5-2.8,7.1-2.8c2.9,0,5.6,1.2,7.4,3.1c1.8,1.9,4.1,3,6.6,3c2,0,3.9-0.8,5.3-2.2c0.1-0.1,0.1-0.1,0.2-0.1 c1.8-2,4.6-3,7.3-2.6c1.1,0.2,2.2,0.6,3.2,1.2c0.1,0.1,0.1,0.1,0.2,0.1c1.9,1.1,4.1,1.4,6.1,0.8c2-0.6,3.8-2,5-3.8 C86.7,50,86.9,48,85.9,46.1z M52.5,41.4c0,2.1-1.7,3.8-3.8,3.8c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8C50.8,37.6,52.5,39.3,52.5,41.4 z"/></svg>
              </span>
              <span>Populasi</span>
            </button>

            {/* Tab 3: Akademi */}
            <button onClick={() => setNav("academy")} className={`nav-item ${nav === "academy" ? "active" : ""}`}>
              <span className="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
              </span>
              <span>Akademi</span>
            </button>

            {/* Tab 4: Profil */}
            <button onClick={() => setNav("profile")} className={`nav-item ${nav === "profile" ? "active" : ""}`}>
              <span className="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </span>
              <span>Profil</span>
            </button>

          </div>
          
          <AddModal open={addOpen} onClose={() => { setAddOpen(false); setEditItem(null); }} onSave={handleSaveAdd} editItem={editItem} />
          <ActionModal open={!!actionItem} item={actionItem} onClose={() => setActionItem(null)} onSaveRepro={handleSaveRepro} onSaveHealth={handleSaveHealth} />
          <ConfirmDeleteModal open={!!confirmDeleteId} cattleId={confirmDeleteId} onClose={() => setConfirmDeleteId(null)} onConfirm={executeDelete} />
          <DetailModal item={detailItem} onClose={() => setDetailItem(null)} onDeleteLog={handleDeleteLog} />
          <EditProfileModal open={editProfileOpen} onClose={() => setEditProfileOpen(false)} onSave={setProfile} currentProfile={profile} />
        </>
      )}
    </div>
  );
}