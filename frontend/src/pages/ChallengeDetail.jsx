import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { challengeService } from '../services/challengeService'
import { useAuth } from '../context/AuthContext'

// Fake file systems per challenge id
const FILE_SYSTEMS = {
  default: {
    files: {
      'readme.txt': 'Welcome to the challenge.\nLook around carefully.',
      '.hidden': 'Getting warmer...\nFlag: CTF{k33p_d1gg1ng}',
      'notes.txt': 'Nothing useful here.',
    },
    visibleFiles: ['readme.txt', 'notes.txt'],
    hiddenFiles: ['.hidden'],
  },
}

export default function ChallengeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [flag, setFlag] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [termLines, setTermLines] = useState([
    { text: 'CyberArena Challenge Environment v1.0', cls: 'text-[#4a6080]' },
    { text: 'Type "help" for available commands.', cls: 'text-[#4a6080]' },
    { text: '', cls: '' },
  ])
  const [hints, setHints] = useState([])
  const termInputRef = useRef(null)
  const termBodyRef = useRef(null)

  const fs = FILE_SYSTEMS[id] || FILE_SYSTEMS.default

  useEffect(() => {
    async function fetchChallenge() {
      try {
        const data = await challengeService.getChallengeById(id)
        setChallenge(data)
        setHints(
          (data.hints || []).map((h) => ({ ...h, revealed: false }))
        )
      } catch {
        navigate('/challenges')
      } finally {
        setLoading(false)
      }
    }
    fetchChallenge()
  }, [id, navigate])

  useEffect(() => {
    if (termBodyRef.current) {
      termBodyRef.current.scrollTop = termBodyRef.current.scrollHeight
    }
  }, [termLines])

  function addLine(text, cls = 'text-[#8899aa]') {
    setTermLines((prev) => [...prev, { text, cls }])
  }

  function processCommand(cmd) {
    const c = cmd.trim().toLowerCase()
    addLine(`guest@cyberarena:~$ ${cmd}`, 'text-[#4a9eff]')

    if (c === 'help') {
      addLine('Commands: ls, ls -la, cat <file>, whoami, pwd, clear', 'text-[#8899aa]')
    } else if (c === 'whoami') {
      addLine('guest', 'text-[#8899aa]')
    } else if (c === 'pwd') {
      addLine('/home/guest', 'text-[#8899aa]')
    } else if (c === 'ls') {
      addLine(fs.visibleFiles.join('  '), 'text-[#8899aa]')
    } else if (c === 'ls -la' || c === 'ls -al') {
      fs.visibleFiles.forEach((f) =>
        addLine(`-rw-r--r-- guest  ${f}`, 'text-[#8899aa]')
      )
      fs.hiddenFiles.forEach((f) =>
        addLine(`-rw------- guest  ${f}`, 'text-[#2ecc71]')
      )
    } else if (c.startsWith('cat ')) {
      const fname = cmd.slice(4).trim()
      if (fs.files[fname]) {
        fs.files[fname]
          .split('\n')
          .forEach((line) =>
            addLine(
              line,
              fname.startsWith('.') ? 'text-[#2ecc71]' : 'text-[#8899aa]'
            )
          )
      } else {
        addLine(`cat: ${fname}: No such file or directory`, 'text-[#e74c3c]')
      }
    } else if (c === 'clear') {
      setTermLines([])
    } else {
      addLine(`bash: ${cmd}: command not found`, 'text-[#e74c3c]')
    }
  }

  function handleTermKey(e) {
    if (e.key !== 'Enter') return
    const val = e.target.value.trim()
    if (!val) return
    processCommand(val)
    e.target.value = ''
  }

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
          <p className="text-xs text-[#8899aa] leading-relaxed">
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

      {/* Terminal Panel */}
      <div className="flex-1 flex flex-col min-w-0">
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
          <span className="text-xs text-[#4a6080]">⚡ CyberArena Terminal</span>
        </div>

        {/* Terminal Body */}
        <div
          ref={termBodyRef}
          className="flex-1 bg-[#060c14] p-4 overflow-y-auto font-mono text-xs leading-relaxed"
          onClick={() => termInputRef.current?.focus()}
        >
          {termLines.map((line, i) => (
            <div key={i} className={line.cls}>
              {line.text}
            </div>
          ))}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#2ecc71] whitespace-nowrap">
              guest@cyberarena:~$
            </span>
            <input
              ref={termInputRef}
              onKeyDown={handleTermKey}
              className="bg-transparent border-none outline-none text-[#e0eaf8] font-mono text-xs flex-1 caret-[#4a9eff]"
              placeholder="type a command..."
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  )
}