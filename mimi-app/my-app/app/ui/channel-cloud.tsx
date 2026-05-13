import { Cloud, CloudOff, RefreshCw, CheckCircle, type LucideIcon } from 'lucide-react'

const channelPoints = [
  {
    title: 'Synchronized Distribution',
    description:
      'Update your availability once and it reflects everywhere — Booking.com, Expedia, Airbnb — instantly.',
  },
  {
    title: 'Revenue Growth',
    description:
      'Be where your guests are searching. Connect to international booking platforms and stop leaving money on the table.',
  },
  {
    title: 'Guest Account Management',
    description: 'Every folio, every charge — tracked automatically from booking to checkout.',
  },
]

const hybridPoints: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Cloud,
    title: 'Check In From Anywhere',
    description:
      'At dinner, at home, at the airport — open your phone and see exactly what is happening at your property right now.',
  },
  {
    icon: CloudOff,
    title: 'Works Without Internet',
    description:
      'Power cut? WiFi down? Your team keeps working. We install an offline copy on-site so operations never stop.',
  },
  {
    icon: RefreshCw,
    title: 'Syncs Itself Back Up',
    description:
      'When the connection returns, everything syncs automatically. No manual updates, no missing data, no drama.',
  },
]

export default function ChannelCloud() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100">
          <span className="inline-block bg-[#2020B4] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Mimi Channel
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Stop updating channels one by one
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Mimi Channel connects your rooms to the world. Update your availability once and every
            platform reflects it — no more manual syncing, no more overbooking scares.
          </p>
          <div className="space-y-5">
            {channelPoints.map((p) => (
              <div key={p.title} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#2020B4] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900">{p.title}: </span>
                  <span className="text-slate-500">{p.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#2020B4] rounded-3xl p-10">
          <h2 className="text-2xl font-bold text-white mb-2">
            What happens when the internet cuts out?
          </h2>
          <p className="text-blue-200 font-semibold mb-2">Nothing. You keep going.</p>
          <p className="text-blue-200 mb-8 leading-relaxed">
            Mimi runs in the cloud and offline at the same time. Your team is never stranded, and
            your data is never lost.
          </p>
          <div className="space-y-6">
            {hybridPoints.map((p) => {
              const Icon = p.icon
              return (
                <div key={p.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">{p.title}</p>
                    <p className="text-blue-200 text-sm leading-relaxed">{p.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
