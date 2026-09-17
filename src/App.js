import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Printer, Building2, Calendar, FileText, CheckCircle2, Truck, ShieldCheck, Clock, Plus, Trash2 } from 'lucide-react';

// Il documento viene generato sempre in italiano, indipendentemente dalla lingua dell'interfaccia.
const TEXT = {
  title: 'LETTERA DI IMPEGNO E PIANO DI CONSEGNA CAMION',
  docRef: 'Rif. Impegno:',
  date: 'Data di emissione:',
  partner: 'Fornitore / Produttore:',
  client: 'Destinatario / Beneficiario:',
  issuer: 'Vettore & Gestore:',
  website: 'Sito Web Ufficiale:',
  summaryTitle: 'Oggetto della Lettera di Consegna',
  scheduleTitle: 'Programma di Pianificazione delle Consegne',
  thTranche: 'Fase / Tranche',
  thQty: 'Numero di Camion',
  thDelay: 'Tempistica / Scadenza',
  thStatus: 'Stato Approvvigionamento',
  statusScheduled: 'Pianificato e Garantito IVECO',
  totalVehicles: 'Volume Totale Flotta da Consegnare:',
  specsTitle: 'Impegni Qualità e Assistenza IVECO',
  signTerratransport: 'Per Terratransport SA',
  signIveco: 'Per il Produttore IVECO',
  stampNotice: 'Timbro Ufficiale e Approvazione Dirigenziale',
  downloadBtn: 'Scarica PDF',
  printBtn: 'Stampa',
  addTranche: 'Aggiungi tranche',
};

