export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full bg-[#080d16] border-t border-[#1e2d47]">
      <div className="flex items-center justify-center px-6 py-5">
        <span className="text-xs text-[#4a6080] font-mono tracking-wide">
          &copy; {year} CyberArena CTF Platform
        </span>
      </div>
    </footer>
  )
}
