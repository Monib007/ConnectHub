// src/components/Sidebar.jsx
import React from 'react'

const Sidebar = () => {
  return (
    <div style={{
      width: '200px',
      background: '#f4f4f4',
      height: '100vh',
      padding: '20px',
    }}>
      <h4>Sidebar</h4>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><a href="#">Dashboard</a></li>
        <li><a href="#">My Posts</a></li>
        <li><a href="#">Settings</a></li>
      </ul>
    </div>
  )
}

export default Sidebar
