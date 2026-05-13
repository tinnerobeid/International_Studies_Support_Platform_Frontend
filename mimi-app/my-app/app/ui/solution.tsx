import { Calendar, FileText, Users, type LucideIcon } from 'lucide-react'

const solutionPoints = [
  {
    title: 'Guest Account Management',
    description:
      'Every charge, every request, every folio — tracked automatically so nothing falls through the cracks.',
  },
  {
    title: 'Activity Coordination',
    description:
      'Tours, spa bookings, dining — all tied to the guest room. Your team stays in sync without the back-and-forth.',
  },
  {
    title: 'Unified Command',
    description:
      'One screen. Everything you need. Whether you manage 10 rooms or 200, the picture is always clear.',
  },
]

const modules: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Calendar,
    title: 'Reservation Management',
    description:
      'Know exactly who is arriving, when, and what they asked for — without digging through notebooks or WhatsApp threads.',
  },
  {
    icon: FileText,
    title: 'Financial & Invoice Tracking',
    description:
      'Send clean, professional invoices that make your hotel look as polished as it is. No more handwritten receipts.',
  },
  {
    icon: Users,
    title: 'Client Management (CRM)',
    description:
      'Remember that guest who always asks for a quiet room? Mimi remembers it for you, so every return visit feels personal.',
  },
]

export default function Solution() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#2020B4]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Here is What We Built</h2>
            <p className="text-blue-200 font-semibold text-lg mb-6">
              Mimi Property Management System (PMS)
            </p>
            <p className="text-blue-100 leading-relaxed mb-10">
              We built Mimi App to be the one system your team actually wants to use. No training
              manuals the size of a novel. No months-long setup. Just{' '}
              <strong className="text-white">Central Reservations</strong>,{' '}
              <strong className="text-white">Property Management</strong>, and{' '}
              <strong className="text-white">Guest Relationship tools</strong> — all in one place,
              ready from day one.
            </p>
            <div className="space-y-4">
              {solutionPoints.map((s, i) => (
                <div key={s.title} className="flex items-start gap-4 bg-white/10 rounded-xl p-5">
                  <div className="w-8 h-8 bg-white text-[#2020B4] rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">{s.title}</p>
                    <p className="text-blue-200 text-sm leading-relaxed">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-blue-200 font-semibold uppercase tracking-widest text-xs mb-2">
              What is inside
            </p>
            {modules.map((mod) => {
              const Icon = mod.icon
              return (
                <div
                  key={mod.title}
                  className="bg-white rounded-2xl p-6 flex gap-4 items-start shadow-lg"
                >
                  <div className="w-12 h-12 bg-[#2020B4] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{mod.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{mod.description}</p>
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
