
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: '', 
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      
      const payload =
        formData.identifier.includes('@')
          ? { email: formData.identifier, password: formData.password }
          : { username: formData.identifier, password: formData.password };

      const response = await API.post('/user/login', payload);
      console.log('Login response:', response.data);

      const token = response.data.jwt_token;
      if (token) {
        localStorage.setItem('token', token);
      }

      
      navigate('/employees');
    } catch (err) {
      console.error('Login error:', err);
      const msg =
        err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Login</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Email or Username:
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '8px 16px' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
