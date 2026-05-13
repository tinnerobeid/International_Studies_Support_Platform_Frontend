import { Zap, Smartphone, Shield, MapPin, type LucideIcon } from 'lucide-react'

const reasons: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Zap,
    title: 'Actually Fast',
    description:
      'Pages load quickly. Your team moves quickly. No spinning wheels, no waiting, no frustrated staff at the front desk.',
  },
  {
    icon: Smartphone,
    title: 'Works on Any Device',
    description:
      'Phone, tablet, laptop — Mimi adapts. The dark interface is easy on the eyes during long overnight shifts too.',
  },
  {
    icon: Shield,
    title: 'Your Data Is Safe',
    description:
      'Multiple backups, secure sync protocols. Your guest data stays yours — always protected, always accessible.',
  },
  {
    icon: MapPin,
    title: 'Built for This Region',
    description:
      'We are not a Silicon Valley startup guessing what African hotels need. We are here, we listen, and we build for you.',
  },
]

export default function WhyMimi() {
  return (
    <section id="why-mimi" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#2020B4]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-6xl font-bold text-white leading-tight mb-6">
            Why
            <br />
            Mimi App?
          </h2>
          <p className="text-blue-200 leading-relaxed text-lg">
            Because you deserve software that works the way your hotel works, and not the other way
            around. Mimi is built for hoteliers in this region, by people who understand the real
            challenges you face every day.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {reasons.map((r) => {
            const Icon = r.icon
            return (
              <div
                key={r.title}
                className="bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors"
              >
                <Icon className="w-8 h-8 text-white mb-4" />
                <h3 className="font-bold text-white mb-2">{r.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{r.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
