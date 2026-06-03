import { useState, useEffect } from 'react'

export default function Leaderboard() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/leaderboard`
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

  const medals = ['🥇', '🥈', '🥉']

  return (
    <main className="flex-1 bg-[#0a0f1a] min-h-screen px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-[#e0eaf8] tracking-tight mb-1">
          Leaderboard
        </h1>
        <p className="text-sm text-[#4a6080]">
          Top players ranked by total points earned
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-sm text-[#4a6080]">Loading leaderboard...</div>
      )}

      {/* Error */}
      {error && (
        <div className="text-sm text-red-400 p-4 rounded-lg bg-red-400/10 border border-red-400/20">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && players.length === 0 && (
        <div className="text-sm text-[#4a6080]">
          No players on the leaderboard yet. Start solving challenges!
        </div>
      )}

      {/* Leaderboard Table */}
      {!loading && !error && players.length > 0 && (
        <div className="border border-[#1e2d47] rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-3 bg-[#0d1321] border-b border-[#1e2d47]">
            <span className="col-span-1 text-xs text-[#4a6080] uppercase tracking-wider">Rank</span>
            <span className="col-span-8 text-xs text-[#4a6080] uppercase tracking-wider">Player</span>
            <span className="col-span-3 text-xs text-[#4a6080] uppercase tracking-wider text-right">Points</span>
          </div>

          {/* Table Rows */}
          {players.map((player, index) => (
            <div
              key={index}
              className={`grid grid-cols-12 px-6 py-4 border-b border-[#1e2d47] last:border-0 transition-colors duration-150 hover:bg-[#0d1321] ${
                index === 0 ? 'bg-[#0a1a0a]' : ''
              }`}
            >
              {/* Rank */}
              <div className="col-span-1 flex items-center">
                {index < 3 ? (
                  <span className="text-lg">{medals[index]}</span>
                ) : (
                  <span className="text-sm text-[#4a6080] font-medium">
                    #{index + 1}
                  </span>
                )}
              </div>

              {/* Player */}
              <div className="col-span-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1a2640] flex items-center justify-center text-xs font-medium text-[#4a9eff]">
                  {player.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-[#c8d8f0]">
                  {player.username}
                </span>
                {index === 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#1a1000] text-[#f39c12] border border-[#3a2800]">
                    👑 Leader
                  </span>
                )}
              </div>

              {/* Points */}
              <div className="col-span-3 flex items-center justify-end">
                <span className="text-sm font-medium text-[#a78bfa]">
                  {player.score} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}