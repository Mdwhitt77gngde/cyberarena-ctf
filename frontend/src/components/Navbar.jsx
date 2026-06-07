import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { pathname } = useLocation()
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  function close() {
    setMenuOpen(false)
  }

  const linkClass = (path) =>
    `text-sm font-medium transition-colors duration-200 ${
      pathname === path
        ? 'text-[#4a9eff]'
        : 'text-[#6b82a0] hover:text-[#e0eaf8]'
    }`

  const mobileLinkClass = (path) =>
    `block text-sm font-medium px-4 py-3 rounded-lg transition-colors duration-200 ${
      pathname === path
        ? 'text-[#4a9eff] bg-[#0a1628]'
        : 'text-[#6b82a0] hover:text-[#e0eaf8] hover:bg-[#0d1321]'
    }`

  return (
    <nav className="w-full bg-[#080d16] border-b border-[#1e2d47] relative z-50">
      <div className="flex items-center justify-between px-6 h-14">
        {/* Logo */}
        <Link
          to="/"
          onClick={close}
          className="text-sm font-bold tracking-tight hover:opacity-80 transition-opacity duration-200"
          style={{ letterSpacing: '-0.01em' }}
        >
          <span className="text-[#e0eaf8]">Cyber</span>
          <span className="text-[#4a9eff]">Arena</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-7">
          <Link to="/" className={linkClass('/')}>Home</Link>
          <Link to="/challenges" className={linkClass('/challenges')}>Challenges</Link>
          <Link to="/leaderboard" className={linkClass('/leaderboard')}>Leaderboard</Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-[#6b82a0] hover:text-[#e0eaf8] transition-colors duration-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className={linkClass('/login')}>Login</Link>
              <Link
                to="/register"
                className="text-sm font-semibold px-4 py-1.5 rounded-md bg-[#4a9eff] text-[#080d16] hover:bg-[#5aaeff] transition-colors duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="sm:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span
            className="block w-5 h-px bg-[#8899aa] transition-all duration-250 origin-center"
            style={{
              transform: menuOpen ? 'translateY(8px) rotate(45deg)' : 'none',
            }}
          />
          <span
            className="block w-5 h-px bg-[#8899aa] transition-all duration-250"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-5 h-px bg-[#8899aa] transition-all duration-250 origin-center"
            style={{
              transform: menuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu sm:hidden border-t border-[#1e2d47] bg-[#080d16] px-4 pb-5 pt-3">
          <div className="flex flex-col gap-1">
            <Link to="/" onClick={close} className={mobileLinkClass('/')}>Home</Link>
            <Link to="/challenges" onClick={close} className={mobileLinkClass('/challenges')}>Challenges</Link>
            <Link to="/leaderboard" onClick={close} className={mobileLinkClass('/leaderboard')}>Leaderboard</Link>

            <div className="border-t border-[#1e2d47] mt-3 pt-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-left text-sm font-medium text-[#6b82a0] hover:text-[#e0eaf8] px-4 py-3 rounded-lg hover:bg-[#0d1321] transition-colors duration-200"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={close} className={mobileLinkClass('/login')}>Login</Link>
                  <Link
                    to="/register"
                    onClick={close}
                    className="block text-center text-sm font-semibold px-4 py-2.5 rounded-md bg-[#4a9eff] text-[#080d16] hover:bg-[#5aaeff] transition-colors duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
