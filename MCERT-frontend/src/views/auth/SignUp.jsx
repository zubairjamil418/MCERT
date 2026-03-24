import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}auth/sign-up`,
        {
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }
      );
      if (response.data.status !== 409 && response.data.status !== 400) {
        navigate("/auth/sign-in");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-16 mt-10 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h2 className="mb-2.5 text-center text-4xl font-bold text-navy-700 dark:text-white">
          Sign Up
        </h2>
        <p className="mb-9 ml-1 text-center text-base text-gray-600 dark:text-gray-400">
          Create your account to get started!
        </p>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="text-sm font-bold text-navy-700 dark:text-white"
            >
              Full Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="text-sm font-bold text-navy-700 dark:text-white"
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
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="text-sm font-bold text-navy-700 dark:text-white"
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
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-bold text-navy-700 dark:text-white"
            >
              Confirm Password*
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                required
                className="mr-2 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              <label
                htmlFor="terms"
                className="text-sm text-navy-700 dark:text-white"
              >
                I agree to the Terms and Conditions
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 disabled:opacity-50 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/auth/sign-in"
                className="font-medium text-brand-500 hover:text-brand-600"
              >
                Sign In
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
