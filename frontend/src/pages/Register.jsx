import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'

export default function Register() {
  const [fields, setFields] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  function validate() {
    const e = {}
    if (!fields.username.trim()) {
      e.username = 'Username is required'
    } else if (fields.username.trim().length < 3) {
      e.username = 'Username must be at least 3 characters'
    }
    if (!fields.email.trim()) {
      e.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      e.email = 'Enter a valid email address'
    }
    if (!fields.password) {
      e.password = 'Password is required'
    } else if (fields.password.length < 8) {
      e.password = 'Password must be at least 8 characters'
    }
    if (!fields.confirmPassword) {
      e.confirmPassword = 'Please confirm your password'
    } else if (fields.password !== fields.confirmPassword) {
      e.confirmPassword = 'Passwords do not match'
    }
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
      await authService.register(fields.username, fields.email, fields.password)
      const tokenData = await authService.login(fields.username, fields.password)
      login(tokenData.access_token, { username: fields.username, email: fields.email })
      navigate('/')
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field) =>
    `w-full px-3 py-2.5 text-sm rounded-md border bg-[#060c14] text-[#e0eaf8] outline-none transition-colors duration-200
    focus:border-[#4a9eff] placeholder:text-[#2e3f58]
    ${errors[field] ? 'border-red-500/60' : 'border-[#1e2d47]'}`

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 bg-[#080d16]">
      <div className="w-full max-w-sm">
        <div className="border border-[#1e2d47] rounded-xl p-8 bg-[#0d1321]">
          <h2 className="text-[#e0eaf8] text-xl font-semibold tracking-tight mb-1">
            Create account
          </h2>
          <p className="text-sm text-[#4a6080] mb-7">
            Join CyberArena and start competing
          </p>

          {serverError && (
            <p className="text-sm text-red-400 mb-5 p-3 rounded-md bg-red-400/8 border border-red-500/25">
              {serverError}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#6b82a0] uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={fields.username}
                onChange={handleChange}
                autoComplete="username"
                className={inputClass('username')}
                placeholder="choose a username"
              />
              {errors.username && (
                <span className="text-xs text-red-400">{errors.username}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#6b82a0] uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={fields.email}
                onChange={handleChange}
                autoComplete="email"
                className={inputClass('email')}
                placeholder="you@example.com"
              />
              {errors.email && (
                <span className="text-xs text-red-400">{errors.email}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#6b82a0] uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={fields.password}
                onChange={handleChange}
                autoComplete="new-password"
                className={inputClass('password')}
                placeholder="min. 8 characters"
              />
              {errors.password && (
                <span className="text-xs text-red-400">{errors.password}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#6b82a0] uppercase tracking-wider">
                Confirm password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={fields.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className={inputClass('confirmPassword')}
                placeholder="repeat your password"
              />
              {errors.confirmPassword && (
                <span className="text-xs text-red-400">{errors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-2.5 text-sm font-semibold rounded-md bg-[#4a9eff] text-[#080d16] hover:bg-[#5aaeff] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-[#4a6080]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#4a9eff] hover:text-[#5aaeff] transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
