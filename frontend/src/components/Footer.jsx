export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full  bg-[var(--code-bg)] mt-auto shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-center px-6 py-5">
        <span className="text-sm text-[var(--text)]">
          &copy; {year} CyberArena CTF Platform. All rights reserved.
        </span>
      </div>
    </footer>
  )
}
