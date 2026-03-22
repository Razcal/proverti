import { daysDiff, fmtDate } from './helpers';

export function analyzeCattle(item) {
  if (!item) return { color: "slate", statusLabel: "ERROR", advice: "Data tidak valid", isUrgent: false, adviceColor: "text-slate-600 bg-slate-50" };

  try {
    const today = new Date();
    let res = { color: "slate", statusLabel: "", advice: "", isUrgent: false, adviceColor: "text-slate-600 bg-slate-50" };

    const umurHari = item.birthDate ? daysDiff(item.birthDate) : 0;
    const isJantan = item.gender === "JANTAN";

    const activeIllness = (item.healthLog || []).find(h => h.status === "SAKIT");
    if (activeIllness) {
       res.isUrgent = true;
       const isBelumDiperiksa = activeIllness.treatment?.includes("Menunggu pemeriksaan") || !activeIllness.rawMedis?.diagnosa;
       res.statusLabel = isBelumDiperiksa ? "BUTUH PEMERIKSAAN MEDIS" : "DALAM PERAWATAN MEDIS";
       res.color = isBelumDiperiksa ? "orange" : "rose";
       
       let cleanKondisi = (activeIllness.kondisi || "").replace(/\[.*?\]\s*/, '').trim(); 
       let diagText = activeIllness.rawMedis?.diagnosa || cleanKondisi;
       let terText = activeIllness.rawMedis?.pengobatan || activeIllness.treatment;
       
       terText = String(terText).replace(/\n/g, ' - ');

       res.advice = isBelumDiperiksa 
          ? `ANAMNESA: ${cleanKondisi}` 
          : `DIAGNOSA: ${diagText}. (Terapi: ${terText})`;
          
       res.adviceColor = isBelumDiperiksa
          ? "text-orange-900 bg-orange-50 border border-orange-200 font-semibold shadow-sm"
          : "text-rose-900 bg-rose-50 border border-rose-200 font-semibold shadow-sm";
       return res; 
    }

    if (isJantan) {
        if (umurHari < 180) { res.statusLabel = "PEDET JANTAN"; res.color = "violet"; res.advice = "Fokus susu & pakan pemula. Jaga kebersihan kandang dari diare/scours."; } 
        else if (umurHari < 730) { res.statusLabel = "JANTAN BAKALAN"; res.color = "blue"; res.advice = "Fase penggemukan (Feedlot). Tingkatkan pakan konsentrat energi tinggi."; } 
        else { res.statusLabel = "PEJANTAN DEWASA"; res.color = "emerald"; res.advice = "Bobot panen optimal. Siap untuk dipasarkan atau dijadikan pejantan pemacek."; }
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
      if (!item.calvingDate && umurHari > 1095) { res.statusLabel = "AWAS: KEMAJIRAN ABSOLUT"; res.color = "rose"; res.isUrgent = true; res.advice = `Sapi Dara > 3 tahun belum birahi. Suspect Hipoplasia Ovarium akut.`; res.adviceColor = "text-rose-900 bg-rose-50 border border-rose-200 font-bold shadow-sm"; } 
      else if (umurHari > 730) { res.statusLabel = "AWAS: DARA TERLAMBAT KAWIN"; res.color = "orange"; res.isUrgent = true; res.advice = `Umur > 2 tahun belum di-IB. Panggil dokter.`; res.adviceColor = "text-orange-900 bg-orange-50 border border-orange-200 font-bold shadow-sm"; } 
      else if (umurHari >= 540) { res.statusLabel = "DARA SIAP KAWIN"; res.color = "emerald"; res.advice = "Usia ideal IB (18-24 bulan). Pantau birahi."; } 
      else { res.statusLabel = "DARA PERTUMBUHAN"; res.color = "blue"; res.advice = "Masa Pra-pubertas. Kejar bobot harian ideal."; }
    } else if (item.phase === "OPEN") {
      if (item.calvingDate && daysOpen > 150 && !hasIbAfterCalving) { res.statusLabel = "AWAS: SUSPECT PYOMETRA"; res.color = "rose"; res.isUrgent = true; res.advice = `Kosong > 5 bulan. Waspada penumpukan nanah rahim.`; res.adviceColor = "text-rose-800 bg-rose-50 border border-rose-200 font-bold shadow-sm"; } 
      else if (item.calvingDate && daysOpen > 120) { res.statusLabel = "AWAS: KOSONG > 120 HARI"; res.color = "rose"; res.isUrgent = true; res.advice = `Kosong ${daysOpen} hari pasca melahirkan.`; res.adviceColor = "text-rose-800 bg-rose-50 border border-rose-200 font-bold shadow-sm"; } 
      else { res.statusLabel = "SIAP IB"; res.color = "amber"; res.advice = "Fase Kosong. Pantau tanda 3A (Abang, Abuh, Anget)."; }
    } else if (item.phase === "BRED") {
      if (cycles >= 3) { res.color = "rose"; res.statusLabel = "REPEAT BREEDER"; res.isUrgent = true; res.advice = `Gagal pada ${cycles} siklus. Butuh terapi.`; res.adviceColor = "text-rose-800 bg-rose-50 border border-rose-200 font-bold shadow-sm"; } 
      else if (diffPrevLast >= 5 && diffPrevLast <= 7) { res.color = "rose"; res.statusLabel = "SUSPECT SISTA OVARIUM"; res.isUrgent = true; res.advice = `Birahi terlalu cepat (${diffPrevLast} hari). Suspect Sista.`; res.adviceColor = "text-rose-800 bg-rose-50 border border-rose-200 font-bold shadow-sm"; } 
      else if (daysSinceLastIB < 60) { res.color = "slate"; res.statusLabel = "SUSPECT BUNTING"; res.advice = `H+${daysSinceLastIB} pasca IB. Jangan dirogoh manual!`; } 
      else { res.color = "orange"; res.statusLabel = "WAKTUNYA PKB"; res.isUrgent = true; res.advice = `JADWAL PKB! Lapor hasil via menu Reproduksi.`; res.adviceColor = "text-orange-900 bg-orange-50 border border-orange-200 font-bold shadow-sm"; }
    } else if (item.phase === "PREGNANT") {
      if (!item.conceptionDate) { res.color = "orange"; res.statusLabel = "BUNTING (BELUM PKB)"; res.isUrgent = true; res.advice = `Sapi bunting pasar. Wajib lapor hasil PKB Dokter.`; res.adviceColor = "text-orange-900 bg-orange-50 border border-orange-200 font-semibold shadow-sm"; } 
      else {
         const hpl = new Date(item.conceptionDate); hpl.setMonth(hpl.getMonth() + 9); hpl.setDate(hpl.getDate() + 10);
         const l = Math.ceil((hpl - today) / 86400000); const pregDays = daysDiff(item.conceptionDate);
         let txtHPL = `HPL: ${fmtDate(hpl.toISOString().split("T")[0])} (±${l} hr).`;
         if (pregDays >= 285) { res.color = "rose"; res.statusLabel = "ANCAMAN DISTOKIA"; res.isUrgent = true; res.advice = `KANDUNGAN TUA! Siagakan tenaga medis.`; res.adviceColor = "text-rose-900 bg-rose-50 border border-rose-200 font-bold shadow-sm"; } 
         else if (l <= 60 && l > 21) { res.color = "amber"; res.statusLabel = "KERING KANDANG"; res.isUrgent = true; res.advice = `${txtHPL} Segera hentikan perah susu!`; res.adviceColor = "text-amber-900 bg-amber-50 border border-amber-200 font-semibold shadow-sm"; } 
         else { res.color = "emerald"; res.statusLabel = "BUNTING AKTIF"; res.advice = `${txtHPL} Jaga komposisi pakan.`; }
      }
    } else if (item.phase === "POSTPARTUM") {
      const d = daysDiff(item.calvingDate);
      if (d <= 14) { res.statusLabel = "PUERPERIUM (NIFAS)"; res.color = "rose"; res.isUrgent = true; res.advice = `Waspada Lokia bau busuk / Retensio Secundinarum.`; res.adviceColor = "text-rose-900 bg-rose-50 border border-rose-200 font-semibold shadow-sm"; } 
      else if (d <= 45) { res.statusLabel = "INVOLUSI UTERUS"; res.color = "blue"; res.advice = `Rahim sedang pemulihan. DILARANG suntik IB.`; } 
      else { res.statusLabel = "BREEDING WINDOW"; res.color = "emerald"; res.advice = `Sapi siap di-IB kembali.`; }
    }
    return res;
  } catch (error) { return { color: "rose", statusLabel: "DATA ERROR", advice: "Format tanggal atau riwayat tidak valid.", isUrgent: true, adviceColor: "text-rose-900 bg-rose-50" }; }
}

