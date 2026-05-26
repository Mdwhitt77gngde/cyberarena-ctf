import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChallengeCard from '../components/ChallengeCard'
import { challengeService } from '../services/challengeService'

const CATEGORIES = ['all', 'web', 'crypto', 'linux']
const DIFFICULTIES = ['all', 'easy', 'medium', 'hard']

export default function Challenges() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchChallenges() {
      setLoading(true)
      try {
        const data = await challengeService.getChallenges(
          category === 'all' ? null : category,
          difficulty === 'all' ? null : difficulty
        )
        setChallenges(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchChallenges()
  }, [category, difficulty])

  const filterBtnClass = (active) =>
    `text-xs px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer ${
      active
        ? 'bg-[#4a9eff] border-[#4a9eff] text-white'
        : 'border-[#1e2d47] text-[#4a6080] hover:border-[#4a9eff] hover:text-[#4a9eff]'
    }`

  return (
    <main className="flex-1 bg-[#0a0f1a] min-h-screen px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-[#e0eaf8] tracking-tight mb-1">
          Challenges
        </h1>
        <p className="text-sm text-[#4a6080]">
          Browse and solve CTF challenges to earn points
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-[#4a6080] uppercase tracking-wider">Category</span>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={filterBtnClass(category === c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-[#4a6080] uppercase tracking-wider">Difficulty</span>
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={filterBtnClass(difficulty === d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div className="text-sm text-[#4a6080]">Loading challenges...</div>
      )}
      {error && (
        <div className="text-sm text-red-400 p-4 rounded-lg bg-red-400/10 border border-red-400/20">
          {error}
        </div>
      )}
      {!loading && !error && challenges.length === 0 && (
        <div className="text-sm text-[#4a6080]">
          No challenges found. Try adjusting your filters.
        </div>
      )}
      {!loading && !error && challenges.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onClick={() => navigate(`/challenges/${challenge.id}`)}
            />
          ))}
        </div>
      )}
    </main>
  )
}