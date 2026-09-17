import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Building2, Calendar, Download, FileText, Printer, Trash2, Truck } from 'lucide-react';

const initialTranches = [
  { name: '1ª Tranche', qty: 20, delay: 'Consegna immediata (disponibilità iniziale)' },
  { name: '2ª Tranche', qty: 20, delay: '3 mesi dopo la tranche precedente' },
  { name: '3ª Tranche', qty: 30, delay: '3 mesi dopo la tranche precedente' },
  { name: '4ª Tranche', qty: 30, delay: '3 mesi dopo la tranche precedente' },
];

const initialSpecs = [
  'Camion ispezionati e certificati conformi agli standard internazionali IVECO prima di ogni partenza.',
  'Monitoraggio logistico, trasporto e gestione delle formalità di ricezione fino alla consegna.',
  'Assistenza tecnica e garanzia secondo le condizioni concordate con il produttore.',
];

const defaultSummary = 'Nell’ambito della partnership strategica tra Terratransport SA e il produttore IVECO, la presente lettera definisce le modalità logistiche e il calendario di consegna dei camion.';

export default function App() {
  const [docNumber, setDocNumber] = useState('ENG-2026-IVECO-100');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientName, setClientName] = useState('Ministero dei Trasporti / Partner Destinatario');
  const [partnerName, setPartnerName] = useState('IVECO');
  const [summaryText, setSummaryText] = useState(defaultSummary);
  const [tranches, setTranches] = useState(initialTranches);
  const [specs, setSpecs] = useState(initialSpecs);
  const documentRef = useRef(null);
  const totalTrucks = tranches.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  const updateTranche = (index, field, value) => setTranches((items) => items.map((item, i) => i === index ? { ...item, [field]: field === 'qty' ? Math.max(0, parseInt(value, 10) || 0) : value } : item));
  const addTranche = () => setTranches((items) => [...items, { name: `${items.length + 1}ª Tranche`, qty: 10, delay: 'Secondo il calendario concordato' }]);
  const removeTranche = (index) => setTranches((items) => items.length > 1 ? items.filter((_, i) => i !== index) : items);
  const reset = () => {
    setDocNumber('ENG-2026-IVECO-100');
    setDocDate(new Date().toISOString().split('T')[0]);
    setClientName('Ministero dei Trasporti / Partner Destinatario');
    setPartnerName('IVECO');
    setSummaryText(defaultSummary);
    setTranches(initialTranches);
    setSpecs(initialSpecs);
  };
  const downloadPdf = async () => {
    const canvas = await html2canvas(documentRef.current, { scale: 2, useCORS: true, logging: false });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, height);
    pdf.save(`${docNumber || 'documento-italiano'}.pdf`);
  };

  return <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8 no-print border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4"><Building2 className="text-blue-700" />Generatore di documenti</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Field icon={<FileText />} label="Numero di riferimento" value={docNumber} onChange={setDocNumber} />
        <Field icon={<Calendar />} label="Data del documento" type="date" value={docDate} onChange={setDocDate} />
        <Field label="Produttore / Partner" value={partnerName} onChange={setPartnerName} />
        <Field label="Destinatario / Cliente" value={clientName} onChange={setClientName} />
      </div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">Testo di presentazione / Oggetto</label>
      <textarea rows={2} value={summaryText} onChange={(e) => setSummaryText(e.target.value)} className="w-full border rounded-lg p-2 mb-4" />
      <label className="block text-xs font-bold text-slate-700 mb-2">Tranche di consegna</label>
      {tranches.map((item, index) => <div key={index} className="flex items-center gap-2 mb-2"><input value={item.name} onChange={(e) => updateTranche(index, 'name', e.target.value)} className="border rounded p-2 flex-1" /><input type="number" min="0" value={item.qty} onChange={(e) => updateTranche(index, 'qty', e.target.value)} className="border rounded p-2 w-20" /><input value={item.delay} onChange={(e) => updateTranche(index, 'delay', e.target.value)} className="border rounded p-2 flex-[2]" /><button onClick={() => removeTranche(index)} title="Rimuovi tranche" className="text-red-600"><Trash2 size={16} /></button></div>)}
      <button onClick={addTranche} className="text-blue-700 text-sm font-semibold mb-4">+ Aggiungi una tranche</button>
      <label className="block text-xs font-bold text-slate-700 mb-2">Impegni e garanzie</label>
      {specs.map((spec, index) => <input key={index} value={spec} onChange={(e) => setSpecs((items) => items.map((value, i) => i === index ? e.target.value : value))} className="w-full border rounded p-2 mb-2" />)}
      <div className="flex flex-wrap gap-3 pt-2 border-t"><button onClick={downloadPdf} className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg"><Download size={16} />Scarica PDF</button><button onClick={() => window.print()} className="flex items-center gap-2 border px-4 py-2 rounded-lg"><Printer size={16} />Stampa</button><button onClick={reset} className="border px-4 py-2 rounded-lg">Reimposta</button></div>
    </div>
    <div className="max-w-4xl mx-auto overflow-auto"><div ref={documentRef} className="bg-white p-10 shadow-xl border text-slate-900 mx-auto print-container" style={{ width: '210mm', minHeight: '297mm' }}>
      <div className="flex justify-between items-start border-b-2 border-blue-900 pb-6 mb-6"><div><img src="/logo.png" alt="Logo Terratransport" className="h-16 object-contain mb-2" /><p className="text-xs">Terratransport SA</p></div><div className="text-right text-xs"><p><b>Riferimento:</b> {docNumber}</p><p><b>Data:</b> {docDate}</p></div></div>
      <h1 className="bg-blue-900 text-white p-4 rounded-lg mb-6 text-center text-base font-bold">LETTERA D’IMPEGNO E PIANO DI CONSEGNA DEI CAMION</h1>
      <div className="grid grid-cols-2 gap-6 mb-6 text-sm bg-slate-50 p-4 rounded-lg border"><p><b>Fornitore / Produttore:</b><br />{partnerName}</p><p><b>Destinatario / Beneficiario:</b><br />{clientName}</p></div>
      <section className="mb-6"><h3 className="text-xs font-bold mb-2 border-l-4 border-blue-700 pl-2 uppercase">Oggetto della lettera di consegna</h3><p className="text-xs text-slate-700 leading-relaxed">{summaryText}</p></section>
      <section className="mb-6"><h3 className="text-xs font-bold mb-3 border-l-4 border-blue-700 pl-2 uppercase flex items-center gap-2"><Truck size={16} />Calendario previsionale delle consegne</h3><table className="w-full text-xs border-collapse"><thead><tr className="bg-blue-100"><th className="border p-2 text-left">Tranche</th><th className="border p-2">Quantità</th><th className="border p-2 text-left">Tempistica</th></tr></thead><tbody>{tranches.map((item, index) => <tr key={index}><td className="border p-2">{item.name}</td><td className="border p-2 text-center">{item.qty}</td><td className="border p-2">{item.delay}</td></tr>)}</tbody></table></section>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm font-bold flex items-center gap-2"><Truck className="text-blue-700" />Volume totale della flotta da consegnare: {totalTrucks} camion</div>
      <section className="mb-8"><h3 className="text-xs font-bold mb-3 border-l-4 border-blue-700 pl-2 uppercase">Impegni di qualità e assistenza IVECO</h3><ul className="text-xs text-slate-700 leading-relaxed list-disc pl-5">{specs.map((spec, index) => <li key={index}>{spec}</li>)}</ul></section>
      <div className="mt-12 pt-6 border-t grid grid-cols-2 gap-8 text-center text-xs"><div><p className="font-bold uppercase mb-8">Per il produttore IVECO</p><div className="border-b h-8" /></div><div><p className="font-bold uppercase mb-8">Per il destinatario / beneficiario</p><div className="border-b h-8" /></div></div>
    </div></div>
  </div>;
}

function Field({ icon, label, type = 'text', value, onChange }) { return <div><label className="block text-xs font-semibold text-slate-600 mb-1">{icon && React.cloneElement(icon, { className: 'inline mr-1', size: 14 })}{label}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border rounded-lg p-2" /></div>; }
