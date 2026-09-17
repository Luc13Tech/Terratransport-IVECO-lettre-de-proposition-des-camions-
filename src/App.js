import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Building2, Calendar, CheckCircle2, Clock, Download, FileText, Plus,
  Printer, Trash2, Truck, ShieldCheck,
} from 'lucide-react';

const TRANSLATIONS = {
  it: {
    language: 'Lingua', languageName: 'Italiano',
    controlPanel: 'Pannello di controllo', reference: 'Numero di riferimento',
    issueDate: 'Data di emissione', manufacturer: 'Produttore / Partner',
    recipient: 'Destinatario / Cliente', subject: 'Testo di presentazione / Oggetto',
    deliveries: 'Tranche di consegna (calcolo dinamico)', trancheName: 'Nome tranche',
    quantity: 'Quantità', deadline: 'Scadenza', commitments: 'Impegni e garanzie',
    delete: 'Elimina la tranche', addTranche: 'Aggiungi tranche', download: 'Scarica PDF',
    print: 'Stampa', title: 'LETTERA DI IMPEGNO E PIANO DI CONSEGNA CAMION',
    ref: 'Rif. Impegno:', date: 'Data di emissione:', partner: 'Fornitore / Produttore:',
    client: 'Destinatario / Beneficiario:', issuer: 'Vettore & Gestore:',
    website: 'Sito Web Ufficiale:', summaryTitle: 'Oggetto della Lettera di Consegna',
    scheduleTitle: 'Programma di Pianificazione delle Consegne', tranche: 'Fase / Tranche',
    trucks: 'Numero di Camion', timing: 'Tempistica / Scadenza', status: 'Stato Approvvigionamento',
    guaranteed: 'Pianificato e Garantito IVECO', total: 'Volume Totale Flotta da Consegnare:',
    specsTitle: 'Impegni Qualità e Assistenza IVECO', terratransport: 'Per Terratransport SA',
    iveco: 'Per il Produttore IVECO', stamp: 'Timbro Ufficiale e Approvazione Dirigenziale',
    defaultDelay: 'Secondo il calendario concordato', immediate: 'Consegna immediata (messa a disposizione iniziale)',
    months: (n) => `${n} mesi dopo la tranche precedente`,
  },
  fr: {
    language: 'Langue', languageName: 'Français', controlPanel: 'Panneau de contrôle',
    reference: 'Numéro de référence', issueDate: "Date d'émission", manufacturer: 'Fabricant / Partenaire',
    recipient: 'Destinataire / Client', subject: 'Texte de présentation / Objet',
    deliveries: 'Tranches de livraison (calcul dynamique)', trancheName: 'Nom de la tranche',
    quantity: 'Quantité', deadline: 'Échéance', commitments: 'Engagements et garanties',
    delete: 'Supprimer la tranche', addTranche: 'Ajouter une tranche', download: 'Télécharger le PDF',
    print: 'Imprimer', title: "LETTRE D'ENGAGEMENT ET PLAN DE LIVRAISON DES CAMIONS", ref: "Réf. engagement :",
    date: "Date d'émission :", partner: 'Fournisseur / Fabricant :', client: 'Destinataire / Bénéficiaire :',
    issuer: 'Transporteur et gestionnaire :', website: 'Site Web officiel :', summaryTitle: 'Objet de la lettre de livraison',
    scheduleTitle: 'Calendrier prévisionnel des livraisons', tranche: 'Phase / Tranche', trucks: 'Nombre de camions',
    timing: 'Délai / Échéance', status: "État de l'approvisionnement", guaranteed: 'Planifié et garanti par IVECO',
    total: 'Volume total de la flotte à livrer :', specsTitle: 'Engagements qualité et assistance IVECO',
    terratransport: 'Pour Terratransport SA', iveco: 'Pour le fabricant IVECO',
    stamp: 'Cachet officiel et approbation de la direction', defaultDelay: 'Selon le calendrier convenu',
    immediate: 'Livraison immédiate (mise à disposition initiale)', months: (n) => `${n} mois après la tranche précédente`,
  },
  en: {
    language: 'Language', languageName: 'English', controlPanel: 'Control panel', reference: 'Reference number',
    issueDate: 'Issue date', manufacturer: 'Manufacturer / Partner', recipient: 'Recipient / Client',
    subject: 'Presentation text / Subject', deliveries: 'Delivery tranches (dynamic calculation)', trancheName: 'Tranche name',
    quantity: 'Quantity', deadline: 'Deadline', commitments: 'Commitments and guarantees', delete: 'Delete tranche',
    addTranche: 'Add tranche', download: 'Download PDF', print: 'Print', title: 'TRUCK DELIVERY COMMITMENT LETTER AND PLAN',
    ref: 'Commitment ref.:', date: 'Issue date:', partner: 'Supplier / Manufacturer:', client: 'Recipient / Beneficiary:',
    issuer: 'Carrier & Manager:', website: 'Official website:', summaryTitle: 'Subject of the Delivery Letter',
    scheduleTitle: 'Delivery Planning Schedule', tranche: 'Phase / Tranche', trucks: 'Number of Trucks',
    timing: 'Timing / Deadline', status: 'Procurement Status', guaranteed: 'Planned and Guaranteed by IVECO',
    total: 'Total Fleet Volume to Be Delivered:', specsTitle: 'IVECO Quality and Support Commitments',
    terratransport: 'For Terratransport SA', iveco: 'For the IVECO Manufacturer',
    stamp: 'Official Stamp and Management Approval', defaultDelay: 'According to the agreed schedule',
    immediate: 'Immediate delivery (initial availability)', months: (n) => `${n} months after the previous tranche`,
  },
};

