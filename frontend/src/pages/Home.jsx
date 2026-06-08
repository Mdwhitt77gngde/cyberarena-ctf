import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const CATEGORIES = [
  {
    id: 'web',
    tag: 'WEB',
    name: 'Web Exploitation',
    description:
      'SQL injection, XSS, IDOR, broken authentication, and server-side vulnerabilities across real-world web scenarios.',
  },
  {
    id: 'crypto',
    tag: 'CRYPTO',
    name: 'Cryptography',
    description:
      'Break ciphers, analyze flawed protocols, and exploit weak implementations of classical and modern algorithms.',
  },
  {
    id: 'linux',
    tag: 'LINUX',
    name: 'Linux',
    description:
      'Privilege escalation, file permission abuse, shell scripting, and kernel-level system internals.',
  },
]

const STATS = [
  { value: '3', label: 'Challenge Categories' },
  { value: '3', label: 'Difficulty Levels' },
  { value: 'Live', label: 'Rankings Board' },
]

export default function Home() {
  const sectionRef = useRef(null)
  const [cardsVisible, setCardsVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const cardStyle = (index) => {
    if (!cardsVisible) {
      return { opacity: 0, transform: 'translateY(20px)' }
    }
    return {
      animation: 'slide-up 0.45s ease-out both',
      animationDelay: `${index * 0.1}s`,
    }
  }

  return (
    <main className="flex-1 bg-[#080d16]">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-32 pb-28">
        {/* Grid background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(74, 158, 255, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74, 158, 255, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '52px 52px',
          }}
        />
        {/* Radial glow */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(74, 158, 255, 0.1) 0%, transparent 65%)',
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Heading */}
          <h1 className="text-6xl sm:text-8xl font-bold tracking-tight leading-none">
            <span className="text-[#e0eaf8]">Cyber</span>
            <span className="text-[#4a9eff]">Arena</span>
          </h1>

          {/* Platform label — below heading */}
          <div className="inline-flex items-center gap-2.5 border border-[#1e3a5f] rounded-full px-4 py-1.5 mt-7 mb-9 bg-[#0a1628]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a9eff] dot-pulse" />
            <span className="text-xs font-medium text-[#4a9eff] tracking-widest uppercase font-mono">
              CTF Platform
            </span>
          </div>

          {/* Tagline */}
          <p className="text-base sm:text-lg text-[#6b82a0] mx-auto text-center leading-relaxed mb-16">
            A competitive platform to practice offensive security. Solve
            challenges, earn points, and climb the rankings.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3 flex-wrap mt-14 mb-10">
            <Link
              to="/challenges"
              className="px-7 py-2.5 rounded-md bg-[#4a9eff] text-[#080d16] text-sm font-semibold hover:bg-[#5aaeff] transition-colors duration-200"
            >
              Enter Arena
            </Link>
            <Link
              to="/leaderboard"
              className="px-7 py-2.5 rounded-md border border-[#1e2d47] text-sm font-medium text-[#6b82a0] hover:border-[#4a9eff] hover:text-[#e0eaf8] transition-all duration-200"
            >
              View Rankings
            </Link>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section ref={sectionRef} className="px-6 pt-10 pb-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-[#e0eaf8] uppercase tracking-widest font-mono mb-7">
            Challenge Categories
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CATEGORIES.map((cat, index) => (
              <div
                key={cat.id}
                className="relative border border-[#1e2d47] rounded-xl p-6 bg-[#0d1321] hover:border-[#2d4a7a] hover:bg-[#0f1628] transition-colors duration-300 group overflow-hidden"
                style={cardStyle(index)}
              >
                {/* Corner accent on hover */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      'radial-gradient(circle at top right, rgba(74, 158, 255, 0.08), transparent 70%)',
                  }}
                />

                <div className="mb-4">
                  <span className="text-xs font-bold tracking-widest text-[#4a9eff] font-mono">
                    {cat.tag}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#d0e0f5] mb-2.5 group-hover:text-[#e8f0fc] transition-colors duration-200">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#8899aa] leading-relaxed">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="border-t border-[#1e2d47] px-6 py-10">
        <div className="max-w-2xl mx-auto grid grid-cols-3 divide-x divide-[#1e2d47]">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center px-8">
              <div className="text-2xl font-bold text-[#4a9eff] font-mono mb-1 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-[#6b82a0] uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
