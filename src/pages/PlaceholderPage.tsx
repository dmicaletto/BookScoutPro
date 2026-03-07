import { ConstructionIcon } from 'lucide-react'

interface PlaceholderPageProps {
  title: string
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => (
  <div className="flex flex-col items-center justify-center min-h-full p-6 fade-in">
    <div className="glass-panel rounded-2xl p-8 text-center shadow-lg w-full max-w-sm">
      <ConstructionIcon className="mx-auto mb-4 text-emerald-500" size={48} />
      <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 text-sm">
        Sezione in arrivo con la prossima fase di migrazione.
      </p>
    </div>
  </div>
)

export default PlaceholderPage
