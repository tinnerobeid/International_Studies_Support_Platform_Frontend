import { Phone, Mail, AtSign } from 'lucide-react'

const quickLinks = ['About Us', 'Features', 'Why Mimi', 'Onboarding', 'Get a Demo']

function Logo() {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
          <span className="text-[#2020B4] font-black text-xl leading-none">m.</span>
        </div>
        <div className="text-xl text-white">
          <span className="font-extrabold">mimi</span>
          <span className="font-light"> App</span>
        </div>
      </div>
      <p className="text-blue-300 text-xs">By INSYNC TECHNOLOGIES COMPANY LTD</p>
      <p className="text-blue-300 text-sm mt-3 max-w-xs leading-relaxed">
        Built for hoteliers who are tired of juggling too many systems and not getting enough sleep.
      </p>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#0D0D7A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
          <Logo />

          <div className="grid sm:grid-cols-2 gap-10">
            <div>
              <p className="text-white font-semibold mb-4">Quick Links</p>
              <ul className="space-y-2 text-sm">
                {quickLinks.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-blue-300 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-white font-semibold mb-4">Talk to Us</p>
              <div className="space-y-3 text-sm">
                <a
                  href="tel:+255742434540"
                  className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" /> +255 742 434 540
                </a>
                <a
                  href="mailto:Contact@mimiapp.co.tz"
                  className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" /> Contact@mimiapp.co.tz
                </a>
                <div className="flex items-center gap-2 text-blue-300">
                  <AtSign className="w-4 h-4" /> @Mimiapp
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-blue-400 text-sm">
            © 2026 Mimi App by Insync Technologies Company Ltd. All rights reserved.
          </p>
          <p className="text-blue-400 text-sm">www.mimiapp.co.tz</p>
        </div>
      </div>
    </footer>
  )
}
