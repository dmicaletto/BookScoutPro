import { UploadIcon, DownloadIcon, FileTextIcon, AlertCircleIcon } from 'lucide-react'

const FEATURES = [
  {
    icon: DownloadIcon,
    label: 'Esporta inventario (CSV)',
    description: 'Scarica l\'intero inventario in formato CSV compatibile con Excel e Google Sheets. Include titolo, ISBN, posizione scaffale, condizione, prezzi e data inserimento.',
    action: 'Esporta CSV',
    variant: 'primary',
  },
  {
    icon: UploadIcon,
    label: 'Importa inventario (CSV)',
    description: 'Carica un file CSV per aggiungere o aggiornare più libri contemporaneamente. Il file deve seguire il template scaricabile. I duplicati vengono rilevati tramite ISBN.',
    action: 'Seleziona file…',
    variant: 'secondary',
  },
  {
    icon: DownloadIcon,
    label: 'Esporta vendite (CSV)',
    description: 'Esporta lo storico delle vendite con canale, prezzo, spedizione, margine e data. Utile per la contabilità e l\'analisi delle performance.',
    action: 'Esporta vendite',
    variant: 'primary',
  },
  {
    icon: FileTextIcon,
    label: 'Scarica template CSV',
    description: 'Scarica il file modello da compilare per l\'importazione massiva. Le colonne obbligatorie sono: isbn, title, author, shelf, position, condition, purchasePrice.',
    action: 'Scarica template',
    variant: 'outline',
  },
] as const

const ImportExportPage = () => (
  <div className="flex flex-col gap-4 p-4 fade-in max-w-3xl mx-auto w-full pb-8">
    {/* Header */}
    <div>
      <h2 className="text-2xl font-bold text-white drop-shadow-md">Importa / Esporta</h2>
      <p className="text-sm text-gray-300 mt-0.5">Gestione massiva dell'inventario tramite file CSV</p>
    </div>

    {/* Avviso funzione in sviluppo */}
    <div className="glass-panel rounded-2xl p-4 flex gap-3 border-l-4 border-l-amber-400">
      <AlertCircleIcon size={20} className="text-amber-500 shrink-0 mt-0.5" />
      <p className="text-sm text-gray-700">
        Funzione in sviluppo — i pulsanti qui sotto saranno attivi nella prossima release.
      </p>
    </div>

    {/* Feature cards */}
    <div className="flex flex-col gap-3">
      {FEATURES.map(({ icon: Icon, label, description, action, variant }) => (
        <div key={label} className="glass-panel rounded-2xl p-5 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <Icon size={18} className="text-emerald-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-base">{label}</h4>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{description}</p>
            <button
              disabled
              className={`mt-3 px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${
                variant === 'primary'
                  ? 'bg-emerald-600 text-white'
                  : variant === 'secondary'
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 bg-white'
              }`}
            >
              {action}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default ImportExportPage
