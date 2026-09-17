import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Building2, Calendar, CheckCircle2, Download, FileText, Printer, Trash2, Truck } from 'lucide-react';

const initialTranches = [
  { name: '1ª Tranche', qty: 20, delay: 'Consegna immediata (disponibilità iniziale)' },
  { name: '2ª Tranche', qty: 20, delay: '3 mesi dopo la tranche precedente' },
  { name: '3ª Tranche', qty: 30, delay: '3 mesi dopo la tranche precedente' },
  { name: '4ª Tranche', qty: 30, delay: '3 mesi dopo la tranche precedente' },
];

const translations = {
  it: {
    language: 'Lingua', languageName: 'Italiano', otherLanguage: 'Francese',
    panelTitle: 'Generatore di documenti', reference: 'Numero di riferimento', date: 'Data del documento',
    partner: 'Produttore / Partner', client: 'Destinatario / Cliente', subject: 'Testo di presentazione / Oggetto',
    tranches: 'Tranche di consegna', addTranche: '+ Aggiungi una tranche', commitments: 'Impegni e garanzie',
    download: 'Scarica PDF', print: 'Stampa', reset: 'Reimposta', documentTitle: 'LETTERA D’IMPEGNO E PIANO DI CONSEGNA DEI CAMION',
    supplier: 'Fornitore / Produttore', beneficiary: 'Destinatario / Beneficiario', letterSubject: 'Oggetto della lettera di consegna',
    schedule: 'Calendario previsionale delle consegne', total: 'Volume totale della flotta da consegnare', quality: 'Impegni di qualità e assistenza IVECO',
    forManufacturer: 'Per il produttore IVECO', forBeneficiary: 'Per il destinatario / beneficiario', immediate: 'Consegna immediata',
    defaultSummary: 'Nell’ambito della partnership strategica tra Terratransport SA e il produttore IVECO, la presente lettera definisce le modalità logistiche e il calendario di consegna dei camion.',
    defaultSpecs: ['Camion ispezionati e certificati conformi agli standard internazionali IVECO prima di ogni partenza.', 'Monitoraggio logistico, trasporto e gestione delle formalità di ricezione da parte di Terratransport SA.', 'Garanzia del produttore attiva e assistenza tecnica prioritaria a partire dalla consegna.'],
  },
  fr: {
    language: 'Langue', languageName: 'Français', otherLanguage: 'Italien', panelTitle: 'Générateur de documents', reference: 'Numéro de référence', date: 'Date du document',
    partner: 'Fabricant / Partenaire', client: 'Destinataire / Client', subject: 'Texte de présentation / Objet', tranches: 'Tranches de livraison', addTranche: '+ Ajouter une tranche', commitments: 'Engagements et garanties', download: 'Télécharger le PDF', print: 'Imprimer', reset: 'Réinitialiser', documentTitle: "LETTRE D'ENGAGEMENT ET PLAN DE LIVRAISON DES CAMIONS", supplier: 'Fournisseur / Fabricant', beneficiary: 'Destinataire / Bénéficiaire', letterSubject: 'Objet de la lettre de livraison', schedule: 'Calendrier prévisionnel des livraisons', total: 'Volume total de la flotte à livrer', quality: 'Engagements qualité et assistance IVECO', forManufacturer: 'Pour le fabricant IVECO', forBeneficiary: 'Pour le destinataire / bénéficiaire', immediate: 'Livraison immédiate', defaultSummary: 'Dans le cadre du partenariat stratégique entre Terratransport SA et le fabricant IVECO, la présente lettre fixe les modalités logistiques et le calendrier de livraison des camions.', defaultSpecs: ['Camions inspectés et certifiés conformes aux standards internationaux IVECO avant chaque départ.', 'Suivi logistique, transport et gestion des formalités de réception par Terratransport SA.', 'Garantie constructeur active et assistance technique prioritaire à compter de la livraison.'],
  },
};

