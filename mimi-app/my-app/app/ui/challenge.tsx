import { WifiOff, Globe, AlertTriangle, type LucideIcon } from 'lucide-react'

const challenges: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: WifiOff,
    title: 'The Connectivity Gap',
    description:
      'Your internet goes down at 11pm and suddenly your whole system is frozen. Staff are stranded, guests are waiting, and there is nothing you can do. Sound familiar?',
  },
  {
    icon: Globe,
    title: 'Inventory Fragmentation',
    description:
      'You update a room on Booking.com but forget Expedia. Now you have a double-booking and an angry guest at the front desk. We have seen this story too many times.',
  },
  {
    icon: AlertTriangle,
    title: 'Operational Friction',
    description:
      'Three spreadsheets open, a notepad on the side, and a prayer that the numbers match at the end of the day. This is how revenue quietly disappears.',
  },
]

export default function Challenge() {
  return (
    <section id="challenge" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <h2 className="text-4xl font-bold text-slate-900 mb-2">Sound Familiar?</h2>
          <p className="text-red-600 font-semibold text-lg">
            The real costs of running a hotel the old way
          </p>
          <p className="text-slate-500 mt-4 max-w-2xl leading-relaxed">
            Most hotel owners we talk to share the same three frustrations. If any of these hit
            close to home, you are in the right place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {challenges.map((c, i) => {
            const Icon = c.icon
            return (
              <div key={c.title} className="bg-red-50 border-l-4 border-red-500 rounded-r-2xl p-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {i + 1}. {c.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{c.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
