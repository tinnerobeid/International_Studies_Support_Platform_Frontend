const highlights = [
  {
    value: 'PMS',
    label: 'Property Management System',
    description: 'Your whole hotel operation, in one place.',
  },
  {
    value: 'CRM',
    label: 'Guest Relationship Tools',
    description: 'Know your guests. Make them feel it.',
  },
  {
    value: 'CRS',
    label: 'Central Reservation System',
    description: 'Every channel, one inbox, zero overbookings.',
  },
  {
    value: '4-Week',
    label: 'Onboarding',
    description: 'Hands-on setup with real people, not a help doc.',
  },
]

export default function About() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block bg-[#2020B4] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              About Us
            </span>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">We are Insync Technologies</h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              We started Insync Technologies because we watched hotel owners drown in spreadsheets,
              disconnected systems, and avoidable double-bookings. We knew there had to be a better
              way, so we built it.
            </p>
            <p className="text-slate-500 leading-relaxed mb-8">
              <strong className="text-slate-800">Mimi App</strong> is that better way. It is not
              just software. It is the system we wish every hotel had from day one. Built to
              handle the full journey from the first booking all the way to the final invoice,
              without the headaches in between.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 bg-[#2020B4] hover:bg-[#1515A0] text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Get in Touch
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 border border-[#2020B4] text-[#2020B4] hover:bg-[#2020B4]/5 font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Explore the Product
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {highlights.map((card) => (
              <div
                key={card.value}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:border-[#2020B4]/30 hover:shadow-md transition-all"
              >
                <p className="text-2xl font-extrabold text-[#2020B4] mb-1">{card.value}</p>
                <p className="text-sm font-semibold text-slate-800 mb-2">{card.label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
