import { useState, useEffect } from 'react'

const RANK_COLORS = ['#f5b731', '#94a3b8', '#cd7f32']

export default function Leaderboard() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/users/leaderboard`
        )
        const data = await response.json()
        if (!response.ok) throw new Error(data.detail || 'Failed to fetch leaderboard')
        setPlayers(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  return (
    <main className="flex-1 bg-[#080d16] min-h-screen px-6 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#e0eaf8] tracking-tight mb-1.5">
            Leaderboard
          </h1>
          <p className="text-sm text-[#4a6080]">
            Top players ranked by total points earned
          </p>
        </div>

        {loading && (
          <div className="text-sm text-[#4a6080]">Loading leaderboard...</div>
        )}

        {error && (
          <div className="text-sm text-red-400 p-4 rounded-lg bg-red-400/8 border border-red-500/25">
            {error}
          </div>
        )}

        {!loading && !error && players.length === 0 && (
          <div className="text-sm text-[#4a6080]">
            No players on the leaderboard yet. Start solving challenges.
          </div>
        )}

        {!loading && !error && players.length > 0 && (
          <div className="border border-[#1e2d47] rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-6 py-3 bg-[#0a1220] border-b border-[#1e2d47]">
              <span className="col-span-1 text-xs text-[#4a6080] uppercase tracking-wider font-mono">
                Rank
              </span>
              <span className="col-span-8 text-xs text-[#4a6080] uppercase tracking-wider font-mono">
                Player
              </span>
              <span className="col-span-3 text-xs text-[#4a6080] uppercase tracking-wider font-mono text-right">
                Points
              </span>
            </div>

            {players.map((player, index) => (
              <div
                key={index}
                className="grid grid-cols-12 px-6 py-4 border-b border-[#1e2d47] last:border-0 hover:bg-[#0d1a2e] transition-colors duration-150"
              >
                {/* Rank */}
                <div className="col-span-1 flex items-center">
                  <span
                    className="text-sm font-bold font-mono"
                    style={{
                      color: index < 3 ? RANK_COLORS[index] : '#4a6080',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Player */}
                <div className="col-span-8 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#1a2640] border border-[#1e2d47] flex items-center justify-center text-xs font-bold text-[#4a9eff] font-mono">
                    {player.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-[#c8d8f0]">
                    {player.username}
                  </span>
                  {index === 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#1a1400] text-[#f5b731] border border-[#3a3000] font-mono tracking-wide">
                      Leader
                    </span>
                  )}
                </div>

                {/* Points */}
                <div className="col-span-3 flex items-center justify-end">
                  <span className="text-sm font-semibold text-[#a78bfa] font-mono">
                    {player.score} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