export default function App() {
  const [language, setLanguage] = useState('it');
  const [docNumber, setDocNumber] = useState('ENG-2026-IVECO-100');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientName, setClientName] = useState('Ministero dei Trasporti / Partner Destinatario');
  const [partnerName, setPartnerName] = useState('IVECO');
  const [summaryText, setSummaryText] = useState(translations.it.defaultSummary);
  const [tranches, setTranches] = useState(initialTranches);
  const [specs, setSpecs] = useState(translations.it.defaultSpecs);
  const documentRef = useRef(null);
  const t = translations[language];
  const totalTrucks = tranches.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    setSummaryText(translations[nextLanguage].defaultSummary);
    setSpecs(translations[nextLanguage].defaultSpecs);
    setTranches(initialTranches.map((item, index) => ({ ...item, name: `${index + 1}ª Tranche`, delay: nextLanguage === 'it' ? (index === 0 ? 'Consegna immediata (disponibilità iniziale)' : '3 mesi dopo la tranche precedente') : (index === 0 ? 'Livraison immédiate (mise à disposition initiale)' : '3 mois après la tranche précédente') })));
  };

  const updateTranche = (index, field, value) => setTranches((items) => items.map((item, i) => i === index ? { ...item, [field]: field === 'qty' ? Math.max(0, parseInt(value, 10) || 0) : value } : item));
  const addTranche = () => setTranches((items) => [...items, { name: `${items.length + 1}ª Tranche`, qty: 10, delay: language === 'it' ? 'Secondo il calendario concordato' : 'Selon le calendrier convenu' }]);
  const removeTranche = (index) => setTranches((items) => items.length > 1 ? items.filter((_, i) => i !== index) : items);
  const reset = () => { setDocNumber('ENG-2026-IVECO-100'); setDocDate(new Date().toISOString().split('T')[0]); setClientName('Ministero dei Trasporti / Partner Destinatario'); setPartnerName('IVECO'); setSummaryText(t.defaultSummary); setSpecs(t.defaultSpecs); setTranches(initialTranches); };
  const downloadPdf = async () => { const canvas = await html2canvas(documentRef.current, { scale: 2, useCORS: true, logging: false }); const pdf = new jsPDF('p', 'mm', 'a4'); const width = pdf.internal.pageSize.getWidth(); pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, canvas.height * width / canvas.width); pdf.save(`Terratransport_${language}_${docNumber}.pdf`); };

  return <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8 no-print border border-slate-200">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4"><h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Building2 className="text-blue-700" />{t.panelTitle}</h2><label className="flex items-center gap-2 text-sm font-semibold text-slate-600">{t.language}<select value={language} onChange={(e) => changeLanguage(e.target.value)} className="border rounded-lg px-3 py-2 bg-white"><option value="it">🇮🇹 {translations.it.languageName}</option><option value="fr">🇫🇷 {translations.fr.languageName}</option></select></label></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><Field icon={<FileText />} label={t.reference} value={docNumber} onChange={setDocNumber} /><Field icon={<Calendar />} label={t.date} type="date" value={docDate} onChange={setDocDate} /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><Field label={t.partner} value={partnerName} onChange={setPartnerName} /><Field label={t.client} value={clientName} onChange={setClientName} /></div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{t.subject}</label><textarea rows={2} value={summaryText} onChange={(e) => setSummaryText(e.target.value)} className="w-full border rounded-lg p-2 mb-4" />
      <label className="block text-xs font-bold text-slate-700 mb-2">{t.tranches}</label>{tranches.map((item, index) => <div key={index} className="flex items-center gap-2 mb-2"><input value={item.name} onChange={(e) => updateTranche(index, 'name', e.target.value)} className="w-32 border rounded-lg p-2 text-sm" /><input type="number" min="0" value={item.qty} onChange={(e) => updateTranche(index, 'qty', e.target.value)} className="w-20 border rounded-lg p-2 text-sm" /><input value={item.delay} onChange={(e) => updateTranche(index, 'delay', e.target.value)} className="flex-1 border rounded-lg p-2 text-sm" /><button onClick={() => removeTranche(index)} className="text-red-600" aria-label={t.reset}><Trash2 className="w-4 h-4" /></button></div>)}
      <button onClick={addTranche} className="text-blue-700 text-sm font-semibold mb-4">{t.addTranche}</button>
      <label className="block text-xs font-bold text-slate-700 mb-2">{t.commitments}</label>{specs.map((spec, index) => <input key={index} value={spec} onChange={(e) => setSpecs((items) => items.map((item, i) => i === index ? e.target.value : item))} className="w-full border rounded-lg p-2 mb-2 text-sm" />)}
      <div className="flex flex-wrap gap-3 pt-2 border-t"><button onClick={downloadPdf} className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg"><Download className="w-4 h-4" />{t.download}</button><button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg"><Printer className="w-4 h-4" />{t.print}</button><button onClick={reset} className="flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-lg"><CheckCircle2 className="w-4 h-4" />{t.reset}</button></div>
    </div>
    <div className="max-w-4xl mx-auto overflow-auto"><div ref={documentRef} className="bg-white p-10 shadow-xl border text-slate-900 mx-auto print-container" style={{ width: '210mm', minHeight: '297mm' }}>
      <div className="flex justify-between items-start border-b-2 border-blue-900 pb-6 mb-6"><div><img src="/logo.png" alt="Logo Terratransport" className="h-16 object-contain mb-2" /><p className="text-xs text-slate-500">Terratransport SA</p></div><div className="text-right text-xs"><p><b>{t.reference}:</b> {docNumber}</p><p><b>{t.date}:</b> {docDate}</p></div></div>
      <h1 className="bg-blue-900 text-white p-4 rounded-lg mb-6 text-center text-base font-bold">{t.documentTitle}</h1>
      <div className="grid grid-cols-2 gap-6 mb-6 text-sm bg-slate-50 p-4 rounded-lg border"><p><b>{t.supplier}:</b><br />{partnerName}</p><p><b>{t.beneficiary}:</b><br />{clientName}</p></div>
      <section className="mb-6"><h3 className="text-xs font-bold mb-2 border-l-4 border-blue-700 pl-2 uppercase">{t.letterSubject}</h3><p className="text-xs text-slate-700 leading-relaxed">{summaryText}</p></section>
      <section className="mb-6"><h3 className="text-xs font-bold mb-3 border-l-4 border-blue-700 pl-2 uppercase flex items-center gap-2"><Truck className="w-4 h-4" />{t.schedule}</h3><table className="w-full text-xs border-collapse"><thead><tr className="bg-blue-900 text-white"><th className="p-2 text-left">Tranche</th><th className="p-2 text-left">Quantità</th><th className="p-2 text-left">Termine</th></tr></thead><tbody>{tranches.map((item, index) => <tr key={index} className="border-b"><td className="p-2">{item.name}</td><td className="p-2">{item.qty}</td><td className="p-2">{item.delay}</td></tr>)}</tbody></table></section>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm font-bold flex items-center gap-2"><Truck className="text-blue-700" />{t.total}: {totalTrucks} camion</div>
      <section className="mb-8"><h3 className="text-xs font-bold mb-3 border-l-4 border-blue-700 pl-2 uppercase">{t.quality}</h3><ul className="text-xs text-slate-700 leading-relaxed list-disc pl-5">{specs.map((spec, index) => <li key={index}>{spec}</li>)}</ul></section>
      <div className="mt-12 pt-6 border-t grid grid-cols-2 gap-8 text-center text-xs"><div><p className="font-bold uppercase mb-8">{t.forManufacturer}</p><div className="border-b h-8" /></div><div><p className="font-bold uppercase mb-8">{t.forBeneficiary}</p><div className="border-b h-8" /></div></div>
    </div></div>
  </div>;
}

function Field({ icon, label, type = 'text', value, onChange }) { return <div><label className="block text-xs font-semibold text-slate-600 mb-1">{icon && React.cloneElement(icon, { className: 'inline w-4 h-4 mr-1' })}{label}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border rounded-lg p-2" /></div>; }
