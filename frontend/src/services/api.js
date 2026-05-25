const API_URL = import.meta.env.VITE_API_URL

export const authService = {
  async login(username, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || 'Login failed')
    return data
  },

  async register(username, email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || 'Registration failed')
    return data
  },
}
