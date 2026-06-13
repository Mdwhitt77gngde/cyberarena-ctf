import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { challengeService } from '../services/challengeService'
import { useAuth } from '../context/AuthContext'

const TERMINAL_CATEGORIES = ['linux']

export default function ChallengeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [flag, setFlag] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [hints, setHints] = useState([])

  const useTerminal = challenge
    ? TERMINAL_CATEGORIES.includes(challenge.category?.toLowerCase())
    : false

  useEffect(() => {
    async function fetchChallenge() {
      try {
        const data = await challengeService.getChallengeById(id)
        setChallenge(data)
        setHints((data.hints || []).map((h) => ({ ...h, revealed: false })))
      } catch {
        navigate('/challenges')
      } finally {
        setLoading(false)
      }
    }
    fetchChallenge()
  }, [id, navigate])

  async function handleSubmit() {
    if (!flag.trim()) return
    try {
      const result = await challengeService.submitFlag(id, flag, token)
      setFeedback({ correct: result.correct, message: result.message })
    } catch (err) {
      setFeedback({ correct: false, message: err.message })
    }
  }

  function revealHint(index) {
    setHints((prev) =>
      prev.map((h, i) => (i === index ? { ...h, revealed: true } : h))
    )
  }

  if (loading) {
    return (
      <div className="flex-1 bg-[#0a0f1a] flex items-center justify-center">
        <span className="text-sm text-[#4a6080]">Loading challenge...</span>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[#0a0f1a] flex min-h-screen">
      {/* Left Panel */}
      <div className="w-72 border-r border-[#1e2d47] flex flex-col flex-shrink-0 overflow-y-auto">
        {/* Back */}
        <div className="p-4 border-b border-[#1e2d47]">
          <button
            onClick={() => navigate('/challenges')}
            className="text-xs text-[#4a6080] hover:text-[#4a9eff] flex items-center gap-1 transition-colors"
          >
            ← Back to Challenges
          </button>
        </div>

        {/* Challenge Info */}
        <div className="p-4 border-b border-[#1e2d47]">
          <h2 className="text-base font-medium text-[#e0eaf8] mb-3">
            {challenge?.title}
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#0a1a2e] text-[#4a9eff] border border-[#1e3a6a]">
              {challenge?.category}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1a1030] text-[#a78bfa] border border-[#2d1f5e]">
              {challenge?.points} pts
            </span>
          </div>
          <p className="text-xs text-[#8899aa] leading-relaxed whitespace-pre-line">
            {challenge?.description}
          </p>
          <div className="mt-3 p-3 bg-[#060c14] rounded-lg border border-[#1e2d47] font-mono text-xs text-[#4a9eff]">
            Flag format: CTF&#123;...&#125;
          </div>
        </div>

        {/* Hints */}
        {hints.length > 0 && (
          <div className="p-4 border-b border-[#1e2d47]">
            <span className="text-xs text-[#4a6080] uppercase tracking-wider block mb-3">
              Hints
            </span>
            <div className="flex flex-col gap-2">
              {hints.map((hint, i) => (
                <div
                  key={i}
                  className="bg-[#060c14] border border-[#1e2d47] rounded-lg p-3"
                >
                  {hint.revealed ? (
                    <p className="text-xs text-[#8899aa]">{hint.content}</p>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#4a6080]">
                        🔒 Hint {i + 1}
                      </span>
                      <button
                        onClick={() => revealHint(i)}
                        className="text-xs text-[#f39c12] bg-[#1a1000] border border-[#3a2800] px-2 py-0.5 rounded-full hover:bg-[#2a1a00] transition-colors"
                      >
                        -{hint.point_cost} pts
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flag Submission */}
        <div className="p-4">
          <span className="text-xs text-[#4a6080] uppercase tracking-wider block mb-3">
            Submit Flag
          </span>
          <div className="flex flex-col gap-2">
            <input
              value={flag}
              onChange={(e) => {
                setFlag(e.target.value)
                setFeedback(null)
              }}
              placeholder="CTF{...}"
              className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-[#060c14] border border-[#1e2d47] text-[#e0eaf8] outline-none focus:border-[#4a9eff] placeholder:text-[#2a3a50] transition-colors"
            />
            <button
              onClick={handleSubmit}
              className="w-full py-2 text-xs font-medium rounded-lg bg-[#4a9eff] text-white hover:opacity-90 transition-opacity"
            >
              Submit
            </button>
            {feedback && (
              <div
                className={`text-xs p-2 rounded-lg border flex items-center gap-2 ${
                  feedback.correct
                    ? 'bg-green-900/20 border-green-900 text-green-400'
                    : 'bg-red-900/20 border-red-900 text-red-400'
                }`}
              >
                {feedback.correct ? '✓' : '✗'} {feedback.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {useTerminal ? (
          <>
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 h-10 bg-[#0d1321] border-b border-[#1e2d47] flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e74c3c]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f39c12]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2ecc71]" />
                </div>
                <span className="text-xs text-[#4a6080] ml-2">
                  challenge-env — bash
                </span>
              </div>
              <span className="text-xs text-[#4a6080]">⚡ WebVM Terminal</span>
            </div>
            {/* WebVM iframe */}
            <div className="flex-1 bg-[#060c14]">
              <iframe
                src="https://webvm.io/?pass=1"
                className="w-full h-full border-0"
                style={{ minHeight: '500px' }}
                allow="cross-origin-isolated"
                title="CyberArena Linux Terminal"
              />
            </div>
          </>
        ) : (
          <>
            {/* Puzzle Header */}
            <div className="flex items-center justify-between px-4 h-10 bg-[#0d1321] border-b border-[#1e2d47] flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#4a6080]">🧩 Puzzle Challenge</span>
              </div>
              <span className="text-xs text-[#4a6080]">No terminal required</span>
            </div>
            {/* Puzzle Content */}
            <div className="flex-1 bg-[#0a0f1a] p-8 flex flex-col gap-6 overflow-y-auto">
              <div className="max-w-2xl">
                <h3 className="text-lg font-medium text-[#e0eaf8] mb-2">
                  Challenge Brief
                </h3>
                <p className="text-sm text-[#4a6080] leading-relaxed whitespace-pre-line">
                  {challenge?.description}
                </p>
              </div>

              <div className="max-w-2xl bg-[#0d1321] border border-[#1e2d47] rounded-xl p-6">
                <h3 className="text-sm font-medium text-[#e0eaf8] mb-4">
                  💡 How to solve this challenge
                </h3>
                <div className="flex flex-col gap-3 text-xs text-[#8899aa] leading-relaxed">
                  <p>1. Read the challenge description carefully on the left panel.</p>
                  <p>2. Use any tools you need — browser, online decoders, your own knowledge.</p>
                  <p>3. Once you find the flag, enter it in the Submit Flag box on the left.</p>
                  <p>4. All flags follow the format <span className="font-mono text-[#4a9eff]">CTF&#123;...&#125;</span></p>
                </div>
              </div>

              <div className="max-w-2xl bg-[#0d1321] border border-[#1e2d47] rounded-xl p-6">
                <h3 className="text-sm font-medium text-[#e0eaf8] mb-4">
                  🔧 Useful Tools
                </h3>
                <div className="flex flex-col gap-2 text-xs text-[#8899aa]">
                  <p>• <span className="text-[#4a9eff]">CyberChef</span> — gchq.github.io/CyberChef — decode Base64, ROT13, and more</p>
                  <p>• <span className="text-[#4a9eff]">Browser DevTools</span> — Press F12 to inspect page source and HTML</p>
                  <p>• <span className="text-[#4a9eff]">Base64 Decode</span> — base64decode.org</p>
                  <p>• <span className="text-[#4a9eff]">ROT13</span> — rot13.com</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}