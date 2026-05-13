import MobileNav from './mobile-nav'

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'About Us', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Why Mimi', href: '#why-mimi' },
]

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
        <span className="text-[#2020B4] font-black text-lg leading-none">m.</span>
      </div>
      <span className="text-xl text-white">
        <span className="font-extrabold">mimi</span>
        <span className="font-light"> App</span>
      </span>
    </div>
  )
}

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#2020B4]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-blue-200 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="#demo" className="text-sm text-blue-200 hover:text-white transition-colors">
              Contact
            </a>
            <a
              href="#demo"
              className="text-sm font-semibold bg-white text-[#2020B4] hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
            >
              Get a Free Demo
            </a>
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  )
}
