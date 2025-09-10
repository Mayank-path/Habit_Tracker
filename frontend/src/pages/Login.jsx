import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import axios from "../api/axios"

const Login = () => {
  const [email_id, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post("/auth/login",{
        email : email_id,
        password
      })
      
      login({
        userId: data.userId,
        token: data.token,
        email: email_id,
      });

      
        alert('Login successfull');
        navigate('/dashboard');
      
      
    } catch (err) {
      console.error(err);
      alert('Login request failed');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          value={email_id}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Login
        </button>
        <p className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
