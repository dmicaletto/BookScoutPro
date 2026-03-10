import ScannerView from '../features/scanner/ScannerView'

const ScannerPage = () => {
  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Header */}
      <h2 className="text-2xl font-bold text-white drop-shadow-md px-6 pt-6 mb-2">
        Aggiungi Libro
      </h2>
      <p className="text-xs text-gray-300 px-6 mb-4 font-medium">
        Scansiona il barcode o cerca per titolo
      </p>
      
      {/* View Contenuto */}
      <div className="flex-1 bg-white/50 backdrop-blur-md rounded-t-[3rem] p-2 mt-4 shadow-2xl border-t border-white/20">
        <ScannerView />
      </div>
    </div>
  )
}

export default ScannerPage
