const API_URL = import.meta.env.VITE_API_URL

export const challengeService = {
  async getChallenges(category = null, difficulty = null) {
    let url = `${API_URL}/challenges/`
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (difficulty) params.append('difficulty', difficulty)
    if (params.toString()) url += `?${params.toString()}`
    const response = await fetch(url)
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch challenges')
    return data
  },

  async getChallengeById(id) {
    const response = await fetch(`${API_URL}/challenges/${id}`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || 'Challenge not found')
    return data
  },

  async submitFlag(challengeId, flag, token) {
    const response = await fetch(`${API_URL}/challenges/${challengeId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ flag }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || 'Submission failed')
    return data
  },
}