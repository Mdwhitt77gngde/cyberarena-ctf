import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'

export default function Login() {
  const [fields, setFields] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  function validate() {
    const e = {}
    if (!fields.username.trim()) e.username = 'Username is required'
    if (!fields.password) e.password = 'Password is required'
    return e
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setServerError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      const data = await authService.login(fields.username, fields.password)
      login(data.access_token, { username: fields.username })
      navigate('/')
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="border border-[var(--border)] rounded-lg p-8 bg-[var(--bg)]">
          <h2 className="text-[var(--text-h)] text-xl font-medium tracking-tight mb-6">
            Sign in
          </h2>

          {serverError && (
            <p className="text-sm text-red-400 mb-4 p-3 rounded bg-red-400/10 border border-red-400/20">
              {serverError}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[var(--text)] uppercase tracking-wide">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={fields.username}
                onChange={handleChange}
                autoComplete="username"
                className={`w-full px-3 py-2 text-sm rounded border bg-[var(--code-bg)] text-[var(--text-h)] outline-none transition-colors duration-150
                  focus:border-[var(--accent)] placeholder:text-[var(--text)]
                  ${errors.username ? 'border-red-400' : 'border-[var(--border)]'}`}
                placeholder="your username"
              />
              {errors.username && (
                <span className="text-xs text-red-400">{errors.username}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[var(--text)] uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={fields.password}
                onChange={handleChange}
                autoComplete="current-password"
                className={`w-full px-3 py-2 text-sm rounded border bg-[var(--code-bg)] text-[var(--text-h)] outline-none transition-colors duration-150
                  focus:border-[var(--accent)] placeholder:text-[var(--text)]
                  ${errors.password ? 'border-red-400' : 'border-[var(--border)]'}`}
                placeholder="your password"
              />
              {errors.password && (
                <span className="text-xs text-red-400">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-2 text-sm font-medium rounded bg-[var(--accent)] text-white hover:opacity-90 transition-opacity duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 text-sm text-center text-[var(--text)]">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-[var(--accent)] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
