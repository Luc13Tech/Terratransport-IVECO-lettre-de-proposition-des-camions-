import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Building2,
  Calendar,
  Download,
  FileText,
  Printer,
  Trash2,
  Truck,
  Languages,
} from 'lucide-react';

const initialTranches = [
  {
    name: '1ª Tranche',
    qty: 20,
    delay: 'Consegna immediata (disponibilità iniziale)',
  },
  {
    name: '2ª Tranche',
    qty: 20,
    delay: '3 mesi dopo la tranche precedente',
  },
  {
    name: '3ª Tranche',
    qty: 30,
    delay: '3 mesi dopo la tranche precedente',
  },
  {
    name: '4ª Tranche',
    qty: 30,
    delay: '3 mesi dopo la tranche precedente',
  },
];

const initialSpecs = [
  'Camion ispezionati e certificati conformi agli standard internazionali IVECO prima di ogni partenza.',
  'Monitoraggio logistico, trasporto e gestione delle formalità di ricezione fino alla consegna.',
  'Assistenza tecnica e garanzia secondo le condizioni concordate con il produttore.',
];

const translations = {
  it: {
    language: 'Lingua',
    generator: 'Generatore di documenti',
    reference: 'Numero di riferimento',
    date: 'Data del documento',
    manufacturer: 'Produttore / Partner',
    recipient: 'Destinatario / Cliente',
    subjectInput: 'Testo di presentazione / Oggetto',
    deliveries: 'Tranche di consegna',
    addTranche: '+ Aggiungi una tranche',
    commitments: 'Impegni e garanzie',
    download: 'Scarica PDF',
    print: 'Stampa',
    reset: 'Reimposta',
    commitmentLetter: 'LETTERA D’IMPEGNO E PIANO DI CONSEGNA DEI CAMION',
    supplier: 'Fornitore / Produttore:',
    beneficiary: 'Destinatario / Beneficiario:',
    subject: 'Oggetto della lettera di consegna',
    schedule: 'Calendario previsionale delle consegne',
    tranche: 'Tranche',
    quantity: 'Quantità',
    timing: 'Tempistica',
    total: 'Volume totale della flotta da consegnare:',
    trucks: 'camion',
    quality: 'Impegni di qualità e assistenza IVECO',
    iveco: 'Per il produttore IVECO',
    recipientSignature: 'Per il destinatario / beneficiario',
    remove: 'Rimuovi tranche',
    immediate: 'Consegna immediata (disponibilità iniziale)',
    afterPrevious: '3 mesi dopo la tranche precedente',
    according: 'Secondo il calendario concordato',
    pdfError:
      'Si è verificato un errore durante la generazione del PDF. Verificare che le immagini siano disponibili.',
  },

  fr: {
    language: 'Langue',
    generator: 'Générateur de documents',
    reference: 'Numéro de référence',
    date: 'Date du document',
    manufacturer: 'Producteur / Partenaire',
    recipient: 'Destinataire / Client',
    subjectInput: 'Texte de présentation / Objet',
    deliveries: 'Tranches de livraison',
    addTranche: '+ Ajouter une tranche',
    commitments: 'Engagements et garanties',
    download: 'Télécharger le PDF',
    print: 'Imprimer',
    reset: 'Réinitialiser',
    commitmentLetter:
      'LETTRE D’ENGAGEMENT ET PLAN DE LIVRAISON DES CAMIONS',
    supplier: 'Fournisseur / Producteur :',
    beneficiary: 'Destinataire / Bénéficiaire :',
    subject: 'Objet de la lettre de livraison',
    schedule: 'Calendrier prévisionnel des livraisons',
    tranche: 'Tranche',
    quantity: 'Quantité',
    timing: 'Délai',
    total: 'Volume total de la flotte à livrer :',
    trucks: 'camions',
    quality: 'Engagements de qualité et assistance IVECO',
    iveco: 'Pour le producteur IVECO',
    recipientSignature: 'Pour le destinataire / bénéficiaire',
    remove: 'Supprimer la tranche',
    immediate: 'Livraison immédiate (disponibilité initiale)',
    afterPrevious: '3 mois après la tranche précédente',
    according: 'Selon le calendrier convenu',
    pdfError:
      'Une erreur est survenue lors de la génération du PDF. Vérifiez que les images sont disponibles.',
  },

  en: {
    language: 'Language',
    generator: 'Document generator',
    reference: 'Reference number',
    date: 'Document date',
    manufacturer: 'Manufacturer / Partner',
    recipient: 'Recipient / Client',
    subjectInput: 'Presentation text / Subject',
    deliveries: 'Delivery batches',
    addTranche: '+ Add a batch',
    commitments: 'Commitments and guarantees',
    download: 'Download PDF',
    print: 'Print',
    reset: 'Reset',
    commitmentLetter:
      'COMMITMENT LETTER AND TRUCK DELIVERY PLAN',
    supplier: 'Supplier / Manufacturer:',
    beneficiary: 'Recipient / Beneficiary:',
    subject: 'Subject of the delivery letter',
    schedule: 'Estimated delivery schedule',
    tranche: 'Batch',
    quantity: 'Quantity',
    timing: 'Schedule',
    total: 'Total fleet volume to be delivered:',
    trucks: 'trucks',
    quality: 'IVECO quality commitments and assistance',
    iveco: 'For the IVECO manufacturer',
    recipientSignature: 'For the recipient / beneficiary',
    remove: 'Remove batch',
    immediate: 'Immediate delivery (initial availability)',
    afterPrevious: '3 months after the previous batch',
    according: 'According to the agreed schedule',
    pdfError:
      'An error occurred while generating the PDF. Please verify that the images are available.',
  },
};

