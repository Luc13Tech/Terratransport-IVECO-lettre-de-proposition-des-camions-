import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Printer, Globe, Building2, Calendar, FileText, CheckCircle2, Truck, ShieldCheck, Clock } from 'lucide-react';

const TRANSLATIONS = {
  fr: {
    title: "LETTRE D'ENGAGEMENT ET PLANNING DE LIVRAISON DE 100 CAMIONS",
    docRef: "Réf. Engagement :",
    date: "Date d'émission :",
    partner: "Fournisseur / Constructeur :",
    client: "Destinataire / Bénéficiaire :",
    issuer: "Transporteur & Gestionnaire :",
    website: "Site Web Officiel :",
    summaryTitle: "Objet de la Lettre de Livraison",
    summaryText: "Dans le cadre du partenariat stratégique entre Terratransport SA et le constructeur IVECO, la présente lettre établit les modalités logistiques et le calendrier officiel d'approvisionnement et de livraison progressive d'un parc complet de cent (100) camions poids lourds.",
    scheduleTitle: "Planning Échelonné de Livraison des Camions",
    thTranche: "Phase / Tranche",
    thQty: "Nombre de Camions",
    thDelay: "Calendrier d'Échéance / Délais",
    thStatus: "Statut Approvisionnement",
    tranche1: "1ère Tranche",
    tranche2: "2ème Tranche",
    tranche3: "3ème Tranche",
    tranche4: "4ème Tranche",
    delay1: "Livraison Immédiate (Mise à disposition initiale)",
    delay2: "3 mois après la 1ère tranche",
    delay3: "3 mois après la 2ème tranche",
    delay4: "3 mois après la 3ème tranche",
    statusScheduled: "Planifié & Garanti IVECO",
    totalVehicles: "Volume Total du Parc à Livrer :",
    specsTitle: "Engagements Qualité & Service Constructeur IVECO",
    spec1: "Inspectés et certifiés conformes aux normes internationales IVECO avant chaque départ.",
    spec2: "Suivi logistique, convoyage et prise en charge des formalités de réception par Terratransport.",
    spec3: "Garantie constructeur active et support technique prioritaire dès la remise des clés.",
    signTerratransport: "Pour Terratransport SA",
    signIveco: "Pour le Constructeur IVECO",
    stampNotice: "Cachet Officiel & Validation de Direction",
    downloadBtn: "Télécharger PDF",
    printBtn: "Imprimer"
  },
  en: {
    title: "COMMITMENT LETTER & 100 TRUCKS DELIVERY SCHEDULE",
    docRef: "Commitment Ref:",
    date: "Issue Date:",
    partner: "Manufacturer / Supplier:",
    client: "Recipient / Beneficiary:",
    issuer: "Carrier & Manager:",
    website: "Official Website:",
    summaryTitle: "Objective of Delivery Proposal",
    summaryText: "Under the strategic partnership between Terratransport SA and IVECO, this document sets out the logistical terms and official schedule for the progressive supply and delivery of a total fleet of one hundred (100) heavy-duty trucks.",
    scheduleTitle: "Phased Truck Delivery Schedule",
    thTranche: "Phase / Tranche",
    thQty: "Number of Trucks",
    thDelay: "Timeline / Schedule",
    thStatus: "Supply Status",
    tranche1: "1st Tranche",
    tranche2: "2nd Tranche",
    tranche3: "3rd Tranche",
    tranche4: "4th Tranche",
    delay1: "Immediate Delivery (Initial rollout)",
    delay2: "3 months after 1st tranche",
    delay3: "3 months after 2nd tranche",
    delay4: "3 months after 3rd tranche",
    statusScheduled: "Scheduled & Guaranteed IVECO",
    totalVehicles: "Total Fleet Volume to Deliver:",
    specsTitle: "IVECO Quality & Manufacturer Commitments",
    spec1: "Inspected and certified compliant with IVECO international standards prior to dispatch.",
    spec2: "Full logistics tracking, transport, and reception management by Terratransport.",
    spec3: "Active manufacturer warranty and priority technical support upon delivery.",
    signTerratransport: "For Terratransport SA",
    signIveco: "For IVECO Manufacturer",
    stampNotice: "Official Stamp & Executive Approval",
    downloadBtn: "Download PDF",
    printBtn: "Print"
  },
  it: {
    title: "LETTERA DI IMPEGNO E PIANO DI CONSEGNA DI 100 CAMION",
    docRef: "Rif. Impegno:",
    date: "Data di emissione:",
    partner: "Fornitore / Produttore:",
    client: "Destinatario / Beneficiario:",
    issuer: "Vettore & Gestore:",
    website: "Sito Web Ufficiale:",
    summaryTitle: "Oggetto della Lettera di Consegna",
    summaryText: "Nell'ambito della partnership strategica tra Terratransport SA e il produttore IVECO, la presente lettera stabilisce le modalità logistiche e il calendario ufficiale per la fornitura e la consegna progressiva di una flotta di cento (100) camion industriali.",
    scheduleTitle: "Programma di Pianificazione delle Consegne",
    thTranche: "Fase / Tranche",
    thQty: "Numero di Camion",
    thDelay: "Tempistica / Scadenza",
    thStatus: "Stato Approvvigionamento",
    tranche1: "1a Tranche",
    tranche2: "2a Tranche",
    tranche3: "3a Tranche",
    tranche4: "4a Tranche",
    delay1: "Consegna Immediata (Disponibilità iniziale)",
    delay2: "3 mesi dopo la 1a tranche",
    delay3: "3 mesi dopo la 2a tranche",
    delay4: "3 mesi dopo la 3a tranche",
    statusScheduled: "Pianificato & Garantito IVECO",
    totalVehicles: "Volume Totale Flotta da Consegnare:",
    specsTitle: "Impegni Qualità & Assistenza IVECO",
    spec1: "Ispezionati e certificati secondo gli standard internazionali IVECO prima di ogni spedizione.",
    spec2: "Monitoraggio logistico, trasporto e formalità di ricezione gestite da Terratransport.",
    spec3: "Garanzia ufficiale del produttore e supporto tecnico prioritario alla consegna.",
    signTerratransport: "Per Terratransport SA",
    signIveco: "Per il Produttore IVECO",
    stampNotice: "Timbro Ufficiale e Approvazione Dirigenziale",
    downloadBtn: "Scarica PDF",
    printBtn: "Stampa"
  },
  es: {
    title: "CARTA DE COMPROMISO Y PLAN DE ENTREGA DE 100 CAMIONES",
    docRef: "Ref. Compromiso:",
    date: "Fecha de emisión:",
    partner: "Proveedor / Fabricante:",
    client: "Destinatario / Beneficiario:",
    issuer: "Transportista y Gestor:",
    website: "Sitio Web Oficial:",
    summaryTitle: "Objeto de la Carta de Entrega",
    summaryText: "En el marco de la alianza estratégica entre Terratransport SA y el fabricante IVECO, la presente carta establece las condiciones logísticas y el cronograma oficial de suministro y entrega progresiva de cien (100) camiones pesados.",
    scheduleTitle: "Calendario Escalonado de Entrega de Camiones",
    thTranche: "Fase / Entrega",
    thQty: "Número de Camiones",
    thDelay: "Cronograma / Plazos",
    thStatus: "Estado del Suministro",
    tranche1: "1ª Entrega",
    tranche2: "2ª Entrega",
    tranche3: "3ª Entrega",
    tranche4: "4ª Entrega",
    delay1: "Entrega Inmediata (Despliegue inicial)",
    delay2: "3 meses después de la 1ª entrega",
    delay3: "3 meses después de la 2ª entrega",
    delay4: "3 meses después de la 3ª entrega",
    statusScheduled: "Programado y Garantizado IVECO",
    totalVehicles: "Volumen Total de la Flota a Entregar:",
    specsTitle: "Compromisos de Calidad y Servicio IVECO",
    spec1: "Inspeccionados y certificados bajo normas internacionales IVECO antes del despacho.",
    spec2: "Seguimiento logístico, transporte y recepción gestionados por Terratransport.",
    spec3: "Garantía de fábrica activa y soporte técnico prioritario al momento de la entrega.",
    signTerratransport: "Por Terratransport SA",
    signIveco: "Por el Fabricante IVECO",
    stampNotice: "Sello Oficial y Firma Autorizada",
    downloadBtn: "Descargar PDF",
    printBtn: "Imprimir"
  }
};

