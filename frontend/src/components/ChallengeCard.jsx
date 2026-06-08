export default function ChallengeCard({ challenge, onClick }) {
  const difficultyStyles = {
    easy: 'bg-emerald-900/25 text-emerald-400 border border-emerald-900/50',
    medium: 'bg-amber-900/25 text-amber-400 border border-amber-900/50',
    hard: 'bg-red-900/25 text-red-400 border border-red-900/50',
  }

  return (
    <div
      onClick={() => onClick(challenge)}
      className="cursor-pointer border border-[#1e2d47] rounded-xl p-5 bg-[#0d1321] hover:border-[#2d4a7a] hover:bg-[#0f1628] transition-all duration-300 flex flex-col gap-3 group"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold text-[#c8d8f0] leading-snug group-hover:text-[#e0eaf8] transition-colors duration-200">
          {challenge.title}
        </span>
        <span className="text-xs text-[#a78bfa] bg-[#1a1030] border border-[#2d1f5e] px-2 py-0.5 rounded-full whitespace-nowrap font-mono">
          {challenge.points} pts
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold tracking-widest text-[#4a9eff] font-mono uppercase">
          {challenge.category}
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
