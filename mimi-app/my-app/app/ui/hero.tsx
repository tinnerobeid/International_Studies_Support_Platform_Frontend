import { ArrowRight } from 'lucide-react'

const statCards = [
  { label: 'Total Bookings', value: '600' },
  { label: 'Active Bookings', value: '400' },
  { label: 'Archive Rooms', value: '40' },
]

const recentBookings = [
  { name: 'Godfrey Kitambi', room: '201', status: 'Check-in' },
  { name: 'Alice Bob', room: '315', status: 'Reserved' },
  { name: 'Tina Obeid', room: '108', status: 'Check-out' },
]

const statusStyle: Record<string, string> = {
  'Check-in': 'bg-green-500/20 text-green-400',
  Reserved: 'bg-blue-400/20 text-blue-300',
  'Check-out': 'bg-amber-500/20 text-amber-400',
}

const revenueBarHeights = [40, 65, 45, 80, 55, 90, 70]

function DashboardMockup() {
  return (
    <div className="bg-[#0D0D7A] rounded-2xl shadow-2xl overflow-hidden border border-white/10">
      <div className="bg-[#1515A0] px-5 py-3 flex items-center justify-between border-b border-white/10">
        <span className="text-white font-bold text-sm">
          <span className="font-extrabold">mimi</span>
          <span className="font-light text-blue-300"> App</span>
        </span>
        <span className="text-xs text-blue-400 font-mono">Dashboard</span>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {statCards.map((card) => (
            <div key={card.label} className="bg-[#1515A0] rounded-xl p-3">
              <p className="text-xs text-blue-400 mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#1515A0] rounded-xl p-4">
          <p className="text-xs text-blue-400 mb-3 font-medium uppercase tracking-wide">
            Recent Bookings
          </p>
          <div className="space-y-2.5">
            {recentBookings.map((b) => (
              <div key={b.name} className="grid grid-cols-3 items-center text-xs gap-2">
                <span className="text-white font-medium truncate">{b.name}</span>
                <span className="text-blue-400 text-center">Room {b.room}</span>
                <span className={`px-2 py-0.5 rounded-full text-center ${statusStyle[b.status]}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1515A0] rounded-xl p-4">
          <p className="text-xs text-blue-400 mb-2 font-medium uppercase tracking-wide">
            Monthly Revenue
          </p>
          <div className="flex items-end gap-1 h-16">
            {revenueBarHeights.map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-white/20 rounded-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="pt-16 min-h-screen bg-[#2020B4] flex items-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-200 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            By INSYNC TECHNOLOGIES COMPANY LTD
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
            Transforming
            <br />
            Hospitality
            <br />
            <span className="text-blue-300">Through Automation</span>
          </h1>
          <p className="text-2xl font-light text-blue-100 mb-4 italic">
            Smart Hotel Management, Simplified.
          </p>
          <p className="text-blue-200 mb-10 leading-relaxed max-w-lg">
            Running a hotel should not feel like a second job. Mimi App takes the chaos out of
            daily operations so you and your team can focus on what actually matters — your guests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#demo"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#2020B4] hover:bg-blue-50 font-bold px-8 py-4 rounded-xl text-base transition-colors"
            >
              Get a Free Demo
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#challenge"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>

        <div className="hidden lg:block">
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}
