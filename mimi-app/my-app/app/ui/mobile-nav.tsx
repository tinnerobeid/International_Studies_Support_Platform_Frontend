'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'About Us', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Why Mimi', href: '#why-mimi' },
  { label: 'Contact Info', href: '#demo' },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Toggle menu"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="absolute top-16 inset-x-0 bg-[#2020B4] border-b border-white/10 shadow-xl px-6 py-6 flex flex-col gap-4 z-50">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-blue-100 hover:text-white font-medium text-base transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-white/20 flex flex-col gap-3">
            <a
              href="#demo"
              className="bg-white text-[#2020B4] hover:bg-blue-50 font-bold px-4 py-2.5 rounded-lg text-center transition-colors"
              onClick={() => setOpen(false)}
            >
              Get a Free Demo
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
