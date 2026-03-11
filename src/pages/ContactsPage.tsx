import { MapPin, Mail, Phone, Clock } from 'lucide-react'
import PublicNavbar from '../features/public/PublicNavbar'
import PublicFooter from '../features/public/PublicFooter'

const ContactsPage = () => (
  <div className="min-h-screen flex flex-col bg-transparent overflow-x-hidden">
    <PublicNavbar />
    <main className="flex-1 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">
          Contattaci
        </h1>
        <p className="text-gray-400 text-lg mb-12 max-w-2xl">
          Siamo a tua disposizione per qualsiasi informazione su libri, ordini e disponibilità.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border-l-4 border-emerald-500 hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-lg">Sede Centrale</h3>
                  <p className="text-gray-500 text-sm">Vieni a trovarci di persona</p>
                </div>
              </div>
              <p className="text-gray-700 ml-14">
                Via Filippo Corridoni, 14<br />
                00195 — Roma (RM)
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border-l-4 border-emerald-500 hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-lg">Email</h3>
                  <p className="text-gray-500 text-sm">Scrivici per info o supporto</p>
                </div>
              </div>
              <p className="text-gray-700 ml-14">
                <a href="mailto:info@libreriasottomarina.it" className="text-emerald-600 hover:underline">
                  info@libreriasottomarina.it
                </a>
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border-l-4 border-emerald-500 hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-lg">Orari di Apertura</h3>
                  <p className="text-gray-500 text-sm">Quando siamo aperti</p>
                </div>
              </div>
              <div className="text-gray-700 ml-14 text-sm space-y-1 mt-2">
                <p className="flex justify-between"><span>Lunedì - Venerdì:</span> <span>09:00 - 19:30</span></p>
                <p className="flex justify-between"><span>Sabato:</span> <span>09:30 - 13:00 / 15:30 - 19:30</span></p>
                <p className="flex justify-between text-gray-400"><span>Domenica:</span> <span>Chiuso</span></p>
              </div>
            </div>
          </div>

          {/* Contact Form Placeholder or Map Placeholder */}
          <div className="glass-panel p-8 rounded-3xl flex flex-col justify-center items-center text-center h-full min-h-[400px]">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex flex-col items-center justify-center text-emerald-600 mb-6">
              <Phone size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Hai bisogno di aiuto?</h3>
            <p className="text-gray-600 mb-8 max-w-sm">
              Non esitare a contattarci per qualsiasi dubbio relativo al nostro catalogo, ai tuoi ordini o alle nostre rassegne ed eventi.
            </p>
            <a 
              href="mailto:info@libreriasottomarina.it"
              className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
            >
              Inviaci un'email
            </a>
          </div>
        </div>

      </div>
    </main>
    <PublicFooter />
  </div>
)

export default ContactsPage
