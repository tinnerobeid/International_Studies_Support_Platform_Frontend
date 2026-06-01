'use client'
import Link from 'next/link'
import Image from 'next/image'
import { MapPinIcon, ClockIcon, BriefcaseIcon } from 'lucide-react'
import type { Job } from '@/types'
import { useLangStore } from '@/store/lang'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const TYPE_LABELS: Record<string, { en: string; sw: string }> = {
  FULL_TIME: { en: 'Full Time', sw: 'Wakati Wote' },
  PART_TIME: { en: 'Part Time', sw: 'Sehemu ya Wakati' },
  CONTRACT: { en: 'Contract', sw: 'Mkataba' },
  CASUAL: { en: 'Casual', sw: 'Kawaida' },
  INTERNSHIP: { en: 'Internship', sw: 'Mafunzo' },
  VOLUNTEER: { en: 'Volunteer', sw: 'Kujitolea' },
}

export default function JobCard({ job }: { job: Job }) {
  const { lang } = useLangStore()
  const title = lang === 'sw' && job.title_sw ? job.title_sw : job.title
  const typeLabel = TYPE_LABELS[job.employment_type]
  const type = lang === 'sw' ? typeLabel?.sw : typeLabel?.en

  return (
    <Link href={`/jobs/${job.slug}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-emerald-300 transition-all group">
        <div className="flex items-start gap-4">
          {/* Company logo */}
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {job.company_logo ? (
              <Image src={job.company_logo} alt={job.company_name} width={48} height={48} className="object-cover" />
            ) : (
              <BriefcaseIcon className="w-6 h-6 text-gray-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{job.company_name}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              {job.region_name && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPinIcon className="w-3 h-3" />
                  {typeof job.region_name === 'object'
                    ? (lang === 'sw' ? job.region_name.sw : job.region_name.en)
                    : job.region_name}
                </span>
              )}
              {type && (
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                  {type}
                </span>
              )}
              {job.cv_required && (
                <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  {lang === 'sw' ? 'CV Inahitajika' : 'CV Required'}
                </span>
              )}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            {job.salary_display ? (
              <p className="text-sm font-semibold text-gray-800">{job.salary_display}</p>
            ) : (
              <p className="text-xs text-gray-400">{lang === 'sw' ? 'Inayoweza kujadiliwa' : 'Negotiable'}</p>
            )}
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 justify-end">
              <ClockIcon className="w-3 h-3" />
              {dayjs(job.created_at).fromNow()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
