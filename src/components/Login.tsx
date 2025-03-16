import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    
    // If login is successful, navigate to home page
    if (success) {
      navigate('/', { replace: true });
    }
  };
  return (
    <div id="login-page" className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-4">
      <div id="header" className="text-center mb-8">
        <h1 id="page-title" className="text-3xl font-bold text-emerald-800">Automation Test</h1>
      </div>
      
      <div id="login-container" className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <form id="login-form" onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div id="username-container">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) clearError();
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Username"
                required
              />
            </div>
            
            <div id="password-container">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) clearError();
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Password"
                required
              />
            </div>
          </div>
          
          {error && (
            <div id="error-message" className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div id="submit-container">
            <button
              id="login-button"
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      
      <div id="credentials-container" className="mt-8 bg-gray-900 text-white p-6 rounded-lg w-full max-w-md">
        <div className="grid grid-cols-2 gap-4">
          <div id="username-list">
            <h3 className="text-lg font-mono mb-2">Accepted usernames are:</h3>
            <ul id="accepted-usernames" className="space-y-1 font-mono text-sm">
              <li>standard_user</li>
              <li>locked_out_user</li>
              <li>problem_user</li>
              <li>performance_glitch_user</li>
              <li>error_user</li>
              <li>visual_user</li>
            </ul>
          </div>
          <div id="password-info">
            <h3 className="text-lg font-mono mb-2">Password for all users:</h3>
            <p id="common-password" className="font-mono text-sm">secret_sauce</p>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default Login;
