import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { pathname } = useLocation()
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const linkClass = (path) =>
    `text-sm font-medium transition-colors duration-150 ${
      pathname === path
        ? 'text-[var(--accent)]'
        : 'text-[var(--text)] hover:text-[var(--accent)]'
    }`

  return (
    <nav className="w-full  bg-[var(--code-bg)]">
      <div className="flex items-center justify-between px-6 h-17">
        <Link
          to="/"
          className="text-base font-semibold tracking-tight text-[var(--text-h)] hover:text-[var(--accent)] transition-colors duration-150"
        >
          CyberArena
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className={linkClass('/')}>
            Home
          </Link>
          <Link to="/challenges" className={linkClass('/challenges')}>
            Challenges
          </Link>
          <Link to="/leaderboard" className={linkClass('/leaderboard')}>
            Leaderboard
          </Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-150"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className={linkClass('/login')}>
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-1.5 rounded bg-[var(--accent)] text-white hover:opacity-90 transition-opacity duration-150"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
