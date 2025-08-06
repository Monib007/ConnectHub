import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('No token found. Please login first.')
      setLoading(false)
      return
    }

    axios
      .get('http://localhost:5000/api/user/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setUser(res.data.user)
        setLoading(false)
      })
      .catch(err => {
        console.error('Dashboard fetch failed:', err)
        setError('Failed to fetch dashboard data.')
        setLoading(false)
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  if (loading) return <div>Loading your dashboard...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>👋 Welcome to Your Dashboard</h1>
      <div style={{ marginTop: '1rem' }}>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Bio:</strong> {user?.bio || 'No bio provided.'}</p>
      </div>

      <button 
        onClick={handleLogout} 
        style={{
          marginTop: '2rem',
          padding: '0.5rem 1rem',
          background: 'crimson',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  )
}

export default Dashboard
