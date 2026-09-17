import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Printer, Globe, DollarSign, Building2, Calendar, FileText, CheckCircle2 } from 'lucide-react';

const TRANSLATIONS = {
  fr: {
    title: "PROPOSITION OFFICIELLE DE LIVRAISON DE 100 CAMIONS",
    docRef: "Réf. Document :",
    date: "Date :",
    partner: "Partenaire Constructeur :",
    client: "Destinataire / Client :",
    issuer: "Émetteur :",
    website: "Site Web :",
    summaryTitle: "Objet de la proposition",
    summaryText: "Dans le cadre de notre partenariat stratégique avec la société IVECO, Terratransport présente cette proposition officielle pour la fourniture et la livraison progressive de cent (100) camions poids lourds haute performance.",
    scheduleTitle: "Planning d'Échelonnement des Tranches de Livraison",
    thTranche: "Tranche",
    thQty: "Quantité",
    thDelay: "Échéance / Calendrier",
    thUnitPrice: "Prix Unitaire Est.",
    thTotalPrice: "Montant Total",
    tranche1: "1ère Tranche",
    tranche2: "2ème Tranche",
    tranche3: "3ème Tranche",
    tranche4: "4ème Tranche",
    delay1: "Immédiat (À la confirmation)",
    delay2: "3 mois après la 1ère tranche",
    delay3: "3 mois après la 2ème tranche",
    delay4: "3 mois après la 3ème tranche",
    totalVehicles: "Total Camions :",
    totalAmount: "Montant Total de la Commande :",
    specsTitle: "Spécifications & Services IVECO Inclus",
    spec1: "Véhicules lourds IVECO de dernière génération certifiés aux normes internationales.",
    spec2: "Garantie constructeur complète et assistance technique dédiée.",
    spec3: "Programme d'entretien et suivi logistique assuré par Terratransport.",
    signTerratransport: "Pour Terratransport SA",
    signIveco: "Pour le Partenaire IVECO",
    stampNotice: "Cachet officiel et signature autorisée",
    currencyName: "XOF (FCFA)",
    downloadBtn: "Télécharger PDF",
    printBtn: "Imprimer"
  },
  en: {
    title: "OFFICIAL DELIVERY PROPOSAL FOR 100 TRUCKS",
    docRef: "Doc Ref:",
    date: "Date:",
    partner: "Manufacturer Partner:",
    client: "Recipient / Client:",
    issuer: "Issuer:",
    website: "Website:",
    summaryTitle: "Proposal Objective",
    summaryText: "As part of our strategic partnership with IVECO, Terratransport submits this official proposal for the progressive supply and delivery of one hundred (100) heavy-duty trucks.",
    scheduleTitle: "Delivery Schedule & Tranche Breakdown",
    thTranche: "Tranche",
    thQty: "Quantity",
    thDelay: "Timeline / Schedule",
    thUnitPrice: "Est. Unit Price",
    thTotalPrice: "Total Amount",
    tranche1: "1st Tranche",
    tranche2: "2nd Tranche",
    tranche3: "3rd Tranche",
    tranche4: "4th Tranche",
    delay1: "Immediate (Upon confirmation)",
    delay2: "3 months after 1st tranche",
    delay3: "3 months after 2nd tranche",
    delay4: "3 months after 3rd tranche",
    totalVehicles: "Total Trucks:",
    totalAmount: "Total Order Amount:",
    specsTitle: "IVECO Specifications & Services Included",
    spec1: "Latest generation IVECO heavy-duty vehicles certified to international standards.",
    spec2: "Comprehensive manufacturer warranty and dedicated technical support.",
    spec3: "Maintenance program and full logistics tracking managed by Terratransport.",
    signTerratransport: "For Terratransport SA",
    signIveco: "For IVECO Partner",
    stampNotice: "Official Stamp & Authorized Signature",
    currencyName: "USD ($)",
    downloadBtn: "Download PDF",
    printBtn: "Print"
  },
  it: {
    title: "PROPOSTA UFFICIALE DI CONSEGNA DI 100 CAMION",
    docRef: "Rif. Documento:",
    date: "Data:",
    partner: "Partner Produttore:",
    client: "Destinatario / Cliente:",
    issuer: "Emittente:",
    website: "Sito Web:",
    summaryTitle: "Oggetto della proposta",
    summaryText: "Nell'ambito della nostra partnership strategica con IVECO, Terratransport presenta questa proposta ufficiale per la fornitura e la consegna progressiva di cento (100) veicoli industriali.",
    scheduleTitle: "Pianificazione e Ripartizione delle Tranche",
    thTranche: "Tranche",
    thQty: "Quantità",
    thDelay: "Tempistica",
    thUnitPrice: "Prezzo Unitario Est.",
    thTotalPrice: "Importo Totale",
    tranche1: "1a Tranche",
    tranche2: "2a Tranche",
    tranche3: "3a Tranche",
    tranche4: "4a Tranche",
    delay1: "Immediata (Alla conferma)",
    delay2: "3 mesi dopo la 1a tranche",
    delay3: "3 mesi dopo la 2a tranche",
    delay4: "3 mesi dopo la 3a tranche",
    totalVehicles: "Totale Camion:",
    totalAmount: "Importo Totale dell'Ordine:",
    specsTitle: "Specifiche e Servizi IVECO Inclusi",
    spec1: "Veicoli IVECO di ultima generazione certificati secondo gli standard internazionali.",
    spec2: "Garanzia completa del produttore e supporto tecnico dedicato.",
    spec3: "Programma di manutenzione e monitoraggio logistico gestito da Terratransport.",
    signTerratransport: "Per Terratransport SA",
    signIveco: "Per il Partner IVECO",
    stampNotice: "Timbro Ufficiale e Firma Autorizzata",
    currencyName: "EUR (€)",
    downloadBtn: "Scarica PDF",
    printBtn: "Stampa"
  },
  es: {
    title: "PROPUESTA OFICIAL DE ENTREGA DE 100 CAMIONES",
    docRef: "Ref. Documento:",
    date: "Fecha:",
    partner: "Socio Fabricante:",
    client: "Destinatario / Cliente:",
    issuer: "Emisor:",
    website: "Sitio Web:",
    summaryTitle: "Objeto de la propuesta",
    summaryText: "En el marco de nuestra alianza estratégica con IVECO, Terratransport presenta esta propuesta oficial para el suministro y la entrega progresiva de cien (100) camiones pesados.",
    scheduleTitle: "Calendario y Cronograma de Entregas",
    thTranche: "Entrega",
    thQty: "Cantidad",
    thDelay: "Plazo / Cronograma",
    thUnitPrice: "Precio Unitario Est.",
    thTotalPrice: "Monto Total",
    tranche1: "1ª Entrega",
    tranche2: "2ª Entrega",
    tranche3: "3ª Entrega",
    tranche4: "4ª Entrega",
    delay1: "Inmediato (A la confirmación)",
    delay2: "3 meses después de la 1ª entrega",
    delay3: "3 meses después de la 2ª entrega",
    delay4: "3 meses después de la 3ª entrega",
    totalVehicles: "Total de Camiones:",
    totalAmount: "Monto Total del Pedido:",
    specsTitle: "Especificaciones y Servicios IVECO Incluidos",
    spec1: "Vehículos pesados IVECO de última generación certificados bajo normas internacionales.",
    spec2: "Garantía completa de fábrica y asistencia técnica dedicada.",
    spec3: "Programa de mantenimiento y seguimiento logístico gestionado por Terratransport.",
    signTerratransport: "Por Terratransport SA",
    signIveco: "Por el Socio IVECO",
    stampNotice: "Sello Oficial y Firma Autorizada",
    currencyName: "EUR (€)",
    downloadBtn: "Descargar PDF",
    printBtn: "Imprimir"
  }
};

