import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Building2, Calendar, CheckCircle2, Download, FileText, Printer, Trash2, Truck } from 'lucide-react';

const initialTranches = [
  { name: '1ª Tranche', qty: 20, delay: 'Livraison immédiate (mise à disposition initiale)' },
  { name: '2ª Tranche', qty: 20, delay: '3 mois après la tranche précédente' },
  { name: '3ª Tranche', qty: 30, delay: '3 mois après la tranche précédente' },
  { name: '4ª Tranche', qty: 30, delay: '3 mois après la tranche précédente' },
];

export default function App() {
  const [language, setLanguage] = useState('fr');
  const [docNumber, setDocNumber] = useState('ENG-2026-IVECO-100');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientName, setClientName] = useState('Ministero dei Trasporti / Partner Destinatario');
  const [partnerName, setPartnerName] = useState('IVECO');
  const [summaryText, setSummaryText] = useState("Dans le cadre du partenariat stratégique entre Terratransport SA et le fabricant IVECO, la présente lettre fixe les modalités logistiques et le calendrier officiel de livraison des camions.");
  const [tranches, setTranches] = useState(initialTranches);
  const [specs, setSpecs] = useState([
    'Camions inspectés et certifiés conformes aux standards internationaux IVECO avant chaque départ.',
    'Suivi logistique, transport et gestion des formalités de réception par Terratransport SA.',
    'Garantie constructeur active et assistance technique prioritaire à compter de la livraison.',
  ]);
  const documentRef = useRef(null);
  const totalTrucks = tranches.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  const updateTranche = (index, field, value) => setTranches((items) => items.map((item, i) => i === index ? { ...item, [field]: field === 'qty' ? Math.max(0, parseInt(value, 10) || 0) : value } : item));
  const addTranche = () => setTranches((items) => [...items, { name: `${items.length + 1}ª Tranche`, qty: 10, delay: 'Selon le calendrier convenu' }]);
  const removeTranche = (index) => setTranches((items) => items.length > 1 ? items.filter((_, i) => i !== index) : items);
  const downloadPdf = async () => {
    const canvas = await html2canvas(documentRef.current, { scale: 2, useCORS: true, logging: false });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, canvas.height * width / canvas.width);
    pdf.save(`Terratransport_${language}_${docNumber}.pdf`);
  };

  return <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8 no-print border border-slate-200">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4"><h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Building2 className="text-blue-700" />Panneau de contrôle</h2><label className="text-sm font-semibold">🌐 Langue <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-slate-50 border rounded-lg px-3 py-2 ml-2"><option value="fr">Français</option><option value="it">Italiano</option><option value="en">English</option></select></label></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><Field icon={<FileText />} label="Numéro de référence" value={docNumber} onChange={setDocNumber} /><Field icon={<Calendar />} label="Date d'émission" type="date" value={docDate} onChange={setDocDate} /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><Field label="Fabricant / Partenaire" value={partnerName} onChange={setPartnerName} /><Field label="Destinataire / Client" value={clientName} onChange={setClientName} /></div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">Texte de présentation / Objet</label><textarea rows={2} value={summaryText} onChange={(e) => setSummaryText(e.target.value)} className="w-full bg-slate-50 border rounded-lg p-2 text-sm mb-4" />
      <label className="block text-xs font-bold text-slate-700 mb-2">Tranches de livraison</label>{tranches.map((item, index) => <div key={index} className="flex items-center gap-2 mb-2"><input value={item.name} onChange={(e) => updateTranche(index, 'name', e.target.value)} className="w-1/4 bg-slate-50 border rounded-lg p-2 text-sm" /><input type="number" value={item.qty} onChange={(e) => updateTranche(index, 'qty', e.target.value)} className="w-1/6 bg-slate-50 border rounded-lg p-2 text-sm" /><input value={item.delay} onChange={(e) => updateTranche(index, 'delay', e.target.value)} className="flex-1 bg-slate-50 border rounded-lg p-2 text-sm" /><button onClick={() => removeTranche(index)} className="text-red-500" title="Supprimer"><Trash2 className="w-4 h-4" /></button></div>)}
      <button onClick={addTranche} className="text-blue-700 text-sm font-semibold mb-4">+ Ajouter une tranche</button>
      <label className="block text-xs font-bold text-slate-700 mb-2">Engagements et garanties</label>{specs.map((spec, index) => <input key={index} value={spec} onChange={(e) => setSpecs((items) => items.map((item, i) => i === index ? e.target.value : item))} className="w-full bg-slate-50 border rounded-lg p-2 text-sm mb-2" />)}
      <div className="flex gap-4 pt-2 border-t"><button onClick={downloadPdf} className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg"><Download className="w-4 h-4" />Télécharger le PDF</button><button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg"><Printer className="w-4 h-4" />Imprimer</button></div>
    </div>
    <div className="max-w-4xl mx-auto overflow-auto"><div ref={documentRef} className="bg-white p-10 shadow-xl border text-slate-900 mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
      <div className="flex justify-between items-start border-b-2 border-blue-900 pb-6 mb-6"><div><img src="/logo.png" alt="Logo Terratransport" className="h-16 object-contain mb-2" /><p className="text-xs text-slate-500">Terratransport SA</p></div><div className="text-right text-xs"><p><b>Réf. engagement :</b> {docNumber}</p><p><b>Date d'émission :</b> {docDate}</p></div></div>
      <h1 className="bg-blue-900 text-white p-4 rounded-lg mb-6 text-center text-base font-bold">LETTRE D'ENGAGEMENT ET PLAN DE LIVRAISON DES CAMIONS</h1>
      <div className="grid grid-cols-2 gap-6 mb-6 text-sm bg-slate-50 p-4 rounded-lg border"><p><b>Fournisseur / Fabricant :</b><br />{partnerName}</p><p><b>Destinataire / Bénéficiaire :</b><br />{clientName}</p><p><b>Transporteur et gestionnaire :</b><br />Terratransport SA</p><p><b>Site Web officiel :</b><br /><span>terratransport-sa.com</span></p></div>
      <section className="mb-6"><h3 className="text-xs font-bold mb-2 border-l-4 border-blue-700 pl-2 uppercase">Objet de la lettre de livraison</h3><p className="text-xs text-slate-700 leading-relaxed">{summaryText}</p></section>
      <section className="mb-6"><h3 className="text-xs font-bold mb-3 border-l-4 border-blue-700 pl-2 uppercase flex items-center gap-2"><Truck className="w-4 h-4" />Calendrier prévisionnel des livraisons</h3><table className="w-full text-xs border-collapse"><thead><tr className="bg-blue-900 text-white"><th className="p-2 text-left">Phase / Tranche</th><th className="p-2 text-center">Nombre de camions</th><th className="p-2 text-left">Délai / Échéance</th><th className="p-2 text-left">État de l'approvisionnement</th></tr></thead><tbody>{tranches.map((item, index) => <tr key={index} className="border-b"><td className="p-2">{item.name}</td><td className="p-2 text-center">{item.qty}</td><td className="p-2">{item.delay}</td><td className="p-2 text-green-700"><CheckCircle2 className="inline w-3 h-3 mr-1" />Planifié et garanti par IVECO</td></tr>)}</tbody></table></section>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm font-bold flex items-center gap-2"><Truck className="text-blue-700" />Volume total de la flotte à livrer : {totalTrucks}</div>
      <section className="mb-8"><h3 className="text-xs font-bold mb-3 border-l-4 border-blue-700 pl-2 uppercase">Engagements qualité et assistance IVECO</h3><ul className="text-xs text-slate-700 list-disc pl-5 space-y-2">{specs.map((spec, index) => <li key={index}>{spec}</li>)}</ul></section>
      <div className="mt-12 pt-6 border-t grid grid-cols-2 gap-8 text-center text-xs"><div><p className="font-bold uppercase mb-8">Pour le fabricant IVECO</p><div className="border-b h-8" /></div><div><p className="font-bold uppercase mb-8">Pour Terratransport SA</p><div className="border-b h-8" /></div></div>
    </div></div>
  </div>;
}

function Field({ icon, label, type = 'text', value, onChange }) { return <div><label className="block text-xs font-semibold text-slate-600 mb-1">{icon && React.cloneElement(icon, { className: 'inline w-3.5 h-3.5 mr-1' })}{label}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 border rounded-lg p-2 text-sm" /></div>; }
