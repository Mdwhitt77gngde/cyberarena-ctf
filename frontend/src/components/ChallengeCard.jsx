export default function ChallengeCard({ challenge, onClick }) {
  const difficultyStyles = {
    easy: 'bg-green-900/30 text-green-400 border border-green-900',
    medium: 'bg-yellow-900/30 text-yellow-400 border border-yellow-900',
    hard: 'bg-red-900/30 text-red-400 border border-red-900',
  }

  const categoryIcons = {
    web: '🌐',
    crypto: '🔐',
    linux: '🐧',
  }

  return (
    <div
      onClick={() => onClick(challenge)}
      className="cursor-pointer border border-[#1e2d47] rounded-xl p-5 bg-[#0d1321] hover:border-[#4a9eff] transition-all duration-150 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-[#c8d8f0] leading-snug">
          {challenge.title}
        </span>
        <span className="text-xs text-[#a78bfa] bg-[#1a1030] border border-[#2d1f5e] px-2 py-0.5 rounded-full whitespace-nowrap">
          {challenge.points} pts
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-[#4a6080]">
          {categoryIcons[challenge.category] || '🔒'} {challenge.category}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            difficultyStyles[challenge.difficulty] || difficultyStyles.easy
          }`}
        >
          {challenge.difficulty}
        </span>
      </div>

      <p className="text-xs text-[#4a6080] line-clamp-2 leading-relaxed">
        {challenge.description}
      </p>
    </div>
  )
}