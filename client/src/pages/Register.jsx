import axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        bio: '',
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage(res.data.message || 'Registered successfully!');
      setFormData({ name: '', email: '', password: '', bio: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Register</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Bio (optional)</label>
          <textarea
            name="bio"
            className="form-control"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
    )
}

export default Register;