export default function App() {
  const [docNumber, setDocNumber] = useState('ENG-2026-IVECO-100');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientName, setClientName] = useState('Ministero dei Trasporti / Partner Destinatario');
  const [partnerName, setPartnerName] = useState('IVECO');
  const [summaryText, setSummaryText] = useState(
    "Nell'ambito della partnership strategica tra Terratransport SA e il produttore IVECO, la presente lettera stabilisce le modalità logistiche e il calendario ufficiale di approvvigionamento e consegna dei camion."
  );
  const [tranches, setTranches] = useState([
    { name: '1ª Tranche', qty: 20, delay: 'Consegna immediata (messa a disposizione iniziale)' },
    { name: '2ª Tranche', qty: 20, delay: '3 mesi dopo la 1ª tranche' },
    { name: '3ª Tranche', qty: 30, delay: '3 mesi dopo la 2ª tranche' },
    { name: '4ª Tranche', qty: 30, delay: '3 mesi dopo la 3ª tranche' },
  ]);
  const [specs, setSpecs] = useState([
    'Ispezionati e certificati conformi agli standard internazionali IVECO prima di ogni partenza.',
    'Monitoraggio logistico, trasporto e gestione delle formalità di ricezione da parte di Terratransport.',
    'Garanzia del produttore attiva e assistenza tecnica prioritaria dalla consegna delle chiavi.',
  ]);

  const documentRef = useRef();
  const totalTrucks = tranches.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  const handleTrancheChange = (index, field, value) => {
    const updated = [...tranches];
    updated[index][field] = field === 'qty' ? Math.max(0, parseInt(value, 10) || 0) : value;
    setTranches(updated);
  };

  const addTranche = () => setTranches([
    ...tranches,
    { name: `${tranches.length + 1}ª Tranche`, qty: 10, delay: 'Secondo il calendario concordato' },
  ]);

  const removeTranche = (index) => {
    if (tranches.length > 1) setTranches(tranches.filter((_, i) => i !== index));
  };

  const handleDownloadPdf = async () => {
    const canvas = await html2canvas(documentRef.current, { scale: 2, useCORS: true, logging: false });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Terratransport_Impegno_${docNumber}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8 no-print border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Building2 className="text-blue-700" /> Pannello di controllo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1"><FileText className="inline w-3.5 h-3.5 mr-1" />Numero di riferimento</label>
            <input type="text" value={docNumber} onChange={(e) => setDocNumber(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1"><Calendar className="inline w-3.5 h-3.5 mr-1" />Data di emissione</label>
            <input type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Produttore / Partner</label><input type="text" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm" /></div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Destinatario / Cliente</label><input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm" /></div>
        </div>
        <div className="mb-4"><label className="block text-xs font-semibold text-slate-600 mb-1">Testo di presentazione / Oggetto</label><textarea rows={2} value={summaryText} onChange={(e) => setSummaryText(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm" /></div>
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 mb-2">Tranche di consegna (calcolo dinamico)</label>
          {tranches.map((item, index) => <div key={index} className="flex items-center gap-2 mb-2">
            <input type="text" value={item.name} onChange={(e) => handleTrancheChange(index, 'name', e.target.value)} placeholder="Nome tranche" className="w-1/4 bg-slate-50 border border-slate-300 rounded p-1.5 text-xs" />
            <input type="number" value={item.qty} onChange={(e) => handleTrancheChange(index, 'qty', e.target.value)} placeholder="Quantità" className="w-1/6 bg-slate-50 border border-slate-300 rounded p-1.5 text-xs text-center" />
            <input type="text" value={item.delay} onChange={(e) => handleTrancheChange(index, 'delay', e.target.value)} placeholder="Scadenza" className="flex-1 bg-slate-50 border border-slate-300 rounded p-1.5 text-xs" />
            <button onClick={() => removeTranche(index)} className="text-red-500 hover:text-red-700 p-1" title="Elimina la tranche"><Trash2 className="w-4 h-4" /></button>
          </div>)}
          <button onClick={addTranche} className="mt-1 flex items-center gap-1 text-xs font-semibold text-blue-700"><Plus className="w-3.5 h-3.5" /> {TEXT.addTranche}</button>
        </div>
        <div className="mb-6"><label className="block text-xs font-bold text-slate-700 mb-2">Impegni e garanzie</label>{specs.map((spec, index) => <input key={index} type="text" value={spec} onChange={(e) => { const next = [...specs]; next[index] = e.target.value; setSpecs(next); }} className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs mb-1.5" />)}</div>
        <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-200">
          <button onClick={handleDownloadPdf} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-medium px-5 py-2.5 rounded-lg shadow"><Download className="w-4 h-4" /> {TEXT.downloadBtn}</button>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white font-medium px-5 py-2.5 rounded-lg shadow"><Printer className="w-4 h-4" /> {TEXT.printBtn}</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto"><div ref={documentRef} className="bg-white p-10 rounded-none shadow-xl border border-slate-200 text-slate-900 mx-auto" style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}>
        <div className="flex justify-between items-start border-b-2 border-blue-900 pb-6 mb-6"><div><img src="/logo.png" alt="Logo Terratransport" className="h-16 object-contain mb-2" style={{ maxWidth: '200px', maxHeight: '70px' }} onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200x60?text=Logo+Terratransport'; }} /><p className="text-xs text-slate-500 font-semibold">{TEXT.website} https://terratransport-sa.com</p></div><div className="text-right"><h1 className="text-xl font-extrabold text-blue-950 uppercase tracking-wide">TERRATRANSPORT SA</h1><p className="text-xs text-slate-600 mt-1">{TEXT.docRef} <span className="font-mono font-bold text-slate-800">{docNumber}</span></p><p className="text-xs text-slate-600">{TEXT.date} <span className="font-medium">{docDate}</span></p></div></div>
        <div className="bg-blue-900 text-white p-4 rounded-lg mb-6 shadow-sm border-l-8 border-blue-600"><h2 className="text-center text-base font-bold tracking-wide uppercase flex items-center justify-center gap-2"><Truck className="w-5 h-5" /> {TEXT.title} ({totalTrucks} VEICOLI)</h2></div>
        <div className="grid grid-cols-2 gap-6 mb-6 text-sm bg-slate-50 p-4 rounded-lg border border-slate-200"><div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{TEXT.issuer}</p><p className="font-bold text-blue-950">Terratransport SA</p><p className="text-slate-600 mt-1">{TEXT.partner} <strong className="text-slate-900">{partnerName}</strong></p></div><div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{TEXT.client}</p><p className="font-bold text-slate-900">{clientName}</p></div></div>
        <div className="mb-6"><h3 className="text-xs font-bold text-slate-800 mb-2 border-l-4 border-blue-700 pl-2 uppercase tracking-wide">{TEXT.summaryTitle}</h3><p className="text-xs text-slate-700 leading-relaxed text-justify bg-slate-50/50 p-3 rounded border border-slate-100">{summaryText}</p></div>
        <div className="mb-6"><h3 className="text-xs font-bold text-slate-800 mb-3 border-l-4 border-blue-700 pl-2 uppercase tracking-wide flex items-center gap-2"><Clock className="w-4 h-4 text-blue-700" /> {TEXT.scheduleTitle}</h3><table className="w-full text-xs text-left border-collapse border border-slate-300"><thead><tr className="bg-blue-950 text-white font-semibold"><th className="p-3 border border-slate-300">{TEXT.thTranche}</th><th className="p-3 border border-slate-300 text-center">{TEXT.thQty}</th><th className="p-3 border border-slate-300">{TEXT.thDelay}</th><th className="p-3 border border-slate-300 text-center">{TEXT.thStatus}</th></tr></thead><tbody>{tranches.map((item, idx) => <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'}><td className="p-3 border border-slate-300 font-bold text-blue-900">{item.name}</td><td className="p-3 border border-slate-300 text-center font-extrabold text-slate-900 text-sm">{item.qty} camion</td><td className="p-3 border border-slate-300 text-slate-700 font-medium">{item.delay}</td><td className="p-3 border border-slate-300 text-center text-green-700 font-semibold bg-green-50/50">✓ {TEXT.statusScheduled}</td></tr>)}</tbody><tfoot><tr className="bg-blue-50 font-bold text-slate-900 border-t-2 border-blue-900"><td className="p-3 border border-slate-300 text-blue-950">{TEXT.totalVehicles}</td><td className="p-3 border border-slate-300 text-center text-blue-950 text-base font-extrabold" colSpan="3">{totalTrucks} camion {partnerName}</td></tr></tfoot></table></div>
        <div className="grid grid-cols-2 gap-6 mb-8 items-center bg-slate-50 p-4 rounded-lg border border-slate-200"><div><h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wide flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-blue-700" /> {TEXT.specsTitle}</h4><ul className="text-xs text-slate-700 space-y-2">{specs.map((spec, index) => <li key={index} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /><span>{spec}</span></li>)}</ul></div><div className="text-center"><img src="/truck.png" alt="Camion Terratransport" className="max-h-32 mx-auto object-contain rounded border border-slate-200 shadow-sm" style={{ maxWidth: '280px', maxHeight: '130px' }} onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x150?text=Camion+IVECO'; }} /></div></div>
        <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center"><div><p className="text-xs font-bold text-slate-700 uppercase mb-8">{TEXT.signIveco}</p><div className="h-16 flex items-center justify-center"><span className="text-xs text-slate-400 italic">[ Accordo e firma del produttore ]</span></div></div><div><p className="text-xs font-bold text-slate-700 uppercase mb-1">{TEXT.signTerratransport}</p><p className="text-[10px] text-slate-500 italic mb-2">{TEXT.stampNotice}</p><div className="relative flex justify-center items-center"><img src="/stamp.png" alt="Timbro Terratransport" className="h-24 object-contain" style={{ maxWidth: '120px', maxHeight: '120px' }} onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/120x120?text=Timbro+Ufficiale'; }} /></div></div></div>
      </div></div>
    </div>
  );
}