export default function App() {
  const [lang, setLang] = useState('fr');
  const [clientName, setClientName] = useState('Ministère des Transports / Partenaire Destinataire');
  const [docNumber, setDocNumber] = useState('ENG-2026-IVECO-100');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const documentRef = useRef();

  const t = TRANSLATIONS[lang];

  const tranches = [
    { name: t.tranche1, qty: 20, delay: t.delay1 },
    { name: t.tranche2, qty: 20, delay: t.delay2 },
    { name: t.tranche3, qty: 30, delay: t.delay3 },
    { name: t.tranche4, qty: 30, delay: t.delay4 },
  ];

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
    pdf.save(`Terratransport_Engagement_Livraison_${docNumber}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      {/* PANNEAU DE CONFIGURATION (NO PRINT) */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8 no-print border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Building2 className="text-blue-700" /> Générateur de Document de Livraison
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Langue */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Langue du Document
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="it">Italiano</option>
              <option value="es">Español</option>
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
              <Calendar className="w-3.5 h-3.5" /> Date d'Émission
            </label>
            <input
              type="date"
              value={docDate}
              onChange={(e) => setDocDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Destinataire */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Destinataire / Bénéficiaire
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
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-medium px-5 py-2.5 rounded-lg shadow transition duration-200"
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

      {/* DOCUMENT OFFICIEL A4 */}
      <div className="max-w-4xl mx-auto">
        <div
          ref={documentRef}
          className="bg-white p-10 rounded-none shadow-xl border border-slate-200 text-slate-900 mx-auto"
          style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
        >
          {/* ENTÊTE */}
          <div className="flex justify-between items-start border-b-2 border-blue-900 pb-6 mb-6">
            <div>
              <img
                src="/logo.png"
                alt="Terratransport Logo"
                className="h-16 object-contain mb-2"
                style={{ maxWidth: '200px', maxHeight: '70px' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/200x60?text=Terratransport+Logo'; }}
              />
              <p className="text-xs text-slate-500 font-semibold">{t.website} https://terratransport-sa.com</p>
            </div>
            <div className="text-right">
              <h1 className="text-xl font-extrabold text-blue-950 uppercase tracking-wide">TERRATRANSPORT SA</h1>
              <p className="text-xs text-slate-600 mt-1">{t.docRef} <span className="font-mono font-bold text-slate-800">{docNumber}</span></p>
              <p className="text-xs text-slate-600">{t.date} <span className="font-medium">{docDate}</span></p>
            </div>
          </div>

          {/* BANNIÈRE DE TITRE */}
          <div className="bg-blue-900 text-white p-4 rounded-lg mb-6 shadow-sm border-l-8 border-blue-600">
            <h2 className="text-center text-base font-bold tracking-wide uppercase flex items-center justify-center gap-2">
              <Truck className="w-5 h-5" /> {t.title}
            </h2>
          </div>

          {/* PARTENAIRES */}
          <div className="grid grid-cols-2 gap-6 mb-6 text-sm bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.issuer}</p>
              <p className="font-bold text-blue-950">Terratransport SA</p>
              <p className="text-slate-600 mt-1">{t.partner} <strong className="text-slate-900">IVECO</strong></p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.client}</p>
              <p className="font-bold text-slate-900">{clientName}</p>
            </div>
          </div>

          {/* OBJET */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-800 mb-2 border-l-4 border-blue-700 pl-2 uppercase tracking-wide">
              {t.summaryTitle}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed text-justify bg-slate-50/50 p-3 rounded border border-slate-100">
              {t.summaryText}
            </p>
          </div>

          {/* TABLEAU DES TRANCHES SANS PRIX */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-800 mb-3 border-l-4 border-blue-700 pl-2 uppercase tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-700" /> {t.scheduleTitle}
            </h3>
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-blue-950 text-white font-semibold">
                  <th className="p-3 border border-slate-300">{t.thTranche}</th>
                  <th className="p-3 border border-slate-300 text-center">{t.thQty}</th>
                  <th className="p-3 border border-slate-300">{t.thDelay}</th>
                  <th className="p-3 border border-slate-300 text-center">{t.thStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tranches.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'}>
                    <td className="p-3 border border-slate-300 font-bold text-blue-900">{item.name}</td>
                    <td className="p-3 border border-slate-300 text-center font-extrabold text-slate-900 text-sm">
                      {item.qty} camions
                    </td>
                    <td className="p-3 border border-slate-300 text-slate-700 font-medium">{item.delay}</td>
                    <td className="p-3 border border-slate-300 text-center text-green-700 font-semibold bg-green-50/50">
                      ✓ {t.statusScheduled}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-blue-50 font-bold text-slate-900 border-t-2 border-blue-900">
                  <td className="p-3 border border-slate-300 text-blue-950">{t.totalVehicles}</td>
                  <td className="p-3 border border-slate-300 text-center text-blue-950 text-base font-extrabold" colSpan="3">
                    100 Camions IVECO
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* VISUEL & ENGAGEMENTS */}
          <div className="grid grid-cols-2 gap-6 mb-8 items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-700" /> {t.specsTitle}
              </h4>
              <ul className="text-xs text-slate-700 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>{t.spec1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>{t.spec2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>{t.spec3}</span>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <img
                src="/truck.png"
                alt="Camion IVECO Terratransport"
                className="max-h-32 mx-auto object-contain rounded border border-slate-200 shadow-sm"
                style={{ maxWidth: '280px', maxHeight: '130px' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x150?text=Camion+IVECO'; }}
              />
            </div>
          </div>

          {/* SIGNATURES */}
          <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center">
            <div>
              <p className="text-xs font-bold text-slate-700 uppercase mb-8">{t.signIveco}</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-xs text-slate-400 italic">[ Accord & Signature Constructeur ]</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700 uppercase mb-1">{t.signTerratransport}</p>
              <p className="text-[10px] text-slate-500 italic mb-2">{t.stampNotice}</p>
              <div className="relative flex justify-center items-center">
                <img
                  src="/stamp.png"
                  alt="Cachet Terratransport"
                  className="h-24 object-contain"
                  style={{ maxWidth: '120px', maxHeight: '120px' }}
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