const defaultSummary = {
  it: 'Nell’ambito della partnership strategica tra Terratransport SA e il produttore IVECO, la presente lettera definisce le modalità logistiche e il calendario di consegna dei camion.',
  fr: 'Dans le cadre du partenariat stratégique entre Terratransport SA et le constructeur IVECO, la présente lettre définit les modalités logistiques et le calendrier de livraison des camions.',
  en: 'Within the framework of the strategic partnership between Terratransport SA and the IVECO manufacturer, this letter defines the logistics arrangements and truck delivery schedule.',
};

export default function App() {
  const [language, setLanguage] = useState('it');

  const [docNumber, setDocNumber] = useState('ENG-2026-IVECO-100');
  const [docDate, setDocDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [clientName, setClientName] = useState(
    'Ministero dei Trasporti / Partner Destinatario'
  );

  const [partnerName, setPartnerName] = useState('IVECO');

  const [summaryText, setSummaryText] = useState(
    defaultSummary.it
  );

  const [tranches, setTranches] = useState(initialTranches);
  const [specs, setSpecs] = useState(initialSpecs);

  const documentRef = useRef(null);

  const t = translations[language];

  const totalTrucks = tranches.reduce(
    (sum, item) => sum + (Number(item.qty) || 0),
    0
  );

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    setSummaryText(defaultSummary[newLanguage]);
  };

  const updateTranche = (index, field, value) => {
    setTranches((items) =>
      items.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === 'qty'
                  ? Math.max(0, parseInt(value, 10) || 0)
                  : value,
            }
          : item
      )
    );
  };

  const addTranche = () => {
    setTranches((items) => [
      ...items,
      {
        name: `${items.length + 1}ª Tranche`,
        qty: 10,
        delay: t.according,
      },
    ]);
  };

  const removeTranche = (index) => {
    setTranches((items) =>
      items.length > 1
        ? items.filter((_, i) => i !== index)
        : items
    );
  };

  const reset = () => {
    setDocNumber('ENG-2026-IVECO-100');

    setDocDate(
      new Date().toISOString().split('T')[0]
    );

    setClientName(
      'Ministero dei Trasporti / Partner Destinatario'
    );

    setPartnerName('IVECO');

    setSummaryText(defaultSummary[language]);

    setTranches(initialTranches);

    setSpecs(initialSpecs);
  };

  const waitForImages = async (container) => {
    const images = Array.from(
      container.querySelectorAll('img')
    );

    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete && img.naturalWidth > 0) {
              resolve();
              return;
            }

            const finish = () => resolve();

            img.addEventListener('load', finish, {
              once: true,
            });

            img.addEventListener('error', finish, {
              once: true,
            });
          })
      )
    );
  };

  const downloadPdf = async () => {
    try {
      if (!documentRef.current) return;

      await waitForImages(documentRef.current);

      const canvas = await html2canvas(
        documentRef.current,
        {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          imageTimeout: 15000,
        }
      );

      const pdf = new jsPDF(
        'p',
        'mm',
        'a4'
      );

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const imageWidth = pageWidth;

      const imageHeight =
        (canvas.height * imageWidth) /
        canvas.width;

      const imageData =
        canvas.toDataURL(
          'image/png',
          1.0
        );

      if (imageHeight <= pageHeight) {
        pdf.addImage(
          imageData,
          'PNG',
          0,
          0,
          imageWidth,
          imageHeight
        );
      } else {
        let remainingHeight = imageHeight;
        let position = 0;

        pdf.addImage(
          imageData,
          'PNG',
          0,
          position,
          imageWidth,
          imageHeight
        );

        remainingHeight -= pageHeight;

        while (remainingHeight > 0) {
          position -= pageHeight;

          pdf.addPage();

          pdf.addImage(
            imageData,
            'PNG',
            0,
            position,
            imageWidth,
            imageHeight
          );

          remainingHeight -= pageHeight;
        }
      }

      pdf.save(
        `${docNumber || 'documento-iveco'}.pdf`
      );
    } catch (error) {
      console.error(
        'Errore generazione PDF:',
        error
      );

      window.alert(t.pdfError);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">

      {/* PANNEAU DE CONFIGURATION */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8 no-print border border-slate-200">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="text-blue-700" />
            {t.generator}
          </h2>

          <div className="flex items-center gap-2">

            <Languages
              size={18}
              className="text-blue-700"
            />

            <label
              htmlFor="language"
              className="text-xs font-semibold text-slate-600"
            >
              {t.language}
            </label>

            <select
              id="language"
              value={language}
              onChange={(e) =>
                changeLanguage(e.target.value)
              }
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="it">
                Italiano
              </option>

              <option value="fr">
                Français
              </option>

              <option value="en">
                English
              </option>
            </select>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          <Field
            icon={<FileText />}
            label={t.reference}
            value={docNumber}
            onChange={setDocNumber}
          />

          <Field
            icon={<Calendar />}
            label={t.date}
            type="date"
            value={docDate}
            onChange={setDocDate}
          />

          <Field
            label={t.manufacturer}
            value={partnerName}
            onChange={setPartnerName}
          />

          <Field
            label={t.recipient}
            value={clientName}
            onChange={setClientName}
          />

        </div>

        <label className="block text-xs font-semibold text-slate-600 mb-1">
          {t.subjectInput}
        </label>

        <textarea
          rows={3}
          value={summaryText}
          onChange={(e) =>
            setSummaryText(e.target.value)
          }
          className="w-full border rounded-lg p-2 mb-4"
        />

        <label className="block text-xs font-bold text-slate-700 mb-2">
          {t.deliveries}
        </label>

        {tranches.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-stretch md:items-center gap-2 mb-2"
          >

            <input
              value={item.name}
              onChange={(e) =>
                updateTranche(
                  index,
                  'name',
                  e.target.value
                )
              }
              className="border rounded p-2 flex-1"
            />

            <input
              type="number"
              min="0"
              value={item.qty}
              onChange={(e) =>
                updateTranche(
                  index,
                  'qty',
                  e.target.value
                )
              }
              className="border rounded p-2 w-full md:w-20"
            />

            <input
              value={item.delay}
              onChange={(e) =>
                updateTranche(
                  index,
                  'delay',
                  e.target.value
                )
              }
              className="border rounded p-2 flex-[2]"
            />

            <button
              onClick={() =>
                removeTranche(index)
              }
              title={t.remove}
              className="text-red-600 flex items-center justify-center p-2"
            >
              <Trash2 size={16} />
            </button>

          </div>
        ))}

        <button
          onClick={addTranche}
          className="text-blue-700 text-sm font-semibold mb-4"
        >
          {t.addTranche}
        </button>

        <label className="block text-xs font-bold text-slate-700 mb-2">
          {t.commitments}
        </label>

        {specs.map((spec, index) => (
          <input
            key={index}
            value={spec}
            onChange={(e) =>
              setSpecs((items) =>
                items.map((value, i) =>
                  i === index
                    ? e.target.value
                    : value
                )
              )
            }
            className="w-full border rounded p-2 mb-2"
          />
        ))}

        <div className="flex flex-wrap gap-3 pt-2 border-t">

          <button
            onClick={downloadPdf}
            className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Download size={16} />
            {t.download}
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg"
          >
            <Printer size={16} />
            {t.print}
          </button>

          <button
            onClick={reset}
            className="border px-4 py-2 rounded-lg"
          >
            {t.reset}
          </button>

        </div>

      </div>

      {/* DOCUMENT A4 */}
      <div className="max-w-4xl mx-auto overflow-auto">

        <div
          ref={documentRef}
          className="bg-white shadow-xl border text-slate-900 mx-auto print-container"
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '18mm',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >

          {/* EN-TÊTE */}
          <div className="flex justify-between items-start border-b-2 border-blue-900 pb-5 mb-5">

            <div className="w-1/2">

              <img
                src="/logo.png"
                alt="Logo Terratransport SA"
                className="document-logo"
                crossOrigin="anonymous"
              />

              <p className="text-xs mt-2 font-semibold">
                Terratransport SA
              </p>

            </div>

            <div className="text-right text-xs">

              <p>
                <b>{t.reference}</b>{' '}
                {docNumber}
              </p>

              <p>
                <b>{t.date}</b>{' '}
                {docDate}
              </p>

            </div>

          </div>

          {/* TITRE */}
          <h1 className="bg-blue-900 text-white p-4 rounded-lg mb-5 text-center text-base font-bold">
            {t.commitmentLetter}
          </h1>

          {/* IMAGE DU CAMION */}
          <div className="truck-image-container">

            <img
              src="/truck.png"
              alt="Camion IVECO"
              className="truck-image"
              crossOrigin="anonymous"
            />

          </div>

          {/* PARTIES */}
          <div className="grid grid-cols-2 gap-6 mb-6 text-sm bg-slate-50 p-4 rounded-lg border">

            <p>
              <b>{t.supplier}</b>
              <br />
              {partnerName}
            </p>

            <p>
              <b>{t.beneficiary}</b>
              <br />
              {clientName}
            </p>

          </div>

          {/* OBJET */}
          <section className="mb-6">

            <h3 className="text-xs font-bold mb-2 border-l-4 border-blue-700 pl-2 uppercase">
              {t.subject}
            </h3>

            <p className="text-xs text-slate-700 leading-relaxed">
              {summaryText}
            </p>

          </section>

          {/* CALENDRIER */}
          <section className="mb-6">

            <h3 className="text-xs font-bold mb-3 border-l-4 border-blue-700 pl-2 uppercase flex items-center gap-2">

              <Truck size={16} />

              {t.schedule}

            </h3>

            <table className="w-full text-xs border-collapse">

              <thead>

                <tr className="bg-blue-100">

                  <th className="border p-2 text-left">
                    {t.tranche}
                  </th>

                  <th className="border p-2">
                    {t.quantity}
                  </th>

                  <th className="border p-2 text-left">
                    {t.timing}
                  </th>

                </tr>

              </thead>

              <tbody>

                {tranches.map(
                  (item, index) => (
                    <tr key={index}>

                      <td className="border p-2">
                        {item.name}
                      </td>

                      <td className="border p-2 text-center">
                        {item.qty}
                      </td>

                      <td className="border p-2">
                        {item.delay}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </section>

          {/* TOTAL */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm font-bold flex items-center gap-2">

            <Truck className="text-blue-700" />

            {t.total} {totalTrucks}{' '}
            {t.trucks}

          </div>

          {/* ENGAGEMENTS */}
          <section className="mb-8">

            <h3 className="text-xs font-bold mb-3 border-l-4 border-blue-700 pl-2 uppercase">
              {t.quality}
            </h3>

            <ul className="text-xs text-slate-700 leading-relaxed list-disc pl-5">

              {specs.map(
                (spec, index) => (
                  <li key={index}>
                    {spec}
                  </li>
                )
              )}

            </ul>

          </section>

          {/* SIGNATURES + CACHET */}
          <div className="signature-area">

            <div className="signature-box">

              <p className="font-bold uppercase mb-3">
                {t.iveco}
              </p>

              <div className="signature-line" />

            </div>

            <div className="signature-box recipient-box">

              <p className="font-bold uppercase mb-1">
                {t.recipientSignature}
              </p>

              {/* CACHEt / SIGNATURE VISUELLE */}
              <div className="stamp-wrapper">

                <img
                  src="/stamp.png"
                  alt="Cachet et signature"
                  className="stamp-image"
                  crossOrigin="anonymous"
                />

              </div>

              <div className="signature-line" />

            </div>

          </div>

          <div className="document-footer">
            Terratransport SA — Document officiel
          </div>

        </div>

      </div>

    </div>
  );
}

function Field({
  icon,
  label,
  type = 'text',
  value,
  onChange,
}) {
  return (
    <div>

      <label className="block text-xs font-semibold text-slate-600 mb-1">

        {icon &&
          React.cloneElement(icon, {
            className: 'inline mr-1',
            size: 14,
          })}

        {label}

      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full border rounded-lg p-2"
      />

    </div>
  );
                   }
