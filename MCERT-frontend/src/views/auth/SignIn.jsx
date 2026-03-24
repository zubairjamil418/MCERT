import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

const SignIn = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(formData);
      if (success) {
        navigate('/admin/default'); // or wherever you want to redirect after login
      } else {
        setError('Sign in failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h2 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white text-center">
          Sign In
        </h2>
        <p className="mb-9 ml-1 text-base text-gray-600 dark:text-gray-400 text-center">
          Enter your email and password to sign in!
        </p>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div className="mb-6">
            <label 
              htmlFor="email" 
              className="text-sm text-navy-700 dark:text-white font-bold"
            >
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="mail@example.com"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
              required
            />
          </div>
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="text-sm text-navy-700 dark:text-white font-bold"
            >
              Password*
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
              required
            />
          </div>
          <div className="mb-4 flex items-center justify-between px-2">
            
          </div>
          <button
            type="submit"
            disabled={loading}
            className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Not registered yet?{' '}
              <Link 
                to="/auth/sign-up" 
                className="text-brand-500 hover:text-brand-600 font-medium"
              >
                Create an Account
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
