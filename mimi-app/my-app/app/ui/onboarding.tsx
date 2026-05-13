import { Phone, Mail, AtSign, ArrowRight } from 'lucide-react'

const weeks = [
  {
    label: 'Week 1',
    task: 'We move your existing data over carefully and set up your rooms and rates. You do not lift a finger.',
  },
  {
    label: 'Week 2',
    task: 'We train your team in person — real, hands-on training. Not a YouTube video and a "good luck."',
  },
  {
    label: 'Week 3',
    task: 'Run Mimi alongside your current system. We stay close and fix anything that needs adjusting.',
  },
  {
    label: 'Week 4',
    task: 'Full go-live. We are on call for anything that comes up, and we do not disappear after launch.',
  },
]

function WeekStep({ label, task, index, isLast }: { label: string; task: string; index: number; isLast: boolean }) {
  return (
    <div className="flex items-start gap-5">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 bg-[#2020B4] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 z-10">
          {index + 1}
        </div>
        {!isLast && <div className="w-0.5 h-10 bg-[#2020B4]/20 mt-1" />}
      </div>
      <div className="pb-8 pt-1.5">
        <p className="font-bold text-[#2020B4] mb-1">{label}</p>
        <p className="text-slate-600 leading-relaxed">{task}</p>
      </div>
    </div>
  )
}

function DemoCard() {
  return (
    <div id="demo" className="bg-[#2020B4] rounded-3xl p-10">
      <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">
        See It In Action
      </p>
      <h3 className="text-3xl font-bold text-white mb-4">Let us show you around</h3>
      <p className="text-blue-200 mb-8 leading-relaxed">
        Not sure if Mimi App is right for your property? Book a free demo and we will walk you
        through everything. No sales pressure — just an honest look at what we can do for you.
      </p>
      <a
        href="tel:+255742434540"
        className="inline-flex items-center justify-center gap-2 bg-white text-[#2020B4] hover:bg-blue-50 font-bold px-8 py-4 rounded-xl text-base transition-colors w-full mb-8"
      >
        Call Us Now
        <ArrowRight className="w-5 h-5" />
      </a>
      <div className="space-y-4 border-t border-white/20 pt-8">
        <a
          href="tel:+255742434540"
          className="flex items-center gap-3 text-blue-200 hover:text-white transition-colors"
        >
          <Phone className="w-4 h-4 flex-shrink-0" />
          <span>+255 742 434 540</span>
        </a>
        <a
          href="mailto:Contact@mimiapp.co.tz"
          className="flex items-center gap-3 text-blue-200 hover:text-white transition-colors"
        >
          <Mail className="w-4 h-4 flex-shrink-0" />
          <span>Contact@mimiapp.co.tz</span>
        </a>
        <div className="flex items-center gap-3 text-blue-200">
          <AtSign className="w-4 h-4 flex-shrink-0" />
          <span>@Mimiapp</span>
        </div>
      </div>
    </div>
  )
}

export default function Onboarding() {
  return (
    <section id="onboarding" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            We hold your hand the whole way
          </h2>
          <p className="text-slate-500 mb-10 leading-relaxed">
            Switching systems can feel scary. We get it. That is why we do not just hand you a
            login and disappear — we run a 4-week onboarding to make sure your team is confident
            and your property runs smoothly from day one.
          </p>
          <div>
            {weeks.map((w, i) => (
              <WeekStep key={w.label} label={w.label} task={w.task} index={i} isLast={i === weeks.length - 1} />
            ))}
          </div>
        </div>

        <DemoCard />
      </div>
    </section>
  )
}
