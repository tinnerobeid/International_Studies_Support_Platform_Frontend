import Navbar from './ui/navbar'
import Hero from './ui/hero'
import About from './ui/about'
import Challenge from './ui/challenge'
import Solution from './ui/solution'
import ChannelCloud from './ui/channel-cloud'
import WhyMimi from './ui/why-mimi'
import Onboarding from './ui/onboarding'
import Footer from './ui/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <About />
      <Challenge />
      <Solution />
      <ChannelCloud />
      <WhyMimi />
      <Onboarding />
      <Footer />
    </div>
  )
}