const initialTranches = [
  { name: '1ª Tranche', qty: 20, delay: TRANSLATIONS.it.immediate },
  { name: '2ª Tranche', qty: 20, delay: TRANSLATIONS.it.months(3) },
  { name: '3ª Tranche', qty: 30, delay: TRANSLATIONS.it.months(3) },
  { name: '4ª Tranche', qty: 30, delay: TRANSLATIONS.it.months(3) },
];

export default function App() {
  const [language, setLanguage] = useState('it');
  const t = TRANSLATIONS[language];
  const [docNumber, setDocNumber] = useState('ENG-2026-IVECO-100');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientName, setClientName] = useState('Ministero dei Trasporti / Partner Destinatario');
  const [partnerName, setPartnerName] = useState('IVECO');
  const [summaryText, setSummaryText] = useState("Nell'ambito della partnership strategica tra Terratransport SA e il produttore IVECO, la presente lettera stabilisce le modalità logistiche e il calendario ufficiale di approvvigionamento e consegna dei camion.");
  const [tranches, setTranches] = useState(initialTranches);
  const [specs, setSpecs] = useState([
    'Ispezionati e certificati conformi agli standard internazionali IVECO prima di ogni partenza.',
    'Monitoraggio logistico, trasporto e gestione delle formalità di ricezione da parte di Terratransport.',
    'Garanzia del produttore attiva e assistenza tecnica prioritaria dalla consegna delle chiavi.',
  ]);
  const documentRef = useRef(null);
  const totalTrucks = tranches.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  const handleTrancheChange = (index, field, value) => setTranches((current) => current.map((item, i) => i === index ? { ...item, [field]: field === 'qty' ? Math.max(0, parseInt(value, 10) || 0) : value } : item));
  const addTranche = () => setTranches((current) => [...current, { name: `${current.length + 1}ª Tranche`, qty: 10, delay: t.defaultDelay }]);
  const removeTranche = (index) => setTranches((current) => current.length > 1 ? current.filter((_, i) => i !== index) : current);
  const handleDownloadPdf = async () => {
    const canvas = await html2canvas(documentRef.current, { scale: 2, useCORS: true, logging: false });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, (canvas.height * width) / canvas.width);
    pdf.save(`Terratransport_${language}_${docNumber}.pdf`);
  };

  return <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8 no-print border border-slate-200">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4"><h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Building2 className="text-blue-700" />{t.controlPanel}</h2>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600"><span>🌐 {t.language}</span><select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"><option value="it">Italiano</option><option value="fr">Français</option><option value="en">English</option></select></label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><Field icon={<FileText />} label={t.reference} value={docNumber} onChange={setDocNumber} /><Field icon={<Calendar />} label={t.issueDate} type="date" value={docDate} onChange={setDocDate} /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><Field label={t.manufacturer} value={partnerName} onChange={setPartnerName} /><Field label={t.recipient} value={clientName} onChange={setClientName} /></div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{t.subject}</label><textarea rows={2} value={summaryText} onChange={(e) => setSummaryText(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm mb-4" />
      <div className="mb-4"><label className="block text-xs font-bold text-slate-700 mb-2">{t.deliveries}</label>{tranches.map((item, index) => <div key={index} className="flex items-center gap-2 mb-2"><input aria-label={t.trancheName} value={item.name} onChange={(e) => handleTrancheChange(index, 'name', e.target.value)} placeholder={t.trancheName} className="w-1/4 bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm" /><input aria-label={t.quantity} type="number" value={item.qty} onChange={(e) => handleTrancheChange(index, 'qty', e.target.value)} className="w-1/6 bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm" /><input aria-label={t.deadline} value={item.delay} onChange={(e) => handleTrancheChange(index, 'delay', e.target.value)} placeholder={t.deadline} className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm" /><button onClick={() => removeTranche(index)} className="text-red-500 hover:text-red-700 p-1" title={t.delete}><Trash2 className="w-4 h-4" /></button></div>)}<button onClick={addTranche} className="mt-1 flex items-center gap-1 text-xs font-semibold text-blue-700"><Plus className="w-3.5 h-3.5" />{t.addTranche}</button></div>
      <div className="mb-6"><label className="block text-xs font-bold text-slate-700 mb-2">{t.commitments}</label>{specs.map((spec, index) => <input key={index} value={spec} onChange={(e) => setSpecs((current) => current.map((value, i) => i === index ? e.target.value : value))} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm mb-2" />)}</div>
      <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-200"><button onClick={handleDownloadPdf} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-medium px-5 py-2.5 rounded-lg shadow"><Download className="w-4 h-4" />{t.download}</button><button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white font-medium px-5 py-2.5 rounded-lg shadow"><Printer className="w-4 h-4" />{t.print}</button></div>
    </div>
    <div className="max-w-4xl mx-auto overflow-auto"><div ref={documentRef} className="bg-white p-10 shadow-xl border border-slate-200 text-slate-900 mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
      <div className="flex justify-between items-start border-b-2 border-blue-900 pb-6 mb-6"><div><img src="/logo.png" alt="Logo Terratransport" className="h-16 object-contain mb-2" /><p className="text-xs text-slate-500">terratransport-sa.com</p></div><div className="text-right text-xs"><p><b>{t.ref}</b> {docNumber}</p><p><b>{t.date}</b> {docDate}</p></div></div>
      <h1 className="bg-blue-900 text-white p-4 rounded-lg mb-6 text-center text-base font-bold tracking-wide">{t.title}</h1>
      <div className="grid grid-cols-2 gap-6 mb-6 text-sm bg-slate-50 p-4 rounded-lg border border-slate-200"><p><b>{t.partner}</b><br />{partnerName}</p><p><b>{t.client}</b><br />{clientName}</p><p><b>{t.issuer}</b><br />Terratransport SA</p><p><b>{t.website}</b><br />www.terratransport.ch</p></div>
      <section className="mb-6"><h3 className="text-xs font-bold text-slate-800 mb-2 border-l-4 border-blue-700 pl-2 uppercase">{t.summaryTitle}</h3><p className="text-xs text-slate-700 leading-relaxed">{summaryText}</p></section>
      <section className="mb-6"><h3 className="text-xs font-bold text-slate-800 mb-3 border-l-4 border-blue-700 pl-2 uppercase flex items-center gap-2"><Clock className="w-4 h-4" />{t.scheduleTitle}</h3><table className="w-full text-xs border-collapse"><thead><tr className="bg-blue-900 text-white"><th className="p-2 text-left">{t.tranche}</th><th className="p-2 text-center">{t.trucks}</th><th className="p-2 text-left">{t.timing}</th><th className="p-2 text-left">{t.status}</th></tr></thead><tbody>{tranches.map((item, index) => <tr key={index} className="border-b border-slate-200"><td className="p-2">{item.name}</td><td className="p-2 text-center">{item.qty}</td><td className="p-2">{item.delay}</td><td className="p-2 text-green-700"><CheckCircle2 className="inline w-3 h-3 mr-1" />{t.guaranteed}</td></tr>)}</tbody></table></section>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm font-bold flex items-center gap-2"><Truck className="text-blue-700" />{t.total} {totalTrucks}</div>
      <section className="mb-8"><h3 className="text-xs font-bold text-slate-800 mb-3 border-l-4 border-blue-700 pl-2 uppercase flex items-center gap-2"><ShieldCheck className="w-4 h-4" />{t.specsTitle}</h3><ul className="text-xs text-slate-700 list-disc pl-5 space-y-2">{specs.map((spec, index) => <li key={index}>{spec}</li>)}</ul></section>
      <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs"><div><p className="font-bold uppercase mb-8">{t.iveco}</p><div className="border-b border-slate-400 h-8" /><p className="mt-2">{t.stamp}</p></div><div><p className="font-bold uppercase mb-8">{t.terratransport}</p><div className="border-b border-slate-400 h-8" /><p className="mt-2">{t.stamp}</p></div></div>
    </div></div>
  </div>;
}

function Field({ icon, label, type = 'text', value, onChange }) { return <div><label className="block text-xs font-semibold text-slate-600 mb-1">{icon && React.cloneElement(icon, { className: 'inline w-3.5 h-3.5 mr-1' })}{label}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm" /></div>; }