const DEFAULT_CURRENCIES = {
  fr: { symbol: "FCFA", rate: 1, format: (val) => val.toLocaleString('fr-FR') + " FCFA" },
  en: { symbol: "$", rate: 0.0016, format: (val) => "$" + (val * 0.0016).toLocaleString('en-US', { maximumFractionDigits: 2 }) },
  it: { symbol: "€", rate: 0.0015, format: (val) => (val * 0.0015).toLocaleString('it-IT', { maximumFractionDigits: 2 }) + " €" },
  es: { symbol: "€", rate: 0.0015, format: (val) => (val * 0.0015).toLocaleString('es-ES', { maximumFractionDigits: 2 }) + " €" },
};

export default function App() {
  const [lang, setLang] = useState('fr');
  const [clientName, setClientName] = useState('Ministère des Transports / Entreprise Partenaire');
  const [docNumber, setDocNumber] = useState('PROP-2026-IVECO-100');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [unitPriceBase, setUnitPriceBase] = useState(65000000); // Prix unitaire FCFA de base
  const documentRef = useRef();

  const t = TRANSLATIONS[lang];
  const curr = DEFAULT_CURRENCIES[lang];

  const tranches = [
    { name: t.tranche1, qty: 20, delay: t.delay1 },
    { name: t.tranche2, qty: 20, delay: t.delay2 },
    { name: t.tranche3, qty: 30, delay: t.delay3 },
    { name: t.tranche4, qty: 30, delay: t.delay4 },
  ];

  const totalTrucks = tranches.reduce((acc, item) => acc + item.qty, 0);
  const totalCostBase = totalTrucks * unitPriceBase;

  const handleDownloadPdf = async () => {
    const element = documentRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Terratransport_Proposition_${docNumber}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      {/* BARRE DE CONTRÔLE (Panneau d'Édition) */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8 no-print border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Building2 className="text-blue-600" /> Configuration de la Proposition Dynamique
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Langue & Devise */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Langue du Document
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="fr">Français (FCFA)</option>
              <option value="en">English (USD $)</option>
              <option value="it">Italiano (EUR €)</option>
              <option value="es">Español (EUR €)</option>
            </select>
          </div>

          {/* N° Référence */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> N° Référence
            </label>
            <input
              type="text"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Date du document
            </label>
            <input
              type="date"
              value={docDate}
              onChange={(e) => setDocDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Prix Unitaire de base */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> Prix Unitaire Est. (FCFA)
            </label>
            <input
              type="number"
              value={unitPriceBase}
              onChange={(e) => setUnitPriceBase(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Client / Destinataire */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Destinataire / Client
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-200">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow transition duration-200"
          >
            <Download className="w-4 h-4" /> {t.downloadBtn}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white font-medium px-5 py-2.5 rounded-lg shadow transition duration-200"
          >
            <Printer className="w-4 h-4" /> {t.printBtn}
          </button>
        </div>
      </div>

      {/* ZONE D'AFFICHAGE DU DOCUMENT (Aperçu et Export PDF) */}
      <div className="max-w-4xl mx-auto">
        <div
          ref={documentRef}
          className="bg-white p-10 rounded-none shadow-xl border border-slate-200 text-slate-900 mx-auto"
          style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
        >
          {/* ENTÊTE DU DOCUMENT */}
          <div className="flex justify-between items-start border-b-2 border-blue-900 pb-6 mb-6">
            <div>
              {/* Logo de Terratransport hébergé dans /public/logo.png */}
              <img
                src="/logo.png"
                alt="Terratransport Logo"
                className="h-16 object-contain mb-2"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/200x60?text=Terratransport+Logo'; }}
              />
              <p className="text-xs text-slate-500 font-semibold">{t.website} https://terratransport-sa.com</p>
            </div>
            <div className="text-right">
              <h1 className="text-xl font-extrabold text-blue-950 uppercase tracking-wide">TERRATRANSPORT SA</h1>
              <p className="text-xs text-slate-600 mt-1">{t.docRef} <span className="font-mono font-bold">{docNumber}</span></p>
              <p className="text-xs text-slate-600">{t.date} <span className="font-medium">{docDate}</span></p>
            </div>
          </div>

          {/* BANNIÈRE DE TITRE */}
          <div className="bg-blue-900 text-white p-4 rounded-lg mb-6 shadow-sm">
            <h2 className="text-center text-lg font-bold tracking-wide uppercase">{t.title}</h2>
          </div>

          {/* INFOS PARTENARIAT ET CLIENT */}
          <div className="grid grid-cols-2 gap-6 mb-6 text-sm bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">{t.issuer}</p>
              <p className="font-bold text-blue-900">Terratransport SA</p>
              <p className="text-slate-600">{t.partner} <strong className="text-slate-800">IVECO</strong></p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">{t.client}</p>
              <p className="font-bold text-slate-800">{clientName}</p>
            </div>
          </div>

          {/* RÉSUMÉ / OBJECTIF */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 mb-2 border-l-4 border-blue-600 pl-2 uppercase">{t.summaryTitle}</h3>
            <p className="text-xs text-slate-700 leading-relaxed text-justify bg-white p-1">
              {t.summaryText}
            </p>
          </div>

          {/* TABLEAU DES TRANCHES */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 mb-3 border-l-4 border-blue-600 pl-2 uppercase">{t.scheduleTitle}</h3>
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white font-semibold">
                  <th className="p-2.5 border border-slate-300">{t.thTranche}</th>
                  <th className="p-2.5 border border-slate-300 text-center">{t.thQty}</th>
                  <th className="p-2.5 border border-slate-300">{t.thDelay}</th>
                  <th className="p-2.5 border border-slate-300 text-right">{t.thUnitPrice}</th>
                  <th className="p-2.5 border border-slate-300 text-right">{t.thTotalPrice}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tranches.map((item, idx) => {
                  const trancheTotal = item.qty * unitPriceBase;
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-2.5 border border-slate-300 font-bold text-blue-950">{item.name}</td>
                      <td className="p-2.5 border border-slate-300 text-center font-bold">{item.qty} camions</td>
                      <td className="p-2.5 border border-slate-300 text-slate-700">{item.delay}</td>
                      <td className="p-2.5 border border-slate-300 text-right">{curr.format(unitPriceBase)}</td>
                      <td className="p-2.5 border border-slate-300 text-right font-semibold">{curr.format(trancheTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold text-slate-900">
                  <td className="p-2.5 border border-slate-300">{t.totalVehicles}</td>
                  <td className="p-2.5 border border-slate-300 text-center text-blue-900 text-sm">{totalTrucks} camions</td>
                  <td className="p-2.5 border border-slate-300" colSpan="2">{t.totalAmount}</td>
                  <td className="p-2.5 border border-slate-300 text-right text-blue-900 text-sm">{curr.format(totalCostBase)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* VISUEL DU CAMION & SPÉCIFICATIONS */}
          <div className="grid grid-cols-2 gap-6 mb-8 items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2 uppercase">{t.specsTitle}</h4>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                  <span>{t.spec1}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                  <span>{t.spec2}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                  <span>{t.spec3}</span>
                </li>
              </ul>
            </div>
            <div className="text-center">
              {/* Image du camion hébergée dans /public/truck.png */}
              <img
                src="/truck.png"
                alt="Camion IVECO Terratransport"
                className="max-h-32 mx-auto object-contain rounded border border-slate-300 shadow-sm"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x150?text=Camion+IVECO'; }}
              />
            </div>
          </div>

          {/* SIGNATURES & CACHET OFFICIEL */}
          <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center">
            <div>
              <p className="text-xs font-bold text-slate-700 uppercase mb-8">{t.signIveco}</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-xs text-slate-400 italic">[ Signature & Accord Partenaire ]</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700 uppercase mb-2">{t.signTerratransport}</p>
              <p className="text-[10px] text-slate-500 italic mb-2">{t.stampNotice}</p>
              {/* Cachet Terratransport hébergé dans /public/stamp.png */}
              <div className="relative flex justify-center items-center">
                <img
                  src="/stamp.png"
                  alt="Cachet Terratransport"
                  className="h-24 object-contain"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/120x120?text=Cachet+Officiel'; }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
