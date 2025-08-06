import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const App = () => {
  
  return (
    <Router>
      <Routes>
        <Route path='/' element={<div>Public posts will be shown here</div>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </Router>
  )
}

export default App;