export function buildHistory(item) { 
  let history = []; 
  try {
    (item.ibLog || []).forEach((d, i) => history.push({ type: 'ibLog', originalIndex: i, date: d, label: `IB ke-${i + 1}`, desc: "Inseminasi Buatan", colorDot: "bg-blue-500", rawDate: new Date(d) })); 
    (item.pkbLog || []).forEach((log, i) => history.push({ type: 'pkbLog', originalIndex: i, date: log.date, label: `PKB: ${log.result === "POSITIVE" ? "Positif (+)" : "Negatif (-)"}`, desc: log.result === "POSITIVE" ? "Disahkan Bunting" : "Tidak Bunting", colorDot: log.result === "POSITIVE" ? "bg-emerald-500" : "bg-rose-500", rawDate: new Date(log.date) })); 
    (item.calvingLog || []).forEach((d, i) => history.push({ type: 'calvingLog', originalIndex: i, date: d, label: "Partus", desc: "Kelahiran Pedet", colorDot: "bg-violet-500", rawDate: new Date(d) }));
    (item.healthLog || []).forEach((l, i) => { const isSembuh = l.status === "SEMBUH"; let labelTxt = l.treatment?.includes("Menunggu pemeriksaan") ? `Gejala: ${l.kondisi}` : l.kondisi; history.push({ type: 'healthLog', originalIndex: i, date: l.date, label: isSembuh ? `✅ Sembuh: ${labelTxt}` : labelTxt, desc: l.treatment, colorDot: isSembuh ? "bg-emerald-500" : "bg-rose-500", rawDate: new Date(l.date), status: l.status || "SAKIT" }); });
    if (item.birthDate) history.push({ type: 'birthDate', originalIndex: 0, date: item.birthDate, label: "Lahir / Masuk", desc: item.origin === "KANDANG" ? "Lahir di kandang" : "Beli", colorDot: "bg-slate-300", rawDate: new Date(item.birthDate) }); 
    return history.sort((a, b) => (b.rawDate || 0) - (a.rawDate || 0)); 
  } catch(e) { return []; }
}